/* eslint-disable react/jsx-no-comment-textnodes */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthShell from '../../features/AuthShell.tsx';
import Cursor from '../../features/Cursor.tsx';
import { CheckCircle, Eye, EyeOff, LogIn } from 'lucide-react';
import Client from '../../services/clients.ts';

const AUTH_INPUT = "w-full bg-[rgba(0,255,65,0.03)] border border-[#00ff41]/20 text-[#00ff41] text-xs font-mono px-3 py-2 outline-none placeholder-[#00882a]/50 focus:border-[#00ff41]/55 focus:shadow-[0_0_0_1px_rgba(0,255,65,0.14)] transition-all";

export default function Update() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [showPw, setShowPw] = useState(false);

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!password.trim()) {
      setError('PROVIDE A NEW PASSWORD');
      return;
    }

    if (password.length < 6) {
      setError('PASSWORD MUST BE AT LEAST 6 CHARACTERS.');
      return;
    }

    setLoading(true);

    try {
      const { error: authError } = await Client.update(password);

      if (authError) {
        let friendly = authError.message;
        if (authError.message.toLowerCase().includes('same password')) {
          friendly = 'New password must be different from current password.';
        } else if (authError.message.toLowerCase().includes('session') || authError.message.toLowerCase().includes('auth')) {
          friendly = 'Session expired or invalid. Please request a new reset link.';
        }
        setError(friendly);
      } else {
        setMessage('CREDENTIALS UPDATED SUCCESSFULLY.');
        setTimeout(() => navigate('/home'), 2000);
      }
    } catch (err: unknown) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  function handleNavigateToHome() {
    navigate("/home");
  }

  function handleNavigateToLogin() {
    navigate("/login");
  }

  return (
    <AuthShell onHome={handleNavigateToHome} subtitle="// SYSTEM CREDENTIALS UPDATE">
      <div className="w-full max-w-xs border border-[#00ff41]/22 overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2 bg-[#0a150a] border-b border-[#00ff41]/15">
          <div className="flex gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500/50" />
            <span className="w-2 h-2 rounded-full bg-yellow-500/50" />
            <span className="w-2 h-2 rounded-full bg-[#00ff41]/50" />
          </div>
          <span className="flex-1 text-center text-[9px] text-[#00882a] tracking-[0.2em]">
            auth.sh &mdash; update
          </span>
        </div>
        {
          error && (
            <div className="py-4 text-center">
              <CheckCircle size={30} className="text-[#ff0000a1] glow mx-auto mb-2" />
              <div className="font-['VT323'] text-lg text-[#ff0000a1] glow" style={{ animation: "flicker 2s ease-in-out infinite" }}>
                {error}
              </div>
            </div>
          )
        }
        {
          message && (
            <div className="py-4 text-center">
              <CheckCircle size={30} className="text-[#00ff41] glow mx-auto mb-2" />
              <div className="font-['VT323'] text-lg text-[#00ff41] glow">
                {message}
              </div>
            </div>
          )
        }

        <div className="p-6">
          <form onSubmit={handleUpdate} className="space-y-5">
            <div className="text-[10px] text-[#00882a] space-y-0.5 mb-4 select-none">
              <div>&gt; MODIFYING USER DIRECTORY</div>
              <div className="flex items-center gap-1">&gt; AWAITING NEW DATA <Cursor /></div>
            </div>

            <div>
              <label className="block text-[9px] text-[#00882a] tracking-[0.2em] mb-1.5">// NEW PASSWORD</label>
              <div className="flex items-center gap-2">
                <span className="text-[#00882a] text-sm select-none shrink-0">$</span>
                <div className="relative flex-1">
                  <input
                    type={showPw ? "text" : "password"} value={password}
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
                ? <span className="flex items-center justify-center gap-2">&gt; UPDATING <Cursor /></span>
                : <span>&gt; UPDATE_CREDENTIALS</span>}
            </button>

            <div className="flex flex-col items-center gap-2 pt-1">
              <button type="button" onClick={handleNavigateToLogin}
                className="flex items-center gap-1.5 text-[9px] text-[#00882a] hover:text-[#00ff41] transition-colors font-mono">
                <LogIn size={10} />
                RETURN_TO_LOGIN
              </button>
            </div>
          </form>
        </div>
      </div>
    </AuthShell>
  );
}