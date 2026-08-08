import { useEffect, useState } from 'react';
import TabNavigation from '../components/TabNavigation';
import SongCard from '../components/SongCard';
import AlbumCard from '../components/AlbumCard';
import AlbumBanner from '../components/AlbumBanner';
import AlbumTrackItem from '../components/AlbumTrackItem';
import MusicPlayerFooter from '../components/MusicPlayerFooter';
import { api } from '../api/axios.js';

const MusicPage = () => {
  const [activeTab, setActiveTab] = useState('music');
  const [selectedAlbum, setSelectedAlbum] = useState(null);

  const [songData, setSongData] = useState([]);
  const [albumData, setAlbumData] = useState([]);
  const [albumDetails, setAlbumDetails] = useState(null);

  // Currently playing song
  const [currentSong, setCurrentSong] = useState(null);

  // Current playlist / album songs
  const [currentPlaylist, setCurrentPlaylist] = useState([]);

  // Current song index inside playlist
  const [currentIndex, setCurrentIndex] = useState(-1);

  const [loading, setLoading] = useState(false);

  const handleTabChange = (tab) => {
    setActiveTab(tab);

    if (tab === 'music') {
      setSelectedAlbum(null);
      setAlbumDetails(null);
    }
  };

  /*
   * Play a song.
   *
   * song     = song to play
   * playlist = songs that should play after it
   */
  const handlePlaySong = (song, playlist = songData) => {
    const index = playlist.findIndex(
      (item) => (item._id || item.id) === (song._id || song.id),
    );

    setCurrentSong(song);
    setCurrentPlaylist(playlist);
    setCurrentIndex(index);
  };

  //  Play next song

  const handleNextSong = () => {
    if (!currentPlaylist.length) return;

    const nextIndex = currentIndex + 1;

    // If this was the last song
    if (nextIndex >= currentPlaylist.length) {
      // Keep the last song visible in the footer.
      setCurrentIndex(currentPlaylist.length - 1);
      return;
    }

    const nextSong = currentPlaylist[nextIndex];

    setCurrentIndex(nextIndex);
    setCurrentSong(nextSong);
  };

  //  Play previous song

  const handlePreviousSong = () => {
    if (!currentPlaylist.length) return;

    const previousIndex = currentIndex - 1;

    // If already at first song,
    // keep playing the first song.
    if (previousIndex < 0) {
      setCurrentIndex(0);
      setCurrentSong(currentPlaylist[0]);
      return;
    }

    const previousSong = currentPlaylist[previousIndex];

    setCurrentIndex(previousIndex);
    setCurrentSong(previousSong);
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

  // Songs belonging to currently selected album

  const albumSongs = albumDetails?.musics || selectedAlbum?.musics || [];

  return (
    <div className="min-h-screen bg-[#E5E0D2] mt-14 p-4 sm:p-6 lg:p-8 font-sans">
      <div className="min-h-screen pb-28">
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
                <SongCard
                  key={song._id || song.id}
                  song={song}
                  onPlay={() => handlePlaySong(song, songData)}
                />
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

                {/* ALBUM SONGS */}
                <div className="space-y-3">
                  {albumSongs.length > 0 ? (
                    albumSongs.map((song, index) => (
                      <AlbumTrackItem
                        key={song._id || index}
                        song={song}
                        index={index}
                        onPlay={() => handlePlaySong(song, albumSongs)}
                      />
                    ))
                  ) : (
                    <p className="text-neutral-500">
                      No songs found in this album.
                    </p>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {/* FOOTER MUSIC PLAYER */}
        {currentSong && (
          <MusicPlayerFooter
            song={currentSong}
            onNext={handleNextSong}
            onPrevious={handlePreviousSong}
          />
        )}
      </div>
    </div>
  );
};

export default MusicPage;
