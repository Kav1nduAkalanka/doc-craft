import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, FileText } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { Button, Input, Label } from "../components/ui";
import { AnimatedAuthBackground } from "../components/AnimatedAuthBackground";

const RegisterPage: React.FC = () => {
  const { register, googleAuth, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const autoSelectType = location.state?.autoSelectType;

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [localError, setLocalError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");

    if (password.length < 8) {
      setLocalError("Password must be at least 8 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setLocalError("Passwords do not match.");
      return;
    }

    try {
      await register(email, password);
      navigate("/builder", { state: { autoSelectType } });
    } catch {
      // Error handled by store
    }
  };

  const displayError = localError || error;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen grid lg:grid-cols-2 bg-[#050814]"
    >
      {/* Animated Characters Background */}
      <AnimatedAuthBackground 
        isTyping={isTyping} 
        passwordLength={password.length} 
        showPassword={showPassword} 
      />

      {/* Right Register Section */}
      <div className="flex items-center justify-center p-8 bg-transparent">
        <div className="w-full max-w-[420px]">
          {/* Mobile Logo */}
          <Link to="/" className="lg:hidden flex items-center justify-center gap-2.5 text-lg font-bold text-white mb-12">
            <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <FileText size={20} className="text-white" />
            </div>
            <span>
              Doc<span className="text-brand-400">Craft</span>
            </span>
          </Link>

          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Create your account</h1>
            <p className="text-surface-400 text-sm">Start creating professional documents for free</p>
          </div>

          {/* Social Register */}
          <div className="mb-8">
            <Button variant="outline" className="w-full" type="button" onClick={googleAuth}>
              <Mail className="mr-2 size-5" />
              Sign up with Google
            </Button>
          </div>

          <div className="relative flex items-center justify-center mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-surface-700"></div>
            </div>
            <span className="relative bg-[#050814] px-4 text-xs text-surface-500 uppercase tracking-wider">or</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {displayError && (
              <div className="p-3 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg">
                {displayError}
              </div>
            )}

            <div className="space-y-2 text-left">
              <Label htmlFor="register-email">Email</Label>
              <Input
                id="register-email"
                type="email"
                placeholder="you@email.com"
                value={email}
                autoComplete="off"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setEmail(e.target.value); clearError(); setLocalError(""); }}
                onFocus={() => setIsTyping(true)}
                onBlur={() => setIsTyping(false)}
                required
              />
            </div>

            <div className="space-y-2 text-left">
              <Label htmlFor="register-password">Password</Label>
              <div className="relative">
                <Input
                  id="register-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setPassword(e.target.value); setLocalError(""); }}
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-2 text-left">
              <Label htmlFor="register-confirm">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="register-confirm"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setConfirmPassword(e.target.value); setLocalError(""); }}
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <div className="text-center text-sm text-surface-400 mt-8">
            Already have an account?{" "}
            <Link to="/login" state={{ autoSelectType }} className="text-brand-400 font-medium hover:text-brand-300">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RegisterPage;
