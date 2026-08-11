import { useEffect, useState, useRef } from 'react';
import { Menu, Search, X, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/axios.js';

const Header = ({ user, onPlay }) => {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchData, setSearchData] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const searchContainerRef = useRef(null);
  const artistMenuRef = useRef(null);

  // Close dropdowns on click outside / Esc key
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setHasSearched(false);
      }
      if (
        artistMenuRef.current &&
        !artistMenuRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setHasSearched(false);
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Search API call with debounce
  useEffect(() => {
    const query = searchQuery.trim();

    if (!query) {
      setSearchData([]);
      setLoading(false);
      setHasSearched(false);
      return;
    }

    const controller = new AbortController();

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await api.post(
          '/music/search',
          { search: query },
          { signal: controller.signal },
        );

        setSearchData(response.data.searchResult || []);
        setHasSearched(true);
      } catch (error) {
        if (error.name !== 'CanceledError' && error.code !== 'ERR_CANCELED') {
          console.error('Search error:', error);
          setSearchData([]);
          setHasSearched(true);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, 400);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [searchQuery]);

  // Pass song to parent player or dispatch custom event
  const handleSongClick = (song) => {
    // console.log('Selected song from search:', song);

    // Call prop if provided
    if (onPlay) {
      onPlay(song);
    }

    // Dispatch global custom event for direct listener compatibility
    window.dispatchEvent(
      new CustomEvent('play-song', {
        detail: song,
      }),
    );

    setSearchData([]);
    setSearchQuery('');
    setHasSearched(false);
  };

  const avatarLetter = user?.username
    ? user.username.charAt(0).toUpperCase()
    : 'U';

  return (
    <header className="w-full border-b border-[#E6DDC6] bg-[#FFFDF7] fixed top-0 z-50">
      <div className="flex items-center justify-between px-4 sm:px-8 py-3 max-w-7xl mx-auto">
        {/* Logo */}
        <span
          onClick={() => navigate('/')}
          className="hidden sm:block text-xl font-bold tracking-tight text-neutral-800 cursor-pointer"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          MusicfyX
        </span>

        {/* Search Bar */}
        <div
          ref={searchContainerRef}
          className="relative flex-1 max-w-md mx-2 sm:mx-6"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />

            <input
              type="text"
              placeholder="Search music..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery.trim() && setHasSearched(true)}
              className="w-full pl-11 pr-10 py-2.5 bg-white/80 border border-[#E6DDC6] rounded-full text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#FFDB58] focus:border-[#FFDB58] transition-all"
            />

            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSearchData([]);
                  setHasSearched(false);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 p-1"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Search Dropdown */}
          {(loading || hasSearched) && (
            <div className="absolute left-0 right-0 z-50 mt-2 rounded-2xl bg-white shadow-xl border border-[#E6DDC6] overflow-hidden">
              {loading ? (
                <div className="flex items-center gap-2 px-4 py-3 text-sm text-neutral-500">
                  <Loader2 className="h-4 w-4 animate-spin text-[#FFDB58]" />
                  <span>Searching...</span>
                </div>
              ) : searchData.length > 0 ? (
                <ul className="py-1 max-h-80 overflow-y-auto">
                  {searchData.map((song) => (
                    <li key={song._id}>
                      <button
                        type="button"
                        onClick={() => handleSongClick(song)}
                        className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-neutral-700 transition hover:bg-[#FFF8DC]"
                      >
                        {song.banner ? (
                          <img
                            src={song.banner}
                            alt={song.title}
                            className="h-10 w-10 rounded-xl object-cover shrink-0"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-xl bg-[#E6DDC6] shrink-0" />
                        )}

                        <div className="min-w-0 flex-1">
                          <p className="font-medium truncate text-neutral-800">
                            {song.title}
                          </p>
                          <p className="text-xs text-neutral-500 truncate">
                            {song.artist?.username || 'Artist'}
                          </p>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-4 py-3 text-sm text-neutral-500">
                  No music found matching "{searchQuery}"
                </div>
              )}
            </div>
          )}
        </div>

        {/* User Profile + Menu */}
        <div className="flex items-center gap-3">
          <span className="hidden sm:block text-sm font-medium text-neutral-700">
            {user?.username || 'User'}
          </span>

          <button
            onClick={() => navigate('/me')}
            type="button"
            aria-label="User Profile"
            className="rounded-full focus:outline-none focus:ring-2 focus:ring-[#FFDB58]"
          >
            <div className="w-10 h-10 rounded-full bg-[#FFDB58] text-neutral-800 border border-[#E6DDC6] flex items-center justify-center font-bold shadow-sm hover:scale-105 transition">
              {avatarLetter}
            </div>
          </button>

          {user?.role === 'artist' && (
            <div ref={artistMenuRef} className="relative">
              <button
                type="button"
                onClick={() => setShowDropdown((prev) => !prev)}
                className="p-2 rounded-lg hover:bg-[#F5EEDC] transition"
              >
                <Menu className="w-6 h-6 text-neutral-700" />
              </button>

              {showDropdown && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-[#E6DDC6] rounded-xl shadow-lg overflow-hidden z-50">
                  <ul className="py-1">
                    <li>
                      <button
                        type="button"
                        onClick={() => {
                          setShowDropdown(false);
                          navigate('/upload-music');
                        }}
                        className="w-full text-left px-4 py-3 text-sm text-neutral-700 hover:bg-[#FFF8DC] transition"
                      >
                        Upload music
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        onClick={() => {
                          setShowDropdown(false);
                          navigate('/create-album');
                        }}
                        className="w-full text-left px-4 py-3 text-sm text-neutral-700 hover:bg-[#FFF8DC] transition"
                      >
                        Create playlist
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
