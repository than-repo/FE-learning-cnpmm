// app/teacher/[maKhoaHoc]/page.tsx
"use client";

import { useAuth } from "@/components/AuthProvider";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { fetchWithToken } from "@/lib/api";
import toast from "react-hot-toast";

interface Lesson {
  title: string;
  description?: string;
  videoUrl?: string;
  documentUrl?: string;
  order: number;
}

interface Student {
  username: string;
}

export default function TeacherCourseDetail() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const maKhoaHoc = params.maKhoaHoc as string;

  const [activeTab, setActiveTab] = useState<"lessons" | "students">(
    "lessons"
  );
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  // Form thêm lesson
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonVideoUrl, setLessonVideoUrl] = useState("");
  const [lessonDocumentUrl, setLessonDocumentUrl] = useState("");

  // Form thêm học viên
  const [studentUsername, setStudentUsername] = useState("");

  // Lấy _id course từ my-learning
  const [courseId, setCourseId] = useState<string | null>(null);

  useEffect(() => {
    if (!user || user.role !== "GV") {
      router.push("/");
      return;
    }

    setLoading(true);

    fetchWithToken("/course/my-learning")
      .then(async (data) => {
        const courses = Array.isArray(data.courses)
          ? data.courses
          : [];
        const targetCourse = courses.find(
          (c: any) => c.maKhoaHoc === maKhoaHoc
        );

        if (!targetCourse) {
          toast.error("Không tìm thấy khóa học");
          router.push("/teacher");
          return;
        }

        setCourseId(targetCourse._id);

        // Lấy danh sách học viên từ targetCourse (nếu backend trả hocVien là array username)
        // Hiện tại backend chỉ trả hocVienCount → ta sẽ gọi API riêng nếu cần, tạm để mock
        // Hoặc giả sử backend trả thêm hocVien: [username] → dùng sau

        // Lấy lessons
        const detailData = await fetchWithToken(
          `/detail-course/${targetCourse._id}/view`
        );

        const fetchedLessons = detailData.detail?.lessons || [];
        fetchedLessons.sort(
          (a: any, b: any) => (a.order || 0) - (b.order || 0)
        );
        setLessons(fetchedLessons);

        // Mock danh sách học viên (vì backend chưa trả username)
        // Sau này thay bằng API hoặc từ targetCourse.hocVien nếu có
        setStudents([
          { username: "hv_01" },
          { username: "hv_02" },
          { username: "hv_03" },
          { username: "hv_04" },
          { username: "hv_05" },
          { username: "hv_06" },
        ]);

        setLoading(false);
      })
      .catch((err) => {
        toast.error(err.message);
        setLoading(false);
      });
  }, [user, router, maKhoaHoc]);

  const handleAddLesson = async () => {
    if (!lessonTitle.trim()) {
      toast.error("Vui lòng nhập tiêu đề bài học");
      return;
    }

    if (!courseId) return;

    const loadingToast = toast.loading("Đang thêm bài học...");
    try {
      await fetchWithToken(`/detail-course/${courseId}/lesson`, {
        title: lessonTitle,
        description: "",
        videoUrl: lessonVideoUrl || null,
        documentUrl: lessonDocumentUrl || null,
        order: lessons.length + 1,
      });

      toast.dismiss(loadingToast);
      toast.success("Thêm bài học thành công!");
      setLessonTitle("");
      setLessonVideoUrl("");
      setLessonDocumentUrl("");
      // Reload lessons
      window.location.reload();
    } catch (err: any) {
      toast.dismiss(loadingToast);
      toast.error(err.message || "Thêm bài học thất bại");
    }
  };

  const handleAddStudent = async () => {
    if (!studentUsername.trim()) {
      toast.error("Vui lòng nhập username học viên");
      return;
    }

    const loadingToast = toast.loading("Đang thêm học viên...");
    try {
      await fetchWithToken("/course/add-student", {
        maKhoaHoc,
        studentUsername,
      });

      toast.dismiss(loadingToast);
      toast.success(`Đã thêm ${studentUsername} vào khóa học`);
      setStudentUsername("");
      setStudents([...students, { username: studentUsername }]);
    } catch (err: any) {
      toast.dismiss(loadingToast);
      toast.error(err.message || "Thêm học viên thất bại");
    }
  };

  const handleRemoveStudent = async (username: string) => {
    if (!confirm(`Xóa ${username} khỏi khóa học?`)) return;

    const loadingToast = toast.loading("Đang xóa học viên...");
    try {
      await fetchWithToken("/course/remove-student", {
        maKhoaHoc,
        studentUsername: username,
      });

      toast.dismiss(loadingToast);
      toast.success(`Đã xóa ${username}`);
      setStudents(students.filter((s) => s.username !== username));
    } catch (err: any) {
      toast.dismiss(loadingToast);
      toast.error(err.message || "Xóa thất bại");
    }
  };

  if (!user) return null;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <h1 className="text-4xl font-bold text-green-800 mb-2">
            Quản lý khóa học: {maKhoaHoc}
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Giáo vụ: {user.username}
          </p>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-8">
            <button
              onClick={() => setActiveTab("lessons")}
              className={`px-8 py-4 font-medium text-lg transition ${
                activeTab === "lessons"
                  ? "text-green-600 border-b-4 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Bài học ({lessons.length})
            </button>
            <button
              onClick={() => setActiveTab("students")}
              className={`px-8 py-4 font-medium text-lg transition ${
                activeTab === "students"
                  ? "text-green-600 border-b-4 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Học viên ({students.length})
            </button>
          </div>

          {loading && (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-600"></div>
              <p className="mt-6 text-gray-600 text-lg">
                Đang tải...
              </p>
            </div>
          )}

          {!loading && activeTab === "lessons" && (
            <div>
              <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Thêm bài học mới
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input
                    type="text"
                    value={lessonTitle}
                    onChange={(e) => setLessonTitle(e.target.value)}
                    placeholder="Tiêu đề bài học (bắt buộc)"
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <input
                    type="url"
                    value={lessonVideoUrl}
                    onChange={(e) =>
                      setLessonVideoUrl(e.target.value)
                    }
                    placeholder="Link video YouTube (tùy chọn)"
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <input
                    type="url"
                    value={lessonDocumentUrl}
                    onChange={(e) =>
                      setLessonDocumentUrl(e.target.value)
                    }
                    placeholder="Link tài liệu Google Drive (tùy chọn)"
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <button
                    onClick={handleAddLesson}
                    className="md:col-span-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition shadow"
                  >
                    Thêm bài học
                  </button>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Danh sách bài học
              </h2>
              {lessons.length === 0 ? (
                <p className="text-center text-gray-500 py-10">
                  Chưa có bài học nào
                </p>
              ) : (
                <div className="space-y-4">
                  {lessons.map((lesson, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-lg shadow p-6 flex justify-between items-center"
                    >
                      <div>
                        <h3 className="text-xl font-semibold">
                          {lesson.order}. {lesson.title}
                        </h3>
                        {lesson.videoUrl && (
                          <p className="text-sm text-blue-600 mt-1">
                            Có video
                          </p>
                        )}
                        {lesson.documentUrl && (
                          <p className="text-sm text-green-600 mt-1">
                            Có tài liệu
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {!loading && activeTab === "students" && (
            <div>
              <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Thêm học viên
                </h2>
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={studentUsername}
                    onChange={(e) =>
                      setStudentUsername(e.target.value)
                    }
                    placeholder="Nhập username học viên (ví dụ: hv_07)"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <button
                    onClick={handleAddStudent}
                    className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition"
                  >
                    Thêm
                  </button>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Danh sách học viên
              </h2>
              {students.length === 0 ? (
                <p className="text-center text-gray-500 py-10">
                  Chưa có học viên nào
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {students.map((student) => (
                    <div
                      key={student.username}
                      className="bg-white rounded-lg shadow p-6 flex justify-between items-center"
                    >
                      <span className="font-medium text-lg">
                        {student.username}
                      </span>
                      <button
                        onClick={() =>
                          handleRemoveStudent(student.username)
                        }
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition text-sm"
                      >
                        Xóa
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
