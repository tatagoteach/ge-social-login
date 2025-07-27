import { createClient } from "@supabase/supabase-js";

// 從環境變數中獲取 Supabase 的 URL 和匿名金鑰
// Vite 使用 `import.meta.env` 來存取環境變數
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 檢查變數是否存在，若不存在則拋出錯誤，避免應用程式在配置不完整的情況下運行
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL and Anon Key must be defined in the .env file");
}

// 建立並匯出 Supabase 用戶端實例
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
