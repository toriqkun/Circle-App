// import { useState } from "react";
// import api from "../utils/axios";
// import RoundedInput from "../components/RoundedInput";
// import { FaEnvelope } from "react-icons/fa";
// import { Link } from "react-router-dom";

// export default function ForgotPassword() {
//   const [email, setEmail] = useState("");
//   const [isFocused, setIsFocused] = useState(false);
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       await api.post("/forgot-password", { email });
//       setMessage("Periksa email Anda untuk tautan reset password!");
//       setError("");
//     } catch (err: any) {
//       setError(err.response?.data?.message || "Failed to send reset link");
//       setMessage("");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-[#111111] text-white">
//       <div
//         className={`w-full max-w-md p-8 rounded-lg bg-[#1d1d1d] transition
//         ${email || isFocused ? "shadow-[0_0_20px_rgba(0,255,0,0.5)]" : "shadow-none"}`}
//       >
//         <h1 className="text-4xl font-bold text-green-500 mb-1">circle</h1>
//         <p className="text-2xl mb-10">Forgot Password</p>

//         <form onSubmit={handleSubmit} className="space-y-6 relative">
//           <RoundedInput
//             type="email"
//             name="email"
//             placeholder="Enter your email"
//             icon={FaEnvelope}
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             onFocus={() => setIsFocused(true)}
//             onBlur={() => setIsFocused(false)}
//             isFocused={isFocused}
//           />
//           <div className="absolute top-12 left-1">
//             {error && <p className="text-red-500 text-sm">{error}</p>}
//             {message && <p className="text-green-500 text-sm">{message}</p>}
//           </div>

//           <button type="submit" className="w-full mt-5 py-3 rounded-full bg-green-600 hover:bg-green-700 text-white font-medium transition">
//             Send Reset Link
//           </button>
//         </form>
//         <p className="mt-6 text-center text-gray-400 text-sm">
//           Already have an account?{" "}
//           <Link to="/login" className="text-green-500 hover:underline">
//             Login
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import api from "../utils/axios";
import RoundedInput from "../components/RoundedInput";
import { FaEnvelope } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/forgot-password", { email });
      setMessage("Periksa email Anda untuk tautan reset password!");
      setError("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to send reset link");
      setMessage("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#111111] text-white px-4 sm:px-6">
      <div
        className={`w-full max-w-md sm:max-w-lg md:max-w-md p-6 sm:p-8 rounded-lg bg-[#1d1d1d] transition 
        ${email || isFocused ? "shadow-[0_0_20px_rgba(0,255,0,0.5)]" : "shadow-none"}`}
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-green-500 mb-1 text-center sm:text-left">circle</h1>
        <p className="text-xl sm:text-2xl mb-8 text-center sm:text-left">Forgot Password</p>

        <form onSubmit={handleSubmit} className="space-y-6 relative">
          <RoundedInput
            type="email"
            name="email"
            placeholder="Enter your email"
            icon={FaEnvelope}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            isFocused={isFocused}
          />

          <div className="absolute top-12 left-1">
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {message && <p className="text-green-500 text-sm">{message}</p>}
          </div>

          <button type="submit" className="w-full mt-5 py-3 rounded-full bg-green-600 hover:bg-green-700 text-white font-medium transition">
            Send Reset Link
          </button>
        </form>

        <p className="mt-6 text-center text-gray-400 text-sm sm:text-base">
          Already have an account?{" "}
          <Link to="/login" className="text-green-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
