// MakerModalStore.js
import { create } from "zustand";

const MakerModalStore = create((set) => ({
  makerModalStore: {
    modalTitle: "",
    modalDesc: "",
    visibleSelectModal: false,
    visibleModifyModal: false,
    visibleUploadModal: false,
    visibleRemoveModal: false,
    index: 0,
  },
  openMakerSelectFileModal: (modalTitle) =>
    set({
      makerModalStore: {
        modalTitle: modalTitle,
        visibleSelectModal: true,
      },
    }),
  openMakerModifyFileModal: (modalTitle, index) =>
    set({
      makerModalStore: {
        modalTitle: modalTitle,
        visibleModifyModal: true,
        index: index,
      },
    }),
  openMakerUploadFileModal: (modalTitle, modalDesc) =>
    set({
      makerModalStore: {
        modalTitle: modalTitle,
        modalDesc: modalDesc,
        visibleUploadModal: true,
      },
    }),
  openMakerRemoveFileModal: (modalTitle, modalDesc, index) =>
    set({
      makerModalStore: {
        modalTitle: modalTitle,
        modalDesc: modalDesc,
        index: index,
        visibleRemoveModal: true,
      },
    }),
  closeMakerModal: () =>
    set({
      makerModalStore: {
        modalTitle: "",
        modalDesc: "",
        index: 0,
        visibleSelectModal: false,
        visibleModifyModal: false,
        visibleUploadModal: false,
        visibleRemoveModal: false,
      },
    }),
}));

export default MakerModalStore;
