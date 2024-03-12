// CheckerUploadFileModal.js
import React from "react";

//Import MUI
import Dialog from "@mui/material/Dialog";
import { Box, Button, Typography } from "@mui/material";
import DialogTitle from "@mui/material/DialogTitle";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CallMinio from "../../../minio/service/CallMinio";
import AlertStore from "../../../stores/AlertStore";

const ApproveFileModal = ({
  openModal,
  closeModal,
  modalTitle,
  modalDesc,
  additionalData,
  loadServerContent,
}) => {
  const { renderAlert } = AlertStore();

  const uploadSingleFile = async (file, path) => {
    if (file) {
      try {
        const AwsSdkClient = CallMinio({
          accessKey: process.env.REACT_APP_ACCESS_KEY,
          secretKey: process.env.REACT_APP_SECRET_KEY,
        });

        const key = file.fileName;
        const previousKey = file.fileName;

        // Upload to real bucket
        await AwsSdkClient.copyObject({
          Bucket: process.env.REACT_APP_REAL_BUCKET,
          CopySource: `/${process.env.REACT_APP_TEMP_BUCKET}/${previousKey}`,
          Key: key,
        }).promise();

        // Remove from temporary bucket
        await AwsSdkClient.deleteObject({
          Bucket: process.env.REACT_APP_TEMP_BUCKET,
          Key: previousKey,
        }).promise();

        renderAlert("success", "Success", "File(s) uploaded successfully!");

        closeModal();
        loadServerContent();
      } catch (error) {
        console.error("Error moving single file:", error);
      }
    } else {
      console.log("Something went wrong at upload single file...");
    }
  };

  const uploadMultipleFiles = async (files) => {
    if (files.length > 0) {
      try {
        const AwsSdkClient = CallMinio({
          accessKey: process.env.REACT_APP_ACCESS_KEY,
          secretKey: process.env.REACT_APP_SECRET_KEY,
        });

        for (const file of files) {
          const key = file.fileName;
          const previousKey = file.fileName;

          // Upload to real bucket
          await AwsSdkClient.copyObject({
            Bucket: process.env.REACT_APP_REAL_BUCKET,
            CopySource: `/${process.env.REACT_APP_TEMP_BUCKET}/${previousKey}`,
            Key: key,
          }).promise();

          // Remove from temporary bucket
          await AwsSdkClient.deleteObject({
            Bucket: process.env.REACT_APP_TEMP_BUCKET,
            Key: previousKey,
          }).promise();

          renderAlert("success", "Success", "File(s) uploaded successfully!");
        }

        closeModal();
        loadServerContent();
      } catch (error) {
        console.error("Error moving multiple files:", error);
      }
    } else {
      console.log("Something went wrong at upload multiple files...");
    }
  };

  const verifyFilesUploadToServer = (items) => {
    if (items) {
      if (items.length > 0) {
        uploadMultipleFiles(items);
      } else {
        uploadSingleFile(items);
      }
    } else {
      console.log("Something went wrong at verify files upload to server...");
    }
  };

  return (
    <Dialog open={openModal} onClose={closeModal}>
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
            onClick={() => verifyFilesUploadToServer(additionalData)}
            sx={{ textTransform: "none" }}
          >
            Approve
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

export default ApproveFileModal;
