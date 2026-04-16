import { useCallback, useMemo, useRef, useState } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import CustomNode from './customNode';
import { SidebarMenu } from './sidebar';
import Header from './header';
import { v4 as uuid } from 'uuid';
import initialNodesData from '../../initialNodes.json';
import initialEdgesData from '../../initialEdges.json';

const rawInitialNodes = initialNodesData?.nodes;

const initialNodes = rawInitialNodes?.map((node) => ({
  ...node,
  data: {
    ...node.data,
    sections: (node.data.sections || [])?.map((s) => ({
      id: s.id ?? uuid(),
      title: s.title ?? '',
      description: s.description ?? '',
    })),
  },
}));

export default function Flow() {
  const reactFlowWrapper = useRef(null);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdgesData?.edges);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const { screenToFlowPosition } = useReactFlow();
  const [rfInstance, setRfInstance] = useState(null);

  const { setViewport } = useReactFlow();

  const suppressNodeClickRef = useRef(false);

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const onSave = useCallback(() => {
    if (rfInstance) {
      const flow = rfInstance.toObject();
      localStorage.setItem('VisualHierarchy', JSON.stringify(flow));
    }
  }, [rfInstance]);

  const normalizeNodes = useCallback((rawNodes) => {
    return (rawNodes || []).map((node) => ({
      ...node,
      data: {
        ...(node.data ?? {}),
        sections: (node.data?.sections || []).map((s) => ({
          id: s.id ?? uuid(),
          title: s.title ?? '',
          description: s.description ?? '',
        })),
      },
    }));
  }, []);

  const onRestore = useCallback(() => {
    const restoreFlow = async () => {
      const flow = JSON.parse(localStorage.getItem('VisualHierarchy'));

      if (flow) {
        const { x = 0, y = 0, zoom = 1 } = flow.viewport;
        setNodes(flow.nodes || []);
        setEdges(flow.edges || []);
        setViewport({ x, y, zoom });
      }
    };

    restoreFlow();
  }, [setNodes, setViewport]);

  const onNodeDataChange = useCallback(
    (nodeId, newData) => {
      setNodes((nds) =>
        nds?.map((node) => {
          if (node.id === nodeId) {
            return {
              ...node,
              data: {
                ...node.data,
                ...newData,
              },
              style: {
                backgroundColor: '#364153',
              },
            };
          }
          return node;
        }),
      );
      setSelectedNode((prev) =>
        prev && prev.id === nodeId ? { ...prev, data: { ...(prev.data || {}), ...newData } } : prev,
      );
    },
    [setNodes],
  );

  const onNodeClick = useCallback((e, node) => {
    if (suppressNodeClickRef.current) {
      suppressNodeClickRef.current = false;
      return;
    }

    e.stopPropagation();
    setSelectedNode(node);
    setSidebarOpen(true);
  }, []);

  const addNewCustomNode = useCallback(
    ({ x, y, label = '-', sections = [] }) => {
      const id = uuid();
      const newNode = {
        id,
        type: 'custom',
        position: screenToFlowPosition({ x, y }),
        data: { label, sections },
      };
      setNodes((nds) => nds.concat(newNode));
      return newNode;
    },
    [screenToFlowPosition, setNodes],
  );

  const onConnectEnd = useCallback(
    (event, connectionState) => {
      if (!connectionState.isValid) {
        const { clientX, clientY } = 'changedTouches' in event ? event.changedTouches[0] : event;
        const newNode = addNewCustomNode({
          x: clientX,
          y: clientY,
          label: '-',
        });
        const newEdgeId = uuid();
        setEdges((eds) =>
          eds.concat({
            id: newEdgeId,
            source: connectionState.fromNode.id,
            target: newNode.id,
          }),
        );
      }
    },
    [addNewCustomNode, setEdges],
  );

  const nodeTypes = useMemo(
    () => ({
      custom: (props) => (
        <CustomNode
          {...props}
          onNodeDataChange={onNodeDataChange}
          suppressNodeClickRef={suppressNodeClickRef}
        />
      ),
    }),
    [onNodeDataChange, suppressNodeClickRef],
  );

  const onExport = () => {
    const flow = rfInstance ? rfInstance.toObject() : { nodes, edges };
    const jsonString = JSON.stringify(flow, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = url;
    link.download = `Visual-Hierarchy.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const onLoadJSON = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,application/json';
    input.onchange = async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      try {
        const text = await file.text();
        const parsed = JSON.parse(text);
        const loadedNodes = normalizeNodes(
          parsed?.nodes ?? parsed?.flow?.nodes ?? parsed?.elements ?? [],
        );
        const loadedEdges = parsed?.edges ?? parsed?.flow?.edges ?? [];
        setNodes(loadedNodes);
        setEdges(loadedEdges);
        setSelectedNode(null);
        setTimeout(() => {
          if (rfInstance && rfInstance.fitView) rfInstance.fitView();
        }, 50);
      } catch (err) {
        console.error('Failed to load JSON', err);
      }
    };
    input.click();
  };

  const onClear = useCallback(() => {
    const newNode = {
      id: uuid(),
      type: 'custom',
      position: { x: 0, y: 0 },
      data: { label: '-', sections: [] },
    };
    setNodes([newNode]);
    setEdges([]);
    setSelectedNode(null);
    setTimeout(() => {
      if (rfInstance && rfInstance.fitView)
        rfInstance.fitView({
          duration: 300,
          padding: 5,
          interpolate: 'smooth',
        });
    }, 50);
  }, [setNodes, setEdges, rfInstance]);

  return (
    <>
      <Header
        onSave={onSave}
        onRestore={onRestore}
        onExport={onExport}
        onLoadJSON={onLoadJSON}
        onClear={onClear}
      />
      <div className="h-[90vh] overflow-hidden rounded-b-[20px]" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onConnectEnd={onConnectEnd}
          fitView
          fitViewOptions={{ padding: 2 }}
          nodeTypes={nodeTypes}
          colorMode={'dark'}
          nodeOrigin={[0.5, 0]}
          onInit={setRfInstance}
          onNodeClick={onNodeClick}
        >
          <Controls position="top-right" />
          <MiniMap position="top-left" />
          <Background variant="cross" gap={12} size={1} />
        </ReactFlow>
        <SidebarMenu
          onOpen={sidebarOpen}
          onOpenChange={setSidebarOpen}
          nodes={nodes}
          setNodes={setNodes}
          node={selectedNode}
        />
      </div>
    </>
  );
}
