// src/scripts/seed-work-templates.js

import { pool } from '../config/database.js';

/**
 * Helper
 * Converts compact step definitions into the JSON structure
 * expected by workflow_templates.steps.
 */
const t = (name, category, icon, description, steps) => ({
    name,
    category,
    icon,
    description,
    steps: steps.map(([stepName, role, days]) => ({
        name: stepName,
        role,
        days,
    })),
    estimated_days: steps.reduce(
        (total, [, , days]) => total + days,
        0
    ),
    is_active: true,
});

/**
 * ============================================================
 * CANONICAL WORK TEMPLATE LIBRARY
 * ============================================================
 *
 * 19 Categories
 * 59 unique templates
 *
 * Note:
 * Product Photography is intentionally kept under E-commerce.
 * Photography contains Real Estate Photography.
 */

const templates = [

    // ============================================================
    // 🎬 VIDEO & PRODUCTION
    // ============================================================

    t(
        'Short Video Production',
        'Video & Production',
        '🎬',
        'Workflow for producing short-form video content from research through publishing.',
        [
            ['Content Research & Topic Selection', 'Content Strategist', 1],
            ['Script Writing', 'Script Writer', 1],
            ['Pre-Production Planning', 'Producer / Content Manager', 1],
            ['Video Recording', 'Videographer / Creator', 1],
            ['Video Editing', 'Video Editor', 2],
            ['Captions & Graphics', 'Video Editor / Motion Designer', 1],
            ['Review & Revisions', 'Content Manager', 1],
            ['Final Export & Quality Check', 'Video Editor', 1],
            ['Upload & Publishing', 'Social Media Manager', 1],
        ]
    ),

    t(
        'YouTube Video Production',
        'Video & Production',
        '🎬',
        'End-to-end workflow for producing and publishing a professional YouTube video.',
        [
            ['Topic & Audience Research', 'Content Strategist', 2],
            ['Content Research', 'Researcher', 2],
            ['Script Writing', 'Script Writer', 2],
            ['Script Review', 'Content Manager', 1],
            ['Pre-Production & Shot Planning', 'Producer', 2],
            ['Video Recording', 'Videographer / Creator', 2],
            ['Footage Organization', 'Video Editor', 1],
            ['Video Editing', 'Video Editor', 4],
            ['Audio Cleanup & Sound Design', 'Audio Editor', 2],
            ['Graphics / Captions', 'Motion Designer', 2],
            ['Thumbnail Design', 'Graphic Designer', 1],
            ['Final Review & Revisions', 'Content Manager', 2],
            ['SEO Metadata & Upload', 'YouTube / SEO Specialist', 1],
            ['Final Quality Check & Publish', 'Content Manager', 1],
        ]
    ),

    t(
        'Long-form Video Production',
        'Video & Production',
        '🎬',
        'Professional workflow for research-heavy, long-form video production.',
        [
            ['Project Brief & Objective', 'Producer', 1],
            ['Topic & Audience Research', 'Content Strategist', 2],
            ['Deep Research & Fact Checking', 'Researcher', 3],
            ['Outline & Story Structure', 'Script Writer', 2],
            ['Script Writing', 'Script Writer', 4],
            ['Script Review & Approval', 'Producer / Editor', 2],
            ['Pre-Production Planning', 'Producer', 3],
            ['Shot List & Production Setup', 'Director / Producer', 2],
            ['Video Production', 'Videographer / Production Team', 3],
            ['Footage Organization', 'Assistant Editor', 1],
            ['Rough Cut', 'Video Editor', 4],
            ['Fine Editing', 'Video Editor', 4],
            ['Audio Post-Production', 'Audio Engineer', 2],
            ['Color Correction & Grading', 'Colorist', 2],
            ['Motion Graphics & Captions', 'Motion Designer', 3],
            ['Thumbnail & Packaging', 'Graphic Designer', 2],
            ['Review & Revisions', 'Producer', 3],
            ['Final QC & Export', 'Video Editor', 1],
            ['SEO, Upload & Publishing', 'Content Manager', 1],
        ]
    ),

    t(
        'Product Video Production',
        'Video & Production',
        '🎬',
        'Workflow for creating product-focused marketing videos from concept through delivery.',
        [
            ['Product Brief & Objectives', 'Product Marketing Manager', 1],
            ['Product & Audience Research', 'Product Marketer', 2],
            ['Creative Concept', 'Creative Director', 2],
            ['Script & Storyboard', 'Script Writer / Director', 2],
            ['Production Planning', 'Producer', 2],
            ['Product Shoot', 'Videographer', 2],
            ['Rough Edit', 'Video Editor', 2],
            ['Motion Graphics & Product Callouts', 'Motion Designer', 2],
            ['Sound Design & Music', 'Audio Editor', 1],
            ['Color Correction', 'Colorist / Editor', 1],
            ['Review & Revisions', 'Marketing Manager', 2],
            ['Final Export & Quality Check', 'Video Editor', 1],
            ['Delivery / Publishing', 'Marketing Manager', 1],
        ]
    ),

    t(
        'Interview Video Production',
        'Video & Production',
        '🎬',
        'Workflow for planning, recording, editing and publishing interview-based video content.',
        [
            ['Interview Objective & Topic', 'Producer', 1],
            ['Guest Research & Coordination', 'Producer / Coordinator', 2],
            ['Interview Questions & Structure', 'Content Writer / Producer', 1],
            ['Location & Equipment Planning', 'Production Manager', 1],
            ['Interview Recording', 'Videographer / Camera Team', 1],
            ['Footage & Audio Organization', 'Assistant Editor', 1],
            ['Rough Cut', 'Video Editor', 2],
            ['Audio Cleanup', 'Audio Editor', 1],
            ['Graphics, Captions & B-roll', 'Video Editor', 2],
            ['Thumbnail / Cover Design', 'Graphic Designer', 1],
            ['Review & Revisions', 'Producer', 1],
            ['Final QC & Export', 'Video Editor', 1],
            ['Upload & Publishing', 'Content Manager', 1],
        ]
    ),

    // ============================================================
    // 📱 SOCIAL MEDIA
    // ============================================================

    t(
        'Social Media Post',
        'Social Media',
        '📱',
        'Workflow for creating, reviewing, publishing and checking the performance of a social media post.',
        [
            ['Post Objective & Brief', 'Social Media Manager', 1],
            ['Topic & Audience Research', 'Content Strategist', 1],
            ['Content / Caption Writing', 'Content Writer', 1],
            ['Creative Design', 'Graphic Designer', 1],
            ['Internal Review', 'Social Media Manager', 1],
            ['Revisions & Finalization', 'Designer / Writer', 1],
            ['Scheduling & Publishing', 'Social Media Manager', 1],
            ['Performance Check', 'Social Media Manager', 1],
        ]
    ),

    t(
        'Instagram Campaign',
        'Social Media',
        '📱',
        'End-to-end Instagram campaign workflow covering strategy, content production, publishing and analysis.',
        [
            ['Campaign Goal & Brief', 'Social Media Manager', 1],
            ['Audience Research', 'Social Media Strategist', 2],
            ['Competitor & Trend Research', 'Content Strategist', 2],
            ['Content Strategy', 'Social Media Strategist', 2],
            ['Content Calendar', 'Social Media Manager', 2],
            ['Content & Caption Creation', 'Content Writer', 4],
            ['Creative Design', 'Graphic Designer', 4],
            ['Reels / Short Video Production', 'Video Editor', 3],
            ['Internal Review', 'Social Media Manager', 2],
            ['Revisions & Finalization', 'Content + Design Team', 2],
            ['Scheduling', 'Social Media Manager', 1],
            ['Publishing', 'Social Media Manager', 1],
            ['Engagement & Community Management', 'Community Manager', 5],
            ['Performance Analysis', 'Social Media Analyst', 2],
            ['Campaign Report & Optimization', 'Social Media Manager', 2],
        ]
    ),

    t(
        'LinkedIn Content Campaign',
        'Social Media',
        '📱',
        'Professional LinkedIn content campaign workflow from audience research through optimization.',
        [
            ['Content Goals & Audience Definition', 'LinkedIn Strategist', 1],
            ['Industry & Topic Research', 'Researcher', 2],
            ['Content Pillars', 'Content Strategist', 2],
            ['Content Calendar', 'Social Media Manager', 2],
            ['Post Writing', 'Content Writer', 4],
            ['Supporting Creative Design', 'Graphic Designer', 3],
            ['Internal Review', 'Content Manager', 2],
            ['Revisions & Approval', 'Writer / Manager', 2],
            ['Scheduling & Publishing', 'Social Media Manager', 1],
            ['Engagement & Comment Management', 'Community Manager', 5],
            ['Analytics & Performance Review', 'Social Media Analyst', 2],
            ['Content Optimization', 'Content Strategist', 2],
        ]
    ),

    t(
        'Social Media Campaign',
        'Social Media',
        '📱',
        'Cross-platform social media campaign workflow from campaign brief through reporting and optimization.',
        [
            ['Campaign Brief & Objectives', 'Marketing Manager', 1],
            ['Audience Research', 'Marketing Strategist', 2],
            ['Competitor Research', 'Marketing Strategist', 2],
            ['Campaign Strategy', 'Marketing Manager', 2],
            ['Content Plan & Calendar', 'Social Media Manager', 2],
            ['Copywriting', 'Content Writer', 3],
            ['Creative Production', 'Designer / Video Editor', 4],
            ['Internal Review', 'Marketing Manager', 1],
            ['Client / Stakeholder Approval', 'Account Manager', 2],
            ['Revisions & Final Assets', 'Creative Team', 2],
            ['Scheduling & Publishing', 'Social Media Manager', 1],
            ['Community Management', 'Community Manager', 7],
            ['Performance Monitoring', 'Social Media Analyst', 7],
            ['Performance Report', 'Marketing Analyst', 2],
            ['Optimization & Next-cycle Recommendations', 'Marketing Manager', 2],
        ]
    ),

    // ============================================================
    // ✍️ CONTENT
    // ============================================================

    t(
        'Blog Writing',
        'Content',
        '✍️',
        'SEO-focused blog production workflow from topic research through publishing.',
        [
            ['Topic & Search Intent Research', 'Content Strategist', 1],
            ['Keyword Research', 'SEO Specialist', 1],
            ['Competitor & Content Research', 'SEO Specialist', 1],
            ['Content Outline', 'Content Strategist', 1],
            ['First Draft', 'Content Writer', 2],
            ['Editing & Proofreading', 'Editor', 1],
            ['SEO Optimization', 'SEO Specialist', 1],
            ['Images & Supporting Graphics', 'Graphic Designer', 1],
            ['Final Review', 'Content Manager', 1],
            ['Publish', 'Content Manager', 1],
        ]
    ),

    t(
        'Long-form Article',
        'Content',
        '✍️',
        'Research-heavy editorial workflow for producing long-form articles.',
        [
            ['Topic & Objective Definition', 'Content Strategist', 1],
            ['Deep Research & Data Collection', 'Researcher', 3],
            ['Expert / Source Validation', 'Subject Matter Expert', 2],
            ['Article Structure & Outline', 'Content Strategist', 1],
            ['Draft Writing', 'Content Writer', 4],
            ['Subject Matter Review', 'Subject Matter Expert', 2],
            ['Editing & Fact Checking', 'Editor', 2],
            ['SEO Optimization', 'SEO Specialist', 1],
            ['Graphics / Charts / Images', 'Designer', 2],
            ['Final Editorial Review', 'Content Manager', 1],
            ['Publishing & Formatting', 'Content Manager', 1],
        ]
    ),

    t(
        'Case Study',
        'Content',
        '✍️',
        'Workflow for developing customer case studies from interviews and data through publication.',
        [
            ['Case Study Objective', 'Content Strategist', 1],
            ['Client / Stakeholder Interview', 'Content Writer', 2],
            ['Data & Results Collection', 'Researcher', 2],
            ['Story Structure & Outline', 'Content Strategist', 1],
            ['First Draft', 'Content Writer', 3],
            ['Internal Review', 'Editor', 1],
            ['Client / Stakeholder Review', 'Account Manager', 2],
            ['Revisions', 'Content Writer', 2],
            ['Design & Layout', 'Designer', 2],
            ['Final Proofreading', 'Editor', 1],
            ['Publish & Distribute', 'Content Manager', 1],
        ]
    ),

    t(
        'Newsletter',
        'Content',
        '✍️',
        'Workflow for planning, creating, QA testing and analyzing an email newsletter.',
        [
            ['Newsletter Objective & Audience', 'Email Marketing Manager', 1],
            ['Content Curation / Research', 'Content Researcher', 1],
            ['Content Writing', 'Content Writer', 2],
            ['Editorial Review', 'Editor', 1],
            ['Email Design', 'Email Designer', 1],
            ['CTA & Conversion Review', 'Marketing Manager', 1],
            ['Email Setup & Formatting', 'Email Marketing Specialist', 1],
            ['Test Email & QA', 'QA / Marketing Ops', 1],
            ['Schedule & Send', 'Email Marketing Manager', 1],
            ['Performance Analysis', 'Marketing Analyst', 1],
        ]
    ),

    t(
        'Copywriting',
        'Content',
        '✍️',
        'Professional copywriting workflow from research and positioning through approval and handoff.',
        [
            ['Product / Service Research', 'Copywriter', 1],
            ['Target Audience Research', 'Marketing Strategist', 1],
            ['Competitor & Market Research', 'Copywriter', 1],
            ['Messaging & Value Proposition', 'Copywriter', 2],
            ['Copy Draft', 'Copywriter', 2],
            ['Internal Review', 'Editor / Content Manager', 1],
            ['Conversion & SEO Review', 'SEO / CRO Specialist', 1],
            ['Revisions', 'Copywriter', 1],
            ['Final Approval', 'Marketing Manager', 1],
            ['Publish / Handoff', 'Content Manager', 1],
        ]
    ),

    // ============================================================
    // 🌐 WEB
    // ============================================================

    t(
        'Landing Page Development',
        'Web',
        '🌐',
        'Workflow for designing, developing, testing and deploying a conversion-focused landing page.',
        [
            ['Requirements & Conversion Goal', 'Product/Marketing Manager', 1],
            ['Audience & Competitor Research', 'Marketing Strategist', 1],
            ['Sitemap / Content Structure', 'UX Designer', 1],
            ['Wireframe', 'UX Designer', 1],
            ['UI Design', 'UI Designer', 2],
            ['Copywriting', 'Copywriter', 2],
            ['Frontend Development', 'Frontend Developer', 3],
            ['Form / Lead Integration', 'Backend Developer', 1],
            ['Responsive & Browser Testing', 'QA Engineer', 1],
            ['SEO & Performance Optimization', 'SEO / Frontend Specialist', 1],
            ['Final Review & Revisions', 'Project Manager', 1],
            ['Deployment', 'DevOps / Developer', 1],
        ]
    ),

    t(
        'Business Website Development',
        'Web',
        '🌐',
        'End-to-end workflow for building and launching a professional business website.',
        [
            ['Requirements & Discovery', 'Project Manager', 2],
            ['Business & Competitor Research', 'Business Analyst', 2],
            ['Sitemap & Information Architecture', 'UX Designer', 2],
            ['Content Planning', 'Content Strategist', 2],
            ['Wireframes', 'UX Designer', 2],
            ['UI/UX Design', 'UI/UX Designer', 4],
            ['Design Review & Approval', 'Project Manager', 1],
            ['Frontend Development', 'Frontend Developer', 6],
            ['Backend / CMS Development', 'Backend Developer', 5],
            ['Forms & Third-party Integrations', 'Full-stack Developer', 2],
            ['Content Integration', 'Content Manager', 2],
            ['QA & Cross-browser Testing', 'QA Engineer', 3],
            ['SEO & Performance Optimization', 'SEO Specialist', 2],
            ['Client Review & Revisions', 'Project Manager', 2],
            ['Deployment & Production Setup', 'DevOps Engineer', 1],
            ['Final QA & Launch', 'QA / Project Manager', 1],
        ]
    ),

    t(
        'E-commerce Website Development',
        'Web',
        '🌐',
        'End-to-end workflow for designing, developing, testing and launching an e-commerce website.',
        [
            ['Business & Product Requirements', 'Product Manager', 2],
            ['Market & Competitor Research', 'Business Analyst', 2],
            ['Product Catalog Planning', 'E-commerce Manager', 2],
            ['Sitemap & User Journey', 'UX Designer', 2],
            ['Wireframes', 'UX Designer', 2],
            ['UI/UX Design', 'UI/UX Designer', 5],
            ['Design Review & Approval', 'Product Manager', 2],
            ['Frontend Development', 'Frontend Developer', 8],
            ['Backend & Database Development', 'Backend Developer', 8],
            ['Product Catalog & Search', 'Full-stack Developer', 4],
            ['Cart & Checkout', 'Full-stack Developer', 4],
            ['Payment Gateway Integration', 'Backend Developer', 3],
            ['Shipping / Tax Integration', 'Backend Developer', 3],
            ['Admin / Order Management', 'Full-stack Developer', 4],
            ['Product Data Entry', 'E-commerce Manager', 3],
            ['Security & Functional Testing', 'QA Engineer', 4],
            ['Performance & SEO Optimization', 'SEO / Performance Specialist', 3],
            ['User Acceptance Testing', 'Product Manager', 2],
            ['Bug Fixes & Final Revisions', 'Development Team', 3],
            ['Production Deployment', 'DevOps Engineer', 1],
            ['Final QA & Launch', 'QA / Product Manager', 1],
        ]
    ),

    t(
        'Web Application Development',
        'Web',
        '🌐',
        'Full product development workflow for building and launching a production web application.',
        [
            ['Product Requirements & Discovery', 'Product Manager', 3],
            ['User & Business Research', 'Product Manager / Researcher', 2],
            ['Functional Specification', 'Business Analyst', 3],
            ['Technical Architecture', 'Tech Lead', 2],
            ['Database Design', 'Backend Developer', 2],
            ['UX Flow & Wireframes', 'UX Designer', 3],
            ['UI Design & Prototype', 'UI/UX Designer', 5],
            ['Design Review', 'Product Manager', 1],
            ['Frontend Development', 'Frontend Developer', 8],
            ['Backend Development', 'Backend Developer', 8],
            ['API Development & Integration', 'Backend Developer', 4],
            ['Authentication & Authorization', 'Backend Developer', 3],
            ['Third-party Integrations', 'Full-stack Developer', 3],
            ['Unit & Integration Testing', 'Developers / QA', 3],
            ['End-to-End & Functional Testing', 'QA Engineer', 4],
            ['Security & Performance Testing', 'QA / Security Engineer', 3],
            ['User Acceptance Testing', 'Product Manager', 2],
            ['Bug Fixing & Stabilization', 'Development Team', 4],
            ['Production Infrastructure & Deployment', 'DevOps Engineer', 2],
            ['Final Production QA', 'QA Engineer', 2],
            ['Launch & Handover', 'Product Manager', 1],
        ]
    ),

    // ============================================================
    // 📱 APP DEVELOPMENT
    // ============================================================

    t(
        'Android/iOS App Development',
        'App Development',
        '📱',
        'End-to-end native mobile application development workflow for Android and iOS.',
        [
            ['Product Requirements & Discovery', 'Product Manager', 3],
            ['User & Competitor Research', 'Product Researcher', 2],
            ['Functional Specification', 'Business Analyst', 3],
            ['User Flow & Information Architecture', 'UX Designer', 2],
            ['Wireframes', 'UX Designer', 3],
            ['UI Design & Prototype', 'UI/UX Designer', 5],
            ['Technical Architecture', 'Mobile Tech Lead', 2],
            ['Database & API Planning', 'Backend Developer', 2],
            ['Android Development', 'Android Developer', 8],
            ['iOS Development', 'iOS Developer', 8],
            ['Backend & API Development', 'Backend Developer', 7],
            ['API / App Integration', 'Mobile Developer', 3],
            ['Authentication & Core Integrations', 'Mobile / Backend Developer', 3],
            ['Unit & Integration Testing', 'Developers', 3],
            ['Functional & Device Testing', 'QA Engineer', 4],
            ['Performance & Security Testing', 'QA / Security Engineer', 3],
            ['Bug Fixing & Stabilization', 'Development Team', 4],
            ['User Acceptance Testing', 'Product Manager', 2],
            ['Production Configuration', 'DevOps Engineer', 2],
            ['App Store / Play Store Preparation', 'Release Manager', 2],
            ['Store Submission', 'Mobile Developer / Release Manager', 1],
            ['Final Verification & Launch', 'QA / Product Manager', 1],
        ]
    ),

    t(
        'React Native App Development',
        'App Development',
        '📱',
        'Cross-platform React Native application development workflow from discovery through release.',
        [
            ['Product Requirements & Discovery', 'Product Manager', 3],
            ['User & Competitor Research', 'Product Researcher', 2],
            ['Functional Specification', 'Business Analyst', 3],
            ['User Flow & Wireframes', 'UX Designer', 3],
            ['UI Design & Prototype', 'UI/UX Designer', 5],
            ['React Native Architecture & Setup', 'Tech Lead', 2],
            ['Backend & Database Development', 'Backend Developer', 7],
            ['React Native Development', 'React Native Developer', 10],
            ['API Integration', 'React Native / Backend Developer', 3],
            ['Native Module Integration', 'React Native Developer', 3],
            ['Authentication & Core Features', 'React Native Developer', 4],
            ['Unit & Integration Testing', 'Developers', 3],
            ['Device & Functional Testing', 'QA Engineer', 4],
            ['Performance Testing', 'QA Engineer', 2],
            ['Bug Fixing & Stabilization', 'Development Team', 4],
            ['User Acceptance Testing', 'Product Manager', 2],
            ['Production Build Configuration', 'DevOps / Mobile Developer', 2],
            ['Play Store / App Store Submission', 'Release Manager', 2],
            ['Final Verification & Launch', 'QA / Product Manager', 1],
        ]
    ),

    t(
        'Flutter App Development',
        'App Development',
        '📱',
        'Cross-platform Flutter application development workflow from product planning through release.',
        [
            ['Product Requirements & Discovery', 'Product Manager', 3],
            ['User & Competitor Research', 'Product Researcher', 2],
            ['Functional Specification', 'Business Analyst', 3],
            ['User Flow & Wireframes', 'UX Designer', 3],
            ['UI Design & Prototype', 'UI/UX Designer', 5],
            ['Flutter Architecture & Project Setup', 'Tech Lead', 2],
            ['Backend & Database Development', 'Backend Developer', 7],
            ['Flutter Development', 'Flutter Developer', 10],
            ['API Integration', 'Flutter / Backend Developer', 3],
            ['Native Platform Integration', 'Flutter Developer', 3],
            ['Authentication & Core Features', 'Flutter Developer', 4],
            ['Unit & Integration Testing', 'Developers', 3],
            ['Device & Functional Testing', 'QA Engineer', 4],
            ['Performance Testing', 'QA Engineer', 2],
            ['Bug Fixing & Stabilization', 'Development Team', 4],
            ['User Acceptance Testing', 'Product Manager', 2],
            ['Production Build Configuration', 'DevOps / Mobile Developer', 2],
            ['Play Store / App Store Submission', 'Release Manager', 2],
            ['Final Verification & Launch', 'QA / Product Manager', 1],
        ]
    ),

    // ============================================================
    // 💻 SOFTWARE
    // ============================================================

    t(
        'SaaS Product Development',
        'Software',
        '💻',
        'End-to-end SaaS product development workflow from discovery and architecture through launch.',
        [
            ['Product Requirements & Discovery', 'Product Manager', 3],
            ['User & Market Research', 'Product Researcher', 3],
            ['Functional Specification', 'Business Analyst', 3],
            ['Product Architecture', 'Tech Lead', 3],
            ['UX Flow & Information Architecture', 'UX Designer', 3],
            ['UI Design & Prototype', 'UI/UX Designer', 5],
            ['Database Architecture', 'Backend Developer', 3],
            ['Backend Development', 'Backend Developer', 10],
            ['Frontend Development', 'Frontend Developer', 10],
            ['Authentication & Authorization', 'Backend Developer', 4],
            ['API Development & Integration', 'Full-stack Developer', 5],
            ['Subscription & Billing Integration', 'Backend Developer', 4],
            ['Admin & Management Features', 'Full-stack Developer', 5],
            ['Automated Testing', 'Developers / QA', 4],
            ['Functional & Integration Testing', 'QA Engineer', 5],
            ['Security & Performance Testing', 'QA / Security Engineer', 3],
            ['User Acceptance Testing', 'Product Manager', 3],
            ['Bug Fixing & Stabilization', 'Development Team', 5],
            ['Production Infrastructure & Deployment', 'DevOps Engineer', 3],
            ['Production QA & Launch', 'QA / Product Manager', 2],
        ]
    ),

    t(
        'API Development',
        'Software',
        '💻',
        'Professional API development workflow covering architecture, implementation, testing and deployment.',
        [
            ['API Requirements & Scope', 'Product Manager / BA', 2],
            ['Functional Requirements', 'Business Analyst', 2],
            ['API Architecture & Design', 'Backend Tech Lead', 2],
            ['Data Model & Database Design', 'Backend Developer', 3],
            ['API Specification & Documentation', 'Backend Developer', 2],
            ['Authentication & Authorization Design', 'Backend Developer', 2],
            ['Core API Development', 'Backend Developer', 7],
            ['Database Integration', 'Backend Developer', 3],
            ['Authentication & Access Control', 'Backend Developer', 3],
            ['Third-party Integrations', 'Backend Developer', 3],
            ['Validation & Error Handling', 'Backend Developer', 2],
            ['Automated API Testing', 'QA / Backend Developer', 4],
            ['Integration & Load Testing', 'QA Engineer', 3],
            ['Security Testing', 'Security Engineer', 3],
            ['API Documentation & Developer Guide', 'Technical Writer / Developer', 2],
            ['Bug Fixing & Stabilization', 'Backend Developer', 3],
            ['Production Deployment', 'DevOps Engineer', 2],
            ['Production Verification', 'QA Engineer', 1],
        ]
    ),

    t(
        'MVP Development',
        'Software',
        '💻',
        'Lean product development workflow for building and launching a minimum viable product.',
        [
            ['Product Idea & Problem Definition', 'Founder / Product Manager', 2],
            ['User & Market Research', 'Product Researcher', 3],
            ['MVP Scope & Feature Prioritization', 'Product Manager', 2],
            ['Functional Requirements', 'Business Analyst', 2],
            ['Technical Feasibility & Architecture', 'Tech Lead', 2],
            ['User Flows & Wireframes', 'UX Designer', 3],
            ['UI Design & Prototype', 'UI/UX Designer', 4],
            ['Database Design', 'Backend Developer', 2],
            ['Backend Development', 'Backend Developer', 7],
            ['Frontend / App Development', 'Developer', 8],
            ['API Integration', 'Full-stack Developer', 3],
            ['Authentication & Core Features', 'Developer', 4],
            ['Analytics & Error Tracking Setup', 'Developer', 2],
            ['Functional Testing', 'QA Engineer', 4],
            ['User Acceptance Testing', 'Product Manager', 2],
            ['Bug Fixing & Stabilization', 'Development Team', 4],
            ['Production Deployment', 'DevOps Engineer', 2],
            ['Launch & Initial Monitoring', 'Product / Engineering Team', 2],
        ]
    ),

    // ============================================================
    // 🎨 DESIGN
    // ============================================================

    t(
        'Logo Design',
        'Design',
        '🎨',
        'Professional logo design workflow from briefing and research through final asset delivery.',
        [
            ['Design Brief & Requirements', 'Graphic Designer', 1],
            ['Brand & Audience Research', 'Brand Designer', 1],
            ['Competitor & Visual Research', 'Designer', 1],
            ['Creative Direction', 'Art Director / Designer', 1],
            ['Logo Concept Development', 'Logo Designer', 2],
            ['Initial Concepts Presentation', 'Logo Designer', 1],
            ['Client / Stakeholder Review', 'Project Manager', 1],
            ['Revisions & Refinement', 'Logo Designer', 2],
            ['Final Logo Approval', 'Client / Brand Manager', 1],
            ['Brand Asset Preparation', 'Graphic Designer', 1],
            ['Export & File Packaging', 'Graphic Designer', 1],
        ]
    ),

    t(
        'Brand Identity Design',
        'Design',
        '🎨',
        'Complete brand identity development workflow from discovery through guidelines and asset delivery.',
        [
            ['Brand Discovery & Brief', 'Brand Strategist', 2],
            ['Target Audience Research', 'Brand Strategist', 2],
            ['Competitor & Market Research', 'Brand Strategist', 2],
            ['Brand Positioning & Direction', 'Brand Strategist', 2],
            ['Moodboard & Visual Direction', 'Art Director', 2],
            ['Logo Design', 'Brand Designer', 3],
            ['Color Palette & Typography', 'Brand Designer', 2],
            ['Visual Identity System', 'Brand Designer', 3],
            ['Brand Applications', 'Graphic Designer', 3],
            ['Brand Guidelines', 'Brand Designer', 3],
            ['Internal Review', 'Creative Director', 1],
            ['Client Review & Revisions', 'Brand Designer', 3],
            ['Final Approval', 'Client / Brand Manager', 1],
            ['Final Asset Delivery', 'Brand Designer', 1],
        ]
    ),

    t(
        'UI/UX Design',
        'Design',
        '🎨',
        'End-to-end UI/UX design workflow from research and wireframes through prototype and developer handoff.',
        [
            ['Product Requirements & Design Brief', 'Product Manager', 2],
            ['User Research', 'UX Researcher', 3],
            ['Competitor & Product Analysis', 'UX Researcher', 2],
            ['User Personas & Requirements', 'UX Researcher', 2],
            ['User Flows & Information Architecture', 'UX Designer', 3],
            ['Wireframes', 'UX Designer', 3],
            ['Design System & Visual Direction', 'UI Designer', 3],
            ['High-Fidelity UI Design', 'UI Designer', 5],
            ['Interactive Prototype', 'UI/UX Designer', 2],
            ['Usability Testing', 'UX Researcher', 2],
            ['Design Review', 'Product Manager / Design Lead', 1],
            ['Revisions & Refinement', 'UI/UX Designer', 3],
            ['Developer Handoff', 'UI/UX Designer', 1],
            ['Design QA & Implementation Review', 'UI/UX Designer', 2],
        ]
    ),

    t(
        'Presentation Design',
        'Design',
        '🎨',
        'Professional presentation design workflow from story structure through final delivery.',
        [
            ['Presentation Objective & Brief', 'Project Manager', 1],
            ['Audience & Content Review', 'Content Strategist', 1],
            ['Story Structure & Slide Outline', 'Presentation Designer', 2],
            ['Content Preparation', 'Content Writer', 2],
            ['Visual Direction & Template', 'Presentation Designer', 1],
            ['Slide Design', 'Presentation Designer', 3],
            ['Charts, Diagrams & Visuals', 'Graphic Designer', 2],
            ['Internal Review', 'Creative Lead', 1],
            ['Revisions', 'Presentation Designer', 2],
            ['Final Proofreading & QA', 'Editor', 1],
            ['Final Export & Delivery', 'Presentation Designer', 1],
        ]
    ),

    t(
        'Marketing Creative Design',
        'Design',
        '🎨',
        'Campaign creative production workflow covering concept, copy, design, review and asset delivery.',
        [
            ['Campaign Brief & Objective', 'Marketing Manager', 1],
            ['Audience & Message Research', 'Marketing Strategist', 2],
            ['Creative Concept Development', 'Creative Director', 2],
            ['Copy & Messaging', 'Copywriter', 2],
            ['Visual Direction', 'Art Director', 1],
            ['Creative Design', 'Graphic Designer', 3],
            ['Motion / Video Adaptations', 'Motion Designer', 2],
            ['Internal Review', 'Creative Director', 1],
            ['Client / Stakeholder Review', 'Marketing Manager', 1],
            ['Revisions & Finalization', 'Design Team', 2],
            ['Format & Platform Adaptations', 'Graphic Designer', 2],
            ['Final QA & Asset Delivery', 'Designer / Marketing Manager', 1],
        ]
    ),

    // ============================================================
    // 📢 MARKETING
    // ============================================================

    t(
        'Product Launch',
        'Marketing',
        '📢',
        'Go-to-market workflow for preparing and executing a product launch.',
        [
            ['Launch Goals & Brief', 'Product Marketing Manager', 2],
            ['Market & Audience Research', 'Marketing Strategist', 3],
            ['Competitor Analysis', 'Marketing Strategist', 2],
            ['Positioning & Messaging', 'Product Marketing Manager', 2],
            ['Launch Strategy & Channel Plan', 'Marketing Manager', 2],
            ['Launch Content Plan', 'Content Strategist', 2],
            ['Creative & Campaign Asset Production', 'Creative Team', 5],
            ['Website / Landing Page Preparation', 'Web Developer / Designer', 4],
            ['Email & Social Campaign Setup', 'Marketing Team', 3],
            ['Sales Enablement Materials', 'Product Marketing Manager', 2],
            ['Internal Review & Approval', 'Marketing Manager', 2],
            ['Pre-launch QA & Campaign Testing', 'Marketing Ops / QA', 2],
            ['Launch Execution', 'Marketing Team', 1],
            ['Launch Monitoring', 'Marketing Analyst', 3],
            ['Performance Analysis & Optimization', 'Marketing Manager', 2],
            ['Launch Report', 'Marketing Analyst', 2],
        ]
    ),

    t(
        'SEO Campaign',
        'Marketing',
        '📢',
        'SEO campaign workflow covering technical audit, keyword strategy, content, optimization and reporting.',
        [
            ['SEO Goals & Website Audit', 'SEO Specialist', 2],
            ['Technical SEO Audit', 'Technical SEO Specialist', 3],
            ['Keyword Research', 'SEO Specialist', 3],
            ['Search Intent & Topic Mapping', 'SEO Strategist', 2],
            ['Competitor SEO Analysis', 'SEO Specialist', 2],
            ['Content Strategy & Editorial Plan', 'Content Strategist', 3],
            ['On-page SEO Optimization', 'SEO Specialist', 4],
            ['Content Creation', 'Content Writer', 7],
            ['Technical SEO Implementation', 'Developer', 5],
            ['Internal Linking & Site Structure', 'SEO Specialist', 3],
            ['Link Building / Digital PR', 'SEO Specialist', 10],
            ['SEO QA & Validation', 'SEO Specialist', 2],
            ['Search Performance Monitoring', 'SEO Analyst', 7],
            ['Performance Analysis', 'SEO Analyst', 2],
            ['Optimization & Next-cycle Plan', 'SEO Strategist', 2],
        ]
    ),

    t(
        'Email Campaign',
        'Marketing',
        '📢',
        'Email campaign workflow from audience segmentation and copywriting through sending and optimization.',
        [
            ['Campaign Goal & Audience Definition', 'Email Marketing Manager', 1],
            ['Audience Segmentation', 'CRM / Marketing Specialist', 2],
            ['Campaign Strategy & Offer', 'Marketing Manager', 2],
            ['Email Sequence Planning', 'Email Marketing Manager', 2],
            ['Email Copywriting', 'Copywriter', 3],
            ['Email Design', 'Email Designer', 2],
            ['Personalization & Dynamic Content', 'CRM Specialist', 2],
            ['Email Setup & Automation', 'Marketing Automation Specialist', 2],
            ['Links, Tracking & Analytics Setup', 'Marketing Ops Specialist', 1],
            ['Test Email & QA', 'QA / Marketing Ops', 1],
            ['Internal Review & Approval', 'Marketing Manager', 1],
            ['Schedule & Send', 'Email Marketing Manager', 1],
            ['Performance Monitoring', 'Marketing Analyst', 3],
            ['Results Analysis', 'Marketing Analyst', 2],
            ['Optimization & Follow-up', 'Email Marketing Manager', 2],
        ]
    ),

    t(
        'Influencer Campaign',
        'Marketing',
        '📢',
        'Influencer campaign workflow covering creator selection, outreach, content approval and measurement.',
        [
            ['Campaign Objective & Brief', 'Influencer Marketing Manager', 1],
            ['Target Audience Definition', 'Marketing Strategist', 1],
            ['Influencer Research & Shortlisting', 'Influencer Manager', 3],
            ['Audience & Engagement Verification', 'Influencer Manager', 2],
            ['Influencer Outreach', 'Influencer Manager', 3],
            ['Negotiation & Collaboration Terms', 'Influencer Manager', 3],
            ['Contracts & Compliance Review', 'Legal / Marketing Manager', 2],
            ['Campaign Brief & Content Guidelines', 'Marketing Manager', 2],
            ['Content Creation', 'Influencer / Creator', 4],
            ['Content Review & Approval', 'Brand Manager', 2],
            ['Revisions & Finalization', 'Influencer / Creator', 2],
            ['Campaign Publishing', 'Influencer / Marketing Team', 1],
            ['Engagement & Campaign Monitoring', 'Social Media Manager', 5],
            ['Performance & Attribution Analysis', 'Marketing Analyst', 3],
            ['Campaign Report & Learnings', 'Marketing Manager', 2],
        ]
    ),

    // ============================================================
    // 🛒 E-COMMERCE
    // ============================================================

    t(
        'Product Listing',
        'E-commerce',
        '🛒',
        'Workflow for creating, reviewing and publishing a complete e-commerce product listing.',
        [
            ['Product Information Collection', 'E-commerce Manager', 1],
            ['Product Research & Positioning', 'Product Marketer', 1],
            ['Product Title & Description', 'Copywriter', 1],
            ['Product Specifications & Attributes', 'Product Specialist', 1],
            ['Product Images & Asset Collection', 'Product Photographer / Designer', 2],
            ['Pricing & Offer Information', 'E-commerce Manager', 1],
            ['SEO & Search Keyword Optimization', 'E-commerce SEO Specialist', 1],
            ['Listing Creation', 'E-commerce Specialist', 1],
            ['Listing Review & Quality Check', 'E-commerce Manager', 1],
            ['Marketplace / Store Upload', 'E-commerce Specialist', 1],
            ['Final Verification', 'E-commerce Manager', 1],
        ]
    ),

    t(
        'E-commerce Store Launch',
        'E-commerce',
        '🛒',
        'End-to-end workflow for preparing, testing and launching an online store.',
        [
            ['Business & Store Requirements', 'E-commerce Manager', 2],
            ['Product Catalog Planning', 'E-commerce Manager', 2],
            ['Store Structure & Navigation', 'UX Designer', 2],
            ['Store Branding & Visual Direction', 'Brand Designer', 2],
            ['Store UI/UX Design', 'UI/UX Designer', 4],
            ['Store Development & Configuration', 'E-commerce Developer', 7],
            ['Product Catalog Setup', 'E-commerce Specialist', 4],
            ['Payment Gateway Setup', 'Developer / Payment Specialist', 2],
            ['Shipping & Tax Configuration', 'E-commerce Manager', 2],
            ['Order & Inventory Configuration', 'E-commerce Specialist', 3],
            ['Analytics & Tracking Setup', 'Marketing / Analytics Specialist', 2],
            ['SEO & Store Optimization', 'SEO Specialist', 2],
            ['Functional & Checkout Testing', 'QA Engineer', 3],
            ['Mobile & Cross-browser Testing', 'QA Engineer', 2],
            ['Bug Fixes & Final Revisions', 'Development Team', 3],
            ['UAT & Store Approval', 'E-commerce Manager', 2],
            ['Production Deployment', 'Developer / DevOps', 1],
            ['Final QA & Launch', 'QA / E-commerce Manager', 1],
        ]
    ),

    t(
        'Product Photography',
        'E-commerce',
        '🛒',
        'Commercial product photography workflow from shot planning through retouched asset delivery.',
        [
            ['Photography Brief & Requirements', 'E-commerce Manager', 1],
            ['Product & Shot List Planning', 'Photographer', 1],
            ['Creative Direction & References', 'Art Director / Photographer', 1],
            ['Product Preparation', 'Production Assistant', 1],
            ['Studio / Location Setup', 'Photographer', 1],
            ['Product Photoshoot', 'Product Photographer', 2],
            ['Image Selection & Culling', 'Photographer', 1],
            ['Photo Retouching', 'Photo Retoucher', 2],
            ['Color Correction & Background Cleanup', 'Photo Editor', 1],
            ['Image Quality Review', 'E-commerce Manager', 1],
            ['Final Export & Asset Delivery', 'Photo Editor', 1],
        ]
    ),

    // ============================================================
    // 🏢 BUSINESS
    // ============================================================

    t(
        'Business Plan',
        'Business',
        '🏢',
        'Structured business planning workflow covering market, operations, strategy and financial projections.',
        [
            ['Business Idea & Objectives', 'Founder / Business Owner', 2],
            ['Market & Industry Research', 'Business Analyst', 3],
            ['Target Customer Definition', 'Business Strategist', 2],
            ['Problem & Value Proposition', 'Business Strategist', 2],
            ['Product / Service Definition', 'Product Manager', 2],
            ['Business Model', 'Business Strategist', 2],
            ['Competitor Analysis', 'Business Analyst', 2],
            ['Marketing & Sales Strategy', 'Marketing Strategist', 3],
            ['Operations Plan', 'Operations Manager', 2],
            ['Team & Organization Plan', 'Founder / HR Manager', 2],
            ['Financial Projections', 'Financial Analyst', 3],
            ['Risk Assessment', 'Business Analyst', 2],
            ['Business Plan Draft', 'Business Consultant / Strategist', 3],
            ['Review & Revisions', 'Founder / Business Owner', 2],
            ['Final Business Plan', 'Business Strategist', 1],
        ]
    ),

    t(
        'Market Research',
        'Business',
        '🏢',
        'Professional market research workflow from research objectives through findings and recommendations.',
        [
            ['Research Objective & Scope', 'Research Manager', 1],
            ['Market Definition', 'Market Research Analyst', 2],
            ['Industry Research', 'Research Analyst', 3],
            ['Target Customer Definition', 'Market Research Analyst', 2],
            ['Customer Research Plan', 'Research Manager', 2],
            ['Primary Data Collection', 'Research Team', 5],
            ['Secondary Research', 'Research Analyst', 4],
            ['Market Size & Opportunity Analysis', 'Business Analyst', 3],
            ['Customer Needs & Behavior Analysis', 'Research Analyst', 3],
            ['Market Trends Analysis', 'Research Analyst', 2],
            ['Data Analysis & Findings', 'Data / Research Analyst', 3],
            ['Insights & Recommendations', 'Research Manager', 2],
            ['Research Report Preparation', 'Research Analyst', 3],
            ['Review & Finalization', 'Research Manager', 2],
        ]
    ),

    t(
        'Competitive Analysis',
        'Business',
        '🏢',
        'Structured competitive analysis workflow covering competitors, positioning, market gaps and recommendations.',
        [
            ['Analysis Objective & Scope', 'Business Strategist', 1],
            ['Competitor Identification', 'Business Analyst', 2],
            ['Competitor Data Collection', 'Research Analyst', 3],
            ['Product / Service Comparison', 'Business Analyst', 2],
            ['Pricing & Business Model Analysis', 'Business Analyst', 2],
            ['Marketing & Positioning Analysis', 'Marketing Strategist', 2],
            ['Customer Review & Feedback Analysis', 'Research Analyst', 2],
            ['Competitor Strengths & Weaknesses', 'Business Strategist', 2],
            ['SWOT / Competitive Positioning', 'Business Strategist', 2],
            ['Market Gaps & Opportunities', 'Business Analyst', 2],
            ['Competitive Benchmarking', 'Business Analyst', 2],
            ['Findings & Recommendations', 'Business Strategist', 2],
            ['Competitive Analysis Report', 'Business Analyst', 2],
            ['Review & Finalization', 'Business Strategist', 1],
        ]
    ),

    // ============================================================
    // 👥 HR
    // ============================================================

    t(
        'Recruitment & Hiring',
        'HR',
        '👥',
        'End-to-end recruitment workflow from role definition and sourcing through offer and closure.',
        [
            ['Hiring Requirement & Role Definition', 'Hiring Manager', 2],
            ['Job Description Preparation', 'HR / Recruiter', 1],
            ['Compensation & Approval', 'HR / Hiring Manager', 2],
            ['Job Posting & Sourcing Strategy', 'Recruiter', 2],
            ['Candidate Sourcing', 'Recruiter', 5],
            ['Resume Screening', 'Recruiter', 3],
            ['Initial HR Screening', 'Recruiter', 2],
            ['Technical / Functional Interview', 'Interview Panel', 3],
            ['Final Interview', 'Hiring Manager', 2],
            ['Candidate Evaluation', 'Hiring Team', 1],
            ['Reference / Background Check', 'HR', 3],
            ['Offer Preparation & Approval', 'HR / Hiring Manager', 2],
            ['Offer Release & Negotiation', 'Recruiter', 2],
            ['Offer Acceptance & Joining Coordination', 'HR', 2],
            ['Recruitment Closure & Documentation', 'HR', 1],
        ]
    ),

    t(
        'Employee Onboarding',
        'HR',
        '👥',
        'Structured employee onboarding workflow covering documentation, access, orientation and follow-up.',
        [
            ['Pre-boarding Requirements', 'HR', 2],
            ['Employee Documentation', 'HR', 2],
            ['Account & System Access Setup', 'IT / Admin', 2],
            ['Equipment & Workspace Preparation', 'IT / Admin', 2],
            ['Welcome & Orientation Planning', 'HR', 1],
            ['Company Orientation', 'HR', 1],
            ['Policies & Compliance Training', 'HR', 1],
            ['Team Introduction', 'Hiring Manager', 1],
            ['Role & Responsibilities Overview', 'Hiring Manager', 1],
            ['Tools & Process Training', 'Team Lead', 2],
            ['Initial Goals & Expectations', 'Hiring Manager', 1],
            ['Buddy / Mentor Assignment', 'Hiring Manager', 1],
            ['First-week Check-in', 'Hiring Manager', 1],
            ['30-day Review & Feedback', 'Hiring Manager', 1],
            ['Onboarding Completion', 'HR', 1],
        ]
    ),

    t(
        'Employee Training',
        'HR',
        '👥',
        'Employee training workflow from identifying learning needs through delivery, evaluation and development planning.',
        [
            ['Training Need Identification', 'HR / Manager', 2],
            ['Learning Objectives Definition', 'Training Manager', 1],
            ['Training Audience & Skill Assessment', 'HR / Trainer', 2],
            ['Training Program Design', 'Instructional Designer', 3],
            ['Training Materials Preparation', 'Trainer / Instructional Designer', 4],
            ['Trainer Review & Validation', 'Training Manager', 2],
            ['Training Schedule & Logistics', 'HR / Training Coordinator', 2],
            ['Employee Enrollment & Communication', 'HR', 1],
            ['Training Delivery', 'Trainer', 3],
            ['Practical Exercises / Assignments', 'Trainer', 2],
            ['Knowledge Assessment', 'Trainer', 1],
            ['Feedback Collection', 'Training Coordinator', 1],
            ['Performance / Skill Evaluation', 'Manager / Trainer', 2],
            ['Training Report & Completion Records', 'HR', 1],
            ['Follow-up & Development Plan', 'Manager / HR', 2],
        ]
    ),

    // ============================================================
    // 💰 FINANCE
    // ============================================================

    t(
        'Bookkeeping',
        'Finance',
        '💰',
        'Monthly bookkeeping workflow covering transaction processing, reconciliation and financial reporting.',
        [
            ['Accounting Period & Records Setup', 'Accountant', 1],
            ['Financial Document Collection', 'Bookkeeper', 2],
            ['Bank & Transaction Import', 'Bookkeeper', 1],
            ['Transaction Categorization', 'Bookkeeper', 3],
            ['Accounts Payable & Receivable Review', 'Accountant', 2],
            ['Bank Reconciliation', 'Accountant', 2],
            ['Expense & Receipt Verification', 'Bookkeeper', 2],
            ['Journal Entries & Adjustments', 'Accountant', 2],
            ['General Ledger Review', 'Accountant', 2],
            ['Trial Balance Preparation', 'Accountant', 1],
            ['Error & Variance Review', 'Accountant', 2],
            ['Financial Records Finalization', 'Accountant', 1],
            ['Monthly Financial Reports', 'Accountant', 2],
            ['Management Review', 'Finance Manager', 1],
        ]
    ),

    t(
        'Payroll Processing',
        'Finance',
        '💰',
        'Payroll processing workflow covering employee data, calculations, approval, disbursement and statutory records.',
        [
            ['Payroll Period Setup', 'Payroll Specialist', 1],
            ['Employee Data & Payroll Changes Collection', 'HR / Payroll Specialist', 2],
            ['Attendance & Leave Data Verification', 'HR / Payroll Specialist', 2],
            ['Salary & Compensation Data Review', 'Payroll Specialist', 2],
            ['Variable Pay & Deduction Calculation', 'Payroll Specialist', 2],
            ['Tax & Statutory Calculation', 'Payroll Specialist', 2],
            ['Payroll Calculation', 'Payroll Specialist', 2],
            ['Payroll Reconciliation & Validation', 'Finance Manager', 2],
            ['Payroll Approval', 'Finance / HR Manager', 1],
            ['Salary Disbursement Preparation', 'Payroll Specialist', 1],
            ['Payroll Processing', 'Finance / Payroll Team', 1],
            ['Payslip Generation & Distribution', 'Payroll Specialist', 1],
            ['Payroll Accounting Entries', 'Accountant', 1],
            ['Statutory Filings & Records', 'Payroll / Compliance Specialist', 2],
            ['Payroll Reconciliation & Closure', 'Finance Manager', 1],
        ]
    ),

    t(
        'Budget Planning',
        'Finance',
        '💰',
        'Annual or periodic budgeting workflow from objectives and forecasts through approval and allocation.',
        [
            ['Budget Objectives & Guidelines', 'Finance Manager', 2],
            ['Historical Financial Data Collection', 'Financial Analyst', 2],
            ['Revenue Forecast', 'Financial Analyst', 3],
            ['Department Budget Requests', 'Department Managers', 4],
            ['Operating Expense Planning', 'Finance Team', 3],
            ['Headcount & Compensation Planning', 'HR / Finance', 2],
            ['Capital Expenditure Planning', 'Finance / Operations', 2],
            ['Budget Consolidation', 'Financial Analyst', 3],
            ['Variance & Scenario Analysis', 'Financial Analyst', 2],
            ['Management Review', 'Finance Manager', 2],
            ['Budget Revisions', 'Finance Team', 2],
            ['Final Budget Approval', 'Leadership / Finance', 1],
            ['Budget Allocation', 'Finance Manager', 2],
            ['Budget Documentation & Distribution', 'Finance Team', 1],
        ]
    ),

    // ============================================================
    // ⚖️ LEGAL
    // ============================================================

    t(
        'NDA',
        'Legal',
        '⚖️',
        'Non-disclosure agreement workflow from intake and drafting through negotiation, signature and storage.',
        [
            ['NDA Requirement & Purpose', 'Business Owner / Requester', 1],
            ['Parties & Confidential Information Details', 'Business / Legal Team', 1],
            ['NDA Type & Terms Definition', 'Legal Counsel', 1],
            ['Initial NDA Draft', 'Legal Counsel', 2],
            ['Internal Legal Review', 'Senior Legal Counsel', 1],
            ['Business Review', 'Business Owner / Manager', 1],
            ['Counterparty Review', 'Counterparty / Legal Team', 2],
            ['Negotiation & Revisions', 'Legal Counsel', 2],
            ['Final Legal Approval', 'Legal Counsel', 1],
            ['Signature Coordination', 'Legal / Operations', 1],
            ['Executed Agreement Collection', 'Legal Operations', 1],
            ['Document Storage & Record Update', 'Legal Operations', 1],
        ]
    ),

    t(
        'Contract Review',
        'Legal',
        '⚖️',
        'Contract review workflow covering legal, commercial, compliance and negotiation activities.',
        [
            ['Contract Intake & Review Request', 'Legal Operations', 1],
            ['Contract & Supporting Documents Collection', 'Legal Operations', 1],
            ['Business Context & Requirements Review', 'Business Owner', 1],
            ['Key Terms & Obligations Review', 'Legal Counsel', 2],
            ['Risk & Liability Assessment', 'Legal Counsel', 2],
            ['Commercial Terms Review', 'Commercial / Finance Team', 2],
            ['Compliance & Regulatory Review', 'Legal / Compliance', 2],
            ['Key Issues & Red Flags Identification', 'Legal Counsel', 1],
            ['Proposed Changes / Redlines', 'Legal Counsel', 2],
            ['Internal Stakeholder Review', 'Business / Legal Team', 1],
            ['Counterparty Negotiation', 'Legal Counsel', 3],
            ['Final Contract Review', 'Senior Legal Counsel', 1],
            ['Approval & Signature', 'Authorized Signatory', 1],
            ['Executed Contract Storage', 'Legal Operations', 1],
        ]
    ),

    t(
        'Legal Documentation',
        'Legal',
        '⚖️',
        'Workflow for preparing formal legal documentation from requirements and research through execution and storage.',
        [
            ['Documentation Request & Objective', 'Business Owner / Requester', 1],
            ['Requirements & Scope Definition', 'Legal Counsel', 1],
            ['Applicable Law & Reference Research', 'Legal Researcher', 2],
            ['Existing Documents & Precedents Review', 'Legal Counsel', 2],
            ['Document Structure & Key Terms', 'Legal Counsel', 1],
            ['Initial Drafting', 'Legal Counsel', 3],
            ['Legal Review & Compliance Check', 'Senior Legal Counsel', 2],
            ['Business / Stakeholder Review', 'Business Owner', 2],
            ['Revisions & Finalization', 'Legal Counsel', 2],
            ['Final Approval', 'Legal / Management', 1],
            ['Formatting & Execution Preparation', 'Legal Operations', 1],
            ['Signature / Publication', 'Legal Operations', 1],
            ['Document Storage & Version Control', 'Legal Operations', 1],
        ]
    ),

    // ============================================================
    // 🏠 OPERATIONS
    // ============================================================

    t(
        'Event Planning',
        'Operations',
        '🏠',
        'Event planning workflow from objectives and budget through execution and post-event reporting.',
        [
            ['Event Objectives & Requirements', 'Event Manager', 2],
            ['Budget & Approval', 'Event Manager / Finance', 2],
            ['Venue Research & Selection', 'Event Coordinator', 3],
            ['Event Format & Program Planning', 'Event Manager', 3],
            ['Vendor Research & Selection', 'Procurement / Event Manager', 3],
            ['Guest / Attendee Planning', 'Event Coordinator', 2],
            ['Event Branding & Creative Assets', 'Creative Team', 3],
            ['Invitations & Registration Setup', 'Event Coordinator', 2],
            ['Catering & Logistics Planning', 'Operations Coordinator', 3],
            ['Equipment & Technical Setup Planning', 'Technical Coordinator', 2],
            ['Vendor Confirmation & Coordination', 'Event Manager', 2],
            ['Event Schedule & Run-of-Show', 'Event Manager', 2],
            ['Final Venue & Logistics Check', 'Operations Team', 1],
            ['Event Execution', 'Event Team', 1],
            ['Post-event Cleanup & Vendor Closure', 'Operations Team', 1],
            ['Feedback & Event Report', 'Event Manager', 2],
        ]
    ),

    t(
        'Office Setup',
        'Operations',
        '🏠',
        'Office setup workflow covering space planning, vendors, infrastructure, IT and final handover.',
        [
            ['Office Requirements & Capacity Planning', 'Operations Manager', 2],
            ['Location / Workspace Evaluation', 'Operations Manager', 3],
            ['Budget & Approval', 'Finance / Management', 2],
            ['Office Layout & Space Planning', 'Workplace Designer', 3],
            ['Furniture & Equipment Planning', 'Operations Manager', 2],
            ['Vendor Research & Quotations', 'Procurement Specialist', 3],
            ['Vendor Selection & Purchase Approval', 'Operations Manager', 2],
            ['Internet & Network Planning', 'IT Administrator', 2],
            ['Electrical & Infrastructure Setup', 'Facilities Vendor', 4],
            ['Furniture & Equipment Installation', 'Facilities Team', 4],
            ['IT Hardware & Network Setup', 'IT Administrator', 3],
            ['Access Control & Security Setup', 'IT / Facilities', 2],
            ['Office Supplies & Inventory Setup', 'Operations Coordinator', 2],
            ['Safety & Compliance Check', 'Facilities Manager', 1],
            ['Final Inspection & Handover', 'Operations Manager', 1],
        ]
    ),

    t(
        'Procurement',
        'Operations',
        '🏠',
        'Procurement workflow from purchase requirement through vendor selection, delivery, payment and closure.',
        [
            ['Purchase Requirement Identification', 'Requesting Manager', 1],
            ['Requirements & Specifications', 'Requesting Team', 2],
            ['Budget Availability Check', 'Finance Team', 1],
            ['Purchase Request Approval', 'Department Manager', 1],
            ['Supplier / Vendor Research', 'Procurement Specialist', 3],
            ['Request for Quotation', 'Procurement Specialist', 2],
            ['Vendor Quotations Collection', 'Procurement Specialist', 3],
            ['Commercial & Technical Evaluation', 'Procurement Team', 2],
            ['Vendor Comparison & Negotiation', 'Procurement Specialist', 2],
            ['Vendor Selection Approval', 'Procurement Manager', 1],
            ['Purchase Order Preparation', 'Procurement Specialist', 1],
            ['Purchase Order Approval', 'Authorized Manager', 1],
            ['Purchase Order Release', 'Procurement Specialist', 1],
            ['Delivery / Service Coordination', 'Procurement Specialist', 3],
            ['Goods / Service Inspection', 'Requesting Team', 2],
            ['Invoice Verification', 'Finance / Accounts Payable', 2],
            ['Payment Processing', 'Finance Team', 2],
            ['Procurement Closure & Record Update', 'Procurement Specialist', 1],
        ]
    ),

    // ============================================================
    // 📸 PHOTOGRAPHY
    // ============================================================

    t(
        'Real Estate Photography',
        'Photography',
        '📸',
        'Real estate photography workflow from property preparation and shooting through editing and delivery.',
        [
            ['Property Details & Photography Brief', 'Real Estate Agent / Photographer', 1],
            ['Property & Shot List Planning', 'Real Estate Photographer', 1],
            ['Client / Agent Coordination', 'Photographer / Coordinator', 1],
            ['Property Preparation Check', 'Property Manager / Agent', 1],
            ['Equipment & Lighting Preparation', 'Photographer', 1],
            ['Interior Photography', 'Real Estate Photographer', 1],
            ['Exterior & Property Photography', 'Real Estate Photographer', 1],
            ['Image Selection & Culling', 'Photographer', 1],
            ['Exposure & Color Correction', 'Photo Editor', 1],
            ['Perspective & Image Retouching', 'Photo Editor', 1],
            ['Agent / Client Review', 'Real Estate Agent', 1],
            ['Final Corrections', 'Photo Editor', 1],
            ['Final Export & Delivery', 'Photographer / Editor', 1],
        ]
    ),

    // ============================================================
    // 🎓 EDUCATION
    // ============================================================

    t(
        'Course Creation',
        'Education',
        '🎓',
        'Course development workflow from learning objectives and curriculum through production and LMS setup.',
        [
            ['Course Goal & Audience Definition', 'Course Manager / Instructor', 2],
            ['Learning Objectives Definition', 'Instructional Designer', 2],
            ['Curriculum & Module Planning', 'Instructional Designer', 3],
            ['Subject Research & Content Planning', 'Subject Matter Expert', 3],
            ['Lesson Outline Development', 'Instructional Designer', 3],
            ['Learning Materials Preparation', 'Content Developer', 5],
            ['Lesson Script & Presentation Creation', 'Content Developer', 4],
            ['Video / Lecture Production', 'Instructor / Video Producer', 5],
            ['Worksheets, Quizzes & Assessments', 'Instructional Designer', 3],
            ['Content & Subject Review', 'Subject Matter Expert', 2],
            ['Editing & Quality Review', 'Editor / QA', 2],
            ['Course Platform Setup', 'LMS Administrator', 2],
            ['Course Content Upload & Organization', 'LMS Administrator', 2],
            ['Learner Experience Testing', 'QA / Instructional Designer', 2],
            ['Final Approval & Course Handover', 'Course Manager', 1],
        ]
    ),

    t(
        'Online Course Launch',
        'Education',
        '🎓',
        'Launch workflow for an online course covering offer setup, marketing, enrollment testing and reporting.',
        [
            ['Launch Goals & Audience Definition', 'Course Manager', 2],
            ['Course Positioning & Offer', 'Marketing Strategist', 2],
            ['Pricing & Enrollment Strategy', 'Course Manager / Finance', 2],
            ['Course Landing Page', 'Web Designer / Developer', 4],
            ['Sales Copy & Course Description', 'Copywriter', 2],
            ['Promotional Content Plan', 'Content Strategist', 2],
            ['Marketing Creative Production', 'Designer / Video Editor', 4],
            ['Email Campaign Setup', 'Email Marketing Specialist', 3],
            ['Social Media Campaign Setup', 'Social Media Manager', 3],
            ['Payment & Enrollment Configuration', 'Developer / LMS Admin', 2],
            ['Analytics & Tracking Setup', 'Marketing Analyst', 2],
            ['End-to-end Enrollment Testing', 'QA / LMS Admin', 2],
            ['Launch Review & Approval', 'Course Manager', 1],
            ['Course Launch', 'Marketing / Course Team', 1],
            ['Enrollment & Campaign Monitoring', 'Marketing Analyst', 5],
            ['Performance Analysis & Optimization', 'Marketing Manager', 2],
            ['Launch Report & Next Steps', 'Course Manager', 2],
        ]
    ),

    // ============================================================
    // 🎮 GAMING
    // ============================================================

    t(
        'Game Development',
        'Gaming',
        '🎮',
        'Game development workflow covering design, programming, assets, testing, release and post-launch monitoring.',
        [
            ['Game Concept & Vision', 'Game Designer', 2],
            ['Target Platform & Audience Definition', 'Game Producer', 1],
            ['Game Design Document', 'Game Designer', 4],
            ['Gameplay Mechanics Design', 'Game Designer', 3],
            ['Technical Architecture & Project Setup', 'Lead Programmer', 3],
            ['Art Style & Visual Direction', 'Art Director', 3],
            ['3D / 2D Asset Production', 'Game Artist', 7],
            ['Level / World Design', 'Level Designer', 5],
            ['Core Gameplay Programming', 'Gameplay Programmer', 10],
            ['UI & UX Implementation', 'UI Designer / Programmer', 4],
            ['Audio & Sound Effects', 'Audio Designer', 4],
            ['Gameplay Integration', 'Game Programmer', 5],
            ['Internal Playtesting', 'QA / Game Tester', 4],
            ['Bug Fixing & Gameplay Refinement', 'Development Team', 5],
            ['Performance Optimization', 'Game Programmer', 4],
            ['Final QA & Compatibility Testing', 'QA Engineer', 4],
            ['Release Build Preparation', 'Release Engineer', 2],
            ['Store / Platform Submission', 'Producer / Release Manager', 2],
            ['Final Verification & Launch', 'Producer / QA', 1],
            ['Post-launch Monitoring & Bug Fixes', 'Development Team', 5],
        ]
    ),

    // ============================================================
    // 🔐 IT / SECURITY
    // ============================================================

    t(
        'Security Audit',
        'IT / Security',
        '🔐',
        'Security audit workflow covering assets, access, infrastructure, applications, compliance and remediation planning.',
        [
            ['Audit Scope & Objectives', 'Security Manager', 1],
            ['Asset & System Inventory', 'Security Analyst', 2],
            ['Security Requirements & Policy Review', 'Security Analyst', 2],
            ['Access Control Review', 'Security Analyst', 2],
            ['Infrastructure & Configuration Review', 'Security Engineer', 3],
            ['Application Security Review', 'Application Security Engineer', 3],
            ['Network Security Review', 'Network Security Engineer', 2],
            ['Logging & Monitoring Review', 'Security Engineer', 2],
            ['Vulnerability Assessment', 'Security Analyst', 3],
            ['Compliance & Control Assessment', 'Compliance Analyst', 3],
            ['Findings & Risk Classification', 'Security Manager', 2],
            ['Remediation Recommendations', 'Security Engineer', 2],
            ['Management Review', 'Security Manager', 1],
            ['Final Security Audit Report', 'Security Analyst', 2],
            ['Remediation Tracking Plan', 'Security Manager', 2],
        ]
    ),

    t(
        'Penetration Testing',
        'IT / Security',
        '🔐',
        'Authorized penetration testing workflow from scope and preparation through reporting and remediation verification.',
        [
            ['Scope & Rules of Engagement', 'Security Manager', 2],
            ['Authorization & Testing Approval', 'Client / Security Manager', 1],
            ['Target & Environment Preparation', 'Security Engineer', 2],
            ['Reconnaissance & Information Gathering', 'Penetration Tester', 2],
            ['Attack Surface Identification', 'Penetration Tester', 2],
            ['Vulnerability Discovery', 'Security Tester', 3],
            ['Controlled Security Testing', 'Penetration Tester', 4],
            ['Exploitation Validation', 'Senior Penetration Tester', 3],
            ['Privilege / Access Impact Assessment', 'Penetration Tester', 2],
            ['Evidence Collection & Finding Documentation', 'Security Analyst', 2],
            ['Risk Rating & Impact Assessment', 'Security Consultant', 2],
            ['Remediation Recommendations', 'Security Consultant', 2],
            ['Technical Report Preparation', 'Security Consultant', 3],
            ['Executive Summary & Management Review', 'Security Manager', 2],
            ['Client / Stakeholder Debrief', 'Security Consultant', 1],
            ['Remediation Verification / Retest', 'Penetration Tester', 3],
            ['Final Report & Closure', 'Security Manager', 1],
        ]
    ),

    // ============================================================
    // 🚀 STARTUP
    // ============================================================

    t(
        'MVP Launch',
        'Startup',
        '🚀',
        'Workflow for launching a completed MVP, monitoring adoption and planning post-launch improvements.',
        [
            ['Launch Objective & Success Metrics', 'Founder / Product Manager', 2],
            ['Target User & Launch Audience', 'Product Manager', 2],
            ['MVP Product Readiness Review', 'Product Manager / Tech Lead', 2],
            ['User Acceptance Testing', 'Product / QA Team', 3],
            ['Critical Bug Fixes & Stabilization', 'Development Team', 4],
            ['Analytics & Tracking Setup', 'Product Analyst / Developer', 2],
            ['Landing Page & Product Messaging', 'Marketing / Copywriter', 3],
            ['Launch Content & Creative Assets', 'Marketing / Design Team', 3],
            ['Pricing & Signup / Purchase Flow', 'Product / Growth Team', 2],
            ['Support & Feedback Process Setup', 'Customer Success / Founder', 2],
            ['Launch Channel Preparation', 'Growth / Marketing Manager', 2],
            ['Final Launch Checklist', 'Product Manager', 1],
            ['MVP Launch', 'Founder / Product Team', 1],
            ['User Feedback Collection', 'Product / Customer Success', 5],
            ['Usage & Performance Monitoring', 'Product Analyst', 5],
            ['Launch Results Analysis', 'Product Manager', 2],
            ['Post-launch Improvements Plan', 'Founder / Product Manager', 2],
        ]
    ),

    t(
        'Pitch Deck',
        'Startup',
        '🚀',
        'Professional investor pitch deck preparation workflow from fundraising objectives through final materials.',
        [
            ['Fundraising Objective & Requirements', 'Founder', 1],
            ['Investor & Audience Definition', 'Founder / Fundraising Advisor', 1],
            ['Company & Product Information Collection', 'Founder / Operations', 2],
            ['Market & Industry Research', 'Market Research Analyst', 3],
            ['Problem & Solution Definition', 'Founder / Product Manager', 2],
            ['Business Model & Revenue Analysis', 'Founder / Finance', 2],
            ['Traction & Key Metrics Preparation', 'Founder / Data Analyst', 2],
            ['Competitive Landscape', 'Business Analyst', 2],
            ['Go-to-Market Strategy', 'Growth / Marketing Lead', 2],
            ['Financial Projections', 'Financial Analyst', 3],
            ['Fundraising Ask & Use of Funds', 'Founder / Finance', 2],
            ['Pitch Deck Storyline & Structure', 'Founder / Advisor', 2],
            ['Slide Content & Copywriting', 'Founder / Copywriter', 3],
            ['Pitch Deck Design', 'Presentation Designer', 3],
            ['Founder / Leadership Review', 'Founder / Leadership Team', 1],
            ['Revisions & Finalization', 'Founder / Designer', 2],
            ['Final Pitch Deck & Supporting Materials', 'Founder', 1],
        ]
    ),

    t(
        'Fundraising Preparation',
        'Startup',
        '🚀',
        'Startup fundraising readiness workflow covering financials, legal documents, investor targeting and meeting preparation.',
        [
            ['Fundraising Goals & Capital Requirement', 'Founder', 2],
            ['Funding Stage & Investor Profile Definition', 'Founder / Advisor', 2],
            ['Company Metrics & Traction Review', 'Founder / Finance', 3],
            ['Financial Model & Projections', 'Financial Analyst', 4],
            ['Business Model Review', 'Founder / Strategy Lead', 2],
            ['Market Size & Opportunity Analysis', 'Market Research Analyst', 3],
            ['Competitive Analysis', 'Business Strategist', 2],
            ['Cap Table & Ownership Review', 'Founder / Finance / Legal', 2],
            ['Legal & Corporate Documents Review', 'Legal Counsel', 3],
            ['Investor Materials Preparation', 'Founder / Fundraising Advisor', 3],
            ['Pitch Deck Finalization', 'Founder / Designer', 2],
            ['Financial & Business Data Room Setup', 'Finance / Operations', 3],
            ['Investor Target List', 'Founder / Fundraising Team', 3],
            ['Investor Outreach Strategy', 'Founder / Fundraising Advisor', 2],
            ['Pitch & Investor Meeting Preparation', 'Founder', 2],
            ['Fundraising Readiness Review', 'Founder / Advisors', 1],
        ]
    ),
];

