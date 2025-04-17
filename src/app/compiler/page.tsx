"use client";
import MonacoEditor from "@/component/Editor";
import Navbar from "@/component/Navbar";
import { OutputPanel } from "@/component/OutputPanel";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/component/ui/resizable";
import { useCodeRunner } from "@/hooks/useCodeRunner";
import { useRef, useState } from "react";

export default function MonacoEditorMacOSDark() {
  const panelGroupRef = useRef<any>(null);
  const [code, setCode] = useState<string>("");
  const { runCode, iframeRef, logs, clearLogs } = useCodeRunner();

  const handleDoubleClick = () => {
    panelGroupRef.current?.setLayout([50, 50]);
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value) {
      setCode(value);
    }
  };

  return (
    <div className="h-full w-full overflow-hidden bg-background">
      <ResizablePanelGroup
        ref={panelGroupRef}
        direction="horizontal"
        className="h-full"
      >
        <ResizablePanel
          defaultSize={50}
          className="flex flex-col overflow-hidden"
        >
          <div className="w-full h-screen bg-[#1f1f1f]">
            <Navbar onClick={() => runCode(code)} />
            <MonacoEditor onChange={handleEditorChange} runCode={runCode} />
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle onDoubleClick={handleDoubleClick} />
        <ResizablePanel defaultSize={50}>
          <OutputPanel
            iframeRef={iframeRef}
            logs={logs}
            clearLogs={clearLogs}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
