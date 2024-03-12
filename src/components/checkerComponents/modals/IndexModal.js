// IndexModal.js
import React from "react";
import ApproveFileModal from "./ApproveFileModal";
import RejectFileModal from "./RejectFileModal";

const IndexModal = ({
  argument,
  renderModal,
  hideModal,
  title,
  description,
  item,
  loadData,
}) => {
  const renderModalComponent = () => {
    if (argument === "approve") {
      return (
        <ApproveFileModal
          openModal={renderModal}
          closeModal={hideModal}
          modalTitle={title}
          modalDesc={description}
          additionalData={item}
          loadServerContent={loadData}
        />
      );
    } else if (argument === "reject") {
      return (
        <RejectFileModal
          openModal={renderModal}
          closeModal={hideModal}
          modalTitle={title}
          modalDesc={description}
          additionalData={item}
          loadServerContent={loadData}
        />
      );
    }
  };

  return renderModalComponent();
};

export default IndexModal;
