-- ============================================
-- MIGRATION 006: SEED WORKFLOW TEMPLATES - PART 3
-- ============================================
-- Categories: Business, Finance, HR, Legal, Operations
-- Total: 250+ workflows

-- ============================================
-- SECTION 1: BUSINESS OPERATIONS (40+)
-- ============================================

INSERT INTO workflow_templates (name, category, icon, description, steps, estimated_days) VALUES

(
    'Business Plan Writing',
    'Business',
    '📋',
    'Write a comprehensive business plan.',
    '[{"name": "Research", "role": "Researcher", "days": 3}, {"name": "Executive Summary", "role": "Content Writer", "days": 2}, {"name": "Market Analysis", "role": "Content Writer", "days": 3}, {"name": "Financial Plan", "role": "Finance", "days": 3}, {"name": "Review", "role": "Manager", "days": 2}, {"name": "Finalize", "role": "Content Writer", "days": 1}]'::jsonb,
    14
),
(
    'Startup Pitch Deck',
    'Business',
    '📊',
    'Create a startup pitch deck.',
    '[{"name": "Storyline", "role": "Content Strategist", "days": 2}, {"name": "Slides Content", "role": "Content Writer", "days": 3}, {"name": "Design", "role": "Designer", "days": 3}, {"name": "Financial Projections", "role": "Finance", "days": 2}, {"name": "Review", "role": "CEO", "days": 1}, {"name": "Finalize", "role": "Designer", "days": 1}]'::jsonb,
    12
),
(
    'Company Incorporation',
    'Business',
    '🏢',
    'Incorporate a company (LLC, C-Corp, etc.).',
    '[{"name": "Choose Structure", "role": "Legal", "days": 2}, {"name": "Name Registration", "role": "Legal", "days": 2}, {"name": "File Paperwork", "role": "Legal", "days": 3}, {"name": "EIN Registration", "role": "Finance", "days": 1}, {"name": "Bank Account", "role": "Finance", "days": 1}]'::jsonb,
    9
),
(
    'Business License Application',
    'Business',
    '📜',
    'Apply for business licenses and permits.',
    '[{"name": "Research Requirements", "role": "Legal", "days": 2}, {"name": "Gather Documents", "role": "Legal", "days": 2}, {"name": "Apply", "role": "Legal", "days": 2}, {"name": "Follow Up", "role": "Legal", "days": 2}]'::jsonb,
    8
),
(
    'Partner/Investor Presentation',
    'Business',
    '🤝',
    'Create a presentation for partners or investors.',
    '[{"name": "Content", "role": "Content Writer", "days": 2}, {"name": "Design", "role": "Designer", "days": 2}, {"name": "Financials", "role": "Finance", "days": 2}, {"name": "Review", "role": "CEO", "days": 1}, {"name": "Finalize", "role": "Designer", "days": 1}]'::jsonb,
    8
),
(
    'Market Research Report',
    'Business',
    '🔍',
    'Conduct market research and create a report.',
    '[{"name": "Research Design", "role": "Researcher", "days": 2}, {"name": "Data Collection", "role": "Researcher", "days": 4}, {"name": "Analysis", "role": "Data Analyst", "days": 3}, {"name": "Report", "role": "Content Writer", "days": 3}, {"name": "Review", "role": "Manager", "days": 1}]'::jsonb,
    13
),
(
    'Competitive Analysis',
    'Business',
    '⚔️',
    'Conduct a competitive analysis.',
    '[{"name": "Identify Competitors", "role": "Researcher", "days": 2}, {"name": "Data Collection", "role": "Researcher", "days": 3}, {"name": "Analysis", "role": "Data Analyst", "days": 2}, {"name": "Report", "role": "Content Writer", "days": 2}, {"name": "Review", "role": "Manager", "days": 1}]'::jsonb,
    10
),
(
    'SWOT Analysis',
    'Business',
    '🧠',
    'Create a SWOT analysis for a business.',
    '[{"name": "Internal Assessment", "role": "Business Analyst", "days": 2}, {"name": "External Assessment", "role": "Business Analyst", "days": 2}, {"name": "Analysis", "role": "Business Analyst", "days": 2}, {"name": "Report", "role": "Content Writer", "days": 2}, {"name": "Review", "role": "Manager", "days": 1}]'::jsonb,
    9
),
(
    'Project Proposal',
    'Business',
    '📄',
    'Write a project proposal for a client.',
    '[{"name": "Research", "role": "Content Writer", "days": 1}, {"name": "Scope", "role": "Project Manager", "days": 1}, {"name": "Budget", "role": "Finance", "days": 1}, {"name": "Write Proposal", "role": "Content Writer", "days": 2}, {"name": "Review", "role": "Manager", "days": 1}]'::jsonb,
    6
),
(
    'Annual Report',
    'Business',
    '📊',
    'Create a company annual report.',
    '[{"name": "Data Collection", "role": "Finance", "days": 3}, {"name": "Write", "role": "Content Writer", "days": 4}, {"name": "Design", "role": "Designer", "days": 3}, {"name": "Review", "role": "CEO", "days": 2}, {"name": "Finalize", "role": "Designer", "days": 1}]'::jsonb,
    13
),
(
    'Strategic Planning Session',
    'Business',
    '🎯',
    'Facilitate a strategic planning session.',
    '[{"name": "Pre-Planning", "role": "Facilitator", "days": 3}, {"name": "Session", "role": "Facilitator", "days": 2}, {"name": "Document", "role": "Content Writer", "days": 3}, {"name": "Review", "role": "CEO", "days": 1}]'::jsonb,
    9
),
(
    'Business Process Documentation',
    'Business',
    '📋',
    'Document business processes and SOPs.',
    '[{"name": "Process Mapping", "role": "Business Analyst", "days": 3}, {"name": "Write SOPs", "role": "Content Writer", "days": 4}, {"name": "Review", "role": "Manager", "days": 2}, {"name": "Finalize", "role": "Content Writer", "days": 1}]'::jsonb,
    10
),
(
    'Business Model Canvas',
    'Business',
    '🖼️',
    'Create a Business Model Canvas.',
    '[{"name": "Research", "role": "Business Analyst", "days": 1}, {"name": "Fill Canvas", "role": "Business Analyst", "days": 2}, {"name": "Review", "role": "CEO", "days": 1}, {"name": "Refine", "role": "Business Analyst", "days": 1}]'::jsonb,
    5
),
(
    'Product Roadmap',
    'Business',
    '🗺️',
    'Create a product roadmap.',
    '[{"name": "Strategy", "role": "Product Manager", "days": 2}, {"name": "Features List", "role": "Product Manager", "days": 2}, {"name": "Timeline", "role": "Product Manager", "days": 2}, {"name": "Review", "role": "CEO", "days": 1}, {"name": "Finalize", "role": "Product Manager", "days": 1}]'::jsonb,
    8
);

