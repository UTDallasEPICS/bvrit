import { useState } from "react";
import "../auth.css";

function PawGoLogo() {
  return (
    <div className="pawgo-logo-container">
      <div className="pawgo-logo">
        <div className="paw-icon">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <ellipse
              cx="9"
              cy="6"
              rx="2"
              ry="2.8"
              fill="white"
              fillOpacity="0.9"
            />
            <ellipse
              cx="15"
              cy="6"
              rx="2"
              ry="2.8"
              fill="white"
              fillOpacity="0.9"
            />
            <ellipse
              cx="5.5"
              cy="10.5"
              rx="1.6"
              ry="2.3"
              fill="white"
              fillOpacity="0.9"
            />
            <ellipse
              cx="18.5"
              cy="10.5"
              rx="1.6"
              ry="2.3"
              fill="white"
              fillOpacity="0.9"
            />
            <path
              d="M12 11C9.2 11 7 13 7 16c0 2.5 1.8 4 5 4s5-1.5 5-4c0-3-2.2-5-5-5z"
              fill="white"
              fillOpacity="0.9"
            />
          </svg>
        </div>

        <span className="pawgo-text">
          Paw<span>Go</span>
        </span>
      </div>

      <p>Connecting pets with loving families</p>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17.64 9.2a10.34 10.34 0 0 0-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92a8.78 8.78 0 0 0 2.68-6.62z"
        fill="#4285F4"
      />
      <path
        d="M9 18a8.6 8.6 0 0 0 5.96-2.18l-2.92-2.26a5.43 5.43 0 0 1-8.09-2.85H.98v2.34A9 9 0 0 0 9 18z"
        fill="#34A853"
      />
      <path
        d="M3.95 10.71a5.41 5.41 0 0 1 0-3.42V4.95H.98a9 9 0 0 0 0 8.1l2.97-2.34z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.58a4.86 4.86 0 0 1 3.44 1.35l2.58-2.58A8.64 8.64 0 0 0 9 0 9 9 0 0 0 .98 4.95l2.97 2.34A5.36 5.36 0 0 1 9 3.58z"
        fill="#EA4335"
      />
    </svg>
  );
}

function EyeIcon({ open }) {
  if (open) {
    return (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    );
  }

  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function getPasswordStrength(password) {
  if (password.length === 0) {
    return {
      label: "",
      level: 0,
      color: "",
    };
  }

  let score = 0;

  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) {
    return {
      label: "Weak",
      level: 1,
      color: "#EF4444",
    };
  }

  if (score <= 2) {
    return {
      label: "Medium",
      level: 2,
      color: "#F59E0B",
    };
  }

  return {
    label: "Strong",
    level: 3,
    color: "#22C55E",
  };
}

function InputField({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  rightElement,
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="input-group">
      <label>{label}</label>

      <div className="input-wrapper">
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={focused ? "input focused" : "input"}
        />

        {rightElement && (
          <div className="input-icon">
            {rightElement}
          </div>
        )}
      </div>
    </div>
  );
}

function Divider() {
  return (
    <div className="divider">
      <div></div>
      <span>or</span>
      <div></div>
    </div>
  );
}

function PrimaryButton({ label }) {
  return (
    <button className="primary-button">
      {label}
    </button>
  );
}

function GoogleButton() {
  return (
    <button className="google-button">
      <GoogleIcon />
      Continue with Google
    </button>
  );
}

function LoginPage({ onSwitch }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  return (
    <>
      <div className="auth-heading">
        <h1>Welcome back!</h1>

        <p>
          Log in to continue your PawGo journey.
        </p>
      </div>

      <div className="form-container">

        <InputField
          label="Email Address"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={setEmail}
        />

        <InputField
          label="Password"
          type={showPassword ? "text" : "password"}
          placeholder="Enter your password"
          value={password}
          onChange={setPassword}
          rightElement={
            <span
              onClick={() =>
                setShowPassword((value) => !value)
              }
            >
              <EyeIcon open={showPassword} />
            </span>
          }
        />

        <div className="remember-row">

          <label className="remember-label">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) =>
                setRemember(e.target.checked)
              }
            />

            <span>Remember me</span>
          </label>

          <button className="forgot-button">
            Forgot password?
          </button>

        </div>

        <PrimaryButton label="Login" />

        <Divider />

        <GoogleButton />

        <p className="switch-text">
          Don't have an account?{" "}
          <button onClick={onSwitch}>
            Sign up
          </button>
        </p>

      </div>
    </>
  );
}

function SignupPage({ onSwitch }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirm, setShowConfirm] =
    useState(false);

  const [agreed, setAgreed] = useState(false);

  const strength = getPasswordStrength(password);

  return (
    <>
      <div className="auth-heading signup-heading">
        <h1>Create your PawGo account</h1>

        <p>
          Join PawGo and help pets find their forever home.
        </p>
      </div>

      <div className="form-container">

        <InputField
          label="Full Name"
          placeholder="Enter your full name"
          value={name}
          onChange={setName}
        />

        <InputField
          label="Email Address"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={setEmail}
        />

        <div>
          <InputField
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="Create a password"
            value={password}
            onChange={setPassword}
            rightElement={
              <span
                onClick={() =>
                  setShowPassword((value) => !value)
                }
              >
                <EyeIcon open={showPassword} />
              </span>
            }
          />

          {password.length > 0 && (
            <div className="password-strength">

              <div className="strength-bars">

                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="strength-bar"
                    style={{
                      background:
                        item <= strength.level
                          ? strength.color
                          : "#E2E8F0",
                    }}
                  />
                ))}

              </div>

              <p
                style={{
                  color: strength.color,
                }}
              >
                {strength.label} password
              </p>

            </div>
          )}
        </div>

        <InputField
          label="Confirm Password"
          type={showConfirm ? "text" : "password"}
          placeholder="Confirm your password"
          value={confirm}
          onChange={setConfirm}
          rightElement={
            <span
              onClick={() =>
                setShowConfirm((value) => !value)
              }
            >
              <EyeIcon open={showConfirm} />
            </span>
          }
        />

        <label className="terms-label">

          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) =>
              setAgreed(e.target.checked)
            }
          />

          <span>
            I agree to the{" "}
            <span className="terms-link">
              Terms of Service
            </span>{" "}
            and{" "}
            <span className="terms-link">
              Privacy Policy
            </span>
            .
          </span>

        </label>

        <PrimaryButton label="Create Account" />

        <Divider />

        <GoogleButton />

        <p className="switch-text">
          Already have an account?{" "}
          <button onClick={onSwitch}>
            Login
          </button>
        </p>

      </div>
    </>
  );
}

export default function Auth() {
  const [page, setPage] = useState("login");

  return (
    <div className="auth-page">

      <div className="auth-container">

        <PawGoLogo />

        <div className="auth-card">

          {page === "login" ? (
            <LoginPage
              onSwitch={() => setPage("signup")}
            />
          ) : (
            <SignupPage
              onSwitch={() => setPage("login")}
            />
          )}

        </div>

        <p className="footer">
          © 2026 PawGo · Connecting pets with loving families
        </p>

      </div>

    </div>
  );
}