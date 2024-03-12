import React from "react";
import CallMinio from './../minio/service/CallMinio';
import TableWithAvatars from "../components/bucketComponents/tables/TableWithAvatars";

const BucketPage = () => {
  const [serverContents, setServerContents] = React.useState([]);

  const loadServerContents = React.useCallback(async () => {
    try {
      const fileFormatType = {
        ".pdf": "application/pdf",
        ".html": "text/html",
        ".js": "text/javascript",
        ".css": "text/css",
        ".ttf": "Unknown file type",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
      };

      const AwsSdkClient = CallMinio({
        accessKey: process.env.REACT_APP_ACCESS_KEY,
        secretKey: process.env.REACT_APP_SECRET_KEY,
      });

      const response = await AwsSdkClient.listObjectsV2({
        Bucket: process.env.REACT_APP_REAL_BUCKET,
      }).promise();

      const getContentList = await Promise.all(
        response.Contents.map(async (item) => {
          const fileExtension = item.Key.substring(item.Key.lastIndexOf("."));
          const contentType = fileFormatType[fileExtension.toLowerCase()];

          const signedUrl = AwsSdkClient.getSignedUrl("getObject", {
            Bucket: process.env.REACT_APP_REAL_BUCKET,
            Key: item.Key,
            ResponseContentType: contentType,
          });

          let additionalData = {};
          if (contentType.startsWith("image/")) {
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
              console.error(
                "Error fetching image or getting dimensions:",
                error
              );
            }
          }

          const AllFileFormatType = [
            ".pdf",
            ".html",
            ".js",
            ".css",
            ".ttf",
            ".jpg",
            ".jpeg",
          ];
          const DivideFileNameAndFolderPathDirectory = item.Key.split("/");
          let folderPathDirectory = "",
            fileName = "";

          for (const divide of DivideFileNameAndFolderPathDirectory) {
            if (AllFileFormatType.some((ext) => divide.endsWith(ext))) {
              fileName = (fileName || "") + divide;
            } else {
              folderPathDirectory = (folderPathDirectory || "") + divide + "/";
            }
          }

          const isFolder = DivideFileNameAndFolderPathDirectory[0];

          return {
            file: isFolder,
            fileName: fileName,
            folderPathDirectory: folderPathDirectory,
            fileType: contentType,
            fileSize: item.Size, // Set fileSize to 0 for folders
            url: signedUrl, // Set url to null for folders
            ...additionalData,
          };
        })
      );

      setServerContents(getContentList);
    } catch (error) {
      console.log("Error loading Server Content:", error);
    }
  }, []);

  React.useEffect(() => {
    loadServerContents();
  }, [loadServerContents]);

  return (
    <div>
      <TableWithAvatars tableItems={serverContents} />
    </div>
  );
};

export default BucketPage;
