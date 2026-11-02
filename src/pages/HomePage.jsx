import { useState, useEffect, useRef, useCallback } from 'react'
import { supabase } from '../lib/supabase'

// ─── Step Counter Hook ────────────────────────────────────────────────────────
function useStepCounter() {
  const [steps, setSteps] = useState(0)
  const [tracking, setTracking] = useState(false)
  const dataRef = useRef({ lastMag: 0, lastTime: 0 })

  const handleMotion = useCallback((e) => {
    const acc = e.accelerationIncludingGravity || e.acceleration
    if (!acc) return
    const mag = Math.sqrt((acc.x || 0) ** 2 + (acc.y || 0) ** 2 + (acc.z || 0) ** 2)
    const now = Date.now()
    if (mag > 11 && dataRef.current.lastMag <= 11 && now - dataRef.current.lastTime > 320) {
      setSteps(s => s + 1)
      dataRef.current.lastTime = now
    }
    dataRef.current.lastMag = mag
  }, [])

  const start = async () => {
    if (typeof DeviceMotionEvent !== 'undefined' &&
        typeof DeviceMotionEvent.requestPermission === 'function') {
      const perm = await DeviceMotionEvent.requestPermission().catch(() => 'denied')
      if (perm !== 'granted') return
    }
    window.addEventListener('devicemotion', handleMotion)
    setTracking(true)
  }

  const stop = () => {
    window.removeEventListener('devicemotion', handleMotion)
    setTracking(false)
  }

  useEffect(() => () => window.removeEventListener('devicemotion', handleMotion), [handleMotion])

  return { steps, tracking, start, stop, reset: () => setSteps(0) }
}

