import React from "react";

type TextInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

export default function TextInput(props: TextInputProps) {
  return (
    <div className="mb-2">
      {props.label && (
        <label className="block mb-1 font-semibold text-gray-700">
          {props.label}
        </label>
      )}
      <input
        type="text"
        placeholder={props.placeholder}
        className="text-sm w-full border border-gray-300 rounded-md px-4 py-2
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  );
}
