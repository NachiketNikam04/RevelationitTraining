"use client";

import React, { useEffect, useState } from "react";
import { motion, type Variants } from "framer-motion";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import Linkedin02Icon from "@hugeicons/core-free-icons/Linkedin02Icon";
import NewTwitterIcon from "@hugeicons/core-free-icons/NewTwitterIcon";

export interface Mentor {
  id: string | number;
  name: string;
  role: string;
  bio: string;
  skills: string[];
  image: string;
  linkedinUrl?: string;
  twitterUrl?: string;
}

const defaultMentors: Mentor[] = [
  {
    id: "mentor-1",
    name: "Sarah Jenkins",
    role: "Lead QA Automation Expert",
    bio: "10+ years of experience architecting enterprise test frameworks and mentoring SDETs at top tech firms.",
    skills: ["Selenium", "Java", "TestNG"],
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80",
    linkedinUrl: "https://linkedin.com",
    twitterUrl: "https://twitter.com",
  },
  {
    id: "mentor-2",
    name: "Arjun Mehta",
    role: "Performance Testing Specialist",
    bio: "Ex-FinTech QA Lead specializing in distributed system reliability, high-load JMeter benchmarks, and API automation.",
    skills: ["JMeter", "Postman", "Python"],
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80",
    linkedinUrl: "https://linkedin.com",
    twitterUrl: "https://twitter.com",
  },
  {
    id: "mentor-3",
    name: "Priyanka Roy",
    role: "Career & Placement Director",
    bio: "Over 8 years shaping QA careers, partnering with 250+ tech recruiters, and conducting rigorous mock interviews.",
    skills: ["Resume Building", "Mock Interviews", "Salary Negotiation"],
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800&auto=format&fit=crop&q=80",
    linkedinUrl: "https://linkedin.com",
    twitterUrl: "https://twitter.com",
  },
];

function MentorCard({ mentor }: { mentor: Mentor }) {
  return (
    <div className="relative group overflow-hidden rounded-2xl bg-gray-50 aspect-[4/5] cursor-pointer shadow-lg shadow-black/5 hover:shadow-2xl transition-all duration-300">
      {/* Mentor Image (Permanently Colorful) */}
      <Image
        src={mentor.image}
        alt={mentor.name}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover w-full h-full group-hover:scale-105 transition-all duration-500 ease-out"
      />

      {/* Persistent Bottom Gradient for constant legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

      {/* Default State Text (Bottom Aligned) */}
      <div className="absolute bottom-0 inset-x-0 p-6 z-10 transition-opacity duration-300 group-hover:opacity-0 pointer-events-none">
        <h3 className="text-[22px] font-bold leading-[1.3] text-white mb-1 tracking-tight">
          {mentor.name}
        </h3>
        <p className="text-brand-orange font-bold text-[14px]">
          {mentor.role}
        </p>
      </div>

      {/* Hover Reveal Content Panel (Slides Up From Bottom) */}
      <div className="absolute inset-x-0 bottom-0 z-20 p-6 bg-black/85 backdrop-blur-md translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out flex flex-col justify-end">
        <div>
          <h3 className="text-[22px] font-bold leading-[1.3] text-white mb-1 tracking-tight">
            {mentor.name}
          </h3>
          <p className="text-brand-orange font-bold text-[14px]">
            {mentor.role}
          </p>
        </div>

        <p className="text-gray-200 text-[15px] md:text-[16px] font-normal leading-[1.6] mt-2">
          {mentor.bio}
        </p>

        {/* Tech Stack Pills */}
        {mentor.skills && mentor.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {mentor.skills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[12px] font-bold uppercase tracking-wide"
              >
                {skill}
              </span>
            ))}
          </div>
        )}

        {/* Clickable Social Icons */}
        <div className="flex items-center gap-3 mt-4 pt-3 border-t border-white/15">
          {mentor.linkedinUrl && (
            <a
              href={mentor.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${mentor.name} on LinkedIn`}
              className="text-white hover:text-brand-blue transition-colors p-1"
            >
              <HugeiconsIcon icon={Linkedin02Icon} size={18} />
            </a>
          )}
          {/* {mentor.twitterUrl && (
            <a
              href={mentor.twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${mentor.name} on Twitter / X`}
              className="text-white hover:text-brand-blue transition-colors p-1"
            >
              <HugeiconsIcon icon={NewTwitterIcon} size={18} />
            </a>
          )} */}
        </div>
      </div>
    </div>
  );
}

export function Team({ mentorList }: { mentorList?: Mentor[] }) {
  const [mentors, setMentors] = useState<Mentor[]>(mentorList?.length ? mentorList : defaultMentors);

  useEffect(() => {
    if (mentorList && mentorList.length > 0) {
      setMentors(mentorList);
      return;
    }

    const fetchTeachers = async () => {
      try {
        const res = await fetch("/api/teachers");
        const data = await res.json();
        if (data.success && Array.isArray(data.teachers) && data.teachers.length > 0) {
          const mapped: Mentor[] = data.teachers.map((t: any) => {
            let skills: string[] = [];
            if (Array.isArray(t.skills)) {
              skills = t.skills;
            } else if (typeof t.skills === "string") {
              try {
                const parsed = JSON.parse(t.skills);
                skills = Array.isArray(parsed) ? parsed : t.skills.split(",").map((s: string) => s.trim()).filter(Boolean);
              } catch {
                skills = t.skills.split(",").map((s: string) => s.trim()).filter(Boolean);
              }
            }

            return {
              id: t.id,
              name: t.name,
              role: t.role,
              bio: t.bio || "",
              skills: skills,
              image: t.image_url,
              linkedinUrl: t.linkedin_url || undefined,
              twitterUrl: t.twitter_url || undefined,
            };
          });
          setMentors(mapped);
        }
      } catch (err) {
        console.warn("Could not load dynamic mentors, using default fallback:", err);
      }
    };

    fetchTeachers();
  }, [mentorList]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.15,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.65,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="bg-brand-bg py-12 md:py-15 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 text-brand-orange text-[13px] md:text-[14px] font-bold uppercase tracking-[0.2em]">
            <span>OUR MENTORS</span>
          </div>

          <h2 className="text-[36px] md:text-[44px] font-bold leading-[1.2] text-brand-dark tracking-tight">
            Meet Our <span className="text-brand-blue">Team</span>
          </h2>

          <p className="text-brand-muted max-w-2xl mx-auto mt-4 text-[16px] md:text-[18px] font-normal leading-[1.7]">
            Get to know the dedicated faculty and industry experts guiding your
            tech career.
          </p>
        </div>

        {/* Responsive 3-Column Grid with Scroll Stagger */}
        <motion.div
          key={mentors.length}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {mentors.map((mentor) => (
            <motion.div key={mentor.id} variants={cardVariants}>
              <MentorCard mentor={mentor} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
