// components/LessonContent.tsx
"use client";

import { useState } from "react";

interface Lesson {
  title: string;
  videoUrl?: string | null;
  documentUrl?: string | null;
}

interface LessonContentProps {
  lesson: Lesson;
}

export default function LessonContent({
  lesson,
}: LessonContentProps) {
  const [activeTab, setActiveTab] = useState<
    "video" | "document" | "quiz"
  >("video");
  // Thêm hàm này vào đầu file LessonContent.tsx (sau import)
  function cleanYouTubeEmbedUrl(url: string): string {
    if (!url) return "";

    // Trường hợp 1: watch?v=
    if (url.includes("watch?v=")) {
      const videoId = url.split("watch?v=")[1]?.split("&")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }

    // Trường hợp 2: youtu.be/
    if (url.includes("youtu.be/")) {
      const videoId = url.split("youtu.be/")[1]?.split("?")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }

    // Trường hợp đã là embed
    if (url.includes("youtube.com/embed/")) {
      return url.split("?")[0]; // bỏ parameter thừa
    }

    return url; // fallback
  }
  return (
    <div className="pb-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        {lesson.title}
      </h1>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-8">
        <button
          onClick={() => setActiveTab("video")}
          className={`px-6 py-3 font-medium transition ${
            activeTab === "video"
              ? "text-indigo-600 border-b-2 border-indigo-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Video
        </button>
        <button
          onClick={() => setActiveTab("document")}
          className={`px-6 py-3 font-medium transition ${
            activeTab === "document"
              ? "text-indigo-600 border-b-2 border-indigo-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Tài liệu
        </button>
        <button
          onClick={() => setActiveTab("quiz")}
          className={`px-6 py-3 font-medium transition ${
            activeTab === "quiz"
              ? "text-indigo-600 border-b-2 border-indigo-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Quiz
        </button>
      </div>

      {/* Content */}
      <div className="bg-gray-50 rounded-xl p-4 min-h-96">
        {activeTab === "video" && lesson.videoUrl && (
          <div
            className="relative w-full"
            style={{ paddingBottom: "56.25%" }}
          >
            <iframe
              src={cleanYouTubeEmbedUrl(lesson.videoUrl)}
              title={lesson.title}
              allowFullScreen
              className="absolute inset-0 w-full h-full rounded-lg shadow-inner"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            ></iframe>
          </div>
        )}

        {activeTab === "video" && !lesson.videoUrl && (
          <p className="text-center text-gray-500 py-20">
            Chưa có video cho bài học này.
          </p>
        )}

        {activeTab === "document" && lesson.documentUrl && (
          <div className="text-center py-10">
            <a
              href={lesson.documentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Tải tài liệu (PDF)
            </a>
          </div>
        )}

        {activeTab === "document" && lesson.documentUrl && (
          <div className="w-full h-screen max-h-screen">
            {lesson.documentUrl.includes("drive.google.com") ? (
              // Xử lý đặc biệt Google Drive: chuyển sang preview embed
              <iframe
                src={
                  lesson.documentUrl
                    .replace("/view", "/preview")
                    .replace("usp=sharing", "") // cleanup
                }
                className="w-full h-full rounded-lg border-0"
                allow="autoplay"
                title="Tài liệu Google Drive"
              ></iframe>
            ) : lesson.documentUrl.endsWith(".pdf") ? (
              // Nếu là PDF trực tiếp → embed luôn
              <iframe
                src={lesson.documentUrl}
                className="w-full h-full rounded-lg border-0"
                title="Tài liệu PDF"
              ></iframe>
            ) : (
              // Các link khác → mở tab mới với nút
              <div className="text-center py-20">
                <p className="text-lg text-gray-600 mb-8">
                  Tài liệu được lưu trữ bên ngoài. Click nút bên dưới
                  để xem.
                </p>
                <a
                  href={lesson.documentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition shadow-lg"
                >
                  <svg
                    className="w-6 h-6 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Mở tài liệu
                </a>
              </div>
            )}
          </div>
        )}

        {activeTab === "document" && !lesson.documentUrl && (
          <div className="text-center py-20">
            <p className="text-xl text-gray-500">
              Chưa có tài liệu bổ sung cho bài học này.
            </p>
          </div>
        )}

        {activeTab === "quiz" && (
          <div className="text-center py-20">
            <p className="text-xl text-gray-600 mb-8">
              Tính năng Quiz đang được phát triển...
            </p>
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-32 h-32 mx-auto" />
          </div>
        )}
      </div>
    </div>
  );
}
