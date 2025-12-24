// lib/mockCourses.ts
import { mockLessons } from "./mockData";

// Danh sách khóa học giả theo HV
export const mockCoursesByUser: Record<
  string,
  Array<{ maKhoaHoc: string; nguoiTao: string; hocVienCount: number }>
> = {
  hv_01: [
    { maKhoaHoc: "NODEJS101", nguoiTao: "gv_admin", hocVienCount: 6 },
    { maKhoaHoc: "REACT202", nguoiTao: "gv_admin", hocVienCount: 4 },
  ],
  hv_02: [
    { maKhoaHoc: "NODEJS101", nguoiTao: "gv_admin", hocVienCount: 6 },
    {
      maKhoaHoc: "MONGODB301",
      nguoiTao: "gv_admin",
      hocVienCount: 3,
    },
  ],
  hv_03: [
    { maKhoaHoc: "REACT202", nguoiTao: "gv_admin", hocVienCount: 4 },
    {
      maKhoaHoc: "MONGODB301",
      nguoiTao: "gv_admin",
      hocVienCount: 3,
    },
  ],
  hv_04: [
    { maKhoaHoc: "NODEJS101", nguoiTao: "gv_admin", hocVienCount: 6 },
  ],
  hv_05: [
    { maKhoaHoc: "REACT202", nguoiTao: "gv_admin", hocVienCount: 4 },
    { maKhoaHoc: "NODEJS101", nguoiTao: "gv_admin", hocVienCount: 6 },
    {
      maKhoaHoc: "MONGODB301",
      nguoiTao: "gv_admin",
      hocVienCount: 3,
    },
  ],
  hv_06: [
    {
      maKhoaHoc: "MONGODB301",
      nguoiTao: "gv_admin",
      hocVienCount: 3,
    },
  ],
};

// Mock lessons riêng theo maKhoaHoc (có thể khác nhau chút để demo)
export const mockLessonsByCourse: Record<string, typeof mockLessons> =
  {
    NODEJS101: mockLessons,
    REACT202: [
      ...mockLessons.slice(0, 3),
      {
        title: "Hooks nâng cao",
        description: "useReducer, useContext, custom hooks",
        videoUrl: "https://www.youtube.com/embed/1oY4R79V6dM",
        documentUrl: null,
        order: 4,
      },
    ],
    MONGODB301: [
      {
        title: "Giới thiệu MongoDB",
        description: "NoSQL vs SQL, cài đặt MongoDB",
        videoUrl: "https://www.youtube.com/embed/EXFSQ1oO8yY",
        documentUrl: "https://example.com/mongo-intro.pdf",
        order: 1,
      },
      // ... thêm vài lesson khác
    ],
  };
