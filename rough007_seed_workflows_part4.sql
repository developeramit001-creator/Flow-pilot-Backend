-- ============================================
-- MIGRATION 007: SEED WORKFLOW TEMPLATES - PART 4
-- ============================================
-- Categories: Marketing, Sales, Education, Health, Personal
-- Total: 250+ workflows

-- ============================================
-- SECTION 1: MARKETING (50+)
-- ============================================

INSERT INTO workflow_templates (name, category, icon, description, steps, estimated_days) VALUES

(
    'Digital Marketing Strategy',
    'Marketing',
    '📊',
    'Create a comprehensive digital marketing strategy.',
    '[{"name": "Audit", "role": "Marketing Manager", "days": 3}, {"name": "Goals", "role": "Marketing Manager", "days": 2}, {"name": "Channels", "role": "Marketing Manager", "days": 2}, {"name": "Budget", "role": "Finance", "days": 2}, {"name": "Content Plan", "role": "Content Strategist", "days": 3}, {"name": "Execution Plan", "role": "Marketing Manager", "days": 2}]'::jsonb,
    14
),
(
    'SEO Strategy & Implementation',
    'Marketing',
    '🔍',
    'Develop and implement an SEO strategy.',
    '[{"name": "Audit", "role": "SEO Specialist", "days": 2}, {"name": "Keyword Research", "role": "SEO Specialist", "days": 2}, {"name": "On-Page SEO", "role": "SEO Specialist", "days": 3}, {"name": "Technical SEO", "role": "SEO Specialist", "days": 2}, {"name": "Content", "role": "Content Writer", "days": 4}, {"name": "Link Building", "role": "SEO Specialist", "days": 5}, {"name": "Monitor", "role": "SEO Specialist", "days": 1}]'::jsonb,
    19
),
(
    'Social Media Marketing Plan',
    'Marketing',
    '📱',
    'Create a social media marketing plan.',
    '[{"name": "Audit", "role": "Social Media Manager", "days": 2}, {"name": "Goals", "role": "Social Media Manager", "days": 1}, {"name": "Content Calendar", "role": "Social Media Manager", "days": 3}, {"name": "Content Creation", "role": "Designer", "days": 3}, {"name": "Schedule", "role": "Social Media Manager", "days": 1}, {"name": "Analytics", "role": "Social Media Manager", "days": 1}]'::jsonb,
    11
),
(
    'Content Marketing Strategy',
    'Marketing',
    '📝',
    'Create a content marketing strategy.',
    '[{"name": "Audit", "role": "Content Strategist", "days": 2}, {"name": "Goals", "role": "Content Strategist", "days": 1}, {"name": "Content Types", "role": "Content Strategist", "days": 2}, {"name": "Editorial Calendar", "role": "Content Strategist", "days": 3}, {"name": "Distribution", "role": "Marketing Manager", "days": 2}, {"name": "Analytics", "role": "Content Strategist", "days": 1}]'::jsonb,
    11
),
(
    'Email Marketing Campaign',
    'Marketing',
    '📧',
    'Create and execute an email marketing campaign.',
    '[{"name": "List Building", "role": "Marketing Manager", "days": 2}, {"name": "Segmentation", "role": "Data Analyst", "days": 1}, {"name": "Email Copy", "role": "Copywriter", "days": 3}, {"name": "Design", "role": "Designer", "days": 2}, {"name": "A/B Testing", "role": "Marketing Manager", "days": 1}, {"name": "Send", "role": "Marketing Ops", "days": 1}, {"name": "Analyze", "role": "Data Analyst", "days": 1}]'::jsonb,
    11
),
(
    'PPC Campaign (Google Ads)',
    'Marketing',
    '💸',
    'Create and manage a Google Ads campaign.',
    '[{"name": "Strategy", "role": "PPC Specialist", "days": 2}, {"name": "Keyword Research", "role": "PPC Specialist", "days": 2}, {"name": "Ad Copy", "role": "Copywriter", "days": 2}, {"name": "Landing Page", "role": "Designer", "days": 2}, {"name": "Setup", "role": "PPC Specialist", "days": 1}, {"name": "Launch", "role": "PPC Specialist", "days": 1}, {"name": "Optimize", "role": "PPC Specialist", "days": 2}]'::jsonb,
    12
),
(
    'Facebook/Instagram Ads',
    'Marketing',
    '📲',
    'Create and manage Facebook/Instagram ads.',
    '[{"name": "Strategy", "role": "Social Media Manager", "days": 2}, {"name": "Audience", "role": "Social Media Manager", "days": 2}, {"name": "Ad Creatives", "role": "Designer", "days": 3}, {"name": "Ad Copy", "role": "Copywriter", "days": 2}, {"name": "Setup", "role": "Social Media Manager", "days": 1}, {"name": "Launch", "role": "Social Media Manager", "days": 1}, {"name": "Optimize", "role": "Social Media Manager", "days": 2}]'::jsonb,
    13
),
(
    'LinkedIn Marketing Campaign',
    'Marketing',
    '💼',
    'Create a LinkedIn marketing campaign.',
    '[{"name": "Strategy", "role": "Marketing Manager", "days": 2}, {"name": "Content", "role": "Content Writer", "days": 3}, {"name": "Ads", "role": "PPC Specialist", "days": 2}, {"name": "Engagement", "role": "Social Media Manager", "days": 2}, {"name": "Analytics", "role": "Data Analyst", "days": 1}]'::jsonb,
    10
),
(
    'Influencer Marketing Campaign',
    'Marketing',
    '🤳',
    'Create and execute an influencer marketing campaign.',
    '[{"name": "Strategy", "role": "Marketing Manager", "days": 2}, {"name": "Identify Influencers", "role": "Marketing Manager", "days": 3}, {"name": "Reach Out", "role": "Marketing Manager", "days": 3}, {"name": "Brief", "role": "Content Writer", "days": 2}, {"name": "Content", "role": "Influencer", "days": 2}, {"name": "Track", "role": "Data Analyst", "days": 2}]'::jsonb,
    14
),
(
    'Affiliate Marketing Program',
    'Marketing',
    '🔗',
    'Setup and manage an affiliate marketing program.',
    '[{"name": "Strategy", "role": "Marketing Manager", "days": 2}, {"name": "Platform", "role": "Marketing Manager", "days": 2}, {"name": "Recruitment", "role": "Marketing Manager", "days": 3}, {"name": "Materials", "role": "Designer", "days": 2}, {"name": "Track", "role": "Data Analyst", "days": 2}, {"name": "Pay", "role": "Finance", "days": 2}]'::jsonb,
    13
),
(
    'Brand Awareness Campaign',
    'Marketing',
    '🎯',
    'Create a brand awareness campaign.',
    '[{"name": "Strategy", "role": "Marketing Manager", "days": 3}, {"name": "Creative", "role": "Designer", "days": 4}, {"name": "Media Plan", "role": "Marketing Manager", "days": 2}, {"name": "Execution", "role": "Marketing Manager", "days": 3}, {"name": "Measure", "role": "Data Analyst", "days": 2}]'::jsonb,
    14
),
(
    'Product Marketing Launch',
    'Marketing',
    '🚀',
    'Plan and execute a product launch.',
    '[{"name": "Research", "role": "Product Manager", "days": 3}, {"name": "Messaging", "role": "Marketing Manager", "days": 2}, {"name": "Assets", "role": "Designer", "days": 4}, {"name": "PR", "role": "PR Manager", "days": 3}, {"name": "Launch", "role": "Marketing Manager", "days": 2}, {"name": "Post-Launch", "role": "Product Manager", "days": 2}]'::jsonb,
    16
),
(
    'Customer Retention Campaign',
    'Marketing',
    '💛',
    'Create a customer retention campaign.',
    '[{"name": "Data Analysis", "role": "Data Analyst", "days": 2}, {"name": "Strategy", "role": "Marketing Manager", "days": 2}, {"name": "Content", "role": "Content Writer", "days": 3}, {"name": "Emails", "role": "Marketing Manager", "days": 2}, {"name": "Execute", "role": "Marketing Manager", "days": 1}, {"name": "Measure", "role": "Data Analyst", "days": 1}]'::jsonb,
    11
),
(
    'Marketing Automation Setup',
    'Marketing',
    '⚙️',
    'Setup marketing automation (HubSpot, Mailchimp, etc.).',
    '[{"name": "Requirements", "role": "Marketing Ops", "days": 2}, {"name": "Integration", "role": "Marketing Ops", "days": 3}, {"name": "Workflows", "role": "Marketing Ops", "days": 3}, {"name": "Testing", "role": "QA", "days": 2}, {"name": "Launch", "role": "Marketing Ops", "days": 1}]'::jsonb,
    11
),
(
    'Market Positioning Strategy',
    'Marketing',
    '📍',
    'Develop a market positioning strategy.',
    '[{"name": "Research", "role": "Market Research", "days": 3}, {"name": "Analysis", "role": "Market Research", "days": 2}, {"name": "Positioning", "role": "Marketing Manager", "days": 3}, {"name": "Messaging", "role": "Marketing Manager", "days": 2}, {"name": "Review", "role": "CEO", "days": 1}]'::jsonb,
    11
),
(
    'PR Campaign',
    'Marketing',
    '📰',
    'Create and execute a PR campaign.',
    '[{"name": "Strategy", "role": "PR Manager", "days": 2}, {"name": "Press Release", "role": "PR Manager", "days": 2}, {"name": "Media List", "role": "PR Manager", "days": 2}, {"name": "Pitch", "role": "PR Manager", "days": 3}, {"name": "Follow Up", "role": "PR Manager", "days": 2}, {"name": "Track", "role": "PR Manager", "days": 1}]'::jsonb,
    12
),
(
    'Crisis Communication Plan',
    'Marketing',
    '⚠️',
    'Create a crisis communication plan.',
    '[{"name": "Risk Assessment", "role": "PR Manager", "days": 2}, {"name": "Plan", "role": "PR Manager", "days": 3}, {"name": "Templates", "role": "PR Manager", "days": 2}, {"name": "Training", "role": "PR Manager", "days": 2}, {"name": "Review", "role": "CEO", "days": 1}]'::jsonb,
    10
),
(
    'Community Management Plan',
    'Marketing',
    '💬',
    'Create a community management plan.',
    '[{"name": "Audit", "role": "Community Manager", "days": 2}, {"name": "Strategy", "role": "Community Manager", "days": 2}, {"name": "Content", "role": "Content Writer", "days": 2}, {"name": "Engagement", "role": "Community Manager", "days": 3}, {"name": "Metrics", "role": "Community Manager", "days": 1}]'::jsonb,
    10
),
(
    'Customer Journey Mapping',
    'Marketing',
    '🗺️',
    'Create a customer journey map.',
    '[{"name": "Research", "role": "UX Researcher", "days": 3}, {"name": "Personas", "role": "UX Researcher", "days": 2}, {"name": "Journey Map", "role": "UX Designer", "days": 3}, {"name": "Review", "role": "Product Manager", "days": 1}, {"name": "Finalize", "role": "UX Designer", "days": 1}]'::jsonb,
    10
);

