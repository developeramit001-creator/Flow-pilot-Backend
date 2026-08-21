-- ============================================
-- MIGRATION 004: SEED WORKFLOW TEMPLATES - PART 1
-- ============================================
-- Categories: Content, Media, Design, Creative
-- Total: 250+ workflows

-- ============================================
-- SECTION 1: CONTENT CREATION (50+)
-- ============================================

INSERT INTO workflow_templates (name, category, icon, description, steps, estimated_days) VALUES

-- ---- Writing & Blogging ----
(
    'Blog Post Writing (Short)',
    'Content',
    '✍️',
    'Write a 1000-word blog post with basic SEO.',
    '[{"name": "Topic Research", "role": "Content Strategist", "days": 1}, {"name": "Outline", "role": "Content Writer", "days": 1}, {"name": "Draft", "role": "Content Writer", "days": 2}, {"name": "Edit & Polish", "role": "Editor", "days": 1}, {"name": "SEO Check", "role": "SEO Specialist", "days": 1}, {"name": "Publish", "role": "Manager", "days": 1}]'::jsonb,
    7
),
(
    'Long-Form Article (3000+ words)',
    'Content',
    '📄',
    'Write a comprehensive long-form article with research.',
    '[{"name": "Topic Research", "role": "Researcher", "days": 2}, {"name": "Outline", "role": "Content Strategist", "days": 1}, {"name": "Research", "role": "Researcher", "days": 2}, {"name": "Draft", "role": "Content Writer", "days": 4}, {"name": "Expert Review", "role": "Subject Matter Expert", "days": 2}, {"name": "Edit", "role": "Editor", "days": 2}, {"name": "Final Polish", "role": "Content Writer", "days": 1}]'::jsonb,
    14
),
(
    'Listicle Post (Top 10)',
    'Content',
    '📋',
    'Create a listicle post with examples and images.',
    '[{"name": "Topic Research", "role": "Content Strategist", "days": 1}, {"name": "List Creation", "role": "Content Writer", "days": 2}, {"name": "Write Descriptions", "role": "Content Writer", "days": 2}, {"name": "Image Sourcing", "role": "Designer", "days": 1}, {"name": "Edit", "role": "Editor", "days": 1}, {"name": "Publish", "role": "Manager", "days": 1}]'::jsonb,
    8
),
(
    'White Paper',
    'Content',
    '📑',
    'Write a detailed industry white paper with data.',
    '[{"name": "Topic Selection", "role": "Content Strategist", "days": 2}, {"name": "Research", "role": "Researcher", "days": 5}, {"name": "Outline", "role": "Content Strategist", "days": 2}, {"name": "Draft", "role": "Content Writer", "days": 5}, {"name": "Expert Review", "role": "Subject Matter Expert", "days": 3}, {"name": "Design", "role": "Designer", "days": 3}, {"name": "Final Review", "role": "Editor", "days": 2}]'::jsonb,
    22
),
(
    'Case Study',
    'Content',
    '📊',
    'Write a detailed customer success story.',
    '[{"name": "Interview Client", "role": "Content Writer", "days": 2}, {"name": "Data Collection", "role": "Researcher", "days": 2}, {"name": "Outline", "role": "Content Strategist", "days": 1}, {"name": "Draft", "role": "Content Writer", "days": 3}, {"name": "Client Review", "role": "Client", "days": 2}, {"name": "Edit", "role": "Editor", "days": 1}, {"name": "Design", "role": "Designer", "days": 2}, {"name": "Publish", "role": "Manager", "days": 1}]'::jsonb,
    14
),
(
    'E-book (50+ pages)',
    'Content',
    '📚',
    'Write and design a comprehensive e-book.',
    '[{"name": "Topic & Outline", "role": "Content Strategist", "days": 3}, {"name": "Chapter Research", "role": "Researcher", "days": 5}, {"name": "Writing", "role": "Content Writer", "days": 10}, {"name": "Editing", "role": "Editor", "days": 3}, {"name": "Design & Layout", "role": "Designer", "days": 5}, {"name": "Proofreading", "role": "Proofreader", "days": 2}, {"name": "Final Review", "role": "Manager", "days": 2}]'::jsonb,
    30
),
(
    'Newsletter (Weekly)',
    'Content',
    '📧',
    'Create and send a weekly newsletter.',
    '[{"name": "Content Curation", "role": "Researcher", "days": 1}, {"name": "Write Introduction", "role": "Content Writer", "days": 1}, {"name": "Design Layout", "role": "Designer", "days": 1}, {"name": "Review", "role": "Editor", "days": 1}, {"name": "Send Test", "role": "Manager", "days": 1}, {"name": "Schedule Send", "role": "Manager", "days": 1}]'::jsonb,
    6
),
(
    'Press Release',
    'Content',
    '📢',
    'Write and distribute a press release.',
    '[{"name": "News Angle", "role": "PR Manager", "days": 1}, {"name": "Write Draft", "role": "Content Writer", "days": 2}, {"name": "Legal Review", "role": "Legal", "days": 1}, {"name": "Executive Review", "role": "CEO", "days": 1}, {"name": "Finalize", "role": "PR Manager", "days": 1}, {"name": "Distribution", "role": "PR Manager", "days": 1}]'::jsonb,
    7
),
(
    'GHOSTWRITING - Book',
    'Content',
    '📖',
    'Ghostwrite a full book for a client.',
    '[{"name": "Client Interview", "role": "Content Writer", "days": 3}, {"name": "Outline", "role": "Content Strategist", "days": 3}, {"name": "Research", "role": "Researcher", "days": 5}, {"name": "Drafting (Chapters)", "role": "Content Writer", "days": 15}, {"name": "Review", "role": "Editor", "days": 4}, {"name": "Revision", "role": "Content Writer", "days": 5}, {"name": "Final Edit", "role": "Editor", "days": 3}]'::jsonb,
    38
),
(
    'Copywriting - Landing Page',
    'Content',
    '🎯',
    'Write a high-converting landing page copy.',
    '[{"name": "Research Product", "role": "Copywriter", "days": 1}, {"name": "Understand Audience", "role": "Copywriter", "days": 1}, {"name": "Headline Creation", "role": "Copywriter", "days": 1}, {"name": "Write Copy", "role": "Copywriter", "days": 2}, {"name": "Review", "role": "Editor", "days": 1}, {"name": "Refine", "role": "Copywriter", "days": 1}]'::jsonb,
    7
),
(
    'Copywriting - Email Sequence',
    'Content',
    '📨',
    'Write a 5-email nurture sequence.',
    '[{"name": "Strategy", "role": "Marketing Manager", "days": 1}, {"name": "Outline Each Email", "role": "Copywriter", "days": 1}, {"name": "Write Drafts", "role": "Copywriter", "days": 3}, {"name": "Review", "role": "Editor", "days": 1}, {"name": "Refine", "role": "Copywriter", "days": 1}, {"name": "Setup Automation", "role": "Marketing Ops", "days": 1}]'::jsonb,
    8
),
(
    'Product Description (E-commerce)',
    'Content',
    '🛍️',
    'Write SEO-optimized product descriptions.',
    '[{"name": "Product Research", "role": "Copywriter", "days": 1}, {"name": "Key Features", "role": "Copywriter", "days": 1}, {"name": "Write Description", "role": "Copywriter", "days": 1}, {"name": "SEO Keywords", "role": "SEO Specialist", "days": 1}, {"name": "Review", "role": "Editor", "days": 1}]'::jsonb,
    5
),
(
    'Technical Writing - API Docs',
    'Content',
    '⚙️',
    'Write documentation for an API.',
    '[{"name": "Understand API", "role": "Technical Writer", "days": 2}, {"name": "Structure Docs", "role": "Technical Writer", "days": 1}, {"name": "Write Endpoints", "role": "Technical Writer", "days": 4}, {"name": "Examples", "role": "Technical Writer", "days": 2}, {"name": "Review", "role": "Developer", "days": 2}, {"name": "Publish", "role": "Technical Writer", "days": 1}]'::jsonb,
    12
),
(
    'Technical Writing - User Manual',
    'Content',
    '📘',
    'Write a user manual for a software product.',
    '[{"name": "Product Walkthrough", "role": "Technical Writer", "days": 2}, {"name": "Outline", "role": "Technical Writer", "days": 1}, {"name": "Write Content", "role": "Technical Writer", "days": 5}, {"name": "Screenshots", "role": "Designer", "days": 2}, {"name": "Review", "role": "Product Manager", "days": 2}, {"name": "Publish", "role": "Technical Writer", "days": 1}]'::jsonb,
    13
),
(
    'Grant Writing',
    'Content',
    '💰',
    'Write a grant proposal for funding.',
    '[{"name": "Research Grants", "role": "Grant Writer", "days": 3}, {"name": "Project Outline", "role": "Grant Writer", "days": 2}, {"name": "Draft Proposal", "role": "Grant Writer", "days": 4}, {"name": "Budget", "role": "Finance", "days": 2}, {"name": "Review", "role": "Manager", "days": 2}, {"name": "Submit", "role": "Grant Writer", "days": 1}]'::jsonb,
    14
),
(
    'Resume/CV Writing',
    'Content',
    '📝',
    'Write a professional resume or CV.',
    '[{"name": "Client Interview", "role": "Resume Writer", "days": 1}, {"name": "Gather Experience", "role": "Resume Writer", "days": 1}, {"name": "Write Draft", "role": "Resume Writer", "days": 1}, {"name": "Format Design", "role": "Designer", "days": 1}, {"name": "Review", "role": "Resume Writer", "days": 1}, {"name": "Finalize", "role": "Client", "days": 1}]'::jsonb,
    6
),
(
    'Social Media Caption Writing',
    'Content',
    '📱',
    'Write captions for social media posts (10 posts).',
    '[{"name": "Content Calendar", "role": "Social Media Manager", "days": 1}, {"name": "Research Trends", "role": "Social Media Manager", "days": 1}, {"name": "Write Captions", "role": "Copywriter", "days": 2}, {"name": "Review", "role": "Editor", "days": 1}, {"name": "Schedule", "role": "Social Media Manager", "days": 1}]'::jsonb,
    6
),
(
    'Translation (1000 words)',
    'Content',
    '🌐',
    'Translate content from one language to another.',
    '[{"name": "Source Review", "role": "Translator", "days": 1}, {"name": "Translate", "role": "Translator", "days": 2}, {"name": "Proofread", "role": "Proofreader", "days": 1}, {"name": "Native Review", "role": "Native Speaker", "days": 1}, {"name": "Finalize", "role": "Translator", "days": 1}]'::jsonb,
    6
);