// ─── Workout Data ─────────────────────────────────────────────────────────────
const WORKOUTS = {
  0: {
    title: 'Sabbath Rest & Recovery',
    joab_message: "Warrior, even the mightiest armies need rest. Today is for recovery and renewing your strength. Walk, stretch, and fill your spirit.",
    verse: "Come to me, all you who are weary and burdened, and I will give you rest.",
    verse_ref: "Matthew 11:28",
    exercises: [
      { name: "Morning walk", sets: "1", reps: "20 mins", note: "Light pace, breathe deep" },
      { name: "Full body stretch", sets: "1", reps: "15 mins", note: "Hold each stretch 30s" },
      { name: "Devotional reading", sets: "1", reps: "15 mins", note: "Scripture and reflection" }
    ],
    equipped_exercises: [
      { name: "Morning walk", sets: "1", reps: "20 mins", note: "Light pace, breathe deep" },
      { name: "Full body stretch", sets: "1", reps: "15 mins", note: "Hold each stretch 30s" },
      { name: "Light band mobility", sets: "1", reps: "15 mins", note: "Shoulder circles, hip openers" }
    ]
  },
  1: {
    title: 'Operation: Iron Chest',
    joab_message: "Soldier, the week begins with fire. Push through every rep as if your mission depends on it — because it does. No retreating.",
    verse: "I can do all things through Christ who strengthens me.",
    verse_ref: "Philippians 4:13",
    exercises: [
      { name: "Push-ups", sets: "4", reps: "20", note: "Chest to floor, lock out at top" },
      { name: "Pike push-ups", sets: "3", reps: "12", note: "Shoulders and upper chest" },
      { name: "Tricep dips (chair)", sets: "3", reps: "15", note: "Full range of motion" },
      { name: "Diamond push-ups", sets: "3", reps: "10", note: "Hands form a diamond" },
      { name: "Plank hold", sets: "3", reps: "45 sec", note: "Body straight as a sword" }
    ],
    equipped_exercises: [
      { name: "Dumbbell bench press", sets: "4", reps: "12", note: "Slow down, explode up" },
      { name: "Dumbbell flyes", sets: "3", reps: "12", note: "Slight bend in elbows" },
      { name: "Overhead press", sets: "3", reps: "10", note: "Core tight, don't arch back" },
      { name: "Tricep kickbacks", sets: "3", reps: "12", note: "Upper arm stays still" },
      { name: "Push-ups (burnout)", sets: "2", reps: "Max", note: "Leave nothing in the tank" }
    ]
  },
  2: {
    title: 'Operation: Iron Back',
    joab_message: "Warriors stand tall. Today we build the strength that holds you upright under any weight. Pull hard and dominate.",
    verse: "The Lord is my strength and my shield.",
    verse_ref: "Psalm 28:7",
    exercises: [
      { name: "Pull-ups / Inverted rows", sets: "4", reps: "8-12", note: "If no bar, use a table edge" },
      { name: "Superman holds", sets: "3", reps: "15", note: "Squeeze at the top" },
      { name: "Doorframe rows", sets: "3", reps: "12", note: "Lean back 45 degrees, pull in" },
      { name: "Dead hangs", sets: "3", reps: "30 sec", note: "Decompress your spine" }
    ],
    equipped_exercises: [
      { name: "Dumbbell rows (each arm)", sets: "4", reps: "12", note: "Elbow drives straight back" },
      { name: "Dumbbell deadlifts", sets: "3", reps: "12", note: "Hinge at hips, back flat" },
      { name: "Rear delt flyes", sets: "3", reps: "15", note: "Lead with elbows" },
      { name: "Shrugs", sets: "3", reps: "15", note: "Hold 2 seconds at top" },
      { name: "Superman holds", sets: "3", reps: "15", note: "Squeeze and hold" }
    ]
  },
  3: {
    title: 'Operation: Iron Legs',
    joab_message: "The legs carry you into battle. Build them strong today so they never fail you when it matters most. March!",
    verse: "How beautiful on the mountains are the feet of those who bring good news.",
    verse_ref: "Isaiah 52:7",
    exercises: [
      { name: "Squats", sets: "4", reps: "25", note: "Below parallel, chest up" },
      { name: "Jump squats", sets: "3", reps: "15", note: "Explode from the bottom" },
      { name: "Lunges (each leg)", sets: "3", reps: "15", note: "Big step forward" },
      { name: "Wall sit", sets: "3", reps: "60 sec", note: "Thighs parallel to ground" },
      { name: "Calf raises", sets: "4", reps: "30", note: "Full extension at the top" }
    ],
    equipped_exercises: [
      { name: "Goblet squats", sets: "4", reps: "15", note: "Dumbbell at chest, elbows in" },
      { name: "Dumbbell lunges", sets: "3", reps: "12 each", note: "Step long, knee tracks toe" },
      { name: "Romanian deadlifts", sets: "3", reps: "12", note: "Feel the hamstring stretch" },
      { name: "Sumo squats", sets: "3", reps: "15", note: "Wide stance, weight in heels" },
      { name: "Weighted calf raises", sets: "4", reps: "20", note: "Full extension every rep" }
    ]
  },
  4: {
    title: 'Operation: Iron Core',
    joab_message: "Every warrior's power comes from the core. Today we forge steel in your midsection. Tighten up, soldier.",
    verse: "Be strong and courageous. Do not be afraid; do not be discouraged.",
    verse_ref: "Joshua 1:9",
    exercises: [
      { name: "Crunches", sets: "4", reps: "25", note: "Slow and controlled" },
      { name: "Leg raises", sets: "3", reps: "20", note: "Keep lower back flat" },
      { name: "Russian twists", sets: "3", reps: "30", note: "Feet off ground if possible" },
      { name: "Mountain climbers", sets: "3", reps: "40", note: "Drive knees to chest fast" },
      { name: "Plank", sets: "3", reps: "60 sec", note: "Don't let your hips sag" }
    ],
    equipped_exercises: [
      { name: "Weighted crunches", sets: "4", reps: "20", note: "Hold dumbbell at chest" },
      { name: "Russian twists (weighted)", sets: "3", reps: "25", note: "Rotate fully each side" },
      { name: "Dumbbell side bends", sets: "3", reps: "15 each", note: "Slow, feel the stretch" },
      { name: "Plank with row", sets: "3", reps: "10 each", note: "Stay level, core locked" },
      { name: "Leg raises", sets: "3", reps: "20", note: "Lower back pressed flat" }
    ]
  },
  5: {
    title: 'Operation: Full Assault',
    joab_message: "End the week with everything you have left, soldier. Full body, max effort. Leave nothing on the field.",
    verse: "The righteous keep moving forward.",
    verse_ref: "Job 17:9",
    exercises: [
      { name: "Burpees", sets: "4", reps: "10", note: "Full range, chest hits floor" },
      { name: "Push-ups", sets: "3", reps: "15", note: "No rest between sets" },
      { name: "Jump squats", sets: "3", reps: "15", note: "Land soft, go fast" },
      { name: "High knees", sets: "3", reps: "30 sec", note: "Pump your arms" },
      { name: "V-ups", sets: "3", reps: "15", note: "Core tight throughout" }
    ],
    equipped_exercises: [
      { name: "Dumbbell thrusters", sets: "4", reps: "10", note: "Squat straight into press" },
      { name: "Renegade rows", sets: "3", reps: "8 each", note: "Plank position, row up" },
      { name: "Dumbbell swings", sets: "3", reps: "15", note: "Hips drive the movement" },
      { name: "Burpees", sets: "3", reps: "10", note: "Full range, no shortcuts" },
      { name: "Farmer carry", sets: "3", reps: "30 sec", note: "Heavy, walk the floor" }
    ]
  },
  6: {
    title: 'Stand Together',
    joab_message: "Warriors don't march alone. Today is for the community. Move your body, encourage a brother or sister, and let your light shine.",
    verse: "As iron sharpens iron, so one person sharpens another.",
    verse_ref: "Proverbs 27:17",
    exercises: [
      { name: "Morning walk or run", sets: "1", reps: "30 mins", note: "Invite someone along" },
      { name: "Mobility routine", sets: "1", reps: "15 mins", note: "Hip flexors and shoulders" },
      { name: "Post in the community", sets: "1", reps: "1 post", note: "Encourage the squad" }
    ],
    equipped_exercises: [
      { name: "Morning walk or run", sets: "1", reps: "30 mins", note: "Invite someone along" },
      { name: "Light dumbbell mobility", sets: "1", reps: "15 mins", note: "Shoulder circles, light rows" },
      { name: "Post in the community", sets: "1", reps: "1 post", note: "Encourage the squad" }
    ]
  }
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  return 'evening'
}