-- ============================================
-- SECTION 2: SALES (30+)
-- ============================================

INSERT INTO workflow_templates (name, category, icon, description, steps, estimated_days) VALUES

(
    'Sales Pitch Deck',
    'Sales',
    '📊',
    'Create a sales pitch deck.',
    '[{"name": "Research", "role": "Sales Manager", "days": 2}, {"name": "Content", "role": "Content Writer", "days": 2}, {"name": "Design", "role": "Designer", "days": 2}, {"name": "Review", "role": "Sales Manager", "days": 1}]'::jsonb,
    7
),
(
    'Sales Prospecting Strategy',
    'Sales',
    '🎯',
    'Create a sales prospecting strategy.',
    '[{"name": "Ideal Customer Profile", "role": "Sales Manager", "days": 2}, {"name": "Lead Generation", "role": "Sales Rep", "days": 3}, {"name": "Outreach", "role": "Sales Rep", "days": 3}, {"name": "Follow Up", "role": "Sales Rep", "days": 2}]'::jsonb,
    10
),
(
    'CRM Setup (Salesforce/HubSpot)',
    'Sales',
    '📋',
    'Setup a CRM for sales team.',
    '[{"name": "Requirements", "role": "Sales Manager", "days": 2}, {"name": "Setup", "role": "Tech", "days": 3}, {"name": "Migration", "role": "Sales Rep", "days": 2}, {"name": "Training", "role": "Sales Manager", "days": 2}, {"name": "Go-Live", "role": "Sales Manager", "days": 1}]'::jsonb,
    10
),
(
    'Sales Funnel Development',
    'Sales',
    '🔽',
    'Build and optimize a sales funnel.',
    '[{"name": "Analysis", "role": "Sales Manager", "days": 2}, {"name": "Design", "role": "Sales Manager", "days": 2}, {"name": "Implementation", "role": "Sales Manager", "days": 3}, {"name": "Testing", "role": "Sales Manager", "days": 2}, {"name": "Optimize", "role": "Sales Manager", "days": 2}]'::jsonb,
    11
),
(
    'Sales Script Writing',
    'Sales',
    '📝',
    'Write a sales script for the team.',
    '[{"name": "Research", "role": "Sales Manager", "days": 2}, {"name": "Draft", "role": "Copywriter", "days": 2}, {"name": "Review", "role": "Sales Manager", "days": 1}, {"name": "Test", "role": "Sales Rep", "days": 2}, {"name": "Refine", "role": "Copywriter", "days": 1}]'::jsonb,
    8
),
(
    'Cold Email Campaign',
    'Sales',
    '📧',
    'Create and send a cold email campaign.',
    '[{"name": "List", "role": "Sales Rep", "days": 2}, {"name": "Email Copy", "role": "Copywriter", "days": 2}, {"name": "Design", "role": "Designer", "days": 1}, {"name": "Send", "role": "Sales Rep", "days": 1}, {"name": "Follow Up", "role": "Sales Rep", "days": 2}, {"name": "Track", "role": "Data Analyst", "days": 1}]'::jsonb,
    9
),
(
    'LinkedIn Sales Outreach',
    'Sales',
    '💼',
    'Sales outreach through LinkedIn.',
    '[{"name": "Profile Optimization", "role": "Sales Rep", "days": 1}, {"name": "Lead List", "role": "Sales Rep", "days": 2}, {"name": "Connect", "role": "Sales Rep", "days": 3}, {"name": "Message", "role": "Sales Rep", "days": 2}, {"name": "Follow Up", "role": "Sales Rep", "days": 2}]'::jsonb,
    10
),
(
    'Sales Proposal Creation',
    'Sales',
    '📄',
    'Create a sales proposal.',
    '[{"name": "Requirements", "role": "Sales Rep", "days": 1}, {"name": "Scope", "role": "Sales Rep", "days": 1}, {"name": "Pricing", "role": "Sales Rep", "days": 1}, {"name": "Write", "role": "Sales Rep", "days": 2}, {"name": "Design", "role": "Designer", "days": 1}, {"name": "Send", "role": "Sales Rep", "days": 1}]'::jsonb,
    7
),
(
    'Renewal Strategy',
    'Sales',
    '🔄',
    'Create a client renewal strategy.',
    '[{"name": "Analysis", "role": "Sales Rep", "days": 2}, {"name": "Strategy", "role": "Sales Rep", "days": 2}, {"name": "Plan", "role": "Sales Rep", "days": 2}, {"name": "Execute", "role": "Sales Rep", "days": 3}, {"name": "Review", "role": "Sales Manager", "days": 1}]'::jsonb,
    10
),
(
    'Sales Forecasting',
    'Sales',
    '📈',
    'Create a sales forecast.',
    '[{"name": "Historical Data", "role": "Data Analyst", "days": 2}, {"name": "Pipeline Review", "role": "Sales Manager", "days": 2}, {"name": "Forecast", "role": "Sales Manager", "days": 2}, {"name": "Review", "role": "CEO", "days": 1}]'::jsonb,
    7
),
(
    'Customer Onboarding (Sales)',
    'Sales',
    '🤝',
    'Onboard new customers after sales.',
    '[{"name": "Welcome", "role": "Sales Rep", "days": 1}, {"name": "Setup", "role": "Tech", "days": 2}, {"name": "Training", "role": "Sales Rep", "days": 2}, {"name": "Check-in", "role": "Customer Success", "days": 2}, {"name": "Review", "role": "Sales Manager", "days": 1}]'::jsonb,
    8
),
(
    'Sales Territory Planning',
    'Sales',
    '🗺️',
    'Plan and allocate sales territories.',
    '[{"name": "Analysis", "role": "Sales Manager", "days": 2}, {"name": "Assignment", "role": "Sales Manager", "days": 2}, {"name": "Plan", "role": "Sales Manager", "days": 2}, {"name": "Review", "role": "Sales Manager", "days": 1}]'::jsonb,
    7
);