-- ============================================
-- SECTION 2: VIDEO & MEDIA PRODUCTION (50+)
-- ============================================

INSERT INTO workflow_templates (name, category, icon, description, steps, estimated_days) VALUES

(
    'YouTube Video (10 min)',
    'Media',
    '🎬',
    'Produce a 10-minute YouTube video.',
    '[{"name": "Script", "role": "Content Writer", "days": 2}, {"name": "Storyboard", "role": "Designer", "days": 1}, {"name": "Shoot", "role": "Videographer", "days": 2}, {"name": "Editing", "role": "Video Editor", "days": 3}, {"name": "Thumbnail", "role": "Designer", "days": 1}, {"name": "Upload & SEO", "role": "Manager", "days": 1}]'::jsonb,
    10
),
(
    'Short Film (15 min)',
    'Media',
    '🎞️',
    'Produce a short film.',
    '[{"name": "Script", "role": "Screenwriter", "days": 5}, {"name": "Storyboard", "role": "Director", "days": 2}, {"name": "Casting", "role": "Casting Director", "days": 3}, {"name": "Location Scouting", "role": "Location Manager", "days": 2}, {"name": "Shoot", "role": "DP", "days": 5}, {"name": "Editing", "role": "Video Editor", "days": 7}, {"name": "Color Grading", "role": "Colorist", "days": 2}, {"name": "Sound Design", "role": "Sound Engineer", "days": 2}, {"name": "Music", "role": "Composer", "days": 2}]'::jsonb,
    30
),
(
    'Documentary (30 min)',
    'Media',
    '🎥',
    'Produce a documentary film.',
    '[{"name": "Research", "role": "Researcher", "days": 7}, {"name": "Script", "role": "Screenwriter", "days": 5}, {"name": "Interviews", "role": "DP", "days": 5}, {"name": "B-Roll", "role": "DP", "days": 3}, {"name": "Editing", "role": "Video Editor", "days": 10}, {"name": "Narration", "role": "Voice Artist", "days": 2}, {"name": "Color Grade", "role": "Colorist", "days": 3}]'::jsonb,
    35
),
(
    'Corporate Video (3 min)',
    'Media',
    '🏢',
    'Produce a corporate promotional video.',
    '[{"name": "Client Brief", "role": "Producer", "days": 1}, {"name": "Script", "role": "Content Writer", "days": 2}, {"name": "Shoot", "role": "Videographer", "days": 2}, {"name": "Editing", "role": "Video Editor", "days": 3}, {"name": "Motion Graphics", "role": "Motion Designer", "days": 2}, {"name": "Client Review", "role": "Producer", "days": 1}, {"name": "Finalize", "role": "Video Editor", "days": 1}]'::jsonb,
    12
),
(
    'Explainer Video (2 min)',
    'Media',
    '💡',
    'Create a 2D animated explainer video.',
    '[{"name": "Script", "role": "Content Writer", "days": 2}, {"name": "Storyboard", "role": "Designer", "days": 2}, {"name": "Voice Over", "role": "Voice Artist", "days": 1}, {"name": "Animation", "role": "Animator", "days": 5}, {"name": "Sound Design", "role": "Audio Engineer", "days": 1}, {"name": "Review", "role": "Manager", "days": 1}]'::jsonb,
    12
),
(
    '3D Animated Video (60 sec)',
    'Media',
    '🪄',
    'Create a 3D animated promotional video.',
    '[{"name": "Script", "role": "Content Writer", "days": 2}, {"name": "Storyboard", "role": "Designer", "days": 2}, {"name": "3D Modeling", "role": "3D Artist", "days": 5}, {"name": "Texturing", "role": "3D Artist", "days": 2}, {"name": "Animation", "role": "Animator", "days": 5}, {"name": "Lighting", "role": "3D Artist", "days": 2}, {"name": "Render", "role": "Animator", "days": 3}, {"name": "Compositing", "role": "Compositor", "days": 2}]'::jsonb,
    23
),
(
    'Podcast Episode (60 min)',
    'Media',
    '🎙️',
    'Record and edit a podcast episode.',
    '[{"name": "Topic Research", "role": "Researcher", "days": 1}, {"name": "Guest Booking", "role": "Coordinator", "days": 2}, {"name": "Recording", "role": "Audio Engineer", "days": 1}, {"name": "Audio Editing", "role": "Audio Editor", "days": 2}, {"name": "Show Notes", "role": "Content Writer", "days": 1}, {"name": "Publish", "role": "Manager", "days": 1}]'::jsonb,
    8
),
(
    'Music Video (4 min)',
    'Media',
    '🎵',
    'Produce a music video for an artist.',
    '[{"name": "Concept", "role": "Director", "days": 2}, {"name": "Storyboard", "role": "Designer", "days": 2}, {"name": "Choreography", "role": "Choreographer", "days": 2}, {"name": "Shoot", "role": "DP", "days": 2}, {"name": "Editing", "role": "Video Editor", "days": 4}, {"name": "Color Grade", "role": "Colorist", "days": 2}, {"name": "VFX", "role": "VFX Artist", "days": 2}]'::jsonb,
    16
),
(
    'Live Stream Production',
    'Media',
    '🔴',
    'Setup and stream a live event.',
    '[{"name": "Technical Setup", "role": "Tech", "days": 2}, {"name": "Test Stream", "role": "Tech", "days": 1}, {"name": "Run Show", "role": "Producer", "days": 1}, {"name": "Post-Production", "role": "Video Editor", "days": 2}]'::jsonb,
    6
),
(
    'Vlog (5 min)',
    'Media',
    '📸',
    'Edit a daily vlog or travel video.',
    '[{"name": "Footage Import", "role": "Video Editor", "days": 1}, {"name": "Rough Cut", "role": "Video Editor", "days": 1}, {"name": "Final Cut", "role": "Video Editor", "days": 2}, {"name": "Color Grade", "role": "Colorist", "days": 1}, {"name": "Music", "role": "Audio Engineer", "days": 1}]'::jsonb,
    6
),
(
    'Instagram Reel (30 sec)',
    'Media',
    '📲',
    'Create a short Instagram Reel.',
    '[{"name": "Concept", "role": "Content Creator", "days": 1}, {"name": "Shoot", "role": "Videographer", "days": 1}, {"name": "Edit", "role": "Video Editor", "days": 1}, {"name": "Music", "role": "Audio Engineer", "days": 1}, {"name": "Upload", "role": "Social Media Manager", "days": 1}]'::jsonb,
    5
),
(
    'YouTube Shorts (15 sec)',
    'Media',
    '📱',
    'Create a YouTube Short.',
    '[{"name": "Trend Research", "role": "Researcher", "days": 1}, {"name": "Script", "role": "Content Writer", "days": 1}, {"name": "Shoot", "role": "Videographer", "days": 1}, {"name": "Edit", "role": "Video Editor", "days": 1}, {"name": "Upload", "role": "Manager", "days": 1}]'::jsonb,
    5
),
(
    'TikTok Video (30 sec)',
    'Media',
    '🎵',
    'Create a TikTok video.',
    '[{"name": "Trend Research", "role": "Content Creator", "days": 1}, {"name": "Script", "role": "Content Writer", "days": 1}, {"name": "Shoot", "role": "Videographer", "days": 1}, {"name": "Edit", "role": "Video Editor", "days": 1}]'::jsonb,
    4
),
(
    'Commercial Ad (30 sec)',
    'Media',
    '📺',
    'Produce a TV or digital commercial.',
    '[{"name": "Brief", "role": "Producer", "days": 1}, {"name": "Script", "role": "Copywriter", "days": 2}, {"name": "Storyboard", "role": "Designer", "days": 2}, {"name": "Shoot", "role": "DP", "days": 2}, {"name": "Editing", "role": "Video Editor", "days": 3}, {"name": "VFX", "role": "VFX Artist", "days": 2}, {"name": "Client Review", "role": "Producer", "days": 1}, {"name": "Finalize", "role": "Video Editor", "days": 1}]'::jsonb,
    14
),
(
    'Course Video (1 hour)',
    'Media',
    '🎓',
    'Produce a 1-hour educational video.',
    '[{"name": "Script", "role": "Content Writer", "days": 3}, {"name": "Slides Design", "role": "Designer", "days": 2}, {"name": "Record", "role": "Videographer", "days": 2}, {"name": "Edit", "role": "Video Editor", "days": 3}, {"name": "Intro/Outro", "role": "Motion Designer", "days": 1}, {"name": "Upload", "role": "Manager", "days": 1}]'::jsonb,
    12
),
(
    'Audio Book Recording',
    'Media',
    '🎧',
    'Record and edit an audiobook.',
    '[{"name": "Script Prep", "role": "Content Writer", "days": 2}, {"name": "Studio Booking", "role": "Coordinator", "days": 1}, {"name": "Recording", "role": "Voice Artist", "days": 5}, {"name": "Audio Editing", "role": "Audio Engineer", "days": 3}, {"name": "Mastering", "role": "Audio Engineer", "days": 2}]'::jsonb,
    13
),
(
    'Soundtrack Composition',
    'Media',
    '🎼',
    'Compose an original soundtrack.',
    '[{"name": "Brief", "role": "Composer", "days": 1}, {"name": "Theme Creation", "role": "Composer", "days": 2}, {"name": "Composition", "role": "Composer", "days": 5}, {"name": "Orchestration", "role": "Composer", "days": 2}, {"name": "Recording", "role": "Audio Engineer", "days": 2}, {"name": "Mastering", "role": "Audio Engineer", "days": 1}]'::jsonb,
    13
),
(
    'Voice Over Recording',
    'Media',
    '🎤',
    'Record a professional voice over.',
    '[{"name": "Script Prep", "role": "Content Writer", "days": 1}, {"name": "Studio Booking", "role": "Coordinator", "days": 1}, {"name": "Recording", "role": "Voice Artist", "days": 1}, {"name": "Editing", "role": "Audio Engineer", "days": 1}, {"name": "Delivery", "role": "Manager", "days": 1}]'::jsonb,
    5
);

