interface AuthScreenProps {
  isLogin: boolean
  setIsLogin: (v: boolean) => void
  authForm: { username: string; password: string; name: string }
  setAuthForm: (v: { username: string; password: string; name: string }) => void
  handleLogin: (e: React.FormEvent) => void
  handleSignup: (e: React.FormEvent) => void
}

export default function AuthScreen({ isLogin, setIsLogin, authForm, setAuthForm, handleLogin, handleSignup }: AuthScreenProps) {
  return (
    <div className="app">
      <header className="header">
        <h1>KitchenPulse</h1>
        <p className="tagline">Track your kitchen inventory smartly</p>
      </header>

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
