import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { auth } from "../../firebase/config";
import { useUserLoginMutation, useUserRegisterMutation } from "../../services/authApi";
import { useAppDispatch } from "../../lib/hook";
import { setAccessToken, setRefreshToken } from "../../features/auth/authSlice";
import { toast } from "react-toastify";

export const GoogleLoginComponent = ({ label = "Register with Google" }) => {
  // setup login, popup, logout
  const [error, setError] = useState();
  // pending
  const [pending, setIsPending] = useState(false);
  // data (user credential)
  const [user, setUser] = useState(null);
  // create provider
  const provider = new GoogleAuthProvider();
  provider.addScope("email");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [oauthRegister] = useUserRegisterMutation();
  const [oauthLogin] = useUserLoginMutation();

  // useEffect tracking on user credential
  useEffect(() => {
    const unsubscriber = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        throw new Error("unsubscribe user");
      }
    });
    return () => unsubscriber();
  }, []);

  // setup login with google
  const loginWithGoogle = async () => {
    setIsPending(true);
    try {
      const res = await signInWithPopup(auth, provider);
      if (!res) {
        throw new Error("login unsuccessfully");
      }
      const user = res.user;
      const profileInfo = user.providerData[0];

      // Same derived password must be used for BOTH register and login --
      // previously register used displayName.slice(0,5) but login used the
      // full displayName, so the generated password never matched and the
      // login call always failed with "incorrect email or password". No
      // successful login meant no access token, which is why the profile
      // (avatar included) never loaded afterwards.
      const derivedPassword = `${profileInfo.displayName.slice(0, 5)}168$$`;

      const loginPayload = {
        userLoginRequest: {
          email: profileInfo.email,
          password: derivedPassword,
        },
      };

      // Try logging in first (covers returning users). Only register if
      // that fails, i.e. this Google account hasn't signed up yet.
      let loginResult = await oauthLogin(loginPayload);

      if (!loginResult?.data?.accessToken) {
        await oauthRegister({
          userRegisterRequest: {
            username: profileInfo.displayName.slice(0, 5),
            phoneNumber: profileInfo.phoneNumber || "",
            address: {
              addressLine1: "string",
              addressLine2: "string",
              road: "string",
              linkAddress: "string",
            },
            email: profileInfo.email,
            password: derivedPassword,
            confirmPassword: derivedPassword,
            profile: profileInfo.photoURL,
          },
        });
        loginResult = await oauthLogin(loginPayload);
      }

      if (loginResult?.data?.accessToken) {
        // This was missing entirely before: the login call ran but its
        // token was never dispatched to redux, so the app never actually
        // considered you logged in and every authenticated request
        // (including /users/me, which supplies the avatar) ran without a
        // token and failed.
        dispatch(setAccessToken(loginResult.data.accessToken));
        dispatch(setRefreshToken(loginResult.data.refreshToken));
        toast.success("You have logged in successfully!");
        navigate("/");
      } else {
        toast.error("Google sign-in failed. Please try again.");
      }
    } catch (error) {
      setError(error);
      console.log(error.message);
    } finally {
      setIsPending(false);
    }
  };

  //logout features
  const googleLogout = async () => {
    setIsPending(false);
    setError(null);
    try {
      await signOut(auth);
      setIsPending(true);
      console.log("Logout successfully!");
    } catch (error) {
      setError(error);
      console.log(error.message);
      setIsPending(false);
    }
  };

  return (
    <button
      className="w-full mt-4 border border-gray-300 py-2 rounded-lg flex items-center justify-center hover:bg-gray-100 transition"
      onClick={loginWithGoogle}
    >
      <img
        src="https://www.svgrepo.com/show/355037/google.svg"
        alt="Google"
        className="w-5 h-5 mr-2"
      />
      {label}
    </button>
  );
};
