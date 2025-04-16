import { formatJsx } from "@/utils/codeFormatter";
import Editor, { OnMount } from "@monaco-editor/react";
import { useRef } from "react";
import { editor } from "monaco-editor";

export default function MonacoEditor() {
  const editorRef = useRef<editor.IStandaloneCodeEditor>(null);

  const handleEditorMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      const currentValue = editor.getValue();
      const cursorPosition = editor.getPosition();

      const formattedCode = formatJsx(currentValue);
      editor.setValue(formattedCode);

      if (cursorPosition && editorRef.current) {
        editorRef.current.setPosition(cursorPosition);
      }
    });
  };

  return (
    <Editor
      onMount={handleEditorMount}
      loading={""}
      height="100%"
      defaultLanguage="javascript"
      defaultValue="// ⚡ Lightning-Fast Online Javascript Editor"
      theme="vs-dark"
      options={{
        fontSize: 14,
        fontFamily: 'Menlo, Monaco, "Courier New", monospace',
        minimap: { enabled: false },
        smoothScrolling: true,
        scrollBeyondLastLine: false,
        automaticLayout: true,
        padding: { top: 10 },
        lineNumbers: "on",
        tabSize: 2,
        cursorSmoothCaretAnimation: "on",
        renderLineHighlight: "all",
        bracketPairColorization: { enabled: true },
        autoClosingBrackets: "always",
        theme: "vs-dark",
        wordWrap: "on",
      }}
    />
  );
}
