
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { pageVariants, containerVariants, itemVariants, InputField, SuccessState, GoogleButton } from "../../pages/auth/Auth";
import axios from "axios"
import { useNavigate } from 'react-router-dom'


/* ─── Register Page ─── */
const RegisterPage = ({ onSwitch, direction }) => {

  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", username: "", email: "", password: "" });
  const [done, setDone] = useState(false);
  const [isUserAlreadyExists, setisUserAlreadyExists] = useState(false)
  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));

  if (done) {
    return (
      <SuccessState
        icon="✓"
        title={`Welcome, ${form.name.split(" ")[0] || "friend"}!`}
        subtitle="Your account has been created."
        action={{
          label: "Go to Home →",
          onClick: () => { navigate('/') },
        }}
      />
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3000/api/auth/register", form);
      console.log(response.data);
      if (response.data.message === "User created successfully") setDone(true);
      if (response.data.message === "User already exists") setisUserAlreadyExists(true);

    } catch (error) {
      const msg = error.response?.data?.message || "Something went wrong";
      console.log("Registration error:", msg);
    }

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
            Create your account
          </h1>
          <p className="text-[0.82rem] text-[var(--color-text-secondary)] mt-1.5">
            Join us — it only takes a moment.
          </p>
        </motion.div>

        <form action="" onSubmit={handleSubmit}>

          {/* Fields */}
          <div className="flex flex-col gap-3.5">
            <InputField label="Full Name" placeholder="Jane Doe" value={form.name} onChange={set("name")} autoFocus />
            <InputField label="Username" placeholder="janedoe" value={form.username} onChange={set("username")} />
            <div>
              <InputField label="Email" placeholder="jane@example.com" value={form.email} onChange={set("email")} type="email" />
              {isUserAlreadyExists &&
                <p className="text-red-700 text-sm pl-2 mt-1">User already exists</p>
              }
            </div>
            <InputField label="Password" placeholder="Min. 8 characters" value={form.password} onChange={set("password")} type="password" />
          </div>

          {/* Submit */}
          <motion.div variants={itemVariants} className="mt-5">
            <motion.button
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.975 }}
              className="w-full rounded-[10px] py-3 text-sm font-semibold tracking-wide cursor-pointer border-none
                       bg-[var(--color-primary)] text-[var(--color-primary-foreground)]
                       transition-all duration-200 hover:shadow-[0_6px_24px_var(--color-primary-glow)]"
            >
              Create Account
            </motion.button>
          </motion.div>
        </form>


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
