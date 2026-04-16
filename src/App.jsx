import { ReactFlowProvider } from "@xyflow/react";
import Flow from "./components/flow";

export default function App() {
  return (
    <div className="max-h-screen">
      <div className="border-2 m-3 border-white/20 rounded-lg shadow-md">
        <ReactFlowProvider>
          <Flow />
        </ReactFlowProvider>
      </div>
    </div>
  );
}
