import { useState } from "react";

export default function useSelectFile() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);

  const onSelectedFile = (event) => {
    const file = event.target.files[0];

    if (file && file.type.startsWith("video/")) {
      setSelectedFile(file);
      setFilePreview(URL.createObjectURL(file)); // Generate a preview URL
    } else {
      alert("Please select a valid video file.");
    }
  };

  return { selectedFile, setSelectedFile, onSelectedFile, filePreview };
}