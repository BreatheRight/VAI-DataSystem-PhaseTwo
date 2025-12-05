import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import API from '../utils/apiClient';
import { useAuth } from '../utils/AuthContext';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import firebaseConfig from "../utils/firebaseConfig";
import { initializeApp } from "firebase/app";
import { Mail, ArrowRight, Eye, EyeOff } from 'lucide-react';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default function LoginNew() {
    const { setIsAuthenticated, setUser, setSurveyData } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
          const userCred = await signInWithEmailAndPassword(auth, email, password);
          const idToken = await userCred.user.getIdToken();

          const res = await API.post("/verify-token", { idToken });
          console.log("Verified backend UID:", res.data.uid);

          localStorage.setItem("jwtToken", idToken);
          localStorage.setItem("user", JSON.stringify({
            email: userCred.user.email,
            uid: userCred.user.uid,
          }));

          setUser({ email: userCred.user.email, uid: userCred.user.uid });
          setIsAuthenticated(true);

          const surveyRes = await API.get('/get-survey-responses');
          setSurveyData(surveyRes.data);
          localStorage.setItem("surveyData", JSON.stringify(surveyRes.data));

          navigate("/dashboard");
        } catch (err) {
          console.error("Login error:", err);
          setError("Invalid email or password.");
        }

        setEmail('');
        setPassword('');
      };

    return (
        <div className="min-h-screen grid md:grid-cols-2 bg-vai-white">
            {/* Left Panel - Community/Public Login */}
            <div className="flex flex-col items-center justify-center p-8 lg:p-16 bg-vai-white border-r border-vai-grayLight">
                <div className="w-full max-w-md">
                    <div className="mb-12">
                        <h1 className="text-4xl font-heading font-bold text-vai-black mb-2">Van Alen</h1>
                        <p className="text-lg text-vai-grayText">Login to your account with your email and password.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-vai-black mb-2">Email address</label>
                            <Input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-vai-black mb-2">Password</label>
                            <div className="relative">
                                <Input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full pr-12"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(prev => !prev)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-vai-grayText hover:text-vai-black transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <a href="#" className="text-vai-grayText hover:text-vai-black transition-colors">
                                Forgot your password?
                            </a>
                        </div>

                        <Button type="submit" variant="primary" className="w-full">
                            Log In
                        </Button>

                        {error && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                                {error}
                            </div>
                        )}
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-vai-grayText mb-4">
                            Or log in with
                        </p>
                        <div className="flex gap-4 mt-4">
                            <button className="flex-1 px-4 py-2 border border-vai-grayLight rounded-lg hover:bg-vai-bluePale/20 transition-colors flex items-center justify-center gap-2">
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                </svg>
                                Google
                            </button>
                            <button className="flex-1 px-4 py-2 border border-vai-grayLight rounded-lg hover:bg-vai-bluePale/20 transition-colors flex items-center justify-center gap-2">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                                </svg>
                                Apple
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel - Van Alen Staff Portal */}
            <div className="flex flex-col items-center justify-center p-8 lg:p-16 bg-vai-black text-white">
                <div className="w-full max-w-md text-center">
                    <div className="mb-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-6">
                            <Mail className="w-8 h-8 text-white" strokeWidth={1.5} />
                        </div>
                        <h2 className="text-3xl font-heading font-bold mb-4">Van Alen Staff Account Portal</h2>
                        <p className="text-white/70 text-lg mb-8">
                            Access the administrative dashboard and management tools.
                        </p>
                    </div>

                    <button
                        onClick={() => navigate('/login')}
                        className="w-full px-6 py-4 bg-white text-vai-black font-medium rounded-lg hover:bg-white/90 transition-all flex items-center justify-center gap-3 group"
                    >
                        <span>Staff Login</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>

                    <div className="mt-12 pt-8 border-t border-white/10">
                        <p className="text-sm text-white/50 mb-6">
                            <strong className="text-white/70">Making it easier for communities to shape the places where they live.</strong>
                        </p>
                        <div className="space-y-2 text-sm text-white/60">
                            <p>Drop us a line: <a href="mailto:vai@vanalen.org" className="text-white/80 hover:text-white">vai@vanalen.org</a></p>
                            <p>Press inquiries: <a href="mailto:press@vanalen.org" className="text-white/80 hover:text-white">press@vanalen.org</a></p>
                            <p className="mt-4">303 Bond Street<br/>Brooklyn, NY 11231<br/>212 924 7000</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
