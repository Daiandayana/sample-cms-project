// To generate random name
export const generateRandomName = () => {
  const randomString = Math.random().toString(36).substring(2);
  const newRandomName = `${randomString}`;
  return newRandomName;
};

// To calculate the file size
export const formatFileSize = (bytes) => {
  let formattedSize;
  if (bytes < 1024) {
    formattedSize = `${bytes.toFixed(0)} Bytes`;
  } else if (bytes < 1000 * 1000) {
    formattedSize = `${(bytes / 1024).toFixed(2)} KB`;
  } else {
    formattedSize = `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }

  return { formattedSize, actualSize: bytes };
};

export const acceptedFileExtensions = [
  ".pdf",
  ".html",
  ".js",
  ".css",
  ".ttf",
  ".png",
  ".jpg",
  ".jpeg",
];

export const fileTitles = [
  "PDF File",
  "HTML File",
  "JS File",
  "CSS File",
  "TTF File",
  "PNG Image File",
  "JPG Image File",
  "JPEG Image File",
];

// To double check the file format type
export const verifyFileNameWithEndingType = (fileName, fileCase) => {
  // const fileExtensions = [
  //   ".pdf",
  //   ".html",
  //   ".js",
  //   ".css",
  //   ".ttf",
  //   ".png",
  //   ".jpg",
  //   ".jpeg",
  // ];
  // const fileTitles = [
  //   "PDF File",
  //   "HTML File",
  //   "JS File",
  //   "CSS File",
  //   "TTF File",
  //   "PNG Image File",
  //   "JPG Image File",
  //   "JPEG Image File",
  // ];

  const randomName = generateRandomName();

  let returnTypeFormat, returnModalTitle, returnNewFileName;

  for (const [index, ext] of acceptedFileExtensions.entries()) {
    if (fileName.endsWith(ext)) {
      if (ext === ".png") {
        returnTypeFormat = acceptedFileExtensions[6];
      } else {
        returnTypeFormat = acceptedFileExtensions[index];
      }
      returnModalTitle = fileTitles[index];
      break;
    }
  }

  if (!returnTypeFormat) {
    console.log(
      `The filename '${fileName}' does not end with any of the specified extensions.`
    );
    return;
  }

  if (fileCase === "NewFileName, ModalTitle") {
    returnNewFileName = randomName + returnTypeFormat;
    return { returnNewFileName, returnModalTitle };
  } else if (fileCase === "TypeFormat") {
    return returnTypeFormat;
  }
};