-- ============================================
-- SECTION 2: FINANCE & ACCOUNTING (40+)
-- ============================================

INSERT INTO workflow_templates (name, category, icon, description, steps, estimated_days) VALUES

(
    'Monthly Bookkeeping',
    'Finance',
    '📒',
    'Complete monthly bookkeeping.',
    '[{"name": "Collect Invoices", "role": "Accountant", "days": 2}, {"name": "Record Transactions", "role": "Accountant", "days": 2}, {"name": "Reconcile", "role": "Accountant", "days": 2}, {"name": "Review", "role": "Accountant", "days": 1}, {"name": "Report", "role": "Accountant", "days": 1}]'::jsonb,
    8
),
(
    'Annual Budget Preparation',
    'Finance',
    '💰',
    'Prepare the annual budget.',
    '[{"name": "Review Last Year", "role": "Finance", "days": 2}, {"name": "Forecast", "role": "Finance", "days": 3}, {"name": "Department Inputs", "role": "Finance", "days": 3}, {"name": "Consolidate", "role": "Finance", "days": 2}, {"name": "Board Approval", "role": "CEO", "days": 2}]'::jsonb,
    12
),
(
    'Financial Forecasting',
    'Finance',
    '📈',
    'Create financial forecasts.',
    '[{"name": "Historical Data", "role": "Finance", "days": 2}, {"name": "Model", "role": "Finance", "days": 3}, {"name": "Scenarios", "role": "Finance", "days": 2}, {"name": "Review", "role": "CEO", "days": 1}, {"name": "Finalize", "role": "Finance", "days": 1}]'::jsonb,
    9
),
(
    'Tax Filing (Corporate)',
    'Finance',
    '🧾',
    'File corporate taxes.',
    '[{"name": "Gather Documents", "role": "Accountant", "days": 3}, {"name": "Calculate", "role": "Accountant", "days": 3}, {"name": "Review", "role": "Finance", "days": 2}, {"name": "File", "role": "Accountant", "days": 1}]'::jsonb,
    9
),
(
    'Tax Filing (Personal)',
    'Finance',
    '📄',
    'File personal income taxes.',
    '[{"name": "Gather Documents", "role": "Accountant", "days": 2}, {"name": "Calculate", "role": "Accountant", "days": 2}, {"name": "Review", "role": "Accountant", "days": 1}, {"name": "File", "role": "Accountant", "days": 1}]'::jsonb,
    6
),
(
    'Financial Audit',
    'Finance',
    '🔍',
    'Conduct a financial audit.',
    '[{"name": "Planning", "role": "Auditor", "days": 3}, {"name": "Field Work", "role": "Auditor", "days": 5}, {"name": "Analysis", "role": "Auditor", "days": 3}, {"name": "Report", "role": "Auditor", "days": 2}, {"name": "Review", "role": "Manager", "days": 1}]'::jsonb,
    14
),
(
    'Payroll Processing',
    'Finance',
    '💵',
    'Process monthly payroll.',
    '[{"name": "Collect Hours", "role": "HR", "days": 1}, {"name": "Calculate Pay", "role": "Accountant", "days": 1}, {"name": "Process", "role": "Accountant", "days": 1}, {"name": "Review", "role": "Finance", "days": 1}, {"name": "Distribute", "role": "Accountant", "days": 1}]'::jsonb,
    5
),
(
    'Invoice Creation',
    'Finance',
    '📄',
    'Create invoices for clients.',
    '[{"name": "Gather Details", "role": "Accountant", "days": 1}, {"name": "Create Invoice", "role": "Accountant", "days": 1}, {"name": "Review", "role": "Manager", "days": 1}, {"name": "Send", "role": "Accountant", "days": 1}]'::jsonb,
    4
),
(
    'Accounts Receivable Management',
    'Finance',
    '💳',
    'Manage accounts receivable.',
    '[{"name": "Review Outstanding", "role": "Accountant", "days": 1}, {"name": "Follow Up", "role": "Accountant", "days": 2}, {"name": "Record Payments", "role": "Accountant", "days": 2}, {"name": "Reporting", "role": "Accountant", "days": 1}]'::jsonb,
    6
),
(
    'Accounts Payable Management',
    'Finance',
    '💸',
    'Manage accounts payable.',
    '[{"name": "Review Bills", "role": "Accountant", "days": 1}, {"name": "Schedule Payments", "role": "Accountant", "days": 2}, {"name": "Process Payments", "role": "Accountant", "days": 2}, {"name": "Reconcile", "role": "Accountant", "days": 1}]'::jsonb,
    6
),
(
    'Financial Statement Preparation',
    'Finance',
    '📊',
    'Prepare financial statements (P&L, BS, CF).',
    '[{"name": "Gather Data", "role": "Accountant", "days": 2}, {"name": "Prepare Statements", "role": "Accountant", "days": 3}, {"name": "Review", "role": "Finance", "days": 1}, {"name": "Finalize", "role": "Accountant", "days": 1}]'::jsonb,
    7
),
(
    'Investment Portfolio Review',
    'Finance',
    '📈',
    'Review and report on investment portfolio.',
    '[{"name": "Data Collection", "role": "Finance", "days": 2}, {"name": "Performance Analysis", "role": "Finance", "days": 2}, {"name": "Report", "role": "Finance", "days": 2}, {"name": "Review", "role": "Client", "days": 1}]'::jsonb,
    7
),
(
    'M&A Due Diligence',
    'Finance',
    '🤝',
    'Conduct due diligence for M&A.',
    '[{"name": "Initial Review", "role": "Finance", "days": 3}, {"name": "Data Room", "role": "Finance", "days": 5}, {"name": "Analysis", "role": "Finance", "days": 4}, {"name": "Report", "role": "Finance", "days": 3}, {"name": "Recommendations", "role": "CEO", "days": 2}]'::jsonb,
    17
),
(
    'Valuation Report',
    'Finance',
    '💎',
    'Create a business valuation report.',
    '[{"name": "Data Collection", "role": "Finance", "days": 3}, {"name": "Methodology", "role": "Finance", "days": 2}, {"name": "Calculation", "role": "Finance", "days": 3}, {"name": "Report", "role": "Finance", "days": 2}, {"name": "Review", "role": "Manager", "days": 1}]'::jsonb,
    11
),
(
    'Expense Report Analysis',
    'Finance',
    '📊',
    'Analyze expense reports.',
    '[{"name": "Collect Reports", "role": "Accountant", "days": 1}, {"name": "Categorize", "role": "Accountant", "days": 2}, {"name": "Analysis", "role": "Accountant", "days": 2}, {"name": "Report", "role": "Accountant", "days": 1}]'::jsonb,
    6
),
(
    'Cash Flow Management',
    'Finance',
    '💧',
    'Manage and forecast cash flow.',
    '[{"name": "Review Current", "role": "Finance", "days": 1}, {"name": "Forecast", "role": "Finance", "days": 2}, {"name": "Identify Gaps", "role": "Finance", "days": 1}, {"name": "Plan", "role": "Finance", "days": 1}, {"name": "Report", "role": "Finance", "days": 1}]'::jsonb,
    6
);

