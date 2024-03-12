// FileIcons.js
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faFilePdf, faFileImage, faFileCode, faFileAlt, faFile } from '@fortawesome/free-solid-svg-icons';
import { verifyFileNameWithEndingType } from './Utils';



// Add the icons to the library
library.add(faFilePdf, faFileImage, faFileCode, faFileAlt, faFile);

const getFileIcon = (fileName) => {
    const fileValidate = verifyFileNameWithEndingType(fileName, 'TypeFormat');
    const iconFile = ['file-image', 'file-pdf', 'file-code'];

    let displayIconFile;

    if (fileValidate === '.jpg' || fileValidate === '.jpeg') {
        displayIconFile = iconFile[0];
    } else if (fileValidate === '.pdf') {
        displayIconFile = iconFile[1];
    } else if (fileValidate === '.html' || fileValidate === '.js' || fileValidate === '.css' || fileValidate === '.ttf') {
        displayIconFile = iconFile[2];
    } else {
        displayIconFile = 'file';
    }

    return {
        iconDisplay: <FontAwesomeIcon icon={['fas', displayIconFile]} className="w-8 h-8 rounded-full" />,
        iconType: fileValidate
    }
};

const FileIcons = ({ item, method }) => {
    const { iconDisplay, iconType } = getFileIcon(item);

    if (method === 'twoValues') {
        return (
            <div>
                {iconDisplay}
                <span>{iconType}</span>
            </div>
        );
    } else if (method === 'oneValue') {
        return (
            <div>
                {iconDisplay}
            </div>
        );
    }
}

export default FileIcons;