import Logo from './Logo'

export default function FullScreenLoader() {
  return (
    <div className="grid min-h-dvh place-items-center bg-ink-950">
      <Logo className="size-14 animate-pulse" />
    </div>
  )
}
