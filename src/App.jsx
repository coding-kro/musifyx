import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Register from './pages/Register';
import Login from './pages/Login';
import Header from './components/Header';
import MusicPlayerFooter from './components/MusicPlayerFooter';
import MusicPage from './pages/MusicPage';
import User from './pages/User';
import UploadMusic from './pages/UploadMusic';
import CreateAlbum from './pages/CreateAlbum';

const Layout = () => {
  const location = useLocation();

  const hideLayout =
    location.pathname === '/login' || location.pathname === '/register';

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />

      {!hideLayout && <Header />}

      <Routes>
        <Route path="/" element={<MusicPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/me" element={<User />} />
        <Route path="/upload-music" element={<UploadMusic />} />
        <Route path="/create-album" element={<CreateAlbum />} />
      </Routes>

      {!hideLayout && <MusicPlayerFooter />}
    </>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
};

export default App;
