-- ============================================
-- MIGRATION 005: SEED WORKFLOW TEMPLATES - PART 2
-- ============================================
-- Categories: Tech, Software, AI, Data Science, Gaming
-- Total: 250+ workflows

-- ============================================
-- SECTION 1: WEB DEVELOPMENT (40+)
-- ============================================

INSERT INTO workflow_templates (name, category, icon, description, steps, estimated_days) VALUES

(
    'Landing Page Development',
    'Tech',
    '🎯',
    'Build a high-converting landing page.',
    '[{"name": "Design", "role": "Designer", "days": 2}, {"name": "HTML/CSS", "role": "Frontend Dev", "days": 2}, {"name": "JavaScript", "role": "Frontend Dev", "days": 1}, {"name": "Forms", "role": "Backend Dev", "days": 1}, {"name": "Testing", "role": "QA", "days": 1}, {"name": "Deploy", "role": "DevOps", "days": 1}]'::jsonb,
    8
),
(
    'WordPress Website Setup',
    'Tech',
    '🌐',
    'Setup a WordPress website with theme.',
    '[{"name": "Hosting Setup", "role": "DevOps", "days": 1}, {"name": "Install WordPress", "role": "Tech", "days": 1}, {"name": "Theme Setup", "role": "Designer", "days": 2}, {"name": "Pages", "role": "Content Writer", "days": 2}, {"name": "Plugins", "role": "Tech", "days": 1}, {"name": "Testing", "role": "QA", "days": 1}]'::jsonb,
    8
),
(
    'Custom WordPress Theme Development',
    'Tech',
    '🎨',
    'Build a custom WordPress theme from scratch.',
    '[{"name": "Design", "role": "Designer", "days": 3}, {"name": "HTML Template", "role": "Frontend Dev", "days": 3}, {"name": "PHP Integration", "role": "Backend Dev", "days": 4}, {"name": "Custom Fields", "role": "Backend Dev", "days": 2}, {"name": "Testing", "role": "QA", "days": 2}, {"name": "Deploy", "role": "DevOps", "days": 1}]'::jsonb,
    15
),
(
    'React.js Single Page App',
    'Tech',
    '⚛️',
    'Build a React.js single page application.',
    '[{"name": "UI Design", "role": "Designer", "days": 2}, {"name": "Component Structure", "role": "React Dev", "days": 2}, {"name": "Development", "role": "React Dev", "days": 5}, {"name": "State Management", "role": "React Dev", "days": 2}, {"name": "Testing", "role": "QA", "days": 2}, {"name": "Deploy", "role": "DevOps", "days": 1}]'::jsonb,
    14
),
(
    'Next.js Full Stack App',
    'Tech',
    '🚀',
    'Build a full stack app using Next.js.',
    '[{"name": "Design", "role": "Designer", "days": 3}, {"name": "Frontend", "role": "Next.js Dev", "days": 5}, {"name": "API Routes", "role": "Node Dev", "days": 4}, {"name": "Database", "role": "DB Admin", "days": 2}, {"name": "Auth", "role": "Backend Dev", "days": 2}, {"name": "Testing", "role": "QA", "days": 2}, {"name": "Deploy", "role": "DevOps", "days": 1}]'::jsonb,
    19
),
(
    'Vue.js Dashboard',
    'Tech',
    '📊',
    'Build a dashboard using Vue.js.',
    '[{"name": "Design", "role": "Designer", "days": 2}, {"name": "Development", "role": "Vue Dev", "days": 4}, {"name": "Charts", "role": "Vue Dev", "days": 2}, {"name": "API Integration", "role": "Backend Dev", "days": 2}, {"name": "Testing", "role": "QA", "days": 2}, {"name": "Deploy", "role": "DevOps", "days": 1}]'::jsonb,
    13
),
(
    'REST API Development',
    'Tech',
    '🔌',
    'Build a REST API with Node.js/Express.',
    '[{"name": "Design API", "role": "Backend Dev", "days": 2}, {"name": "Models", "role": "Backend Dev", "days": 2}, {"name": "Endpoints", "role": "Backend Dev", "days": 4}, {"name": "Validation", "role": "Backend Dev", "days": 2}, {"name": "Testing", "role": "QA", "days": 2}, {"name": "Docs", "role": "Technical Writer", "days": 2}]'::jsonb,
    14
),
(
    'GraphQL API',
    'Tech',
    '📡',
    'Build a GraphQL API with Apollo.',
    '[{"name": "Schema Design", "role": "Backend Dev", "days": 2}, {"name": "Resolvers", "role": "Backend Dev", "days": 3}, {"name": "Models", "role": "Backend Dev", "days": 2}, {"name": "Auth", "role": "Backend Dev", "days": 2}, {"name": "Testing", "role": "QA", "days": 2}, {"name": "Docs", "role": "Technical Writer", "days": 2}]'::jsonb,
    13
),
(
    'E-commerce Website',
    'Tech',
    '🛒',
    'Build a full e-commerce website.',
    '[{"name": "Design", "role": "Designer", "days": 4}, {"name": "Frontend", "role": "Frontend Dev", "days": 6}, {"name": "Backend", "role": "Backend Dev", "days": 6}, {"name": "Payment Integration", "role": "Backend Dev", "days": 3}, {"name": "Inventory", "role": "Backend Dev", "days": 2}, {"name": "Testing", "role": "QA", "days": 3}, {"name": "Deploy", "role": "DevOps", "days": 2}]'::jsonb,
    26
),
(
    'Job Board Platform',
    'Tech',
    '💼',
    'Build a job board platform.',
    '[{"name": "Design", "role": "Designer", "days": 3}, {"name": "Frontend", "role": "Frontend Dev", "days": 5}, {"name": "Backend", "role": "Backend Dev", "days": 5}, {"name": "Search", "role": "Backend Dev", "days": 3}, {"name": "Auth", "role": "Backend Dev", "days": 2}, {"name": "Testing", "role": "QA", "days": 2}, {"name": "Deploy", "role": "DevOps", "days": 1}]'::jsonb,
    21
),
(
    'Real Estate Listing Platform',
    'Tech',
    '🏠',
    'Build a real estate listing platform.',
    '[{"name": "Design", "role": "Designer", "days": 3}, {"name": "Frontend", "role": "Frontend Dev", "days": 5}, {"name": "Backend", "role": "Backend Dev", "days": 5}, {"name": "Maps Integration", "role": "Frontend Dev", "days": 2}, {"name": "Search", "role": "Backend Dev", "days": 3}, {"name": "Testing", "role": "QA", "days": 2}, {"name": "Deploy", "role": "DevOps", "days": 1}]'::jsonb,
    21
),
(
    'Learning Management System (LMS)',
    'Tech',
    '🎓',
    'Build an LMS platform.',
    '[{"name": "Design", "role": "Designer", "days": 4}, {"name": "Frontend", "role": "Frontend Dev", "days": 6}, {"name": "Backend", "role": "Backend Dev", "days": 6}, {"name": "Video Integration", "role": "Backend Dev", "days": 2}, {"name": "Quizzes", "role": "Backend Dev", "days": 3}, {"name": "Testing", "role": "QA", "days": 3}, {"name": "Deploy", "role": "DevOps", "days": 2}]'::jsonb,
    26
),
(
    'Booking/Appointment System',
    'Tech',
    '📅',
    'Build a booking and appointment system.',
    '[{"name": "Design", "role": "Designer", "days": 2}, {"name": "Frontend", "role": "Frontend Dev", "days": 4}, {"name": "Backend", "role": "Backend Dev", "days": 4}, {"name": "Calendar", "role": "Frontend Dev", "days": 2}, {"name": "Payment", "role": "Backend Dev", "days": 2}, {"name": "Testing", "role": "QA", "days": 2}, {"name": "Deploy", "role": "DevOps", "days": 1}]'::jsonb,
    17
),
(
    'Chat Application',
    'Tech',
    '💬',
    'Build a real-time chat application.',
    '[{"name": "Design", "role": "Designer", "days": 2}, {"name": "Frontend", "role": "Frontend Dev", "days": 3}, {"name": "Backend", "role": "Backend Dev", "days": 3}, {"name": "WebSocket", "role": "Backend Dev", "days": 2}, {"name": "Auth", "role": "Backend Dev", "days": 2}, {"name": "Testing", "role": "QA", "days": 2}, {"name": "Deploy", "role": "DevOps", "days": 1}]'::jsonb,
    15
),
(
    'Blog Platform',
    'Tech',
    '📝',
    'Build a custom blog platform.',
    '[{"name": "Design", "role": "Designer", "days": 2}, {"name": "Frontend", "role": "Frontend Dev", "days": 3}, {"name": "Backend", "role": "Backend Dev", "days": 3}, {"name": "Auth", "role": "Backend Dev", "days": 2}, {"name": "Testing", "role": "QA", "days": 2}, {"name": "Deploy", "role": "DevOps", "days": 1}]'::jsonb,
    13
),
(
    'Portfolio Website',
    'Tech',
    '🖥️',
    'Build a personal portfolio website.',
    '[{"name": "Design", "role": "Designer", "days": 2}, {"name": "Development", "role": "Frontend Dev", "days": 3}, {"name": "Animations", "role": "Frontend Dev", "days": 1}, {"name": "Content", "role": "Content Writer", "days": 1}, {"name": "Testing", "role": "QA", "days": 1}, {"name": "Deploy", "role": "DevOps", "days": 1}]'::jsonb,
    9
);

