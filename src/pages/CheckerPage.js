// PageCheker.js
import React, { useState, useEffect, useCallback } from "react";
// import MUI
import { Box, Typography } from "@mui/material";
import AlertStore from "./../stores/AlertStore";
import TableWithCheckbox from "./../components/checkerComponents/tables/TableWithCheckbox";
import CallMinio from "./../minio/service/CallMinio";

const PageChecker = () => {
  const [serverContent, setServerContent] = useState([]);
  const { renderAlert } = AlertStore();

  const loadServerContent = useCallback(async () => {
    try {
      const AwsSdkClient = CallMinio({
        accessKey: process.env.REACT_APP_ACCESS_KEY,
        secretKey: process.env.REACT_APP_SECRET_KEY,
      });

      const response = await AwsSdkClient.listObjectsV2({
        Bucket: process.env.REACT_APP_TEMP_BUCKET,
      }).promise();

      const getContentList = await Promise.all(
        response.Contents.map(async (item) => {
          // Added ".png: "image/png" so can show the fileType of png else it will be undefined
          const fileExtensions = {
            ".pdf": "application/pdf",
            ".html": "text/html",
            ".js": "text/javascript",
            ".css": "text/css",
            ".ttf": "",
            ".jpg": "image/jpeg",
            ".jpeg": "image/jpeg",
            ".png": "image/png",
          };

          const fileExtension = item.Key.substring(item.Key.lastIndexOf("."));
          const contentType = fileExtensions[fileExtension.toLowerCase()];

          const signedUrl = AwsSdkClient.getSignedUrl("getObject", {
            Bucket: process.env.REACT_APP_TEMP_BUCKET,
            Key: item.Key,
            ResponseContentType: contentType,
          });

          let additionalData = {};

          // Below code works after adding (contentType && contentType.startsWith("image/")
          //Because if upload png file, it show undefined on the fileType
          if (contentType && contentType.startsWith("image/")) {
            try {
              const response = await fetch(signedUrl);
              const blob = await response.blob();

              const readImage = new Image();
              readImage.src = URL.createObjectURL(blob);
              await new Promise((resolve) => {
                readImage.onload = () => resolve();
              });

              additionalData = {
                imageWidth: readImage.width,
                imageHeight: readImage.height,
              };
            } catch (error) {
              renderAlert(
                "error",
                "Error fetching image or getting dimensions:",
                error
              );
            }
          }

          return {
            fileName: item.Key,
            fileType: contentType,
            fileSize: item.Size,
            url: signedUrl,
            checkboxStatus: false,
            ...additionalData,
          };
        })
      );

      setServerContent(getContentList);
    } catch (error) {
      renderAlert("error", "Error", "Error grabbing server content");
    }
  }, [renderAlert]);

  useEffect(() => {
    loadServerContent();
  }, [loadServerContent]);

  return (
    <div>
      <Box>
        <Typography variant="h4" gutterBottom sx={{ marginTop: 3 }}>
          Checker Role Page
        </Typography>
      </Box>

      {serverContent && (
        <TableWithCheckbox
          displayFiles={serverContent}
          setDisplayFiles={setServerContent}
          loadServerContent={loadServerContent}
        />
      )}
    </div>
  );
};

export default PageChecker;
