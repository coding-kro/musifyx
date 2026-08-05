import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/auth.context';

const ArtistRoute = ({ children }) => {
  const { user } = useAuth();

  // User is not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // User is not an artist
  if (user.role !== 'artist') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ArtistRoute;