-- ============================================
-- SECTION 2: MOBILE APP DEVELOPMENT (30+)
-- ============================================

INSERT INTO workflow_templates (name, category, icon, description, steps, estimated_days) VALUES

(
    'React Native App',
    'Tech',
    '📱',
    'Build a mobile app using React Native.',
    '[{"name": "Design", "role": "Designer", "days": 3}, {"name": "Setup", "role": "React Native Dev", "days": 2}, {"name": "Development", "role": "React Native Dev", "days": 6}, {"name": "API Integration", "role": "Backend Dev", "days": 2}, {"name": "Testing", "role": "QA", "days": 2}, {"name": "Store Submission", "role": "Manager", "days": 2}]'::jsonb,
    17
),
(
    'Flutter App',
    'Tech',
    '🦋',
    'Build a mobile app using Flutter.',
    '[{"name": "Design", "role": "Designer", "days": 3}, {"name": "Setup", "role": "Flutter Dev", "days": 2}, {"name": "Development", "role": "Flutter Dev", "days": 6}, {"name": "API Integration", "role": "Backend Dev", "days": 2}, {"name": "Testing", "role": "QA", "days": 2}, {"name": "Store Submission", "role": "Manager", "days": 2}]'::jsonb,
    17
),
(
    'iOS App (Swift)',
    'Tech',
    '🍎',
    'Build an iOS app using Swift.',
    '[{"name": "Design", "role": "Designer", "days": 3}, {"name": "Setup", "role": "iOS Dev", "days": 2}, {"name": "Development", "role": "iOS Dev", "days": 6}, {"name": "API Integration", "role": "Backend Dev", "days": 2}, {"name": "Testing", "role": "QA", "days": 2}, {"name": "App Store", "role": "Manager", "days": 2}]'::jsonb,
    17
),
(
    'Android App (Kotlin)',
    'Tech',
    '🤖',
    'Build an Android app using Kotlin.',
    '[{"name": "Design", "role": "Designer", "days": 3}, {"name": "Setup", "role": "Android Dev", "days": 2}, {"name": "Development", "role": "Android Dev", "days": 6}, {"name": "API Integration", "role": "Backend Dev", "days": 2}, {"name": "Testing", "role": "QA", "days": 2}, {"name": "Play Store", "role": "Manager", "days": 2}]'::jsonb,
    17
),
(
    'Cross-Platform App (Xamarin)',
    'Tech',
    '🔄',
    'Build a cross-platform app using Xamarin.',
    '[{"name": "Design", "role": "Designer", "days": 3}, {"name": "Setup", "role": "Xamarin Dev", "days": 2}, {"name": "Development", "role": "Xamarin Dev", "days": 6}, {"name": "Testing", "role": "QA", "days": 2}, {"name": "Store Submission", "role": "Manager", "days": 2}]'::jsonb,
    15
),
(
    'App Maintenance & Updates',
    'Tech',
    '🔄',
    'Ongoing maintenance and updates for an app.',
    '[{"name": "Bug Analysis", "role": "Developer", "days": 1}, {"name": "Fix Bugs", "role": "Developer", "days": 2}, {"name": "Testing", "role": "QA", "days": 1}, {"name": "Store Update", "role": "Manager", "days": 1}]'::jsonb,
    5
),
(
    'App Store Optimization (ASO)',
    'Tech',
    '📈',
    'Optimize app store listing for visibility.',
    '[{"name": "Keyword Research", "role": "ASO Specialist", "days": 1}, {"name": "Title & Description", "role": "Copywriter", "days": 1}, {"name": "Screenshots", "role": "Designer", "days": 2}, {"name": "Review", "role": "Manager", "days": 1}]'::jsonb,
    5
);

