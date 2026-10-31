"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Edit2, Loader2, BookOpen } from "lucide-react";

export const dynamic = "force-dynamic";

interface CourseSummary {
  id: number;
  title: string;
  subject: string;
  slug: string;
  status: string;
  created_at: string;
}

export default function CoursesManagementPage() {
  const [courses, setCourses] = useState<CourseSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await fetch("/api/admin/courses");
      if (res.ok) {
        const data = await res.json();
        setCourses(data.courses || []);
      }
    } catch (error) {
      console.error("Failed to load courses", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-orange/10 text-brand-orange text-[11px] font-bold uppercase tracking-wider rounded-full mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Admin Module</span>
          </div>
          <h1 className="text-[28px] font-bold text-brand-dark">Courses Management</h1>
          <p className="text-brand-muted text-[14px] mt-1">Add, update, or edit curriculum and course offerings.</p>
        </div>
        
        {/* We will route this to a "new" ID to trigger the creation flow later */}
        <Link 
          href="/dashboard/courses/new" 
          className="bg-brand-dark text-white px-6 py-3 rounded-xl font-bold text-[14px] hover:bg-black transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Course</span>
        </Link>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-[1.5rem] shadow-sm border border-gray-200 overflow-hidden min-h-[400px] relative">
        {isLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-brand-muted">
            <Loader2 className="w-8 h-8 animate-spin mb-4 text-brand-orange" />
            <p className="text-[14px] font-semibold">Loading courses...</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100">
              <BookOpen className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-[18px] font-bold text-brand-dark mb-2">No Courses Found</h3>
            <p className="text-brand-muted text-[14px] max-w-sm mb-6">Your course catalog is currently empty. Create your first course to start building the curriculum.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100">
                  <th className="px-6 py-4 text-[12px] font-bold uppercase tracking-wider text-brand-muted">Course Details</th>
                  <th className="px-6 py-4 text-[12px] font-bold uppercase tracking-wider text-brand-muted">Slug (URL)</th>
                  <th className="px-6 py-4 text-[12px] font-bold uppercase tracking-wider text-brand-muted">Status</th>
                  <th className="px-6 py-4 text-[12px] font-bold uppercase tracking-wider text-brand-muted text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {courses.map((course) => (
                  <tr key={course.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-[15px] font-bold text-brand-dark">{course.title}</p>
                      <p className="text-[13px] text-brand-muted mt-0.5">{course.subject}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[13px] text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded-md">/{course.slug}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide ${
                        course.status === 'Published' 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {course.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link 
                        href={`/dashboard/courses/${course.id}`}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-50 text-brand-dark hover:bg-brand-blue hover:text-white transition-colors border border-gray-200 hover:border-brand-blue"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}