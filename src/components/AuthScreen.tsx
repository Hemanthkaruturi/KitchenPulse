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
    <div className="auth-page">
      <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
        <button className="header-icon-btn theme-toggle-icon" onClick={toggleTheme} title="Toggle theme">
          {theme === 'light' ? '\u{2600}\uFE0F' : '\u{1F319}'}
        </button>
      </div>

      <div className="auth-header">
        <div className="auth-brand">
          <div className="auth-brand-icon">K</div>
          <span className="auth-brand-name">KitchenPulse</span>
        </div>
        <p className="auth-tagline">Track your kitchen inventory smartly</p>
      </div>

      <div className="auth-container">
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
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter your name"
                  value={authForm.name}
                  onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Username</label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter username"
                value={authForm.username}
                onChange={(e) => setAuthForm({ ...authForm, username: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
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

          <div className="demo-credentials">
            <p><strong>Demo Accounts:</strong></p>
            <p>Owner: john_owner / pass123</p>
            <p>User 1: jane_user / pass123</p>
            <p>User 2: bob_user / pass123</p>
          </div>
        </div>
      </div>
    </div>
  )
}
