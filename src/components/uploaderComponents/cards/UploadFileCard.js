// UploadFileCard.js
import React, { useRef, useState } from "react";

//import MUI
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import { Box, Button, Divider, Typography } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";

import {
  acceptedFileExtensions,
  verifyFileNameWithEndingType,
} from "./../../../utilities/Utils";
import AlertStore from "./../../../stores/AlertStore";
import SelectFileModal from "../modals/SelectFileModal";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const UploadFileCard = ({ setSelectedFiles }) => {
  const { renderAlert } = AlertStore();
  const [modalStatus, setModalStatus] = React.useState(false);

  const closeModal = () => {
    setModalStatus(false);
  };

  let fileInputRef = useRef(null);
  const [fileInputKey, setFileInputKey] = useState(0);

  // This is used by this file and ModalDialog.js file too
  const [verifyFileContent, setVerifyFileContent] = useState();

  const handleFileContent = async (event) => {
    const files = Array.from(event.target.files);

    if (files.length === 1) {
      const file = files[0];

      const verificationResult = verifyFileNameWithEndingType(
        file.name,
        "NewFileName, ModalTitle"
      );
      if (!verificationResult) {
        renderAlert(
          "error",
          "Error",
          "Only PDF, HTML, JS, CSS, TTF, PNG, JPG, JPEG file are allowed."
        );
        return;
      }

      const { returnNewFileName, returnModalTitle } = verificationResult;

      setVerifyFileContent({
        fileContent: file,
        fileName: returnNewFileName,
        fileModalTitle: returnModalTitle,
      });

      if (file.type === "image/png" || file.type === "image/jpeg") {
        const readImage = new Image();
        readImage.src = URL.createObjectURL(file);
        readImage.onload = () => {
          setVerifyFileContent((prevInfo) => ({
            ...prevInfo,
            imageWidth: readImage.width,
            imageHeight: readImage.height,
          }));
        };
      }
    } else if (files.length > 1) {
      const multipleVerifyFilesPromises = files.map((file) => {
        return new Promise((resolve, reject) => {
          const verificationResult = verifyFileNameWithEndingType(
            file.name,
            "NewFileName, ModalTitle"
          );
          if (!verificationResult) {
            renderAlert(
              "error",
              "Error",
              "Only PDF, HTML, JS, CSS, TTF, PNG, JPG, JPEG file are allowed."
            );
            reject();
          }
          const { returnNewFileName, returnModalTitle } = verificationResult;

          const multipleFileContent = {
            fileContent: file,
            fileName: returnNewFileName,
            fileModalTitle: returnModalTitle,
          };

          if (file.type === "image/png" || file.type === "image/jpeg") {
            const readImage = new Image();
            readImage.src = URL.createObjectURL(file);
            readImage.onload = () => {
              multipleFileContent.imageWidth = readImage.width;
              multipleFileContent.imageHeight = readImage.height;
              resolve(multipleFileContent);
            };
            readImage.onerror = reject;
          } else {
            resolve(multipleFileContent);
          }
        });
      });

      try {
        const multipleVerifyFiles = await Promise.all(
          multipleVerifyFilesPromises
        );
        setVerifyFileContent(multipleVerifyFiles);
        setSelectedFiles((prev) => [...prev, ...multipleVerifyFiles]);
      } catch (error) {
        console.error("Error loading image:", error);
      }
    }

    // Resetting input value to allow selecting the same file again
    fileInputRef.current.value = "";
    setFileInputKey((prevKey) => prevKey + 1);

    // Open modal if only one file is uploaded
    if (files.length === 1) {
      setModalStatus(true);
    }
  };

  //For drag the item to the drag and drop area, to prevent refresh the page
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  //For handling when the item is dropped(mouse click released)
  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files); // Convert FileList to Array
    if (files.length > 0) {
      const validFiles = files.filter((file) => {
        //Extracting the file extension of the file into lowercase
        const endExtensionFiles = file.name
          .slice(file.name.lastIndexOf("."))
          .toLowerCase();

        if (acceptedFileExtensions.includes(endExtensionFiles)) {
          return true;
        } else {
          renderAlert(
            "error",
            "Error",
            "Only PDF, HTML, JS, CSS, TTF, PNG, JPG, JPEG file are allowed."
          );
          return false;
        }
      });

      if (validFiles.length > 0) {
        // Below is used when standard file input selection mechanism is not used
        // such as drag and drop
        handleFileContent({ target: { files: validFiles } });
      }
    }
  };

  return (
    <Box
      sx={{
        width: 500,
        height: 175,
        borderRadius: 2,
        border: 2,
        borderColor: "text.secondary",
        borderStyle: "dashed",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <Box
        sx={{
          cursor: "pointer",
          textAlign: "center",
          "@media (min-width: 768px)": {
            padding: "32px", // Adjust as needed for larger screens
          },
        }}
      >
        <CloudUploadOutlinedIcon fontSize="large" color="primary" />
        <Typography variant="h6" gutterBottom>
          Drag & Drop single file here
        </Typography>
        <Divider sx={{ color: "grey", marginBottom: "16px" }}>or</Divider>
        <Button
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          startIcon={<CloudUploadIcon />}
        >
          Upload file
          <VisuallyHiddenInput
            key={fileInputKey}
            multiple
            id="file"
            ref={fileInputRef}
            type="file"
            onChange={handleFileContent}
            className="hidden"
            accept=".jpg, .png, .pdf, .html, .js, .ttf, .css, .jpeg"
          />
        </Button>
      </Box>
      {modalStatus && (
        <SelectFileModal
          showModal={modalStatus}
          closeModal={closeModal}
          modalTitle={"Selected File :"}
          verifyFile={verifyFileContent}
          setVerifyFile={setVerifyFileContent}
          setSelectedFiles={setSelectedFiles}
        />
      )}
    </Box>
  );
};

export default UploadFileCard;
