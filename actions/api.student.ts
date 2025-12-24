// actions/api.student.ts
import { fetchWithToken } from "@/lib/api";

/**
 * Lấy danh sách khóa học mà học viên hiện tại đang tham gia
 * API: POST /api/course/my-learning
 */
export async function getMyCourses() {
  const data = await fetchWithToken("/course/my-learning");
  return data.courses; // Trả về mảng courses: [{ maKhoaHoc, nguoiTao, hocVienCount }, ...]
}

/**
 * Lấy chi tiết bài học của một khóa học theo course _id (ObjectId)
 * API: GET /api/detail-course/:courseId (thực tế backend dùng POST với body accessToken)
 * @param courseId - _id của Course trong MongoDB (ví dụ: "694bf236ced26e49e907b54b")
 */
export async function getCourseDetail(courseId: string) {
  const response = await fetch(
    `http://localhost:5554/api/detail-course/${courseId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        accessToken:
          typeof window !== "undefined"
            ? localStorage.getItem("accessToken")
            : null,
      }),
    }
  );

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: "Lỗi tải chi tiết khóa học" }));
    throw new Error(error.error || "Không thể tải chi tiết khóa học");
  }

  const data = await response.json();
  return data.detail; // { courseId, lessons: [...] }
}