/**
 * ============================================================
 * VALIDATION
 * =========    ===================================================
 */

const EXPECTED_TEMPLATE_COUNT = 60;

const EXPECTED_CATEGORY_COUNTS = {
    'Video & Production': 5,
    'Social Media': 4,
    'Content': 5,
    'Web': 4,
    'App Development': 3,
    'Software': 3,
    'Design': 5,
    'Marketing': 4,
    'E-commerce': 3,
    'Business': 3,
    'HR': 3,
    'Finance': 3,
    'Legal': 3,
    'Operations': 3,
    'Photography': 1,
    'Education': 2,
    'Gaming': 1,
    'IT / Security': 2,
    'Startup': 3,
};

function validateTemplates() {
    console.log('🔍 Validating work template library...');

    if (templates.length !== EXPECTED_TEMPLATE_COUNT) {
        throw new Error(
            `Expected ${EXPECTED_TEMPLATE_COUNT} templates, found ${templates.length}.`
        );
    }

    const names = new Set();
    const categoryCounts = {};

    for (const template of templates) {
        if (names.has(template.name)) {
            throw new Error(
                `Duplicate template name found: "${template.name}"`
            );
        }

        names.add(template.name);

        if (
            !template.name ||
            !template.category ||
            !template.icon ||
            !template.description
        ) {
            throw new Error(
                `Invalid template metadata: "${template.name}"`
            );
        }

        if (
            !Array.isArray(template.steps) ||
            template.steps.length === 0
        ) {
            throw new Error(
                `Template has no steps: "${template.name}"`
            );
        }

        for (const step of template.steps) {
            if (
                !step.name ||
                !step.role ||
                !Number.isInteger(step.days) ||
                step.days < 1
            ) {
                throw new Error(
                    `Invalid step in template "${template.name}": ${JSON.stringify(step)}`
                );
            }
        }

        categoryCounts[template.category] =
            (categoryCounts[template.category] || 0) + 1;
    }

    for (const [category, expectedCount] of Object.entries(
        EXPECTED_CATEGORY_COUNTS
    )) {
        const actualCount = categoryCounts[category] || 0;

        if (actualCount !== expectedCount) {
            throw new Error(
                `Category "${category}" expected ${expectedCount} templates, found ${actualCount}.`
            );
        }
    }

    const unexpectedCategories = Object.keys(categoryCounts).filter(
        (category) => !(category in EXPECTED_CATEGORY_COUNTS)
    );

    if (unexpectedCategories.length > 0) {
        throw new Error(
            `Unexpected categories found: ${unexpectedCategories.join(', ')}`
        );
    }

    console.log(
        `✅ Validation passed: ${templates.length} templates`
    );

    return categoryCounts;
}

