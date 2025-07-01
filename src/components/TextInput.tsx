import React from 'react';

type TextInputProps = React.InputHTMLAttributes<HTMLInputElement> &
  React.RefAttributes<HTMLInputElement> & {
    label?: string;
  };

const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  ({ label, ...inputProps }, ref) => {
    return (
      <div className="mb-2">
        {label && (
          <label className="block mb-1 font-semibold text-gray-700">
            {label}
          </label>
        )}
        <input
          {...inputProps}
          ref={ref}
          className="text-sm w-full border border-gray-300 rounded-md px-4 py-2
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    );
  },
);

export default TextInput;