-- ============================================
-- SECTION 3: GRAPHIC DESIGN & CREATIVE (50+)
-- ============================================

INSERT INTO workflow_templates (name, category, icon, description, steps, estimated_days) VALUES

(
    'Logo Design',
    'Design',
    '🏷️',
    'Create a professional logo for a brand.',
    '[{"name": "Brief", "role": "Designer", "days": 1}, {"name": "Research", "role": "Designer", "days": 2}, {"name": "Moodboard", "role": "Designer", "days": 1}, {"name": "Sketches", "role": "Designer", "days": 2}, {"name": "Digital Concepts", "role": "Designer", "days": 2}, {"name": "Refinement", "role": "Designer", "days": 2}, {"name": "Brand Guidelines", "role": "Designer", "days": 2}]'::jsonb,
    12
),
(
    'Brand Identity Design',
    'Design',
    '🎨',
    'Complete brand identity (logo, fonts, colors, guidelines).',
    '[{"name": "Brief", "role": "Designer", "days": 2}, {"name": "Research", "role": "Designer", "days": 2}, {"name": "Moodboard", "role": "Designer", "days": 2}, {"name": "Logo Concepts", "role": "Designer", "days": 3}, {"name": "Font & Color", "role": "Designer", "days": 2}, {"name": "Brand Guidelines", "role": "Designer", "days": 3}, {"name": "Refinement", "role": "Designer", "days": 2}]'::jsonb,
    16
),
(
    'Business Card Design',
    'Design',
    '💳',
    'Design a business card.',
    '[{"name": "Brief", "role": "Designer", "days": 1}, {"name": "Concept", "role": "Designer", "days": 1}, {"name": "Design", "role": "Designer", "days": 1}, {"name": "Review", "role": "Client", "days": 1}, {"name": "Finalize", "role": "Designer", "days": 1}]'::jsonb,
    5
),
(
    'Brochure Design (Tri-fold)',
    'Design',
    '📃',
    'Design a tri-fold brochure.',
    '[{"name": "Brief", "role": "Designer", "days": 1}, {"name": "Content", "role": "Content Writer", "days": 2}, {"name": "Design Layout", "role": "Designer", "days": 2}, {"name": "Review", "role": "Client", "days": 1}, {"name": "Finalize", "role": "Designer", "days": 1}]'::jsonb,
    7
),
(
    'Flyer Design',
    'Design',
    '📄',
    'Design a promotional flyer.',
    '[{"name": "Brief", "role": "Designer", "days": 1}, {"name": "Concept", "role": "Designer", "days": 1}, {"name": "Design", "role": "Designer", "days": 1}, {"name": "Review", "role": "Client", "days": 1}, {"name": "Finalize", "role": "Designer", "days": 1}]'::jsonb,
    5
),
(
    'Poster Design',
    'Design',
    '🖼️',
    'Design a large-format poster.',
    '[{"name": "Brief", "role": "Designer", "days": 1}, {"name": "Concept", "role": "Designer", "days": 2}, {"name": "Design", "role": "Designer", "days": 2}, {"name": "Review", "role": "Client", "days": 1}, {"name": "Finalize", "role": "Designer", "days": 1}]'::jsonb,
    7
),
(
    'Social Media Graphics (Set of 10)',
    'Design',
    '🖼️',
    'Create a set of 10 social media graphics.',
    '[{"name": "Content Calendar", "role": "Social Media Manager", "days": 1}, {"name": "Concepts", "role": "Designer", "days": 2}, {"name": "Design", "role": "Designer", "days": 3}, {"name": "Review", "role": "Client", "days": 1}, {"name": "Finalize", "role": "Designer", "days": 1}]'::jsonb,
    8
),
(
    'Instagram Post Design',
    'Design',
    '📸',
    'Design a single Instagram post.',
    '[{"name": "Brief", "role": "Designer", "days": 1}, {"name": "Concept", "role": "Designer", "days": 1}, {"name": "Design", "role": "Designer", "days": 1}, {"name": "Review", "role": "Client", "days": 1}]'::jsonb,
    4
),
(
    'Instagram Story Design (Set of 5)',
    'Design',
    '📱',
    'Design a set of 5 Instagram stories.',
    '[{"name": "Brief", "role": "Designer", "days": 1}, {"name": "Concept", "role": "Designer", "days": 1}, {"name": "Design", "role": "Designer", "days": 1}, {"name": "Review", "role": "Client", "days": 1}]'::jsonb,
    4
),
(
    'Banner Ad Design',
    'Design',
    '📊',
    'Design a banner ad for digital advertising.',
    '[{"name": "Brief", "role": "Designer", "days": 1}, {"name": "Concept", "role": "Designer", "days": 1}, {"name": "Design", "role": "Designer", "days": 1}, {"name": "Review", "role": "Client", "days": 1}]'::jsonb,
    4
),
(
    'Magazine Layout Design',
    'Design',
    '📰',
    'Design a magazine page layout.',
    '[{"name": "Brief", "role": "Designer", "days": 1}, {"name": "Content", "role": "Content Writer", "days": 2}, {"name": "Layout", "role": "Designer", "days": 2}, {"name": "Review", "role": "Client", "days": 1}, {"name": "Finalize", "role": "Designer", "days": 1}]'::jsonb,
    7
),
(
    'Book Cover Design',
    'Design',
    '📕',
    'Design a book cover.',
    '[{"name": "Brief", "role": "Designer", "days": 1}, {"name": "Concept", "role": "Designer", "days": 2}, {"name": "Design", "role": "Designer", "days": 2}, {"name": "Review", "role": "Client", "days": 1}, {"name": "Finalize", "role": "Designer", "days": 1}]'::jsonb,
    7
),
(
    'Packaging Design',
    'Design',
    '📦',
    'Design product packaging.',
    '[{"name": "Brief", "role": "Designer", "days": 2}, {"name": "Research", "role": "Designer", "days": 2}, {"name": "Concept", "role": "Designer", "days": 2}, {"name": "Design", "role": "Designer", "days": 3}, {"name": "Mockup", "role": "Designer", "days": 1}, {"name": "Review", "role": "Client", "days": 1}, {"name": "Finalize", "role": "Designer", "days": 1}]'::jsonb,
    12
),
(
    'UI/UX Design - Mobile App (10 screens)',
    'Design',
    '📱',
    'Design 10 screens for a mobile app.',
    '[{"name": "User Research", "role": "UX Researcher", "days": 2}, {"name": "Wireframes", "role": "UX Designer", "days": 3}, {"name": "High Fidelity", "role": "UI Designer", "days": 4}, {"name": "Prototype", "role": "UX Designer", "days": 2}, {"name": "User Testing", "role": "UX Researcher", "days": 2}, {"name": "Handoff", "role": "UI Designer", "days": 1}]'::jsonb,
    14
),
(
    'UI/UX Design - Website (15 screens)',
    'Design',
    '🌐',
    'Design 15 screens for a website.',
    '[{"name": "User Research", "role": "UX Researcher", "days": 2}, {"name": "Wireframes", "role": "UX Designer", "days": 3}, {"name": "High Fidelity", "role": "UI Designer", "days": 5}, {"name": "Prototype", "role": "UX Designer", "days": 2}, {"name": "User Testing", "role": "UX Researcher", "days": 2}, {"name": "Handoff", "role": "UI Designer", "days": 1}]'::jsonb,
    15
),
(
    'Design System Creation',
    'Design',
    '🎨',
    'Create a complete design system.',
    '[{"name": "Audit", "role": "UI Designer", "days": 2}, {"name": "Color System", "role": "UI Designer", "days": 2}, {"name": "Typography", "role": "UI Designer", "days": 2}, {"name": "Components", "role": "UI Designer", "days": 5}, {"name": "Documentation", "role": "UX Writer", "days": 3}, {"name": "Review", "role": "Product Manager", "days": 2}]'::jsonb,
    16
),
(
    'Motion Graphics (15 sec)',
    'Design',
    '✨',
    'Create a 15-second motion graphic.',
    '[{"name": "Concept", "role": "Designer", "days": 1}, {"name": "Storyboard", "role": "Designer", "days": 1}, {"name": "Animation", "role": "Motion Designer", "days": 2}, {"name": "Sound", "role": "Audio Engineer", "days": 1}, {"name": "Review", "role": "Client", "days": 1}]'::jsonb,
    6
),
(
    'Infographic Design',
    'Design',
    '📊',
    'Design a data-driven infographic.',
    '[{"name": "Data Collection", "role": "Researcher", "days": 2}, {"name": "Storyboard", "role": "Designer", "days": 1}, {"name": "Design", "role": "Designer", "days": 2}, {"name": "Review", "role": "Client", "days": 1}, {"name": "Finalize", "role": "Designer", "days": 1}]'::jsonb,
    7
),
(
    'Presentation Design (10 slides)',
    'Design',
    '📊',
    'Design a professional presentation.',
    '[{"name": "Content", "role": "Content Writer", "days": 2}, {"name": "Design Template", "role": "Designer", "days": 1}, {"name": "Slides Design", "role": "Designer", "days": 2}, {"name": "Animations", "role": "Designer", "days": 1}, {"name": "Review", "role": "Client", "days": 1}]'::jsonb,
    7
),
(
    'Menu Design (Restaurant)',
    'Design',
    '🍽️',
    'Design a restaurant menu.',
    '[{"name": "Brief", "role": "Designer", "days": 1}, {"name": "Content", "role": "Content Writer", "days": 1}, {"name": "Design", "role": "Designer", "days": 2}, {"name": "Review", "role": "Client", "days": 1}, {"name": "Finalize", "role": "Designer", "days": 1}]'::jsonb,
    6
),
(
    'Wedding Invitation Design',
    'Design',
    '💌',
    'Design a wedding invitation.',
    '[{"name": "Brief", "role": "Designer", "days": 1}, {"name": "Concept", "role": "Designer", "days": 2}, {"name": "Design", "role": "Designer", "days": 2}, {"name": "Review", "role": "Client", "days": 1}, {"name": "Finalize", "role": "Designer", "days": 1}]'::jsonb,
    7
),
(
    'Digital Art Illustration',
    'Design',
    '🖌️',
    'Create a digital illustration.',
    '[{"name": "Brief", "role": "Illustrator", "days": 1}, {"name": "Sketches", "role": "Illustrator", "days": 2}, {"name": "Digital Art", "role": "Illustrator", "days": 3}, {"name": "Review", "role": "Client", "days": 1}, {"name": "Finalize", "role": "Illustrator", "days": 1}]'::jsonb,
    8
),
(
    'UI/UX Audit Report',
    'Design',
    '🔎',
    'Audit existing product UI/UX and provide recommendations.',
    '[{"name": "Heuristic Review", "role": "UX Researcher", "days": 2}, {"name": "User Testing", "role": "UX Researcher", "days": 2}, {"name": "Report", "role": "UX Designer", "days": 2}, {"name": "Presentation", "role": "UX Designer", "days": 1}]'::jsonb,
    7
),
(
    'T-Shirt Design',
    'Design',
    '👕',
    'Design a t-shirt graphic.',
    '[{"name": "Brief", "role": "Designer", "days": 1}, {"name": "Concept", "role": "Designer", "days": 2}, {"name": "Design", "role": "Designer", "days": 2}, {"name": "Mockup", "role": "Designer", "days": 1}, {"name": "Review", "role": "Client", "days": 1}]'::jsonb,
    7
),
(
    'Sticker Design',
    'Design',
    '🏷️',
    'Design a sticker set.',
    '[{"name": "Brief", "role": "Designer", "days": 1}, {"name": "Concept", "role": "Designer", "days": 1}, {"name": "Design", "role": "Designer", "days": 2}, {"name": "Review", "role": "Client", "days": 1}]'::jsonb,
    5
),
(
    'Emoji/Icon Set Design',
    'Design',
    '😊',
    'Design a set of icons or emojis.',
    '[{"name": "Brief", "role": "Designer", "days": 1}, {"name": "Concept", "role": "Designer", "days": 2}, {"name": "Design", "role": "Designer", "days": 3}, {"name": "Review", "role": "Client", "days": 1}]'::jsonb,
    7
),
(
    'Wallpaper Design (Desktop/Mobile)',
    'Design',
    '🖥️',
    'Design a digital wallpaper.',
    '[{"name": "Brief", "role": "Designer", "days": 1}, {"name": "Concept", "role": "Designer", "days": 1}, {"name": "Design", "role": "Designer", "days": 2}, {"name": "Review", "role": "Client", "days": 1}]'::jsonb,
    5
),
(
    'Merchandise Mockup',
    'Design',
    '🛍️',
    'Create product mockups for merchandise.',
    '[{"name": "Brief", "role": "Designer", "days": 1}, {"name": "Mockup", "role": "Designer", "days": 2}, {"name": "Review", "role": "Client", "days": 1}, {"name": "Finalize", "role": "Designer", "days": 1}]'::jsonb,
    5
);

