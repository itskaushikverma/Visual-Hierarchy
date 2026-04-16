import { ReactFlowProvider } from '@xyflow/react';
import Flow from './components/flow';

export default function App() {
  return (
    <div className="max-h-screen">
      <div className="m-3 rounded-lg border-2 border-white/20 shadow-md">
        <ReactFlowProvider>
          <Flow />
        </ReactFlowProvider>
      </div>
    </div>
  );
}
