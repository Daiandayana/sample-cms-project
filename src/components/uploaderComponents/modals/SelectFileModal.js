// ModalDialog.js
import React, { useState } from "react";

import imageFileResizer from "react-image-file-resizer";

// Import MUI
import Dialog from "@mui/material/Dialog";
import { Box, Button, Divider, TextField, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { formatFileSize, generateRandomName, verifyFileNameWithEndingType } from '../../../utilities/Utils';

const SelectFileModal = ({
  showModal,
  closeModal,
  modalTitle,
  verifyFile,
  setVerifyFile,
  setSelectedFiles,
}) => {
  const [modifyFileName, setModifyFileName] = useState("");
  const [modifyImageDimensionRatio, setModifyImageDimensionRatio] =
    useState("");
  const blob = new Blob([verifyFile.fileContent], {
    type: verifyFile.fileContent.type,
  });

  // insertNewName shall be undefined take noted if need improvement
  const handleModifyFileContentName = (nameType, insertNewName) => {
    if (nameType) {
      let emptyName = "";

      if (nameType === "randomName") {
        emptyName =
          generateRandomName() +
          verifyFileNameWithEndingType(
            verifyFile.fileContent.name,
            "TypeFormat"
          );

        setVerifyFile((prevInfo) => ({
          ...prevInfo,
          fileName: emptyName,
        }));

        setModifyFileName("");
      } else if (nameType === "specificName") {
        const displayName = insertNewName;

        if (insertNewName !== "" && insertNewName) {
          emptyName =
            insertNewName +
            verifyFileNameWithEndingType(
              verifyFile.fileContent.name,
              "TypeFormat"
            );

          setVerifyFile((prevInfo) => ({
            ...prevInfo,
            fileName: emptyName,
          }));
        } else {
          emptyName = insertNewName;

          setVerifyFile((prevInfo) => ({
            ...prevInfo,
            fileName: emptyName,
          }));
        }

        setModifyFileName(displayName);
      } else {
        console.log("Something error");
      }
    }
  };

  const handleModifyImageProportionSize = (ProportionRatio) => {
    if (ProportionRatio && ProportionRatio !== "") {
      const IntProportionRatio = parseInt(ProportionRatio);

      if (ProportionRatio >= 1 && ProportionRatio <= 500) {
        const { returnWidth, returnHeight } = calculateImageProportionDimension(
          verifyFile.imageWidth,
          verifyFile.imageHeight,
          IntProportionRatio
        );

        swapImageDimension(returnWidth, returnHeight);
      } else {
        alert("Invalid input. Please enter a number between 1 and 500.");
        ProportionRatio = "";
      }

      setModifyImageDimensionRatio(ProportionRatio);
    } else {
      setModifyImageDimensionRatio(ProportionRatio);
      swapImageDimension(0, 0);
    }
  };

  const swapImageDimension = (width, height) => {
    setVerifyFile((prevInfo) => ({
      ...prevInfo,
      newImageWidth: width,
      newImageHeight: height,
    }));
  };

  const calculateImageProportionDimension = (width, height, inputRatio) => {
    if (inputRatio) {
      // Determine the longest side
      const longestSide = Math.max(width, height);

      // Calculate the ratio between the custom size and the longest side
      const ratio = inputRatio / longestSide;

      // Use the ratio to calculate the resized width and height
      let newWidth = Math.floor(width * ratio);
      let newHeight = Math.floor(height * ratio);

      const longestModifySide = Math.max(newWidth, newHeight);
      const shortestModifySide = Math.min(newWidth, newHeight);

      let returnWidth, returnHeight;

      if (longestSide === width) {
        returnWidth = longestModifySide;
        returnHeight = shortestModifySide;
      } else {
        returnHeight = longestModifySide;
        returnWidth = shortestModifySide;
      }

      return {
        returnWidth: returnWidth,
        returnHeight: returnHeight,
      };
    }
  };

  // Please take note: selected image file will automatically convert into jpeg image and might have reading update inaccurately
  const handleSelectedFile = async () => {
    if (verifyFile) {
      if (verifyFile.fileName === "") {
        alert(
          "The New File Name cannot be empty if lazy naming file just put it random"
        );
        return;
      }

      if (
        verifyFile.fileContent.type === "image/jpeg" ||
        verifyFile.fileContent.type === "image/png"
      ) {
        const { returnWidth, returnHeight } =
          validateImageDimension(verifyFile);

        imageFileResizer.imageFileResizer(
          verifyFile.fileContent,
          returnWidth,
          returnHeight,
          "jpeg",
          100,
          0,
          (convertedFile) => {
            const readFile = new Image();
            readFile.src = URL.createObjectURL(convertedFile);
            readFile.onload = () => {
              const updatedFileContent = new File(
                [convertedFile],
                verifyFile.fileName,
                { type: "image/jpeg" }
              );

              setSelectedFiles((prevFiles) => [
                ...prevFiles,
                {
                  fileContent: updatedFileContent,
                  fileModalTitle: verifyFile.fileModalTitle,
                  fileName: verifyFile.fileName,
                  imageWidth: readFile.width,
                  imageHeight: readFile.height,
                },
              ]);
            };
          },
          "file",
          returnWidth,
          returnHeight
        );
      } else {
        const updatedFileContent = new File(
          [verifyFile.fileContent],
          verifyFile.fileName,
          { type: verifyFile.fileContent.type }
        );

        setSelectedFiles((prevFiles) => [
          ...prevFiles,
          {
            fileContent: updatedFileContent,
            fileName: verifyFile.fileName,
            fileModalTitle: verifyFile.fileModalTitle,
          },
        ]);
      }

      closeModal();
    }
  };

  const validateImageDimension = (validateFile) => {
    let returnWidth, returnHeight;
    if (validateFile) {
      if (
        validateFile.newImageHeight !== undefined &&
        validateFile.newImageWidth !== undefined
      ) {
        returnWidth = validateFile.newImageWidth;
        returnHeight = validateFile.newImageHeight;
      } else {
        returnWidth = validateFile.imageWidth;
        returnHeight = validateFile.imageHeight;
      }

      return {
        returnWidth: returnWidth,
        returnHeight: returnHeight,
      };
    }
  };

  const isImage = (modalTitle) => {
    const modalExtensions = [
      "PNG Image File",
      "JPG Image File",
      "JPEG Image File",
    ];
    return modalExtensions.includes(modalTitle);
  };

  return (
    <Dialog open={showModal} onClose={closeModal}>
      <Box
        sx={{
          width: 550,
          borderRadius: 4,
          padding: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 1,
          }}
        >
          <Typography variant="h5">
            {modalTitle + " " + verifyFile.fileModalTitle}
          </Typography>
          <Button onClick={() => closeModal()}>
            <CloseIcon />
          </Button>
        </Box>

        <Divider />

        <Box sx={{ marginTop: 1, marginBottom: 2 }}>
          {isImage(verifyFile.fileModalTitle) && (
            <Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  marginBottom: 2,
                }}
              >
                <Typography>Image Reference:</Typography>
                <img
                  src={URL.createObjectURL(blob)}
                  alt="Converted"
                  style={{ maxWidth: "100px", maxHeight: "100px" }}
                />
                <Typography>
                  Image Size: {verifyFile.imageWidth}(w) x{" "}
                  {verifyFile.imageHeight}(h)
                </Typography>

                {modifyImageDimensionRatio && (
                  <Box>
                    <Typography>
                      New Image Size: {verifyFile.newImageWidth}(w) x{" "}
                      {verifyFile.newImageHeight}(h)
                    </Typography>
                  </Box>
                )}
              </Box>

              <Typography>Adjust the image size proportionally</Typography>

              <TextField
                name="SizeRatio Field"
                type="number"
                value={modifyImageDimensionRatio}
                onChange={(e) =>
                  handleModifyImageProportionSize(e.target.value)
                }
                placeholder="Enter new image size here.."
                sx={{ width: "100%" }}
              />

              {modifyImageDimensionRatio && (
                <Button
                  variant="contained"
                  size="sm"
                  sx={{ textTransform: "none", marginTop: 1 }}
                  onClick={() =>
                    swapImageDimension(
                      verifyFile.newImageHeight,
                      verifyFile.newImageWidth
                    )
                  }
                >
                  Switch Dimension Size
                </Button>
              )}
            </Box>
          )}
        </Box>

        {isImage(verifyFile.fileModalTitle) ? <Divider /> : null}

        <Box sx={{ marginTop: 2, marginBottom: 2 }}>
          <Typography>
            <b>Current File Name: </b>
            {verifyFile.fileContent.name}
          </Typography>
          <Typography>
            <b>New File Name: </b>
            {verifyFile.fileName}
          </Typography>

          <TextField
            name="FileName Field"
            type="text"
            value={modifyFileName}
            onChange={(e) =>
              handleModifyFileContentName("specificName", e.target.value)
            }
            placeholder="Enter custom name here.."
            sx={{ width: "100%" }}
          />

          <Button
            size="sm"
            variant="contained"
            sx={{ textTransform: "none", marginTop: 1 }}
            onClick={() =>
              handleModifyFileContentName("randomName", verifyFile.name)
            }
          >
            Generate Random Name
          </Button>
        </Box>

        <Divider />

        <Box sx={{ marginTop: 2, marginBottom: 2 }}>
          <Typography>File Type: {verifyFile.fileContent.type}</Typography>
          <Typography>
            File Size:{" "}
            {formatFileSize(verifyFile.fileContent.size).formattedSize}
          </Typography>
        </Box>

        <Divider />

        <Box
          sx={{
            marginTop: 2,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Button
            variant="contained"
            onClick={handleSelectedFile}
            sx={{ textTransform: "none" }}
          >
            Select This File
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() => closeModal()}
            sx={{ textTransform: "none" }}
          >
            Close
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default SelectFileModal;
