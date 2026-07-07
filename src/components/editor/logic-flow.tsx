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
import AppIcon from "../ui/AppIcon";

const sectionColors = [
  {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    iconBg: "bg-blue-100",
    iconText: "text-blue-600",
  },
  {
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-200",
    iconBg: "bg-purple-100",
    iconText: "text-purple-600",
  },
  {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    iconBg: "bg-emerald-100",
    iconText: "text-emerald-600",
  },
  {
    bg: "bg-rose-50",
    text: "text-rose-700",
    border: "border-rose-200",
    iconBg: "bg-rose-100",
    iconText: "text-rose-600",
  },
  {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    iconBg: "bg-amber-100",
    iconText: "text-amber-600",
  },
  {
    bg: "bg-indigo-50",
    text: "text-indigo-700",
    border: "border-indigo-200",
    iconBg: "bg-indigo-100",
    iconText: "text-indigo-600",
  },
];

// Custom Node to make it look like a form element card
const CustomFieldNode = ({ data, targetPosition, sourcePosition }: any) => {
  const color = data.colorScheme || {
    bg: "bg-gray-50",
    text: "text-gray-500",
    border: "border-gray-200",
    iconBg: "bg-gray-100",
    iconText: "text-gray-600",
  };

  return (
    <div
      className={`bg-white border-2 ${color.border} rounded-lg shadow-sm w-[280px] overflow-hidden flex flex-col relative transition-all hover:shadow-md`}
    >
      <Handle
        type="target"
        position={targetPosition || Position.Top}
        className="w-2 h-2 !bg-gray-300 border-none"
      />
      <div
        className={`${color.bg} border-b ${color.border} px-3 py-2 flex items-center justify-between`}
      >
        <span
          className={`text-xs font-bold ${color.text} uppercase tracking-wide`}
        >
          {data.sectionTitle}
        </span>
        {data.isHidden && (
          <span className="bg-yellow-100 text-yellow-800 text-[10px] px-2 py-0.5 rounded-full font-medium">
            Conditional
          </span>
        )}
      </div>
      <div className="p-3 flex items-start gap-3">
        <div
          className={`mt-1 ${color.iconText} ${color.iconBg} p-1.5 rounded-md flex-shrink-0`}
        >
          <AppIcon
            icon="material-symbols:space-dashboard-outline"
            iconClass="text-lg"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h4
            className="text-sm font-semibold text-gray-800 truncate"
            title={data.label}
          >
            {data.label || "Untitled Field"}
          </h4>
          <p className="text-xs text-gray-500 mt-0.5 truncate uppercase tracking-wider font-medium text-[10px]">
            {data.type}
          </p>
        </div>
      </div>
      <Handle
        type="source"
        position={sourcePosition || Position.Bottom}
        className="w-2 h-2 !bg-gray-300 border-none"
      />
    </div>
  );
};

const SectionGroupNode = ({ data }: any) => {
  return (
    <div className="w-full h-full relative">
      <div className="absolute top-[-14px] left-4 bg-white px-3 py-0.5 text-xs font-bold text-slate-500 uppercase tracking-wider border border-slate-200 rounded-full shadow-sm max-w-[280px] truncate">
        {data.title}
      </div>
    </div>
  );
};

const nodeTypes = {
  customField: CustomFieldNode,
  sectionGroup: SectionGroupNode,
};

export default function LogicFlow({ formData }: { formData: any[] }) {
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    const nodes: any[] = [];
    const edges: any[] = [];
    let previousNodeId: string | null = null;

    // First pass: create all nodes and sequential edges
    formData?.forEach((section: any, sIndex: number) => {
      const colorScheme = sectionColors[sIndex % sectionColors.length];
      
      const sectionX = sIndex * 400; // Layout left to right horizontally
      const sectionY = 0;
      const sectionWidth = 320;
      const sectionHeight = 60 + (section?.questionData?.length || 0) * 110;

      // Create Section Group Node
      nodes.push({
        id: section.id,
        type: 'sectionGroup',
        data: { title: section.title || `Section ${sIndex + 1}` },
        position: { x: sectionX, y: sectionY },
        style: {
          width: sectionWidth,
          height: sectionHeight,
          backgroundColor: 'rgba(248, 250, 252, 0.4)',
          border: '2px dashed #cbd5e1',
          borderRadius: '16px',
        }
      });

      section?.questionData?.forEach((field: any, fIndex: number) => {
        const nodeId = field.id;

        // Create Node
        nodes.push({
          id: nodeId,
          type: "customField",
          parentId: section.id,
          extent: 'parent',
          targetPosition: Position.Top,
          sourcePosition: Position.Bottom,
          data: {
            label: field.inputLabel || field.label,
            type: field.type,
            sectionTitle: section.title || "Untitled Section",
            isHidden: field.isHidden,
            colorScheme,
          },
          position: { x: 20, y: 40 + fIndex * 110 },
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
      section?.questionData?.forEach((field: any) => {
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
              labelBgStyle: {
                fill: "#fffef2",
                stroke: "#fcd34d",
                strokeWidth: 1,
                rx: 4,
                ry: 4,
              },
              labelBgPadding: [6, 4],
              style: {
                stroke: "#f59e0b",
                strokeWidth: 2,
                strokeDasharray: "5,5",
              },
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

    return { nodes, edges };
  }, [formData]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Recalculate layout if data changes
  React.useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
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
       
        attributionPosition="bottom-right"
      >
        <Background color="#e2e8f0" gap={16} />
        <Controls />
        <MiniMap
          nodeStrokeColor="#e2e8f0"
          nodeColor="#f8fafc"
          maskColor="rgba(240, 240, 240, 0.6)"
        />
      </ReactFlow>
    </div>
  );
}
