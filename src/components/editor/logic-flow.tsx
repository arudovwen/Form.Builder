import React, { useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Position,
  MarkerType,
  Handle,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import dagre from "dagre";
import AppIcon from "../ui/AppIcon";

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 280;
const nodeHeight = 80;

const getLayoutedElements = (nodes: any[], edges: any[], direction = "TB") => {
  const isHorizontal = direction === "LR";
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const newNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    const newNode = {
      ...node,
      targetPosition: isHorizontal ? Position.Left : Position.Top,
      sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
      // We are shifting the dagre node position (anchor=center center) to the top left
      // so it matches the React Flow node anchor point (top left).
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };

    return newNode;
  });

  return { nodes: newNodes, edges };
};

const sectionColors = [
  { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", iconBg: "bg-blue-100", iconText: "text-blue-600" },
  { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200", iconBg: "bg-purple-100", iconText: "text-purple-600" },
  { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", iconBg: "bg-emerald-100", iconText: "text-emerald-600" },
  { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200", iconBg: "bg-rose-100", iconText: "text-rose-600" },
  { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", iconBg: "bg-amber-100", iconText: "text-amber-600" },
  { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200", iconBg: "bg-indigo-100", iconText: "text-indigo-600" },
];

// Custom Node to make it look like a form element card
const CustomFieldNode = ({ data, targetPosition, sourcePosition }: any) => {
  const color = data.colorScheme || { bg: "bg-gray-50", text: "text-gray-500", border: "border-gray-200", iconBg: "bg-gray-100", iconText: "text-gray-600" };

  return (
    <div className={`bg-white border-2 ${color.border} rounded-lg shadow-sm w-[280px] overflow-hidden flex flex-col relative transition-all hover:shadow-md`}>
      <Handle type="target" position={targetPosition || Position.Left} className="w-2 h-2 !bg-gray-300 border-none" />
      <div className={`${color.bg} border-b ${color.border} px-3 py-2 flex items-center justify-between`}>
        <span className={`text-xs font-bold ${color.text} uppercase tracking-wide`}>
          {data.sectionTitle}
        </span>
        {data.isHidden && (
          <span className="bg-yellow-100 text-yellow-800 text-[10px] px-2 py-0.5 rounded-full font-medium">
            Conditional
          </span>
        )}
      </div>
      <div className="p-3 flex items-start gap-3">
        <div className={`mt-1 ${color.iconText} ${color.iconBg} p-1.5 rounded-md flex-shrink-0`}>
          <AppIcon icon="material-symbols:space-dashboard-outline" iconClass="text-lg" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-gray-800 truncate" title={data.label}>
            {data.label || "Untitled Field"}
          </h4>
          <p className="text-xs text-gray-500 mt-0.5 truncate uppercase tracking-wider font-medium text-[10px]">{data.type}</p>
        </div>
      </div>
      <Handle type="source" position={sourcePosition || Position.Right} className="w-2 h-2 !bg-gray-300 border-none" />
    </div>
  );
};

const nodeTypes = {
  customField: CustomFieldNode,
};

export default function LogicFlow({ formData }: { formData: any[] }) {
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    const nodes: any[] = [];
    const edges: any[] = [];
    let previousNodeId: string | null = null;
    let sectionIndex = 0;

    // First pass: create all nodes and sequential edges
    formData?.forEach((section: any) => {
      const colorScheme = sectionColors[sectionIndex % sectionColors.length];
      sectionIndex++;

      section.questionData?.forEach((field: any) => {
        const nodeId = field.id;

        // Create Node
        nodes.push({
          id: nodeId,
          type: "customField",
          data: {
            label: field.inputLabel,
            type: field.type,
            sectionTitle: section.title || "Untitled Section",
            isHidden: field.isHidden,
            colorScheme,
          },
          position: { x: 0, y: 0 },
        });

        // Create Sequential Edge (only if it's not a conditionally hidden field)
        // Hidden fields break the direct linear flow, they branch off instead.
        if (previousNodeId && !field.isHidden) {
          edges.push({
            id: `e-${previousNodeId}-${nodeId}`,
            source: previousNodeId,
            target: nodeId,
            type: "smoothstep",
            animated: true,
            style: { stroke: "#cbd5e1", strokeWidth: 2 },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 20,
              height: 20,
              color: "#cbd5e1",
            },
          });
        }

        if (!field.isHidden) {
            previousNodeId = nodeId;
        }
      });
    });

    // Second pass: Create conditional edges for hidden fields
    formData?.forEach((section: any) => {
      section.questionData?.forEach((field: any) => {
        if (field.isHidden && field.visibilityDependentFields?.length > 0) {
          field.visibilityDependentFields.forEach((dep: any) => {
             edges.push({
                 id: `e-cond-${dep.id}-${field.id}`,
                 source: dep.id,
                 target: field.id,
                 type: "smoothstep",
                 animated: true,
                 label: `if ${dep.operator} '${dep.fieldValue}'`,
                 labelStyle: { fill: "#f59e0b", fontWeight: 600, fontSize: 12 },
                 labelBgStyle: { fill: "#fffef2", stroke: "#fcd34d", strokeWidth: 1, rx: 4, ry: 4 },
                 labelBgPadding: [6, 4],
                 style: { stroke: "#f59e0b", strokeWidth: 2, strokeDasharray: "5,5" },
                 markerEnd: {
                     type: MarkerType.ArrowClosed,
                     width: 20,
                     height: 20,
                     color: "#f59e0b",
                 },
             });
          });
        }
      });
    });

    return getLayoutedElements(nodes, edges, "LR");
  }, [formData]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Recalculate layout if data changes
  React.useEffect(() => {
    if (!initialNodes || !initialEdges) return;
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      initialNodes,
      initialEdges
    );
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  return (
    <div className="w-full h-full bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.2}
        attributionPosition="bottom-right"
      >
        <Background color="#e2e8f0" gap={16} />
        <Controls />
        <MiniMap nodeStrokeColor="#e2e8f0" nodeColor="#f8fafc" maskColor="rgba(240, 240, 240, 0.6)" />
      </ReactFlow>
    </div>
  );
}
