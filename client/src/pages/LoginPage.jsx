import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(username, password);
      navigate('/shops');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="flex items-center gap-3 mb-10 animate-fade-in">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M24 4L8 20L16 20L12 36L28 20L20 20L24 4Z" stroke="#4169E1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M28 12L36 20L28 28" stroke="#4169E1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Market Pulse</h1>
      </div>

      <div className="w-full max-w-md animate-slide-up">
        <div className="bg-gradient-to-br from-red-50 via-pink-50 to-rose-50 rounded-2xl p-8 shadow-sm border border-red-100/50">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg animate-scale-in">
                {error}
              </div>
            )}

            <div>
              <input
                id="username-input"
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-5 py-3.5 rounded-xl bg-white/80 backdrop-blur-sm border border-gray-200/50 
                           text-gray-800 placeholder-gray-400 text-sm
                           focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 
                           transition-all duration-200 shadow-sm"
                required
              />
            </div>

            <div>
              <input
                id="password-input"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-3.5 rounded-xl bg-white/80 backdrop-blur-sm border border-gray-200/50 
                           text-gray-800 placeholder-gray-400 text-sm
                           focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 
                           transition-all duration-200 shadow-sm"
                required
              />
            </div>

            <div className="flex justify-center pt-2">
              <button
                id="sign-in-button"
                type="submit"
                disabled={loading}
                className="bg-brand-blue text-white font-semibold px-10 py-2.5 rounded-lg text-sm tracking-wider uppercase
                           hover:bg-blue-700 active:bg-blue-800 transition-all duration-200 
                           shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  'SIGN IN'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <p className="mt-6 text-xs text-gray-400 animate-fade-in delay-500">
        Demo: admin / admin123
      </p>
    </div>
  );
};

export default LoginPage;
