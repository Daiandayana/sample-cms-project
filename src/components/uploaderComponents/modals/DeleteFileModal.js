import React from "react";

//Import MUI
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";
import { Box, Button, Typography } from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";

const DeleteFileModal = ({
  showDangerModal,
  closeDangerModal,
  modalTitle,
  modalDesc,
  index,
  modifyDisplayedFiles,
}) => {
  const handleRemoveFile = (index) => {
    modifyDisplayedFiles((prevFiles) => {
      const newFiles = [...prevFiles];
      newFiles.splice(index, 1);
      return newFiles;
    });

    closeDangerModal();
  };

  return (
    <Dialog open={showDangerModal} onClose={closeDangerModal}>
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
      <DialogActions
        sx={{
          margin: "16px 16px 8px 16px",
          // Below is the same as above shorthand
          // marginTop: 2,
          // marginLeft: 2,
          // marginRight: 2,
          // marginBottom: 1,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Button
          variant="contained"
          color="error"
          onClick={() => handleRemoveFile(index)}
          sx={{ textTransform: "none" }}
        >
          Delete
        </Button>

        <Button
          variant="outlined"
          color="primary"
          onClick={closeDangerModal}
          sx={{ textTransform: "none" }}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteFileModal;
