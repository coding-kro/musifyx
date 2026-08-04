import { useState } from 'react';
import toast from 'react-hot-toast';
import RightHeroSection from '../components/RightHeroSection';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api/axios.js';

export default function Register() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);

      console.log('Register Payload:', formData);

      const response = await api.post(`/auth/register`, formData);

      setFormData({
        username: '',
        email: '',
        password: '',
      });
      toast.success(response.data.message || 'Account created successfully!');
      navigate('/login');
    } catch (error) {
      console.error('Register Error:', error);

      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-[#E5E0D2] p-2.5 sm:p-5 lg:p-8 flex items-center justify-center font-sans">
      <div className="w-full max-w-7xl bg-linear-to-tr from-[#ECE6D5] via-[#FAF7EE] to-[#EAE3CD] rounded-2xl sm:rounded-[36px] shadow-2xl p-4 sm:p-8 lg:p-10 border border-white/60 min-h-0 lg:min-h-180 flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Form Container */}
        <div className="w-full lg:w-5/12 flex flex-col justify-between py-2 px-1 sm:px-4">
          <div>
            {/* Brand */}
            <div className="relative inline-flex flex-col items-center">
              {/* Music Beats */}
              <div className="absolute -top-7 flex items-end gap-1.5">
                <span className="beat h-3"></span>
                <span className="beat beat2 h-7"></span>
                <span className="beat beat3 h-9.5"></span>
                <span className="beat beat4 h-6"></span>
                <span className="beat beat5 h-8"></span>
              </div>

              <div
                className="inline-block px-5 py-1.5 border border-neutral-400/60 rounded-full text-xs font-semibold tracking-[0.2em] text-neutral-800 bg-white/80 backdrop-blur-sm"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                MusicfyX
              </div>
            </div>

            <div className="mt-6 sm:mt-10 mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-normal text-neutral-800 tracking-tight">
                Create an account
              </h1>
              <p className="text-xs sm:text-sm text-neutral-500 mt-1.5 sm:mt-2">
                Please enter your details to sign up
              </p>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
              <div>
                <label className="block text-[11px] font-medium text-neutral-500 mb-1 pl-3">
                  User name
                </label>
                <input
                  name="username"
                  type="text"
                  placeholder="john_doe"
                  autoComplete="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-4 sm:px-5 py-2.5 sm:py-3 bg-white/90 border border-black/5 rounded-full text-xs sm:text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-300 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-neutral-500 mb-1 pl-3">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  placeholder="john.doe@gmail.com"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 sm:px-5 py-2.5 sm:py-3 bg-white/90 border border-black/5 rounded-full text-xs sm:text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-300 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-neutral-500 mb-1 pl-3">
                  Password
                </label>
                <input
                  name="password"
                  type="password"
                  placeholder="••••••"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 sm:px-5 py-2.5 sm:py-3 bg-white/90 border border-black/5 rounded-full text-xs sm:text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-300 transition"
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                disabled={loading}
                type="submit"
                className="w-full mt-2 py-3 sm:py-3.5 px-4 bg-[#FFDB58] hover:bg-[#f5cf4a] text-neutral-800 rounded-full font-medium text-xs sm:text-sm transition-all shadow-sm active:scale-[0.99]"
              >
                {loading ? 'Creating...' : 'Submit'}
              </button>
            </form>
          </div>

          {/* Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-neutral-500 mt-6 sm:mt-8 pt-4 border-t border-black/5 lg:border-t-0">
            <p>
              Have an account?{' '}
              <Link
                to="/login"
                className="text-neutral-800 underline font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Right Side Hero Visual */}
        <div className="w-full lg:w-7/12">
          <RightHeroSection />
        </div>
      </div>
    </div>
  );
}
