import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

// 匯入我們建立的頁面和元件
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

// 使用 createBrowserRouter 設定應用程式的路由
const router = createBrowserRouter([
  {
    // 公開路由：登入頁面
    path: "/login",
    element: <Login />,
  },
  {
    // 受保護的路由群組
    // 根路徑 ("/") 會先經過 ProtectedRoute 的驗證
    path: "/",
    element: <ProtectedRoute />,
    // 只有在驗證成功後，才會渲染 children 中的元件
    children: [
      {
        // 當路徑為 "/" 時，在 ProtectedRoute 的 <Outlet /> 中顯示 Dashboard
        path: "/",
        element: <Dashboard />,
      },
      // 您未來可以在這裡新增更多受保護的路由
      // { path: "settings", element: <SettingsPage /> },
    ],
  },
]);

// App 主元件
const App: React.FC = () => {
  return (
    // 使用 AuthProvider 包裹整個應用程式
    // 這樣，所有路由和元件都能透過 useAuth() hook 存取到身份驗證狀態
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default App;
