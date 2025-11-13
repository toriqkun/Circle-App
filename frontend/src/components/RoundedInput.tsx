import type { IconType } from "react-icons";
import type { InputHTMLAttributes } from "react";

type RoundedInputProps = InputHTMLAttributes<HTMLInputElement> & {
  type: string;
  name: string;
  placeholder: string;
  icon: IconType;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  isFocused?: boolean;
  isError?: boolean;
};

export default function RoundedInput({ type, name, placeholder, icon: Icon, value, onChange, onFocus, onBlur, isFocused, isError }: RoundedInputProps) {
  return (
    <div
      className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg border transition 
      ${isError ? "border-red-500 text-red-500" : isFocused || value ? "border-green-500" : "border-gray-600"} 
      bg-transparent text-white`}
    >
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        className="w-full bg-transparent outline-none placeholder-gray-400 text-white"
        placeholder={placeholder}
        autoComplete="off"
      />
      <Icon size={18} className={`${isError ? "border-red-500 text-red-500" : isFocused || value ? "text-green-500" : "text-gray-400"}`} />
    </div>
  );
}
