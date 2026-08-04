import { useEffect, useState } from 'react';
import TabNavigation from '../components/TabNavigation';
import SongCard from '../components/SongCard';
import AlbumCard from '../components/AlbumCard';
import AlbumBanner from '../components/AlbumBanner';
import AlbumTrackItem from '../components/AlbumTrackItem';
import { api } from '../api/axios.js';

const MusicPage = () => {
  const [activeTab, setActiveTab] = useState('music');
  const [selectedAlbum, setSelectedAlbum] = useState(null);

  const [songData, setSongData] = useState([]);
  const [albumData, setAlbumData] = useState([]);
  const [albumDetails, setAlbumDetails] = useState(null);

  const [loading, setLoading] = useState(false);

  const handleTabChange = (tab) => {
    setActiveTab(tab);

    if (tab === 'music') {
      setSelectedAlbum(null);
      setAlbumDetails(null);
    }
  };

  // Fetch songs and albums
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [musicRes, albumRes] = await Promise.all([
          api.get('/music'),
          api.get('/music/albums'),
        ]);

        setSongData(musicRes.data?.musics || []);
        setAlbumData(albumRes.data?.albums || []);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch selected album details
  useEffect(() => {
    if (!selectedAlbum?._id) return;

    const fetchAlbumDetails = async () => {
      try {
        setLoading(true);

        const { data } = await api.get(`/music/albums/${selectedAlbum._id}`);

        setAlbumDetails(data.album || null);
      } catch (error) {
        console.error('Error fetching album details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlbumDetails();
  }, [selectedAlbum]);

  return (
    <div className="min-h-screen bg-[#E5E0D2] p-4 sm:p-6 lg:p-8 font-sans">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Main Container */}
        <div className="rounded-3xl border border-white/60 bg-linear-to-br from-[#ECE6D5] via-[#FAF7EE] to-[#EAE3CD] p-5 sm:p-8 shadow-xl">
          {/* Navigation */}
          <TabNavigation activeTab={activeTab} setActiveTab={handleTabChange} />

          {/* Loading */}
          {loading && (
            <div className="py-12 text-center text-neutral-500">Loading...</div>
          )}

          {/* MUSIC TAB */}
          {!loading && activeTab === 'music' && (
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {songData.length > 0 ? (
                songData.map((song) => (
                  <SongCard key={song._id || song.id} song={song} />
                ))
              ) : (
                <p className="text-neutral-500">No songs found.</p>
              )}
            </div>
          )}

          {/* ALBUM TAB */}
          {!loading && activeTab === 'album' && (
            <>
              {!selectedAlbum ? (
                <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {albumData.length > 0 ? (
                    albumData.map((album) => (
                      <AlbumCard
                        key={album._id}
                        album={album}
                        onSelect={() => setSelectedAlbum(album)}
                      />
                    ))
                  ) : (
                    <p className="text-neutral-500">No albums found.</p>
                  )}
                </div>
              ) : (
                <div className="mt-6 space-y-6">
                  <AlbumBanner
                    album={albumDetails || selectedAlbum}
                    onBack={() => {
                      setSelectedAlbum(null);
                      setAlbumDetails(null);
                    }}
                  />

                  <div className="space-y-3">
                    {(albumDetails?.musics || selectedAlbum?.musics || []).map(
                      (song, index) => (
                        <AlbumTrackItem
                          key={song._id || index}
                          song={song}
                          index={index}
                        />
                      ),
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MusicPage;
