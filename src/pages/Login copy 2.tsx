import React, { useState } from "react";
// 匯入您先前建立的 supabase client
import { supabase } from "../supabaseClient";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 處理 Email/密碼 登入
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      // 成功登入後，後續會由 AuthProvider 處理導向
    } catch (err: any) {
      setError(err.error_description || err.message);
    } finally {
      setLoading(false);
    }
  };

  // 處理 Email/密碼 註冊
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          // 如果您想在註冊後立即將用戶導向某個頁面，可以在這裡設定
          // emailRedirectTo: `${window.location.origin}/`,
        },
      });
      if (error) throw error;
      alert("註冊成功！請檢查您的信箱以完成驗證。");
    } catch (err: any) {
      setError(err.error_description || err.message);
    } finally {
      setLoading(false);
    }
  };

  // 處理 Google 登入
  const handleGoogleLogin = async () => {
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.error_description || err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          歡迎回來
        </h2>

        {error && (
          <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-center">
            {error}
          </p>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              電子郵件
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              密碼
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="flex items-center justify-between gap-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
            >
              {loading ? "處理中..." : "登入"}
            </button>
            <button
              type="button"
              onClick={handleSignUp}
              disabled={loading}
              className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:bg-gray-300"
            >
              {loading ? "處理中..." : "註冊"}
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">或是</span>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path
                  d="M20.0001 10.0001C20.0001 9.29532 19.9306 8.59891 19.7995 7.91895H10.2042V11.818H15.8378C15.6101 13.0613 14.936 14.1843 13.9189 14.8985V17.5235H17.3328C19.0594 15.9017 20.0001 13.1895 20.0001 10.0001Z"
                  fill="#4285F4"
                />
                <path
                  d="M10.2042 20.0001C12.962 20.0001 15.2731 19.116 16.8959 17.5236L13.9188 14.8986C13.0458 15.4469 11.9688 15.8126 10.2042 15.8126C7.05118 15.8126 4.42618 13.7335 3.52173 10.9585H0V13.6934C1.58182 17.2312 5.55182 20.0001 10.2042 20.0001Z"
                  fill="#34A853"
                />
                <path
                  d="M3.52156 10.9585C3.33406 10.4102 3.23273 9.82973 3.23273 9.23354C3.23273 8.63735 3.33406 8.05682 3.52156 7.50849V4.77344H0C-0.00012207 5.34773 -0.00012207 6.90849 0 9.23354C-0.00012207 11.5585 0 13.1193 0 13.6935L3.52156 10.9585Z"
                  fill="#FBBC05"
                />
                <path
                  d="M10.2042 3.1875C11.6688 3.1875 12.8716 3.6625 13.8477 4.59318L16.9688 1.47227C15.2614 -0.119318 12.9503 0.000227273 10.2042 0.000227273C5.55182 0.000227273 1.58182 2.76909 0 6.30682L3.52155 9.04182C4.42614 6.26682 7.05114 3.1875 10.2042 3.1875Z"
                  fill="#EA4335"
                />
              </svg>
              使用 Google 登入
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
