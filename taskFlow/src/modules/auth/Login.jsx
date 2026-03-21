import React, { useState } from "react";
import "./auth.css";
import { supabase } from "../../supabase";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;
    setErrorMessage("");
    setIsSubmitting(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setIsSubmitting(false);
      setErrorMessage(error.message);
    } else {
      const userId = data?.user?.id;
      const userEmail = data?.user?.email || email;
      const userName = data?.user?.user_metadata?.name || "";

      if (!userId) {
        setIsSubmitting(false);
        setErrorMessage("Login succeeded but user ID is missing.");
        return;
      }

      const { error: profileError } = await supabase.from("profiles").upsert(
        {
          id: userId,
          email: userEmail,
          name: userName,
        },
        { onConflict: "id" },
      );

      if (profileError) {
        setIsSubmitting(false);
        setErrorMessage(
          `Login succeeded, but profile sync failed: ${profileError.message}`,
        );
        return;
      }

      setIsSubmitting(false);
      console.log("Login successful:", data);
      navigate("/dashboard", { replace: true });
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <div className="auth-image-placeholder">{/* Image will go here */}</div>
      </div>
      <div className="auth-right">
        <div className="auth-form-container">
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Login to your account</p>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
            </div>

            {errorMessage && <p className="auth-error">{errorMessage}</p>}

            <button
              type="submit"
              className="auth-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="auth-link">
            Don't have an account? <a href="/signup">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