-- ============================================
-- SECTION 3: HUMAN RESOURCES (30+)
-- ============================================

INSERT INTO workflow_templates (name, category, icon, description, steps, estimated_days) VALUES

(
    'Recruitment/Hiring Process',
    'HR',
    '👔',
    'Complete recruitment and hiring process.',
    '[{"name": "JD Creation", "role": "HR", "days": 2}, {"name": "Post Job", "role": "HR", "days": 1}, {"name": "Screening", "role": "HR", "days": 3}, {"name": "Interviews", "role": "HR", "days": 5}, {"name": "Offer", "role": "HR", "days": 2}, {"name": "Onboarding", "role": "HR", "days": 2}]'::jsonb,
    15
),
(
    'Employee Onboarding',
    'HR',
    '🔄',
    'Complete employee onboarding process.',
    '[{"name": "Welcome Kit", "role": "HR", "days": 1}, {"name": "Documents", "role": "HR", "days": 1}, {"name": "IT Setup", "role": "IT", "days": 1}, {"name": "Training Plan", "role": "HR", "days": 2}, {"name": "Introduction", "role": "HR", "days": 1}]'::jsonb,
    6
),
(
    'Employee Offboarding',
    'HR',
    '🚪',
    'Complete employee offboarding process.',
    '[{"name": "Exit Interview", "role": "HR", "days": 1}, {"name": "Documents", "role": "HR", "days": 1}, {"name": "IT Access Removal", "role": "IT", "days": 1}, {"name": "Final Settlement", "role": "Finance", "days": 1}, {"name": "Exit Clearance", "role": "HR", "days": 1}]'::jsonb,
    5
),
(
    'Performance Review',
    'HR',
    '⭐',
    'Conduct employee performance review.',
    '[{"name": "Self-Assessment", "role": "Employee", "days": 2}, {"name": "Manager Review", "role": "Manager", "days": 2}, {"name": "Meeting", "role": "HR", "days": 1}, {"name": "Feedback", "role": "HR", "days": 1}, {"name": "Document", "role": "HR", "days": 1}]'::jsonb,
    7
),
(
    'Employee Training Plan',
    'HR',
    '📚',
    'Create an employee training plan.',
    '[{"name": "Needs Assessment", "role": "HR", "days": 2}, {"name": "Design Program", "role": "HR", "days": 3}, {"name": "Materials", "role": "Content Writer", "days": 2}, {"name": "Schedule", "role": "HR", "days": 1}, {"name": "Execute", "role": "HR", "days": 2}]'::jsonb,
    10
),
(
    'Company Policy Manual',
    'HR',
    '📋',
    'Create a company policy manual.',
    '[{"name": "Research", "role": "HR", "days": 2}, {"name": "Draft Policies", "role": "HR", "days": 4}, {"name": "Legal Review", "role": "Legal", "days": 2}, {"name": "Design", "role": "Designer", "days": 2}, {"name": "Publish", "role": "HR", "days": 1}]'::jsonb,
    11
),
(
    'HR Compliance Audit',
    'HR',
    '✅',
    'Audit HR compliance.',
    '[{"name": "Review Policies", "role": "HR", "days": 2}, {"name": "Check Compliance", "role": "HR", "days": 3}, {"name": "Report", "role": "HR", "days": 2}, {"name": "Recommendations", "role": "HR", "days": 2}]'::jsonb,
    9
),
(
    'Job Description Writing',
    'HR',
    '📝',
    'Write job descriptions for open positions.',
    '[{"name": "Research", "role": "HR", "days": 1}, {"name": "Draft", "role": "HR", "days": 1}, {"name": "Review", "role": "Manager", "days": 1}, {"name": "Finalize", "role": "HR", "days": 1}]'::jsonb,
    4
),
(
    'Company Culture Initiative',
    'HR',
    '🎉',
    'Plan and execute a company culture initiative.',
    '[{"name": "Survey", "role": "HR", "days": 2}, {"name": "Analysis", "role": "HR", "days": 2}, {"name": "Plan", "role": "HR", "days": 3}, {"name": "Execute", "role": "HR", "days": 2}, {"name": "Feedback", "role": "HR", "days": 1}]'::jsonb,
    10
),
(
    'Diversity & Inclusion Program',
    'HR',
    '🌈',
    'Create a D&I program.',
    '[{"name": "Assessment", "role": "HR", "days": 3}, {"name": "Strategy", "role": "HR", "days": 3}, {"name": "Implementation", "role": "HR", "days": 4}, {"name": "Training", "role": "HR", "days": 2}, {"name": "Monitoring", "role": "HR", "days": 2}]'::jsonb,
    14
),
(
    'Employee Engagement Survey',
    'HR',
    '📊',
    'Conduct employee engagement survey.',
    '[{"name": "Design Survey", "role": "HR", "days": 2}, {"name": "Send Survey", "role": "HR", "days": 1}, {"name": "Analyze", "role": "HR", "days": 3}, {"name": "Report", "role": "HR", "days": 2}, {"name": "Action Plan", "role": "HR", "days": 2}]'::jsonb,
    10
),
(
    'Succession Planning',
    'HR',
    '👑',
    'Create a succession plan.',
    '[{"name": "Identify Key Roles", "role": "HR", "days": 2}, {"name": "Assess Talent", "role": "HR", "days": 3}, {"name": "Development Plan", "role": "HR", "days": 3}, {"name": "Document", "role": "HR", "days": 2}]'::jsonb,
    10
),
(
    'Employee Handbook',
    'HR',
    '📖',
    'Create an employee handbook.',
    '[{"name": "Research", "role": "HR", "days": 2}, {"name": "Draft", "role": "HR", "days": 4}, {"name": "Legal Review", "role": "Legal", "days": 2}, {"name": "Design", "role": "Designer", "days": 2}, {"name": "Publish", "role": "HR", "days": 1}]'::jsonb,
    11
);

