-- ============================================
-- MIGRATION 003: WORKFLOW MODULE
-- ============================================
-- Created: 2024-06-20
-- Description: Workflow templates, user workflows, and tasks

-- ============================================
-- 1. WORKFLOW TEMPLATES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS workflow_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    icon VARCHAR(50),
    description TEXT,
    steps JSONB NOT NULL, -- [{name, role, days}]
    estimated_days INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 2. USER WORKFLOWS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS user_workflows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id UUID REFERENCES workflow_templates(id) ON DELETE SET NULL,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'in_progress', 'review', 'completed', 'archived')),
    steps JSONB NOT NULL, -- Customized steps with assignments
    assigned_to JSONB, -- {step_index: user_id}
    current_step INTEGER DEFAULT 0,
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 3. WORKFLOW TASKS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS workflow_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_id UUID REFERENCES user_workflows(id) ON DELETE CASCADE,
    step_index INTEGER NOT NULL,
    step_name VARCHAR(255) NOT NULL,
    assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'review', 'done', 'blocked')),
    due_date TIMESTAMP,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    notes TEXT,
    attachments JSONB, -- Array of file URLs
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(workflow_id, step_index)
);

-- ============================================
-- 4. WORKFLOW COMMENTS (Optional)
-- ============================================
CREATE TABLE IF NOT EXISTS workflow_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID REFERENCES workflow_tasks(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    comment TEXT NOT NULL,
    parent_id UUID REFERENCES workflow_comments(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 5. WORKFLOW ACTIVITY LOG
-- ============================================
CREATE TABLE IF NOT EXISTS workflow_activity_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_id UUID REFERENCES user_workflows(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    details JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_workflow_templates_category ON workflow_templates(category);
CREATE INDEX idx_workflow_templates_active ON workflow_templates(is_active);
CREATE INDEX idx_user_workflows_org ON user_workflows(organization_id);
CREATE INDEX idx_user_workflows_status ON user_workflows(status);
CREATE INDEX idx_user_workflows_progress ON user_workflows(progress);
CREATE INDEX idx_workflow_tasks_workflow ON workflow_tasks(workflow_id);
CREATE INDEX idx_workflow_tasks_assigned ON workflow_tasks(assigned_to);
CREATE INDEX idx_workflow_tasks_status ON workflow_tasks(status);
CREATE INDEX idx_workflow_tasks_due ON workflow_tasks(due_date);
CREATE INDEX idx_workflow_comments_task ON workflow_comments(task_id);
CREATE INDEX idx_workflow_activity_workflow ON workflow_activity_log(workflow_id);

-- ============================================
-- TRIGGERS
-- ============================================
CREATE TRIGGER update_workflow_templates_updated_at
    BEFORE UPDATE ON workflow_templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_workflows_updated_at
    BEFORE UPDATE ON user_workflows
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workflow_tasks_updated_at
    BEFORE UPDATE ON workflow_tasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- FUNCTION: Auto-update workflow progress
-- ============================================
CREATE OR REPLACE FUNCTION update_workflow_progress()
RETURNS TRIGGER AS $$
DECLARE
    total_steps INTEGER;
    done_steps INTEGER;
BEGIN
    -- Get total steps
    SELECT COUNT(*) INTO total_steps
    FROM workflow_tasks
    WHERE workflow_id = NEW.workflow_id;

    -- Get completed steps
    SELECT COUNT(*) INTO done_steps
    FROM workflow_tasks
    WHERE workflow_id = NEW.workflow_id AND status = 'done';

    -- Update progress
    UPDATE user_workflows
    SET progress = (done_steps::FLOAT / total_steps::FLOAT * 100)::INTEGER,
        updated_at = NOW()
    WHERE id = NEW.workflow_id;

    -- Update status if all done
    IF done_steps = total_steps THEN
        UPDATE user_workflows
        SET status = 'completed',
            completed_at = NOW(),
            updated_at = NOW()
        WHERE id = NEW.workflow_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_progress_after_task_change
    AFTER UPDATE OF status ON workflow_tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_workflow_progress();

-- ============================================
-- FUNCTION: Log workflow activity
-- ============================================
CREATE OR REPLACE FUNCTION log_workflow_activity()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'UPDATE' AND OLD.status <> NEW.status THEN
        INSERT INTO workflow_activity_log (workflow_id, user_id, action, details)
        VALUES (
            NEW.workflow_id,
            NEW.assigned_to,
            'task_status_changed',
            jsonb_build_object(
                'task_id', NEW.id,
                'old_status', OLD.status,
                'new_status', NEW.status,
                'step_name', NEW.step_name
            )
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER log_task_status_change
    AFTER UPDATE OF status ON workflow_tasks
    FOR EACH ROW
    EXECUTE FUNCTION log_workflow_activity();
