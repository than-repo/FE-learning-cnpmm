// app/teacher/page.tsx
"use client";

import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";

export default function TeacherDashboard() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/");
    } else if (user.role !== "GV") {
      router.push("/student");
    }
  }, [user, router]);

  if (!user) return null;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto p-8">
          <h1 className="text-4xl font-bold text-green-800 mb-6">
            Chào mừng Giáo vụ: {user.username}
          </h1>
          <div className="bg-white rounded-xl shadow-md p-8">
            <p className="text-xl text-gray-700 leading-relaxed">
              Đây là khu vực quản trị dành riêng cho Giáo vụ.
            </p>
            <p className="mt-4 text-gray-600">Sắp tới bạn có thể:</p>
            <ul className="mt-4 space-y-2 text-gray-700">
              <li className="flex items-center">
                <span className="mr-2">✅</span> Tạo khóa học mới
              </li>
              <li className="flex items-center">
                <span className="mr-2">✅</span> Thêm/sửa bài học
                (video, tài liệu)
              </li>
              <li className="flex items-center">
                <span className="mr-2">✅</span> Quản lý danh sách học
                viên
              </li>
              <li className="flex items-center">
                <span className="mr-2">✅</span> Xem thống kê khóa học
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
