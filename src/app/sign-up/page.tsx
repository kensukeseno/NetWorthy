import TextInput from "../../components/TextInput";
import { FcGoogle } from "react-icons/fc";

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
              Already a member?{" "}
              <a href="" className="font-bold text-blue-600">
                Sign in Now
              </a>
            </p>
          </div>
          <form>
            <TextInput label="Full Name" placeholder="Enter your name" />
            <TextInput label="Email Address" placeholder="Enter your email" />
            <TextInput label="Password" placeholder="Enter password" />
            <TextInput
              label="Confirm Password"
              placeholder="Re-enter password"
            />
            <div className="text-gray-500 mb-2">
              <label>
                <input type="checkbox"></input> I agree to the Terms and Privacy
                Policy
              </label>
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition w-full"
            >
              Sign Up
            </button>
            <br />
          </form>
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1 border-t border-gray-300"></div>
              <span>Or continue with</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>
            <button
              type="submit"
              className="flex items-center justify-center font-semibold py-2 px-4 rounded border border-gray-300 hover:bg-gray-50 transition w-full"
            >
              <FcGoogle className="text-xl" />
              Google
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
