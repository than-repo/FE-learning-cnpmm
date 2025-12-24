// app/page.tsx
"use client";

import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const TOKENS: Record<string, string> = {
  gv_admin:
    "eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiZ3ZfYWRtaW4iLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJHViJ9.",
  hv_01:
    "eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiaHZfMDEiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJIViJ9.",
  hv_02:
    "eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiaHZfMDIiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJIViJ9.",
  hv_03:
    "eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiaHZfMDMiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJIViJ9.",
  hv_04:
    "eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiaHZfMDQiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJIViJ9.",
  hv_05:
    "eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiaHZfMDUiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJIViJ9.",
  hv_06:
    "eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiaHZfMDYiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJIViJ9.",
};

export default function Home() {
  const { login, user } = useAuth();
  const router = useRouter();

  // Nếu đã login → tự động redirect
  useEffect(() => {
    if (user) {
      router.push(user.role === "GV" ? "/teacher" : "/student");
    }
  }, [user, router]);

  const handleLogin = (token: string) => {
    login(token);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-8">
      <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-2xl w-full">
        <h1 className="text-4xl font-bold text-center mb-4 text-indigo-800">
          Hệ thống quản lý khóa học
        </h1>
        <p className="text-center text-gray-600 mb-10">
          Chọn tài khoản để đăng nhập (môi trường test)
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-2xl font-semibold text-green-700 mb-4 text-center">
              Giáo vụ (GV)
            </h2>
            <button
              onClick={() => handleLogin(TOKENS.gv_admin)}
              className="w-full py-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition shadow-lg"
            >
              gv_admin (Quản trị viên)
            </button>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-blue-700 mb-4 text-center">
              Học viên (HV)
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {Object.keys(TOKENS)
                .filter((key) => key.startsWith("hv_"))
                .map((key) => (
                  <button
                    key={key}
                    onClick={() => handleLogin(TOKENS[key])}
                    className="py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
                  >
                    {key.toUpperCase()}
                  </button>
                ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
