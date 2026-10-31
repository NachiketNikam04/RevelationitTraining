import { NextResponse } from "next/server";
import { pool, initDbSchema } from "@/backend/config/db";

export async function GET() {
  try {
    // 1. Create Schema if not exists
    await initDbSchema();

    // 2. Exact Data Mapping
    const techStack = JSON.stringify([
      "End-to-End Manual Testing & Agile Jira",
      "Core Java & Object-Oriented Architecture",
      "Selenium 4 WebDriver & Page Object Model",
      "REST API Automation with Postman & REST Assured",
      "TestNG Parallel Execution & Extent Reports",
      "Git, GitHub & Jenkins CI/CD Pipelines"
    ]);

    const sixKeyFeatures = JSON.stringify([
      {
        iconName: "Award",
        title: "100% Placement Guarantee",
        description: "Direct referrals to our 40+ hiring partners and unlimited interviews until you secure your offer letter.",
        color: "text-brand-orange"
      },
      {
        iconName: "Code2",
        title: "Live Real-World Projects",
        description: "Build test frameworks for actual live web apps, banking APIs, and e-commerce platforms.",
        color: "text-brand-blue"
      },
      {
        iconName: "Users",
        title: "Industry Expert Trainers",
        description: "Learn directly from senior SDETs and QA leads with 10+ years of tier-1 tech enterprise experience.",
        color: "text-emerald-600"
      },
      {
        iconName: "FileText",
        title: "Resume & LinkedIn Building",
        description: "ATS-optimized resumes, GitHub test portfolios, and personalized LinkedIn profiles to attract top recruiters.",
        color: "text-purple-600"
      },
      {
        iconName: "Briefcase",
        title: "Mock HR & Tech Interviews",
        description: "1-on-1 mock interviews, coding tests, and behavioral drills with instant constructive feedback.",
        color: "text-amber-600"
      },
      {
        iconName: "Headphones",
        title: "24/7 Lab & Doubt Access",
        description: "Round-the-clock code review assistance and dedicated discord/chat groups with mentors.",
        color: "text-rose-600"
      }
    ]);

    const pathways = JSON.stringify([
      {
        iconName: "GraduationCap",
        badge: "Fast-Track Entry",
        title: "Recent Graduates",
        subtitle: "BE, B.Tech, BCA, MCA, B.Sc & M.Sc Students",
        description: "Break into the IT sector with high-demand automation skills that stand out among thousands of applicants. No prior corporate experience required.",
        highlights: [
          "Bridge the college-to-corporate skills gap",
          "Build a GitHub portfolio of real frameworks",
          "Guaranteed campus-equivalent placement support"
        ]
      },
      {
        iconName: "RefreshCw",
        badge: "Zero Coding Required",
        title: "Career Switchers",
        subtitle: "Non-IT & Support Professionals",
        description: "Transition smoothly from BPO, sales, operations, or non-technical domains into high-paying QA roles with structured, beginner-friendly Java coaching.",
        highlights: [
          "Step-by-step foundation from absolute zero",
          "Learn how to explain your career transition",
          "Salary jump of up to 150% into IT"
        ]
      },
      {
        iconName: "Building2",
        badge: "Skill & Salary Upgrade",
        title: "Manual QA Testers",
        subtitle: "Experienced Manual / Functional Testers",
        description: "Upgrade your technical profile from manual test execution to full-stack Automation SDET with Selenium, API testing, and CI/CD pipelines.",
        highlights: [
          "Transition from Manual to SDET / Lead QA",
          "Master Java, Selenium 4, and REST Assured",
          "Qualify for senior automation job profiles"
        ]
      }
    ]);

    const comparisons = JSON.stringify([
      {
        feature: "Placement Commitment",
        revelation: "100% Placement Guarantee with direct corporate referrals",
        others: "Job notifications / forward resume only"
      },
      {
        feature: "Curriculum Modernity",
        revelation: "2026 Tech Stack (Selenium 4, REST Assured, Jenkins CI/CD)",
        others: "Outdated Selenium 2/3 and manual-heavy content"
      },
      {
        feature: "Mentorship Model",
        revelation: "1-on-1 personal code reviews & personalized coaching",
        others: "Crowded 100+ batches with generic video playback"
      },
      {
        feature: "Project Quality",
        revelation: "Enterprise Banking & E-Commerce Live Architectures",
        others: "Toy login pages and static demo forms"
      },
      {
        feature: "Mock Interview Drills",
        revelation: "Unlimited 1-on-1 technical & HR drill downs until hired",
        others: "1 single generic mock test"
      },
      {
        feature: "Post-Job Support",
        revelation: "Real-job technical guidance during your first 90 days",
        others: "Support ends immediately upon course completion"
      }
    ]);

    const curriculum = JSON.stringify([
      {
        number: "01",
        title: "Manual Testing Fundamentals & Agile QA",
        duration: "Weeks 1 - 3",
        description: "Master the complete software testing lifecycle, defect management, and corporate Agile Scrum practices from ground up.",
        topics: [
          "Software Development Life Cycle (SDLC) vs. Software Testing Life Cycle (STLC)",
          "Agile Scrum Framework: Sprint Planning, Daily Standups, Retrospectives",
          "Test Planning: Test Strategy, Test Scenarios & Comprehensive Test Case Writing",
          "Functional, Non-Functional, Regression, Smoke, Sanity & Boundary Value Testing",
          "Bug Lifecycle: Severity vs. Priority & Defect Management in Atlassian Jira",
          "Real-Time Project: End-to-end Test Suite Creation for an E-Commerce Platform"
        ]
      },
      {
        number: "02",
        title: "Core Java for QA & Automation Engineers",
        duration: "Weeks 4 - 6",
        description: "Designed specifically for beginners to build solid Object-Oriented Programming skills required for automation test scripting.",
        topics: [
          "Java Basics: JVM, JRE, JDK, Data Types, Control Statements & Loops",
          "OOPs Concepts: Inheritance, Polymorphism, Abstraction & Encapsulation",
          "Java Collections Framework: List, Set, Map, ArrayList, HashMap & Iterators",
          "Exception Handling, File I/O & Apache POI for Excel Test Data Reading",
          "String Manipulations, Regular Expressions & Memory Management",
          "Real-Time Project: Data Parsing & Automated Test Data Generation in Java"
        ]
      },
      {
        number: "03",
        title: "Selenium WebDriver 4 & Framework Architecture",
        duration: "Weeks 7 - 9",
        description: "Build enterprise-grade test automation frameworks using Selenium WebDriver, TestNG, and Page Object Model (POM).",
        topics: [
          "Selenium 4 Architecture, WebDriver API & Dynamic XPath/CSS Locators",
          "Handling Dynamic Waits, Alerts, Popups, Frames, Multi-Tabs & Action Chains",
          "TestNG Framework: Annotations, Assertions, DataProviders & Parallel Test Execution",
          "Page Object Model (POM) Design Pattern & Page Factory Implementation",
          "Data-Driven & Hybrid Framework Architecture from Scratch",
          "Real-Time Project: Hybrid Automation Suite with Extent Reports & Cross-Browser Grid"
        ]
      },
      {
        number: "04",
        title: "API Testing with Postman & REST Assured",
        duration: "Weeks 10 - 11",
        description: "Validate microservices and backend systems through manual API exploration and automated Java REST Assured test suites.",
        topics: [
          "Web Services & REST Architecture: HTTP Methods (GET, POST, PUT, DELETE) & Status Codes",
          "Postman: Environment Variables, Collections, Pre-request Scripts & Test Assertions",
          "REST Assured Library: BDD Syntax (given/when/then) & JSON Path Parsing",
          "Serialization & Deserialization with Jackson / GSON POJO Classes",
          "Authentication Mechanisms: Bearer Tokens, API Keys & OAuth 2.0",
          "Real-Time Project: Banking & Payment Gateway REST API Automated Regression Suite"
        ]
      },
      {
        number: "05",
        title: "CI/CD, Version Control & DevOps Integration",
        duration: "Week 12",
        description: "Integrate automated test suites into modern Continuous Integration / Continuous Deployment (CI/CD) pipelines.",
        topics: [
          "Git & GitHub: Branching Strategy, Commits, Pull Requests & Merge Conflict Resolution",
          "Maven Build Tool: Dependencies Management, plugins & pom.xml Optimization",
          "Jenkins CI/CD: Automated Trigger Jobs, Parameterized Builds & Scheduled Runs",
          "Allure Reporting & Automated Email / Slack Notification Webhooks",
          "ISTQB Certification Preparation & Real-Job Deployment Support",
          "Capstone Project: Full CI/CD Test Pipeline Execution with Live GitHub Triggers"
        ]
      }
    ]);

        const batchOptions = JSON.stringify([
      {
        id: "weekday-online",
        name: "Weekday Batch",
        type: "Live Online (Zoom)",
        timing: "Mon - Fri • 7:30 AM or 8:00 PM IST",
        duration: "3 Months (1.5 hrs/day)",
        badge: "Fastest Progression",
        popular: false,
        description: "Ideal for graduates and job seekers dedicated to fast-tracking their placement within 90 days."
      },
      {
        id: "weekend-online",
        name: "Weekend Batch",
        type: "Live Online (Zoom)",
        timing: "Sat & Sun • 10:00 AM - 1:30 PM IST",
        duration: "3.5 Months (3.5 hrs/day)",
        badge: "For Working Pros",
        popular: false,
        description: "Tailored for working professionals who want to upskill without disrupting their weekly work schedule."
      },
      {
        id: "offline-pune",
        name: "Classroom Batch",
        type: "Offline Pune Campus",
        timing: "Mon - Fri • Morning / Afternoon Batches",
        duration: "3 Months • In-Person Labs",
        badge: "⭐ Popular in Pune",
        popular: true,
        description: "Hands-on lab training at our Pimpri-Chinchwad / Pune campus with direct face-to-face mentor instruction."
      }
    ]);

    const certFeatures = JSON.stringify([
      {
        title: "Verifiable Digital Credential",
        desc: "Includes a unique certificate ID and QR code for one-click verification by tech recruiters."
      },
      {
        title: "ISTQB® Syllabus Alignment",
        desc: "Prepares you to ace the ISTQB Certified Tester Foundation Level (CTFL) exam on your first attempt."
      },
      {
        title: "Direct LinkedIn & ATS Integration",
        desc: "Easily add the certificate to your LinkedIn profile and resume to stand out in corporate applicant pools."
      }
    ]);

    const cardFeatures = JSON.stringify([
      "Live Corporate Projects",
      "1-on-1 Mock Interviews",
      "Resume & ATS Optimization",
      "Dedicated Placement Cell",
    ]);

    // 3. Upsert Database Record
    const insertQuery = `
      INSERT INTO courses (
        slug, subject, title, short_description, long_description, projects_count, accreditation_text, duration_mode, 
        tech_stack, six_key_features, tailored_pathways, comparison_table, curriculum, batches_eyebrow, batches_heading, batches_description, batch_options, guidance_eyebrow, guidance_title, 
        guidance_description, cert_eyebrow, cert_heading, cert_description, cert_features,
        category, card_image_url, placement_guarantee, card_features
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28)
      ON CONFLICT (slug) DO UPDATE SET
        subject = EXCLUDED.subject,
        title = EXCLUDED.title,
        short_description = EXCLUDED.short_description,
        long_description = EXCLUDED.long_description,
        projects_count = EXCLUDED.projects_count,
        accreditation_text = EXCLUDED.accreditation_text,
        duration_mode = EXCLUDED.duration_mode,
        tech_stack = EXCLUDED.tech_stack,
        six_key_features = EXCLUDED.six_key_features,
        tailored_pathways = EXCLUDED.tailored_pathways,
        comparison_table = EXCLUDED.comparison_table,
        curriculum = EXCLUDED.curriculum,
        batches_eyebrow = EXCLUDED.batches_eyebrow,
        batches_heading = EXCLUDED.batches_heading,
        batches_description = EXCLUDED.batches_description,
        batch_options = EXCLUDED.batch_options,
        guidance_eyebrow = EXCLUDED.guidance_eyebrow,
        guidance_title = EXCLUDED.guidance_title,
        guidance_description = EXCLUDED.guidance_description,
        cert_eyebrow = EXCLUDED.cert_eyebrow,
        cert_heading = EXCLUDED.cert_heading,
        cert_description = EXCLUDED.cert_description,
        cert_features = EXCLUDED.cert_features,
        category = EXCLUDED.category,
        card_image_url = EXCLUDED.card_image_url,
        placement_guarantee = EXCLUDED.placement_guarantee,
        card_features = EXCLUDED.card_features
      RETURNING id, slug, title;
    `;

    const result = await pool.query(insertQuery, [
      "software-testing-bootcamp",
      "#1 RATED QA BOOTCAMP IN PUNE & ONLINE",
      "Complete Software Testing & Automation Bootcamp",
      "Master manual testing, Java, Selenium, and API testing. Go from absolute beginner to job-ready QA Automation Engineer with live corporate projects and interview prep.",
      "Traditional college degrees and generic crash courses leave major gaps in practical QA skills. This bootcamp bridges that divide by immersing you in real corporate workflows, enterprise frameworks, and defect lifecycles from day one.",
      "10+ Real-World",
      "ISTQB Aligned",
      "3 Months • Live Online",
      techStack,
      sixKeyFeatures,
      pathways,
      comparisons,
      curriculum,
      "BATCH TIMINGS & ENROLLMENT",
      "Choose the batch that fits your schedule.",
      "Flexible options for students, job seekers, and working professionals.",
      batchOptions,
      "1-ON-1 CAREER GUIDANCE",
      "Not sure if Software Testing is right for you?",
      "Get a free 1-on-1 profile evaluation with our Chief QA Architect. We will review your background, assess your aptitude, and recommend the fastest roadmap to break into IT.",
      "ACCREDITED & RECOGNIZED",
      "Industry-Recognized QA Certification.",
      "Upon passing our capstone automation framework review and comprehensive mock technical panel, you receive a tamper-proof digital certificate that hiring managers instantly respect.",
      certFeatures,
      "Software Testing & Automation",
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&auto=format&fit=crop&q=80",
      "100% Placement Guarantee",
      cardFeatures,
    ]);

    return NextResponse.json({
      success: true,
      message: "Course data seeded successfully!",
      course: result.rows[0],
    });
  } catch (error: any) {
    console.error("[API /api/admin/seed-courses] Error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to seed database" },
      { status: 500 }
    );
  }
}
