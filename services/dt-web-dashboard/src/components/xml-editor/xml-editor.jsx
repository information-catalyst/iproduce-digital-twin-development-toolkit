import React, { useCallback, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { okaidia } from "@uiw/codemirror-theme-okaidia";
import { materialLight } from "@uiw/codemirror-theme-material";
import { xmlLanguage } from "@codemirror/lang-xml";
import { useSelector, useDispatch } from "react-redux";
import { setXmlContent } from "../../redux/slices/bpmnSlice";

import "./xml-editor.css";

const XmlEditor = () => {
  const dispatch = useDispatch();
  const xmlContent = useSelector((state) => state.bpmn.xmlcontent);

  const handleChange = useCallback((value, viewUpdate) => {
    // console.log("value:", value);
    dispatch(setXmlContent(value));
  }, []);

  const [isDark, setIsDark] = useState(true);

  return (
    <div className="editor-container">
      <div>
        <CodeMirror
          value={xmlContent}
          height="60vh"
          onChange={handleChange}
          lang="xml"
          theme={isDark ? okaidia : materialLight}
          extensions={[xmlLanguage]}
          basicSetup={{ autocompletion: true }}
        />
      </div>
      <div className="flex justify-end mt-2">
        <div
          onClick={() => {
            setIsDark(false);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="#909497"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
            />
          </svg>
        </div>
        <div
          className="ml-1"
          onClick={() => {
            setIsDark(true);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="#D7DBDD"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default XmlEditor;
