import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-[#172B4D] mb-1">
          {label}
        </label>
      )}
      <input
        className={`w-full px-3 py-2 border border-[#DFE1E6] rounded text-sm text-[#172B4D] placeholder:text-[#6B778C] focus:outline-none focus:ring-2 focus:ring-[#0052CC] focus:border-transparent ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-[#DE350B]">{error}</p>}
    </div>
  );
}
