// components/Navbar.tsx
"use client";

import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout(); // Xóa token khỏi state và localStorage
    router.push("/"); // Quay về trang chọn tài khoản
  };

  if (!user) return null; // Không hiện navbar nếu chưa login

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-lg border-b border-gray-200 z-50">
      {/* Thêm: fixed + left-0 right-0 + z-50 để luôn nằm trên cùng */}
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link
            href="/"
            className="text-2xl font-bold text-indigo-700"
          >
            E-Learning
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            {user.role === "GV" && (
              <>
                <Link
                  href="/teacher"
                  className="text-gray-700 hover:text-indigo-600 font-medium"
                >
                  Quản lý khóa học
                </Link>
              </>
            )}

            {user.role === "HV" && (
              <>
                <Link
                  href="/student"
                  className="text-gray-700 hover:text-indigo-600 font-medium"
                >
                  Khóa học của tôi
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <div className="text-right">
            <p className="text-sm text-gray-500">Đăng nhập với</p>
            <p className="font-semibold text-gray-800">
              {user.username}
              <span className="ml-2 text-xs px-2 py-1 rounded-full bg-opacity-20">
                {user.role === "GV" ? (
                  <span className="text-green-700 bg-green-100">
                    Giáo vụ
                  </span>
                ) : (
                  <span className="text-blue-700 bg-blue-100">
                    Học viên
                  </span>
                )}
              </span>
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition shadow-md"
          >
            Đăng xuất
          </button>
        </div>
      </div>
    </nav>
  );
}
