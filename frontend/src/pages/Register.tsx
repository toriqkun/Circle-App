// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import api from "../utils/axios";
// import { useAppDispatch } from "../store/hooks";
// import { setUser } from "../store/authSlice";
// import RoundedInput from "../components/RoundedInput";
// import { FaUser, FaEnvelope, FaLock, FaIdCard } from "react-icons/fa";

// export default function Register() {
//   const [form, setForm] = useState({ username: "", name: "", email: "", password: "" });
//   const [errors, setErrors] = useState<{ [key: string]: string }>({});
//   const [error, setError] = useState("");
//   const [focusedInput, setFocusedInput] = useState<string | null>(null);

//   const navigate = useNavigate();
//   const dispatch = useAppDispatch();

//   const validate = (name: string, value: string) => {
//     switch (name) {
//       case "username":
//         if (value && (value.length < 4 || value.length > 20)) return "Username must be at least 4-20 characters";
//         break;
//       case "name":
//         if (value && value.length > 20) return "Full name maximum 20 characters";
//         break;
//       case "email":
//         if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Invalid email";
//         break;
//       case "password":
//         if (value && value.length < 8) return "Password minimum 8 characters";
//         break;
//       default:
//         return "";
//     }
//     return "";
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setForm({ ...form, [name]: value });

//     setErrors({ ...errors, [name]: validate(name, value) });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const newErrors: any = {};
//     Object.keys(form).forEach((key) => {
//       const err = validate(key, (form as any)[key]);
//       if (err) newErrors[key] = err;
//     });

//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors);
//       return;
//     }

//     try {
//       const res = await api.post("/register", form);
//       const { data } = res.data;
//       localStorage.setItem("token", data.token);
//       dispatch(setUser(data));
//       navigate("/login");
//     } catch (err: any) {
//       setError(err.response?.data?.message || "Register gagal");
//     }
//   };