-- ============================================
-- SECTION 4: PHOTOGRAPHY (25+)
-- ============================================

INSERT INTO workflow_templates (name, category, icon, description, steps, estimated_days) VALUES

(
    'Product Photography (10 items)',
    'Photography',
    '📷',
    'Photograph 10 products for e-commerce.',
    '[{"name": "Setup Studio", "role": "Photographer", "days": 1}, {"name": "Shoot", "role": "Photographer", "days": 2}, {"name": "Retouch", "role": "Photo Editor", "days": 2}, {"name": "Deliver", "role": "Photographer", "days": 1}]'::jsonb,
    6
),
(
    'Portrait Photography (2 hours)',
    'Photography',
    '👤',
    'Professional portrait photography session.',
    '[{"name": "Consultation", "role": "Photographer", "days": 1}, {"name": "Shoot", "role": "Photographer", "days": 1}, {"name": "Retouch", "role": "Photo Editor", "days": 2}, {"name": "Deliver", "role": "Photographer", "days": 1}]'::jsonb,
    5
),
(
    'Wedding Photography',
    'Photography',
    '💒',
    'Full wedding photography coverage.',
    '[{"name": "Consultation", "role": "Photographer", "days": 2}, {"name": "Shoot Day", "role": "Photographer", "days": 2}, {"name": "Culling", "role": "Photographer", "days": 2}, {"name": "Retouch", "role": "Photo Editor", "days": 5}, {"name": "Album Design", "role": "Designer", "days": 3}, {"name": "Deliver", "role": "Photographer", "days": 2}]'::jsonb,
    16
),
(
    'Real Estate Photography',
    'Photography',
    '🏠',
    'Photograph a property for real estate listing.',
    '[{"name": "Site Visit", "role": "Photographer", "days": 1}, {"name": "Shoot", "role": "Photographer", "days": 1}, {"name": "Retouch", "role": "Photo Editor", "days": 1}, {"name": "Virtual Tour", "role": "Tech", "days": 1}]'::jsonb,
    4
),
(
    'Food Photography',
    'Photography',
    '🍽️',
    'Food photography for a restaurant menu.',
    '[{"name": "Setup", "role": "Photographer", "days": 1}, {"name": "Shoot", "role": "Photographer", "days": 1}, {"name": "Retouch", "role": "Photo Editor", "days": 1}, {"name": "Deliver", "role": "Photographer", "days": 1}]'::jsonb,
    4
),
(
    'Fashion Photography',
    'Photography',
    '👗',
    'Fashion photoshoot with models.',
    '[{"name": "Concept", "role": "Creative Director", "days": 2}, {"name": "Model Casting", "role": "Photographer", "days": 2}, {"name": "Location", "role": "Photographer", "days": 1}, {"name": "Shoot", "role": "Photographer", "days": 2}, {"name": "Retouch", "role": "Photo Editor", "days": 3}, {"name": "Deliver", "role": "Photographer", "days": 1}]'::jsonb,
    11
),
(
    'Event Photography (4 hours)',
    'Photography',
    '🎉',
    'Photograph a corporate or social event.',
    '[{"name": "Brief", "role": "Photographer", "days": 1}, {"name": "Shoot", "role": "Photographer", "days": 1}, {"name": "Culling", "role": "Photographer", "days": 1}, {"name": "Retouch", "role": "Photo Editor", "days": 2}, {"name": "Deliver", "role": "Photographer", "days": 1}]'::jsonb,
    6
),
(
    'Drone Photography',
    'Photography',
    '🚁',
    'Aerial photography using drone.',
    '[{"name": "Planning", "role": "Drone Pilot", "days": 1}, {"name": "Shoot", "role": "Drone Pilot", "days": 1}, {"name": "Process", "role": "Photo Editor", "days": 1}, {"name": "Deliver", "role": "Drone Pilot", "days": 1}]'::jsonb,
    4
),
(
    'Photo Retouching (10 images)',
    'Photography',
    '🖌️',
    'Professional photo retouching.',
    '[{"name": "Brief", "role": "Photo Editor", "days": 1}, {"name": "Retouch", "role": "Photo Editor", "days": 2}, {"name": "Review", "role": "Client", "days": 1}, {"name": "Finalize", "role": "Photo Editor", "days": 1}]'::jsonb,
    5
),
(
    'Photo Restoration',
    'Photography',
    '🔄',
    'Restore old/damaged photographs.',
    '[{"name": "Brief", "role": "Photo Editor", "days": 1}, {"name": "Restoration", "role": "Photo Editor", "days": 2}, {"name": "Color Correction", "role": "Photo Editor", "days": 1}, {"name": "Review", "role": "Client", "days": 1}]'::jsonb,
    5
),
(
    '360° Virtual Tour',
    'Photography',
    '🌐',
    'Create a 360° virtual tour of a property.',
    '[{"name": "Shoot", "role": "Photographer", "days": 1}, {"name": "Stitching", "role": "Tech", "days": 1}, {"name": "Virtual Tour", "role": "Tech", "days": 1}, {"name": "Deliver", "role": "Photographer", "days": 1}]'::jsonb,
    4
),
(
    'Photo Album Design (20 pages)',
    'Photography',
    '📕',
    'Design a photo album.',
    '[{"name": "Select Photos", "role": "Photographer", "days": 1}, {"name": "Layout Design", "role": "Designer", "days": 2}, {"name": "Review", "role": "Client", "days": 1}, {"name": "Finalize", "role": "Designer", "days": 1}]'::jsonb,
    5
);

