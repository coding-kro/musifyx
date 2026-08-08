import { Mail, Calendar, Music } from 'lucide-react';
import Logout from '../components/Logout';
import toast from 'react-hot-toast';
import { api } from '../api/axios';
import { useState } from 'react';

const User = ({ user, setUser }) => {
  const [loading, setLoading] = useState(false);

  const createdAt = new Date(user.createdAt).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const avatarLetter = user?.username
    ? user?.username.charAt(0).toUpperCase()
    : 'U';

  const handleLogout = async () => {
    try {
      setLoading(true);

      const response = await api.post('/auth/logout');

      console.log(response);

      toast.success(response.data.message || 'User logged out successfully');

      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      toast.error(error.response?.data?.message || 'User logout failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto p-4 sm:p-6 min-h-[80vh] flex items-center justify-center">
      <div className="relative w-full overflow-hidden rounded-3xl border border-white/60 bg-linear-to-br from-[#ECE6D5] via-[#FAF7EE] to-[#EAE3CD] p-8 shadow-xl flex flex-col items-center text-center">
        {/* Accent Glow */}
        <div className="absolute -top-20 left-1/2 h-52 w-52 -translate-x-1/2 rounded-full bg-[#FFDB58]/30 blur-3xl pointer-events-none" />

        {/* Avatar */}
        <div className="relative mb-5 flex h-32 w-32 items-center justify-center rounded-full border-4 border-[#FFDB58]/40 bg-[#FFDB58] text-5xl font-bold text-neutral-800 shadow-lg">
          {avatarLetter}
        </div>

        {/* User Info */}
        <div className="mb-8 space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-800">
            {user.username}
          </h1>

          <div className="flex items-center justify-center gap-2 text-sm text-neutral-500">
            <Mail className="h-4 w-4 text-neutral-400" />
            <span>{user.email}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="w-full space-y-3">
          {/* Uploaded Songs */}
          <div className="flex w-full items-center justify-between rounded-2xl border border-[#E6DDC6] bg-white/70 p-4 backdrop-blur-sm transition hover:shadow-md">
            <div className="flex items-center gap-3">
              <div className="rounded-xl border border-[#FFDB58]/40 bg-[#FFDB58]/20 p-2.5 text-neutral-700">
                <Music className="h-5 w-5" />
              </div>

              <span className="text-sm font-medium text-neutral-600">
                Songs Uploaded
              </span>
            </div>

            <span className="font-mono text-lg font-bold text-neutral-800">
              {user.uploadedSongsCount}
            </span>
          </div>

          {/* Joined Date */}
          <div className="flex w-full items-center justify-between rounded-2xl border border-[#E6DDC6] bg-white/70 p-4 backdrop-blur-sm transition hover:shadow-md">
            <div className="flex items-center gap-3">
              <div className="rounded-xl border border-[#FFDB58]/40 bg-[#FFDB58]/20 p-2.5 text-neutral-700">
                <Calendar className="h-5 w-5" />
              </div>

              <span className="text-sm font-medium text-neutral-600">
                Joined On
              </span>
            </div>

            <span className="text-sm font-semibold text-neutral-800">
              {createdAt}
            </span>
          </div>

          {/* Logout */}
          <div className="pt-2">
            <Logout onClick={handleLogout} disabled={loading} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default User;
