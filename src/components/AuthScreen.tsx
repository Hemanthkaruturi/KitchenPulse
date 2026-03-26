interface AuthScreenProps {
  isLogin: boolean
  setIsLogin: (v: boolean) => void
  authForm: { username: string; password: string; name: string }
  setAuthForm: (v: { username: string; password: string; name: string }) => void
  handleLogin: (e: React.FormEvent) => void
  handleSignup: (e: React.FormEvent) => void
  theme: 'light' | 'dark'
  toggleTheme: () => void
}

export default function AuthScreen({ isLogin, setIsLogin, authForm, setAuthForm, handleLogin, handleSignup, theme, toggleTheme }: AuthScreenProps) {
  return (
    <div className="auth-layout">
      <div className="auth-header">
        <h1>KitchenPulse</h1>
        <p>Track your kitchen inventory smartly</p>
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          title="Toggle theme"
          style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: 'white' }}
        >
          {theme === 'light' ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1" x2="12" y2="3"/>
              <line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/>
              <line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
          )}
        </button>
      </div>

      <div className="auth-body">
        <div className="auth-card">
          <div className="auth-tabs">
            <button
              className={`auth-tab ${isLogin ? 'active' : ''}`}
              onClick={() => setIsLogin(true)}
            >
              Login
            </button>
            <button
              className={`auth-tab ${!isLogin ? 'active' : ''}`}
              onClick={() => setIsLogin(false)}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={isLogin ? handleLogin : handleSignup} className="auth-form">
            {!isLogin && (
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={authForm.name}
                  onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                placeholder="Enter username"
                value={authForm.username}
                onChange={(e) => setAuthForm({ ...authForm, username: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter password"
                value={authForm.password}
                onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block">
              {isLogin ? 'Login' : 'Sign Up'}
            </button>
          </form>

          <div className="demo-box">
            <p>Demo Accounts</p>
            <p>Owner: john_owner / pass123</p>
            <p>User 1: jane_user / pass123</p>
            <p>User 2: bob_user / pass123</p>
          </div>
        </div>
      </div>
    </div>
  )
}
