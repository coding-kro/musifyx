import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { api } from '../api/axios.js';
import { Upload, Image as ImageIcon, X } from 'lucide-react';

const CreateAlbum = () => {
  const [songs, setSongs] = useState([]);
  const [selectedSongs, setSelectedSongs] = useState([]);

  const [loading, setLoading] = useState(false);

  const [albumData, setAlbumData] = useState({
    title: '',
    year: '',
  });

  const [banner, setBanner] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);

  const bannerInputRef = useRef(null);

  // Get all music
  useEffect(() => {
    const fetchMusic = async () => {
      try {
        const response = await api.get('/music');
        setSongs(response.data?.musics || []);
      } catch (error) {
        console.error(error);
        toast.error('Failed to load music');
      }
    };

    fetchMusic();
  }, []);

  const handleChange = (e) => {
    setAlbumData({
      ...albumData,
      [e.target.name]: e.target.value,
    });
  };

  const toggleSong = (id) => {
    setSelectedSongs((prev) => {
      if (prev.includes(id)) {
        return prev.filter((songId) => songId !== id);
      }

      return [...prev, id];
    });
  };

  // Banner select
  const handleBannerChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setBanner(file);

    if (bannerPreview) {
      URL.revokeObjectURL(bannerPreview);
    }

    const previewUrl = URL.createObjectURL(file);
    setBannerPreview(previewUrl);
  };

  // Clear banner
  const clearBanner = () => {
    setBanner(null);

    if (bannerPreview) {
      URL.revokeObjectURL(bannerPreview);
    }

    setBannerPreview(null);

    if (bannerInputRef.current) {
      bannerInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!banner) {
      toast.error('Please select album banner');
      return;
    }

    if (selectedSongs.length === 0) {
      toast.error('Select at least one song');
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();

      // req.body
      data.append('title', albumData.title);
      data.append('year', albumData.year);

      // Array of music IDs
      selectedSongs.forEach((id) => {
        data.append('musics', id);
      });

      // req.file
      data.append('banner', banner);

      const response = await api.post('/music/album', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success(response.data.message || 'Album created successfully');

      // Reset form
      setAlbumData({
        title: '',
        year: '',
      });

      setSelectedSongs([]);

      // Reset banner
      clearBanner();
    } catch (error) {
      console.error('Album Create Error:', error);

      toast.error(error.response?.data?.message || 'Album creation failed');
    } finally {
      setLoading(false);
    }
  };

  // Cleanup preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (bannerPreview) {
        URL.revokeObjectURL(bannerPreview);
      }
    };
  }, [bannerPreview]);

  return (
    <div className="min-h-screen bg-neutral-50 p-6 mt-12">
      <div className="mx-auto max-w-2xl rounded-2xl bg-white p-6 shadow-sm">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#FFDB58]">
            <Upload size={20} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-neutral-800">
              Create Album
            </h1>
            <p className="text-sm text-neutral-500">
              Select songs and create collection
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Album Title */}
          <div>
            <label className="text-sm text-neutral-600">Album Title</label>

            <input
              name="title"
              value={albumData.title}
              onChange={handleChange}
              placeholder="Album title"
              className="mt-1 w-full rounded-full border border-neutral-200 bg-white px-5 py-3 outline-none focus:ring-2 focus:ring-[#FFDB58]"
              required
            />
          </div>

          {/* Year */}
          <div>
            <label className="text-sm text-neutral-600">Release Year</label>

            <input
              name="year"
              type="number"
              value={albumData.year}
              onChange={handleChange}
              placeholder="Release year"
              className="mt-1 w-full rounded-full border border-neutral-200 bg-white px-5 py-3 outline-none focus:ring-2 focus:ring-[#FFDB58]"
              required
            />
          </div>

          {/* Banner */}
          <div>
            <label className="text-sm text-neutral-600">Album Banner</label>

            <input
              ref={bannerInputRef}
              type="file"
              accept="image/*"
              onChange={handleBannerChange}
              className="mt-2 w-full text-sm"
              required={!banner}
            />

            {/* Banner Preview */}
            {banner && bannerPreview && (
              <div className="relative mt-3 overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100">
                <img
                  src={bannerPreview}
                  alt="Album banner preview"
                  className="h-56 w-full object-cover"
                />

                {/* Bottom overlay */}
                <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between bg-black/50 p-3 backdrop-blur-sm">
                  <div className="flex min-w-0 items-center gap-2 text-white">
                    <ImageIcon size={18} />
                    <span className="truncate text-sm">{banner.name}</span>
                  </div>

                  <button
                    type="button"
                    onClick={clearBanner}
                    className="rounded-full bg-white/20 p-2 text-white transition hover:bg-red-500"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Music Selection */}
          <div>
            <h3 className="mb-3 font-semibold text-neutral-700">
              Select Songs
            </h3>

            {songs.length === 0 ? (
              <div className="rounded-xl bg-neutral-100 p-6 text-center text-sm text-neutral-500">
                No music available
              </div>
            ) : (
              <div className="max-h-80 space-y-2 overflow-y-auto">
                {songs.map((song) => (
                  <label
                    key={song._id}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border bg-white p-3 transition ${selectedSongs.includes(song._id) ? 'border-[#FFDB58] bg-yellow-50' : 'border-neutral-200 hover:border-[#FFDB58]'}`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedSongs.includes(song._id)}
                      onChange={() => toggleSong(song._id)}
                      className="h-4 w-4 accent-[#FFDB58]"
                    />

                    <img
                      src={song.banner}
                      alt={song.title}
                      className="h-10 w-10 rounded-lg object-cover"
                    />

                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-neutral-800">
                        {song.title}
                      </p>

                      {song.duration && (
                        <p className="text-xs text-neutral-500">
                          {song.duration}
                        </p>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            )}

            {/* Selected count */}
            {selectedSongs.length > 0 && (
              <p className="mt-2 text-sm text-neutral-500">
                {selectedSongs.length}{' '}
                {selectedSongs.length === 1 ? 'song' : 'songs'} selected
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#FFDB58] py-3 font-semibold text-neutral-800 transition hover:bg-[#f5cf4a] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Album'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateAlbum;
