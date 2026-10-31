--
-- PostgreSQL database dump
--

\restrict ye3LIlDuGXX9s7yMoaeJtlwiutsEfIbQ3ZyujJWhUiDbVZkK4RFk2HeaGBP2e4E

-- Dumped from database version 18.6 (4e955f5)
-- Dumped by pg_dump version 18.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: admins; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.admins (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    password_hash character varying(255) NOT NULL
);


ALTER TABLE public.admins OWNER TO neondb_owner;

--
-- Name: admins_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.admins_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.admins_id_seq OWNER TO neondb_owner;

--
-- Name: admins_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.admins_id_seq OWNED BY public.admins.id;


--
-- Name: blogs; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.blogs (
    id integer NOT NULL,
    slug character varying(255) NOT NULL,
    title character varying(255) NOT NULL,
    content text NOT NULL,
    image_url text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.blogs OWNER TO neondb_owner;

--
-- Name: blogs_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.blogs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.blogs_id_seq OWNER TO neondb_owner;

--
-- Name: blogs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.blogs_id_seq OWNED BY public.blogs.id;


--
-- Name: companies; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.companies (
    id integer NOT NULL,
    company_name character varying(255),
    logo_url text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.companies OWNER TO neondb_owner;

--
-- Name: companies_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.companies_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.companies_id_seq OWNER TO neondb_owner;

--
-- Name: companies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.companies_id_seq OWNED BY public.companies.id;


--
-- Name: courses; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.courses (
    id integer NOT NULL,
    slug character varying(255) NOT NULL,
    status character varying(50) DEFAULT 'Published'::character varying,
    subject character varying(100),
    title character varying(255) NOT NULL,
    short_description text,
    long_description text,
    projects_count character varying(50),
    accreditation_text character varying(255),
    duration_mode character varying(100),
    tech_stack jsonb,
    six_key_features jsonb,
    tailored_pathways jsonb,
    comparison_table jsonb,
    curriculum jsonb,
    guidance_title character varying(255),
    guidance_description text,
    cert_heading character varying(255),
    cert_description text,
    cert_image_url text,
    cert_features jsonb,
    faqs jsonb,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    card_features jsonb,
    next_batch_text character varying(100),
    accelerate_heading character varying(255),
    accelerate_description text,
    accelerate_bullets jsonb,
    overview_eyebrow character varying(100),
    overview_heading character varying(255),
    overview_description text,
    outcome_title character varying(100),
    outcome_text text,
    overview_image_url text,
    overview_badge_line1 character varying(100),
    overview_badge_line2 character varying(100),
    advantages_eyebrow character varying(100),
    advantages_heading character varying(255),
    advantages_description text,
    pathways_eyebrow character varying(100),
    pathways_heading character varying(255),
    comparison_eyebrow character varying(100),
    comparison_heading character varying(255),
    comparison_description text,
    syllabus_eyebrow character varying(100),
    syllabus_heading character varying(255),
    syllabus_description text,
    batches_eyebrow character varying(100),
    batches_heading character varying(255),
    batches_description text,
    batch_options jsonb,
    guidance_eyebrow character varying(100),
    cert_eyebrow character varying(100),
    syllabus_pdf_url text,
    category character varying(100),
    card_image_url text,
    placement_guarantee character varying(100)
);


ALTER TABLE public.courses OWNER TO neondb_owner;

--
-- Name: courses_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.courses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.courses_id_seq OWNER TO neondb_owner;

--
-- Name: courses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.courses_id_seq OWNED BY public.courses.id;


--
-- Name: inquiries; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.inquiries (
    id integer NOT NULL,
    full_name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    phone character varying(50),
    course_interest character varying(255),
    message text,
    status character varying(50) DEFAULT 'New'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.inquiries OWNER TO neondb_owner;

--
-- Name: inquiries_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.inquiries_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.inquiries_id_seq OWNER TO neondb_owner;

--
-- Name: inquiries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.inquiries_id_seq OWNED BY public.inquiries.id;


--
-- Name: teachers; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.teachers (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    role character varying(255) NOT NULL,
    bio text,
    skills jsonb,
    image_url text NOT NULL,
    linkedin_url text,
    twitter_url text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.teachers OWNER TO neondb_owner;

--
-- Name: teachers_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.teachers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.teachers_id_seq OWNER TO neondb_owner;

--
-- Name: teachers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.teachers_id_seq OWNED BY public.teachers.id;


--
-- Name: testimonials; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.testimonials (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    company character varying(255) NOT NULL,
    rating integer DEFAULT 5,
    testimonial_text text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT testimonials_rating_check CHECK (((rating >= 1) AND (rating <= 5)))
);


ALTER TABLE public.testimonials OWNER TO neondb_owner;

--
-- Name: testimonials_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.testimonials_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.testimonials_id_seq OWNER TO neondb_owner;

--
-- Name: testimonials_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.testimonials_id_seq OWNED BY public.testimonials.id;


--
-- Name: admins id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.admins ALTER COLUMN id SET DEFAULT nextval('public.admins_id_seq'::regclass);


--
-- Name: blogs id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.blogs ALTER COLUMN id SET DEFAULT nextval('public.blogs_id_seq'::regclass);


--
-- Name: companies id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.companies ALTER COLUMN id SET DEFAULT nextval('public.companies_id_seq'::regclass);


--
-- Name: courses id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.courses ALTER COLUMN id SET DEFAULT nextval('public.courses_id_seq'::regclass);


--
-- Name: inquiries id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.inquiries ALTER COLUMN id SET DEFAULT nextval('public.inquiries_id_seq'::regclass);


--
-- Name: teachers id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.teachers ALTER COLUMN id SET DEFAULT nextval('public.teachers_id_seq'::regclass);


--
-- Name: testimonials id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.testimonials ALTER COLUMN id SET DEFAULT nextval('public.testimonials_id_seq'::regclass);


--
-- Data for Name: admins; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.admins (id, username, password_hash) FROM stdin;
1	admin@RiT.com	$2b$10$yKG3boQ3tR4LhPnQ6Acy1.tbWQ6vGe9tFWWsPfxc8pvpeK7LjyLMu
\.


--
-- Data for Name: blogs; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.blogs (id, slug, title, content, image_url, created_at) FROM stdin;
3	manual-testing-to-automation-lead	How I Transitioned from Manual Testing to Automation Lead in 6 Months	A step-by-step personal journey of mastering Java, Selenium WebDriver, and CI/CD pipelines to accelerate your software engineering career.\n\nTransitioning from manual verification to automated test engineering requires a solid foundation in core programming principles, test architecture design, and continuous integration.\n\nBy focusing on practical real-world frameworks, writing clean, maintainable automation scripts using the Page Object Model (POM), and mastering TestNG annotations, you position yourself as a high-value SDET in top product firms.\n\nContinuous hands-on practice, mock technical interviews, and architecting live frameworks from scratch are the most dependable pillars to achieve your career breakthrough.	https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80	2026-09-12 21:58:12.959458
1	cracking-cdac-ccat	How QA should think	The best QA Testers are often the people who ask the most questions. Not because they want to slow down development, but because every unanswered question can become a potential defect later.\r\nWhat happens if the user enters incorrect data? What happens if the service is unavailable? What happens if two users perform the same action simultaneously? What happens if the user closes the browser halfway through the process? What happens when the application is used in a way the original requirement never described?\r\nThese questions create better test scenarios and expose risks before they reach production. Manual testing is powerful because it allows testers to explore beyond predefined expectations and use reasoning, observation, and experience to uncover unexpected behavior.\r\nA QA Tester should not be someone who simply asks, “Does it work?” The better question is, “Does it continue to work when reality gets involved?”\r\n\r\n#QATester #ManualTester #ManualTesting #SoftwareTesting #QualityAssurance #QAEngineer #SoftwareQuality #Testing #TechProfessionals	https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&auto=format&fit=crop&q=80	2026-09-12 21:58:12.959458
2	the-future-of-qa-top-10-automation-testing-tools-to-master-in-2026	Why AI is important in Software Testing Process	Artificial Intelligence transforms software testing from a reactive, script-bound verification task into an adaptive, data-driven quality engineering discipline. Traditional test automation simply executes fixed steps and flags mismatches; it breaks easily when applications change. AI introduces learning, pattern recognition, and autonomous adaptation to solve the biggest bottlenecks in modern delivery pipelines.\r\n\r\nCore Drivers of AI in Software Testing\r\n - Autonomous Script Maintenance (Self-Healing Tests):\r\n\r\nTraditional UI and end-to-end automation suites suffer from "flakiness" when element locators, CSS classes, or DOM trees change. AI-driven engines dynamically evaluate element attributes, context, and visual position to find targets even if an ID or XPath shifts, cutting maintenance overhead significantly.\r\n\r\n- Intelligent Test Case & Data Generation:\r\n\r\nGenerative AI and Large Language Models (LLMs) can parse user stories, API specifications, and database schemas to draft comprehensive test cases, boundary-value scenarios, and synthetic test datasets (including mock payloads and edge conditions) in minutes.\r\n\r\n- Visual Regression & UX Validation:\r\n\r\nHuman eyes miss subtle pixel shifts, font rendering anomalies, and cross-browser CSS misalignment, while rigid pixel-matching assertions create too many false positives. Computer vision models recognize layout shifts, color contrast violations, and dynamic rendering bugs across screen resolutions without brittle assertions.\r\n\r\n- Predictive Risk Analysis & Targeted Regression:\r\n\r\nRunning thousands of tests on every single commit slows down CI/CD pipelines. Machine learning models analyze commit frequency, code complexity, and historical defect patterns to predict which modules are prone to failure, triggering only the relevant subset of tests to speed up feedback loops.\r\n\r\n- Root Cause Analysis & Log Clustering:\r\n\r\nWhen an automated suite fails on dozens of assertions, engineers often spend hours debugging stack traces. NLP and clustering algorithms group identical failure patterns, isolate flaky infrastructure errors from actual application regressions, and map bugs directly to suspect pull requests.	https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80	2026-09-12 21:58:12.959458
4	why-playwright-is-very-popular-automation-tool-now-a-days	Why Playwright is very popular automation tool now a days.	Playwright has surged in popularity because it directly solves the biggest headaches that have plagued test automation for years: flakiness, slow execution, complex setup, and poor debugging tools.\r\n\r\nBuilt by the team at Microsoft that previously created Puppeteer, Playwright was engineered specifically for modern, asynchronous single-page applications (React, Vue, Angular, Next.js).\r\n\r\nCore Reasons for Playwright’s Rapid Adoption\r\n- Auto-Waiting Eliminates Test Flakiness:\r\n\r\nIn older tools like Selenium, tests frequently break because elements are still rendering, forcing engineers to write messy Thread.sleep() or explicit conditional waits. Playwright automatically checks that elements are visible, enabled, stable, and ready to receive events before performing any action.\r\n\r\n- Blazing Speed via Direct DevTools Protocol:\r\n\r\nUnlike Selenium, which routes commands through an intermediate HTTP server (WebDriver binary), Playwright communicates directly with the browser using native protocols (like Chrome DevTools Protocol over WebSockets). This cuts latency to near zero, making execution substantially faster.\r\n\r\n- True Cross-Browser Testing from a Single API:\r\n\r\nCypress struggled with WebKit (Safari) support for years, while Selenium required configuring different drivers (chromedriver, geckodriver). Playwright downloads and automates all major browser rendering engines—Chromium, Firefox, and WebKit—straight out of the box with zero third-party drivers.\r\n\r\n- Lightweight Isolation (Browser Contexts):\r\n\r\nSpinning up new browser instances per test is slow and consumes immense memory. Playwright uses Browser Contexts—isolated browser incognito profiles that launch in milliseconds. You can run hundreds of parallel tests on a single browser instance with fully isolated storage, cookies, and cache.\r\n\r\n- Best-in-Class Developer Experience & Debugging:\r\n\r\n      - Trace Viewer: Records DOM snapshots, screencasts, console logs, and network activity per test step. When a CI test fails, engineers can inspect the exact DOM state before and after each click.\r\n\r\n      - Codegen (Test Recorder): Allows you to interact with a page manually while generating clean, locator-resilient code.\r\n\r\n      - Playwright UI Mode: Provides an interactive dashboard for re-running, filtering, and live-debugging tests.\r\n\r\n- Native Multi-Page, Tab, and iFrame Support:\r\n\r\nCypress famously struggles with multi-tab interactions and deeply nested iframes. Playwright treats tabs, popups, and frames as first-class citizens, handling multi-user workflows (like a chat session between two separate tabs) effortlessly.\r\n\r\n- Network Interception & API Mocking:\r\n\r\nPlaywright acts as an in-browser proxy. It can intercept, modify, or mock API responses on the fly, allowing frontend workflows to be tested reliably even if backend microservices are down.\r\n\r\n- Multi-Language Flexibility:\r\n\r\nWhile TypeScript/JavaScript is the default choice for modern web stacks, Playwright provides first-class language bindings for Python, Java, and C# (.NET), making it accessible to QA engineers and backend teams regardless of their tech stack.	data:image/png;base64,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	2026-09-25 14:33:13.545481
\.


--
-- Data for Name: companies; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.companies (id, company_name, logo_url, created_at) FROM stdin;
4	TCS	/uploads/companies/1790328218857-Screenshot_2026-09-25_145321.png	2026-09-25 09:23:39.379571
5	Infosys	/uploads/companies/1790328331777-Screenshot_2026-09-25_145520.png	2026-09-25 09:25:32.297596
7	Cognizant	/uploads/companies/1790328478568-Cognizant-Logo.png	2026-09-25 09:27:59.084204
8	Accenture	/uploads/companies/1790328566255-Accenture-Logo.png	2026-09-25 09:29:26.771339
9	Quality Kiosk	/uploads/companies/1790328662188-Screenshot_2026-09-25_150048.png	2026-09-25 09:31:02.699556
10	Axis Bank	/uploads/companies/1790328717388-Screenshot_2026-09-25_150146.png	2026-09-25 09:31:57.898297
11	HSBC	/uploads/companies/1790328772106-HSBC-Logo.png	2026-09-25 09:32:52.616333
12	UBS	/uploads/companies/1790328822273-Screenshot_2026-09-25_150324.png	2026-09-25 09:33:42.781389
14	Persistence	/uploads/companies/1790328936917-Screenshot_2026-09-25_150526.png	2026-09-25 09:35:37.423
15	Wipro	/uploads/companies/1790328982472-Wipro-logo.png	2026-09-25 09:36:22.975876
18	Expleo	/uploads/companies/1790329274003-Screenshot_2026-09-25_151044.png	2026-09-25 09:41:14.500089
19	Capgemini	/uploads/companies/1790329414743-Screenshot_2026-09-25_151323.png	2026-09-25 09:43:35.235024
20	deloitte	/uploads/companies/1790329595089-Screenshot_2026-09-25_151614.png	2026-09-25 09:46:35.576112
\.


--
-- Data for Name: courses; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.courses (id, slug, status, subject, title, short_description, long_description, projects_count, accreditation_text, duration_mode, tech_stack, six_key_features, tailored_pathways, comparison_table, curriculum, guidance_title, guidance_description, cert_heading, cert_description, cert_image_url, cert_features, faqs, created_at, card_features, next_batch_text, accelerate_heading, accelerate_description, accelerate_bullets, overview_eyebrow, overview_heading, overview_description, outcome_title, outcome_text, overview_image_url, overview_badge_line1, overview_badge_line2, advantages_eyebrow, advantages_heading, advantages_description, pathways_eyebrow, pathways_heading, comparison_eyebrow, comparison_heading, comparison_description, syllabus_eyebrow, syllabus_heading, syllabus_description, batches_eyebrow, batches_heading, batches_description, batch_options, guidance_eyebrow, cert_eyebrow, syllabus_pdf_url, category, card_image_url, placement_guarantee) FROM stdin;
1	software-testing-bootcamp	Published	#1 RATED QA BOOTCAMP IN PUNE & ONLINE	Complete Software Testing & Automation Bootcamp	Master Manual Testing, Java, Selenium 4, and REST API testing to become a 	Traditional college degrees and generic crash courses leave major gaps in practical QA skills. This bootcamp bridges that divide by immersing you in real corporate workflows, enterprise frameworks, and defect lifecycles from day one.	10+ Real-World	ISTQB Aligned	3 Months (12 Wks)	["End-to-End Manual Testing & Agile Jira", "Core Java & Object-Oriented Architecture", "Selenium 4 WebDriver & Page Object Model"]	[{"color": "text-brand-orange", "title": "100% Placement Guarantee", "iconName": "Award", "description": "Direct referrals to our 40+ hiring partners and unlimited interviews until you secure your offer letter."}, {"color": "text-brand-blue", "title": "Live Real-World Projects", "iconName": "Code2", "description": "Build test frameworks for actual live web apps, banking APIs, and e-commerce platforms."}, {"color": "text-emerald-600", "title": "Industry Expert Trainers", "iconName": "Users", "description": "Learn directly from senior SDETs and QA leads with 10+ years of tier-1 tech enterprise experience."}, {"color": "text-purple-600", "title": "Resume & LinkedIn Building", "iconName": "FileText", "description": "ATS-optimized resumes, GitHub test portfolios, and personalized LinkedIn profiles to attract top recruiters."}, {"color": "text-amber-600", "title": "Mock HR & Tech Interviews", "iconName": "Briefcase", "description": "1-on-1 mock interviews, coding tests, and behavioral drills with instant constructive feedback."}, {"color": "text-rose-600", "title": "24/7 Lab & Doubt Access", "iconName": "Headphones", "description": "Round-the-clock code review assistance and dedicated discord/chat groups with mentors."}]	[{"badge": "Fast-Track Entry", "title": "Recent Graduates", "iconName": "GraduationCap", "subtitle": "BE, B.Tech, BCA, MCA, B.Sc & M.Sc Students", "highlights": ["Bridge the college-to-corporate skills gap", "Build a GitHub portfolio of real frameworks", "Guaranteed campus-equivalent placement support"], "description": "Break into the IT sector with high-demand automation skills that stand out among thousands of applicants. No prior corporate experience required."}, {"badge": "Zero Coding Required", "title": "Career Switchers", "iconName": "RefreshCw", "subtitle": "Non-IT & Support Professionals", "highlights": ["Step-by-step foundation from absolute zero", "Learn how to explain your career transition", "Salary jump of up to 150% into IT"], "description": "Transition smoothly from BPO, sales, operations, or non-technical domains into high-paying QA roles with structured, beginner-friendly Java coaching."}, {"badge": "Skill & Salary Upgrade", "title": "Manual QA Testers", "iconName": "Building2", "subtitle": "Experienced Manual / Functional Testers", "highlights": ["Transition from Manual to SDET / Lead QA", "Master Java, Selenium 4, and REST Assured", "Qualify for senior automation job profiles"], "description": "Upgrade your technical profile from manual test execution to full-stack Automation SDET with Selenium, API testing, and CI/CD pipelines."}]	[{"others": "Job notifications / forward resume only", "feature": "Placement Commitment", "revelation": "100% Placement Guarantee with direct corporate referrals"}, {"others": "Outdated Selenium 2/3 and manual-heavy content", "feature": "Curriculum Modernity", "revelation": "2026 Tech Stack (Selenium 4, REST Assured, Jenkins CI/CD)"}, {"others": "Crowded 100+ batches with generic video playback", "feature": "Mentorship Model", "revelation": "1-on-1 personal code reviews & personalized coaching"}, {"others": "Toy login pages and static demo forms", "feature": "Project Quality", "revelation": "Enterprise Banking & E-Commerce Live Architectures"}, {"others": "1 single generic mock test", "feature": "Mock Interview Drills", "revelation": "Unlimited 1-on-1 technical & HR drill downs until hired"}, {"others": "Support ends immediately upon course completion", "feature": "Post-Job Support", "revelation": "Real-job technical guidance during your first 90 days"}]	[{"title": "Manual Testing Fundamentals & Agile QA", "number": "01", "topics": ["Software Development Life Cycle (SDLC) vs. Software Testing Life Cycle (STLC)", "Agile Scrum Framework: Sprint Planning, Daily Standups, Retrospectives", "Test Planning: Test Strategy, Test Scenarios & Comprehensive Test Case Writing", "Functional, Non-Functional, Regression, Smoke, Sanity & Boundary Value Testing", "Bug Lifecycle: Severity vs. Priority & Defect Management in Atlassian Jira", "Real-Time Project: End-to-end Test Suite Creation for an E-Commerce Platform"], "duration": "Weeks 1 - 3", "description": "Master the complete software testing lifecycle, defect management, and corporate Agile Scrum practices from ground up."}, {"title": "Core Java for QA & Automation Engineers", "number": "02", "topics": ["Java Basics: JVM, JRE, JDK, Data Types, Control Statements & Loops", "OOPs Concepts: Inheritance, Polymorphism, Abstraction & Encapsulation", "Java Collections Framework: List, Set, Map, ArrayList, HashMap & Iterators", "Exception Handling, File I/O & Apache POI for Excel Test Data Reading", "String Manipulations, Regular Expressions & Memory Management", "Real-Time Project: Data Parsing & Automated Test Data Generation in Java"], "duration": "Weeks 4 - 6", "description": "Designed specifically for beginners to build solid Object-Oriented Programming skills required for automation test scripting."}, {"title": "Selenium WebDriver 4 & Framework Architecture", "number": "03", "topics": ["Selenium 4 Architecture, WebDriver API & Dynamic XPath/CSS Locators", "Handling Dynamic Waits, Alerts, Popups, Frames, Multi-Tabs & Action Chains", "TestNG Framework: Annotations, Assertions, DataProviders & Parallel Test Execution", "Page Object Model (POM) Design Pattern & Page Factory Implementation", "Data-Driven & Hybrid Framework Architecture from Scratch", "Real-Time Project: Hybrid Automation Suite with Extent Reports & Cross-Browser Grid"], "duration": "Weeks 7 - 9", "description": "Build enterprise-grade test automation frameworks using Selenium WebDriver, TestNG, and Page Object Model (POM)."}, {"title": "API Testing with Postman & REST Assured", "number": "04", "topics": ["Web Services & REST Architecture: HTTP Methods (GET, POST, PUT, DELETE) & Status Codes", "Postman: Environment Variables, Collections, Pre-request Scripts & Test Assertions", "REST Assured Library: BDD Syntax (given/when/then) & JSON Path Parsing", "Serialization & Deserialization with Jackson / GSON POJO Classes", "Authentication Mechanisms: Bearer Tokens, API Keys & OAuth 2.0", "Real-Time Project: Banking & Payment Gateway REST API Automated Regression Suite"], "duration": "Weeks 10 - 11", "description": "Validate microservices and backend systems through manual API exploration and automated Java REST Assured test suites."}, {"title": "CI/CD, Version Control & DevOps Integration", "number": "05", "topics": ["Git & GitHub: Branching Strategy, Commits, Pull Requests & Merge Conflict Resolution", "Maven Build Tool: Dependencies Management, plugins & pom.xml Optimization", "Jenkins CI/CD: Automated Trigger Jobs, Parameterized Builds & Scheduled Runs", "Allure Reporting & Automated Email / Slack Notification Webhooks", "ISTQB Certification Preparation & Real-Job Deployment Support", "Capstone Project: Full CI/CD Test Pipeline Execution with Live GitHub Triggers"], "duration": "Week 12", "description": "Integrate automated test suites into modern Continuous Integration / Continuous Deployment (CI/CD) pipelines."}]	Not sure if Software Testing is right for you?	Get a free 1-on-1 profile evaluation with our Chief QA Architect. We will review your background, assess your aptitude, and recommend the fastest roadmap to break into IT.	Industry-Recognized QA Certification.	Upon passing our capstone automation framework review and comprehensive mock technical panel, you receive a tamper-proof digital certificate that hiring managers instantly respect.	https://images.unsplash.com/photo-1589330694653-06def33cefca?w=1200	[{"desc": "Includes a unique certificate ID and QR code for one-click verification by tech recruiters.", "title": "Verifiable Digital Credential"}, {"desc": "Prepares you to ace the ISTQB Certified Tester Foundation Level (CTFL) exam on your first attempt.", "title": "ISTQB® Syllabus Alignment"}, {"desc": "Easily add the certificate to your LinkedIn profile and resume to stand out in corporate applicant pools.", "title": "Direct LinkedIn & ATS Integration"}]	\N	2026-09-12 17:42:45.394286	["TEST", "TEST-1"]				["Live Interactive Mentorship", "Daily Doubt Clarification Labs", "1-on-1 Mock HR & Tech Drills", "Dedicated Placement"]	COURSE OVERVIEW	What you will learn & master.	Traditional college degrees and generic crash courses leave major gaps in practical QA skills. This bootcamp bridges that divide by immersing you in real corporate workflows, enterprise frameworks, and defect lifecycles from day one.	Outcome Guarantee:	By the end of 12 weeks, you will be capable of building automated regression test suites from scratch, designing API tests, and confidently facing senior SDET technical interviews.	https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80	120+ Hours	Hands-on QA Coding	PROGRAM ADVANTAGES	Why this is India's most effective QA program.	Everything you need to transform from beginner to corporate-ready QA engineer, all under one roof.	WHO IS THIS COURSE FOR	Tailored pathways for your background.	WHY CHOOSE US	The Revelation IT Difference.	See why hundreds of learners choose our flagship bootcamp over traditional training centers.	COMPREHENSIVE SYLLABUS	Curriculum designed for the modern industry.	Click any module to inspect the detailed topic breakdown and hands-on projects.	BATCH TIMINGS & ENROLLMENT	Choose the batch that fits your schedule.	Flexible options for students, job seekers, and working professionals.	[{"id": "weekday-online", "name": "Selenium Automation Testing", "type": "Live Online (Zoom)", "badge": "", "timing": "Mon - Fri • 7:30 AM or 8:00 PM IST", "popular": false, "duration": "3 Months (1.5 hrs/day)", "description": "Ideal for graduates and job seekers dedicated to fast-tracking their placement within 90 days."}, {"id": "weekend-online", "name": "Weekend Batch", "type": "Live Online (Zoom)", "badge": "For Working Pros", "timing": "Sat & Sun • 10:00 AM - 1:30 PM IST", "popular": true, "duration": "3.5 Months (3.5 hrs/day)", "description": "Tailored for working professionals who want to upskill without disrupting their weekly work schedule."}, {"id": "offline-pune", "name": "Classroom Batch", "type": "Offline Pune Campus", "badge": "⭐ Popular in Pune", "timing": "Mon - Fri • Morning / Afternoon Batches", "popular": true, "duration": "3 Months • In-Person Labs", "description": "Hands-on lab training at our Pimpri-Chinchwad / Pune campus with direct face-to-face mentor instruction."}]	1-ON-1 CAREER GUIDANCE	ACCREDITED & RECOGNIZED	/uploads/syllabuses/1790274981495-Nachiket_Resume_Template.pdf	Software Testing & Automation	https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&auto=format&fit=crop&q=80	100% Placement Guarantee
\.


--
-- Data for Name: inquiries; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.inquiries (id, full_name, email, phone, course_interest, message, status, created_at) FROM stdin;
5	Nachiket Nikam	nika@gmail.com	1234567890	Syllabus Download - Complete Software Testing & Automation Bootcamp	\N	New	2026-09-25 07:04:10.235271
\.


--
-- Data for Name: teachers; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.teachers (id, name, role, bio, skills, image_url, linkedin_url, twitter_url, created_at) FROM stdin;
1	Aashish Jaiswal	Lead QA Automation Expert	10+ years of experience architecting enterprise test frameworks and mentoring SDETs at top tech firms including Avalara.	["Selenium", "Java", "TestNG", "Cucumber", "Playwright", "Javascript", "Ci/DC", "Jenkins", "SF Testing", "more..."]	/uploads/teachers/1791022376344-AashishTrainer.jpg	https://www.linkedin.com/in/aashish-pardeshi-490a71133/	https://twitter.com	2026-09-12 21:48:54.394956
\.


--
-- Data for Name: testimonials; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.testimonials (id, name, company, rating, testimonial_text, created_at) FROM stdin;
1	Harshal Chavan	Reflexis	5	The training and placement program was excellent. The guidance, support, and opportunities provided were really helpful and well organised.	2026-09-12 21:33:59.263784
2	Kripashankar Upadhyay	UA Brands	5	Revelation IT provides very focused, point-to-point training that helped me get placed and gave me great overall learning exposure. Their interview preparation was excellent and played a key role in helping me get shortlisted and selected.	2026-09-12 21:33:59.263784
3	Suvarna Hirve	Coforge	5	Great initiative by the IT Placement & Training team! The sessions are informative and helpful for skill development. The team also provides excellent guidance and support throughout the placement process. Really appreciate their efforts and continuous support!	2026-09-12 21:33:59.263784
4	Swapnil Sonar	TCS	5	I had a really great experience with this placement service. One thing I especially appreciate is their payment model — they take the payment only after placement, which makes the entire process feel trustworthy and comfortable for candidates.	2026-09-12 21:33:59.263784
5	Samiksha Sable	Persistent	5	The training and placement program was excellent. The guidance, support, and opportunities provided were really helpful and well organised.	2026-09-12 21:33:59.263784
6	Rohit Chaudhari	REI Systems	5	I’m truly thankful to the institute for its excellent guidance and placement support. The institute helped me build strong skills in test automation, provided practical interview preparation and placement assistance, and groomed me professionally.\nWould definitely recommend this institute for those who are looking to build their careers in IT	2026-09-12 21:33:59.263784
\.


--
-- Name: admins_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.admins_id_seq', 1, true);


--
-- Name: blogs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.blogs_id_seq', 4, true);


--
-- Name: companies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.companies_id_seq', 20, true);


--
-- Name: courses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.courses_id_seq', 1, true);


--
-- Name: inquiries_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.inquiries_id_seq', 5, true);


--
-- Name: teachers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.teachers_id_seq', 3, true);


--
-- Name: testimonials_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.testimonials_id_seq', 6, true);


--
-- Name: admins admins_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_pkey PRIMARY KEY (id);


--
-- Name: admins admins_username_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_username_key UNIQUE (username);


--
-- Name: blogs blogs_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.blogs
    ADD CONSTRAINT blogs_pkey PRIMARY KEY (id);


--
-- Name: blogs blogs_slug_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.blogs
    ADD CONSTRAINT blogs_slug_key UNIQUE (slug);


--
-- Name: companies companies_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT companies_pkey PRIMARY KEY (id);


--
-- Name: courses courses_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_pkey PRIMARY KEY (id);


--
-- Name: courses courses_slug_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_slug_key UNIQUE (slug);


--
-- Name: inquiries inquiries_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.inquiries
    ADD CONSTRAINT inquiries_pkey PRIMARY KEY (id);


--
-- Name: teachers teachers_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.teachers
    ADD CONSTRAINT teachers_pkey PRIMARY KEY (id);


--
-- Name: testimonials testimonials_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.testimonials
    ADD CONSTRAINT testimonials_pkey PRIMARY KEY (id);


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO neon_superuser WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON TABLES TO neon_superuser WITH GRANT OPTION;


--
-- PostgreSQL database dump complete
--

\unrestrict ye3LIlDuGXX9s7yMoaeJtlwiutsEfIbQ3ZyujJWhUiDbVZkK4RFk2HeaGBP2e4E

