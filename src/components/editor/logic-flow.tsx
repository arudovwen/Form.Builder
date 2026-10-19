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
  BackgroundVariant,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import AppIcon from "../ui/AppIcon";

const sectionColors = [
  {
    bg: "bg-indigo-50/80",
    text: "text-indigo-700",
    border: "border-indigo-200",
    accent: "bg-indigo-500",
    iconBg: "bg-indigo-100",
    iconText: "text-indigo-600",
  },
  {
    bg: "bg-purple-50/80",
    text: "text-purple-700",
    border: "border-purple-200",
    accent: "bg-purple-500",
    iconBg: "bg-purple-100",
    iconText: "text-purple-600",
  },
  {
    bg: "bg-blue-50/80",
    text: "text-blue-700",
    border: "border-blue-200",
    accent: "bg-blue-500",
    iconBg: "bg-blue-100",
    iconText: "text-blue-600",
  },
  {
    bg: "bg-emerald-50/80",
    text: "text-emerald-700",
    border: "border-emerald-200",
    accent: "bg-emerald-500",
    iconBg: "bg-emerald-100",
    iconText: "text-emerald-600",
  },
  {
    bg: "bg-amber-50/80",
    text: "text-amber-700",
    border: "border-amber-200",
    accent: "bg-amber-500",
    iconBg: "bg-amber-100",
    iconText: "text-amber-600",
  },
  {
    bg: "bg-rose-50/80",
    text: "text-rose-700",
    border: "border-rose-200",
    accent: "bg-rose-500",
    iconBg: "bg-rose-100",
    iconText: "text-rose-600",
  },
];

const typeIcons: Record<string, string> = {
  textField: "ri:text",
  longText: "fluent:text-paragraph-24-regular",
  email: "fluent:mail-24-regular",
  phoneField: "fluent:phone-24-regular",
  numberField: "fluent:number-symbol-24-regular",
  selectField: "ri:arrow-down-s-line",
  multiSelect: "fluent-mdl2:multi-select",
  checkbox: "fluent:checkbox-checked-24-regular",
  radio: "fluent:radio-button-24-regular",
  rating: "solar:star-line-duotone",
  date: "fluent:calendar-ltr-24-regular",
  file: "solar:paperclip-linear",
  grid: "fluent:table-simple-24-regular",
};

