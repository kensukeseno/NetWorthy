'use client';
import { FcGoogle } from 'react-icons/fc';
import { signIn } from 'next-auth/react';
import { redirect, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function GoogleSignIn() {
  const [errorMsg, setErrorMsg] = useState<string | null | undefined>('');

  // Check the URL for error
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  useEffect(() => {
    if (error === 'OAuthAccountNotLinked') {
      setErrorMsg('This email is already linked to a different login method.');
    } else if (error) {
      setErrorMsg('Something went wrong. Please try again.');
    }
  }, [error]);

  return (
    <>
      <button
        onClick={() =>
          signIn('google', {
            callbackUrl: '/dashboard',
          })
        }
        type="submit"
        className="flex items-center justify-center font-semibold py-2 px-4 rounded border border-gray-300 hover:bg-gray-50 transition w-full"
      >
        <FcGoogle className="text-xl" />
        Google
      </button>
      {errorMsg && <p className="text-red-600">{errorMsg}</p>}
    </>
  );
}
