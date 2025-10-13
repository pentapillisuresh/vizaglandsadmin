import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Mail } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    // ✅ Static credentials
    if (email === "vizaglandsadmin@gmail.com" && password === "vizag") {
      localStorage.setItem("isAdminLoggedIn", "true");

      // ✅ Redirect to dashboard after successful login
      navigate("/", { replace: true });
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image with Welcome Text */}
      <div className="hidden md:flex md:w-1/2 relative bg-blue-900 items-center justify-center">
        <img
          src="https://images.unsplash.com/photo-1568605114967-8130f3a36994"
          alt="Login Illustration"
          className="w-full h-full object-cover opacity-90"
        />

        {/* Overlay gradient for text visibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/70"></div>

        {/* Welcome Text */}
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

      {/* Right Side - Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-[#0f1e33]">
        <div className="bg-white/10 p-10 rounded-2xl shadow-lg w-11/12 md:w-3/4 max-w-md backdrop-blur-md border border-white/10">
          <h2 className="text-3xl font-bold text-white text-center mb-6">
            Admin Login
          </h2>

          <form onSubmit={handleLogin} className="space-y-5">
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
              <label className="text-white/70 text-sm mb-1 block">
                Password
              </label>
              <div className="flex items-center bg-white/10 rounded-lg px-3 py-2 border border-white/20">
                <Lock className="text-white/60 w-4 h-4 mr-2" />
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-transparent flex-1 outline-none text-white placeholder-white/50 text-sm"
                  required
                />
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 transition-all py-2 rounded-lg text-white font-medium mt-2"
            >
              Login
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