-- ============================================
-- SECTION 3: EDUCATION (30+)
-- ============================================

INSERT INTO workflow_templates (name, category, icon, description, steps, estimated_days) VALUES

(
    'Online Course Creation',
    'Education',
    '📚',
    'Create and publish an online course.',
    '[{"name": "Curriculum", "role": "Instructor", "days": 5}, {"name": "Script", "role": "Content Writer", "days": 3}, {"name": "Video", "role": "Videographer", "days": 4}, {"name": "Edit", "role": "Video Editor", "days": 3}, {"name": "Platform", "role": "Tech", "days": 2}, {"name": "Launch", "role": "Marketing Manager", "days": 2}]'::jsonb,
    19
),
(
    'Lesson Plan Creation',
    'Education',
    '📝',
    'Create a detailed lesson plan.',
    '[{"name": "Objectives", "role": "Teacher", "days": 1}, {"name": "Materials", "role": "Teacher", "days": 1}, {"name": "Activities", "role": "Teacher", "days": 2}, {"name": "Assessment", "role": "Teacher", "days": 1}, {"name": "Review", "role": "Teacher", "days": 1}]'::jsonb,
    6
),
(
    'Student Assessment Design',
    'Education',
    '📊',
    'Design a student assessment.',
    '[{"name": "Objectives", "role": "Teacher", "days": 1}, {"name": "Questions", "role": "Teacher", "days": 2}, {"name": "Rubric", "role": "Teacher", "days": 1}, {"name": "Review", "role": "Teacher", "days": 1}, {"name": "Pilot", "role": "Teacher", "days": 1}]'::jsonb,
    6
),
(
    'Curriculum Development',
    'Education',
    '📋',
    'Develop a complete curriculum.',
    '[{"name": "Research", "role": "Curriculum Developer", "days": 3}, {"name": "Framework", "role": "Curriculum Developer", "days": 3}, {"name": "Content", "role": "Content Writer", "days": 5}, {"name": "Review", "role": "Curriculum Developer", "days": 2}, {"name": "Pilot", "role": "Curriculum Developer", "days": 2}, {"name": "Finalize", "role": "Curriculum Developer", "days": 1}]'::jsonb,
    16
),
(
    'Webinar/Workshop Design',
    'Education',
    '🎓',
    'Design and deliver a webinar/workshop.',
    '[{"name": "Topic", "role": "Instructor", "days": 1}, {"name": "Content", "role": "Instructor", "days": 3}, {"name": "Slides", "role": "Designer", "days": 2}, {"name": "Promote", "role": "Marketing Manager", "days": 2}, {"name": "Deliver", "role": "Instructor", "days": 1}, {"name": "Follow Up", "role": "Instructor", "days": 1}]'::jsonb,
    10
),
(
    'Tutoring Session Plan',
    'Education',
    '📖',
    'Create a tutoring session plan.',
    '[{"name": "Assessment", "role": "Tutor", "days": 1}, {"name": "Plan", "role": "Tutor", "days": 1}, {"name": "Materials", "role": "Tutor", "days": 1}, {"name": "Session", "role": "Tutor", "days": 1}, {"name": "Feedback", "role": "Tutor", "days": 1}]'::jsonb,
    5
),
(
    'Academic Research Paper',
    'Education',
    '🔬',
    'Write an academic research paper.',
    '[{"name": "Hypothesis", "role": "Researcher", "days": 2}, {"name": "Research", "role": "Researcher", "days": 5}, {"name": "Experiments", "role": "Researcher", "days": 4}, {"name": "Analysis", "role": "Data Analyst", "days": 3}, {"name": "Write", "role": "Researcher", "days": 4}, {"name": "Review", "role": "Editor", "days": 2}, {"name": "Submit", "role": "Researcher", "days": 1}]'::jsonb,
    21
),
(
    'Student Internship Program',
    'Education',
    '💼',
    'Design a student internship program.',
    '[{"name": "Structure", "role": "Program Manager", "days": 3}, {"name": "Recruitment", "role": "HR", "days": 3}, {"name": "Training", "role": "Program Manager", "days": 2}, {"name": "Mentorship", "role": "Program Manager", "days": 3}, {"name": "Evaluation", "role": "Program Manager", "days": 2}]'::jsonb,
    13
),
(
    'School Event Planning',
    'Education',
    '🎉',
    'Plan a school event.',
    '[{"name": "Concept", "role": "Event Manager", "days": 2}, {"name": "Budget", "role": "Finance", "days": 2}, {"name": "Schedule", "role": "Event Manager", "days": 2}, {"name": "Activities", "role": "Event Manager", "days": 2}, {"name": "Execute", "role": "Event Manager", "days": 2}, {"name": "Feedback", "role": "Event Manager", "days": 1}]'::jsonb,
    11
),
(
    'Student Progress Report',
    'Education',
    '📊',
    'Create student progress reports.',
    '[{"name": "Data Collection", "role": "Teacher", "days": 2}, {"name": "Analysis", "role": "Teacher", "days": 2}, {"name": "Report", "role": "Teacher", "days": 2}, {"name": "Review", "role": "Teacher", "days": 1}, {"name": "Send", "role": "Teacher", "days": 1}]'::jsonb,
    8
);

