import React from 'react';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export const TextArea: React.FC<TextAreaProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className="flex flex-col w-full h-full">
      <label className="mb-2 text-sm font-semibold text-gray-700">{label}</label>
      <textarea
        className={`flex-grow p-4 border rounded-xl shadow-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};
