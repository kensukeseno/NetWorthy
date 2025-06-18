'use client';

import TextInput from '../../components/TextInput';
import { useRef, useState } from 'react';
import { redirect } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function LoginForm() {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const rememberMeRef = useRef<HTMLInputElement>(null);

  const [errorMsg, setErrorMsg] = useState<string | null | undefined>('');

  const handleSignin = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    // Authencication
    const result = await signIn('credentials', {
      email: emailRef.current?.value,
      password: passwordRef.current?.value,
      redirect: false,
    });

    if (result?.ok) {
      redirect('/dashboard');
    }
    // Deisplay error message
    else {
      let msg = 'Something went wrong, please try again.';
      if (result?.error === 'CredentialsSignin') {
        msg = 'Invalid email or password';
      }
      setErrorMsg(msg);
    }
  };

  return (
    <form>
      <TextInput
        label="Email Address"
        type="email"
        placeholder="Enter Email"
        ref={emailRef}
      />
      <TextInput
        label="Password"
        type="Password"
        placeholder="Enter Password"
        ref={passwordRef}
      />

      <div className="flex flex-row flex-wrap justify-between text-gray-500 mb-2">
        <label>
          <input type="checkbox" ref={rememberMeRef}></input> Remember me
        </label>
        <span
          onClick={() => redirect('/login/forget-password')}
          className="cursor-pointer font-bold text-blue-600"
        >
          Forgot Password?
        </span>
      </div>
      <button
        onClick={handleSignin}
        type="submit"
        className="bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition w-full"
      >
        Sign In
      </button>
      {errorMsg && <p className="text-red-600">{errorMsg}</p>}
      <br />
    </form>
  );
}
