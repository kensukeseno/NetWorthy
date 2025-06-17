'use client';

import TextInput from '../../components/TextInput';
// import { useMutation } from 'urql';
// import { useRef, useState } from 'react';
// import { redirect } from 'next/navigation';

// const SIGNUP_MUTATION = `
//   mutation($data: UserCreateInput!) {
//     signup(data: $data) {
//       id
//       name
//       email
//     }
//   }
// `;

export default function LoginForm() {
  // const [result, signup] = useMutation(SIGNUP_MUTATION);
  // const nameRef = useRef<HTMLInputElement>(null);
  // const emailRef = useRef<HTMLInputElement>(null);
  // const password1Ref = useRef<HTMLInputElement>(null);
  // const password2Ref = useRef<HTMLInputElement>(null);
  // const termsRef = useRef<HTMLInputElement>(null);

  // const [errorMsg, setErrorMsg] = useState('');

  // const handleSignup = async (e: React.MouseEvent<HTMLButtonElement>) => {
  //   e.preventDefault();
  // Passwords Match Validation
  // if (password1Ref.current?.value !== password2Ref.current?.value) {
  //   setErrorMsg('Passwords do not match');
  //   return;
  // }
  // // Validate that the Terms and Privacy Policy checkbox is checked before continuing
  // if (termsRef.current?.checked !== true) {
  //   setErrorMsg('You must agree to the terms and privacy policy to proceed.');
  //   return;
  // }

  // const variables = {
  //   data: {
  //     name: nameRef.current?.value,
  //     email: emailRef.current?.value,
  //     password: password1Ref.current?.value,
  //   },
  // };

  //   const { data, error } = await signup(variables);

  //   if (data) {
  //     redirect('/login');
  //   } else if (error) {
  //     setErrorMsg('error');
  //   }
  // };

  return (
    <form>
      <TextInput
        label="Email Address"
        type="email"
        placeholder="Enter Email"
        // ref={nameRef}
      />
      <TextInput
        label="Password"
        type="Password"
        placeholder="Enter Password"
        // ref={emailRef}
      />

      <div className="flex flex-row flex-wrap justify-between text-gray-500 mb-2">
        <label>
          <input
            type="checkbox"
            // ref={termsRef}
          ></input>{' '}
          Remember me
        </label>
        <span
          // onClick={() => redirect('')}
          className="cursor-pointer font-bold text-blue-600"
        >
          Forgot Password?
        </span>
      </div>
      <button
        // onClick={handleSignup}
        type="submit"
        className="bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition w-full"
      >
        Sign In
      </button>
      {/* {errorMsg && <p className="text-red-600">{errorMsg}</p>} */}
      <br />
    </form>
  );
}
