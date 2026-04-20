import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AutoLogin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      localStorage.setItem('mp_token', token);
      // small delay to allow AuthProvider to pick up token
      setTimeout(() => navigate('/shops', { replace: true }), 200);
    } else {
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <p className="text-lg text-gray-600">Signing you in...</p>
      </div>
    </div>
  );
};

export default AutoLogin;
