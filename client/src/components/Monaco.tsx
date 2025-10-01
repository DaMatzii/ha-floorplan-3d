import React, { useEffect, useRef } from "react";
import * as monaco from "monaco-editor";

// Import worker files directly
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
import cssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker";
import htmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker";
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";

import yamlWorker from "monaco-yaml/yaml.worker?worker";

// Configure Monaco environment
self.MonacoEnvironment = {
  getWorker(_, label) {
    if (label === "json") return new jsonWorker();
    if (label === "css") return new cssWorker();
    if (label === "html") return new htmlWorker();
    if (label === "typescript" || label === "javascript") return new tsWorker();
    if (label === "yaml") return new yamlWorker();

    return new editorWorker();
  },
};

let text = "";
fetch("/home.yaml")
  .then((res) => res.text())
  .then((data) => (text = data));

const Editor = React.forwardRef(({}, ref) => {
  const divEl = useRef<HTMLDivElement>(null);
  const [code, setCode] = React.useState("");
  const editorRef = useRef(null);

  if (!navigator.clipboard || !navigator.clipboard.write) {
    navigator.clipboard = {
      ...navigator.clipboard,
      write: async () => {}, // no-op
      writeText: async () => {},
    };
  }

  useEffect(() => {
    // console.log("lol");
    // console.log(text);

    if (divEl.current) {
      editorRef.current = monaco.editor.create(divEl.current, {
        value: text,
        language: "yaml",
        automaticLayout: true,
        minimap: { enabled: false },
      });
    }
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault(); // stop default browser save
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      editorRef.current.dispose();
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  React.useImperativeHandle(ref, () => ({
    getEditor: () => editorRef.current,
  }));
  return <div className="Editor w-full h-full" ref={divEl}></div>;
});
export default Editor;