-- ============================================
-- SECTION 5: AUDIO & MUSIC PRODUCTION (20+)
-- ============================================

INSERT INTO workflow_templates (name, category, icon, description, steps, estimated_days) VALUES

(
    'Song Recording (Studio)',
    'Music',
    '🎵',
    'Record a song in a professional studio.',
    '[{"name": "Pre-Production", "role": "Producer", "days": 2}, {"name": "Recording", "role": "Audio Engineer", "days": 3}, {"name": "Mixing", "role": "Audio Engineer", "days": 2}, {"name": "Mastering", "role": "Audio Engineer", "days": 1}]'::jsonb,
    8
),
(
    'Music Production (Beat)',
    'Music',
    '🎛️',
    'Produce a beat/track.',
    '[{"name": "Concept", "role": "Producer", "days": 1}, {"name": "Production", "role": "Producer", "days": 3}, {"name": "Mixing", "role": "Audio Engineer", "days": 1}, {"name": "Mastering", "role": "Audio Engineer", "days": 1}]'::jsonb,
    6
),
(
    'Podcast Editing (60 min)',
    'Music',
    '🎙️',
    'Edit a 60-minute podcast episode.',
    '[{"name": "Audio Import", "role": "Audio Editor", "days": 1}, {"name": "Editing", "role": "Audio Editor", "days": 1}, {"name": "Cleanup", "role": "Audio Engineer", "days": 1}, {"name": "Mastering", "role": "Audio Engineer", "days": 1}]'::jsonb,
    4
),
(
    'Audio Mixing & Mastering',
    'Music',
    '🔊',
    'Mix and master a song.',
    '[{"name": "Mixing", "role": "Audio Engineer", "days": 2}, {"name": "Mastering", "role": "Audio Engineer", "days": 1}, {"name": "Review", "role": "Artist", "days": 1}]'::jsonb,
    4
),
(
    'Jingle Creation (30 sec)',
    'Music',
    '🔔',
    'Create a 30-second jingle for a brand.',
    '[{"name": "Brief", "role": "Composer", "days": 1}, {"name": "Melody", "role": "Composer", "days": 1}, {"name": "Production", "role": "Producer", "days": 1}, {"name": "Mix", "role": "Audio Engineer", "days": 1}]'::jsonb,
    4
),
(
    'Sound Design for Film',
    'Music',
    '🎬',
    'Sound design and Foley for film.',
    '[{"name": "Spotting", "role": "Sound Designer", "days": 1}, {"name": "Foley", "role": "Sound Designer", "days": 2}, {"name": "Sound Effects", "role": "Sound Designer", "days": 2}, {"name": "Final Mix", "role": "Audio Engineer", "days": 1}]'::jsonb,
    6
),
(
    'Audio Book Editing',
    'Music',
    '🎧',
    'Edit an audiobook recording.',
    '[{"name": "Import Audio", "role": "Audio Editor", "days": 1}, {"name": "Edit", "role": "Audio Editor", "days": 2}, {"name": "Proof", "role": "Proofreader", "days": 1}, {"name": "Master", "role": "Audio Engineer", "days": 1}]'::jsonb,
    5
);

