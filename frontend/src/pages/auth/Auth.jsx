import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Login from "../../components/auth/Login";
import Register from "../../components/auth/Register";

/* ─── Framer Motion Variants ─── */
export const pageVariants = {
  initial: (dir) => ({ opacity: 0, x: dir > 0 ? 40 : -40 }),
  animate: { opacity: 1, x: 0, transition: { duration: 0.38, ease: [0.32, 0.72, 0, 1] } },
  exit: (dir) => ({ opacity: 0, x: dir > 0 ? -40 : 40, transition: { duration: 0.26, ease: [0.32, 0.72, 0, 1] } }),
};

export const containerVariants = {
  animate: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

export const itemVariants = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.38, ease: [0.32, 0.72, 0, 1] } },
};

/* ─── Input Field ─── */
export const InputField = ({ label, type = "text", placeholder, value, onChange, autoFocus }) => {
  const [focused, setFocused] = useState(false);

  return (
    <motion.div variants={itemVariants} className="flex flex-col gap-1.5">
      <label className={`text-[0.68rem] font-semibold uppercase tracking-widest transition-colors duration-200 ${focused ? "text-[var(--color-primary)]" : "text-[var(--color-text-secondary)]"
        }`}>
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoFocus={autoFocus}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={`w-full rounded-[10px] px-3.5 py-[11px] text-sm outline-none transition-all duration-200
          bg-[var(--color-projectcardbg)] text-[var(--color-text-primary)]
          placeholder:text-[var(--color-text-secondary)]
          ${focused
            ? "border-[1.5px] border-[var(--color-primary)] shadow-[0_0_0_3px_var(--color-primary-glow)]"
            : "border-[1.5px] border-[var(--color-border)] shadow-none"
          }`}
      />
    </motion.div>
  );
};

/* ─── Success State ─── */
export const SuccessState = ({ icon, title, subtitle, action }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.92 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ type: "spring", stiffness: 280, damping: 22 }}
    className="flex flex-col items-center gap-5 py-10 text-center"
  >
    <motion.div
      initial={{ scale: 0, rotate: -20 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.1 }}
      className="w-16 h-16 rounded-full flex items-center justify-center text-[1.6rem]
                 text-[var(--color-primary)] bg-[var(--color-primary-subtle)]
                 border-[1.5px] border-[var(--color-primary-muted)]"
    >
      {icon}
    </motion.div>

    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <p className="text-[1.35rem] italic font-serif text-[var(--color-text-primary)]">
        {title}
      </p>
      <p className="text-[0.82rem] text-[var(--color-text-secondary)] mt-1">{subtitle}</p>
    </motion.div>

    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      onClick={action.onClick}
      className="rounded-[9px] px-5 py-2 text-[0.82rem] font-semibold cursor-pointer border-none
                 bg-[var(--color-primary)] text-[var(--color-primary-foreground)]"
    >
      {action.label}
    </motion.button>
  </motion.div>
);

/* ─── Google Button ─── */
export const GoogleButton = () => (
  <motion.button
    whileHover={{ scale: 1.015 }}
    whileTap={{ scale: 0.975 }}
    className="w-full flex items-center justify-center gap-2 rounded-[10px] py-[11px]
               text-[0.82rem] font-medium cursor-pointer transition-colors duration-200
               bg-[var(--color-projectcardbg)] text-[var(--color-text-primary)]
               border-[1.5px] border-[var(--color-border)] hover:bg-[var(--color-lightgray)]"
  >
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
    Continue with Google
  </motion.button>
);


/* ─── Root App ─── */
export default function Auth() {
  const [page, setPage] = useState("register");
  const [direction, setDirection] = useState(1);

  const goTo = (p) => {
    setDirection(p === "login" ? 1 : -1);
    setPage(p);
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-6 bg-[var(--color-bg)]">

      {/* Ambient glow blob */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute -top-[15%] left-1/2 -translate-x-1/2 w-[700px] h-[450px] rounded-full blur-[90px] bg-[var(--color-primary-glow)]" />
      </div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
        className="w-full max-w-[400px] relative rounded-[18px] overflow-hidden
                   bg-[var(--color-surface)] border border-[var(--color-border)]
                   shadow-[0_8px_48px_var(--color-shadow),0_1px_3px_var(--color-shadow-sm)]"
      >
        {/* Top accent bar */}
        <div className="h-[3px] bg-[var(--color-primary)]" />

        {/* Tab switcher */}
        <div className="px-6 pt-5">
          <div className="flex p-1 gap-1 rounded-[10px] bg-[var(--color-bg)] border border-[var(--color-border)]">
            {["register", "login"].map((p) => (
              <motion.button
                key={p}
                onClick={() => goTo(p)}
                className="flex-1 relative rounded-[7px] py-2 px-3 text-[0.72rem] font-semibold
                           uppercase tracking-[0.08em] cursor-pointer border-none bg-transparent
                           transition-colors duration-200 z-[1]"
                style={{ color: page === p ? "var(--color-text-primary)" : "var(--color-text-secondary)" }}
              >
                {page === p && (
                  <motion.div
                    layoutId="tab-pill"
                    className="absolute inset-0 rounded-[7px] -z-[1]
                               bg-[var(--color-surface)] border border-[var(--color-border)]
                               shadow-[0_1px_4px_var(--color-shadow-sm)]"
                    transition={{ type: "spring", stiffness: 420, damping: 32 }}
                  />
                )}
                {p === "register" ? "Register" : "Login"}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Page content */}
        <div className="px-6 pt-7 pb-6 min-h-[430px]">
          <AnimatePresence mode="wait" custom={direction}>
            {page === "register" ? (
              <Register key="register" onSwitch={() => goTo("login")} direction={direction} />
            ) : (
              <Login key="login" onSwitch={() => goTo("register")} direction={direction} />
            )}
          </AnimatePresence>
        </div>
      </motion.div>

    </div>
  );
}

