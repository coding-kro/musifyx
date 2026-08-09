import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { api } from '../api/axios.js';
import { Upload, Music, Image as ImageIcon, X } from 'lucide-react';

const UploadMusic = () => {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    duration: '',
    year: '',
  });

  const [musicFile, setMusicFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);

  const [musicPreview, setMusicPreview] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);

  const musicInputRef = useRef(null);
  const bannerInputRef = useRef(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Music file select
  const handleMusicChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setMusicFile(file);

    if (musicPreview) {
      URL.revokeObjectURL(musicPreview);
    }

    const previewUrl = URL.createObjectURL(file);
    setMusicPreview(previewUrl);
  };

  // Banner file select
  const handleBannerChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setBannerFile(file);

    if (bannerPreview) {
      URL.revokeObjectURL(bannerPreview);
    }

    const previewUrl = URL.createObjectURL(file);
    setBannerPreview(previewUrl);
  };

  // Clear music
  const clearMusic = () => {
    setMusicFile(null);

    if (musicPreview) {
      URL.revokeObjectURL(musicPreview);
    }

    setMusicPreview(null);

    if (musicInputRef.current) {
      musicInputRef.current.value = '';
    }
  };

  // Clear banner
  const clearBanner = () => {
    setBannerFile(null);

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

    if (!musicFile || !bannerFile) {
      toast.error('Please select music and banner file');
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();

      // req.body
      data.append('title', formData.title);
      data.append('duration', formData.duration);
      data.append('year', formData.year);

      // req.files
      data.append('music', musicFile);
      data.append('banner', bannerFile);

      const response = await api.post('/music/upload', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success(response.data.message || 'Music uploaded successfully');

      // Reset form
      setFormData({
        title: '',
        duration: '',
        year: '',
      });

      clearMusic();
      clearBanner();
    } catch (error) {
      console.error('Upload Error:', error);

      toast.error(error.response?.data?.message || 'Music upload failed');
    } finally {
      setLoading(false);
    }
  };

  // Cleanup preview URLs when component unmounts
  useEffect(() => {
    return () => {
      if (musicPreview) {
        URL.revokeObjectURL(musicPreview);
      }

      if (bannerPreview) {
        URL.revokeObjectURL(bannerPreview);
      }
    };
  }, [musicPreview, bannerPreview]);

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
              Upload Music
            </h1>
            <p className="text-sm text-neutral-500">Add your new song</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="text-sm text-neutral-600">Song Title</label>

            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Song name"
              className="mt-1 w-full rounded-full border border-neutral-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-[#FFDB58]"
              required
            />
          </div>

          {/* Duration */}
          <div>
            <label className="text-sm text-neutral-600">Duration</label>

            <input
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder="03:45"
              className="mt-1 w-full rounded-full border border-neutral-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-[#FFDB58]"
              required
            />
          </div>

          {/* Year */}
          <div>
            <label className="text-sm text-neutral-600">Release Year</label>

            <input
              name="year"
              value={formData.year}
              onChange={handleChange}
              placeholder="2026"
              type="number"
              className="mt-1 w-full rounded-full border border-neutral-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-[#FFDB58]"
              required
            />
          </div>

          {/* Music File */}
          <div>
            <label className="text-sm text-neutral-600">Music File</label>

            <input
              ref={musicInputRef}
              type="file"
              accept="audio/*"
              onChange={handleMusicChange}
              className="mt-2 w-full text-sm"
              required={!musicFile}
            />

            {/* Music Preview */}
            {musicFile && musicPreview && (
              <div className="mt-3 rounded-xl border border-neutral-200 bg-neutral-100 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex min-w-0 items-center gap-2">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FFDB58]">
                      <Music size={18} />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-neutral-800">
                        {musicFile.name}
                      </p>

                      <p className="text-xs text-neutral-500">
                        {(musicFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={clearMusic}
                    className="rounded-full p-2 text-red-500 transition hover:bg-red-100"
                  >
                    <X size={18} />
                  </button>
                </div>

                <audio src={musicPreview} controls className="w-full" />
              </div>
            )}
          </div>

          {/* Banner */}
          <div>
            <label className="text-sm text-neutral-600">Banner Image</label>

            <input
              ref={bannerInputRef}
              type="file"
              accept="image/*"
              onChange={handleBannerChange}
              className="mt-2 w-full text-sm"
              required={!bannerFile}
            />

            {/* Banner Preview */}
            {bannerFile && bannerPreview && (
              <div className="relative mt-3 overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100">
                <img
                  src={bannerPreview}
                  alt="Banner preview"
                  className="h-56 w-full object-cover"
                />

                <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between bg-black/50 p-3 backdrop-blur-sm">
                  <div className="flex min-w-0 items-center gap-2 text-white">
                    <ImageIcon size={18} />

                    <span className="truncate text-sm">{bannerFile.name}</span>
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

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#FFDB58] py-3 font-semibold text-neutral-800 transition hover:bg-[#f5cf4a] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Uploading...' : 'Upload Music'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadMusic;
