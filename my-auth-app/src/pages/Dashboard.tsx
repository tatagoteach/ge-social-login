import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import type { User } from "@supabase/supabase-js";

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // 獲取當前登入的用戶 session
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    fetchUser();
  }, []);

  // 處理登出邏輯
  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("登出時發生錯誤:", error);
    } else {
      // 登出成功後，AuthContext 會偵測到變化並自動導向
      // 這裡也可以手動導向以獲得更即時的反應
      navigate("/login");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-lg text-gray-600">正在載入使用者資訊...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-md p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">儀表板</h1>
        {user ? (
          <>
            <p className="text-lg text-gray-600 mb-6">
              歡迎回來,{" "}
              <span className="font-semibold text-indigo-600">
                {user.email}
              </span>
              ！
            </p>
            <button
              onClick={handleSignOut}
              className="bg-red-500 text-white py-2 px-6 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            >
              登出
            </button>
          </>
        ) : (
          <p className="text-lg text-gray-600">
            無法載入使用者資訊，請重新登入。
          </p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
