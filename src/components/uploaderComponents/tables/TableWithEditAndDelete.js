// TableWithAvatarsAndEditDelete
import React from "react";

//Import MUI
import { Divider, Typography, Button, Box } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import { DataGrid } from "@mui/x-data-grid";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

//Import MUI (for DataGrid to disable cell selection outline)
import { gridClasses } from "@mui/x-data-grid";
import { formatFileSize } from "../../../utilities/Utils";
import ModalStore from "./../../../stores/ModalStore";
import IndexModal from "../modals/IndexModal";

const TableWithEditAndDelete = ({ displayedFiles, modifyDisplayedFiles }) => {
  const { modalStore, renderModal, hideModal } = ModalStore();

  const previewImageNewTab = (item) => {
    const blob = new Blob([item.fileContent], { type: item.fileContent.type });
    const blobUrl = URL.createObjectURL(blob);

    window.open(blobUrl, "_blank");
  };

  // Below is based on the columns 's field
  const rows = displayedFiles.map((item, idx) => ({
    id: idx,
    name: item.fileName,
    // size: formatFileSize(item.fileContent.size).formattedSize,
    actualSize: formatFileSize(item.fileContent.size).actualSize,
    type:
      item.fileContent.type !== ""
        ? item.fileContent.type
        : "Unknown File Type",
    dimension:
      item.imageWidth && item.imageHeight
        ? `${item.imageWidth}(w) x ${item.imageHeight}(h)`
        : "",

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
    },
    { field: "type", headerName: "File Type", width: 200 },
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
      width: 200,
      sortable: false,
      hide: true,
      renderCell: (params) => (
        <>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={
              () =>
                renderModal("modify", "Selected File :", "", params.row.id, {})
              // openMakerModifyFileModal("Selected File :", params.row.id)
            }
          >
            Edit
          </Button>{" "}
          <Button
            color="error"
            variant="outlined"
            startIcon={<DeleteForeverIcon />}
            sx={{ marginLeft: 1 }}
            onClick={() =>
              renderModal(
                "delete",
                "Confirm File Removal",
                `Are you sure you want to remove the file named "${
                  displayedFiles[params.row.id].fileContent.name
                }"?`,
                params.row.id,
                {}
              )
            }
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <>
      <Divider sx={{ marginTop: 3, marginBottom: 3 }}></Divider>

      <Grid
        container
        spacing={2}
        alignItems={"center"}
        sx={{ marginBottom: 1 }}
      >
        <Grid xs={8} sx={{ textAlign: "left" }}>
          <Typography sx={{ fontWeight: "bold", fontSize: "1em" }}>
            First flow of system
          </Typography>
          <Typography sx={{ fontSize: "1em" }}>
            {" "}
            Maker role will select and modify the file before upload into
            temp-bucket
          </Typography>
        </Grid>

        <Grid
          xs={4}
          sx={{
            textAlign: "right",
          }}
        >
          <Button
            component="label"
            variant="contained"
            startIcon={<TaskAltIcon />}
            sx={{ textTransform: "none" }}
            size="large"
            onClick={() =>
              renderModal(
                "upload",
                "Upload Files to Server",
                `You have selected ${displayedFiles.length} file(s) for upload.`,
                0,
                {}
              )
            }
          >
            Upload File to Server
          </Button>
        </Grid>
      </Grid>

      <Box sx={{ width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          autoHeight
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
            [`& .${gridClasses.cell}:focus, & .${gridClasses.cell}:focus-within`]:
              {
                outline: "none",
              },
            [`& .${gridClasses.columnHeader}:focus, & .${gridClasses.columnHeader}:focus-within`]:
              {
                outline: "none",
              },
          }}
        />
      </Box>
      {modalStore.visible && (
        <IndexModal
          argument={modalStore.argument}
          renderModal={modalStore.visible}
          closeModal={hideModal}
          title={modalStore.title}
          description={modalStore.description}
          index={modalStore.index}
          item={displayedFiles}
          setItem={modifyDisplayedFiles}
        />
      )}
    </>
  );
};

export default TableWithEditAndDelete;
