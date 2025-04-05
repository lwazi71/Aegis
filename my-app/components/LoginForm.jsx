import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function LoginForm({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5100/verify", {
        email,
        password,
      });
    // previous success message to debug whether user exists in db or not
    //   alert(res.data.message || "Success!");
    // cleaner login/signup once done testing with db
      console.log(res.data.message); 

      onLogin(email); // pass email back up
      navigate("/analyze");
    } catch (err) {
      alert(err.response?.data?.error || "Something went wrong.");
    }
  };

  return (
    <form className="p-4 p-md-5 border rounded-3 bg-light" onSubmit={handleSubmit}>
      <div className="form-floating mb-3">
        <input
          type="email"
          className="form-control"
          id="floatingInput"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="floatingInput">Email address</label>
      </div>
      <div className="form-floating mb-3">
        <input
          type="password"
          className="form-control"
          id="floatingPassword"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <label htmlFor="floatingPassword">Password</label>
      </div>
      <div className="checkbox mb-3">
        <label>
          <input type="checkbox" value="remember-me" /> Remember me
        </label>
      </div>
      <button className="w-100 btn btn-lg btn-primary" type="submit">
        Sign up / Log in
      </button>
      <hr className="my-4" />
      <small className="text-muted">
        By clicking Sign up / Log in, you agree to the terms of use.
      </small>
    </form>
  );
}

export default LoginForm;
