// AppRoutes.js
import UploaderPage from "./../pages/UploaderPage";
import NotFoundPage from "./../pages/NotFoundPage";
import CheckerPage from "./../pages/CheckerPage";
import BucketPage from "./../pages/BucketPage";
import EditorPage from "./../pages/EditorPage";
import {
  BrowserNotSupported,
  CloudUpload,
  Home,
  ListAlt,
  RuleFolder,
  Storage,
} from "@mui/icons-material";

const AppRoutes = [
  {
    argument: "HomePage",
    label: "Home",
    path: "/",
    icon: <Home />,
    component: <UploaderPage />,
  },
  {
    argument: "NotFoundPage",
    label: "Not Found Page",
    path: "*",
    icon: <BrowserNotSupported />,
    component: <NotFoundPage />,
  },
  {
    argument: "UploaderPage",
    label: "Uploader Page",
    path: "/Uploader-Page",
    icon: <CloudUpload />,
    component: <UploaderPage />,
  },
  {
    argument: "CheckerPage",
    label: "Checker",
    path: "/Checker-Page",
    icon: <RuleFolder />,
    component: <CheckerPage />,
  },
  {
    argument: "BucketPage",
    label: "Bucket Page",
    path: "/Bucket-Page",
    icon: <Storage />,
    component: <BucketPage />,
  },
  {
    argument: "EditorPage",
    label: "Editor",
    path: "/Editor-Page",
    icon: <ListAlt />,
    component: <EditorPage />,
  },
];

export default AppRoutes;