-- ============================================
-- SECTION 3: AI & MACHINE LEARNING (30+)
-- ============================================

INSERT INTO workflow_templates (name, category, icon, description, steps, estimated_days) VALUES

(
    'Chatbot Development',
    'AI',
    '🤖',
    'Build a chatbot using Rasa or Dialogflow.',
    '[{"name": "Requirements", "role": "AI Engineer", "days": 2}, {"name": "Train Data", "role": "AI Engineer", "days": 3}, {"name": "Model", "role": "AI Engineer", "days": 4}, {"name": "Integration", "role": "Backend Dev", "days": 2}, {"name": "Testing", "role": "QA", "days": 2}, {"name": "Deploy", "role": "DevOps", "days": 1}]'::jsonb,
    14
),
(
    'Image Classification Model',
    'AI',
    '🖼️',
    'Train an image classification model.',
    '[{"name": "Data Collection", "role": "Data Scientist", "days": 3}, {"name": "Annotation", "role": "Data Scientist", "days": 4}, {"name": "Model Training", "role": "ML Engineer", "days": 4}, {"name": "Evaluation", "role": "ML Engineer", "days": 2}, {"name": "Deployment", "role": "DevOps", "days": 2}]'::jsonb,
    15
),
(
    'Natural Language Processing (NLP)',
    'AI',
    '🧠',
    'Build an NLP model for text analysis.',
    '[{"name": "Data Collection", "role": "Data Scientist", "days": 3}, {"name": "Preprocessing", "role": "Data Scientist", "days": 2}, {"name": "Model", "role": "ML Engineer", "days": 4}, {"name": "Evaluation", "role": "ML Engineer", "days": 2}, {"name": "Deploy", "role": "DevOps", "days": 2}]'::jsonb,
    13
),
(
    'Recommendation System',
    'AI',
    '🎯',
    'Build a product recommendation engine.',
    '[{"name": "Data Collection", "role": "Data Scientist", "days": 3}, {"name": "Feature Engineering", "role": "Data Scientist", "days": 2}, {"name": "Model", "role": "ML Engineer", "days": 4}, {"name": "Evaluation", "role": "ML Engineer", "days": 2}, {"name": "Integration", "role": "Backend Dev", "days": 2}, {"name": "Deploy", "role": "DevOps", "days": 1}]'::jsonb,
    14
),
(
    'Predictive Analytics Model',
    'AI',
    '📊',
    'Build a predictive analytics model.',
    '[{"name": "Data Collection", "role": "Data Scientist", "days": 3}, {"name": "EDA", "role": "Data Scientist", "days": 2}, {"name": "Model", "role": "ML Engineer", "days": 4}, {"name": "Validation", "role": "ML Engineer", "days": 2}, {"name": "Deploy", "role": "DevOps", "days": 2}]'::jsonb,
    13
),
(
    'Generative AI (Images)',
    'AI',
    '🎨',
    'Build a generative AI model for images.',
    '[{"name": "Data Collection", "role": "Data Scientist", "days": 4}, {"name": "Model", "role": "ML Engineer", "days": 5}, {"name": "Training", "role": "ML Engineer", "days": 5}, {"name": "Evaluation", "role": "ML Engineer", "days": 2}, {"name": "Deploy", "role": "DevOps", "days": 2}]'::jsonb,
    18
),
(
    'LLM Fine-Tuning',
    'AI',
    '🧠',
    'Fine-tune a large language model.',
    '[{"name": "Dataset Prep", "role": "Data Scientist", "days": 4}, {"name": "Fine-Tuning", "role": "ML Engineer", "days": 5}, {"name": "Evaluation", "role": "ML Engineer", "days": 3}, {"name": "Deploy", "role": "DevOps", "days": 2}]'::jsonb,
    14
),
(
    'Sentiment Analysis',
    'AI',
    '😊',
    'Build a sentiment analysis model.',
    '[{"name": "Data Collection", "role": "Data Scientist", "days": 2}, {"name": "Preprocessing", "role": "Data Scientist", "days": 2}, {"name": "Model", "role": "ML Engineer", "days": 3}, {"name": "Evaluation", "role": "ML Engineer", "days": 2}, {"name": "Deploy", "role": "DevOps", "days": 1}]'::jsonb,
    10
),
(
    'Speech Recognition',
    'AI',
    '🗣️',
    'Build a speech recognition system.',
    '[{"name": "Data Collection", "role": "Data Scientist", "days": 3}, {"name": "Preprocessing", "role": "Data Scientist", "days": 2}, {"name": "Model", "role": "ML Engineer", "days": 5}, {"name": "Evaluation", "role": "ML Engineer", "days": 2}, {"name": "Deploy", "role": "DevOps", "days": 2}]'::jsonb,
    14
),
(
    'Computer Vision (Object Detection)',
    'AI',
    '👁️',
    'Build an object detection system.',
    '[{"name": "Data Collection", "role": "Data Scientist", "days": 3}, {"name": "Annotation", "role": "Data Scientist", "days": 4}, {"name": "Model", "role": "ML Engineer", "days": 5}, {"name": "Evaluation", "role": "ML Engineer", "days": 2}, {"name": "Deploy", "role": "DevOps", "days": 2}]'::jsonb,
    16
);