-- ============================================
-- SECTION 4: HEALTH & FITNESS (25+)
-- ============================================

INSERT INTO workflow_templates (name, category, icon, description, steps, estimated_days) VALUES

(
    'Personal Training Program',
    'Health',
    '💪',
    'Create a personal training program.',
    '[{"name": "Assessment", "role": "Trainer", "days": 1}, {"name": "Goals", "role": "Trainer", "days": 1}, {"name": "Program", "role": "Trainer", "days": 2}, {"name": "Schedule", "role": "Trainer", "days": 1}, {"name": "Review", "role": "Trainer", "days": 1}]'::jsonb,
    6
),
(
    'Nutrition Plan',
    'Health',
    '🥗',
    'Create a personalized nutrition plan.',
    '[{"name": "Assessment", "role": "Nutritionist", "days": 1}, {"name": "Goals", "role": "Nutritionist", "days": 1}, {"name": "Plan", "role": "Nutritionist", "days": 2}, {"name": "Meals", "role": "Nutritionist", "days": 2}, {"name": "Review", "role": "Nutritionist", "days": 1}]'::jsonb,
    7
),
(
    'Fitness Challenge Program',
    'Health',
    '🏆',
    'Create a fitness challenge program.',
    '[{"name": "Concept", "role": "Trainer", "days": 2}, {"name": "Structure", "role": "Trainer", "days": 2}, {"name": "Exercises", "role": "Trainer", "days": 2}, {"name": "Tracking", "role": "Trainer", "days": 1}, {"name": "Launch", "role": "Trainer", "days": 1}, {"name": "Monitor", "role": "Trainer", "days": 2}]'::jsonb,
    10
),
(
    'Yoga Class Planning',
    'Health',
    '🧘',
    'Plan a yoga class sequence.',
    '[{"name": "Theme", "role": "Instructor", "days": 1}, {"name": "Sequencing", "role": "Instructor", "days": 1}, {"name": "Poses", "role": "Instructor", "days": 1}, {"name": "Music", "role": "Instructor", "days": 1}, {"name": "Class", "role": "Instructor", "days": 1}]'::jsonb,
    5
),
(
    'Meditation Program',
    'Health',
    '🧠',
    'Create a meditation program.',
    '[{"name": "Concept", "role": "Instructor", "days": 1}, {"name": "Scripts", "role": "Content Writer", "days": 2}, {"name": "Audio", "role": "Audio Engineer", "days": 2}, {"name": "Launch", "role": "Marketing Manager", "days": 1}]'::jsonb,
    6
),
(
    'Health Coaching Program',
    'Health',
    '👩‍⚕️',
    'Create a health coaching program.',
    '[{"name": "Assessment", "role": "Health Coach", "days": 2}, {"name": "Goals", "role": "Health Coach", "days": 1}, {"name": "Plan", "role": "Health Coach", "days": 3}, {"name": "Tools", "role": "Health Coach", "days": 2}, {"name": "Launch", "role": "Health Coach", "days": 1}, {"name": "Track", "role": "Health Coach", "days": 2}]'::jsonb,
    11
),
(
    'Wellness Workshop',
    'Health',
    '🌿',
    'Plan and deliver a wellness workshop.',
    '[{"name": "Topic", "role": "Wellness Coach", "days": 1}, {"name": "Content", "role": "Wellness Coach", "days": 2}, {"name": "Materials", "role": "Wellness Coach", "days": 1}, {"name": "Promote", "role": "Marketing Manager", "days": 2}, {"name": "Deliver", "role": "Wellness Coach", "days": 1}, {"name": "Feedback", "role": "Wellness Coach", "days": 1}]'::jsonb,
    8
),
(
    'Mental Health Program',
    'Health',
    '🧠',
    'Create a mental health program.',
    '[{"name": "Research", "role": "Psychologist", "days": 3}, {"name": "Content", "role": "Content Writer", "days": 3}, {"name": "Activities", "role": "Psychologist", "days": 2}, {"name": "Launch", "role": "Psychologist", "days": 2}, {"name": "Track", "role": "Psychologist", "days": 2}]'::jsonb,
    12
),
(
    'Fitness Video Production',
    'Health',
    '📹',
    'Produce a fitness workout video.',
    '[{"name": "Concept", "role": "Trainer", "days": 1}, {"name": "Script", "role": "Content Writer", "days": 1}, {"name": "Shoot", "role": "Videographer", "days": 1}, {"name": "Edit", "role": "Video Editor", "days": 2}, {"name": "Publish", "role": "Manager", "days": 1}]'::jsonb,
    6
),
(
    'Sports Training Program',
    'Health',
    '⚽',
    'Create a sports training program.',
    '[{"name": "Assessment", "role": "Coach", "days": 2}, {"name": "Program", "role": "Coach", "days": 3}, {"name": "Drills", "role": "Coach", "days": 2}, {"name": "Schedule", "role": "Coach", "days": 1}, {"name": "Review", "role": "Coach", "days": 1}]'::jsonb,
    9
);

