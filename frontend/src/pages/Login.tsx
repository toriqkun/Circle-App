// import { useState, useEffect } from "react";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import api from "../utils/axios";
// import { useAppDispatch } from "../store/hooks";
// import { loadUser } from "../store/authSlice";
// import RoundedInput from "../components/RoundedInput";
// import { FaUser, FaLock } from "react-icons/fa";

// export default function Login() {
//   const [form, setForm] = useState({ identifier: "", password: "" });
//   const [touched, setTouched] = useState<{ identifier: boolean; password: boolean }>({
//     identifier: false,
//     password: false,
//   });

//   const [error, setError] = useState("");
//   const [focusedInput, setFocusedInput] = useState<string | null>(null);
//   const [popupMessage, setPopupMessage] = useState<string | null>(null);

//   const navigate = useNavigate();
//   const dispatch = useAppDispatch();
//   type LocationState = {
//     message?: string;
//     from?: string;
//   };
//   const location = useLocation();
//   const state = location.state as LocationState;

//   useEffect(() => {
//     if (state?.message && state?.from && state.from !== "/login") {
//       setPopupMessage(state.message);

//       const timer = setTimeout(() => {
//         setPopupMessage(null);
//       }, 2500);

//       navigate(location.pathname, { replace: true });

//       return () => clearTimeout(timer);
//     }
//   }, [state, location.pathname, navigate]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setForm({ ...form, [name]: value });
//   };

//   const handleBlur = (name: string) => {
//     setTouched({ ...touched, [name]: true });
//     setFocusedInput(null);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const res = await api.post("/login", form);
//       const { data } = res.data;

//       localStorage.setItem("token", data.token);

//       await dispatch(loadUser());

//       navigate("/");
//     } catch (err: any) {
//       setError(err.response?.data?.message || "Login gagal");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-[#111111] text-white">
//       {popupMessage && <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded shadow-lg z-50 animate-fade-in-out">{popupMessage}</div>}

//       <div
//         className={`w-full max-w-md p-8 rounded-lg bg-[#1d1d1d] transition
//         ${focusedInput || form.identifier || form.password ? "shadow-[0_0_20px_rgba(0,255,0,0.5)]" : "shadow-none"}`}
//       >
//         <h1 className="text-4xl font-bold text-green-500 mb-1">circle</h1>
//         <p className="text-3xl mb-15">Login to Circle</p>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <RoundedInput
//             type="text"
//             name="identifier"
//             placeholder="Email / Username"
//             icon={FaUser}
//             value={form.identifier}
//             autoComplete="off"
//             autoCorrect="off"
//             spellCheck="false"
//             onChange={handleChange}
//             onFocus={() => setFocusedInput("identifier")}
//             onBlur={() => handleBlur("identifier")}
//             isFocused={focusedInput === "identifier"}
//           />

//           <RoundedInput
//             type="password"
//             name="password"
//             placeholder="Password"
//             icon={FaLock}
//             value={form.password}
//             onChange={handleChange}
//             onFocus={() => setFocusedInput("password")}
//             onBlur={() => handleBlur("password")}
//             isFocused={focusedInput === "password"}
//           />

//           {error && (
//             <div className="relative">
//               <p className="absolute -bottom-2 left-1 text-red-500 text-sm z-10">{error}</p>
//             </div>
//           )}

//           <div className="flex justify-end mb-2">
//             <Link to="/forgot-password" className="text-md text-gray-400 hover:text-green-400">
//               Forgot password?
//             </Link>
//           </div>

//           <button type="submit" className="w-full py-3 rounded-full bg-green-600 hover:bg-green-700 text-white font-medium transition">
//             Login
//           </button>
//         </form>

//         <p className="mt-6 text-center text-gray-400 text-sm">
//           Don’t have an account yet?{" "}
//           <Link to="/register" className="text-green-500 hover:underline">
//             Create account
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import api from "../utils/axios";
import { useAppDispatch } from "../store/hooks";
import { loadUser } from "../store/authSlice";
import RoundedInput from "../components/RoundedInput";
import { FaUser, FaLock } from "react-icons/fa";

export default function Login() {
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [touched, setTouched] = useState<{ identifier: boolean; password: boolean }>({
    identifier: false,
    password: false,
  });

  const [error, setError] = useState("");
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [popupMessage, setPopupMessage] = useState<string | null>(null);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  type LocationState = {
    message?: string;
    from?: string;
  };
  const location = useLocation();
  const state = location.state as LocationState;

  useEffect(() => {
    if (state?.message && state?.from && state.from !== "/login") {
      setPopupMessage(state.message);

      const timer = setTimeout(() => {
        setPopupMessage(null);
      }, 2500);

      navigate(location.pathname, { replace: true });

      return () => clearTimeout(timer);
    }
  }, [state, location.pathname, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleBlur = (name: string) => {
    setTouched({ ...touched, [name]: true });
    setFocusedInput(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post("/login", form);
      const { data } = res.data;
      localStorage.setItem("token", data.token);
      await dispatch(loadUser());
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login gagal");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#111111] text-white px-4 sm:px-6">
      {popupMessage && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded shadow-lg z-50 animate-fade-in-out text-sm sm:text-base">{popupMessage}</div>
      )}

      <div
        className={`w-full max-w-md p-6 sm:p-8 rounded-lg bg-[#1d1d1d] transition duration-300 
        ${focusedInput || form.identifier || form.password ? "shadow-[0_0_20px_rgba(0,255,0,0.5)]" : "shadow-none"}`}
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-green-500 mb-1 text-center sm:text-left">circle</h1>
        <p className="text-2xl sm:text-3xl mb-10 text-center sm:text-left">Login to Circle</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <RoundedInput
            type="text"
            name="identifier"
            placeholder="Email / Username"
            icon={FaUser}
            value={form.identifier}
            autoComplete="off"
            onChange={handleChange}
            onFocus={() => setFocusedInput("identifier")}
            onBlur={() => handleBlur("identifier")}
            isFocused={focusedInput === "identifier"}
          />

          <RoundedInput
            type="password"
            name="password"
            placeholder="Password"
            icon={FaLock}
            value={form.password}
            onChange={handleChange}
            onFocus={() => setFocusedInput("password")}
            onBlur={() => handleBlur("password")}
            isFocused={focusedInput === "password"}
          />

          {error && (
            <div className="relative">
              <p className="absolute bottom-[-4px] left-1 text-red-500 text-sm z-10">{error}</p>
            </div>
          )}

          <div className="flex justify-end mb-2">
            <Link to="/forgot-password" className="text-sm sm:text-md text-gray-400 hover:text-green-400">
              Forgot password?
            </Link>
          </div>

          <button type="submit" className="w-full py-3 rounded-full bg-green-600 hover:bg-green-700 text-white font-medium transition text-sm sm:text-base">
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-gray-400 text-sm sm:text-base">
          Don’t have an account yet?{" "}
          <Link to="/register" className="text-green-500 hover:underline">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}