//   const handleBlur = () => setFocusedInput(null);

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-[#111111] text-white">
//       <div
//         className={`w-full max-w-md p-8 rounded-lg bg-[#1d1d1d] transition
//         ${focusedInput || form.username || form.name || form.email || form.password ? "shadow-[0_0_20px_rgba(0,255,0,0.5)]" : "shadow-none"}`}
//       >
//         <h1 className="text-4xl font-bold text-green-500 mb-1">circle</h1>
//         <p className="text-3xl mb-11">Create your account</p>

//         <form onSubmit={handleSubmit} className="space-y-5 relative">
//           <RoundedInput
//             type="text"
//             name="username"
//             placeholder="Username"
//             autoComplete="off"
//             autoCorrect="off"
//             spellCheck="false"
//             icon={FaUser}
//             value={form.username}
//             onChange={handleChange}
//             onFocus={() => setFocusedInput("username")}
//             onBlur={handleBlur}
//             isFocused={focusedInput === "username"}
//             isError={!!errors.username && form.username !== ""}
//           />

//           <RoundedInput
//             type="text"
//             name="name"
//             placeholder="Full Name"
//             autoComplete="off"
//             autoCorrect="off"
//             spellCheck="false"
//             icon={FaIdCard}
//             value={form.name}
//             onChange={handleChange}
//             onFocus={() => setFocusedInput("name")}
//             onBlur={handleBlur}
//             isFocused={focusedInput === "name"}
//             isError={!!errors.name && form.name !== ""}
//           />

//           <RoundedInput
//             type="email"
//             name="email"
//             placeholder="Email"
//             autoComplete="off"
//             autoCorrect="off"
//             spellCheck="false"
//             icon={FaEnvelope}
//             value={form.email}
//             onChange={handleChange}
//             onFocus={() => setFocusedInput("email")}
//             onBlur={handleBlur}
//             isFocused={focusedInput === "email"}
//             isError={!!errors.email && form.email !== ""}
//           />

//           <RoundedInput
//             type="password"
//             name="password"
//             placeholder="Password"
//             icon={FaLock}
//             value={form.password}
//             onChange={handleChange}
//             onFocus={() => setFocusedInput("password")}
//             onBlur={handleBlur}
//             isFocused={focusedInput === "password"}
//             isError={!!errors.password && form.password !== ""}
//           />

//           {/* error message */}
//           {(errors.username || errors.name || errors.email || errors.password || error) && (
//             <p className="absolute -bottom-[-46px] left-1 text-red-500 text-sm z-10">{errors.username || errors.name || errors.email || errors.password || error}</p>
//           )}

//           <button type="submit" className="w-full mt-6 py-3 rounded-full bg-green-600 hover:bg-green-700 text-white font-medium transition">
//             Register
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
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/axios";
import { useAppDispatch } from "../store/hooks";
import { setUser } from "../store/authSlice";
import RoundedInput from "../components/RoundedInput";
import { FaUser, FaEnvelope, FaLock, FaIdCard } from "react-icons/fa";

export default function Register() {
  const [form, setForm] = useState({ username: "", name: "", email: "", password: "" });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [error, setError] = useState("");
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const validate = (name: string, value: string) => {
    switch (name) {
      case "username":
        if (value && (value.length < 4 || value.length > 20)) return "Username must be 4–20 characters";
        break;
      case "name":
        if (value && value.length > 20) return "Full name max 20 characters";
        break;
      case "email":
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Invalid email";
        break;
      case "password":
        if (value && value.length < 8) return "Password min 8 characters";
        break;
      default:
        return "";
    }
    return "";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: validate(name, value) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: any = {};
    Object.keys(form).forEach((key) => {
      const err = validate(key, (form as any)[key]);
      if (err) newErrors[key] = err;
    });
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    try {
      const res = await api.post("/register", form);
      const { data } = res.data;
      localStorage.setItem("token", data.token);
      dispatch(setUser(data));
      navigate("/login");
    } catch (err: any) {
      setError(err.response?.data?.message || "Register gagal");
    }
  };

  const handleBlur = () => setFocusedInput(null);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#111111] text-white px-4 sm:px-6">
      <div
        className={`w-full max-w-md p-6 sm:p-8 rounded-lg bg-[#1d1d1d] transition duration-300
        ${focusedInput || form.username || form.name || form.email || form.password ? "shadow-[0_0_20px_rgba(0,255,0,0.5)]" : "shadow-none"}`}
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-green-500 mb-1 text-center sm:text-left">circle</h1>
        <p className="text-2xl sm:text-3xl mb-10 text-center sm:text-left">Create your account</p>

        <form onSubmit={handleSubmit} className="space-y-5 relative">
          <RoundedInput
            type="text"
            name="username"
            placeholder="Username"
            icon={FaUser}
            value={form.username}
            onChange={handleChange}
            onFocus={() => setFocusedInput("username")}
            onBlur={handleBlur}
            isFocused={focusedInput === "username"}
            isError={!!errors.username && form.username !== ""}
          />

          <RoundedInput
            type="text"
            name="name"
            placeholder="Full Name"
            icon={FaIdCard}
            value={form.name}
            onChange={handleChange}
            onFocus={() => setFocusedInput("name")}
            onBlur={handleBlur}
            isFocused={focusedInput === "name"}
            isError={!!errors.name && form.name !== ""}
          />

          <RoundedInput
            type="email"
            name="email"
            placeholder="Email"
            icon={FaEnvelope}
            value={form.email}
            onChange={handleChange}
            onFocus={() => setFocusedInput("email")}
            onBlur={handleBlur}
            isFocused={focusedInput === "email"}
            isError={!!errors.email && form.email !== ""}
          />

          <RoundedInput
            type="password"
            name="password"
            placeholder="Password"
            icon={FaLock}
            value={form.password}
            onChange={handleChange}
            onFocus={() => setFocusedInput("password")}
            onBlur={handleBlur}
            isFocused={focusedInput === "password"}
            isError={!!errors.password && form.password !== ""}
          />

          {(errors.username || errors.name || errors.email || errors.password || error) && (
            <div className="relative">
              <p className="absolute bottom-[-10px] left-1 text-red-500 text-sm z-10">{errors.username || errors.name || errors.email || errors.password || error}</p>
            </div>
          )}

          <button type="submit" className="w-full mt-6 py-3 rounded-full bg-green-600 hover:bg-green-700 text-white font-medium transition text-sm sm:text-base">
            Register
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
