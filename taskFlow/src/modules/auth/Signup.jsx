import React, { useState } from "react";
import "./auth.css";
import { supabase } from "../../supabase";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
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
    const { name, email, password } = formData;
    setErrorMessage("");
    setIsSubmitting(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (error) {
      setIsSubmitting(false);
      setErrorMessage(error.message);
    } else {
      const userId = data?.user?.id;

      if (!userId) {
        setIsSubmitting(false);
        setErrorMessage("Signup succeeded but user ID is missing.");
        return;
      }

      const { error: insertError } = await supabase.from("profiles").upsert(
        {
          id: userId,
          email,
          name,
        },
        { onConflict: "id" },
      );

      if (insertError) {
        setIsSubmitting(false);
        setErrorMessage(
          `Account created, but profile insert failed: ${insertError.message}`,
        );
        return;
      }

      setIsSubmitting(false);
      console.log("Signup successful:", data);
      navigate("/login", { replace: true });
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <div className="auth-image-placeholder">{/* Image will go here */}</div>
      </div>
      <div className="auth-right">
        <div className="auth-form-container">
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Sign up to get started</p>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
              />
            </div>

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
                placeholder="Create a password"
                required
              />
            </div>

            {errorMessage && <p className="auth-error">{errorMessage}</p>}

            <button
              type="submit"
              className="auth-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <p className="auth-link">
            Already have an account? <a href="/login">Login</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
