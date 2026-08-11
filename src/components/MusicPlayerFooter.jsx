import { useEffect, useRef, useState } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Volume1,
  ChevronDown,
} from 'lucide-react';

const MusicPlayerFooter = ({ song, onNext, onPrevious }) => {
  const audioRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  //  API fields

  const audioUrl = song?.uri;
  const cover = song?.banner;
  const title = song?.title || 'Unknown Song';
  const artist = song?.artist?.username || 'Unknown Artist';

  const onNextRef = useRef(onNext);
  const onPreviousRef = useRef(onPrevious);

  useEffect(() => {
    onNextRef.current = onNext;
  }, [onNext]);

  useEffect(() => {
    onPreviousRef.current = onPrevious;
  }, [onPrevious]);

  //  Load and automatically play selected song.
  useEffect(() => {
    const audio = audioRef.current;

    if (!audio || !song || !audioUrl) {
      return;
    }

    let cancelled = false;

    const loadSong = async () => {
      try {
        // Stop previous song.
        audio.pause();

        // Reset player state.
        setIsPlaying(false);
        setCurrentTime(0);
        setDuration(0);

        //  Set new audio source.
        audio.src = audioUrl;

        // Load the new source.
        audio.load();

        // Wait for browser to process the new source.
        await new Promise((resolve, reject) => {
          const handleCanPlay = () => {
            cleanup();
            resolve();
          };

          const handleError = () => {
            cleanup();
            reject(new Error('Audio could not be loaded.'));
          };

          const cleanup = () => {
            audio.removeEventListener('canplay', handleCanPlay);

            audio.removeEventListener('error', handleError);
          };

          audio.addEventListener('canplay', handleCanPlay, { once: true });

          audio.addEventListener('error', handleError, { once: true });
        });

        //  Song changed while loading.
        if (cancelled) {
          return;
        }

        // Automatically start the selected song.
        await audio.play();

        if (!cancelled) {
          setIsPlaying(true);
        }
      } catch (error) {
        if (error?.name === 'AbortError' || cancelled) {
          return;
        }

        console.error('Unable to play audio:', error);

        if (!cancelled) {
          setIsPlaying(false);
        }
      }
    };

    loadSong();

    // Cleanup when song changes/unmounts.
    return () => {
      cancelled = true;
      audio.pause();
    };
  }, [song, audioUrl]);

  // Audio event listeners.

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      if (Number.isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);

      // Ask MusicPage for the next song.
      if (onNextRef.current) {
        onNextRef.current();
      }
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleError = () => {
      // Ignore empty source errors.
      if (!audio.src) {
        return;
      }

      console.error('Audio element error:', audio.error);

      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);

    audio.addEventListener('ended', handleEnded);

    audio.addEventListener('play', handlePlay);

    audio.addEventListener('pause', handlePause);

    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);

      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);

      audio.removeEventListener('ended', handleEnded);

      audio.removeEventListener('play', handlePlay);

      audio.removeEventListener('pause', handlePause);

      audio.removeEventListener('error', handleError);
    };
  }, []);

  // Volume
  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    audio.volume = isMuted ? 0 : volume / 100;
  }, [volume, isMuted]);

  // Play / Pause
  const togglePlay = async () => {
    const audio = audioRef.current;

    if (!audio || !song || !audioUrl) {
      return;
    }

    try {
      if (audio.paused) {
        await audio.play();
      } else {
        audio.pause();
      }
    } catch (error) {
      if (error?.name === 'AbortError') {
        return;
      }

      console.error('Playback error:', error);
    }
  };

  // Seek
  const handleSeek = (e) => {
    const value = Number(e.target.value);
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    audio.currentTime = value;
    setCurrentTime(value);
  };

  // Volume
  const handleVolumeChange = (e) => {
    const value = Number(e.target.value);

    setVolume(value);
    setIsMuted(value === 0);
  };

  // Mute
  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  //  Previous
  const handlePrevious = () => {
    if (onPreviousRef.current) {
      onPreviousRef.current();
    }
  };

  // Next
  const handleNext = () => {
    if (onNextRef.current) {
      onNextRef.current();
    }
  };

  // Format time
  const formatTime = (seconds) => {
    if (!Number.isFinite(seconds) || seconds < 0) {
      return '0:00';
    }

    const minutes = Math.floor(seconds / 60);
    const remaining = Math.floor(seconds % 60);

    return `${minutes}:${remaining < 10 ? '0' : ''}${remaining}`;
  };

  // Progress
  const progress =
    duration > 0 ? Math.min((currentTime / duration) * 100, 100) : 0;

  // Volume icon
  const renderVolumeIcon = () => {
    if (isMuted || volume === 0) {
      return <VolumeX className="h-5 w-5" />;
    }

    if (volume < 50) {
      return <Volume1 className="h-5 w-5" />;
    }

    return <Volume2 className="h-5 w-5" />;
  };

  // Slider
  const Slider = () => (
    <input
      type="range"
      min="0"
      max={duration || 0}
      value={Math.min(currentTime, duration || 0)}
      onChange={handleSeek}
      style={{
        background: `linear-gradient(
          to right,
          #FFDB58 ${progress}%,
          #E6DDC6 ${progress}%
        )`,
      }}
      className="
        h-1
        flex-1
        cursor-pointer
        appearance-none
        rounded-full
        [&::-webkit-slider-thumb]:h-3
        [&::-webkit-slider-thumb]:w-3
        [&::-webkit-slider-thumb]:appearance-none
        [&::-webkit-slider-thumb]:rounded-full
        [&::-webkit-slider-thumb]:bg-[#FFDB58]
      "
    />
  );

  // Don't render player before song selection.
  if (!song) {
    return null;
  }

  return (
    <>
      {/* REAL AUDIO ELEMENT */}
      <audio ref={audioRef} preload="auto" />

      {/* MOBILE PLAYER */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-[#FAF7EE] p-6">
          {/* Close */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="mb-6 flex w-fit items-center gap-2 text-neutral-500"
          >
            <ChevronDown className="h-6 w-6" />
            <span>Close</span>
          </button>

          {/* Cover */}
          <div className="flex flex-1 flex-col items-center justify-center gap-6">
            {cover ? (
              <img
                src={cover}
                alt={title}
                className="h-64 w-64 rounded-3xl object-cover shadow-xl min-[425px]:h-80 min-[425px]:w-80 min-[1024px]:h-120 min-[1024px]:w-120"
              />
            ) : (
              <div className="flex h-64 w-64 items-center justify-center rounded-3xl bg-[#E6DDC6]">
                <Play className="h-16 w-16 text-neutral-500" />
              </div>
            )}

            <div className="text-center">
              <h3 className="text-xl font-bold text-neutral-800">{title}</h3>

              <p className="text-sm text-neutral-500">{artist}</p>
            </div>
          </div>

          {/* Progress */}
          <div className="mb-6 flex items-center gap-3">
            <span className="w-10 text-xs font-mono text-neutral-500">
              {formatTime(currentTime)}
            </span>

            <Slider />

            <span className="w-10 text-xs font-mono text-neutral-500">
              {formatTime(duration)}
            </span>
          </div>

          {/* Controls */}
          <div className="mb-8 flex justify-center gap-8">
            <button onClick={handlePrevious} className="text-neutral-700">
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

            <button onClick={handleNext} className="text-neutral-700">
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
            className="flex min-w-0 flex-1 cursor-pointer items-center gap-3"
          >
            {cover ? (
              <img
                src={cover}
                alt={title}
                className="h-12 w-12 rounded-xl object-cover"
              />
            ) : (
              <div className="h-12 w-12 rounded-xl bg-[#E6DDC6]" />
            )}

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-neutral-800">
                {title}
              </p>

              <p className="truncate text-xs text-neutral-500">{artist}</p>
            </div>
          </div>

          {/* CONTROLS */}
          <div className="flex max-w-xl flex-1 flex-col items-center">
            <div className="flex items-center gap-5">
              <button onClick={handlePrevious} className="hidden sm:block">
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

              <button onClick={handleNext}>
                <SkipForward className="h-5 w-5" />
              </button>
            </div>

            <div className="flex w-full items-center gap-2">
              <span className="hidden text-xs font-mono text-neutral-500 sm:block">
                {formatTime(currentTime)}
              </span>

              <Slider />

              <span className="hidden text-xs font-mono text-neutral-500 sm:block">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* VOLUME */}
          <div className="hidden flex-1 items-center justify-end gap-3 md:flex">
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
