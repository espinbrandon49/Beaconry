import { Link, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useAuth } from "./context/useAuth";

import Feed from "./pages/Feed";
import Channels from "./pages/Channels";
import Invite from "./pages/Invite";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-600">
        Loading…
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}

export default function App() {
  const { user, loading, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <Link to="/" className="leading-tight">
              <div className="flex items-center gap-2 font-semibold text-lg tracking-tight">
                Beaconry
                <span className="flex items-center gap-1 text-xs text-slate-500">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  Live
                </span>
              </div>

              <div className="text-xs text-slate-500">
                District Broadcast System
              </div>
            </Link>

            {!loading && user && (
              <nav className="flex items-center gap-3 text-sm">
                <Link
                  className="text-slate-700 hover:text-slate-900"
                  to="/feed"
                >
                  Feed
                </Link>
                <Link
                  className="text-slate-700 hover:text-slate-900"
                  to="/channels"
                >
                  Channels
                </Link>
              </nav>
            )}
          </div>

          <div className="flex items-center gap-3">
            {!loading && !user && (
              <div className="flex items-center gap-3 text-sm">
                <Link
                  className="text-slate-700 hover:text-slate-900"
                  to="/login"
                >
                  Login
                </Link>
                <Link
                  className="text-slate-700 hover:text-slate-900"
                  to="/signup"
                >
                  Signup
                </Link>
              </div>
            )}

            {!loading && user && (
              <div className="flex items-center gap-3 text-sm">
                <div className="text-slate-600">
                  {user.email}
                  {user.isBroadcaster ? (
                    <span className="ml-2 text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-full">
                      Broadcaster
                    </span>
                  ) : null}
                </div>

                <button
                  onClick={logout}
                  className="text-sm px-3 py-1.5 rounded-md border border-slate-200 bg-white hover:bg-slate-50"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto w-full px-6 py-6 flex-1">
        <Routes>
          <Route path="/" element={<Navigate to="/feed" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route
            path="/invite/:slug"
            element={
              <ProtectedRoute>
                <Invite />
              </ProtectedRoute>
            }
          />

          <Route
            path="/feed"
            element={
              <ProtectedRoute>
                <Feed />
              </ProtectedRoute>
            }
          />

          <Route
            path="/channels"
            element={
              <ProtectedRoute>
                <Channels />
              </ProtectedRoute>
            }
          />

          <Route
            path="*"
            element={
              <div className="text-slate-700">
                <div className="text-lg font-semibold mb-2">Not found</div>
                <Link className="text-blue-600 hover:text-blue-700" to="/feed">
                  Go to Feed
                </Link>
              </div>
            }
          />
        </Routes>
      </main>
    </div>
  );
}