-- ============================================
-- SECTION 4: DATA SCIENCE & ANALYTICS (30+)
-- ============================================

INSERT INTO workflow_templates (name, category, icon, description, steps, estimated_days) VALUES

(
    'Data Analysis Dashboard',
    'Data',
    '📊',
    'Create a data analysis dashboard in Tableau/Power BI.',
    '[{"name": "Data Collection", "role": "Data Analyst", "days": 2}, {"name": "Data Cleaning", "role": "Data Analyst", "days": 2}, {"name": "Dashboard Design", "role": "Data Analyst", "days": 3}, {"name": "Implementation", "role": "Data Analyst", "days": 2}, {"name": "Review", "role": "Manager", "days": 1}]'::jsonb,
    10
),
(
    'ETL Pipeline Development',
    'Data',
    '🔁',
    'Build an ETL pipeline for data integration.',
    '[{"name": "Requirements", "role": "Data Engineer", "days": 2}, {"name": "Extract", "role": "Data Engineer", "days": 2}, {"name": "Transform", "role": "Data Engineer", "days": 3}, {"name": "Load", "role": "Data Engineer", "days": 2}, {"name": "Testing", "role": "QA", "days": 2}, {"name": "Deploy", "role": "DevOps", "days": 1}]'::jsonb,
    12
),
(
    'Data Warehousing Solution',
    'Data',
    '🏗️',
    'Design and implement a data warehouse.',
    '[{"name": "Requirements", "role": "Data Architect", "days": 3}, {"name": "Design Schema", "role": "Data Architect", "days": 3}, {"name": "Implementation", "role": "Data Engineer", "days": 5}, {"name": "Testing", "role": "QA", "days": 2}, {"name": "Documentation", "role": "Technical Writer", "days": 2}]'::jsonb,
    15
),
(
    'Business Intelligence Setup',
    'Data',
    '📈',
    'Setup a BI solution with reporting.',
    '[{"name": "Requirements", "role": "Data Analyst", "days": 2}, {"name": "Data Integration", "role": "Data Engineer", "days": 3}, {"name": "Reports", "role": "Data Analyst", "days": 4}, {"name": "Training", "role": "Data Analyst", "days": 2}, {"name": "Go-Live", "role": "Manager", "days": 1}]'::jsonb,
    12
),
(
    'Data Migration Project',
    'Data',
    '🗄️',
    'Migrate data from one system to another.',
    '[{"name": "Audit", "role": "Data Engineer", "days": 2}, {"name": "Mapping", "role": "Data Engineer", "days": 3}, {"name": "Backup", "role": "DB Admin", "days": 1}, {"name": "Migration", "role": "Data Engineer", "days": 3}, {"name": "Validation", "role": "QA", "days": 2}, {"name": "Go-Live", "role": "Manager", "days": 1}]'::jsonb,
    12
),
(
    'Database Design',
    'Data',
    '📐',
    'Design a database schema for an application.',
    '[{"name": "Requirements", "role": "DB Admin", "days": 2}, {"name": "ERD", "role": "DB Admin", "days": 2}, {"name": "Normalization", "role": "DB Admin", "days": 2}, {"name": "Indexes", "role": "DB Admin", "days": 1}, {"name": "Documentation", "role": "Technical Writer", "days": 1}]'::jsonb,
    8
),
(
    'Data Quality Assessment',
    'Data',
    '✅',
    'Assess and improve data quality.',
    '[{"name": "Data Audit", "role": "Data Analyst", "days": 2}, {"name": "Quality Metrics", "role": "Data Analyst", "days": 2}, {"name": "Report", "role": "Data Analyst", "days": 2}, {"name": "Recommendations", "role": "Data Analyst", "days": 1}]'::jsonb,
    7
),
(
    'A/B Testing Analysis',
    'Data',
    '🧪',
    'Analyze A/B test results.',
    '[{"name": "Test Design", "role": "Data Scientist", "days": 2}, {"name": "Data Collection", "role": "Data Analyst", "days": 2}, {"name": "Analysis", "role": "Data Scientist", "days": 2}, {"name": "Report", "role": "Data Scientist", "days": 1}]'::jsonb,
    7
);

