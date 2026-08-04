const TabNavigation = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-[#E6DDC6] bg-[#FAF7EE] p-1.5 shadow-sm">
      <button
        onClick={() => setActiveTab('music')}
        className={`px-6 py-2.5 rounded-xl font-semibold transition-all border ${
          activeTab === 'music'
            ? 'bg-[#FFDB58] text-neutral-800 border-[#FFDB58] shadow-md'
            : 'bg-white/70 text-neutral-500 border-[#E6DDC6] hover:text-neutral-800 hover:bg-white'
        }`}
      >
        Music
      </button>

      <button
        onClick={() => setActiveTab('album')}
        className={`px-6 py-2.5 rounded-xl font-semibold transition-all border ${
          activeTab === 'album'
            ? 'bg-[#FFDB58] text-neutral-800 border-[#FFDB58] shadow-md'
            : 'bg-white/70 text-neutral-500 border-[#E6DDC6] hover:text-neutral-800 hover:bg-white'
        }`}
      >
        Album
      </button>
    </div>
  );
};

export default TabNavigation;
