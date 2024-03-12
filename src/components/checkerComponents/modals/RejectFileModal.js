// CheckerRemoveFileModal.js
import React from "react";

// Import MUI
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import { Box, Button, Typography } from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";
import CallMinio from "../../../minio/service/CallMinio";
import AlertStore from "../../../stores/AlertStore";

const RejectFileModal = ({
  openModal,
  closeModal,
  modalTitle,
  modalDesc,
  additionalData,
  loadServerContent,
}) => {
  const { renderAlert } = AlertStore();
  const removeSingleFile = async (item) => {
    if (item) {
      try {
        const AwsSdkClient = CallMinio({
          accessKey: process.env.REACT_APP_ACCESS_KEY,
          secretKey: process.env.REACT_APP_SECRET_KEY,
        });

        await AwsSdkClient.deleteObject({
          Bucket: process.env.REACT_APP_TEMP_BUCKET,
          Key: item.fileName,
        }).promise();

        renderAlert(
          "error",
          "Removed successfully!",
          "File(s) removed successfully!"
        );

        closeModal();
        loadServerContent();
      } catch (error) {
        console.error("Error removing image:", error);
      }
    } else {
      console.log("Something went wrong at upload single file...");
    }
  };

  const removeMultipleFiles = async (files) => {
    if (files.length > 0) {
      try {
        const AwsSdkClient = CallMinio({
          accessKey: process.env.REACT_APP_ACCESS_KEY,
          secretKey: process.env.REACT_APP_SECRET_KEY,
        });

        for (const file of files) {
          const key = file.fileName;

          await AwsSdkClient.deleteObject({
            Bucket: process.env.REACT_APP_TEMP_BUCKET,
            Key: key,
          }).promise();

          renderAlert(
            "error",
            "Removed successfully!",
            "File(s) removed successfully!"
          );
        }

        closeModal();
        loadServerContent();
      } catch (error) {
        console.error("Error removing files:", error);
      }
    } else {
      console.log("Something went wrong at remove multiple files...");
    }
  };

  const verifyFilesRemoveFromServer = (item) => {
    if (item) {
      if (item.length > 0) {
        removeMultipleFiles(item);
      } else {
        removeSingleFile(item);
      }
    } else {
      console.log("Something went wrong at verify files remove from server...");
    }
  };

  return (
    <Dialog open={openModal} onClose={closeModal}>
      <DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <WarningIcon color="error" />
          <Typography variant="h6" component="div" sx={{ marginLeft: 1 }}>
            {modalTitle}
          </Typography>
        </Box>
      </DialogTitle>

      <Typography variant="body1" sx={{ margin: "0 24px 24px" }}>
        {modalDesc} <br /> This action cannot be{" "}
        <span style={{ color: "red", fontWeight: "bold" }}>undone</span>.
      </Typography>

      <Box sx={{ width: 500, marginLeft: 3, marginRight: 3 }}>
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
            color="error"
            onClick={() => verifyFilesRemoveFromServer(additionalData)}
            sx={{ textTransform: "none" }}
          >
            Reject
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

export default RejectFileModal;
