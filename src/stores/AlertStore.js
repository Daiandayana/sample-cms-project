// AlertStore.js
import { create } from "zustand";

const AlertStore = create((set) => ({
  alertStore: {
    visible: false,
    severity: "",
    title: "",
    description: "",
  },
  renderAlert: (severity, title, description) =>
    set({
      alertStore: {
        visible: true,
        severity: severity,
        title: title,
        description: description,
      },
    }),
  hideAlert: () =>
    set({
      alertStore: {
        visible: false,
        severity: "",
        title: "",
        description: "",
      },
    }),
}));

export default AlertStore;
