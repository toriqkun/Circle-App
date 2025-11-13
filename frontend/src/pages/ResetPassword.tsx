// import { useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import api from "../utils/axios";
// import RoundedInput from "../components/RoundedInput";
// import { FaLock } from "react-icons/fa";

// export default function ResetPassword() {
//   const { token } = useParams();
//   const navigate = useNavigate();

//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [focusedInput, setFocusedInput] = useState<string | null>(null);

//   const validate = (value: string) => {
//     if (value && value.length < 8) return "Password minimal 8 karakter";
//     return "";
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const err = validate(password);
//     if (err) {
//       setError(err);
//       return;
//     }

//     try {
//       const res = await api.post(`/reset-password/${token}`, { password });

//       if (res.data.status === "success") {
//         navigate("/login", { replace: true });
//       } else {
//         setError(res.data.message || "Reset password gagal");
//       }
//     } catch (err: any) {
//       setError(err.response?.data?.message || "Reset password gagal");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-[#111111] text-white">
//       <div className="w-full max-w-md p-8 rounded-lg bg-[#1d1d1d] shadow-lg">
//         <h1 className="text-3xl font-bold text-green-500 mb-6">Reset Password</h1>

//         <form onSubmit={handleSubmit} className="space-y-5 relative">
//           <RoundedInput
//             type="password"
//             name="password"
//             placeholder="New Password"
//             icon={FaLock}
//             value={password}
//             onChange={(e) => {
//               setPassword(e.target.value);
//               setError(validate(e.target.value));
//             }}
//             onFocus={() => setFocusedInput("password")}
//             onBlur={() => setFocusedInput(null)}
//             isFocused={focusedInput === "password"}
//             isError={!!error && password !== ""}
//           />

//           {error && (
//             <p className="absolute -bottom-[-46px] left-1 text-red-500 text-sm z-10">
//               {error}
//             </p>
//           )}

//           <button
//             type="submit"
//             className="w-full mt-6 py-3 rounded-full bg-green-600 hover:bg-green-700 text-white font-medium transition"
//           >
//             Reset Password
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }


import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/axios";
import RoundedInput from "../components/RoundedInput";
import { FaLock } from "react-icons/fa";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const validate = (value: string) => {
    if (value && value.length < 8) return "Password minimal 8 karakter";
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const err = validate(password);
    if (err) {
      setError(err);
      return;
    }

    try {
      const res = await api.post(`/reset-password/${token}`, { password });

      if (res.data.status === "success") {
        navigate("/login", { replace: true });
      } else {
        setError(res.data.message || "Reset password gagal");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Reset password gagal");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#111111] text-white px-4 sm:px-6">
      <div
        className={`w-full max-w-md sm:max-w-lg md:max-w-md p-6 sm:p-8 rounded-lg bg-[#1d1d1d] transition 
        ${focusedInput || password ? "shadow-[0_0_20px_rgba(0,255,0,0.5)]" : "shadow-none"}`}
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-green-500 mb-6 text-center sm:text-left">Reset Password</h1>

        <form onSubmit={handleSubmit} className="space-y-5 relative">
          <RoundedInput
            type="password"
            name="password"
            placeholder="New Password"
            icon={FaLock}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(validate(e.target.value));
            }}
            onFocus={() => setFocusedInput("password")}
            onBlur={() => setFocusedInput(null)}
            isFocused={focusedInput === "password"}
            isError={!!error && password !== ""}
          />

          {error && (
            <p className="absolute -bottom-[-46px] left-1 text-red-500 text-sm z-10">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full mt-6 py-3 rounded-full bg-green-600 hover:bg-green-700 text-white font-medium transition"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}