-- ============================================
-- SECTION 5: BLOCKCHAIN & CRYPTO (15+)
-- ============================================

INSERT INTO workflow_templates (name, category, icon, description, steps, estimated_days) VALUES

(
    'Smart Contract Development',
    'Blockchain',
    '📜',
    'Develop a smart contract on Ethereum.',
    '[{"name": "Requirements", "role": "Blockchain Dev", "days": 2}, {"name": "Contract Design", "role": "Blockchain Dev", "days": 2}, {"name": "Development", "role": "Blockchain Dev", "days": 4}, {"name": "Testing", "role": "QA", "days": 2}, {"name": "Deployment", "role": "Blockchain Dev", "days": 1}]'::jsonb,
    11
),
(
    'DApp Development',
    'Blockchain',
    '🌐',
    'Build a decentralized application (DApp).',
    '[{"name": "Requirements", "role": "Blockchain Dev", "days": 3}, {"name": "Design", "role": "Designer", "days": 3}, {"name": "Smart Contracts", "role": "Blockchain Dev", "days": 5}, {"name": "Frontend", "role": "Frontend Dev", "days": 5}, {"name": "Testing", "role": "QA", "days": 2}, {"name": "Deploy", "role": "Blockchain Dev", "days": 2}]'::jsonb,
    20
),
(
    'Token/Coin Creation',
    'Blockchain',
    '🪙',
    'Create an ERC-20 token.',
    '[{"name": "Tokenomics", "role": "Blockchain Dev", "days": 2}, {"name": "Contract", "role": "Blockchain Dev", "days": 2}, {"name": "Testing", "role": "QA", "days": 2}, {"name": "Deploy", "role": "Blockchain Dev", "days": 1}, {"name": "Audit", "role": "Auditor", "days": 2}]'::jsonb,
    9
),
(
    'NFT Collection Launch',
    'Blockchain',
    '🎨',
    'Launch an NFT collection.',
    '[{"name": "Concept", "role": "Creative", "days": 3}, {"name": "Art", "role": "Designer", "days": 5}, {"name": "Smart Contract", "role": "Blockchain Dev", "days": 3}, {"name": "Minting", "role": "Blockchain Dev", "days": 2}, {"name": "Marketing", "role": "Marketing Manager", "days": 3}, {"name": "Launch", "role": "Manager", "days": 1}]'::jsonb,
    17
),
(
    'DeFi Platform Development',
    'Blockchain',
    '💰',
    'Build a DeFi platform.',
    '[{"name": "Requirements", "role": "Blockchain Dev", "days": 4}, {"name": "Smart Contracts", "role": "Blockchain Dev", "days": 6}, {"name": "Frontend", "role": "Frontend Dev", "days": 4}, {"name": "Testing", "role": "QA", "days": 3}, {"name": "Audit", "role": "Auditor", "days": 3}, {"name": "Deploy", "role": "Blockchain Dev", "days": 2}]'::jsonb,
    22
),
(
    'Crypto Wallet Setup',
    'Blockchain',
    '👛',
    'Setup a crypto wallet for a user.',
    '[{"name": "Requirements", "role": "Blockchain Dev", "days": 1}, {"name": "Development", "role": "Blockchain Dev", "days": 3}, {"name": "Security Audit", "role": "Auditor", "days": 2}, {"name": "Testing", "role": "QA", "days": 1}, {"name": "Deploy", "role": "Blockchain Dev", "days": 1}]'::jsonb,
    8
);