function formatTime(ts) {
  const diff = Math.floor((Date.now() - new Date(ts)) / 1000)
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return new Date(ts).toLocaleDateString()
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function HomePage({ session }) {
  const [profile, setProfile] = useState(null)
  const [logged, setLogged] = useState(false)
  const [logging, setLogging] = useState(false)
  const [activeTab, setActiveTab] = useState('home')
  const { steps, tracking, start, stop, reset } = useStepCounter()

  const today = new Date()
  const workout = WORKOUTS[today.getDay()]
  const dateStr = today.toISOString().split('T')[0]
  const equipped = profile?.equipment_level === 'equipped'
  const exercises = equipped ? workout.equipped_exercises : workout.exercises

  useEffect(() => {
    async function load() {
      const { data: prof } = await supabase
        .from('profiles').select('*').eq('id', session.user.id).single()
      setProfile(prof)
      const { data: log } = await supabase
        .from('workout_logs').select('id')
        .eq('user_id', session.user.id).eq('workout_date', dateStr).single()
      if (log) setLogged(true)
    }
    load()
  }, [session])

  const logWorkout = async () => {
    setLogging(true)
    await supabase.from('workout_logs').upsert({
      user_id: session.user.id,
      workout_date: dateStr,
      steps_count: steps
    })
    const newStreak = (profile?.streak || 0) + 1
    await supabase.from('profiles')
      .update({ streak: newStreak, last_active: dateStr })
      .eq('id', session.user.id)
    setProfile(p => ({ ...p, streak: newStreak }))
    setLogged(true)
    setLogging(false)
  }

  const toggleEquipment = async () => {
    const next = equipped ? 'bodyweight' : 'equipped'
    await supabase.from('profiles').update({ equipment_level: next }).eq('id', session.user.id)
    setProfile(p => ({ ...p, equipment_level: next }))
  }

  const signOut = () => supabase.auth.signOut()
  const name = profile?.full_name || session.user.email?.split('@')[0] || 'Warrior'

  return (
    <div className="min-h-screen text-white flex flex-col" style={{ background: '#080810' }}>
      <header className="px-4 py-3 flex items-center justify-between"
        style={{ background: '#0a0a14', borderBottom: '1px solid #1a1a28' }}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 flex items-center justify-center text-black font-bold text-xs rounded-md"
            style={{ background: '#d4a017' }}>G</div>
          <span className="font-bold text-sm tracking-widest uppercase">The Gibborim</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold" style={{ color: '#d4a017' }}>🔥 {profile?.streak || 0}</span>
          <button onClick={signOut} className="text-xs text-gray-500">Out</button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-20">
        {activeTab === 'home' && (
          <div className="max-w-lg mx-auto px-4 py-6 space-y-5">
            <div>
              <p className="text-gray-500 text-sm">Good {getGreeting()}, warrior.</p>
              <h1 className="text-xl font-bold">{name}</h1>
            </div>

            {/* Step Counter */}
            <div className="rounded-2xl p-4" style={{ background: '#0d0b1a', border: '1px solid #252040' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-widest mb-0.5">Steps Today</p>
                  <p className="text-3xl font-bold" style={{ color: '#d4a017' }}>
                    {steps.toLocaleString()}
                  </p>
                  {tracking && (
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block"></span>
                      <p className="text-xs text-green-400">Tracking live</p>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2 items-end">
                  {!tracking ? (
                    <button onClick={start}
                      className="px-4 py-2 text-xs font-bold rounded-xl text-black"
                      style={{ background: '#d4a017' }}>
                      Start
                    </button>
                  ) : (
                    <button onClick={stop}
                      className="px-4 py-2 text-xs font-bold rounded-xl"
                      style={{ background: '#1a0a0a', color: '#f87171', border: '1px solid #3b0a0a' }}>
                      Stop
                    </button>
                  )}
                  {steps > 0 && (
                    <button onClick={reset} className="text-xs text-gray-600">reset</button>
                  )}
                </div>
              </div>
              {!tracking && steps === 0 && (
                <p className="text-xs text-gray-700 mt-2">
                  Carry your phone and tap Start to count your steps
                </p>
              )}
            </div>

            {/* Captain Joab */}
            <div className="rounded-2xl p-5" style={{ background: '#0d0b1a', border: '1px solid #252040' }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-black flex-shrink-0"
                  style={{ background: '#d4a017' }}>J</div>
                <div>
                  <p className="font-semibold text-sm">Captain Joab</p>
                  <p className="text-xs" style={{ color: '#d4a017' }}>Daily Orders</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm italic leading-relaxed mb-3">"{workout.joab_message}"</p>
              <p className="text-xs" style={{ color: '#d4a017' }}>
                "{workout.verse}" <span className="font-bold not-italic">— {workout.verse_ref}</span>
              </p>
            </div>

            {/* Workout */}
            <div className="rounded-2xl p-5" style={{ background: '#0c0c16', border: '1px solid #1a1a28' }}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-widest mb-0.5">Today's Mission</p>
                  <h2 className="font-bold">{workout.title}</h2>
                </div>
                {logged && (
                  <span className="text-xs font-bold text-green-400 px-3 py-1 rounded-full"
                    style={{ background: '#052e16' }}>Done</span>
                )}
              </div>

              <div className="mb-4">
                <span className="text-xs px-3 py-1 rounded-full font-semibold"
                  style={{
                    background: equipped ? '#1a1505' : '#0d1a0d',
                    color: equipped ? '#d4a017' : '#4ade80',
                    border: `1px solid ${equipped ? '#3a2a00' : '#166534'}`
                  }}>
                  {equipped ? 'Armed Warrior' : 'Bodyweight Warrior'}
                </span>
              </div>

              <div className="space-y-2 mb-5">
                {exercises.map((ex, i) => (
                  <div key={i} className="flex items-start justify-between gap-3 p-3 rounded-xl"
                    style={{ background: '#13131e' }}>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{ex.name}</p>
                      {ex.note && <p className="text-xs text-gray-500 mt-0.5">{ex.note}</p>}
                    </div>
                    <span className="text-xs font-bold flex-shrink-0" style={{ color: '#d4a017' }}>
                      {ex.sets} x {ex.reps}
                    </span>
                  </div>
                ))}
              </div>

              {!logged ? (
                <button onClick={logWorkout} disabled={logging}
                  className="w-full py-3 font-bold text-sm rounded-xl transition hover:opacity-90 disabled:opacity-50"
                  style={{ background: '#d4a017', color: '#000' }}>
                  {logging ? 'Logging...' : 'Mission Complete — Log Workout'}
                </button>
              ) : (
                <div className="w-full py-3 text-center rounded-xl"
                  style={{ background: '#052e16', border: '1px solid #166534' }}>
                  <span className="text-green-400 font-semibold text-sm">Well done, soldier. Rest now.</span>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl p-4" style={{ background: '#0d0b1a', border: '1px solid #252040' }}>
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Rank</p>
                <p className="font-bold">{profile?.rank || 'Recruit'}</p>
              </div>
              <div className="rounded-2xl p-4" style={{ background: '#0d0b1a', border: '1px solid #252040' }}>
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Streak</p>
                <p className="font-bold" style={{ color: '#d4a017' }}>{profile?.streak || 0} days 🔥</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'community' && (
          <div className="max-w-lg mx-auto px-4 py-6">
            <h2 className="font-bold text-lg mb-4">Stand Together</h2>
            <CommunityTab session={session} profile={profile} />
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
            <h2 className="font-bold text-lg">Profile</h2>
            <div className="rounded-2xl p-5 space-y-4"
              style={{ background: '#0c0c16', border: '1px solid #1a1a28' }}>
              {[
                { label: 'Name', value: name },
                { label: 'Email', value: session.user.email },
                { label: 'Rank', value: profile?.rank || 'Recruit', gold: true },
              ].map(({ label, value, gold }) => (
                <div key={label}>
                  <p className="text-xs text-gray-500 mb-0.5">{label}</p>
                  <p className="font-medium text-sm" style={gold ? { color: '#d4a017' } : {}}>{value}</p>
                </div>
              ))}
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Streak</p>
                <p className="font-bold text-2xl" style={{ color: '#d4a017' }}>{profile?.streak || 0} 🔥</p>
              </div>

              {/* Workout Mode Toggle */}
              <div>
                <p className="text-xs text-gray-500 mb-1">Workout Mode</p>
                <p className="text-xs text-gray-600 mb-3">
                  Choose based on equipment you have at home
                </p>
                <button onClick={toggleEquipment}
                  className="w-full py-3 rounded-xl text-sm font-bold"
                  style={{
                    background: equipped ? '#1a1505' : '#0d1a0d',
                    border: `1px solid ${equipped ? '#3a2a00' : '#166534'}`,
                    color: equipped ? '#d4a017' : '#4ade80'
                  }}>
                  {equipped ? 'Armed Warrior (Has Dumbbells)' : 'Warrior (Bodyweight Only)'}
                  <span className="block text-xs font-normal mt-0.5 opacity-60">
                    Tap to switch to {equipped ? 'bodyweight' : 'equipment'} mode
                  </span>
                </button>
              </div>
            </div>

            <button onClick={signOut}
              className="w-full py-3 text-red-400 font-semibold text-sm rounded-xl"
              style={{ background: '#1a0a0a', border: '1px solid #3b0a0a' }}>
              Sign Out
            </button>
          </div>
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 flex"
        style={{ background: '#0a0a14', borderTop: '1px solid #1a1a28' }}>
        {[
          { id: 'home', label: 'Orders', icon: 'X' },
          { id: 'community', label: 'Squad', icon: 'S' },
          { id: 'profile', label: 'Profile', icon: 'P' }
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className="flex-1 py-3 flex flex-col items-center gap-1 transition"
            style={{ color: activeTab === tab.id ? '#d4a017' : '#374151' }}>
            <span className="text-xs font-bold">{tab.icon}</span>
            <span className="text-xs font-medium">{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}

// ─── Community Tab ────────────────────────────────────────────────────────────
function CommunityTab({ session, profile }) {
  const [posts, setPosts] = useState([])
  const [text, setText] = useState('')
  const [posting, setPosting] = useState(false)
  const [expandedId, setExpandedId] = useState(null)
  const [replies, setReplies] = useState({})
  const [replyText, setReplyText] = useState('')
  const [postingReply, setPostingReply] = useState(false)
  const expandedRef = useRef(null)

  const loadPosts = async () => {
    const { data } = await supabase
      .from('community_posts')
      .select('*, profiles(full_name)')
      .is('parent_id', null)
      .order('created_at', { ascending: false })
      .limit(50)
    setPosts(data || [])
  }

  const loadReplies = async (postId) => {
    const { data } = await supabase
      .from('community_posts')
      .select('*, profiles(full_name)')
      .eq('parent_id', postId)
      .order('created_at', { ascending: true })
    setReplies(r => ({ ...r, [postId]: data || [] }))
  }

  useEffect(() => {
    loadPosts()

    const channel = supabase
      .channel('squad-feed')
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'community_posts'
      }, async (payload) => {
        const newPost = payload.new
        if (!newPost.parent_id) {
          const { data } = await supabase
            .from('community_posts')
            .select('*, profiles(full_name)')
            .eq('id', newPost.id)
            .single()
          if (data) setPosts(p => [data, ...p])
        } else {
          setPosts(p => p.map(post =>
            post.id === newPost.parent_id
              ? { ...post, _reply_count: (post._reply_count || 0) + 1 }
              : post
          ))
          if (expandedRef.current === newPost.parent_id) {
            loadReplies(newPost.parent_id)
          }
        }
      })
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  const toggleExpand = async (id) => {
    if (expandedId === id) {
      setExpandedId(null)
      expandedRef.current = null
      setReplyText('')
    } else {
      setExpandedId(id)
      expandedRef.current = id
      if (!replies[id]) await loadReplies(id)
    }
  }

  const submitPost = async () => {
    if (!text.trim()) return
    setPosting(true)
    await supabase.from('community_posts')
      .insert({ user_id: session.user.id, content: text.trim() })
    setText('')
    setPosting(false)
  }

  const submitReply = async (parentId) => {
    if (!replyText.trim()) return
    setPostingReply(true)
    const { data } = await supabase
      .from('community_posts')
      .insert({ user_id: session.user.id, content: replyText.trim(), parent_id: parentId })
      .select('*, profiles(full_name)')
      .single()
    if (data) {
      setReplies(r => ({ ...r, [parentId]: [...(r[parentId] || []), data] }))
      setPosts(p => p.map(post =>
        post.id === parentId
          ? { ...post, _reply_count: (post._reply_count || 0) + 1 }
          : post
      ))
    }
    setReplyText('')
    setPostingReply(false)
  }

  return (
    <div className="space-y-4">
      {/* Compose */}
      <div className="rounded-2xl p-4" style={{ background: '#0c0c16', border: '1px solid #1a1a28' }}>
        <p className="text-xs font-semibold mb-2" style={{ color: '#d4a017' }}>
          {profile?.full_name || 'Warrior'}
        </p>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Encourage the squad, share a win, or ask for accountability..."
          className="w-full text-sm text-white placeholder-gray-600 outline-none"
          style={{ background: 'transparent', resize: 'none' }}
          rows={3}
        />
        <div className="flex justify-end mt-2">
          <button onClick={submitPost} disabled={posting || !text.trim()}
            className="px-4 py-2 text-black text-xs font-bold rounded-lg disabled:opacity-50"
            style={{ background: '#d4a017' }}>
            {posting ? '...' : 'Post'}
          </button>
        </div>
      </div>

      {/* Feed */}
      {posts.length === 0 ? (
        <p className="text-center text-gray-600 text-sm py-10">
          The squad is quiet. Be the first to speak up.
        </p>
      ) : posts.map(p => (
        <div key={p.id} className="rounded-xl overflow-hidden"
          style={{ background: '#0c0c16', border: '1px solid #1a1a28' }}>

          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold" style={{ color: '#d4a017' }}>
                {p.profiles?.full_name || 'Warrior'}
              </p>
              <p className="text-xs text-gray-600">{formatTime(p.created_at)}</p>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">{p.content}</p>

            <button onClick={() => toggleExpand(p.id)}
              className="mt-3 flex items-center gap-1.5 text-xs transition"
              style={{ color: expandedId === p.id ? '#d4a017' : '#6b7280' }}>
              <span>Reply</span>
              {p._reply_count > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-xs"
                  style={{ background: '#1a1a28', color: '#9ca3af' }}>
                  {p._reply_count}
                </span>
              )}
              {expandedId === p.id && (
                <span style={{ color: '#374151' }}>· close</span>
              )}
            </button>
          </div>

          {/* Replies */}
          {expandedId === p.id && (
            <div style={{ borderTop: '1px solid #1a1a28' }}>
              {(replies[p.id] || []).length === 0 && (
                <p className="px-4 py-3 text-xs text-gray-700">No replies yet. Be first.</p>
              )}
              {(replies[p.id] || []).map(r => (
                <div key={r.id} className="px-4 py-3"
                  style={{ borderBottom: '1px solid #13131e' }}>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-semibold" style={{ color: '#8b7529' }}>
                      {r.profiles?.full_name || 'Warrior'}
                    </p>
                    <p className="text-xs text-gray-700">{formatTime(r.created_at)}</p>
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed">{r.content}</p>
                </div>
              ))}

              <div className="p-3 flex gap-2" style={{ background: '#080810' }}>
                <input
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  placeholder="Write a reply..."
                  className="flex-1 text-sm text-white placeholder-gray-600 outline-none px-3 py-2 rounded-lg"
                  style={{ background: '#13131e', border: '1px solid #252040' }}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      submitReply(p.id)
                    }
                  }}
                />
                <button onClick={() => submitReply(p.id)}
                  disabled={postingReply || !replyText.trim()}
                  className="px-4 py-2 text-black text-xs font-bold rounded-lg disabled:opacity-50"
                  style={{ background: '#d4a017' }}>
                  {postingReply ? '...' : 'Send'}
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
