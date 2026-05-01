import { TextareaHTMLAttributes } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({ label, error, className = '', ...props }: TextareaProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-[#172B4D] mb-1">
          {label}
        </label>
      )}
      <textarea
        className={`w-full px-3 py-2 border border-[#DFE1E6] rounded text-sm text-[#172B4D] placeholder:text-[#6B778C] focus:outline-none focus:ring-2 focus:ring-[#0052CC] focus:border-transparent resize-none ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-[#DE350B]">{error}</p>}
    </div>
  );
}
