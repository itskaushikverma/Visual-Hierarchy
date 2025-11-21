import Flow from "./flow";
import { ReactFlowProvider } from "@xyflow/react";

export default function Main() {
    return (
        <>
            <ReactFlowProvider>
                <Flow />
            </ReactFlowProvider>
        </>
    );
}