// app/student/page.tsx
"use client";

import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import CourseCard from "@/components/CourseCard";
import { fetchWithToken } from "@/lib/api";

interface Course {
  maKhoaHoc: string;
  nguoiTao: string;
  hocVienCount: number;
}

export default function StudentDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.push("/");
      return;
    }
    if (user.role !== "HV") {
      router.push("/teacher");
      return;
    }

    setLoading(true);
    setError(null);

    fetchWithToken("/course/my-learning")
      .then((data) => {
        console.log("API /my-learning response:", data); // Debug

        // Backend trả về: { role: "HV", courses: [...] }
        const rawCourses = Array.isArray(data.courses)
          ? data.courses
          : [];

        const formattedCourses: Course[] = rawCourses.map(
          (c: any) => ({
            maKhoaHoc: c.maKhoaHoc || "Unknown",
            nguoiTao:
              typeof c.nguoiTao === "object"
                ? c.nguoiTao.taiKhoan
                : c.nguoiTao || "gv_admin",
            hocVienCount: c.hocVienCount ?? 0,
          })
        );

        setCourses(formattedCourses);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi khi tải khóa học:", err);
        setError(err.message || "Không thể tải danh sách khóa học");
        setLoading(false);
      });
  }, [user, router]);

  if (!user) return null;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <h1 className="text-4xl font-bold text-blue-800 mb-3">
            Khóa học của tôi
          </h1>
          <p className="text-lg text-gray-600 mb-10">
            Chào {user.username}!{" "}
            {loading
              ? "Đang tải dữ liệu..."
              : `Bạn đang tham gia ${courses.length} khóa học.`}
          </p>

          {/* Loading */}
          {loading && (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
              <p className="mt-6 text-gray-600 text-lg">
                Đang tải khóa học...
              </p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="max-w-2xl mx-auto bg-red-50 border border-red-300 text-red-700 px-6 py-4 rounded-xl mb-8">
              <strong>Lỗi:</strong> {error}
            </div>
          )}

          {/* No courses */}
          {!loading && !error && courses.length === 0 && (
            <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
              <p className="text-2xl text-gray-500 mb-4">
                Bạn chưa được thêm vào khóa học nào
              </p>
              <p className="text-gray-400 text-lg">
                Hãy liên hệ giáo vụ (gv_admin) để được tham gia nhé!
              </p>
            </div>
          )}

          {/* List courses */}
          {!loading && !error && courses.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course) => (
                <CourseCard key={course.maKhoaHoc} course={course} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
