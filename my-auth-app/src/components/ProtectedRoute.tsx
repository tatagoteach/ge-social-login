import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute: React.FC = () => {
  // 從我們的 AuthContext 中獲取使用者資訊和載入狀態
  const { user, loading } = useAuth();

  // 在身份驗證狀態仍在載入時，顯示一個載入指示器
  // 這可以防止在拿到使用者狀態前，頁面閃爍到登入頁
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-lg text-gray-600">正在驗證您的身份...</p>
      </div>
    );
  }

  // 如果載入完成後，確定沒有使用者，則導向到登入頁面
  // `replace` prop 會替換掉歷史記錄中的當前路徑，
  // 這樣使用者點擊瀏覽器的「返回」按鈕時，不會回到這個空白的受保護頁面
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 如果身份驗證成功（有 user 物件），則渲染該路由下的子元件
  // <Outlet /> 是 react-router-dom v6 的一個元件，用於渲染匹配的子路由
  return <Outlet />;
};

export default ProtectedRoute;
