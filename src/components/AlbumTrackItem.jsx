const AlbumTrackItem = ({ song, index, onPlay }) => {
  return (
    <div
      onClick={() => onPlay?.(song)}
      className="group flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-[#E6DDC6] bg-linear-to-r from-[#FAF7EE] to-[#F6F1E3] p-3 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:border-[#DCCFA8]"
    >
      <div className="flex min-w-0 flex-1 items-center gap-4">
        {/* Track Number */}
        <span className="w-7 text-center font-mono text-lg font-semibold text-neutral-500">
          {String(index + 1).padStart(2, '0')}
        </span>

        {/* Cover Image */}
        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-[#E6DDC6] bg-[#F4EFD9]">
          <img
            src={song?.banner}
            alt={song?.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>

        {/* Song Name */}
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-neutral-800">
            {song?.title}
          </p>

          <p className="text-xs text-neutral-500">
            {song?.artist?.username || 'Unknown Artist'}
          </p>
        </div>
      </div>

      {/* Duration and Year */}
      <div className="flex items-center gap-3 sm:gap-6 text-sm font-medium text-neutral-600">
        <span className="rounded-full bg-[#FFDB58]/30 px-3 py-1 text-neutral-700">
          {song?.duration || '--:--'}
        </span>

        <span className="hidden w-12 text-right sm:block">
          {song?.year || '--'}
        </span>
      </div>
    </div>
  );
};

export default AlbumTrackItem;
