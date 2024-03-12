// MakerUploadFileModal.js
import React from "react";

// Import MUI
import Dialog from "@mui/material/Dialog";
import { Box, Button, TextField, Typography } from "@mui/material";
import DialogTitle from "@mui/material/DialogTitle";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CallMinio from "../../../minio/service/CallMinio";
import AlertStore from "../../../stores/AlertStore";

const UploadFileModal = ({
  showModal,
  closeModal,
  modalTitle,
  modalDesc,
  displayedFiles,
  modifyDisplayedFiles,
}) => {
  // const { showAlertSuccess } = StoreAlertZustand();
  const { renderAlert } = AlertStore();
  const [modifyDestinationPath, setModifyDestinationPath] = React.useState("");

  const handleDestinationPathChange = (captureValue) => {
    if (captureValue || captureValue === "") {
      // Trim the start and end of the input
      let trimmedValue = captureValue.trim();

      // Ensure only one backslash at the beginning and end
      trimmedValue = trimmedValue.replace(/(^\/+)|(\/+$)/g, "/");

      setModifyDestinationPath(trimmedValue);
    }
  };

  const handleUploadToServer = async (path, files) => {
    if (files.length > 0) {
      try {
        const AwsSdkClient = CallMinio({
          accessKey: process.env.REACT_APP_ACCESS_KEY,
          secretKey: process.env.REACT_APP_SECRET_KEY,
        });

        for (const file of files) {
          const params = {
            Bucket: process.env.REACT_APP_TEMP_BUCKET,
            Key: `${path}/${file.fileName}`,
            Body: file.fileContent,
            ACL: "public-read",
            ContentType: file.fileContent.type,
          };

          const uploadProcess = AwsSdkClient.upload(params);

          await uploadProcess.promise().then(() => {
            renderAlert(
              "success",
              "Upload Successful",
              "File uploaded successfully"
            );
          });
        }
      } catch (error) {
        renderAlert(
          "error",
          "Error to upload",
          `File Upload Response: ${error}`
        );
      }

      modifyDisplayedFiles([]);
      closeModal();
    } else {
      renderAlert("warning", "E M P T Y", `Empty File`);
    }
  };

  return (
    <Dialog open={showModal} onClose={closeModal}>
      <DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <CheckCircleIcon color="success" />
          <Typography variant="h6" component="div" sx={{ marginLeft: 1 }}>
            {modalTitle}
          </Typography>
        </Box>
      </DialogTitle>

      <Box sx={{ width: 500, marginLeft: 3, marginRight: 3 }}>
        <Typography variant="body1" sx={{ marginBottom: 1 }}>
          {modalDesc}
        </Typography>

        <TextField
          name="FileName Field"
          type="text"
          value={modifyDestinationPath}
          onChange={(e) => handleDestinationPathChange(e.target.value)}
          placeholder="Example: testing/helloWorld/ .."
          sx={{ width: "100%" }}
        />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 2,
            marginBottom: 2,
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={() =>
              handleUploadToServer(modifyDestinationPath, displayedFiles)
            }
            sx={{ textTransform: "none" }}
          >
            Upload File(s)
          </Button>

          <Button
            variant="outlined"
            color="primary"
            onClick={closeModal}
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default UploadFileModal;
