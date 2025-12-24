// app/teacher/page.tsx
"use client";

import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import CourseCard from "@/components/CourseCard";
import { fetchWithToken } from "@/lib/api";
import toast from "react-hot-toast";

interface Course {
  maKhoaHoc: string;
  nguoiTao: string;
  hocVienCount: number;
}

export default function TeacherDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newMaKhoaHoc, setNewMaKhoaHoc] = useState("");

  useEffect(() => {
    if (!user) router.push("/");
    else if (user.role !== "GV") router.push("/student");

    fetchWithToken("/course/my-learning")
      .then((data) => {
        const formatted = (data.courses || []).map((c: any) => ({
          maKhoaHoc: c.maKhoaHoc,
          nguoiTao: c.nguoiTao?.taiKhoan || c.nguoiTao,
          hocVienCount: c.hocVienCount || 0,
        }));
        setCourses(formatted);
        setLoading(false);
      })
      .catch((err) => {
        toast.error(err.message);
        setLoading(false);
      });
  }, [user, router]);

  const handleCreateCourse = async () => {
    if (!newMaKhoaHoc.trim()) {
      toast.error("Vui lòng nhập mã khóa học");
      return;
    }

    const loadingToast = toast.loading("Đang tạo khóa học...");
    try {
      await fetchWithToken("/course", {
        maKhoaHoc: newMaKhoaHoc,
      });

      toast.dismiss(loadingToast);
      toast.success("Tạo khóa học thành công!");
      setNewMaKhoaHoc("");
      setShowCreateModal(false);
      // Reload danh sách
      window.location.reload();
    } catch (err: any) {
      toast.dismiss(loadingToast);
      toast.error(err.message || "Tạo khóa thất bại");
    }
  };

  if (!user) return null;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h1 className="text-4xl font-bold text-green-800">
                Quản lý khóa học
              </h1>
              <p className="text-lg text-gray-600 mt-2">
                Chào {user.username}! Bạn đang quản lý{" "}
                {courses.length} khóa học.
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-lg transition flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Tạo khóa học mới
            </button>
          </div>

          {/* Loading & list giống HV */}
          {loading && (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-600"></div>
              <p className="mt-6 text-gray-600 text-lg">
                Đang tải...
              </p>
            </div>
          )}

          {!loading && courses.length === 0 && (
            <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
              <p className="text-2xl text-gray-500 mb-4">
                Bạn chưa tạo khóa học nào
              </p>
              <p className="text-gray-400">
                Nhấn nút "Tạo khóa học mới" để bắt đầu
              </p>
            </div>
          )}

          {!loading && courses.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course) => (
                <div
                  key={course.maKhoaHoc}
                  onClick={() =>
                    router.push(`/teacher/${course.maKhoaHoc}`)
                  }
                >
                  <CourseCard course={course} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal tạo khóa */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Tạo khóa học mới
            </h2>
            <input
              type="text"
              value={newMaKhoaHoc}
              onChange={(e) => setNewMaKhoaHoc(e.target.value)}
              placeholder="Nhập mã khóa học (ví dụ: NODEJS_BASIC_02)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 mb-6"
            />
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewMaKhoaHoc("");
                }}
                className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition"
              >
                Hủy
              </button>
              <button
                onClick={handleCreateCourse}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
              >
                Tạo khóa học
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
