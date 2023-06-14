import { useSelector } from "react-redux";
import ModelViewer from "../../components/model/modelViewer";
import SectionTitle from "../../components/title/title";
import FileUploader from "../../components/upload-file/file-uploader";
import { useUploadModelMutation } from "../../redux/services/model";
import { setJSONContent, setFileName } from "../../redux/slices/3dModel";
import {
  convertContentToJSONFile,
  parseAndValidateJSON,
} from "../../components/utils/utils";
import Alert from "../../components/alert/alert";
import { useState } from "react";

function Model() {
  const [uploadModel, { isLoading, isError, isSuccess, error }] =
    useUploadModelMutation();

  const fileContent = useSelector((state) => state.model.jsonContent);
  const fileName = useSelector((state) => state.model.fileName);

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

  const validateJson = async () => {
    try {
      await parseAndValidateJSON(fileContent);
      return true;
    } catch (err) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (fileContent.length < 1) {
      openModel("Alert", "Model file is empty!", "warning");
      return;
    }

    if (!validateJson()) {
      openModel("Alert", "Invalid JSON", "warning");
      return;
    }

    try {
      const file = convertContentToJSONFile(fileContent, fileName);
      const formData = new FormData();
      formData.append("file", file);
      const res = uploadModel(formData);
      console.log(res);
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  return (
    <div className="3dmodel">
      <div className="pl-2 mt-4 mb-2">
        <SectionTitle text="3D MODEL UPLOAD" />
      </div>
      <div className="px-16 flex justify-start items-center">
        <div className="w-10/12">
          <FileUploader
            handleContentUpload={setJSONContent}
            handleFileName={setFileName}
            instanceId={2}
            extensions=".json"
          />
        </div>
        <div
          className="pl-4 flex-grow"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          <button className="w-full bg-white hover:bg-orange-100 hover:border-0 hover:text-orange-600 text-orange-800 font-semibold border border-orange-400 rounded shadow py-2 px-4 rounded inline-flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-6 h-6 pr-2"
            >
              <path d="M9.25 13.25a.75.75 0 001.5 0V4.636l2.955 3.129a.75.75 0 001.09-1.03l-4.25-4.5a.75.75 0 00-1.09 0l-4.25 4.5a.75.75 0 101.09 1.03L9.25 4.636v8.614z" />
              <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
            </svg>
            <span className="flex items-center">Upload</span>
          </button>
        </div>
      </div>
      <div className="flex justify-center mt-4">
        <ModelViewer />
      </div>
      {isSuccess && <Alert title="Success" message="Uploaded" type="success" />}
      {isError && <Alert title="Error" message={error.message} type="error" />}
      {isOpenAlert && (
        <Alert title={alertTitle} message={alertMessage} type={alertType} />
      )}
    </div>
  );
}
export default Model;
