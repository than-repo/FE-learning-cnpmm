// components/LessonSidebar.tsx
"use client";

import { useState } from "react";

interface Lesson {
  title: string;
  order: number;
}

interface LessonSidebarProps {
  lessons: Lesson[];
  currentLessonIndex: number;
  onLessonSelect: (index: number) => void;
}

// components/LessonSidebar.tsx

export default function LessonSidebar({
  lessons,
  currentLessonIndex,
  onLessonSelect,
}: LessonSidebarProps) {
  return (
    <div className="w-80 bg-white border-l border-gray-200 h-screen fixed right-0 top-20 overflow-y-auto shadow-lg z-40">
      {/* 
         top-20 = 80px (chiều cao Navbar py-4 ~ 64px + shadow)
         z-40 < z-50 của Navbar → Navbar luôn trên cùng
      */}
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Nội dung khóa học
        </h2>
        <div className="space-y-2">
          {lessons.map((lesson, index) => (
            <button
              key={index}
              onClick={() => onLessonSelect(index)}
              className={`w-full text-left p-4 rounded-lg transition ${
                currentLessonIndex === index
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-gray-50 hover:bg-gray-100 text-gray-700"
              }`}
            >
              <div className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 font-bold ${
                    currentLessonIndex === index
                      ? "bg-white text-indigo-600"
                      : "bg-indigo-100 text-indigo-600"
                  }`}
                >
                  {lesson.order}
                </div>
                <span className="font-medium">{lesson.title}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
