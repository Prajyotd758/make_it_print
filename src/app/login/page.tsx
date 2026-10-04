"use client";

import { useEffect, useState, type FormEvent } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { checkPhone, registerUser } from "@/lib/api/auth";
import { ApiRequestError } from "@/lib/api/client";
import {
  ArrowRight,
  Box,
  Doc,
  Edit,
  Globe,
  Heart,
  Mail,
  MapPin,
  Phone,
  User,
} from "@/components/loginPage/icons";
import "@/components/loginPage/login.css";

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

const FEATURES = [
  {
    icon: Box,
    title: "Track Your Orders",
    text: "Get real-time updates on your 3D prints and deliveries.",
  },
  {
    icon: Edit,
    title: "Manage Custom Projects",
    text: "View progress, share files and stay in the loop.",
  },
  {
    icon: Doc,
    title: "View Quotes",
    text: "Check pricing, status and project details anytime.",
  },
  {
    icon: Heart,
    title: "Access Saved Designs",
    text: "Keep your favourite models and reorder easily.",
  },
];

const PHONE_RE = /^[6-9]\d{9}$/;

type Step = "phone" | "details";
type Errors = { phone?: string; name?: string; email?: string; form?: string };

const messageOf = (e: unknown) =>
  e instanceof ApiRequestError
    ? e.message
    : "Something went wrong. Please try again.";

