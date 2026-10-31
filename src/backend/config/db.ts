import { Pool, QueryResult, QueryResultRow } from "pg";

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://user:password@hostname/dbname?sslmode=require";

// Initialize PostgreSQL Connection Pool
export const pool = new Pool({
  connectionString,
  ssl:
    process.env.NODE_ENV === "production" || connectionString.includes("sslmode=require")
      ? { rejectUnauthorized: false }
      : false,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

// Handle idle client errors without crashing the server process
pool.on("error", (err: Error) => {
  console.error("[PostgreSQL Pool] Unexpected error on idle client:", err);
});

/**
 * Helper to run parameterized queries safely
 */
export async function query<T extends QueryResultRow = any>(
  text: string,
  params?: any[]
): Promise<QueryResult<T>> {
  const start = Date.now();
  const res = await pool.query<T>(text, params);
  const duration = Date.now() - start;

  if (process.env.NODE_ENV === "development") {
    console.log("[DB Query]", { text, duration: `${duration}ms`, rows: res.rowCount });
  }

  return res;
}

export default pool;

/**
 * Ensures required database schema and tables exist in NeonDB.
 */
export async function initDbSchema(): Promise<void> {
  const schemaQuery = `
    CREATE TABLE IF NOT EXISTS admins (
      id SERIAL PRIMARY KEY,
      username VARCHAR(50) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS inquiries (
      id SERIAL PRIMARY KEY,
      full_name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(50),
      course_interest VARCHAR(255),
      message TEXT,
      status VARCHAR(50) DEFAULT 'New',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS testimonials (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      company VARCHAR(255) NOT NULL,
      rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
      testimonial_text TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS companies (
      id SERIAL PRIMARY KEY,
      company_name VARCHAR(255),
      logo_url TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS teachers (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      role VARCHAR(255) NOT NULL,
      bio TEXT,
      skills JSONB,
      image_url TEXT NOT NULL,
      linkedin_url TEXT,
      twitter_url TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS blogs (
      id SERIAL PRIMARY KEY,
      slug VARCHAR(255) UNIQUE NOT NULL,
      title VARCHAR(255) NOT NULL,
      content TEXT NOT NULL,
      image_url TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS courses (
      id SERIAL PRIMARY KEY,
      slug VARCHAR(255) UNIQUE NOT NULL, 
      status VARCHAR(50) DEFAULT 'Published',
      
      -- Tab 1: Hero Section Fields
      subject VARCHAR(100),
      title VARCHAR(255) NOT NULL,
      short_description TEXT,
      long_description TEXT,
      projects_count VARCHAR(50),
      accreditation_text VARCHAR(255),
      duration_mode VARCHAR(100),
      next_batch_text VARCHAR(100),
      accelerate_heading VARCHAR(255),
      accelerate_description TEXT,
      accelerate_bullets JSONB,
      
      -- Tab 2: Course Overview Fields
      overview_eyebrow VARCHAR(100),
      overview_heading VARCHAR(255),
      overview_description TEXT,
      tech_stack JSONB,
      outcome_title VARCHAR(100),
      outcome_text TEXT,
      overview_image_url TEXT,
      overview_badge_line1 VARCHAR(100),
      overview_badge_line2 VARCHAR(100),
      
      -- Tab 3: Key Features Fields
      advantages_eyebrow VARCHAR(100),
      advantages_heading VARCHAR(255),
      advantages_description TEXT,
      six_key_features JSONB,

      -- Tab 4: Target Audiences Fields
      pathways_eyebrow VARCHAR(100),
      pathways_heading VARCHAR(255),
      tailored_pathways JSONB,

      -- Tab 5: Comparison Table Fields
      comparison_eyebrow VARCHAR(100),
      comparison_heading VARCHAR(255),
      comparison_description TEXT,
      comparison_table JSONB,

      -- Tab 6: Course Curriculum Fields
      syllabus_eyebrow VARCHAR(100),
      syllabus_heading VARCHAR(255),
      syllabus_description TEXT,
      syllabus_pdf_url TEXT,
      curriculum JSONB,
      
      -- Tab 7: Course Batches & Enrollment Fields
      batches_eyebrow VARCHAR(100),
      batches_heading VARCHAR(255),
      batches_description TEXT,
      batch_options JSONB,

      -- Course Card Info Fields
      category VARCHAR(100),
      card_image_url TEXT,
      placement_guarantee VARCHAR(100),
      card_features JSONB,

      -- Tab 8: Guidance & Mentorship Fields
      guidance_eyebrow VARCHAR(100),
      guidance_title VARCHAR(255),
      guidance_description TEXT,
      cert_eyebrow VARCHAR(100),
      cert_heading VARCHAR(255),
      cert_description TEXT,
      cert_image_url TEXT,
      cert_features JSONB,
      faqs JSONB,
      
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Fail-safe column additions for existing tables
    ALTER TABLE courses 
      ADD COLUMN IF NOT EXISTS short_description TEXT,
      ADD COLUMN IF NOT EXISTS long_description TEXT,
      ADD COLUMN IF NOT EXISTS projects_count VARCHAR(50),
      ADD COLUMN IF NOT EXISTS accreditation_text VARCHAR(255),
      ADD COLUMN IF NOT EXISTS next_batch_text VARCHAR(100),
      ADD COLUMN IF NOT EXISTS accelerate_heading VARCHAR(255),
      ADD COLUMN IF NOT EXISTS accelerate_description TEXT,
      ADD COLUMN IF NOT EXISTS accelerate_bullets JSONB,
      ADD COLUMN IF NOT EXISTS category VARCHAR(100),
      ADD COLUMN IF NOT EXISTS card_image_url TEXT,
      ADD COLUMN IF NOT EXISTS placement_guarantee VARCHAR(100),
      ADD COLUMN IF NOT EXISTS card_features JSONB,
      ADD COLUMN IF NOT EXISTS overview_eyebrow VARCHAR(100),
      ADD COLUMN IF NOT EXISTS overview_heading VARCHAR(255),
      ADD COLUMN IF NOT EXISTS overview_description TEXT,
      ADD COLUMN IF NOT EXISTS tech_stack JSONB,
      ADD COLUMN IF NOT EXISTS outcome_title VARCHAR(100),
      ADD COLUMN IF NOT EXISTS outcome_text TEXT,
      ADD COLUMN IF NOT EXISTS overview_image_url TEXT,
      ADD COLUMN IF NOT EXISTS overview_badge_line1 VARCHAR(100),
      ADD COLUMN IF NOT EXISTS overview_badge_line2 VARCHAR(100),
      ADD COLUMN IF NOT EXISTS advantages_eyebrow VARCHAR(100),
      ADD COLUMN IF NOT EXISTS advantages_heading VARCHAR(255),
      ADD COLUMN IF NOT EXISTS advantages_description TEXT,
      ADD COLUMN IF NOT EXISTS six_key_features JSONB,
      ADD COLUMN IF NOT EXISTS pathways_eyebrow VARCHAR(100),
      ADD COLUMN IF NOT EXISTS pathways_heading VARCHAR(255),
      ADD COLUMN IF NOT EXISTS tailored_pathways JSONB,
      ADD COLUMN IF NOT EXISTS comparison_eyebrow VARCHAR(100),
      ADD COLUMN IF NOT EXISTS comparison_heading VARCHAR(255),
      ADD COLUMN IF NOT EXISTS comparison_description TEXT,
      ADD COLUMN IF NOT EXISTS comparison_table JSONB,
      ADD COLUMN IF NOT EXISTS syllabus_eyebrow VARCHAR(100),
      ADD COLUMN IF NOT EXISTS syllabus_heading VARCHAR(255),
      ADD COLUMN IF NOT EXISTS syllabus_description TEXT,
      ADD COLUMN IF NOT EXISTS syllabus_pdf_url TEXT,
      ADD COLUMN IF NOT EXISTS curriculum JSONB,
      ADD COLUMN IF NOT EXISTS batches_eyebrow VARCHAR(100),
      ADD COLUMN IF NOT EXISTS batches_heading VARCHAR(255),
      ADD COLUMN IF NOT EXISTS batches_description TEXT,
      ADD COLUMN IF NOT EXISTS batch_options JSONB,
      ADD COLUMN IF NOT EXISTS guidance_eyebrow VARCHAR(100),
      ADD COLUMN IF NOT EXISTS guidance_title VARCHAR(255),
      ADD COLUMN IF NOT EXISTS guidance_description TEXT,
      ADD COLUMN IF NOT EXISTS cert_eyebrow VARCHAR(100),
      ADD COLUMN IF NOT EXISTS cert_heading VARCHAR(255),
      ADD COLUMN IF NOT EXISTS cert_description TEXT,
      ADD COLUMN IF NOT EXISTS cert_image_url TEXT,
      ADD COLUMN IF NOT EXISTS cert_features JSONB;

    -- =========================================================================
    -- STUDENT INTERVIEW SCHEDULING SYSTEM TABLES
    -- =========================================================================
    CREATE TABLE IF NOT EXISTS allowed_schedule_emails (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_allowed_schedule_emails_email 
      ON allowed_schedule_emails(email);

    CREATE TABLE IF NOT EXISTS schedule_otps (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) NOT NULL,
      otp_code VARCHAR(10) NOT NULL,
      expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_schedule_otps_email 
        FOREIGN KEY (email) 
        REFERENCES allowed_schedule_emails(email) 
        ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_schedule_otps_email 
      ON schedule_otps(email);
    CREATE INDEX IF NOT EXISTS idx_schedule_otps_expires_at 
      ON schedule_otps(expires_at);

    CREATE TABLE IF NOT EXISTS interview_bookings (
      id SERIAL PRIMARY KEY,
      student_name VARCHAR(255) NOT NULL,
      student_email VARCHAR(255) NOT NULL,
      company_name VARCHAR(255) NOT NULL,
      booking_date DATE NOT NULL,
      start_time TIME NOT NULL,
      end_time TIME NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_interview_bookings_student_email 
        FOREIGN KEY (student_email) 
        REFERENCES allowed_schedule_emails(email) 
        ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_interview_bookings_student_email 
      ON interview_bookings(student_email);
    CREATE INDEX IF NOT EXISTS idx_interview_bookings_slot 
      ON interview_bookings(booking_date, start_time, end_time);
  `;

  try {
    const client = await pool.connect();
    try {
      await client.query(schemaQuery);
      console.log("[Database] Schema initialized successfully with Core, Course, and Interview Scheduling tables.");

      // Auto-seed default testimonials if table is empty
      const testCountRes = await client.query("SELECT COUNT(*) FROM testimonials;");
      if (parseInt(testCountRes.rows[0].count, 10) === 0) {
        const seedQuery = "INSERT INTO testimonials (name, company, rating, testimonial_text) VALUES " +
          "('Sarah Jenkins', 'TechFlow', 5, 'The hands-on automation projects were game-changing. I walked into my interviews with actual code to show, not just theory.'), " +
          "('Rahul Mehta', 'NexaTech', 5, 'I stopped worrying about my non-IT background. The instructors broke down Java and Selenium so clearly that I was writing test scripts in weeks.'), " +
          "('Priya Sharma', 'FinScale', 5, 'The mock interviews were brutal but exactly what I needed. By the time I had my real HR round, I was completely fearless.'), " +
          "('Amit Patel', 'CloudWave', 5, 'Getting 100% placement support is not a gimmick here. The team actively pushed my resume until I secured my offer.'), " +
          "('David Chen', 'AutoCorp', 5, 'The 24/7 cloud lab access and real-time defect triage sessions gave me the confidence of a seasoned 3-year engineer.'), " +
          "('Neha Verma', 'GlobalSys', 5, 'From manual test design to building full CI/CD pipelines in Jenkins, Revelation IT covered every single question asked in my MNC interview.');";
        await client.query(seedQuery);
        console.log("[Database] Seeded initial testimonials.");
      }

      // Auto-seed default teachers/mentors if table is empty
      const teacherCountRes = await client.query("SELECT COUNT(*) FROM teachers;");
      if (parseInt(teacherCountRes.rows[0].count, 10) === 0) {
        const seedTeachersQuery = `
          INSERT INTO teachers (name, role, bio, skills, image_url, linkedin_url, twitter_url) VALUES 
          ('Sarah Jenkins', 'Lead QA Automation Expert', '10+ years of experience architecting enterprise test frameworks and mentoring SDETs at top tech firms.', '["Selenium", "Java", "TestNG"]', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80', 'https://linkedin.com', 'https://twitter.com'),
          ('Arjun Mehta', 'Performance Testing Specialist', 'Ex-FinTech QA Lead specializing in distributed system reliability, high-load JMeter benchmarks, and API automation.', '["JMeter", "Postman", "Python"]', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80', 'https://linkedin.com', 'https://twitter.com'),
          ('Priyanka Roy', 'Career & Placement Director', 'Over 8 years shaping QA careers, partnering with 250+ tech recruiters, and conducting rigorous mock interviews.', '["Resume Building", "Mock Interviews", "Salary Negotiation"]', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800&auto=format&fit=crop&q=80', 'https://linkedin.com', 'https://twitter.com');
        `;
        await client.query(seedTeachersQuery);
        console.log("[Database] Seeded initial teachers/mentors.");
      }

      // Auto-seed default blogs if table is empty
      const blogCountRes = await client.query("SELECT COUNT(*) FROM blogs;");
      if (parseInt(blogCountRes.rows[0].count, 10) === 0) {
        const seedBlogsQuery = `
          INSERT INTO blogs (slug, title, content, image_url) VALUES 
          (
            'cracking-cdac-ccat',
            'Cracking the CDAC C-CAT: A Complete Preparation Strategy',
            'A comprehensive roadmap to acing your exams, mastering the fundamentals, and securing your spot in the upcoming batch with expert tips and practice routines.

Preparing for the CDAC C-CAT exam requires a structured approach covering Section A (Quantitative Aptitude & Reasoning), Section B (C Programming, OOP Concepts, Data Structures, OS, and Networking), and Section C (Advanced Computing).

Start by building strong mental models in pointers, dynamic memory allocation, and time complexity. Solve standard data structure implementations from scratch rather than merely memorizing syntax.

Consistent mock tests and defect triage practice will give you the confidence to ace technical assessments and secure premium company placements with top tier packages.',
            'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&auto=format&fit=crop&q=80'
          ),
          (
            'the-future-of-qa-top-10-automation-testing-tools-to-master-in-2026',
            'The Future of QA: Top 10 Automation Testing Tools to Master in 2026',
            'A comprehensive breakdown of Playwright, Selenium 4, AI-driven test generators, and cloud CI/CD pipelines reshaping modern software quality assurance.

Modern QA engineers need more than just manual test case design. Modern product architectures require lightning-fast regression suites, robust cross-browser validation, and deep API integration checks before code reaches production.

Frameworks like Playwright and Selenium 4 offer seamless browser automation, auto-waiting mechanisms, and native parallel test execution across Chromium, Firefox, and WebKit engines.

Investing time into building end-to-end CI/CD pipelines with Jenkins and Docker ensures that your testing infrastructure scales smoothly with agile enterprise software release cycles.',
            'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80'
          ),
          (
            'manual-testing-to-automation-lead',
            'How I Transitioned from Manual Testing to Automation Lead in 6 Months',
            'A step-by-step personal journey of mastering Java, Selenium WebDriver, and CI/CD pipelines to accelerate your software engineering career.

Transitioning from manual verification to automated test engineering requires a solid foundation in core programming principles, test architecture design, and continuous integration.

By focusing on practical real-world frameworks, writing clean, maintainable automation scripts using the Page Object Model (POM), and mastering TestNG annotations, you position yourself as a high-value SDET in top product firms.

Continuous hands-on practice, mock technical interviews, and architecting live frameworks from scratch are the most dependable pillars to achieve your career breakthrough.',
            'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80'
          );
        `;
        await client.query(seedBlogsQuery);
        console.log("[Database] Seeded initial sample blogs.");
      }
  
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("[Database] Error initializing schema:", error);
    throw error;
  }
}
