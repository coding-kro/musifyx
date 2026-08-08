export default function Logout({ onClick }) {
  return (
    <button
      onClick={onClick}
      type="button"
      className="group w-full flex items-center justify-center gap-2 py-3 px-4 bg-white/80 border border-[#E6DDC6] text-neutral-700 hover:bg-[#FFF1F1] hover:border-red-200 hover:text-red-600 rounded-xl font-semibold transition-all duration-300 active:scale-95 focus:outline-none focus:ring-4 focus:ring-red-200/40 shadow-sm"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="transition-transform duration-300 group-hover:translate-x-1"
      >
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
      </svg>
      Sign Out
    </button>
  );
}
