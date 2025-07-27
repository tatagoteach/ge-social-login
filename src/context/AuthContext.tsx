import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
// 修正：將 import 改為 import type，因為 Session 和 User 是型別
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "../supabaseClient";

// 定義 Context 提供的值的型別
interface AuthContextType {
  session: Session | null;
  user: User | null;
  signOut: () => Promise<void>;
  loading: boolean;
}

// 建立 Auth Context，並提供一個預設值
// 我們斷言它不為 null，因為我們會在 Provider 中確保它總是有值的
const AuthContext = createContext<AuthContextType>(null!);

// 建立一個自訂 Hook，方便在其他元件中輕鬆使用 Auth Context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// 定義 AuthProvider 的 props 型別，它需要接收子元件
interface AuthProviderProps {
  children: ReactNode;
}

// AuthProvider 元件，它將包裹整個應用，負責管理身份驗證狀態
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. 立即獲取當前的 session，這有助於在頁面重載時快速恢復用戶狀態
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // 2. 設置一個監聽器，監聽身份驗證狀態的變化 (例如：SIGNED_IN, SIGNED_OUT)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // 3. 當元件卸載時，清除這個監聽器，以避免記憶體洩漏
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // 提供一個登出函式
  const signOut = async () => {
    await supabase.auth.signOut();
  };

  // 要傳遞給所有子元件的 context 值
  const value = {
    session,
    user,
    signOut,
    loading,
  };

  // 使用 Context.Provider 將 value 提供給其下的所有子元件
  // 在初始載入完成前，不渲染子元件，以確保子元件在拿到正確的 auth 狀態後才渲染
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
