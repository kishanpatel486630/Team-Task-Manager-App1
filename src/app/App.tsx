import { useState, useEffect, createContext, useContext } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { api } from './utils/api';
import { Avatar } from './components/custom/Avatar';
import { Badge } from './components/custom/Badge';
import { Button } from './components/custom/Button';
import { Input } from './components/custom/Input';
import { Textarea } from './components/custom/Textarea';
import { Select } from './components/custom/Select';
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Users,
  Plus,
  LogOut,
  Menu,
  X,
  Trash2,
  Calendar,
  AlertCircle,
  Sparkles,
  TrendingUp,
  Zap,
} from 'lucide-react';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

function useAuth() {
  return useContext(AuthContext);
}

// Auth Provider
function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = api.getToken();
    if (token) {
      api.getMe()
        .then(data => setUser(data.user))
        .catch(() => api.setToken(null))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const data = await api.login({ email, password });
    api.setToken(data.accessToken);
    setUser(data.user);
  };

  const register = async (registerData: any) => {
    const data = await api.register(registerData);
    api.setToken(data.accessToken);
    setUser(data.user);
  };

  const logout = () => {
    api.setToken(null);
    setUser(null);
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-400">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg font-semibold">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Login Page
function LoginPage({ onSwitchToRegister }: { onSwitchToRegister: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-blue-800 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 animate-slide-in-up">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl mb-6 shadow-2xl transform hover:scale-110 transition-transform duration-300">
              <span className="text-white text-3xl font-black">TP</span>
            </div>
            <h1 className="text-4xl font-black text-white mb-3">TaskFlow Pro</h1>
            <p className="text-blue-100 text-base font-medium">Sign in to your workspace</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-white font-semibold text-sm mb-2">Email Address</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="name@example.com"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-blue-400 focus:bg-white/20 transition-all duration-300 backdrop-blur-sm"
              />
            </div>

            <div>
              <label className="block text-white font-semibold text-sm mb-2">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-blue-400 focus:bg-white/20 transition-all duration-300 backdrop-blur-sm"
              />
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-400/50 rounded-xl p-4 text-sm text-red-100 backdrop-blur-sm flex items-start gap-3">
                <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-blue-500/50 transform hover:scale-105 transition-all duration-300 text-base" 
              disabled={loading}
            >
              <Sparkles size={18} className="inline mr-2" />
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          <div className="relative my-7">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white/5 text-white/60 backdrop-blur">or</span>
            </div>
          </div>

          <p className="text-center text-white/80">
            Don't have an account?{' '}
            <button
              onClick={onSwitchToRegister}
              className="text-blue-300 font-bold hover:text-blue-200 transition-colors duration-300 underline decoration-blue-300/30 hover:decoration-blue-300"
            >
              Create one now
            </button>
          </p>
        </div>

        <div className="mt-8 text-center text-white/60 text-sm">
          <p>© 2024 TaskFlow Pro. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

// Register Page
function RegisterPage({ onSwitchToLogin }: { onSwitchToLogin: () => void }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(formData);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-blue-800 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 animate-slide-in-up">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl mb-6 shadow-2xl transform hover:scale-110 transition-transform duration-300">
              <span className="text-white text-3xl font-black">TP</span>
            </div>
            <h1 className="text-4xl font-black text-white mb-3">Join TaskFlow Pro</h1>
            <p className="text-blue-100 text-base font-medium">Create your account to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-white font-semibold text-sm mb-2">First Name</label>
                <Input
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                  placeholder="John"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white placeholder-white/50 focus:outline-none focus:border-blue-400 focus:bg-white/20 transition-all duration-300 backdrop-blur-sm text-sm"
                />
              </div>
              <div>
                <label className="block text-white font-semibold text-sm mb-2">Last Name</label>
                <Input
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                  placeholder="Doe"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white placeholder-white/50 focus:outline-none focus:border-blue-400 focus:bg-white/20 transition-all duration-300 backdrop-blur-sm text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-white font-semibold text-sm mb-2">Email Address</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                placeholder="name@example.com"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-blue-400 focus:bg-white/20 transition-all duration-300 backdrop-blur-sm"
              />
            </div>

            <div>
              <label className="block text-white font-semibold text-sm mb-2">Password</label>
              <Input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                placeholder="Min. 8 characters"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-blue-400 focus:bg-white/20 transition-all duration-300 backdrop-blur-sm"
              />
              <p className="text-white/50 text-xs mt-2">Password must be at least 8 characters long</p>
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-400/50 rounded-xl p-4 text-sm text-red-100 backdrop-blur-sm flex items-start gap-3">
                <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-blue-500/50 transform hover:scale-105 transition-all duration-300 text-base" 
              disabled={loading}
            >
              <Sparkles size={18} className="inline mr-2" />
              {loading ? 'Creating account...' : 'Sign up'}
            </Button>
          </form>

          <div className="relative my-7">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white/5 text-white/60 backdrop-blur">or</span>
            </div>
          </div>

          <p className="text-center text-white/80">
            Already have an account?{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-blue-300 font-bold hover:text-blue-200 transition-colors duration-300 underline decoration-blue-300/30 hover:decoration-blue-300"
            >
              Sign in
            </button>
          </p>
        </div>

        <div className="mt-8 text-center text-white/60 text-sm">
          <p>© 2024 TaskFlow Pro. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

// Sidebar Component
function Sidebar({
  activeView,
  onViewChange,
  user,
  onLogout,
  isMobileOpen,
  onCloseMobile,
}: {
  activeView: string;
  onViewChange: (view: string) => void;
  user: User;
  onLogout: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, gradient: 'from-blue-500 to-blue-600' },
    { id: 'projects', label: 'Projects', icon: FolderKanban, gradient: 'from-blue-600 to-blue-700' },
    { id: 'tasks', label: 'My Tasks', icon: CheckSquare, gradient: 'from-blue-700 to-blue-800' },
  ];

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={onCloseMobile}
        />
      )}

      <div className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-72 bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col
        transform transition-all duration-300 ease-in-out shadow-2xl
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white text-sm font-bold">TP</span>
            </div>
            <h1 className="text-xl font-bold">TaskFlow Pro</h1>
          </div>
          <button onClick={onCloseMobile} className="lg:hidden hover:bg-white/10 p-2 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onViewChange(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg scale-105`
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <div className={`${isActive ? 'animate-float' : 'group-hover:scale-110 transition-transform'}`}>
                  <Icon size={20} />
                </div>
                {item.label}
                {isActive && (
                  <div className="ml-auto">
                    <TrendingUp size={16} className="animate-pulse-slow" />
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="glass-effect rounded-xl p-4 mb-3 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <Avatar name={`${user.firstName} ${user.lastName}`} size="md" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{user.firstName} {user.lastName}</p>
                <p className="text-xs text-white/60 truncate">{user.email}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onLogout}
              className="w-full text-white/80 hover:bg-white/10 border border-white/20"
            >
              <LogOut size={16} className="mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

// Dashboard View
function DashboardView({ user }: { user: User }) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getDashboardStats()
      .then(data => setStats(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => <div key={i} className="h-32 bg-gray-200 rounded-2xl"></div>)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="animate-slide-in-up">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user.firstName}! 👋
        </h2>
        <p className="text-gray-600">Here's what's happening with your projects today</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-effect rounded-2xl p-6 border border-blue-200 card-hover animate-slide-in-up">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <CheckSquare className="text-white" size={24} />
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 mb-1">Total Tasks</p>
              <p className="text-3xl font-bold text-blue-600">
                {stats?.totalTasks || 0}
              </p>
            </div>
          </div>
          <div className="h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
        </div>

        <div className="glass-effect rounded-2xl p-6 border border-blue-200 card-hover animate-slide-in-up" style={{animationDelay: '0.1s'}}>
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
              <TrendingUp className="text-white" size={24} />
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 mb-1">In Progress</p>
              <p className="text-3xl font-bold text-blue-700">
                {stats?.inProgress || 0}
              </p>
            </div>
          </div>
          <div className="h-1 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full"></div>
        </div>

        <div className="glass-effect rounded-2xl p-6 border border-red-200 card-hover animate-slide-in-up" style={{animationDelay: '0.2s'}}>
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
              <AlertCircle className="text-white" size={24} />
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 mb-1">Overdue</p>
              <p className="text-3xl font-bold text-red-600">
                {stats?.overdue || 0}
              </p>
            </div>
          </div>
          <div className="h-1 bg-gradient-to-r from-red-500 to-red-600 rounded-full"></div>
        </div>
      </div>

      {stats?.recentTasks && stats.recentTasks.length > 0 && (
        <div className="glass-effect rounded-2xl border border-gray-200 overflow-hidden animate-slide-in-up" style={{animationDelay: '0.3s'}}>
          <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-700">
            <h3 className="font-semibold text-white text-lg flex items-center gap-2">
              <CheckSquare size={20} />
              Recent Tasks
            </h3>
          </div>
          <div className="divide-y divide-gray-100">
            {stats.recentTasks.map((task: any, index: number) => (
              <div key={task.id} className="p-4 hover:bg-blue-50/50 transition-colors" style={{animationDelay: `${0.4 + index * 0.1}s`}}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-gray-900 mb-1">{task.title}</h4>
                    {task.description && (
                      <p className="text-xs text-gray-600 mb-2 line-clamp-1">{task.description}</p>
                    )}
                    <div className="flex items-center gap-2">
                      <Badge variant="status" value={task.status} />
                      <Badge variant="priority" value={task.priority} />
                    </div>
                  </div>
                  {task.dueDate && (
                    <div className="text-xs text-gray-500 flex items-center gap-1 ml-4">
                      <Calendar size={12} />
                      {new Date(task.dueDate).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Projects View
function ProjectsView({ user, onSelectProject }: { user: User; onSelectProject: (id: string) => void }) {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });

  const loadProjects = () => {
    setLoading(true);
    api.getProjects()
      .then(data => setProjects(data.projects))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    try {
      await api.createProject(newProject);
      setShowCreateModal(false);
      setNewProject({ name: '', description: '' });
      loadProjects();
    } catch (error: any) {
      alert(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6 animate-slide-in-up">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-1">Projects</h2>
          <p className="text-gray-600">Manage your team workspaces</p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg"
        >
          <Plus size={16} className="mr-2" />
          Create Project
        </Button>
      </div>

      {loading && projects.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-48 bg-gray-200 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20 animate-slide-in-up">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
            <FolderKanban className="text-white" size={40} />
          </div>
          <p className="text-gray-600 mb-6 text-lg">No projects yet</p>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg"
          >
            Create your first project
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className="glass-effect rounded-2xl p-6 border border-blue-200 hover:border-blue-400 transition-all duration-300 cursor-pointer card-hover animate-slide-in-up group"
              onClick={() => onSelectProject(project.id)}
              style={{animationDelay: `${index * 0.1}s`}}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                  <FolderKanban className="text-white" size={24} />
                </div>
              </div>
              <h3 className="font-bold text-gray-900 mb-2 text-lg group-hover:text-blue-600 transition-colors">{project.name}</h3>
              {project.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{project.description}</p>
              )}
              <div className="flex items-center gap-3 pt-3 border-t border-gray-200">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Users size={14} />
                  {project.members?.length || 0} members
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="glass-effect rounded-2xl shadow-2xl p-8 w-full max-w-md border border-white/20 animate-slide-in-up">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Create New Project</h3>
            <form onSubmit={handleCreateProject} className="space-y-4">
              <Input
                label="Project Name"
                value={newProject.name}
                onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                required
                placeholder="My Awesome Project"
                className="glass-effect border-blue-200"
              />
              <Textarea
                label="Description"
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                placeholder="What is this project about?"
                rows={3}
                className="glass-effect border-blue-200"
              />
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowCreateModal(false)}
                  disabled={loading}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                >
                  {loading ? 'Creating...' : 'Create Project'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Draggable Task Card Component
function DraggableTaskCard({ task, onEdit }: { task: any; onEdit: () => void }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'TASK',
    item: { id: task.id, currentStatus: task.status },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`bg-white rounded-xl p-4 border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all duration-200 cursor-move group card-hover ${
        isDragging ? 'opacity-50 scale-95' : ''
      }`}
      onClick={onEdit}
    >
      <h4 className="text-sm font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{task.title}</h4>
      {task.description && (
        <p className="text-xs text-gray-600 mb-3 line-clamp-2">{task.description}</p>
      )}
      <div className="flex items-center justify-between">
        <Badge variant="priority" value={task.priority} />
        {task.assigneeName && (
          <Avatar name={task.assigneeName} size="xs" />
        )}
      </div>
      {task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done' && (
        <div className="mt-2 flex items-center gap-1 text-xs text-red-500 font-medium">
          <AlertCircle size={12} />
          Overdue
        </div>
      )}
    </div>
  );
}

// Droppable Column Component
function DroppableColumn({
  column,
  tasks,
  onDrop,
  onAddTask,
  onEditTask
}: {
  column: any;
  tasks: any[];
  onDrop: (taskId: string, newStatus: string) => void;
  onAddTask: (status: string) => void;
  onEditTask: (task: any) => void;
}) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'TASK',
    drop: (item: any) => onDrop(item.id, column.id),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const gradients: Record<string, string> = {
    'todo': 'from-gray-500 to-gray-600',
    'in-progress': 'from-blue-500 to-cyan-500',
    'in-review': 'from-orange-500 to-yellow-500',
    'done': 'from-green-500 to-emerald-500',
  };

  return (
    <div className="flex-shrink-0 w-80">
      <div className={`glass-effect rounded-2xl border-2 transition-all duration-200 ${
        isOver ? 'border-blue-500 bg-blue-50/50 scale-105' : 'border-gray-200'
      }`}>
        <div className={`p-4 bg-gradient-to-r ${gradients[column.id]} rounded-t-2xl`}>
          <h3 className="text-sm font-bold text-white uppercase tracking-wide flex items-center justify-between">
            {column.label}
            <span className="bg-white/20 px-3 py-1 rounded-full text-xs">
              {tasks.length}
            </span>
          </h3>
        </div>
        <div ref={drop} className="p-4 space-y-3 min-h-[400px]">
          {tasks.map(task => (
            <DraggableTaskCard
              key={task.id}
              task={task}
              onEdit={() => onEditTask(task)}
            />
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAddTask(column.id)}
            className="w-full border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 text-gray-600 hover:text-blue-600"
          >
            <Plus size={16} className="mr-1" />
            Add Task
          </Button>
        </div>
      </div>
    </div>
  );
}

// Project Detail View (Kanban Board) - CONTINUED IN NEXT MESSAGE
function ProjectDetailView({ projectId, onBack, user }: { projectId: string; onBack: () => void; user: User }) {
  const [project, setProject] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('member');
  const [saving, setSaving] = useState(false);

  const loadProjectData = () => {
    setError(null);
    console.log("Loading project data for projectId:", projectId);
    Promise.all([
      api.getProject(projectId),
      api.getTasks(projectId),
    ])
      .then(([projectData, tasksData]) => {
        console.log("Project data loaded successfully:", projectData);
        setProject(projectData.project);
        setTasks(tasksData.tasks);
        setError(null);
      })
      .catch((err) => {
        console.error("Error loading project:", err);
        console.error("Error details:", {
          message: err.message,
          projectId,
          userId: user.id
        });
        setError(err.message || "Failed to load project");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProjectData();
  }, [projectId]);

  const handleDrop = async (taskId: string, newStatus: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task || task.status === newStatus) return;

    // Optimistic update
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));

    try {
      await api.updateTask(taskId, { status: newStatus });
    } catch (error: any) {
      alert(error.message);
      loadProjectData(); // Reload on error
    }
  };

  const handleCreateTask = (status: string) => {
    setEditingTask({
      projectId,
      title: '',
      description: '',
      status,
      priority: 'medium',
      assignee: '',
      dueDate: '',
    });
    setShowTaskModal(true);
  };

  const handleSaveTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;

    setSaving(true);
    try {
      if (editingTask.id) {
        await api.updateTask(editingTask.id, editingTask);
      } else {
        await api.createTask(editingTask);
      }
      setShowTaskModal(false);
      setEditingTask(null);
      loadProjectData();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      await api.deleteTask(taskId);
      loadProjectData();
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleInviteMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;

    setSaving(true);
    try {
      await api.inviteMember(projectId, { email: inviteEmail, role: inviteRole });
      setShowInviteModal(false);
      setInviteEmail('');
      loadProjectData();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!confirm('Are you sure you want to delete this project? This will delete all tasks.')) return;
    try {
      await api.deleteProject(projectId);
      onBack();
    } catch (error: any) {
      alert(error.message);
    }
  };

  const columns = [
    { id: 'todo', label: 'To Do' },
    { id: 'in-progress', label: 'In Progress' },
    { id: 'in-review', label: 'In Review' },
    { id: 'done', label: 'Done' },
  ];

  const isAdmin = project?.owner === user.id || project?.members?.find((m: any) => m.userId === user.id)?.role === 'admin';

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="flex gap-4">
            {[1, 2, 3, 4].map(i => <div key={i} className="flex-1 h-96 bg-gray-200 rounded-2xl"></div>)}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="max-w-2xl mx-auto text-center py-12">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="text-red-600" size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Unable to Load Project</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <Button variant="secondary" onClick={onBack}>
              ← Go Back
            </Button>
            <Button onClick={() => {
              setLoading(true);
              loadProjectData();
            }}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col h-full">
        <div className="glass-effect border-b border-gray-200 p-6 animate-slide-in-up">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={onBack} className="hover:bg-purple-100">
                ← Back
              </Button>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {project?.name}
                </h2>
                <p className="text-sm text-gray-600">{project?.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowInviteModal(true)}
                className="border-blue-200 hover:bg-blue-50"
              >
                <Plus size={16} className="mr-1" />
                Invite
              </Button>
              {isAdmin && (
                <Button variant="danger" size="sm" onClick={handleDeleteProject}>
                  <Trash2 size={16} />
                </Button>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Users size={14} />
              {project?.members?.length || 0} members
            </div>
            <div className="flex items-center gap-1">
              <CheckSquare size={14} />
              {tasks.length} tasks
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-x-auto p-6 bg-gradient-to-br from-blue-50 to-gray-50">
          <div className="flex gap-6 min-w-max pb-4">
            {columns.map((column, index) => (
              <div key={column.id} className="animate-slide-in-up" style={{animationDelay: `${index * 0.1}s`}}>
                <DroppableColumn
                  column={column}
                  tasks={tasks.filter(t => t.status === column.id)}
                  onDrop={handleDrop}
                  onAddTask={handleCreateTask}
                  onEditTask={(task) => {
                    setEditingTask(task);
                    setShowTaskModal(true);
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Task Modal */}
        {showTaskModal && editingTask && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="glass-effect rounded-2xl shadow-2xl p-8 w-full max-w-2xl my-8 border border-white/20 animate-slide-in-up">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  {editingTask.id ? 'Edit Task' : 'Create Task'}
                </h3>
                {editingTask.id && isAdmin && (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => {
                      handleDeleteTask(editingTask.id);
                      setShowTaskModal(false);
                    }}
                  >
                    <Trash2 size={16} />
                  </Button>
                )}
              </div>

              <form onSubmit={handleSaveTask} className="space-y-4">
                <Input
                  label="Title"
                  value={editingTask.title}
                  onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                  required
                  className="glass-effect border-blue-200"
                />
                <Textarea
                  label="Description"
                  value={editingTask.description}
                  onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                  rows={4}
                  className="glass-effect border-blue-200"
                />
                <div className="grid grid-cols-2 gap-4">
                  <Select
                    label="Status"
                    value={editingTask.status}
                    onChange={(e) => setEditingTask({ ...editingTask, status: e.target.value })}
                    options={[
                      { value: 'todo', label: 'To Do' },
                      { value: 'in-progress', label: 'In Progress' },
                      { value: 'in-review', label: 'In Review' },
                      { value: 'done', label: 'Done' },
                    ]}
                    className="glass-effect border-blue-200"
                  />
                  <Select
                    label="Priority"
                    value={editingTask.priority}
                    onChange={(e) => setEditingTask({ ...editingTask, priority: e.target.value })}
                    options={[
                      { value: 'low', label: 'Low' },
                      { value: 'medium', label: 'Medium' },
                      { value: 'high', label: 'High' },
                      { value: 'critical', label: 'Critical' },
                    ]}
                    className="glass-effect border-blue-200"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Select
                    label="Assignee"
                    value={editingTask.assignee || ''}
                    onChange={(e) => setEditingTask({ ...editingTask, assignee: e.target.value })}
                    options={[
                      { value: '', label: 'Unassigned' },
                      ...(project?.members || []).map((m: any) => ({
                        value: m.userId,
                        label: m.name,
                      })),
                    ]}
                    className="glass-effect border-blue-200"
                  />
                  <Input
                    label="Due Date"
                    type="date"
                    value={editingTask.dueDate || ''}
                    onChange={(e) => setEditingTask({ ...editingTask, dueDate: e.target.value })}
                    className="glass-effect border-blue-200"
                  />
                </div>

                <div className="flex gap-3 pt-6">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setShowTaskModal(false);
                      setEditingTask(null);
                    }}
                    disabled={saving}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={saving}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                  >
                    {saving ? 'Saving...' : (editingTask.id ? 'Save Changes' : 'Create Task')}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Invite Modal */}
        {showInviteModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="glass-effect rounded-2xl shadow-2xl p-8 w-full max-w-md border border-white/20 animate-slide-in-up">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Invite Member</h3>
              <form onSubmit={handleInviteMember} className="space-y-4">
                <Input
                  label="Email"
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  required
                  placeholder="colleague@example.com"
                  className="glass-effect border-blue-200"
                />
                <Select
                  label="Role"
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  options={[
                    { value: 'member', label: 'Member' },
                    { value: 'admin', label: 'Admin' },
                  ]}
                  className="glass-effect border-blue-200"
                />
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setShowInviteModal(false)}
                    disabled={saving}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={saving}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                  >
                    {saving ? 'Sending...' : 'Send Invite'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DndProvider>
  );
}

// My Tasks View
function MyTasksView({ user }: { user: User }) {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const projectsData = await api.getProjects();

        const allTasks: any[] = [];
        for (const project of projectsData.projects) {
          const tasksData = await api.getTasks(project.id, { assignee: user.id });
          allTasks.push(...tasksData.tasks);
        }
        setTasks(allTasks);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user.id]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-gray-900 mb-6 animate-slide-in-up">
        My Tasks
      </h2>

      {tasks.length === 0 ? (
        <div className="text-center py-20 animate-slide-in-up">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
            <CheckSquare className="text-white" size={40} />
          </div>
          <p className="text-gray-600 text-lg">No tasks assigned to you yet</p>
        </div>
      ) : (
        <div className="glass-effect rounded-2xl border border-gray-200 overflow-hidden animate-slide-in-up">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-600 to-blue-700">
                <tr>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-white uppercase tracking-wider">Title</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-white uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-white uppercase tracking-wider">Priority</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-white uppercase tracking-wider">Due Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {tasks.map((task, index) => (
                  <tr key={task.id} className="hover:bg-blue-50/50 transition-colors" style={{animationDelay: `${index * 0.05}s`}}>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-900">{task.title}</div>
                      {task.description && (
                        <div className="text-xs text-gray-600 line-clamp-1 mt-1">{task.description}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="status" value={task.status} />
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="priority" value={task.priority} />
                    </td>
                    <td className="px-6 py-4">
                      {task.dueDate ? (
                        <div className={`text-xs font-medium ${
                          new Date(task.dueDate) < new Date() && task.status !== 'done'
                            ? 'text-red-600'
                            : 'text-gray-600'
                        }`}>
                          {new Date(task.dueDate).toLocaleDateString()}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// Main App
export default function App() {
  const [authView, setAuthView] = useState<'login' | 'register'>('login');
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <AuthProvider>
      <AuthContext.Consumer>
        {({ user, logout }) => {
          if (!user) {
            return authView === 'login' ? (
              <LoginPage onSwitchToRegister={() => setAuthView('register')} />
            ) : (
              <RegisterPage onSwitchToLogin={() => setAuthView('login')} />
            );
          }

          if (selectedProjectId) {
            return (
              <div className="h-screen flex flex-col bg-gradient-to-br from-blue-50 to-gray-50">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 flex items-center justify-between lg:hidden shadow-lg">
                  <div className="flex items-center gap-3">
                    <button onClick={() => setIsMobileSidebarOpen(true)} className="hover:bg-white/20 p-2 rounded-lg transition-colors">
                      <Menu size={24} />
                    </button>
                    <h1 className="font-bold">TaskFlow Pro</h1>
                  </div>
                </div>
                <div className="flex-1 flex overflow-hidden">
                  <Sidebar
                    activeView={activeView}
                    onViewChange={(view) => {
                      setActiveView(view);
                      setSelectedProjectId(null);
                    }}
                    user={user}
                    onLogout={logout}
                    isMobileOpen={isMobileSidebarOpen}
                    onCloseMobile={() => setIsMobileSidebarOpen(false)}
                  />
                  <div className="flex-1 overflow-auto">
                    <ProjectDetailView
                      projectId={selectedProjectId}
                      onBack={() => setSelectedProjectId(null)}
                      user={user}
                    />
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div className="h-screen flex flex-col bg-gradient-to-br from-blue-50 to-gray-50">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 flex items-center justify-between lg:hidden shadow-lg">
                <div className="flex items-center gap-3">
                  <button onClick={() => setIsMobileSidebarOpen(true)} className="hover:bg-white/20 p-2 rounded-lg transition-colors">
                    <Menu size={24} />
                  </button>
                  <h1 className="font-bold">TaskFlow Pro</h1>
                </div>
              </div>
              <div className="flex-1 flex overflow-hidden">
                <Sidebar
                  activeView={activeView}
                  onViewChange={setActiveView}
                  user={user}
                  onLogout={logout}
                  isMobileOpen={isMobileSidebarOpen}
                  onCloseMobile={() => setIsMobileSidebarOpen(false)}
                />
                <main className="flex-1 overflow-auto">
                  {activeView === 'dashboard' && <DashboardView user={user} />}
                  {activeView === 'projects' && (
                    <ProjectsView user={user} onSelectProject={setSelectedProjectId} />
                  )}
                  {activeView === 'tasks' && <MyTasksView user={user} />}
                </main>
              </div>
            </div>
          );
        }}
      </AuthContext.Consumer>
    </AuthProvider>
  );
}
