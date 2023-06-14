import React, { useState } from "react";
import { useUploadMutation } from "../../redux/services/bpmn";
import { useSelector } from "react-redux";
import Alert from "../alert/alert";
import { parseAndValidateBPMN } from "../utils/utils";

const BpmnUpload = () => {
  const [dbName, setDbName] = useState("");
  const [processName, setProcessName] = useState("");
  const [upload, { isLoading, isError, isSuccess, error }] =
    useUploadMutation();
  const [isOpenAlert, setIsOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertTitle, setAlertTitle] = useState("");
  const [alertType, setAlertType] = useState("");
  const xmlData = useSelector((state) => state.bpmn.xmlcontent);

  async function validateBPMN() {
    try {
      await parseAndValidateBPMN(xmlData);
      return true;
    } catch (err) {
      return false;
    }
  }

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (processName.length < 1) {
      openModel("Alert", "Process Name is empty!", "warning");
      return;
    }

    if (xmlData.length < 1) {
      openModel("Alert", "BPMN is empty!", "warning");
      return;
    }

    if (!validateBPMN(xmlData)) {
      openModel("Alert", "BPMN is invalid!", "warning");
      return;
    }

    try {
      const res = await upload({
        database: dbName,
        process: processName,
        xmlData: xmlData,
      });
      console.log(res);
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  return (
    <div className="Upload-form">
      <div className="flex justify-center">
        <form>
          <div className="grid gap-6 mb-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="first_name"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Database name
              </label>
              <input
                type="text"
                id="db_name"
                className="text-gray-500 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-80 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="my_db"
                required
                onChange={(e) => setDbName(e.target.value)}
                value="Factory_Processes"
                disabled="true"
              />
            </div>
            <div>
              <label
                htmlFor="last_name"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Process name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                id="process_name"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-80 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                onChange={(e) => setProcessName(e.target.value)}
                required
              />
            </div>
          </div>
          <div
            className="flex justify-center"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            <button className="bg-white hover:bg-orange-100 hover:border-0 hover:text-orange-600 text-orange-800 font-semibold border border-orange-400 rounded shadow py-2 px-4 rounded inline-flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-6 h-6 pr-2"
              >
                <path d="M9.25 13.25a.75.75 0 001.5 0V4.636l2.955 3.129a.75.75 0 001.09-1.03l-4.25-4.5a.75.75 0 00-1.09 0l-4.25 4.5a.75.75 0 101.09 1.03L9.25 4.636v8.614z" />
                <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
              </svg>
              Upload
            </button>
          </div>
        </form>
      </div>
      {isSuccess && <Alert title="Success" message="Uploaded" type="success" />}
      {isError && <Alert title="Error" message={error.message} type="error" />}
      {isOpenAlert && (
        <Alert title={alertTitle} message={alertMessage} type={alertType} />
      )}
    </div>
  );
};

export default BpmnUpload;