-- ============================================
-- SECTION 6: FASHION & BEAUTY (15+)
-- ============================================

INSERT INTO workflow_templates (name, category, icon, description, steps, estimated_days) VALUES

(
    'Fashion Collection Design',
    'Fashion',
    '👗',
    'Design a fashion collection (10 pieces).',
    '[{"name": "Research", "role": "Fashion Designer", "days": 3}, {"name": "Sketches", "role": "Fashion Designer", "days": 3}, {"name": "Pattern Making", "role": "Pattern Maker", "days": 4}, {"name": "Sample", "role": "Tailor", "days": 3}, {"name": "Review", "role": "Fashion Designer", "days": 2}]'::jsonb,
    15
),
(
    'Tailoring/Custom Dress',
    'Fashion',
    '🧵',
    'Create a custom-tailored dress.',
    '[{"name": "Measuring", "role": "Tailor", "days": 1}, {"name": "Design", "role": "Tailor", "days": 1}, {"name": "Cutting", "role": "Tailor", "days": 1}, {"name": "Stitching", "role": "Tailor", "days": 2}, {"name": "Fitting", "role": "Tailor", "days": 1}]'::jsonb,
    6
),
(
    'Makeup Session (Bridal)',
    'Beauty',
    '💄',
    'Bridal makeup session.',
    '[{"name": "Consultation", "role": "Makeup Artist", "days": 1}, {"name": "Trial", "role": "Makeup Artist", "days": 1}, {"name": "Actual", "role": "Makeup Artist", "days": 1}]'::jsonb,
    3
),
(
    'Skincare Routine Design',
    'Beauty',
    '🧴',
    'Design a personalized skincare routine.',
    '[{"name": "Skin Analysis", "role": "Dermatologist", "days": 1}, {"name": "Research", "role": "Beauty Expert", "days": 1}, {"name": "Plan", "role": "Beauty Expert", "days": 1}, {"name": "Review", "role": "Client", "days": 1}]'::jsonb,
    4
),
(
    'Hairstyle Design',
    'Beauty',
    '💇',
    'Design a hairstyle for a client.',
    '[{"name": "Consultation", "role": "Hairstylist", "days": 1}, {"name": "Design", "role": "Hairstylist", "days": 1}, {"name": "Cut/Style", "role": "Hairstylist", "days": 1}]'::jsonb,
    3
),
(
    'Jewelry Design',
    'Fashion',
    '💍',
    'Design custom jewelry.',
    '[{"name": "Brief", "role": "Jewelry Designer", "days": 1}, {"name": "Sketches", "role": "Jewelry Designer", "days": 2}, {"name": "3D Model", "role": "Jewelry Designer", "days": 2}, {"name": "Cast", "role": "Jeweler", "days": 2}, {"name": "Polish", "role": "Jeweler", "days": 1}]'::jsonb,
    8
);

