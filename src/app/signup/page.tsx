'use client';
import SignupForm from './SignupForm';
import GoogleSignUp from './Google';
import { redirect } from 'next/navigation';

export default function SignUpPage() {
  return (
    <main className="flex flex-row">
      <div className="h-screen w-1/2 flex items-center justify-center">
        <img
          src="/images/dashboard.png"
          className="h-full w-full object-cover"
        />
      </div>
      <div className=" h-screen w-1/2 flex flex-col">
        <div className="my-auto m-auto flex flex-col gap-3 min-w-min w-1/2">
          <div>
            <h2 className="font-bold text-lg mb-1">Create your account</h2>
            <p>
              Already a member?{' '}
              <span
                onClick={() => redirect('/login')}
                className="cursor-pointer font-bold text-blue-600"
              >
                Sign in Now
              </span>
            </p>
          </div>
          <SignupForm />
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1 border-t border-gray-300"></div>
              <span>Or continue with</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>
            <GoogleSignUp />
          </div>
        </div>
      </div>
    </main>
  );
}
