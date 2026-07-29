/* eslint-disable react/jsx-no-comment-textnodes */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthShell from '../../features/AuthShell.tsx';
import Cursor from '../../features/Cursor.tsx';
import { CheckCircle, LogIn } from 'lucide-react';
import Client from '../../services/clients.ts';

const AUTH_INPUT = "w-full bg-[rgba(0,255,65,0.03)] border border-[#00ff41]/20 text-[#00ff41] text-xs font-mono px-3 py-2 outline-none placeholder-[#00882a]/50 focus:border-[#00ff41]/55 focus:shadow-[0_0_0_1px_rgba(0,255,65,0.14)] transition-all";

export default function ResetPw() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!email.trim()) {
      setError('EMAIL IS REQUIRED');
      return;
    }

    setLoading(true);

    try {
      const { error: authError } = await Client.resetPassword(email);

      if (authError) {
        setError(authError.message);
      } else {
        setMessage('RESET LINK SENT TO EMAIL.');
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
    <AuthShell onHome={handleNavigateToHome} subtitle="// PASSWORD RECOVERY PROTOCOL">
      <div className="w-full max-w-xs border border-[#00ff41]/22 overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2 bg-[#0a150a] border-b border-[#00ff41]/15">
          <div className="flex gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500/50" />
            <span className="w-2 h-2 rounded-full bg-yellow-500/50" />
            <span className="w-2 h-2 rounded-full bg-[#00ff41]/50" />
          </div>
          <span className="flex-1 text-center text-[9px] text-[#00882a] tracking-[0.2em]">
            auth.sh &mdash; reset
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
          <form onSubmit={handleReset} className="space-y-5">
            <div className="text-[10px] text-[#00882a] space-y-0.5 mb-4 select-none">
              <div>&gt; INITIATE RECOVERY SEQUENCE</div>
              <div className="flex items-center gap-1">&gt; AWAITING TARGET EMAIL <Cursor /></div>
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

            <button
              type="submit" disabled={loading}
              className="btn-primary w-full py-2.5 bg-[#00ff41] text-black text-xs font-mono font-bold tracking-widest disabled:opacity-70"
            >
              {loading
                ? <span className="flex items-center justify-center gap-2">&gt; TRANSMITTING <Cursor /></span>
                : <span>&gt; SEND_RESET_LINK</span>}
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