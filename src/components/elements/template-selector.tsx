import React from "react";
import AppIcon from "../ui/AppIcon";

const TemplateSelectorModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  templates: any[];
  onSelect: (template: any) => void;
}> = ({ isOpen, onClose, templates, onSelect }) => {

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-[999] cursor-default no-drag select-none">
      <div className="min-w-[600px] bg-white rounded-xl shadow-xl relative flex flex-col items-center">
        {/* Header */}
        <div className="w-full px-6 pt-6 pb-5 flex flex-col items-start gap-4 z-10 border-b">
          <h2 className="text-lg font-semibold text-[#475467] font-onest">
            Select a Template
          </h2>
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-2 text-[#98A2B3] hover:bg-gray-50 rounded-lg"
          >
            <AppIcon icon="tabler:x" />
          </button>
        </div>

        {/* Content */}
        <div className="w-full max-h-[60vh] overflow-y-auto px-6 py-4 flex flex-col gap-4">
          {templates?.length ? (
            templates.map((template) => (
              <div
                key={template.id}
                className="p-4 border rounded-lg cursor-pointer hover:border-blue-500 hover:shadow-md transition-all"
                onClick={() => {
                  onSelect(template);
                  onClose();
                }}
              >
                <h3 className="font-semibold text-[#344054] mb-1">{template.name}</h3>
                {template.description && (
                  <p className="text-sm text-[#475467]">{template.description}</p>
                )}
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No templates available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplateSelectorModal;
