import { SelectHTMLAttributes } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, options, className = '', ...props }: SelectProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-[#172B4D] mb-1">
          {label}
        </label>
      )}
      <select
        className={`w-full px-3 py-2 border border-[#DFE1E6] rounded text-sm text-[#172B4D] focus:outline-none focus:ring-2 focus:ring-[#0052CC] focus:border-transparent bg-white ${className}`}
        {...props}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
