import { UseConsoleOutput } from "@/hooks/useCodeRunner";
import AdBanner from "./Adbanner";

export function OutputPanel({ iframeRef, logs, clearLogs }: UseConsoleOutput) {
  return (
    <div className="h-screen flex flex-col bg-[#141414] text-gray-100">
      <div className="px-4 py-3 text-sm border-b border-gray-700 flex justify-between items-center">
        <div className="font-semibold">Console</div>
        <div className="space-x-3">
          <button
            className="text-s cursor-pointer text-gray-400 hover:text-gray-100 transition-colors"
            onClick={clearLogs}
          >
            Clear
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-auto">
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
      {/* <AdBanner /> */}
      <iframe ref={iframeRef} sandbox="allow-scripts" className="hidden" />
    </div>
  );
}
