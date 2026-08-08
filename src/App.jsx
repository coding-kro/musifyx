import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from 'react-router-dom';

import { Toaster } from 'react-hot-toast';

import Register from './pages/Register';
import Login from './pages/Login';
import Header from './components/Header';
import MusicPlayerFooter from './components/MusicPlayerFooter';
import MusicPage from './pages/MusicPage';
import User from './pages/User';
import UploadMusic from './pages/UploadMusic';
import CreateAlbum from './pages/CreateAlbum';

import { AuthProvider, useAuth } from './context/auth.context';
import ArtistRoute from './components/ArtistRoute';

const Layout = () => {
  const location = useLocation();

  const { user, loading, setUser } = useAuth();

  const hideLayout =
    location.pathname === '/login' || location.pathname === '/register';

  // Wait until auth check completes
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />

      {!hideLayout && user && <Header user={user} />}

      <Routes>
        {!user ? (
          <>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />

            <Route path="/register" element={<Register />} />

            {/* Block all protected pages */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        ) : (
          <>
            {/* Protected routes */}
            <Route path="/" element={<MusicPage />} />

            <Route
              path="/me"
              element={<User user={user} setUser={setUser} />}
            />

            <Route
              path="/upload-music"
              element={
                <ArtistRoute>
                  <UploadMusic />
                </ArtistRoute>
              }
            />

            <Route
              path="/create-album"
              element={
                <ArtistRoute>
                  <CreateAlbum />
                </ArtistRoute>
              }
            />

            {/* Unknown route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>

      {!hideLayout && user && <MusicPlayerFooter />}
    </>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