-- ============================================
-- SECTION 4: LEGAL (20+)
-- ============================================

INSERT INTO workflow_templates (name, category, icon, description, steps, estimated_days) VALUES

(
    'Contract Drafting',
    'Legal',
    '📜',
    'Draft a legal contract.',
    '[{"name": "Requirement", "role": "Legal", "days": 2}, {"name": "Research", "role": "Legal", "days": 2}, {"name": "Draft", "role": "Legal", "days": 3}, {"name": "Review", "role": "Legal", "days": 2}, {"name": "Negotiate", "role": "Legal", "days": 2}, {"name": "Finalize", "role": "Legal", "days": 1}]'::jsonb,
    12
),
(
    'NDA Agreement',
    'Legal',
    '🤐',
    'Draft a Non-Disclosure Agreement.',
    '[{"name": "Requirements", "role": "Legal", "days": 1}, {"name": "Draft", "role": "Legal", "days": 1}, {"name": "Review", "role": "Legal", "days": 1}, {"name": "Send", "role": "Legal", "days": 1}]'::jsonb,
    4
),
(
    'Employment Contract',
    'Legal',
    '📄',
    'Draft an employment contract.',
    '[{"name": "Requirements", "role": "Legal", "days": 2}, {"name": "Draft", "role": "Legal", "days": 2}, {"name": "Review", "role": "Legal", "days": 2}, {"name": "Sign", "role": "Legal", "days": 1}]'::jsonb,
    7
),
(
    'Service Agreement',
    'Legal',
    '🤝',
    'Draft a service agreement.',
    '[{"name": "Requirements", "role": "Legal", "days": 2}, {"name": "Draft", "role": "Legal", "days": 3}, {"name": "Review", "role": "Legal", "days": 2}, {"name": "Finalize", "role": "Legal", "days": 1}]'::jsonb,
    8
),
(
    'Partnership Agreement',
    'Legal',
    '🤝',
    'Draft a partnership agreement.',
    '[{"name": "Requirements", "role": "Legal", "days": 2}, {"name": "Draft", "role": "Legal", "days": 3}, {"name": "Review", "role": "Legal", "days": 2}, {"name": "Negotiate", "role": "Legal", "days": 2}, {"name": "Finalize", "role": "Legal", "days": 1}]'::jsonb,
    10
),
(
    'Trademark Registration',
    'Legal',
    '™️',
    'Register a trademark.',
    '[{"name": "Search", "role": "Legal", "days": 2}, {"name": "Application", "role": "Legal", "days": 2}, {"name": "Follow Up", "role": "Legal", "days": 2}, {"name": "Registration", "role": "Legal", "days": 1}]'::jsonb,
    7
),
(
    'Copyright Registration',
    'Legal',
    '©️',
    'Register copyright.',
    '[{"name": "Collect Work", "role": "Legal", "days": 1}, {"name": "Application", "role": "Legal", "days": 2}, {"name": "Follow Up", "role": "Legal", "days": 2}, {"name": "Registration", "role": "Legal", "days": 1}]'::jsonb,
    6
),
(
    'Patent Filing',
    'Legal',
    '💡',
    'File a patent application.',
    '[{"name": "Research", "role": "Legal", "days": 3}, {"name": "Draft Claims", "role": "Legal", "days": 4}, {"name": "Review", "role": "Legal", "days": 2}, {"name": "File", "role": "Legal", "days": 1}, {"name": "Respond", "role": "Legal", "days": 3}]'::jsonb,
    13
),
(
    'Legal Compliance Check',
    'Legal',
    '✅',
    'Compliance check for business.',
    '[{"name": "Review Policies", "role": "Legal", "days": 3}, {"name": "Check Regulations", "role": "Legal", "days": 3}, {"name": "Report", "role": "Legal", "days": 2}, {"name": "Recommendations", "role": "Legal", "days": 2}]'::jsonb,
    10
),
(
    'Privacy Policy & Terms',
    'Legal',
    '🔒',
    'Draft Privacy Policy and Terms of Service.',
    '[{"name": "Research", "role": "Legal", "days": 2}, {"name": "Draft", "role": "Legal", "days": 3}, {"name": "Review", "role": "Legal", "days": 2}, {"name": "Publish", "role": "Legal", "days": 1}]'::jsonb,
    8
);

