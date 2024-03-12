// EditorPage.js
import React from "react";
import { Editor } from "@tinymce/tinymce-react";
import { saveAs } from "file-saver";

const EditorPage = () => {
  let initialvalue = "Create your own a Websites";
  const [review, setReview] = React.useState("Welcome to TinyMCE!");

  const handleSaveAndPreview = () => {
    // Save content to HTML file
    saveContentAsHtml(review);
  };

  const saveContentAsHtml = (content) => {
    const blob = new Blob([content], { type: "text/html;charset=utf-8" });
    saveAs(blob, "preview.html");
  };

  return (
    <>
      <Editor
        apiKey="swrpy3683desmcrsordkrtjwsvx6uwiyl1f3cxyc403ykfje"
        init={{
          plugins:
            "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount linkchecker",
          toolbar:
            "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat",
        }}
        initialValue={initialvalue}
        onEditorChange={(modification) => {
          setReview(modification);
        }}
      />
      <button onClick={handleSaveAndPreview}>Save and Preview</button>
    </>
  );
};

export default EditorPage;
