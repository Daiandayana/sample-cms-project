// UploaderPage.js
import React from "react";
import UploadFileCard from "../components/uploaderComponents/cards/UploadFileCard";
import TableWithEditAndDelete from "../components/uploaderComponents/tables/TableWithEditAndDelete";

const UploaderPage = () => {
  const [arraySelectedFiles, setArraySelectedFiles] = React.useState([]);
  return (
    <div className="Page Maker Content">
      <UploadFileCard setSelectedFiles={setArraySelectedFiles} />
      {arraySelectedFiles.length > 0 && (
        <TableWithEditAndDelete
          displayedFiles={arraySelectedFiles}
          modifyDisplayedFiles={setArraySelectedFiles}
        />
      )}
    </div>
  );
};

export default UploaderPage;
