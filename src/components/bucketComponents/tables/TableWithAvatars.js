// TableWithAvatars.js
import React from "react";

// Import Mui
import { Typography, Box, Button } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ImageIcon from "@mui/icons-material/Image";
import HtmlIcon from "@mui/icons-material/Html";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import FolderIcon from "@mui/icons-material/Folder";
import JavascriptIcon from "@mui/icons-material/Javascript";
import CssIcon from "@mui/icons-material/Css";

import { TreeView } from "@mui/x-tree-view/TreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import AlertStore from "../../../stores/AlertStore";

const TableWithAvatars = ({ tableItems }) => {
  const [toggleImage, setToggleImage] = React.useState(null);
  const [togglePdf, setTogglePdf] = React.useState(null);
  const [toggleCode, setToggleCode] = React.useState(null);
  const { renderAlert } = AlertStore();

  //for getting url from the selected nodes
  const [selectedNode, setSelectedNode] = React.useState();

  const copyUrl = async (node) => {
    if (node === undefined) {
      renderAlert("warning", "No Selected Content", "Copy URL Link uncomplete");
      return;
    }
    await navigator.clipboard.writeText(node.url);
    renderAlert(
      "warning",
      "Content URL Link Detected",
      "Copy URL Link complete"
    );
  };

  const buildTree = (items) => {
    const root = [];

    items.forEach((item) => {
      // Split the folderPathDirectory to get individual folders
      const pathParts = item.folderPathDirectory.split("/").filter(Boolean);
      let currentLevel = root;

      // Traverse or create the path in the tree
      pathParts.forEach((part) => {
        let existingPart = currentLevel.find((p) => p.name === part);

        if (!existingPart) {
          existingPart = { id: part, name: part, children: [] };
          currentLevel.push(existingPart);
        }

        currentLevel = existingPart.children;
      });

      // Add the file as a leaf node
      currentLevel.push({ ...item, id: item.fileName, name: item.fileName });
    });

    return root;
  };

  // Recursive function to render the tree
  const renderTreeItems = (nodes) => (
    <TreeItem
      key={nodes.id}
      nodeId={nodes.id}
      label={
        <Box
          sx={{ display: "flex", alignItems: "center" }}
          onClick={() => handleNodesClick(nodes)}
        >
          {nodes.fileType === "image/jpeg" || nodes.fileType === "image/png" ? (
            <>
              <ImageIcon sx={{ marginRight: "5px" }} />
              <span>{nodes.name}</span>
            </>
          ) : nodes.fileType === "text/html" ? (
            <>
              <HtmlIcon sx={{ marginRight: "5px" }} />
              <span>{nodes.name}</span>
            </>
          ) : nodes.fileType === "application/pdf" ? (
            <>
              <PictureAsPdfIcon sx={{ marginRight: "5px" }} />
              <span>{nodes.name}</span>
            </>
          ) : nodes.folderPathDirectory !== "" && nodes.fileType !== "" ? (
            <>
              <FolderIcon sx={{ marginRight: "5px" }} />
              <span>{nodes.name}</span>
            </>
          ) : nodes.fileType === "text/css" ? (
            <>
              <CssIcon sx={{ marginRight: "5px" }} />
              <span>{nodes.name}</span>
            </>
          ) : nodes.fileType === "text/javascript" ? (
            <>
              <JavascriptIcon sx={{ marginRight: "5px" }} />
              <span>{nodes.name}</span>
            </>
          ) : (
            <span>{nodes.name}</span>
          )}
        </Box>
      }
    >
      {Array.isArray(nodes.children)
        ? nodes.children.map((node) => renderTreeItems(node))
        : null}
    </TreeItem>
  );

  const handleNodesClick = async (node) => {
    setSelectedNode(node);
    console.log("SelectedNode:", node.url);
    if (node.fileType === "image/jpeg" || node.fileType === "image/png") {
      setToggleImage(node.url);
    } else if (node.fileType === "application/pdf") {
      setToggleImage(null);
      setTogglePdf(node.url);
    } else if (
      node.fileType === "text/html" ||
      node.fileType === "text/javascript" ||
      node.fileType === "text/css"
    ) {
      setToggleImage(null);
      setTogglePdf(null);

      const responseText = await fetch(node.url);
      const codeText = await responseText.text();
      setToggleCode(codeText);
    }
  };

  const treeData = buildTree(tableItems);

  return (
    <>
      <Grid
        container
        spacing={2}
        alignItems={"center"}
        sx={{ marginBottom: 1 }}
      >
        <Grid xs={8} sx={{ textAlign: "left" }}>
          <Typography sx={{ fontWeight: "bold", fontSize: "1em" }}>
            Real Bucket - Server Contents
          </Typography>
          <Typography sx={{ fontSize: "1em" }}>
            {" "}
            Last destination of object upload
          </Typography>
        </Grid>
      </Grid>

      <Box sx={{ width: "100%", display: "flex", flexDirection: "row" }}>
        <TreeView
          aria-label="file system navigator"
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
          sx={{ height: 500, flexGrow: 1, maxWidth: 400, overflowY: "auto" }}
        >
          {treeData.map((node) => renderTreeItems(node))}
        </TreeView>

        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Box
            className="previewContainer"
            sx={{
              marginLeft: 4,
              border: 0.5,
              borderRadius: 1,
              width: "900px",
              height: "500px",
              padding: 1,
              backgroundColor: "#f5f5f5", // Light background color
            }}
          >
            {toggleImage ? (
              <Box sx={{ width: "600px", height: "510px" }}>
                <img
                  src={toggleImage}
                  alt="Selected"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              </Box>
            ) : togglePdf ? (
              <Box sx={{ marginLeft: 4 }}>
                <iframe
                  title="PDF viewer"
                  src={togglePdf}
                  type="application/pdf"
                  style={{
                    border: "none",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                    borderRadius: "4px",
                    height: "500px",
                    width: "750px",
                  }}
                />
              </Box>
            ) : toggleCode ? (
              <Box
                sx={{
                  width: "600px",
                  height: "450px",
                  border: 1,
                  backgroundColor: "#f5f5f5",
                  boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                  borderRadius: "10px",
                  overflow: "auto",
                  textAlign: "left",
                  padding: 1,
                }}
              >
                <pre>
                  <code>{toggleCode}</code>
                </pre>
              </Box>
            ) : null}
          </Box>

          <Box
            sx={{
              display: "flex",
              marginLeft: 4,
              justifyContent: "space-between",
            }}
          >
            <Button>Remove from Bucket</Button>
            <Button onClick={() => copyUrl(selectedNode)}>Copy Url</Button>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default TableWithAvatars;
