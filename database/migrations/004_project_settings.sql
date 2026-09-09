-- ============================================
-- MIGRATION 004: PROJECT SETTINGS
-- ============================================

-- ============================================
-- 1. PROJECT DETAILS
-- ============================================

ALTER TABLE user_workflows
ADD COLUMN IF NOT EXISTS description TEXT;

ALTER TABLE user_workflows
ADD COLUMN IF NOT EXISTS client VARCHAR(255);

ALTER TABLE user_workflows
ADD COLUMN IF NOT EXISTS goal TEXT;

ALTER TABLE user_workflows
ADD COLUMN IF NOT EXISTS project_status VARCHAR(50) DEFAULT 'planning';

ALTER TABLE user_workflows
ADD COLUMN IF NOT EXISTS priority VARCHAR(50) DEFAULT 'medium';

ALTER TABLE user_workflows
ADD COLUMN IF NOT EXISTS category VARCHAR(100);

ALTER TABLE user_workflows
ADD COLUMN IF NOT EXISTS tags JSONB DEFAULT '[]'::jsonb;

-- ============================================
-- 2. PROJECT HEAD & TIMELINE
-- ============================================

ALTER TABLE user_workflows
ADD COLUMN IF NOT EXISTS project_head UUID
REFERENCES users(id)
ON DELETE SET NULL;

ALTER TABLE user_workflows
ADD COLUMN IF NOT EXISTS start_date DATE;

ALTER TABLE user_workflows
ADD COLUMN IF NOT EXISTS end_date DATE;

-- ============================================
-- 3. PROJECT ATTACHMENTS
-- ============================================

ALTER TABLE user_workflows
ADD COLUMN IF NOT EXISTS attachments JSONB DEFAULT '[]'::jsonb;

-- ============================================
-- 4. CUSTOM FIELDS
-- ============================================

ALTER TABLE user_workflows
ADD COLUMN IF NOT EXISTS custom_fields JSONB DEFAULT '{}'::jsonb;

-- ============================================
-- 5. PROJECT STATUS CONSTRAINT
-- ============================================

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'user_workflows_project_status_check'
    ) THEN
        ALTER TABLE user_workflows
        ADD CONSTRAINT user_workflows_project_status_check
        CHECK (
            project_status IN (
                'planning',
                'active',
                'review',
                'completed',
                'on-hold'
            )
        );
    END IF;
END $$;

-- ============================================
-- 6. PRIORITY CONSTRAINT
-- ============================================

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'user_workflows_priority_check'
    ) THEN
        ALTER TABLE user_workflows
        ADD CONSTRAINT user_workflows_priority_check
        CHECK (
            priority IN (
                'low',
                'medium',
                'high',
                'urgent'
            )
        );
    END IF;
END $$;

-- ============================================
-- 7. TASK / WORKFLOW STEP DETAILS
-- ============================================

ALTER TABLE workflow_tasks
ADD COLUMN IF NOT EXISTS role VARCHAR(255);

ALTER TABLE workflow_tasks
ADD COLUMN IF NOT EXISTS duration_days INTEGER DEFAULT 1;

ALTER TABLE workflow_tasks
ADD COLUMN IF NOT EXISTS start_date DATE;

ALTER TABLE workflow_tasks
ADD COLUMN IF NOT EXISTS end_date DATE;

-- ============================================
-- 8. INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_user_workflows_project_head
ON user_workflows(project_head);

CREATE INDEX IF NOT EXISTS idx_user_workflows_dates
ON user_workflows(start_date, end_date);

CREATE INDEX IF NOT EXISTS idx_user_workflows_project_status
ON user_workflows(project_status);

CREATE INDEX IF NOT EXISTS idx_user_workflows_priority
ON user_workflows(priority);

CREATE INDEX IF NOT EXISTS idx_workflow_tasks_assignee_status
ON workflow_tasks(assigned_to, status);

CREATE INDEX IF NOT EXISTS idx_workflow_tasks_dates
ON workflow_tasks(start_date, end_date);
