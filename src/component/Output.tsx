import { useRef, useState, useEffect } from "react";

export interface LogEntry {
  type: "log" | "error" | "warning" | "status";
  content: string;
  lineNumber?: number;
  fileName?: string;
}

interface MessageData {
  type: "log" | "error" | "warning" | "status";
  content: string;
  lineNumber?: number;
  fileName?: string;
}

export function OutputPanel({ code }: { code: string }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const fileName = "main.js"; // Use the correct file name

  const validateSyntax = (code: string): LogEntry | null => {
    try {
      new Function(code); // Attempt to parse the code
      return null;
    } catch (error: any) {
      const message = error instanceof Error ? error.message : String(error);
      const stackLines =
        error instanceof Error && error.stack ? error.stack.split("\n") : [];
      let lineNumber: number | null = null;
      for (const line of stackLines) {
        const match = line.match(/:(\d+):/);
        if (match) {
          lineNumber = parseInt(match[1]);
          break;
        }
      }
      return {
        type: "error",
        content: `${fileName}:${lineNumber || "unknown"} ${
          error.name
        }: ${message}`,
        lineNumber,
        fileName,
      };
    }
  };

  const executeCode = () => {
    if (!iframeRef.current) return;

    // Clear previous logs
    setLogs([]);

    const newLogs: LogEntry[] = [];

    // Check for syntax errors first
    const syntaxError = validateSyntax(code);
    if (syntaxError) {
      setLogs([syntaxError]);
      return;
    }

    const iframe = iframeRef.current;

    // Sandboxed iframe code
    const sandboxCode = `
      <html>
        <body>
          <script>
            // Override console methods
            const originalConsoleLog = console.log;
            const originalConsoleError = console.error;
            const originalConsoleWarn = console.warn;

            console.log = (...args) => {
              window.parent.postMessage({
                type: 'log',
                content: args.map(arg => typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)).join(' ')
              }, '*');
              originalConsoleLog(...args);
            };

            console.error = (...args) => {
              window.parent.postMessage({
                type: 'error',
                content: args.map(arg => typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)).join(' '),
                fileName: '${fileName}'
              }, '*');
              originalConsoleError(...args);
            };

            console.warn = (...args) => {
              window.parent.postMessage({
                type: 'warning',
                content: args.map(arg => typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)).join(' ')
              }, '*');
              originalConsoleWarn(...args);
            };

            // Listen for unhandled promise rejections
            window.addEventListener('unhandledrejection', (event) => {
              const error = event.reason;
              const stackLines = error.stack ? error.stack.split('\\n') : [];
              let lineNumber = null;
              for (const line of stackLines) {
                const match = line.match(/:(\\d+):\\d+/);
                if (match) {
                  lineNumber = parseInt(match[1]);
                  break;
                }
              }
              lineNumber = lineNumber ? lineNumber - 33 : null; // Adjust for iframe offset
              const errorContent = \`${fileName}:\${lineNumber || 'unknown'} \${error.name}: \${error.message}\`;
              window.parent.postMessage({
                type: 'error',
                content: errorContent,
                lineNumber,
                fileName: '${fileName}'
              }, '*');
            });

            try {
              // Simulate file name and line number tracking
              (function() {
                ${code}
              }).call(window, '${fileName}');
              window.parent.postMessage({ type: 'status', content: 'Code executed successfully' }, '*');
            } catch (error) {
              const stackLines = error.stack ? error.stack.split('\\n') : [];
              let lineNumber = null;
              for (const line of stackLines) {
                const match = line.match(/:(\\d+):\\d+/);
                if (match) {
                  lineNumber = parseInt(match[1]);
                  break;
                }
              }
              lineNumber = lineNumber ? lineNumber - 33 : null; // Adjust for iframe offset
              const errorContent = \`${fileName}:\${lineNumber || 'unknown'} \${error.name}: \${error.message}\`;
              window.parent.postMessage({
                type: 'error',
                content: errorContent,
                lineNumber,
                fileName: '${fileName}'
              }, '*');
            }
          </script>
        </body>
      </html>
    `;

    // Write code to iframe
    iframe.srcdoc = sandboxCode;

    // Listen for messages from iframe
    const handleMessage = (event: MessageEvent<MessageData>) => {
      const { type, content, lineNumber, fileName } = event.data;
      if (["log", "error", "warning", "status"].includes(type)) {
        newLogs.push({
          type,
          content,
          lineNumber,
          fileName,
        });
        setLogs([...newLogs]);
      }
    };

    window.addEventListener("message", handleMessage);

    // Cleanup listener
    return () => window.removeEventListener("message", handleMessage);
  };

  const clearLogs = () => setLogs([]);

  // Auto-scroll to bottom when logs update
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="h-screen flex flex-col bg-[#141414] text-gray-100">
      <div className="px-4 py-2 text-sm border-b border-gray-700 flex justify-between items-center">
        <div className="font-semibold">Console</div>
        <div className="space-x-3">
          <button
            className="text-xs text-gray-400 hover:text-gray-100 transition-colors"
            onClick={executeCode}
          >
            Run
          </button>
          <button
            className="text-xs text-gray-400 hover:text-gray-100 transition-colors"
            onClick={clearLogs}
          >
            Clear
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-auto" ref={scrollRef}>
          <div className="p-4 text-left">
            {logs.map((log, index) => (
              <div
                key={index}
                className={`mb-2 ${
                  log.type === "error"
                    ? "text-red-500"
                    : log.type === "warning"
                    ? "text-yellow-500"
                    : log.type === "status"
                    ? "text-green-500"
                    : "text-gray-100"
                }`}
              >
                <span className="whitespace-pre-wrap font-mono text-sm">
                  {log.content}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <iframe ref={iframeRef} sandbox="allow-scripts" className="hidden" />
    </div>
  );
}
