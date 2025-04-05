// working login/sign up page

import React, { useState } from "react";

function Home() {
  //original
  // const [email, setEmail] = useState("");
  const [email, setEmail] = useState(localStorage.getItem("email") || "");

  const [password, setPassword] = useState("");
  // original
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("email"));


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      // Remove alert pop-up
      localStorage.setItem("email", email);
      setIsLoggedIn(true);
      // Optional: redirect to another page
      // navigate("/analyze");
    } catch (err) {
      alert(err.response?.data?.error || "Something went wrong.");
    }
  };

  return (
    <>
      <div className="container col-xl-10 col-xxl-8 px-4 py-5">
        <div className="row align-items-center g-lg-5 py-5">
          {/*Previous column css -> col-lg-7 text-center text-lg-start*/}
          <div className="col-lg-7 d-flex flex-column justify-content-center">
            {!isLoggedIn ? (
              <>
                <h1 className="display-4 fw-bold lh-1 mb-3">Ready to join?</h1>
                <p className="col-lg-10 fs-4">
                  Sign up or log in to securely analyze images and documents for sensitive content.
                  Our AI tools help protect your privacy and prevent data leaks in seconds.
                </p>
              </>
            ) : (
              <>
                {/* Previous naming -> <h1 className="display-4 fw-bold lh-1 mb-3">Welcome to your dashboard</h1> */}
                <p className="col-lg-10 fs-4">
                  Start scanning your files for sensitive content using the Analyze or User Data tabs above. Aegis instantly detects privacy risks so you can take control of your data.
                </p>
              </>
            )}
          </div>
          {/* previous column css -> "col-md-10 mx-auto col-lg-5" */}
          <div className="col-md-10 mx-auto col-lg-5 d-flex flex-column justify-content-center">
            {!isLoggedIn ? (
              <form
                className="p-4 p-md-5 border rounded-3 bg-light"
                onSubmit={handleSubmit}
              >
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
            ) : (
              <div className="text-center mt-5">
                <h2>Welcome back!</h2>
                <p>Choose a tool above to begin — Analyze for file scanning or check out Insights for recent results.</p>
                <button
                className="btn btn-outline-secondary mt-3"
                onClick={() => {
                  localStorage.removeItem("email");
                  setEmail("");
                  setIsLoggedIn(false);
                }}
                >
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container col-xl-10 col-xxl-8 px-4 py-5">
        <div className="row g-4 py-5 row-cols-1 row-cols-lg-3">
          <div className="feature col text-center text-lg-start">
            <div className="icon-circle bg-primary text-white mb-4">
              <i className="bi bi-image fs-2"></i>
            </div>
            <h3 className="fs-4 text-body-emphasis">Picture Screening</h3>
            <p>
              Scan Images for Sensitive Content - Instantly screen uploaded images
              for faces, IDs, documents, and personal visuals using AI-powered detection.
              Our model highlights risky areas before they become a problem.
            </p>
          </div>

          <div className="feature col text-center text-lg-start">
            <div className="icon-circle bg-primary text-white mb-4">
              <i className="bi bi-file-earmark-text fs-2"></i>
            </div>
            <h3 className="fs-4 text-body-emphasis">Text Detection</h3>
            <p>
              Detect Leaks in Plain Text - Whether it's a note, message, or document —
              our AI reads and flags sensitive information like names, emails, phone numbers,
              and more, giving you full control over your data.
            </p>
          </div>

          <div className="feature col text-center text-lg-start">
            <div className="icon-circle bg-primary text-white mb-4">
              <i className="bi bi-shield-lock fs-2"></i>
            </div>
            <h3 className="fs-4 text-body-emphasis">Privacy</h3>
            <p>
              Your Data, Protected by Design - We prioritize privacy at every level.
              Files are processed securely, never stored, and always handled locally when
              possible — because your information belongs to you.
            </p>
          </div>
        </div>
      </div>

      <div className="aboutImage d-flex align-items-center justify-content-center">
        <div className="container text-center text-white">
          <h2 className="fw-bold" style={{ fontSize: "1.25em" }}>Who We Are</h2>
          <h1 className="display-6 my-4" style={{ fontSize: "1.35em" }}>
            We're on a mission to protect your privacy in an AI-powered world.
          </h1>

          <div className="row justify-content-center mb-4">
            <div className="col-md-5 mb-3">
              <p style={{ fontSize: "1.2em" }}>
                Our tool detects sensitive information in both images and text files —
                from faces and documents to names, emails, and other private data. With
                one upload, our AI gives you full visibility into potential risks.
              </p>
            </div>
            <div className="col-md-5 mb-3">
              <p style={{ fontSize: "1.2em" }}>
                PrivacyGuard AI is built for transparency, speed, and security.
                No data is stored, everything is processed efficiently, and results are
                delivered in real-time. It's privacy made practical, for everyone.
              </p>
            </div>
          </div>

          <button type="button" className="btn btn-primary btn-lg">Check us out</button>
        </div>
      </div>
    </>
  );
}

export default Home;