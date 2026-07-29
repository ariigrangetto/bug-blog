/* eslint-disable react/jsx-no-comment-textnodes */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Eye, EyeOff } from 'lucide-react';
import Cursor from '../../features/Cursor.tsx';
import AuthShell from '../../features/AuthShell.tsx';
import Client from '../../services/clients.ts';

const AUTH_INPUT = "w-full bg-[rgba(0,255,65,0.03)] border border-[#00ff41]/20 text-[#00ff41] text-xs font-mono px-3 py-2 outline-none placeholder-[#00882a]/50 focus:border-[#00ff41]/55 focus:shadow-[0_0_0_1px_rgba(0,255,65,0.14)] transition-all"

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [pwMatch, setPwMatch] = useState(true);
  const [agreed, setAgreed] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccess(false);

    if (!email.trim() || !password || !confirmPassword) {
      setError('ALL FIELDS ARE REQUIRED.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('INVALID EMAIL ADDRESS');
      return;
    }

    if (password.length < 6) {
      setError('PASSWORD MUST BE AT LEAST 6 CHARACTERS.');
      return;
    }

    if (password !== confirmPassword) {
      setPwMatch(false);
      return;
    }

    setLoading(true);

    try {
      const { error: signUpError } = await Client.createClient(email, password);

      if (signUpError) {
        let friendlyMessage = signUpError.message;
        if (signUpError.message.toLowerCase().includes('user already registered')) {
          friendlyMessage = 'This email address is already registered.';
        } else if (signUpError.message.toLowerCase().includes('rate limit')) {
          friendlyMessage = 'Too many registration requests. Please try again later.';
        }
        setError(friendlyMessage);
      } else {
        setSuccess(true);
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      }
    } catch (err: unknown) {
      setError('AN UNEXPECTED ERROR OCCURRED. PLEASE TRY AGAIN.');
    } finally {
      setLoading(false);
    }
  };


  function handleNavigateToLogin() {
    navigate("/login")
  };

  function handleNavigateToHome() {
    navigate("/home");
  }

  return (
    <AuthShell onHome={handleNavigateToHome} subtitle="//NEW OPERATOR REGISTRATION">
      <div className="w-full max-w-sm border border-[#00ff41]/22 overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2 bg-[#0a150a] border-b border-[#00ff41]/15">
          <div className="flex gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500/50" />
            <span className="w-2 h-2 rounded-full bg-yellow-500/50" />
            <span className="w-2 h-2 rounded-full bg-[#00ff41]/50" />
          </div>
          <span className="flex-1 text-center text-[9px] text-[#00882a] tracking-[0.2em]">
            auth.sh &mdash; register
          </span>
        </div>
        <div className="p-6">
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
          {success ? (
            <div className="py-10 text-center">
              <CheckCircle size={40} className="text-[#00ff41] glow mx-auto mb-4" />
              <div className="font-['VT323'] text-lg text-[#00ff41] glow mb-3" style={{ animation: "flicker 2s ease-in-out infinite" }}>
                ACCOUNT CREATED. CHECK YOUR EMAIL TO CONFIRM YOUR ACCOUNT BEFORE SIGNING IN.
              </div>
              <div className="text-[10px] text-[#00882a] space-y-1">
                <div>&gt; Writing credentials to vault... <span className="text-[#00ff41]">OK</span></div>
                <div>&gt; Generating access token... <span className="text-[#00ff41]">OK</span></div>
                <div>&gt; Redirecting to login <Cursor /></div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="text-[10px] text-[#00882a] space-y-0.5 mb-4 select-none">
                <div>&gt; INITIALIZE OPERATOR ACCOUNT</div>
                <div className="flex items-center gap-1">&gt; ENTER CREDENTIALS <Cursor /></div>
              </div>
              <div>
                <label className="block text-[9px] text-[#00882a] tracking-[0.2em] mb-1.5">
                  // EMAIL_ADDR &nbsp;<span className="text-red-400">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-[#00882a] text-sm select-none shrink-0">$</span>
                  <input type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com" className={AUTH_INPUT} />
                </div>
              </div>
              <div>
                <label className="block text-[9px] text-[#00882a] tracking-[0.2em] mb-1.5">
                  // PASSWORD &nbsp;<span className="text-red-400">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-[#00882a] text-sm select-none shrink-0">$</span>
                  <div className="relative flex-1">
                    <input
                      type={showPw ? "text" : "password"} required value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="min. 8 characters"
                      className={AUTH_INPUT + " pr-8"}
                    />
                    <button type="button" onClick={() => setShowPw((v) => !v)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-[#00882a] hover:text-[#00ff41] transition-colors">
                      {showPw ? <EyeOff size={13} /> : <Eye size={13} />}
                    </button>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-[9px] text-[#00882a] tracking-[0.2em] mb-1.5">
                  // CONFIRM_PWD &nbsp;<span className="text-red-400">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-[#00882a] text-sm select-none shrink-0">$</span>
                  <input type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="repeat password"
                    className={AUTH_INPUT + (!pwMatch ? " border-red-500/50" : "")} />
                </div>
                {!pwMatch && (
                  <div className="text-[9px] text-red-400 mt-1 ml-5">&gt; ERROR: PASSWORDS DO NOT MATCH</div>
                )}
              </div>

              <button type="button" onClick={() => setAgreed((v) => !v)} className="flex items-center gap-2 group text-left w-full">
                <span className="w-4 h-4 border border-[#00ff41]/30 flex items-center justify-center group-hover:border-[#00ff41]/60 transition-colors shrink-0 text-[#00ff41]">
                  {agreed && <span className="text-[8px] leading-none font-bold">✓</span>}
                </span>
                <span className="text-[9px] text-[#00882a] group-hover:text-[#00ff41] transition-colors leading-relaxed ">
                  I ACCEPT THE SYSTEM PROTOCOLS AND ACCESS AGREEMENTS
                </span>
              </button>

              <button type="submit" disabled={loading}
                className="btn-primary w-full py-2.5 bg-[#00ff41] text-black text-xs font-mono font-bold tracking-widest disabled:opacity-45 mt-2">
                {loading
                  ? <span className="flex items-center justify-center gap-2">&gt; CREATING ACCOUNT <Cursor /></span>
                  : <span>&gt; CREATE_ACCOUNT</span>}
              </button>

              <div className="text-center pt-1">
                <button type="button" onClick={handleNavigateToLogin}
                  className="text-[9px] text-[#00882a] hover:text-[#00ff41] transition-colors font-mono">
                  &gt;&gt; RETURN_TO_LOGIN
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </AuthShell>
  );
}