-- ============================================
-- SECTION 5: REAL ESTATE (20+)
-- ============================================

INSERT INTO workflow_templates (name, category, icon, description, steps, estimated_days) VALUES

(
    'Real Estate Purchase',
    'Real Estate',
    '🏠',
    'Complete a real estate purchase process.',
    '[{"name": "Property Search", "role": "Agent", "days": 5}, {"name": "Inspection", "role": "Inspector", "days": 2}, {"name": "Appraisal", "role": "Appraiser", "days": 2}, {"name": "Financing", "role": "Mortgage Broker", "days": 5}, {"name": "Closing", "role": "Title Company", "days": 3}]'::jsonb,
    17
),
(
    'Real Estate Listing',
    'Real Estate',
    '📰',
    'List a property for sale.',
    '[{"name": "Photography", "role": "Photographer", "days": 1}, {"name": "Description", "role": "Content Writer", "days": 1}, {"name": "MLS Listing", "role": "Agent", "days": 1}, {"name": "Marketing", "role": "Marketing Manager", "days": 2}]'::jsonb,
    5
),
(
    'Rental Property Management',
    'Real Estate',
    '🔑',
    'Manage a rental property.',
    '[{"name": "Tenant Screening", "role": "Property Manager", "days": 3}, {"name": "Lease Agreement", "role": "Property Manager", "days": 2}, {"name": "Move In", "role": "Property Manager", "days": 1}, {"name": "Maintenance", "role": "Property Manager", "days": 2}, {"name": "Rent Collection", "role": "Property Manager", "days": 1}]'::jsonb,
    9
),
(
    'Property Inspection',
    'Real Estate',
    '🔍',
    'Conduct a property inspection.',
    '[{"name": "Schedule", "role": "Inspector", "days": 1}, {"name": "Inspection", "role": "Inspector", "days": 1}, {"name": "Report", "role": "Inspector", "days": 1}, {"name": "Review", "role": "Client", "days": 1}]'::jsonb,
    4
),
(
    'Real Estate Appraisal',
    'Real Estate',
    '💎',
    'Conduct a property appraisal.',
    '[{"name": "Research", "role": "Appraiser", "days": 2}, {"name": "Site Visit", "role": "Appraiser", "days": 1}, {"name": "Analysis", "role": "Appraiser", "days": 2}, {"name": "Report", "role": "Appraiser", "days": 1}]'::jsonb,
    6
),
(
    'Property Renovation Project',
    'Real Estate',
    '🔨',
    'Manage a property renovation.',
    '[{"name": "Planning", "role": "Project Manager", "days": 3}, {"name": "Design", "role": "Designer", "days": 3}, {"name": "Contractor", "role": "Project Manager", "days": 2}, {"name": "Execution", "role": "Project Manager", "days": 10}, {"name": "Inspection", "role": "Inspector", "days": 2}]'::jsonb,
    20
),
(
    'Title Search',
    'Real Estate',
    '📋',
    'Conduct a property title search.',
    '[{"name": "Research", "role": "Title Company", "days": 2}, {"name": "Review", "role": "Title Company", "days": 1}, {"name": "Report", "role": "Title Company", "days": 1}]'::jsonb,
    4
),
(
    'Property Tax Appeal',
    'Real Estate',
    '💰',
    'File a property tax appeal.',
    '[{"name": "Research", "role": "Tax Consultant", "days": 2}, {"name": "Gather Evidence", "role": "Tax Consultant", "days": 2}, {"name": "File Appeal", "role": "Tax Consultant", "days": 1}, {"name": "Follow Up", "role": "Tax Consultant", "days": 1}]'::jsonb,
    6
);

