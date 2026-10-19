import React, { useState, useMemo } from "react";
import AppIcon from "../ui/AppIcon";

const CATEGORIES = [
  "All",
  "Feedback & CSAT",
  "Registration",
  "Onboarding",
  "Support & Operations",
];

const categoryMapping: Record<string, string> = {
  "tpl-1": "Registration",
  "tpl-2": "Feedback & CSAT",
  "tpl-3": "Registration",
  "tpl-4": "Onboarding",
  "tpl-5": "Feedback & CSAT",
  "tpl-6": "Support & Operations",
  "tpl-7": "Support & Operations",
  "tpl-8": "Onboarding",
  "tpl-9": "Support & Operations",
  "tpl-10": "Feedback & CSAT",
};

const categoryBadges: Record<string, { bg: string; text: string; border: string }> = {
  "Feedback & CSAT": { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  Registration: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  Onboarding: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  "Support & Operations": { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
};

const TemplateSelectorModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  templates: any[];
  onSelect: (template: any) => void;
}> = ({ isOpen, onClose, templates, onSelect }) => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTemplates = useMemo(() => {
    if (!templates) return [];
    return templates.filter((t) => {
      const cat = categoryMapping[t.id] || "General";
      const matchesCategory =
        selectedCategory === "All" || cat === selectedCategory;
      const matchesSearch =
        !searchQuery ||
        t.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [templates, selectedCategory, searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[999] cursor-default p-4 select-none animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-gray-100 relative flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-100 flex flex-col gap-4 bg-gradient-to-b from-gray-50/50 to-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                <AppIcon icon="solar:document-add-bold-duotone" iconClass="text-2xl" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-gray-900">
                    Template Gallery
                  </h2>
                  <span className="px-2 py-0.5 text-xs font-semibold bg-gray-100 text-gray-600 rounded-full">
                    {templates?.length || 0} prebuilt
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  Kickstart your form with professionally designed templates
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
              title="Close modal"
            >
              <AppIcon icon="tabler:x" iconClass="text-xl" />
            </button>
          </div>

          {/* Search & Categories Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <AppIcon
                icon="lucide:search"
                iconClass="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
              />
              <input
                type="text"
                placeholder="Search templates by title or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 text-xs rounded-xl bg-gray-50/80 border border-gray-200 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <AppIcon icon="tabler:x" iconClass="text-xs" />
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                      isActive
                        ? "bg-indigo-600 text-white shadow-xs shadow-indigo-200"
                        : "bg-gray-100/80 text-gray-600 hover:bg-gray-200/70"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Gallery Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredTemplates?.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTemplates.map((template) => {
                const cat = categoryMapping[template.id] || "General";
                const badge = categoryBadges[cat] || {
                  bg: "bg-gray-100",
                  text: "text-gray-700",
                  border: "border-gray-200",
                };
                const totalFields = template.sections?.reduce(
                  (acc: number, s: any) => acc + (s.formData?.length || 0),
                  0
                );
                const totalSections = template.sections?.length || 1;

                return (
                  <div
                    key={template.id}
                    onClick={() => {
                      onSelect(template);
                      onClose();
                    }}
                    className="group border border-gray-200 hover:border-indigo-500 bg-white hover:bg-gradient-to-br hover:from-white hover:to-indigo-50/20 rounded-xl p-5 cursor-pointer shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <span
                          className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${badge.bg} ${badge.text} ${badge.border}`}
                        >
                          {cat}
                        </span>
                        <div className="flex items-center gap-2 text-[11px] text-gray-400 font-medium">
                          <span>
                            {totalSections} {totalSections === 1 ? "section" : "sections"}
                          </span>
                          <span>•</span>
                          <span>{totalFields} fields</span>
                        </div>
                      </div>

                      <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors text-sm mb-1.5 flex items-center justify-between">
                        {template.name}
                      </h3>

                      {template.description && (
                        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                          {template.description}
                        </p>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                      <div className="flex -space-x-1">
                        {template.sections?.[0]?.formData?.slice(0, 4).map((f: any, idx: number) => (
                          <span
                            key={idx}
                            className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 border-2 border-white text-[10px] text-gray-600 font-bold uppercase"
                            title={f.inputLabel || f.type}
                          >
                            {f.type?.[0] || "F"}
                          </span>
                        ))}
                      </div>

                      <span className="text-xs font-semibold text-indigo-600 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                        Use Template
                        <AppIcon icon="solar:arrow-right-linear" iconClass="text-sm" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-16 text-center flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 mb-3">
                <AppIcon icon="solar:magnifer-linear" iconClass="text-2xl" />
              </div>
              <h4 className="text-sm font-semibold text-gray-800">
                No templates found
              </h4>
              <p className="text-xs text-gray-400 mt-1 max-w-sm">
                No templates matched "{searchQuery}". Try searching for another term or selecting "All" categories.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("All");
                  setSearchQuery("");
                }}
                className="mt-4 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
              >
                Reset filters
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs text-gray-500">
            Selected template sections and fields will be appended to your active form.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all shadow-xs"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default TemplateSelectorModal;
