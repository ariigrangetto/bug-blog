/* eslint-disable react/jsx-no-comment-textnodes */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthShell from '../../features/AuthShell.tsx';
import Cursor from '../../features/Cursor.tsx';
import { CheckCircle, Eye, EyeOff, UserPlus } from 'lucide-react';
import Client from '../../services/clients.ts';

const AUTH_INPUT = "w-full bg-[rgba(0,255,65,0.03)] border border-[#00ff41]/20 text-[#00ff41] text-xs font-mono px-3 py-2 outline-none placeholder-[#00882a]/50 focus:border-[#00ff41]/55 focus:shadow-[0_0_0_1px_rgba(0,255,65,0.14)] transition-all"

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [showPw, setShowPw] = useState(false);


  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('ALL FIELDS ARE REQUIRED');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('INVALID EMAIL ADDRESS');
      return;
    }

    setLoading(true);

    try {
      const { error: authError } = await Client.login(email, password);

      if (authError) {
        let friendlyMessage = authError.message;
        if (authError.status === 400 && authError.message.includes('Invalid login credentials')) {
          friendlyMessage = 'Incorrect login credentials. Please verify your email and password.';
        } else if (authError.message.toLowerCase().includes('email not confirmed')) {
          friendlyMessage = 'You must confirm your email address before logging in. Please check your inbox.';
        } else if (authError.message.toLowerCase().includes('rate limit')) {
          friendlyMessage = 'Too many login attempts. Please try again later.';
        }

        setError(friendlyMessage);
      } else {
        navigate('/');
      }
    } catch (err: unknown) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  function handleNavigateToHome() {
    navigate("/home");
  };

  function handleNavigateToRegister() {
    navigate("/register");
  }

  return (
    <AuthShell onHome={handleNavigateToHome} subtitle="// RESTRICTED SYSTEM ACCESS">
      <div className="w-full max-w-xs border border-[#00ff41]/22 overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2 bg-[#0a150a] border-b border-[#00ff41]/15">
          <div className="flex gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500/50" />
            <span className="w-2 h-2 rounded-full bg-yellow-500/50" />
            <span className="w-2 h-2 rounded-full bg-[#00ff41]/50" />
          </div>
          <span className="flex-1 text-center text-[9px] text-[#00882a] tracking-[0.2em]">
            auth.sh &mdash; login
          </span>
        </div>
        {
          error && (
            <div className="py-10 text-center">
              <CheckCircle size={40} className="text-[#ff0000a1] glow mx-auto mb-4" />
              <div className="font-['VT323'] text-lg text-[#ff0000a1] glow mb-3" style={{ animation: "flicker 2s ease-in-out infinite" }}>
                {error}
              </div>
            </div>
          )
        }


        <div className="p-6">
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="text-[10px] text-[#00882a] space-y-0.5 mb-4 select-none">
              <div>&gt; AUTHENTICATE TO CONTINUE</div>
              <div className="flex items-center gap-1">&gt; AWAITING CREDENTIALS <Cursor /></div>
            </div>

            <div>
              <label className="block text-[9px] text-[#00882a] tracking-[0.2em] mb-1.5">// EMAIL</label>
              <div className="flex items-center gap-2">
                <span className="text-[#00882a] text-sm select-none shrink-0">$</span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className={AUTH_INPUT}
                />
              </div>
            </div>

            <div>
              <label className="block text-[9px] text-[#00882a] tracking-[0.2em] mb-1.5">// PASSWORD</label>
              <div className="flex items-center gap-2">
                <span className="text-[#00882a] text-sm select-none shrink-0">$</span>
                <div className="relative flex-1">
                  <input
                    type={showPw ? "text" : "password"} required value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={AUTH_INPUT + " pr-8"}
                  />
                  <button
                    type="button" onClick={() => setShowPw((v) => !v)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-[#00882a] hover:text-[#00ff41] transition-colors"
                  >
                    {showPw ? <EyeOff size={13} /> : <Eye size={13} />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit" disabled={loading}
              className="btn-primary w-full py-2.5 bg-[#00ff41] text-black text-xs font-mono font-bold tracking-widest disabled:opacity-70"
            >
              {loading
                ? <span className="flex items-center justify-center gap-2">&gt; AUTHENTICATING <Cursor /></span>
                : <span>&gt; AUTHENTICATE</span>}
            </button>

            <div className="flex flex-col items-center gap-2 pt-1">
              <button type="button" onClick={handleNavigateToRegister}
                className="flex items-center gap-1.5 text-[9px] text-[#00882a] hover:text-[#00ff41] transition-colors font-mono">
                <UserPlus size={10} />
                REGISTER_NEW_ACCOUNT
              </button>
            </div>
          </form>
        </div>
      </div>
    </AuthShell>
  );
}