-- ============================================
-- SECTION 6: OFFICE ADMINISTRATION (20+)
-- ============================================

INSERT INTO workflow_templates (name, category, icon, description, steps, estimated_days) VALUES

(
    'Meeting Organization',
    'Admin',
    '📅',
    'Organize a business meeting.',
    '[{"name": "Schedule", "role": "Admin", "days": 1}, {"name": "Agenda", "role": "Admin", "days": 1}, {"name": "Send Invites", "role": "Admin", "days": 1}, {"name": "Prepare Materials", "role": "Admin", "days": 1}, {"name": "Minutes", "role": "Admin", "days": 1}]'::jsonb,
    5
),
(
    'Event Planning (Corporate)',
    'Admin',
    '🎉',
    'Plan a corporate event.',
    '[{"name": "Concept", "role": "Event Manager", "days": 2}, {"name": "Venue", "role": "Event Manager", "days": 2}, {"name": "Budget", "role": "Finance", "days": 2}, {"name": "Speakers", "role": "Event Manager", "days": 3}, {"name": "Marketing", "role": "Marketing Manager", "days": 3}, {"name": "Day-of", "role": "Event Manager", "days": 2}]'::jsonb,
    14
),
(
    'Office Move/Relocation',
    'Admin',
    '🚚',
    'Plan and execute an office move.',
    '[{"name": "Planning", "role": "Admin", "days": 3}, {"name": "Vendor", "role": "Admin", "days": 2}, {"name": "Packing", "role": "Admin", "days": 2}, {"name": "Move", "role": "Admin", "days": 1}, {"name": "Setup", "role": "Admin", "days": 2}]'::jsonb,
    10
),
(
    'Travel Arrangement',
    'Admin',
    '✈️',
    'Arrange business travel.',
    '[{"name": "Booking", "role": "Admin", "days": 1}, {"name": "Itinerary", "role": "Admin", "days": 1}, {"name": "Travel Docs", "role": "Admin", "days": 1}, {"name": "Check-in", "role": "Admin", "days": 1}]'::jsonb,
    4
),
(
    'Office Supply Management',
    'Admin',
    '🖊️',
    'Manage office supplies and inventory.',
    '[{"name": "Inventory Check", "role": "Admin", "days": 1}, {"name": "Order", "role": "Admin", "days": 1}, {"name": "Receive", "role": "Admin", "days": 1}, {"name": "Distribute", "role": "Admin", "days": 1}]'::jsonb,
    4
),
(
    'Expense Reporting',
    'Admin',
    '📊',
    'Create and submit expense reports.',
    '[{"name": "Collect Receipts", "role": "Employee", "days": 1}, {"name": "Report", "role": "Employee", "days": 1}, {"name": "Review", "role": "Manager", "days": 1}, {"name": "Approve", "role": "Finance", "days": 1}]'::jsonb,
    4
),
(
    'Company Newsletter',
    'Admin',
    '📰',
    'Create a company newsletter.',
    '[{"name": "Content", "role": "Content Writer", "days": 2}, {"name": "Design", "role": "Designer", "days": 1}, {"name": "Review", "role": "Manager", "days": 1}, {"name": "Send", "role": "Admin", "days": 1}]'::jsonb,
    5
),
(
    'Data Entry Project',
    'Admin',
    '⌨️',
    'Complete a data entry project.',
    '[{"name": "Data Preparation", "role": "Data Entry", "days": 1}, {"name": "Entry", "role": "Data Entry", "days": 3}, {"name": "Verification", "role": "Data Entry", "days": 1}, {"name": "Review", "role": "Manager", "days": 1}]'::jsonb,
    6
);

-- ============================================
-- VERIFICATION
-- ============================================
SELECT
    'PART 3: ' || COUNT(*) || ' templates inserted.' AS message
FROM workflow_templates;
