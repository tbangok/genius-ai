import React from "react";

interface FileUploadProps {
  accept: string;
  [x: string]: any;
}

export const FileUpload: React.FC<FileUploadProps> = ({ accept, ...props }) => {
  return <input type="file" accept={accept} {...props} />;
};
