/* ─── Login Page ─── */
import { useState } from "react";
import { motion } from "motion/react";
import axios from "axios"
import {useNavigate} from 'react-router-dom'
import { pageVariants, containerVariants, itemVariants, InputField, SuccessState, GoogleButton } from "../../pages/auth/Auth";

const LoginPage = ({ onSwitch, direction }) => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [done, setDone] = useState(false);
  const [isInValidEmailPassword, setIsInValidEmailPassword] = useState(false)
  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));

  const navigate = useNavigate();

  if (done) {
    return (
      <SuccessState
        icon="◈"
        title="Welcome back!"
        subtitle="You're now signed in."
        action={{
          label: "← Go to Home",
          onClick: () => { setDone(false); navigate("/") },
        }}
      />
    );
  }

  const handleSubmit = async(e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3000/api/auth/login", form)
      if (response.data.message === "invalid email or password") setIsInValidEmailPassword(true)
      if (response.data.message === "Logged in successfully") setDone(true)

    } catch (error) {
      console.log("error in logging in:", error)
    }

  }

  return (
    <motion.div custom={direction} variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <motion.div variants={containerVariants} initial="initial" animate="animate" className="flex flex-col">

        {/* Header */}
        <motion.div variants={itemVariants} className="mb-7">
          <p className="flex items-center gap-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-[var(--color-text-secondary)] mb-2">
            <span className="w-1.5 h-1.5 rounded-full border-[1.5px] border-[var(--color-text-secondary)]" />
            Sign In
          </p>
          <h1 className="font-serif text-[2rem] italic leading-tight text-[var(--color-text-primary)]">
            Welcome back
          </h1>
          <p className="text-[0.82rem] text-[var(--color-text-secondary)] mt-1.5">
            Enter your credentials to continue.
          </p>
        </motion.div>

        {/* Form  */}
        <form action="" onSubmit={handleSubmit}>
          {/* Fields */}
          <div className="flex flex-col gap-3.5">
            <InputField label="Email" placeholder="jane@example.com" value={form.email} onChange={set("email")} type="email" autoFocus />
            <InputField label="Password" placeholder="Your password" value={form.password} onChange={set("password")} type="password" />
            {
              isInValidEmailPassword &&
              <p className="text-red-700 text-sm pl-2 mt-1">User already exists</p>
            }
          </div>

          {/* Forgot */}
          <motion.div variants={itemVariants} className="flex justify-end mt-2">
            <motion.button
              whileHover={{ scale: 1.03 }}
              className="bg-transparent border-none text-[0.78rem] text-[var(--color-text-secondary)] cursor-pointer hover:text-[var(--color-primary)] transition-colors duration-200"
            >
              Forgot password?
            </motion.button>
          </motion.div>

          {/* Submit */}
          <motion.div variants={itemVariants} className="mt-4">
            <motion.button
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.975 }}
              className="w-full rounded-[10px] py-3 text-sm font-semibold tracking-wide cursor-pointer border-none
                       bg-[var(--color-primary)] text-[var(--color-primary-foreground)]
                       transition-all duration-200 hover:shadow-[0_6px_24px_var(--color-primary-glow)]"
            >
              Sign In
            </motion.button>
          </motion.div>

        </form>


        {/* Divider */}
        <motion.div variants={itemVariants} className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-[var(--color-border)]" />
          <span className="text-[0.7rem] uppercase tracking-widest text-[var(--color-text-secondary)]">or</span>
          <div className="flex-1 h-px bg-[var(--color-border)]" />
        </motion.div>

        {/* Google */}
        <motion.div variants={itemVariants}>
          <GoogleButton />
        </motion.div>

        {/* Switch */}
        <motion.p variants={itemVariants} className="text-center text-[0.82rem] text-[var(--color-text-secondary)] mt-4">
          Don't have an account?{" "}
          <motion.button
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            onClick={onSwitch}
            className="bg-transparent border-none text-[var(--color-primary)] font-semibold cursor-pointer text-[0.82rem]"
          >
            Register
          </motion.button>
        </motion.p>

      </motion.div>
    </motion.div>
  );
};

export default LoginPage