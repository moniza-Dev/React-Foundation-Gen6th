import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast, ToastContainer } from "react-toastify";
import { useUserRegisterMutation } from "../../services/authApi";
import { GithubLoginComponent } from "../oauth/GithubComponent";
import { GoogleLoginComponent } from "../oauth/GoogleComponent";

export default function RegisterComponent() {
  const [registerRequest] = useUserRegisterMutation();
  const navigate = useNavigate();

  const formSchema = z
    .object({
      username: z
        .string("Please input username")
        .min(3, "Atleast 3 letters")
        .max(50, "Atmost 50 letters"),
      email: z
        .string("Please input email")
        .email({ pattern: z.regexes.html5Email }),
      password: z
        .string()
        .min(6, "Atleast 6 letters")
        .max(100, "Atmost 100 letters")
        .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
        .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
        .regex(/[0-9]/, { message: "Password must contain at least one number" })
        .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character" }),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleRegisterSubmit = async (data) => {
    try {
      const result = await registerRequest({
        userRegisterRequest: {
          username: data.username,
          email: data.email,
          password: data.password,
          confirmPassword: data.confirmPassword,
          phoneNumber: "",
          address: {
            addressLine1: "",
            addressLine2: "",
            road: "",
            linkAddress: "",
          },
        },
      });

      if (result?.data) {
        toast.success("Account created! You can now log in.");
        setTimeout(() => {
          navigate("/auth/login", { replace: true });
        }, 1500);
      } else {
        const message =
          result?.error?.data?.message || "Registration failed. Please try again.";
        toast.error(message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <ToastContainer />
      <div className="w-full flex items-center justify-center">
        <div className="w-3/4 max-w-md p-8 bg-white shadow-lg rounded-lg">
          <h2 className="text-2xl font-bold text-blue-600 mb-6">Register</h2>
          <form onSubmit={handleSubmit(handleRegisterSubmit)}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm mb-2">
                Username
              </label>
              <input
                type="text"
                placeholder="Enter your username"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register("username")}
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm mb-2">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Confirm your password"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Sign up
            </button>
          </form>

          {/* btn google login */}
          <GoogleLoginComponent />
          {/* btn github login */}
          <GithubLoginComponent />

          <p className="mt-6 text-sm text-center text-gray-600">
            Already have an account?
            <a href="/auth/login" className="text-blue-600 hover:underline">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
