// IndexModal.js
import React from "react";
import UploadFileModal from "./UploadFileModal";
import ModifyFileModal from "./ModifyFileModal";
import DeleteFileModal from "./DeleteFileModal";

const IndexModal = ({
  argument,
  renderModal,
  closeModal,
  title,
  description,
  index,
  item,
  setItem,
}) => {
  const renderModalComponent = () => {
    if (argument === "upload") {
      return (
        <UploadFileModal
          showModal={renderModal}
          closeModal={closeModal}
          modalTitle={title}
          modalDesc={description}
          displayedFiles={item}
          modifyDisplayedFiles={setItem}
        />
      );
    } else if (argument === "modify") {
      return  <ModifyFileModal
      showModal={renderModal}
      closeModal={closeModal}
      modalTitle={title}
      verifyFile={item}
      setVerifyFile={setItem}
      index={index}
    />;
    } else if (argument === "delete") {
      return (
        <DeleteFileModal
          showDangerModal={renderModal}
          closeDangerModal={closeModal}
          modalTitle={title}
          modalDesc={description}
          index={index}
          modifyDisplayedFiles={setItem}
        />
      );
    }
  };

  return renderModalComponent();
};

export default IndexModal;
