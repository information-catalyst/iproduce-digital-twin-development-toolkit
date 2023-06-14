import { useState } from "react";
import "./file-upload.css";
import { useRef } from "react";
import { useDispatch } from "react-redux";
import Alert from "../alert/alert";

function FileUploader({
  handleContentUpload,
  handleFileName,
  instanceId,
  type,
  extensions,
}) {
  const dispatch = useDispatch();
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);
  const [fileName, setFileName] = useState("");
  const [isOpenAlert, setIsOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertTitle, setAlertTitle] = useState("");
  const [alertType, setAlertType] = useState("");

  const openModel = (title, message, type) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertType(type);
    setIsOpenAlert(true);
    const timer = setTimeout(() => {
      setIsOpenAlert(false);
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  };

  const handleDrag = function (e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = function (e) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      if (!validateExtension(e, e.dataTransfer.files[0])) {
        return;
      }
      handleFiles(e.dataTransfer.files[0]);
    }
  };

  const validateExtension = (event, file) => {
    const fileExtension = file.name.split(".").pop();

    if (!extensions.includes(`.${fileExtension}`)) {
      openModel(
        "Alert",
        `Invalid file format. Only ${extensions} files are allowed.`,
        "warning"
      );
      event.target.value = "";
      return false;
    }
    return true;
  };

  const handleFiles = function (file) {
    const reader = new FileReader();
    reader.onload = () => {
      const content = reader.result;
      dispatch(handleContentUpload(content));
      dispatch(handleFileName(file.name));
      setFileName(file.name);
    };
    reader.readAsText(file);
  };

  const handleChange = function (e) {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      if (!validateExtension(e, e.target.files[0])) {
        return;
      }
      handleFiles(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    inputRef.current.click();
  };

  return (
    <div className="flex justify-center uploader">
      <form
        id="form-file-upload"
        onDragEnter={handleDrag}
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          ref={inputRef}
          type="file"
          id={`input-file-upload-${instanceId}`}
          multiple={false}
          onChange={handleChange}
          accept={extensions}
        />
        <label
          id="label-file-upload"
          htmlFor={`input-file-upload-${instanceId}`}
          className={`${dragActive ? "drag-active" : ""} ${
            type === "square"
              ? "border-gray-300 bg-gray-50"
              : "border-gray-300 bg-gray-50"
          } border-2 border-dashed rounded`}
        >
          <div>
            {type === "square" ? (
              <div>
                {!fileName ? (
                  <>
                    <p>Drag and drop your file here or</p>
                    <button onClick={onButtonClick} className="upload-button">
                      Upload a file
                    </button>
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.0"
                      stroke="currentColor"
                      className="w-24 h-24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                      />
                    </svg>
                    <div>{fileName}</div>
                  </>
                )}
              </div>
            ) : (
              <div className="py-1">
                {!fileName ? (
                  <>
                    <span className="pr-2">
                      Drag and drop your file here or
                    </span>
                    <button onClick={onButtonClick} className="upload-button">
                      Upload a file
                    </button>
                  </>
                ) : (
                  <>
                    <div className="flex py-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.0"
                        stroke="currentColor"
                        className="pr-2 w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                        />
                      </svg>
                      <span>{fileName}</span>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </label>
        {dragActive && (
          <div
            id="drag-file-element"
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          ></div>
        )}
      </form>
      {isOpenAlert && (
        <Alert title={alertTitle} message={alertMessage} type={alertType} />
      )}
    </div>
  );
}

export default FileUploader;
