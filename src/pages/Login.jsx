import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail,Eye,EyeOff } from 'lucide-react';
import ApiService from '../hooks/ApiService';

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  useEffect(() => {
    localStorage.clear();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await ApiService.post(`/auth/login/admin`,
        { email, password },
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response?.token && response?.admin) {
        // Store token and user
        localStorage.setItem('token', response?.token);
        localStorage.setItem('isLogin', true);
        localStorage.setItem('adminDetails', JSON.stringify(response?.admin));

        // ✅ Successful login
          navigate('/');
      } else {
        return { data: null, error: { message: 'Invalid response from server' } };
      }

    } catch (err) {
      console.error('Login error:', err);
      setError('Unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side */}
      <div className="hidden md:flex md:w-1/2 relative bg-blue-900 items-center justify-center">
        <img
          src="https://images.unsplash.com/photo-1568605114967-8130f3a36994"
          alt="Login Illustration"
          className="w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/70"></div>
        <div className="absolute text-center px-6">
          <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
            Welcome to
          </h1>
          <h2 className="text-5xl font-extrabold text-blue-400 drop-shadow-lg">
            VizagLands
          </h2>
          <p className="text-white/80 mt-3 text-sm">
            Admin Portal – Manage Properties, Users & More
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-[#0f1e33]">
        <div className="bg-white/10 p-10 rounded-2xl shadow-lg w-11/12 md:w-3/4 max-w-md backdrop-blur-md border border-white/10">
          <h2 className="text-3xl font-bold text-white text-center mb-6">
            Admin Login
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-white/70 text-sm mb-1 block">
                Email Address
              </label>
              <div className="flex items-center bg-white/10 rounded-lg px-3 py-2 border border-white/20">
                <Mail className="text-white/60 w-4 h-4 mr-2" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-transparent flex-1 outline-none text-white placeholder-white/50 text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none pr-10"
                  placeholder="Enter your password"
                />

                {/* Eye Icon */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <Eye className="h-5 w-5" />
                  ) : (
                    <EyeOff className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>


            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 transition-all py-2 rounded-lg text-white font-medium mt-2"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="text-white/50 text-xs text-center mt-5">
            © {new Date().getFullYear()} VizagLands Admin Panel
          </p>
        </div>
      </div>
    </div>
  );
}
