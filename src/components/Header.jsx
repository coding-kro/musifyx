import { useState } from 'react';
import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Example user data
  const user = {
    username: 'Alex Morgan',
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  const avatarLetter = user.username
    ? user.username.charAt(0).toUpperCase()
    : 'U';

  return (
    <header className="sticky top-0 z-50 w-full bg-[#FAF7EE]/95 backdrop-blur-md border-b border-[#E6DDC6] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#FFDB58] flex items-center justify-center text-neutral-800 font-black text-lg shadow-sm transition-transform group-hover:scale-105">
              M
            </div>

            <span
              className="hidden sm:block text-xl font-bold tracking-tight text-neutral-800"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              MusicfyX
            </span>
          </Link>

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

          {/* User */}
          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-sm font-medium text-neutral-700">
              {user.username}
            </span>

            <button
              type="button"
              aria-label="User Profile"
              className="rounded-full focus:outline-none focus:ring-2 focus:ring-[#FFDB58]"
            >
              <div className="w-10 h-10 rounded-full bg-[#FFDB58] text-neutral-800 border border-[#E6DDC6] flex items-center justify-center font-bold shadow-sm hover:scale-105 transition">
                {avatarLetter}
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
