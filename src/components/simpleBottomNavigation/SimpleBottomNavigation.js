// SimpleBottomNavigation.js
import React from "react";
import AppRoutes from "../../utilities/AppRoutes";
import { BottomNavigation, BottomNavigationAction, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const SimpleBottomNavigation = () => {
  const [value, setValue] = React.useState(0);
  const navigate = useNavigate();

  const routes = AppRoutes.filter((path) =>
    ["UploaderPage", "CheckerPage", "BucketPage", "EditorPage"].includes(
      path.argument
    )
  );

  const handleNavigation = (index) => {
    setValue(index);
    navigate(routes[index].path);
  };

  return (
    <Box sx={{ width: 500 }}>
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, index) => {
          handleNavigation(index);
        }}
      >
        {routes.map((nav, index) => (
          <BottomNavigationAction
            key={index}
            label={nav.label}
            icon={nav.icon}
          />
        ))}
      </BottomNavigation>
    </Box>
  );
};

export default SimpleBottomNavigation;