/**
 * ============================================================
 * DATABASE SEED
 * ============================================================
 */

async function seedWorkTemplates() {
    const client = await pool.connect();

    try {
        const categoryCounts = validateTemplates();

        console.log('\n🚀 Starting workflow template seed...');

        await client.query('BEGIN');

        console.log('🗑️  Removing old workflow templates...');

        await client.query(`
            DELETE FROM workflow_templates
        `);

        console.log('📦 Inserting canonical templates...');

        for (const template of templates) {
            await client.query(
                `
                INSERT INTO workflow_templates
                (
                    name,
                    category,
                    icon,
                    description,
                    steps,
                    estimated_days,
                    is_active
                )
                VALUES
                (
                    $1,
                    $2,
                    $3,
                    $4,
                    $5::jsonb,
                    $6,
                    $7
                )
                `,
                [
                    template.name,
                    template.category,
                    template.icon,
                    template.description,
                    JSON.stringify(template.steps),
                    template.estimated_days,
                    template.is_active,
                ]
            );
        }

        await client.query('COMMIT');

        console.log('\n========================================');
        console.log('✅ WORK TEMPLATE SEED COMPLETED');
        console.log('========================================');
        console.log(
            `📊 Total templates inserted: ${templates.length}`
        );

        console.log('\n📚 Category counts:');

        for (const [category, count] of Object.entries(
            categoryCounts
        )) {
            console.log(`   ${category}: ${count}`);
        }

        console.log(
            '\n🔥 Old workflow template data was replaced successfully.'
        );
        console.log(
            '🚀 FlowPilot now has the canonical template library.'
        );
    } catch (error) {
        await client.query('ROLLBACK');

        console.error('\n❌ WORK TEMPLATE SEED FAILED');
        console.error('🔄 Transaction rolled back.');
        console.error(`Reason: ${error.message}`);

        process.exitCode = 1;
    } finally {
        client.release();
        await pool.end();
    }
}

seedWorkTemplates();
