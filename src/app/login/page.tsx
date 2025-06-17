'use client';
import LoginForm from './loginForm';
import GoogleSignUp from './google';
import { redirect } from 'next/navigation';

export default function LogInPage() {
  return (
    <main className="flex flex-row">
      <div className=" h-screen w-1/2 flex flex-col">
        <div className="my-auto m-auto flex flex-col gap-3 min-w-min w-1/2">
          <div>
            <h2 className="font-bold text-lg mb-1">Sign in to your account</h2>
            <p>
              Not a member?{' '}
              <span
                onClick={() => redirect('/signup')}
                className="cursor-pointer font-bold text-blue-600"
              >
                Sign up Now
              </span>
            </p>
          </div>
          <LoginForm />
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
      <div className="h-screen w-1/2 flex items-center justify-center">
        <img
          src="/images/dashboard.png"
          className="h-full w-full object-cover"
        />
      </div>
    </main>
  );
}
