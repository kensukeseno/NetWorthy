'use client';

import TextInput from '../../components/TextInput';
import { useMutation } from 'urql';
import { useRef } from 'react';

const SIGNUP_MUTATION = `
  mutation($data: UserCreateInput!) {
    signup(data: $data) {
      id
      name
      email
    }
  }
`;

interface FormValues {
  name: string;
  email: string;
  password: string;
}

export default function SignupForm() {
  const [result, signup] = useMutation(SIGNUP_MUTATION);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const password1Ref = useRef<HTMLInputElement>(null);
  const password2Ref = useRef<HTMLInputElement>(null);

  const handleSignup = async () => {
    // Password Validation
    if (password1Ref.current?.value !== password1Ref.current?.value) {
      return;
    }

    const variables = {
      data: {
        name: nameRef.current?.value,
        email: emailRef.current?.value,
        password: password1Ref.current?.value,
      },
    };

    const result = await signup(variables);
  };

  return (
    <form>
      <TextInput
        label="Full Name"
        placeholder="Enter your name"
        ref={nameRef}
      />
      <TextInput
        label="Email Address"
        placeholder="Enter your email"
        ref={emailRef}
      />
      <TextInput
        label="Password"
        placeholder="Enter password"
        ref={password1Ref}
      />
      <TextInput
        label="Confirm Password"
        placeholder="Re-enter password"
        ref={password2Ref}
      />
      <div className="text-gray-500 mb-2">
        <label>
          <input type="checkbox"></input> I agree to the Terms and Privacy
          Policy
        </label>
      </div>
      <button
        onClick={handleSignup}
        className="bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition w-full"
      >
        Sign Up
      </button>
      <br />
    </form>
  );
}