-- ============================================
-- SECTION 6: DEVOPS & CLOUD (25+)
-- ============================================

INSERT INTO workflow_templates (name, category, icon, description, steps, estimated_days) VALUES

(
    'CI/CD Pipeline Setup',
    'DevOps',
    '🔧',
    'Setup CI/CD pipeline with GitHub Actions.',
    '[{"name": "Requirements", "role": "DevOps", "days": 1}, {"name": "Setup CI", "role": "DevOps", "days": 2}, {"name": "Setup CD", "role": "DevOps", "days": 2}, {"name": "Testing", "role": "QA", "days": 1}, {"name": "Deploy", "role": "DevOps", "days": 1}]'::jsonb,
    7
),
(
    'Dockerization',
    'DevOps',
    '🐳',
    'Containerize an application with Docker.',
    '[{"name": "Analysis", "role": "DevOps", "days": 1}, {"name": "Dockerfile", "role": "DevOps", "days": 1}, {"name": "Testing", "role": "DevOps", "days": 1}, {"name": "Registry", "role": "DevOps", "days": 1}, {"name": "Documentation", "role": "DevOps", "days": 1}]'::jsonb,
    5
),
(
    'Kubernetes Cluster Setup',
    'DevOps',
    '☸️',
    'Setup a Kubernetes cluster.',
    '[{"name": "Requirements", "role": "DevOps", "days": 2}, {"name": "Cluster Setup", "role": "DevOps", "days": 3}, {"name": "Deployment", "role": "DevOps", "days": 2}, {"name": "Monitoring", "role": "DevOps", "days": 2}, {"name": "Testing", "role": "QA", "days": 1}]'::jsonb,
    10
),
(
    'AWS Infrastructure Setup',
    'DevOps',
    '☁️',
    'Setup infrastructure on AWS.',
    '[{"name": "Requirements", "role": "DevOps", "days": 2}, {"name": "VPC Setup", "role": "DevOps", "days": 2}, {"name": "EC2 Setup", "role": "DevOps", "days": 2}, {"name": "RDS Setup", "role": "DevOps", "days": 2}, {"name": "S3 Setup", "role": "DevOps", "days": 1}, {"name": "Testing", "role": "QA", "days": 1}]'::jsonb,
    10
),
(
    'Azure Cloud Migration',
    'DevOps',
    '☁️',
    'Migrate application to Azure.',
    '[{"name": "Assessment", "role": "DevOps", "days": 3}, {"name": "Plan", "role": "DevOps", "days": 2}, {"name": "Migration", "role": "DevOps", "days": 4}, {"name": "Testing", "role": "QA", "days": 2}, {"name": "Go-Live", "role": "DevOps", "days": 1}]'::jsonb,
    12
),
(
    'Google Cloud Platform Setup',
    'DevOps',
    '☁️',
    'Setup infrastructure on GCP.',
    '[{"name": "Requirements", "role": "DevOps", "days": 2}, {"name": "Compute Setup", "role": "DevOps", "days": 2}, {"name": "Storage Setup", "role": "DevOps", "days": 2}, {"name": "Database Setup", "role": "DevOps", "days": 2}, {"name": "Testing", "role": "QA", "days": 1}]'::jsonb,
    9
),
(
    'Serverless Architecture Setup',
    'DevOps',
    '⚡',
    'Setup serverless architecture (AWS Lambda).',
    '[{"name": "Requirements", "role": "DevOps", "days": 2}, {"name": "Lambda Functions", "role": "DevOps", "days": 3}, {"name": "API Gateway", "role": "DevOps", "days": 2}, {"name": "Testing", "role": "QA", "days": 2}, {"name": "Deploy", "role": "DevOps", "days": 1}]'::jsonb,
    10
),
(
    'Infrastructure as Code (Terraform)',
    'DevOps',
    '🏗️',
    'Setup infrastructure using Terraform.',
    '[{"name": "Requirements", "role": "DevOps", "days": 2}, {"name": "Write Terraform", "role": "DevOps", "days": 3}, {"name": "Testing", "role": "DevOps", "days": 2}, {"name": "Apply", "role": "DevOps", "days": 1}, {"name": "Documentation", "role": "DevOps", "days": 1}]'::jsonb,
    9
),
(
    'Monitoring & Alerting Setup',
    'DevOps',
    '📊',
    'Setup monitoring with Prometheus & Grafana.',
    '[{"name": "Requirements", "role": "DevOps", "days": 1}, {"name": "Setup Prometheus", "role": "DevOps", "days": 2}, {"name": "Setup Grafana", "role": "DevOps", "days": 2}, {"name": "Dashboards", "role": "DevOps", "days": 2}, {"name": "Alerts", "role": "DevOps", "days": 1}]'::jsonb,
    8
),
(
    'Logging Setup (ELK Stack)',
    'DevOps',
    '📝',
    'Setup logging with Elasticsearch, Logstash, Kibana.',
    '[{"name": "Requirements", "role": "DevOps", "days": 1}, {"name": "Setup ELK", "role": "DevOps", "days": 3}, {"name": "Configuration", "role": "DevOps", "days": 2}, {"name": "Testing", "role": "QA", "days": 1}, {"name": "Documentation", "role": "DevOps", "days": 1}]'::jsonb,
    8
),
(
    'Security Audit & Hardening',
    'DevOps',
    '🔒',
    'Security audit and hardening of infrastructure.',
    '[{"name": "Assessment", "role": "Security Engineer", "days": 2}, {"name": "Vulnerability Scan", "role": "Security Engineer", "days": 2}, {"name": "Hardening", "role": "DevOps", "days": 3}, {"name": "Testing", "role": "QA", "days": 1}, {"name": "Report", "role": "Security Engineer", "days": 1}]'::jsonb,
    9
),
(
    'Disaster Recovery Setup',
    'DevOps',
    '🔄',
    'Setup disaster recovery and backup plan.',
    '[{"name": "Assessment", "role": "DevOps", "days": 2}, {"name": "Backup Plan", "role": "DevOps", "days": 2}, {"name": "Implementation", "role": "DevOps", "days": 3}, {"name": "Testing", "role": "QA", "days": 2}, {"name": "Documentation", "role": "DevOps", "days": 1}]'::jsonb,
    10
);

-- ============================================
-- VERIFICATION
-- ============================================
SELECT
    'PART 2: ' || COUNT(*) || ' templates inserted.' AS message
FROM workflow_templates;