-- ============================================
-- SECTION 5: PERSONAL & LIFESTYLE (30+)
-- ============================================

INSERT INTO workflow_templates (name, category, icon, description, steps, estimated_days) VALUES

(
    'Personal Budget Planning',
    'Personal',
    '💰',
    'Create a personal budget plan.',
    '[{"name": "Income", "role": "Individual", "days": 1}, {"name": "Expenses", "role": "Individual", "days": 1}, {"name": "Budget", "role": "Individual", "days": 1}, {"name": "Review", "role": "Individual", "days": 1}]'::jsonb,
    4
),
(
    'Goal Setting Plan',
    'Personal',
    '🎯',
    'Create a personal goal setting plan.',
    '[{"name": "Vision", "role": "Individual", "days": 1}, {"name": "Goals", "role": "Individual", "days": 1}, {"name": "Action Plan", "role": "Individual", "days": 1}, {"name": "Review", "role": "Individual", "days": 1}]'::jsonb,
    4
),
(
    'Daily Routine Optimization',
    'Personal',
    '⏰',
    'Create an optimized daily routine.',
    '[{"name": "Current Routine", "role": "Individual", "days": 1}, {"name": "Identify Gaps", "role": "Individual", "days": 1}, {"name": "New Routine", "role": "Individual", "days": 1}, {"name": "Implement", "role": "Individual", "days": 1}, {"name": "Review", "role": "Individual", "days": 1}]'::jsonb,
    5
),
(
    'Habit Building Program',
    'Personal',
    '🔄',
    'Create a habit building program.',
    '[{"name": "Identify Habits", "role": "Individual", "days": 1}, {"name": "Plan", "role": "Individual", "days": 1}, {"name": "Schedule", "role": "Individual", "days": 1}, {"name": "Track", "role": "Individual", "days": 1}, {"name": "Review", "role": "Individual", "days": 1}]'::jsonb,
    5
),
(
    'Wedding Planning',
    'Personal',
    '💒',
    'Plan a wedding.',
    '[{"name": "Budget", "role": "Planner", "days": 2}, {"name": "Venue", "role": "Planner", "days": 2}, {"name": "Guest List", "role": "Planner", "days": 2}, {"name": "Vendors", "role": "Planner", "days": 3}, {"name": "Schedule", "role": "Planner", "days": 2}, {"name": "Day-of", "role": "Planner", "days": 2}, {"name": "Post-Wedding", "role": "Planner", "days": 1}]'::jsonb,
    14
),
(
    'Baby Shower Planning',
    'Personal',
    '🎉',
    'Plan a baby shower.',
    '[{"name": "Budget", "role": "Planner", "days": 1}, {"name": "Venue", "role": "Planner", "days": 1}, {"name": "Guest List", "role": "Planner", "days": 1}, {"name": "Food", "role": "Planner", "days": 1}, {"name": "Games", "role": "Planner", "days": 1}, {"name": "Day-of", "role": "Planner", "days": 1}]'::jsonb,
    6
),
(
    'Home Renovation Plan',
    'Personal',
    '🔨',
    'Plan a home renovation project.',
    '[{"name": "Design", "role": "Designer", "days": 3}, {"name": "Budget", "role": "Individual", "days": 2}, {"name": "Contractor", "role": "Individual", "days": 2}, {"name": "Schedule", "role": "Individual", "days": 2}, {"name": "Execution", "role": "Contractor", "days": 5}, {"name": "Inspection", "role": "Individual", "days": 1}]'::jsonb,
    15
),
(
    'Moving/Relocation Plan',
    'Personal',
    '🚚',
    'Plan a home move.',
    '[{"name": "Timeline", "role": "Individual", "days": 1}, {"name": "Packing", "role": "Individual", "days": 3}, {"name": "Movers", "role": "Individual", "days": 2}, {"name": "Transfer Utilities", "role": "Individual", "days": 1}, {"name": "Unpack", "role": "Individual", "days": 2}]'::jsonb,
    9
),
(
    'Vacation Planning',
    'Personal',
    '✈️',
    'Plan a vacation trip.',
    '[{"name": "Destination", "role": "Individual", "days": 1}, {"name": "Budget", "role": "Individual", "days": 1}, {"name": "Bookings", "role": "Individual", "days": 2}, {"name": "Itinerary", "role": "Individual", "days": 2}, {"name": "Packing", "role": "Individual", "days": 1}]'::jsonb,
    7
),
(
    'Party Planning',
    'Personal',
    '🥳',
    'Plan a party or celebration.',
    '[{"name": "Theme", "role": "Planner", "days": 1}, {"name": "Budget", "role": "Planner", "days": 1}, {"name": "Guest List", "role": "Planner", "days": 1}, {"name": "Venue", "role": "Planner", "days": 1}, {"name": "Food", "role": "Planner", "days": 1}, {"name": "Decor", "role": "Planner", "days": 1}, {"name": "Day-of", "role": "Planner", "days": 1}]'::jsonb,
    7
),
(
    'Family Budget Planning',
    'Personal',
    '💰',
    'Create a family budget plan.',
    '[{"name": "Income", "role": "Individual", "days": 1}, {"name": "Expenses", "role": "Individual", "days": 1}, {"name": "Savings", "role": "Individual", "days": 1}, {"name": "Budget", "role": "Individual", "days": 1}, {"name": "Review", "role": "Individual", "days": 1}]'::jsonb,
    5
),
(
    'Personal Brand Development',
    'Personal',
    '🌟',
    'Build a personal brand.',
    '[{"name": "Define Niche", "role": "Individual", "days": 2}, {"name": "Content Strategy", "role": "Content Strategist", "days": 2}, {"name": "Social Media", "role": "Social Media Manager", "days": 3}, {"name": "Website", "role": "Designer", "days": 3}, {"name": "Networking", "role": "Individual", "days": 2}, {"name": "Launch", "role": "Individual", "days": 1}]'::jsonb,
    13
);

-- ============================================
-- FINAL VERIFICATION
-- ============================================
SELECT
    'TOTAL: ' || COUNT(*) || ' templates inserted.' AS message
FROM workflow_templates;
