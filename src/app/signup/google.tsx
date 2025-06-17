'use client';
import { FcGoogle } from 'react-icons/fc';
import { signIn } from 'next-auth/react';

export default function GoogleSignUp() {
  return (
    <button
      onClick={() => signIn('google')}
      type="submit"
      className="flex items-center justify-center font-semibold py-2 px-4 rounded border border-gray-300 hover:bg-gray-50 transition w-full"
    >
      <FcGoogle className="text-xl" />
      Google
    </button>
  );
}
