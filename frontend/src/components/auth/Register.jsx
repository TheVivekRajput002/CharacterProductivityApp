
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { pageVariants, containerVariants, itemVariants, InputField, SuccessState, GoogleButton } from "../../pages/auth/Auth";
import axios from "axios"


/* ─── Register Page ─── */
const RegisterPage = ({ onSwitch, direction }) => {
  const [form, setForm] = useState({ name: "", username: "", email: "", password: "" });
  const [done, setDone] = useState(false);
  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));

  if (done) {
    return (
      <SuccessState
        icon="✓"
        title={`Welcome, ${form.name.split(" ")[0] || "friend"}!`}
        subtitle="Your account has been created."
        action={{
          label: "Sign in now →",
          onClick: () => { setDone(false); setForm({ name: "", username: "", email: "", password: "" }); onSwitch(); },
        }}
      />
    );
  }

  const handleSubmit = () => {

  }

  return (
    <motion.div custom={direction} variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <motion.div variants={containerVariants} initial="initial" animate="animate" className="flex flex-col">

        {/* Header */}
        <motion.div variants={itemVariants} className="mb-7">
          <p className="flex items-center gap-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-[var(--color-primary)] mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" />
            New Account
          </p>
          <h1 className="font-serif text-[2rem] italic leading-tight text-[var(--color-text-primary)]">
            Create your<br />account
          </h1>
          <p className="text-[0.82rem] text-[var(--color-text-secondary)] mt-1.5">
            Join us — it only takes a moment.
          </p>
        </motion.div>

        {/* Fields */}
        <div className="flex flex-col gap-3.5">
          <InputField label="Full Name" placeholder="Jane Doe" value={form.name} onChange={set("name")} autoFocus />
          <InputField label="Username" placeholder="janedoe" value={form.username} onChange={set("username")} />
          <InputField label="Email" placeholder="jane@example.com" value={form.email} onChange={set("email")} type="email" />
          <InputField label="Password" placeholder="Min. 8 characters" value={form.password} onChange={set("password")} type="password" />
        </div>

        {/* Submit */}
        <motion.div variants={itemVariants} className="mt-5">
          <motion.button
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.975 }}
            onClick={() => { if (form.name && form.username && form.email && form.password) setDone(true); handleSubmit(); }}
            className="w-full rounded-[10px] py-3 text-sm font-semibold tracking-wide cursor-pointer border-none
                       bg-[var(--color-primary)] text-[var(--color-primary-foreground)]
                       transition-all duration-200 hover:shadow-[0_6px_24px_var(--color-primary-glow)]"
          >
            Create Account
          </motion.button>
        </motion.div>

        {/* Switch */}
        <motion.p variants={itemVariants} className="text-center text-[0.82rem] text-[var(--color-text-secondary)] mt-4">
          Already have an account?{" "}
          <motion.button
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            onClick={onSwitch}
            className="bg-transparent border-none text-[var(--color-primary)] font-semibold cursor-pointer text-[0.82rem]"
          >
            Sign in
          </motion.button>
        </motion.p>

      </motion.div>
    </motion.div>
  );
};

export default RegisterPage;
