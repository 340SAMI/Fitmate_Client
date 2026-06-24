// src/component/shared/SectionDivider.jsx
export default function SectionDivider() {
  return (
    <div className="flex items-center gap-3 mx-auto max-w-7xl px-6 lg:px-8">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#8B5CF6]/25" />
      <div className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]" />
      <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#8B5CF6]/25" />
    </div>
  );
}