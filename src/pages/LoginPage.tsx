import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, FileText } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { Button, Input, Label, Checkbox } from "../components/ui";
import { AnimatedAuthBackground } from "../components/AnimatedAuthBackground";

const LoginPage: React.FC = () => {
  const { login, googleAuth, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const autoSelectType = location.state?.autoSelectType;

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/builder', { state: { autoSelectType } });
    } catch {
      // Error is stored in authStore
    }
  };

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

      {/* Right Login Section */}
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
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Welcome back!</h1>
            <p className="text-surface-400 text-sm">Please enter your details</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg">
                {error}
              </div>
            )}

            <div className="space-y-2 text-left">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="anna@gmail.com"
                value={email}
                autoComplete="off"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setEmail(e.target.value); clearError(); }}
                onFocus={() => setIsTyping(true)}
                onBlur={() => setIsTyping(false)}
                required
              />
            </div>

            <div className="space-y-2 text-left">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setPassword(e.target.value); clearError(); }}
                  required
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

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <Label htmlFor="remember" className="font-normal cursor-pointer text-surface-400">
                  Remember for 30 days
                </Label>
              </div>
              <Link to="/password-reset" className="text-sm text-brand-400 hover:text-brand-300 font-medium">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Log in"}
            </Button>
          </form>

          <div className="mt-6">
            <Button variant="outline" className="w-full" type="button" onClick={googleAuth}>
              <Mail className="mr-2 size-5" />
              Log in with Google
            </Button>
          </div>

          <div className="text-center text-sm text-surface-400 mt-8">
            Don't have an account?{" "}
            <Link to="/register" state={{ autoSelectType }} className="text-brand-400 font-medium hover:text-brand-300">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LoginPage;
