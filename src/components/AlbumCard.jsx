import { Play } from 'lucide-react';

const AlbumCard = ({ album, onSelect }) => {
  return (
    <div
      onClick={onSelect}
      className="group cursor-pointer rounded-2xl border border-[#E6DDC6] bg-linear-to-br from-[#FAF7EE] via-[#F6F1E3] to-[#ECE6D5] p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      {/* Album Cover */}
      <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-[#E6DDC6] bg-[#F4EFD9]">
        <img
          src={album?.banner}
          alt={album?.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Hover Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="flex h-14 w-14 scale-90 items-center justify-center rounded-full bg-[#FFDB58] text-neutral-800 shadow-xl transition-all duration-300 group-hover:scale-100">
            <Play className="ml-0.5 h-6 w-6 fill-current" />
          </div>
        </div>
      </div>

      {/* Album Details */}
      <div className="mt-4 rounded-xl border border-[#E6DDC6] bg-white/70 p-4 backdrop-blur-sm">
        {/* Album Title */}
        <h3 className="truncate text-lg font-semibold text-neutral-800">
          {album?.title}
        </h3>

        {/* Artist */}
        <p className="mt-1 truncate text-sm text-neutral-600">
          by{' '}
          <span className="font-medium text-neutral-800">
            {album?.artist?.username || 'Unknown Artist'}
          </span>
        </p>

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="rounded-full bg-[#FFDB58]/30 px-3 py-1 font-medium text-neutral-700">
            {album?.musics?.length || 0} Songs
          </span>

          <span className="text-neutral-500">{album?.year || 'Unknown'}</span>
        </div>
      </div>
    </div>
  );
};

export default AlbumCard;
