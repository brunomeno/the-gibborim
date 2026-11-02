import Logo from '../components/ui/Logo'
import { useAuth } from '../context/AuthContext'

// Placeholder — the real dashboard (Captain Joab's daily workout) comes next.
export default function DashboardPage() {
  const { user, signOut } = useAuth()
  const name = user?.user_metadata?.full_name?.split(' ')[0] || 'warrior'

  return (
    <div className="mx-auto min-h-dvh max-w-3xl px-5 py-6">
      <header className="flex items-center justify-between">
        <Logo className="size-9" />
        <button
          onClick={signOut}
          className="rounded-full border border-white/10 px-4 py-1.5 text-sm text-zinc-400 transition hover:border-gold-500/40 hover:text-gold-200"
        >
          Sign out
        </button>
      </header>
      <h1 className="mt-10 font-display text-3xl font-bold text-white">
        At ease, <span className="text-gold-gradient">{name}</span>.
      </h1>
      <p className="mt-2 text-zinc-500">Your daily orders from Captain Joab will appear here.</p>
    </div>
  )
}
