import { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Volume1,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';

const TRACKS = [
  {
    id: 1,
    title: 'Midnight City Beats',
    artist: 'Luna Waves',
    cover:
      'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&w=150&q=80',
    duration: 215,
  },
  {
    id: 2,
    title: 'Neon Drift',
    artist: 'Solaris',
    cover:
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=150&q=80',
    duration: 184,
  },
  {
    id: 3,
    title: 'Acoustic Horizon',
    artist: 'Ember Creek',
    cover:
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=150&q=80',
    duration: 240,
  },
];

const MusicPlayerFooter = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const timerRef = useRef(null);

  const currentTrack = TRACKS[currentTrackIndex];

  const progress = (currentTime / currentTrack.duration) * 100;

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '0:00';

    const minutes = Math.floor(seconds / 60);
    const remaining = Math.floor(seconds % 60);

    return `${minutes}:${remaining < 10 ? '0' : ''}${remaining}`;
  };

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= currentTrack.duration) {
            handleNextTrack();
            return 0;
          }

          return prev + 1;
        });
      }, 1000);
    }

    return () => clearInterval(timerRef.current);
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleNextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);

    setCurrentTime(0);
  };

  const handlePrevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);

    setCurrentTime(0);
  };

  const handleSeek = (e) => {
    setCurrentTime(Number(e.target.value));
  };

  const handleVolumeChange = (e) => {
    const value = Number(e.target.value);

    setVolume(value);
    setIsMuted(value === 0);
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  const renderVolumeIcon = () => {
    if (isMuted || volume === 0) return <VolumeX className="h-5 w-5" />;

    if (volume < 50) return <Volume1 className="h-5 w-5" />;

    return <Volume2 className="h-5 w-5" />;
  };

  const Slider = () => (
    <input
      type="range"
      min="0"
      max={currentTrack.duration}
      value={currentTime}
      onChange={handleSeek}
      style={{
        background: `linear-gradient(to right,#FFDB58 ${progress}%,#E6DDC6 ${progress}%)`,
      }}
      className="
        flex-1
        h-1
        rounded-full
        appearance-none
        cursor-pointer
        [&::-webkit-slider-thumb]:appearance-none
        [&::-webkit-slider-thumb]:w-3
        [&::-webkit-slider-thumb]:h-3
        [&::-webkit-slider-thumb]:rounded-full
        [&::-webkit-slider-thumb]:bg-[#FFDB58]
      "
    />
  );

  return (
    <>
      {/* MOBILE PLAYER */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-between bg-[#FAF7EE] p-6 text-neutral-800 md:hidden">
          <button
            onClick={() => setIsMobileOpen(false)}
            className="text-neutral-500"
          >
            <ChevronDown className="h-7 w-7" />
          </button>

          <div className="flex flex-col items-center gap-6">
            <img
              src={currentTrack.cover}
              alt={currentTrack.title}
              className="h-64 w-64 rounded-3xl object-cover shadow-xl"
            />

            <div className="text-center">
              <h3 className="text-xl font-bold">{currentTrack.title}</h3>

              <p className="text-sm text-neutral-500">{currentTrack.artist}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="w-10 text-xs font-mono text-neutral-500">
              {formatTime(currentTime)}
            </span>

            <Slider />

            <span className="w-10 text-xs font-mono text-neutral-500">
              {formatTime(currentTrack.duration)}
            </span>
          </div>

          <div className="flex justify-center gap-8">
            <button onClick={handlePrevTrack}>
              <SkipBack />
            </button>

            <button
              onClick={togglePlay}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FFDB58]"
            >
              {isPlaying ? (
                <Pause className="fill-current" />
              ) : (
                <Play className="ml-1 fill-current" />
              )}
            </button>

            <button onClick={handleNextTrack}>
              <SkipForward />
            </button>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#E6DDC6] bg-[#FAF7EE]/95 px-3 py-3 shadow-xl backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-4">
          {/* TRACK INFO */}
          <div
            onClick={() => setIsMobileOpen(true)}
            className="flex min-w-0 flex-1 items-center gap-3 cursor-pointer"
          >
            <img
              src={currentTrack.cover}
              alt=""
              className="h-12 w-12 rounded-xl object-cover"
            />

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-neutral-800">
                {currentTrack.title}
              </p>

              <p className="text-xs text-neutral-500">{currentTrack.artist}</p>
            </div>
          </div>

          {/* CONTROLS */}
          <div className="flex flex-1 max-w-xl flex-col items-center">
            <div className="flex items-center gap-5">
              <button onClick={handlePrevTrack} className="hidden sm:block">
                <SkipBack className="h-5 w-5" />
              </button>

              <button
                onClick={togglePlay}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFDB58]"
              >
                {isPlaying ? (
                  <Pause className="fill-current" />
                ) : (
                  <Play className="ml-1 fill-current" />
                )}
              </button>

              <button onClick={handleNextTrack}>
                <SkipForward className="h-5 w-5" />
              </button>
            </div>

            <div className="flex w-full items-center gap-2">
              <span className="hidden sm:block text-xs font-mono text-neutral-500">
                {formatTime(currentTime)}
              </span>

              <Slider />

              <span className="hidden sm:block text-xs font-mono text-neutral-500">
                {formatTime(currentTrack.duration)}
              </span>
            </div>
          </div>

          {/* VOLUME */}
          <div className="hidden md:flex flex-1 justify-end items-center gap-3">
            <button onClick={toggleMute}>{renderVolumeIcon()}</button>

            <input
              type="range"
              min="0"
              max="100"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-24 accent-[#FFDB58]"
            />
          </div>
        </div>
      </footer>
    </>
  );
};

export default MusicPlayerFooter;
