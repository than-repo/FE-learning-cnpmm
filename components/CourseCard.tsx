// components/CourseCard.tsx
import Link from "next/link";

interface Course {
  maKhoaHoc: string;
  nguoiTao: string;
  hocVienCount: number;
}

export default function CourseCard({ course }: { course: Course }) {
  return (
    <Link href={`/student/${course.maKhoaHoc}`}>
      <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden cursor-pointer border border-gray-100">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-32 flex items-center justify-center">
          <div className="text-white text-4xl font-bold opacity-30">
            {course.maKhoaHoc}
          </div>
        </div>
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            {course.maKhoaHoc}
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Giảng viên:{" "}
            <span className="font-medium">{course.nguoiTao}</span>
          </p>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">
              {course.hocVienCount} học viên
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
              Đang học
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
