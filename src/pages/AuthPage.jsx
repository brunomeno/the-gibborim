import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function AuthPage() {
  const [tab, setTab] = useState('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const handleSignIn = async () => {
    if (!email || !password) { setError('Fill in all fields.'); return }
    setLoading(true); setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    setLoading(false)
  }

  const handleSignUp = async () => {
    if (!email || !password || !name) { setError('Fill in all fields.'); return }
    setLoading(true); setError('')
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: name } }
    })
    if (error) setError(error.message)
    else setMessage('Check your email to confirm your account.')
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#080810', color: '#fff' }}>
      {/* Left hero */}
      <div className="hidden lg:flex flex-1 flex-col justify-center px-16" style={{ background: '#0a0814' }}>
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-black font-bold" style={{ background: '#d4a017' }}>⚔</div>
          <div>
            <p className="font-bold tracking-widest text-sm uppercase">The Gibborim</p>
            <p className="text-xs" style={{ color: '#d4a017' }}>by MENO</p>
          </div>
        </div>
        <div className="mb-6">
          <span className="text-xs tracking-widest uppercase px-3 py-1 rounded-full" style={{ background: '#1a1428', color: '#d4a017', border: '1px solid #2a2040' }}>
            • Faith · Fitness · Fellowship
          </span>
        </div>
        <h1 className="text-5xl font-black leading-tight mb-6">
          Rise up,<br />
          <span style={{ color: '#d4a017' }}>Mighty Warrior.</span>
        </h1>
        <p className="text-gray-400 text-lg leading-relaxed mb-10 max-w-md">
          Join a global brotherhood and sisterhood training body and spirit together.
        </p>
        <div className="rounded-2xl p-5" style={{ background: '#0f0d1a', border: '1px solid #252040' }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-black text-sm flex-shrink-0" style={{ background: '#d4a017' }}>J</div>
            <div>
              <p className="font-semibold text-sm">Captain Joab</p>
              <p className="text-xs" style={{ color: '#d4a017' }}>AI Coach — Joshua 1:9</p>
            </div>
          </div>
          <p className="text-gray-300 text-sm italic leading-relaxed">
            "Soldier, the battle is won in the small mornings. Lace up, report in, and give me your best effort today. <span style={{ color: '#d4a017' }}>Be strong and courageous</span> — the Lord your God goes with you."
          </p>
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-black font-bold text-sm" style={{ background: '#d4a017' }}>⚔</div>
            <span className="font-bold tracking-widest text-sm uppercase">The Gibborim</span>
          </div>

          <h2 className="text-2xl font-bold mb-1">Report for Duty</h2>
          <p className="text-gray-500 text-sm mb-8">
            {tab === 'signin' ? 'Welcome back, warrior. Sign in to continue.' : 'New recruit? Create your account.'}
          </p>

          {/* Tabs */}
          <div className="flex rounded-xl p-1 mb-6" style={{ background: '#13131e' }}>
            {['signin', 'signup'].map(t => (
              <button
                key={t}
                onClick={() => { setTab(t); setError(''); setMessage('') }}
                className="flex-1 py-2 rounded-lg text-sm font-semibold transition"
                style={tab === t
                  ? { background: '#1e1a2e', color: '#fff' }
                  : { color: '#6b7280' }
                }
              >
                {t === 'signin' ? 'Sign in' : 'Sign up'}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {tab === 'signup' && (
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-widest mb-1.5 block">Full Name</label>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Your warrior name"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none transition"
                  style={{ background: '#13131e', border: '1px solid #1e1e2e', color: '#fff' }}
                  onFocus={e => e.target.style.borderColor = '#d4a017'}
                  onBlur={e => e.target.style.borderColor = '#1e1e2e'}
                />
              </div>
            )}
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-widest mb-1.5 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition"
                style={{ background: '#13131e', border: '1px solid #1e1e2e', color: '#fff' }}
                onFocus={e => e.target.style.borderColor = '#d4a017'}
                onBlur={e => e.target.style.borderColor = '#1e1e2e'}
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-widest mb-1.5 block">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="········"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition"
                style={{ background: '#13131e', border: '1px solid #1e1e2e', color: '#fff' }}
                onFocus={e => e.target.style.borderColor = '#d4a017'}
                onBlur={e => e.target.style.borderColor = '#1e1e2e'}
              />
            </div>

            {error && <p className="text-red-400 text-xs">{error}</p>}
            {message && <p className="text-green-400 text-xs">{message}</p>}

            <button
              onClick={tab === 'signin' ? handleSignIn : handleSignUp}
              disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-sm transition hover:opacity-90 disabled:opacity-50"
              style={{ background: '#d4a017', color: '#000' }}
            >
              {loading ? '...' : tab === 'signin' ? 'Sign In' : 'Create Account'}
            </button>
          </div>

          <p className="text-center text-gray-600 text-xs mt-6">
            {tab === 'signin' ? "New to the Gibborim? " : "Already have an account? "}
            <button onClick={() => setTab(tab === 'signin' ? 'signup' : 'signin')} style={{ color: '#d4a017' }} className="font-semibold">
              {tab === 'signin' ? 'Create an account' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}