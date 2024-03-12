// ModalsStore.js
import { create } from "zustand";

const ModalStore = create((set) => ({
  modalStore: {
    visible: false,
    argument: "",
    title: "",
    description: "",
    item: {} || [],
    index: 0,
  },
  renderModal: (argument, title, description, index, item) =>
    set({
      modalStore: {
        visible: true,
        argument: argument,
        title: title,
        description: description,
        index: index,
        item: item || {} || [],
      },
    }),
  hideModal: () =>
    set({
      modalStore: {
        visible: false,
        argument: "",
        title: "",
        description: "",
        index: 0,
        item: {} || [],
      },
    }),
}));

export default ModalStore;