export default function LoginPage() {
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState(""); // 10 digits, without +91
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  const router = useRouter();
  const { data: session, status } = useSession();

  const goNext = () => {
    const cb = new URLSearchParams(window.location.search).get("callbackUrl");
    router.replace(cb && cb.startsWith("/") && !cb.startsWith("//") ? cb : "/");
  };

  // already signed in -> skip the form

  useEffect(() => {
    if (status === "authenticated" && !session?.error) goNext();
  }, [status, session?.error]); // eslint-disable-line react-hooks/exhaustive-deps

  function onPhoneChange(value: string) {
    const digits = value.replace(/\D/g, "");
    setPhone(digits.length > 10 ? digits.slice(-10) : digits); // handles pasted +91 / 0 prefixes
    if (errors.phone) setErrors({});
  }

  async function signInNow(newName?: string) {
    const res = await signIn("credentials", {
      phone,
      ...(newName && { name: newName }),
      redirect: false,
    });

    console.log("res : ", res);

    if (res?.error) {
      setErrors({ form: "Could not sign you in. Please try again." });
      setLoading(false);
      return;
    }
    goNext(); // keep loading=true while the redirect happens
  }

  async function submitPhone() {
    if (!PHONE_RE.test(phone)) {
      setErrors({ phone: "Enter a valid 10-digit mobile number" });
      return;
    }
    console.log("submit phone called");
    setLoading(true);
    setErrors({});
    try {
      if (await checkPhone(phone)) await signInNow();
      else {
        setStep("details");
        setLoading(false);
      }
    } catch (e) {
      setErrors({ form: messageOf(e) });
      setLoading(false);
    }
  }

  async function submitDetails() {
    if (name.trim().length < 2) {
      setErrors({ name: "Please enter your name" });
      return;
    }
    console.log("submit details called");

    setLoading(true);
    setErrors({});
    try {
      await registerUser({ name: name.trim(), phone, email });
      await signInNow(name.trim());
    } catch (e) {
      if (e instanceof ApiRequestError) {
        if (e.status === 409 && !e.message.toLowerCase().includes("email")) {
          await signInNow(); // number was registered in the meantime
          return;
        }
        setLoading(false);
        if (e.status === 409) return setErrors({ email: e.message });
        if (e.code === "VALIDATION_ERROR")
          return setErrors({
            name: e.fieldErrors.name?.[0],
            email: e.fieldErrors.email?.[0],
            phone: e.fieldErrors.phone?.[0],
          });
      }
      setLoading(false);
      setErrors({ form: messageOf(e) });
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (loading) return;
    if (step === "phone") void submitPhone();
    else void submitDetails();
  }

  function changeNumber() {
    setStep("phone");
    setErrors({});
  }

  const isDetails = step === "details";

  return (
    <div className={`auth ${sans.variable} ${mono.variable}`}>
      <header className="auth-header"></header>

      <main className="auth-main">
        <section className="auth-hero">
          <div className="auth-visual" aria-hidden="true">
            <svg
              className="auth-cube"
              viewBox="0 0 220 240"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            >
              <path d="M110 10 200 60v100l-90 50-90-50V60z" />
              <path d="M20 60l90 50 90-50M110 110v100" />
            </svg>
            <p className="auth-visual-label">
              Ideas
              <br />
              into
              <br />
              reality
            </p>
          </div>

          <div className="auth-copy">
            <h1 className="auth-title">
              Sign in to
              <br />
              <span className="auth-underline">Make It Print</span>
            </h1>
            <p className="auth-lead">
              Access your orders, manage custom projects, view quotes and more —
              all in one place.
            </p>

            <ul className="auth-features">
              {FEATURES.map(({ icon: Icon, title, text }) => (
                <li key={title}>
                  <span className="auth-feature-icon">
                    <Icon />
                  </span>
                  <div>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </div>
                </li>
              ))}
            </ul>

            <ul className="auth-meta">
              <li>
                <MapPin /> Chh. Sambhajinagar, India
              </li>
              <li>
                <Globe /> Global Shipping
              </li>
            </ul>
          </div>
        </section>

        <section className="auth-card" aria-live="polite">
          <form className="auth-step" key={step} onSubmit={onSubmit} noValidate>
            <span className="auth-bar" />
            <h2>
              {isDetails ? "Create your account" : "Sign in to Make It Print"}
            </h2>
            <p className="auth-sub">
              {isDetails
                ? "New here? Just a couple of details and you're in."
                : "Enter your mobile number to continue."}
            </p>

            <label className="auth-label" htmlFor="phone">
              Mobile number
            </label>
            <div
              className={`auth-field ${errors.phone ? "is-error" : ""} ${
                isDetails ? "is-locked" : ""
              }`}
            >
              <Phone className="auth-field-icon" />
              <span className="auth-prefix">+91</span>
              <input
                id="phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                placeholder="98765 43210"
                value={phone}
                onChange={(e) => onPhoneChange(e.target.value)}
                readOnly={isDetails}
                autoFocus={!isDetails}
                aria-invalid={!!errors.phone}
              />
              {isDetails && (
                <button
                  type="button"
                  className="auth-link-btn"
                  onClick={changeNumber}
                >
                  Change
                </button>
              )}
            </div>
            {errors.phone && <p className="auth-error">{errors.phone}</p>}
            {!isDetails && !errors.phone && (
              <p className="auth-hint">
                We only use your number to find your previous orders.
              </p>
            )}

            {isDetails && (
              <>
                <label className="auth-label" htmlFor="name">
                  Your name
                </label>
                <div className={`auth-field ${errors.name ? "is-error" : ""}`}>
                  <User className="auth-field-icon" />
                  <input
                    id="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name) setErrors({});
                    }}
                    autoFocus
                    aria-invalid={!!errors.name}
                  />
                </div>
                {errors.name && <p className="auth-error">{errors.name}</p>}

                <label className="auth-label" htmlFor="email">
                  Email address{" "}
                  <span className="auth-optional">(optional)</span>
                </label>
                <div className={`auth-field ${errors.email ? "is-error" : ""}`}>
                  <Mail className="auth-field-icon" />
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors({});
                    }}
                    aria-invalid={!!errors.email}
                  />
                </div>
                {errors.email && <p className="auth-error">{errors.email}</p>}
              </>
            )}

            {errors.form && (
              <p className="auth-error auth-error-form" role="alert">
                {errors.form}
              </p>
            )}

            <button className="auth-btn" type="submit" disabled={loading}>
              {loading ? (
                <span className="auth-spinner" aria-label="Please wait" />
              ) : (
                <>
                  {isDetails ? "Create account" : "Continue"} <ArrowRight />
                </>
              )}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
