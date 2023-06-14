import BpmnViewer from "bpmn-js/lib/NavigatedViewer";

export function convertContentToJSONFile(jsonContent, fileName) {
  const blob = new Blob([jsonContent], { type: "application/json" });
  const file = new File([blob], fileName, {
    lastModified: new Date().getTime(),
  });
  return file;
}

export function parseAndValidateBPMN(bpmnContent) {
  const bpmnViewer = new BpmnViewer();

  return new Promise((resolve, reject) => {
    bpmnViewer.importXML(bpmnContent, (err, warnings) => {
      if (err) {
        reject(err);
      } else {
        if (warnings.length > 0) {
          console.warn("BPMN parsing warnings:", warnings);
        }
        resolve();
      }
    });
  });
}

export function parseAndValidateJSON(jsonString) {
  return new Promise((resolve, reject) => {
    try {
      const jsonObject = JSON.parse(jsonString);
      resolve(jsonObject);
    } catch (error) {
      console.error("Invalid JSON:", error);
      reject(error);
    }
  });
}