-- ============================================
-- SECTION 7: INTERIOR DESIGN & ARCHITECTURE (15+)
-- ============================================

INSERT INTO workflow_templates (name, category, icon, description, steps, estimated_days) VALUES

(
    'Interior Design (Full House)',
    'Interior',
    '🏠',
    'Complete interior design for a house.',
    '[{"name": "Brief", "role": "Interior Designer", "days": 2}, {"name": "Site Visit", "role": "Interior Designer", "days": 1}, {"name": "Moodboard", "role": "Interior Designer", "days": 2}, {"name": "3D Renders", "role": "3D Artist", "days": 4}, {"name": "Material Selection", "role": "Interior Designer", "days": 2}, {"name": "Execution", "role": "Project Manager", "days": 10}]'::jsonb,
    21
),
(
    'Office Interior Design',
    'Interior',
    '🏢',
    'Design a corporate office interior.',
    '[{"name": "Brief", "role": "Interior Designer", "days": 2}, {"name": "Site Visit", "role": "Interior Designer", "days": 1}, {"name": "Space Planning", "role": "Interior Designer", "days": 2}, {"name": "3D Renders", "role": "3D Artist", "days": 3}, {"name": "Execution", "role": "Project Manager", "days": 8}]'::jsonb,
    16
),
(
    'Kitchen Design',
    'Interior',
    '🍳',
    'Design a modern kitchen.',
    '[{"name": "Brief", "role": "Interior Designer", "days": 1}, {"name": "Layout", "role": "Interior Designer", "days": 2}, {"name": "3D Renders", "role": "3D Artist", "days": 2}, {"name": "Material Selection", "role": "Interior Designer", "days": 1}, {"name": "Execution", "role": "Project Manager", "days": 4}]'::jsonb,
    10
),
(
    'Bathroom Design',
    'Interior',
    '🚿',
    'Design a modern bathroom.',
    '[{"name": "Brief", "role": "Interior Designer", "days": 1}, {"name": "Layout", "role": "Interior Designer", "days": 1}, {"name": "3D Renders", "role": "3D Artist", "days": 2}, {"name": "Material Selection", "role": "Interior Designer", "days": 1}, {"name": "Execution", "role": "Project Manager", "days": 3}]'::jsonb,
    8
),
(
    'Architectural Blueprint (House)',
    'Architecture',
    '🏛️',
    'Create architectural blueprints for a house.',
    '[{"name": "Site Analysis", "role": "Architect", "days": 3}, {"name": "Concept", "role": "Architect", "days": 3}, {"name": "Schematic Design", "role": "Architect", "days": 4}, {"name": "Design Development", "role": "Architect", "days": 5}, {"name": "Construction Docs", "role": "Architect", "days": 3}]'::jsonb,
    18
),
(
    'Commercial Building Design',
    'Architecture',
    '🏗️',
    'Design a commercial building.',
    '[{"name": "Site Analysis", "role": "Architect", "days": 4}, {"name": "Concept", "role": "Architect", "days": 4}, {"name": "Schematic Design", "role": "Architect", "days": 5}, {"name": "Design Development", "role": "Architect", "days": 6}, {"name": "Construction Docs", "role": "Architect", "days": 4}]'::jsonb,
    23
),
(
    'Landscape Design',
    'Interior',
    '🌿',
    'Design outdoor landscape.',
    '[{"name": "Site Visit", "role": "Landscape Designer", "days": 1}, {"name": "Concept", "role": "Landscape Designer", "days": 2}, {"name": "Design", "role": "Landscape Designer", "days": 2}, {"name": "Plant Selection", "role": "Landscape Designer", "days": 1}, {"name": "Execution", "role": "Project Manager", "days": 3}]'::jsonb,
    9
);

-- ============================================
-- COUNT VERIFICATION
-- ============================================
SELECT
    'PART 1: ' || COUNT(*) || ' templates inserted.' AS message
FROM workflow_templates;
