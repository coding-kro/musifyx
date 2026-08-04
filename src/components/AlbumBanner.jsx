const AlbumBanner = ({ album, onBack }) => {
  const totalSeconds =
    album?.musics?.reduce((sum, music) => {
      if (!music?.duration) return sum;

      const [minutes, seconds] = music.duration.split(':').map(Number);

      return sum + minutes * 60 + seconds;
    }, 0) ?? 0;

  const totalMinutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;

  const totalDuration = `${String(totalMinutes).padStart(2, '0')}:${String(
    remainingSeconds,
  ).padStart(2, '0')}`;

  return (
    <div className="space-y-5">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm font-medium text-neutral-600 transition hover:text-neutral-800"
      >
        ← Back to Albums
      </button>

      {/* Album Banner */}
      <div className="rounded-3xl border border-[#E6DDC6] bg-linear-to-br from-[#FAF7EE] via-[#F6F1E3] to-[#ECE6D5] p-6 shadow-sm">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          {/* Album Image */}
          <div className="h-44 w-44 shrink-0 overflow-hidden rounded-2xl border border-[#E6DDC6] bg-white shadow-md">
            <img
              src={album?.banner}
              alt={album?.title}
              className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>

          {/* Album Info */}
          <div className="flex-1 rounded-2xl border border-[#E6DDC6] bg-white/70 p-6 backdrop-blur-sm">
            <p className="mb-2 text-sm font-medium uppercase tracking-widest text-neutral-500">
              Album
            </p>

            <h2 className="text-4xl font-bold tracking-tight text-neutral-800">
              {album?.title}
            </h2>

            <p className="mt-2 text-neutral-600">
              Created by{' '}
              <span className="font-semibold text-neutral-800">
                {album?.artist?.username || 'Unknown Artist'}
              </span>
            </p>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-xl bg-[#FFDB58]/25 p-4 text-center">
                <p className="text-2xl font-bold text-neutral-800">
                  {album?.musics?.length || 0}
                </p>
                <p className="text-sm text-neutral-600">Songs</p>
              </div>

              <div className="rounded-xl bg-[#FFDB58]/25 p-4 text-center">
                <p className="text-2xl font-bold text-neutral-800">
                  {totalDuration}
                </p>
                <p className="text-sm text-neutral-600">Duration</p>
              </div>

              <div className="rounded-xl bg-[#FFDB58]/25 p-4 text-center">
                <p className="text-2xl font-bold text-neutral-800">
                  {album?.year || '--'}
                </p>
                <p className="text-sm text-neutral-600">Year</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlbumBanner;
