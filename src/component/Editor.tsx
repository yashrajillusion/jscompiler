import Editor from "@monaco-editor/react";

export default function MonacoEditor() {
  return (
    <Editor
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
