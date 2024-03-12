// TableWithCheckbox.js
import React from "react";

//Import MUI
import { Typography, Button, Box } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { DataGrid } from "@mui/x-data-grid";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloudDoneIcon from "@mui/icons-material/CloudDone";
import CancelIcon from "@mui/icons-material/Cancel";
import Tooltip from "@mui/material/Tooltip";

//Import MUI (for DataGrid to disable cell selection outline)
import { gridClasses } from "@mui/x-data-grid";
import ModalStore from "./../../../stores/ModalStore";
import { formatFileSize } from "../../../utilities/Utils";
import IndexModal from "./../modals/IndexModal";
import { ContentCopy } from "@mui/icons-material";
import AlertStore from "../../../stores/AlertStore";

const TableWithCheckbox = ({ displayFiles, loadServerContent }) => {
  const { modalStore, renderModal, hideModal } = ModalStore();
  const { renderAlert } = AlertStore();

  // const [selectAllFiles, setSelectedAllFiles] = React.useState(false);
  const [isFileSelected, setIsFileSelected] = React.useState(false);
  const [selectedRows, setSelectedRows] = React.useState();

  const handleUploadFile = (items) => {
    const filesToUpload = items.map((item) => ({ fileName: item.fileName }));

    renderModal(
      "approve",
      "Multiple Files Upload",
      `Upload this ${items.length} file to real server.`,
      0,
      filesToUpload
    );
  };

  const handleRemoveFile = (items) => {
    const filesToRemove = items.map((item) => ({ fileName: item.fileName }));

    renderModal(
      "reject",
      "Reject File(s)",
      `These ${items.length} selected file(s) will be removed from temporary server.`,
      0,
      filesToRemove
    );
  };

  const previewImageNewTab = (item) => {
    window.open(item.url, "_blank");
  };

  // Below is based on the columns 's field
  const rows = displayFiles.map((item, idx) => ({
    id: idx,
    name: item.fileName,
    actualSize: formatFileSize(item.fileSize).actualSize,
    type: item.fileType !== "" ? item.fileType : "Unknown File Type",
    dimension:
      item.imageWidth && item.imageHeight
        ? `${item.imageWidth}(w) x ${item.imageHeight}(h)`
        : "",

    url: item.url,
    // Must pass in the below data!!
    imageWidth: item.imageWidth,
    imageHeight: item.imageHeight,
    imageItem: item,
  }));

  const columns = [
    {
      field: "name",
      headerName: "File Name",
      width: 200,
      renderCell: (params) => {
        return (
          <>
            <Tooltip title={params.row.name} placement="bottom" arrow>
              <span
                style={{
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                }}
              >
                {params.row.name}
              </span>
            </Tooltip>
          </>
        );
      },
    },
    { field: "type", headerName: "File Type", width: 150 },
    {
      field: "actualSize",
      headerName: "File Size",
      width: 150,
      valueGetter: (params) => params.row.actualSize,
      renderCell: (params) => {
        let formattedSize;
        if (params.row.actualSize < 1024) {
          formattedSize = `${params.row.actualSize.toFixed(0)} Bytes`;
        } else if (params.row.actualSize < 1000 * 1000) {
          formattedSize = `${(params.row.actualSize / 1024).toFixed(2)} KB`;
        } else {
          formattedSize = `${(params.row.actualSize / (1024 * 1024)).toFixed(
            2
          )} MB`;
        }
        return <>{formattedSize}</>;
      },
    },

    { field: "dimension", headerName: "Image Dimension", width: 200 },
    {
      field: "action",
      headerName: "Action",
      width: 200,
      sortable: false,
      renderCell: (params) => (
        <>
          {params.row.imageWidth && params.row.imageHeight ? (
            <Button
              variant="outlined"
              color="success"
              startIcon={<VisibilityIcon />}
              onClick={() => previewImageNewTab(params.row.imageItem)}
            >
              Preview Image
            </Button>
          ) : (
            ""
          )}
        </>
      ),
    },
    {
      field: "action2",
      headerName: "",
      width: 450,
      sortable: false,
      hide: true,
      renderCell: (params) => (
        <>
          {!isFileSelected ? (
            <>
              <Button
                variant="outlined"
                startIcon={<CloudDoneIcon />}
                onClick={() => handleUploadFile([params.row.imageItem])}
              >
                Approve
              </Button>
              <Button
                color="error"
                variant="outlined"
                startIcon={<CancelIcon />}
                sx={{ marginLeft: 1 }}
                onClick={() => handleRemoveFile([params.row.imageItem])}
              >
                Reject
              </Button>
              <Button
                color="secondary"
                variant="outlined"
                startIcon={<ContentCopy />}
                sx={{ marginLeft: 1 }}
                onClick={() => copyUrl([params.row.url])}
              >
                Copy URL Link
              </Button>
            </>
          ) : null}
        </>
      ),
    },
  ];

  // For DataGrid checkbox selection function
  const onRowsSelectionHandler = (ids) => {
    const selectedRowsData = ids.map((id) => rows.find((row) => row.id === id));
    const selectedImageItems = selectedRowsData.map((row) => row.imageItem);

    setSelectedRows(selectedImageItems);
    setIsFileSelected(ids.length > 0);
  };

  const copyUrl = async (node) => {
    await navigator.clipboard.writeText(node);
    renderAlert("warning", "Content URL Link Detected", "Copy Link Success");
  };

  return (
    <>
      <Grid
        container
        spacing={2}
        alignItems={"center"}
        sx={{ marginBottom: 1 }}
      >
        <Grid xs={8} sx={{ textAlign: "left" }}>
          <Typography sx={{ fontWeight: "bold", fontSize: "1em" }}>
            Validation Checker
          </Typography>
          <Typography sx={{ fontSize: "1em" }}>
            {" "}
            Checker Role will validate the file before transfer to real bucket
          </Typography>
        </Grid>
      </Grid>

      <DataGrid
        rows={rows}
        columns={columns}
        autoHeight
        checkboxSelection
        disableRowSelectionOnClick={true}
        disableColumnFilter={true}
        disableColumnSelector={true}
        disableColumnMenu={true}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 10 },
          },
        }}
        pageSizeOptions={[5, 10, 25]}
        // Below sx is for making the cell selection outline gone
        sx={{
          ".MuiDataGrid-columnHeaders": {
            backgroundColor: "grey.100",
            fontSize: "1em",
          },
          // The below code is for aligning the overlay wrapper to center by adjusting the right margin automatically
          //else the No rows wording will be misalign!!
          "& .MuiDataGrid-overlayWrapper": {
            marginRight: "auto",
          },
          [`& .${gridClasses.cell}:focus, & .${gridClasses.cell}:focus-within`]:
            {
              outline: "none",
            },
          [`& .${gridClasses.columnHeader}:focus, & .${gridClasses.columnHeader}:focus-within`]:
            {
              outline: "none",
            },
        }}
        onRowSelectionModelChange={(items) => onRowsSelectionHandler(items)}
      />

      {isFileSelected && (
        <Box sx={{ marginTop: 2 }}>
          <Button
            variant="outlined"
            startIcon={<CloudDoneIcon />}
            onClick={() => handleUploadFile(selectedRows)}
          >
            Approve Selected File(s)
          </Button>{" "}
          <Button
            color="error"
            variant="outlined"
            startIcon={<CancelIcon />}
            sx={{ marginLeft: 1 }}
            onClick={() => handleRemoveFile(selectedRows)}
          >
            Reject Selected File(s)
          </Button>
        </Box>
      )}
      {modalStore.visible && (
        <IndexModal
          argument={modalStore.argument}
          renderModal={modalStore.visible}
          hideModal={hideModal}
          title={modalStore.title}
          description={modalStore.description}
          item={modalStore.item}
          loadData={loadServerContent}
        />
      )}
    </>
  );
};

export default TableWithCheckbox;
