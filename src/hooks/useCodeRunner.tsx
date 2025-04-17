import { RefObject, useRef, useState } from "react";

export interface LogEntry {
  type: "log" | "error" | "warning" | "status";
  content: string;
  fileName?: string;
}

export interface UseConsoleOutput {
  iframeRef: RefObject<HTMLIFrameElement | null>;
  logs: LogEntry[];
  runCode?: () => void;
  clearLogs: () => void;
}

export const fileName = "main.js";

export function useCodeRunner() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const validateSyntax = (code: string): LogEntry | null => {
    try {
      new Function(code);
      return null;
    } catch (error: any) {
      return {
        type: "error",
        content: error.stack,
        fileName,
      };
    }
  };

  const clearLogs = () => setLogs([]);

  const runCode = (code: string) => {
    if (!iframeRef.current) return;

    setLogs([]);
    const newLogs: LogEntry[] = [];

    const syntaxError = validateSyntax(code);
    if (syntaxError) {
      setLogs([syntaxError]);
      return;
    }

    const iframe = iframeRef.current;

    const sandboxCode = `
      <html>
        <body>
          <script>
            const fileName = '${fileName}';

            const post = (type, content) => {
              window.parent.postMessage({ type, content, fileName }, '*');
            };

            console.log = (...args) => post('log', args.map(String).join(' '));
            console.warn = (...args) => post('warning', args.map(String).join(' '));
            console.error = (...args) => post('error', args.map(String).join(' '));

            window.addEventListener('unhandledrejection', event => {
              post('error', event.reason?.stack || String(event.reason));
            });

            try {
              ${code}
              post('status', 'Code executed successfully');
            } catch (error) {
              post('error', error?.stack || String(error));
            }
          <\/script>
        </body>
      </html>
    `;

    iframe.srcdoc = sandboxCode;

    const handleMessage = (event: MessageEvent<LogEntry>) => {
      const { type, content, fileName } = event.data;
      if (["log", "error", "warning", "status"].includes(type)) {
        newLogs.push({ type, content, fileName });
        setLogs([...newLogs]);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  };

  return {
    iframeRef,
    logs,
    runCode,
    clearLogs,
  };
}
