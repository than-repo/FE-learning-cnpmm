// app/student/[maKhoaHoc]/page.tsx
"use client";

import { useAuth } from "@/components/AuthProvider";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import LessonSidebar from "@/components/LessonSidebar";
import LessonContent from "@/components/LessonContent";
import { fetchWithToken } from "@/lib/api";

interface Lesson {
  title: string;
  description?: string;
  videoUrl?: string;
  documentUrl?: string;
  order: number;
}

export default function CourseLearningPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const maKhoaHoc = params.maKhoaHoc as string;

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [courseTitle, setCourseTitle] = useState(maKhoaHoc);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);

  useEffect(() => {
    if (!user || user.role !== "HV") {
      router.push("/");
      return;
    }

    setLoading(true);
    setError(null);

    fetchWithToken("/course/my-learning")
      .then(async (data) => {
        console.log("my-learning data:", data);

        const courses = Array.isArray(data.courses)
          ? data.courses
          : [];
        const targetCourse = courses.find(
          (c: any) => c.maKhoaHoc === maKhoaHoc
        );

        if (!targetCourse) {
          throw new Error(
            "Bạn chưa được đăng ký khóa học này hoặc khóa học không tồn tại"
          );
        }

        setCourseTitle(targetCourse.maKhoaHoc);

        // Gọi API detail-course với course._id
        // Thay toàn bộ phần gọi detail bằng:
        const detailData = await fetchWithToken(
          `/detail-course/${targetCourse._id}/view`
        );

        const fetchedLessons: Lesson[] =
          detailData.detail?.lessons || [];

        fetchedLessons.sort(
          (a, b) => (a.order || 0) - (b.order || 0)
        );

        setLessons(fetchedLessons);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi tải chi tiết khóa học:", err);
        setError(err.message || "Có lỗi xảy ra khi tải khóa học");
        setLoading(false);
      });
  }, [user, router, maKhoaHoc]);

  if (!user) return null;

  const currentLesson = lessons[currentLessonIndex] || {
    title: "Chưa có bài học",
  };

  const sidebarLessons = lessons.map((lesson, idx) => ({
    title: lesson.title,
    order: lesson.order || idx + 1,
  }));

  return (
    <>
      <Navbar />
      <div className="pt-20 flex min-h-screen">
        {/* Main Content */}
        <div className="flex-1 pr-80 bg-gray-50">
          <div className="max-w-5xl mx-auto px-8 py-10">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">
                Khóa học:
              </h2>
              <h1 className="text-4xl font-bold text-indigo-700 mb-8">
                {courseTitle}
              </h1>

              {/* Loading */}
              {loading && (
                <div className="text-center py-20">
                  <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
                  <p className="mt-6 text-gray-600 text-lg">
                    Đang tải bài học...
                  </p>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="bg-red-50 border border-red-300 text-red-700 px-6 py-4 rounded-xl">
                  <strong>Lỗi:</strong> {error}
                </div>
              )}

              {/* Content */}
              {!loading && !error && lessons.length > 0 && (
                <LessonContent lesson={currentLesson} />
              )}

              {/* Empty lessons */}
              {!loading && !error && lessons.length === 0 && (
                <div className="text-center py-20 text-gray-500">
                  <p className="text-2xl">
                    Khóa học này chưa có bài học nào
                  </p>
                  <p className="mt-4">
                    Giáo vụ sẽ sớm cập nhật nội dung
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        {!loading && !error && lessons.length > 0 && (
          <LessonSidebar
            lessons={sidebarLessons}
            currentLessonIndex={currentLessonIndex}
            onLessonSelect={setCurrentLessonIndex}
          />
        )}
      </div>
    </>
  );
}
