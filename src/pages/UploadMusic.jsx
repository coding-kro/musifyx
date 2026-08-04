import { useState } from 'react';
import toast from 'react-hot-toast';
import { api } from '../api/axios.js';
import { Upload } from 'lucide-react';

const UploadMusic = () => {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    duration: '',
    year: '',
  });

  const [musicFile, setMusicFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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

      setFormData({
        title: '',
        duration: '',
        year: '',
      });

      setMusicFile(null);
      setBannerFile(null);
    } catch (error) {
      console.error('Upload Error:', error);

      toast.error(error.response?.data?.message || 'Music upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#E5E0D2] flex items-center justify-center p-5">
      <div
        className="
        w-full max-w-xl
        bg-[#FAF7EE]
        border border-white/60
        rounded-3xl
        shadow-xl
        p-8
      "
      >
        <div className="flex items-center gap-3 mb-8">
          <div
            className="
            w-12 h-12 rounded-full
            bg-[#FFDB58]
            flex items-center justify-center
          "
          >
            <Upload className="text-neutral-800" />
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
              className="
                mt-1 w-full
                px-4 py-3
                rounded-full
                bg-white
                border border-neutral-200
                outline-none
                focus:ring-2
                focus:ring-[#FFDB58]
              "
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
              className="
                mt-1 w-full
                px-4 py-3
                rounded-full
                bg-white
                border border-neutral-200
                outline-none
                focus:ring-2
                focus:ring-[#FFDB58]
              "
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
              className="
                mt-1 w-full
                px-4 py-3
                rounded-full
                bg-white
                border border-neutral-200
                outline-none
                focus:ring-2
                focus:ring-[#FFDB58]
              "
              required
            />
          </div>

          {/* Music File */}
          <div>
            <label className="text-sm text-neutral-600">Music File</label>

            <input
              type="file"
              accept="audio/*"
              onChange={(e) => setMusicFile(e.target.files[0])}
              className="
                mt-2 w-full
                text-sm
              "
              required
            />
          </div>

          {/* Banner */}
          <div>
            <label className="text-sm text-neutral-600">Banner Image</label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setBannerFile(e.target.files[0])}
              className="
                mt-2 w-full
                text-sm
              "
              required
            />
          </div>

          <button
            disabled={loading}
            className="
              w-full
              py-3
              rounded-full
              bg-[#FFDB58]
              text-neutral-800
              font-semibold
              hover:bg-[#f5cf4a]
              transition
              disabled:opacity-50
            "
          >
            {loading ? 'Uploading...' : 'Upload Music'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadMusic;
