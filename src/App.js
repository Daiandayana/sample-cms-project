import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppRoutes from "./utilities/AppRoutes";
import AlertsStore from "./stores/AlertStore";
import SimpleBottomNavigation from "./components/simpleBottomNavigation/SimpleBottomNavigation";
import AlertsCustom from "./components/alertCustom/AlertCustom";
import { Box } from "@mui/material";

function App() {
  const { alertStore, hideAlert } = AlertsStore();

  React.useEffect(() => {
    if (alertStore.visible) {
      const timeoutId = setTimeout(() => {
        hideAlert();
      }, 2500);

      return () => clearTimeout(timeoutId);
    }
  }, [alertStore, hideAlert]);

  return (
    <Router>
      <div className="App" align="center">
        <div>
          <SimpleBottomNavigation />
        </div>
        <div className="Alerts Area">
          {alertStore.visible && (
            <AlertsCustom
              severity={alertStore.severity}
              title={alertStore.title}
              description={alertStore.description}
              close={hideAlert}
            />
          )}
        </div>
        <div className="Routepaths">
          <Box
            sx={{
              // maxWidth: "1400px",
              mx: 2,
              px: 3,
              marginBottom: 12,
              "@media (min-width: 768px)": {
                px: 5,
              },
            }}
          >
            <Routes>
              {AppRoutes.map(({ argument, path, component }) => (
                <Route key={argument} path={path} element={component} />
              ))}
            </Routes>
          </Box>
        </div>
      </div>
    </Router>
  );
}

export default App;
