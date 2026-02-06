import { useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";


const GoogleButton = () => {
  const buttonRef = useRef(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    if (!window.google) return;

    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: async (response) => {
        try {
          const res = await axios.post(
            `${import.meta.env.VITE_API_URL}/auth/google`,
            { token: response.credential }
          );

          // rememberMe = true for Google
          login(res.data.token, res.data.user, true);
          navigate("/home");
        } catch (err) {
          console.error("Google login failed", err);
        }
      },
    });

    window.google.accounts.id.renderButton(buttonRef.current, {
      theme: "outline",
      size: "large",
      text: "continue_with",
      width: 320,
    });
  }, []);

  return <div ref={buttonRef}></div>;
};

export default GoogleButton;
