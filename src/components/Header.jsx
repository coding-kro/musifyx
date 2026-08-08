import { useState } from 'react';
import { Menu, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header = ({ user }) => {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  const avatarLetter = user?.username
    ? user.username.charAt(0).toUpperCase()
    : 'U';

  return (
    <header className="w-full border-b border-[#E6DDC6] bg-[#FFFDF7]">
      <div className="flex items-center justify-evenly px-4 py-3">
        {/* Logo */}
        <span
          onClick={() => navigate('/')}
          className="hidden sm:block text-xl font-bold tracking-tight text-neutral-800"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          MusicfyX
        </span>

        {/* Search */}
        <div className="flex-1 max-w-md mx-2 sm:mx-6">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />

            <input
              type="text"
              placeholder="Search music..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-white/80 border border-[#E6DDC6] rounded-full text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#FFDB58] focus:border-[#FFDB58] transition-all"
            />
          </form>
        </div>

        {/* User + Menu */}
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

          {/* Artist Menu */}
          {user?.role === 'artist' && (
            <div className="relative lg:fixed lg:right-4">
              <button
                type="button"
                onClick={() => setShowDropdown((prev) => !prev)}
                aria-label="Artist menu"
                aria-expanded={showDropdown}
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
