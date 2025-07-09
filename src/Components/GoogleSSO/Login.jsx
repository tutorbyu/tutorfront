import React from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
// import jwt_decode from 'jwt-decode';
import axios from "axios";
import { useNavigate } from "react-router-dom";
const Login = () => {
    
  const navigate = useNavigate();

  const handleSuccess = async (response) => {
    console.log("Login Success:", response.credential);
    // Decode the JWT token if needed

     try {
      // ✅ Send ID token to FastAPI
      const res = await axios.post('http://localhost:8000/tutor/api/google', {
        token:  response.credential,
      });

      const user = res.data.user;
      console.log("User from backend:", user);

      // ✅ Store token and user
    //   localStorage.setItem("google_token", idToken);
      localStorage.setItem("user", JSON.stringify(user));

      // ✅ Redirect
       navigate('/');
    } catch (err) {
      console.error("Login failed:", err);
    }
    // Use the token to authenticate with your backend

  };

  const handleError = () => {
    console.error("Login Failed");
  };

  return (
    <GoogleOAuthProvider clientId="1074589453393-idm2ga09t6vnkqigr5f9i1or1jtc1t7a.apps.googleusercontent.com">
      <div>
        <h1>Google SSO in React</h1>
        <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
      </div>
    </GoogleOAuthProvider>
  );

   
};

export default Login;