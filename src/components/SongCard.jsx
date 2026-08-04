import { Play } from 'lucide-react';

const SongCard = ({ song, onPlay }) => {
  return (
    <div
      onClick={() => onPlay && onPlay(song)}
      className="group cursor-pointer rounded-2xl border border-[#E6DDC6] bg-linear-to-br from-[#FAF7EE] via-[#F6F1E3] to-[#ECE6D5] p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      {/* Song Image */}
      <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-[#E6DDC6] bg-[#F4EFD9]">
        <img
          src={song?.banner}
          alt={song?.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Hover Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <button
            aria-label={`Play ${song?.title}`}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FFDB58] text-neutral-800 shadow-xl transition-all duration-300 group-hover:scale-100 scale-90 hover:bg-[#f5cf4a]"
          >
            <Play className="ml-0.5 h-6 w-6 fill-current" />
          </button>
        </div>
      </div>

      {/* Song Details */}
      <div className="mt-4 rounded-xl border border-[#E6DDC6] bg-white/70 p-3 backdrop-blur-sm">
        <h3 className="truncate text-base font-semibold text-neutral-800">
          {song?.title}
        </h3>

        <div className="mt-2 flex items-center justify-between text-sm text-neutral-500">
          <span>{song?.year || 'Unknown'}</span>

          <span className="rounded-full bg-[#FFDB58]/30 px-2 py-0.5 font-medium text-neutral-700">
            {song?.duration}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SongCard;