// Custom Node for workflow cards
const CustomFieldNode = ({ data, targetPosition, sourcePosition }: any) => {
  const color = data.colorScheme || sectionColors[0];
  const icon = typeIcons[data.type] || "material-symbols:space-dashboard-outline";

  return (
    <div className="bg-white border border-gray-200/90 hover:border-indigo-500/80 rounded-2xl shadow-sm hover:shadow-xl w-[290px] overflow-hidden flex flex-col relative transition-all duration-200 group">
      {/* Top accent gradient strip */}
      <div className={`h-1.5 w-full ${color.accent}`} />

      {/* Target input port */}
      <Handle
        type="target"
        position={targetPosition || Position.Top}
        className="w-3 h-3 !bg-white !border-2 !border-indigo-500 shadow-xs hover:scale-125 transition-transform"
      />

      {/* Header bar */}
      <div
        className={`${color.bg} border-b ${color.border} px-3.5 py-2 flex items-center justify-between`}
      >
        <span
          className={`text-[10px] font-bold ${color.text} uppercase tracking-wider truncate max-w-[170px]`}
          title={data.sectionTitle}
        >
          {data.sectionTitle}
        </span>
        <div className="flex items-center gap-1.5">
          {data.isRequired && (
            <span className="text-[10px] font-bold text-rose-500" title="Required field">
              *
            </span>
          )}
          {data.isHidden && (
            <span className="bg-amber-100 text-amber-800 text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider border border-amber-200">
              Branch
            </span>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-3.5 flex items-start gap-3 bg-white">
        <div
          className={`mt-0.5 ${color.iconText} ${color.iconBg} p-2 rounded-xl flex-shrink-0 border border-white shadow-xs`}
        >
          <AppIcon icon={icon} iconClass="text-lg" />
        </div>
        <div className="flex-1 min-w-0">
          <h4
            className="text-xs font-bold text-gray-800 group-hover:text-indigo-600 transition-colors truncate"
            title={data.label}
          >
            {data.label || "Untitled Field"}
          </h4>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider bg-gray-100 px-1.5 py-0.5 rounded-md">
              {data.type}
            </span>
          </div>
        </div>
      </div>

      {/* Source output port */}
      <Handle
        type="source"
        position={sourcePosition || Position.Bottom}
        className="w-3 h-3 !bg-white !border-2 !border-indigo-500 shadow-xs hover:scale-125 transition-transform"
      />
    </div>
  );
};

const SectionGroupNode = ({ data }: any) => {
  return (
    <div className="w-full h-full relative pointer-events-none">
      <div className="absolute top-[-14px] left-4 bg-white/95 backdrop-blur-sm px-3.5 py-1 text-[11px] font-bold text-slate-700 uppercase tracking-wider border border-slate-200/90 rounded-full shadow-sm max-w-[320px] truncate flex items-center gap-1.5">
        <AppIcon icon="solar:folder-bold-duotone" iconClass="text-sm text-indigo-500" />
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

    formData
      ?.filter((section: any) => !section?.isFieldDeleted && !section?.isDeleted)
      ?.forEach((section: any, sIndex: number) => {
        const colorScheme = sectionColors[sIndex % sectionColors.length];
        const activeFields =
          section?.formData?.filter(
            (f: any) => !f?.isFieldDeleted && !f?.isDeleted,
          ) || [];

        const sectionX = sIndex * 420;
        const sectionY = 0;
        const sectionWidth = 350;
        const sectionHeight = 65 + activeFields.length * 115;

        // Section Group Node
        nodes.push({
          id: section.id,
          type: "sectionGroup",
          data: { title: section.title || `Section ${sIndex + 1}` },
          position: { x: sectionX, y: sectionY },
          style: {
            width: sectionWidth,
            height: sectionHeight,
            backgroundColor: "rgba(248, 250, 252, 0.6)",
            border: "2px dashed #cbd5e1",
            borderRadius: "20px",
          },
        });

        activeFields.forEach((field: any, fIndex: number) => {
          const nodeId = field.id;

          nodes.push({
            id: nodeId,
            type: "customField",
            parentId: section.id,
            extent: "parent",
            targetPosition: Position.Top,
            sourcePosition: Position.Bottom,
            data: {
              label: field.inputLabel || field.label,
              type: field.type,
              isRequired: field.isRequired || field.required,
              sectionTitle: section.title || "Untitled Section",
              isHidden: field.isHidden,
              colorScheme,
            },
            position: { x: 30, y: 45 + fIndex * 115 },
          });

          // Sequential Edge for standard flow
          if (previousNodeId && !field.isHidden) {
            edges.push({
              id: `e-${previousNodeId}-${nodeId}`,
              source: previousNodeId,
              target: nodeId,
              type: "smoothstep",
              animated: true,
              style: { stroke: "#94a3b8", strokeWidth: 2 },
              markerEnd: {
                type: MarkerType.ArrowClosed,
                width: 18,
                height: 18,
                color: "#94a3b8",
              },
            });
          }

          if (!field.isHidden) {
            previousNodeId = nodeId;
          }
        });
      });

    // Second pass: Conditional edges
    formData
      ?.filter((section: any) => !section?.isFieldDeleted && !section?.isDeleted)
      ?.forEach((section: any) => {
        section?.formData
          ?.filter((field: any) => !field?.isFieldDeleted && !field?.isDeleted)
          ?.forEach((field: any) => {
            if (field.isHidden && field.visibilityDependentFields?.length > 0) {
              field.visibilityDependentFields.forEach((dep: any) => {
                const depId = typeof dep === "object" ? dep.id || dep.value : dep;
                if (!depId) return;
                const op = typeof dep === "object" ? dep.operator || "equals" : "equals";
                const val = typeof dep === "object" ? dep.fieldValue ?? "" : "";
                edges.push({
                  id: `e-cond-${depId}-${field.id}`,
                  source: depId,
                  target: field.id,
                  type: "smoothstep",
                  animated: true,
                  label: `if ${op} '${val}'`,
                  labelStyle: {
                    fill: "#d97706",
                    fontWeight: 700,
                    fontSize: 11,
                  },
                  labelBgStyle: {
                    fill: "#fffbeb",
                    stroke: "#fcd34d",
                    strokeWidth: 1.5,
                    rx: 6,
                    ry: 6,
                  },
                  labelBgPadding: [8, 5],
                  style: {
                    stroke: "#f59e0b",
                    strokeWidth: 2.5,
                    strokeDasharray: "5,5",
                  },
                  markerEnd: {
                    type: MarkerType.ArrowClosed,
                    width: 18,
                    height: 18,
                    color: "#f59e0b",
                  },
                });
              });
            }

            if (field.filterByFieldId) {
              edges.push({
                id: `e-filter-${field.filterByFieldId}-${field.id}`,
                source: field.filterByFieldId,
                target: field.id,
                type: "smoothstep",
                animated: true,
                label: "filters options",
                labelStyle: {
                  fill: "#4f46e5",
                  fontWeight: 700,
                  fontSize: 11,
                },
                labelBgStyle: {
                  fill: "#eef2ff",
                  stroke: "#c7d2fe",
                  strokeWidth: 1.5,
                  rx: 6,
                  ry: 6,
                },
                labelBgPadding: [8, 5],
                style: {
                  stroke: "#6366f1",
                  strokeWidth: 2.5,
                  strokeDasharray: "4,4",
                },
                markerEnd: {
                  type: MarkerType.ArrowClosed,
                  width: 18,
                  height: 18,
                  color: "#6366f1",
                },
              });
            }
          });
      });

    return { nodes, edges };
  }, [formData]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  React.useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  return (
    <div className="w-full h-full bg-slate-50 relative overflow-hidden flex flex-col">
      {/* Legend Badge Bar */}
      <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-gray-200/80 shadow-xs flex items-center gap-4 text-xs">
        <div className="flex items-center gap-1.5 font-medium text-gray-600">
          <span className="w-2.5 h-0.5 bg-slate-400 rounded-full" />
          <span>Sequential Flow</span>
        </div>
        <div className="flex items-center gap-1.5 font-medium text-amber-600">
          <span className="w-2.5 h-0.5 bg-amber-500 border border-amber-500 rounded-full" />
          <span>Conditional Branch</span>
        </div>
        <div className="flex items-center gap-1.5 font-medium text-indigo-600">
          <span className="w-2.5 h-0.5 bg-indigo-500 rounded-full" />
          <span>Filter Link</span>
        </div>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-right"
        className="w-full h-full"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1.5}
          color="#cbd5e1"
        />
        <Controls
          className="!bg-white !rounded-xl !shadow-sm !border !border-gray-200 overflow-hidden"
          showInteractive={false}
        />
        <MiniMap
          nodeStrokeColor="#cbd5e1"
          nodeColor="#f8fafc"
          maskColor="rgba(241, 245, 249, 0.7)"
          className="!rounded-xl !border !border-gray-200/80 !shadow-sm overflow-hidden"
        />
      </ReactFlow>
    </div>
  );
}
