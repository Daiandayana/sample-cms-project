import * as React from "react";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Stack from "@mui/material/Stack";

export default function AlertsCustom({ severity, title, description, close }) {
  // alert severity : success, info, warning, error
  return (
    <Stack sx={{ width: "38%" }} spacing={2}>
      <Alert
        severity={severity}
        sx={{
          marginTop: 3,
          marginBottom: 3,
          textAlign: "left",
        }}
        onClose={close}
      >
        <AlertTitle>{title}</AlertTitle>
        {description}
      </Alert>
    </Stack>
  );
}
