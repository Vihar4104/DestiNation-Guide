import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InputControlPage from "./InputControlPage";
import { auth, firestore } from "../config/firebase";
import logo from '../assets/images/logo.png';
import background from "../assets/images/background.jpg";
import logo1 from '../assets/images/hiking.png';
import './LoginPage.css'; // Import the CSS file for styling

function LoginPage() {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    email: "",
    pass: "",
  });
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userData, setUserData] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleSubmission = () => {
    if (!values.email || !values.pass) {
      setErrorMsg("All fields are mandatory");
      return;
    }
    setErrorMsg("");

    signInWithEmailAndPassword(auth, values.email, values.pass);
    fetchUserRole();
  };

  const fetchUserRole = async () => {
    const user = getAuth().currentUser;

    if (user) {
      const uid = user.uid;
      const userRoleRef = doc(firestore, "userRoles", uid);
      try {
        const docSnapshot = await getDoc(userRoleRef);

        if (docSnapshot.exists()) {
          const role = docSnapshot.data().role;
          setUserRole(role);
          const data = docSnapshot.data().name;
          setUserData(data);

          if (role === "Admin" || role === "user") {
            toast.success(`Logging in as ${data}`, {
              position: 'bottom-right',
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
            console.log("logging in");
            navigate("/");
          }
        } else {
          toast.success(`User doesn't exist! Please signup.`, {
            position: 'bottom-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          console.log("User doesn't exist. Please SignUp!");
          setUserRole(null);
        }
      } catch (error) {
        toast.success(`Error fetching user role: ${error}`, {
          position: 'bottom-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        console.error("Error fetching user role:", error);
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <div className="glass-login">
          <div className="logo-container">
            <img src={logo} alt="logo image" className="logo" />
          </div>
          <div className="form-container">
            <h1 className="login-heading">Login</h1>

            <InputControlPage
              label="Email"
              onChange={(event) =>
                setValues((prev) => ({ ...prev, email: event.target.value }))
              }
              placeholder="Enter email address"
              className="input-field"
            />

            <InputControlPage
              label="Password"
              onChange={(event) =>
                setValues((prev) => ({ ...prev, pass: event.target.value }))
              }
              placeholder="Enter Password"
              type={showPassword ? "text" : "password"}
              className="input-field"
            />

            <div className="error-message">
              <b className="text-red-500 block mb-2">{errorMsg}</b>
            </div>

            <button
              disabled={submitButtonDisabled}
              onClick={handleSubmission}
              className="login-button"
            >
              Login
            </button>

            <div className="forgot-password">
              <Link to="/forgotpassword" className="forgot-password-link">
                Forgot Password?
              </Link>
            </div>

            <p className="signup-text">
              Don't have an account?{" "}
              <span className="signup-link">
                <Link to="/signup">Sign up</Link>
              </span>
            </p>
          </div>
        </div>
        <div className="image-container">
          <img src={logo1} alt="Image Description" className="image" />
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
