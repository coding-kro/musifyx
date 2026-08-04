import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { api } from '../api/axios.js';
import { Upload } from 'lucide-react';

const CreateAlbum = () => {
  const [songs, setSongs] = useState([]);
  const [selectedSongs, setSelectedSongs] = useState([]);

  const [loading, setLoading] = useState(false);

  const [albumData, setAlbumData] = useState({
    title: '',
    year: '',
  });

  const [banner, setBanner] = useState(null);

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

      // array of music ids

      selectedSongs.forEach((id) => {
        data.append('musics', id);
      });

      // req.file

      data.append('banner', banner);

      const response = await api.post('/music/albums/create', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success(response.data.message || 'Album created successfully');

      setAlbumData({
        title: '',
        year: '',
      });

      setSelectedSongs([]);
      setBanner(null);
    } catch (error) {
      console.error('Album Create Error:', error);

      toast.error(error.response?.data?.message || 'Album creation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
      min-h-screen
      bg-[#E5E0D2]
      p-5
      flex
      justify-center
    "
    >
      <div
        className="
        w-full
        max-w-3xl
        bg-[#FAF7EE]
        rounded-3xl
        shadow-xl
        border
        border-white/60
        p-8
      "
      >
        <div className="flex items-center gap-3 mb-8">
          <div
            className="
            w-12
            h-12
            rounded-full
            bg-[#FFDB58]
            flex
            items-center
            justify-center
          "
          >
            <Upload />
          </div>

          <div>
            <h1
              className="
              text-2xl
              font-bold
              text-neutral-800
            "
            >
              Create Album
            </h1>

            <p
              className="
              text-sm
              text-neutral-500
            "
            >
              Select songs and create collection
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Album Title */}

          <input
            name="title"
            value={albumData.title}
            onChange={handleChange}
            placeholder="Album title"
            className="
              w-full
              px-5
              py-3
              rounded-full
              bg-white
              border
              outline-none
              focus:ring-2
              focus:ring-[#FFDB58]
            "
            required
          />

          {/* Year */}

          <input
            name="year"
            type="number"
            value={albumData.year}
            onChange={handleChange}
            placeholder="Release year"
            className="
              w-full
              px-5
              py-3
              rounded-full
              bg-white
              border
              outline-none
              focus:ring-2
              focus:ring-[#FFDB58]
            "
            required
          />

          {/* Banner */}

          <div>
            <label
              className="
              text-sm
              text-neutral-600
            "
            >
              Album Banner
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setBanner(e.target.files[0])}
              className="
                mt-2
              "
              required
            />
          </div>

          {/* Music Selection */}

          <div>
            <h3
              className="
              font-semibold
              text-neutral-700
              mb-3
            "
            >
              Select Songs
            </h3>

            <div
              className="
              max-h-80
              overflow-y-auto
              space-y-2
            "
            >
              {songs.map((song) => (
                <label
                  key={song._id}
                  className="
                      flex
                      items-center
                      gap-3
                      p-3
                      bg-white
                      rounded-xl
                      border
                      cursor-pointer
                      hover:border-[#FFDB58]
                    "
                >
                  <input
                    type="checkbox"
                    checked={selectedSongs.includes(song._id)}
                    onChange={() => toggleSong(song._id)}
                  />

                  <img
                    src={song.banner}
                    className="
                        w-10
                        h-10
                        rounded-lg
                        object-cover
                      "
                  />

                  <span
                    className="
                      text-neutral-800
                    "
                  >
                    {song.title}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <button
            disabled={loading}
            className="
              w-full
              py-3
              rounded-full
              bg-[#FFDB58]
              font-semibold
              text-neutral-800
              hover:bg-[#f5cf4a]
              transition
            "
          >
            {loading ? 'Creating...' : 'Create Album'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateAlbum;
