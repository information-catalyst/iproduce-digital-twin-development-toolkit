import SectionTitle from "../../components/title/title";
import BpmnUpload from "../../components/upload-bpmn/upload-bpmn";
import FileUploader from "../../components/upload-file/file-uploader";
import XmlEditor from "../../components/xml-editor/xml-editor";
import { setXmlContent, setFileName } from "../../redux/slices/bpmnSlice";
import "./bpmn.css";
function Bpmn() {
  return (
    <div className="Bpmn">
      <div className="pl-2 mt-4 mb-2">
        <SectionTitle text="BPMN UPLOAD" />
      </div>
      <div className="grid grid-cols-2 gap-4 p-2">
        <div className="file-uploader">
          <FileUploader
            handleContentUpload={setXmlContent}
            handleFileName={setFileName}
            instanceId={1}
            type="square"
            extensions=".bpmn"
          />
        </div>
        <div>
          <XmlEditor />
        </div>
      </div>
      <div className="">
        <BpmnUpload />
      </div>
    </div>
  );
}

export default Bpmn;
