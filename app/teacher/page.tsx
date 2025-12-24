// app/student/page.tsx
"use client";

import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";

export default function StudentDashboard() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/");
    } else if (user.role !== "HV") {
      router.push("/teacher");
    }
  }, [user, router]);

  if (!user) return null;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto p-8">
          <h1 className="text-4xl font-bold text-blue-800 mb-6">
            Chào mừng Học viên: {user.username}
          </h1>
          <div className="bg-white rounded-xl shadow-md p-8">
            <p className="text-xl text-gray-700 leading-relaxed">
              Chào mừng bạn đến với không gian học tập cá nhân!
            </p>
            <p className="mt-4 text-gray-600">Sắp tới bạn có thể:</p>
            <ul className="mt-4 space-y-2 text-gray-700">
              <li className="flex items-center">
                <span className="mr-2">📚</span> Xem danh sách khóa
                học đã đăng ký
              </li>
              <li className="flex items-center">
                <span className="mr-2">▶️</span> Xem video bài giảng
              </li>
              <li className="flex items-center">
                <span className="mr-2">📄</span> Tải tài liệu học tập
              </li>
              <li className="flex items-center">
                <span className="mr-2">⏱️</span> Theo dõi tiến độ học
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
