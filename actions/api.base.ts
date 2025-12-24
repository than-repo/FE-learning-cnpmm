// actions/api.base.ts
import { useAuth } from "@/components/AuthProvider";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5554/api";

export async function apiFetch(
  endpoint: string,
  options: RequestInit = {}
) {
  // Vì đây là server action (Next.js), không dùng useAuth trực tiếp được
  // Nhưng tạm thời để client-side fetch, nên ta sẽ truyền accessToken từ component
  // Wait... Next.js actions là server-side → không có localStorage

  // Giải pháp: Để client-side fetch bình thường (dễ nhất hiện tại)
  // Sau này nếu muốn server actions thì thêm cookie hoặc truyền token

  return null; // Placeholder, mình sẽ dùng client fetch
}
