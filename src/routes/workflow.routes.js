// src/routes/workflow.routes.js
import express from 'express';
const router = express.Router();
import { v4 as uuidv4 } from 'uuid';
import { query } from '../config/database.js';
import { authMiddleware } from '../middleware/auth.js';

// ============================================
// 1. GET ALL WORKFLOW TEMPLATES (with Pagination)
// ============================================
router.get('/templates', authMiddleware, async (req, res) => {
    try {
        const {
            category,
            search,
            page = 1,
            limit = 20,
            sortBy = 'name',
            sortOrder = 'ASC',
            minDays,
            maxDays,
            isActive
        } = req.query;

        const offset = (parseInt(page) - 1) * parseInt(limit);

        // ✅ Build WHERE clause
        let whereClause = 'WHERE 1=1';
        const params = [];
        let paramIndex = 1;

        if (category && category !== 'All' && category !== 'all') {
            whereClause += ` AND category = $${paramIndex++}`;
            params.push(category);
        }

        if (search) {
            whereClause += ` AND (name ILIKE $${paramIndex++} OR description ILIKE $${paramIndex++})`;
            params.push(`%${search}%`, `%${search}%`);
        }

        if (minDays) {
            whereClause += ` AND estimated_days >= $${paramIndex++}`;
            params.push(parseInt(minDays));
        }

        if (maxDays) {
            whereClause += ` AND estimated_days <= $${paramIndex++}`;
            params.push(parseInt(maxDays));
        }

        if (isActive !== undefined && isActive !== '') {
            whereClause += ` AND is_active = $${paramIndex++}`;
            params.push(isActive === 'true');
        }

        // ✅ Get total count
        const countResult = await query(
            `SELECT COUNT(*) FROM workflow_templates ${whereClause}`,
            params
        );
        const total = parseInt(countResult.rows[0].count);

        // ✅ Get paginated results
        const validSortColumns = ['name', 'category', 'estimated_days', 'created_at'];
        const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'name';
        const order = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

        const result = await query(
            `SELECT
                id,
                name,
                category,
                icon,
                description,
                steps,
                estimated_days,
                is_active,
                created_at
             FROM workflow_templates
             ${whereClause}
             ORDER BY ${sortColumn} ${order}
             LIMIT $${paramIndex++} OFFSET $${paramIndex++}`,
            [...params, parseInt(limit), offset]
        );

        res.json({
            success: true,
            data: {
                templates: result.rows,
                pagination: {
                    total,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPages: Math.ceil(total / parseInt(limit)),
                    hasNext: parseInt(page) * parseInt(limit) < total,
                    hasPrev: parseInt(page) > 1
                },
                filters: {
                    category: category || null,
                    search: search || null,
                    minDays: minDays || null,
                    maxDays: maxDays || null,
                    isActive: isActive !== undefined ? isActive === 'true' : null
                }
            }
        });

    } catch (error) {
        console.error('Get templates error:', error);
        res.status(500).json({
            success: false,
            error: 'SERVER_ERROR',
            message: 'Failed to get workflow templates'
        });
    }
});

// ============================================
// 2. GET SINGLE TEMPLATE
// ============================================
router.get('/templates/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;

        const result = await query(
            `SELECT
                id, name, category, icon, description, steps,
                estimated_days, is_active, created_at
             FROM workflow_templates
             WHERE id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'NOT_FOUND',
                message: 'Template not found'
            });
        }

        res.json({
            success: true,
            data: result.rows[0]
        });

    } catch (error) {
        console.error('Get template error:', error);
        res.status(500).json({
            success: false,
            error: 'SERVER_ERROR',
            message: 'Failed to get template'
        });
    }
});

// ============================================
// 3. GET TEMPLATE CATEGORIES (for filter)
// ============================================
router.get('/templates/categories/all', authMiddleware, async (req, res) => {
    try {
        const result = await query(
            `SELECT DISTINCT category, COUNT(*) as count
             FROM workflow_templates
             WHERE is_active = true
             GROUP BY category
             ORDER BY category`
        );

        const categories = result.rows.map(row => ({
            name: row.category,
            count: parseInt(row.count)
        }));

        res.json({
            success: true,
            data: {
                categories,
                total: categories.length
            }
        });

    } catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({
            success: false,
            error: 'SERVER_ERROR',
            message: 'Failed to get categories'
        });
    }
});

// ============================================
// 4. CREATE WORKFLOW FROM TEMPLATE
// ============================================
router.post('/create', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const { templateId, organizationId, name, customSteps, assignedTo } = req.body;

        // ✅ Validation
        if (!templateId || !organizationId) {
            return res.status(400).json({
                success: false,
                error: 'MISSING_FIELDS',
                message: 'templateId and organizationId are required'
            });
        }

        // ✅ Check if user is member of organization
        const memberCheck = await query(
            'SELECT id FROM org_members WHERE organization_id = $1 AND user_id = $2 AND status = $3',
            [organizationId, userId, 'active']
        );

        if (memberCheck.rows.length === 0) {
            return res.status(403).json({
                success: false,
                error: 'NOT_A_MEMBER',
                message: 'You are not a member of this organization'
            });
        }

        // ✅ Get template
        const templateResult = await query(
            `SELECT * FROM workflow_templates WHERE id = $1 AND is_active = true`,
            [templateId]
        );

        if (templateResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'TEMPLATE_NOT_FOUND',
                message: 'Template not found or inactive'
            });
        }

        const template = templateResult.rows[0];
        const steps = customSteps || template.steps;
        const workflowName = name || template.name;
        const workflowId = uuidv4();

        // ✅ Create user workflow
        await query(
            `INSERT INTO user_workflows
             (id, template_id, organization_id, name, steps, created_by, status, assigned_to)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [workflowId, templateId, organizationId, workflowName, steps, userId, 'draft', assignedTo || null]
        );

        // ✅ Create tasks for each step
        for (let i = 0; i < steps.length; i++) {
            const step = steps[i];
            const assignedUserId = assignedTo?.[i] || null;

            await query(
                `INSERT INTO workflow_tasks
                 (workflow_id, step_index, step_name, assigned_to, status)
                 VALUES ($1, $2, $3, $4, $5)`,
                [workflowId, i, step.name, assignedUserId, 'pending']
            );
        }

        res.status(201).json({
            success: true,
            data: {
                workflowId,
                name: workflowName,
                message: 'Workflow created successfully'
            }
        });

    } catch (error) {
        console.error('Create workflow error:', error);
        res.status(500).json({
            success: false,
            error: 'SERVER_ERROR',
            message: 'Failed to create workflow'
        });
    }
});

// ============================================
// 5. GET USER'S WORKFLOWS (with Pagination)
// ============================================
router.get('/my', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const {
            organizationId,
            status,
            page = 1,
            limit = 20,
            sortBy = 'created_at',
            sortOrder = 'DESC',
            search
        } = req.query;

        const offset = (parseInt(page) - 1) * parseInt(limit);

        // ✅ Build WHERE clause
        let whereClause = 'WHERE w.created_by = $1';
        const params = [userId];
        let paramIndex = 2;

        if (organizationId) {
            whereClause += ` AND w.organization_id = $${paramIndex++}`;
            params.push(organizationId);
        }

        if (status) {
            whereClause += ` AND w.status = $${paramIndex++}`;
            params.push(status);
        }

        if (search) {
            whereClause += ` AND w.name ILIKE $${paramIndex++}`;
            params.push(`%${search}%`);
        }

        // ✅ Get total count
        const countResult = await query(
            `SELECT COUNT(*) FROM user_workflows w ${whereClause}`,
            params
        );
        const total = parseInt(countResult.rows[0].count);

        // ✅ Get paginated results
        const validSortColumns = ['name', 'status', 'progress', 'created_at', 'updated_at'];
        const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'created_at';
        const order = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

        const result = await query(
            `SELECT
                w.id,
                w.name,
                w.status,
                w.progress,
                w.steps,
                w.current_step,
                w.started_at,
                w.completed_at,
                w.created_at,
                w.updated_at,
                t.name as template_name,
                t.icon as template_icon,
                o.name as organization_name
             FROM user_workflows w
             LEFT JOIN workflow_templates t ON w.template_id = t.id
             LEFT JOIN organizations o ON w.organization_id = o.id
             ${whereClause}
             ORDER BY ${sortColumn} ${order}
             LIMIT $${paramIndex++} OFFSET $${paramIndex++}`,
            [...params, parseInt(limit), offset]
        );

        res.json({
            success: true,
            data: {
                workflows: result.rows,
                pagination: {
                    total,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPages: Math.ceil(total / parseInt(limit)),
                    hasNext: parseInt(page) * parseInt(limit) < total,
                    hasPrev: parseInt(page) > 1
                }
            }
        });

    } catch (error) {
        console.error('Get user workflows error:', error);
        res.status(500).json({
            success: false,
            error: 'SERVER_ERROR',
            message: 'Failed to get workflows'
        });
    }
});

// ============================================
// 6. GET WORKFLOW DETAILS (with tasks)
// ============================================
router.get('/:workflowId', authMiddleware, async (req, res) => {
    try {
        const { workflowId } = req.params;
        const userId = req.user.id;

        // ✅ Check if user has access
        const check = await query(
            `SELECT w.* FROM user_workflows w
             JOIN org_members m ON m.organization_id = w.organization_id
             WHERE w.id = $1 AND m.user_id = $2 AND m.status = $3`,
            [workflowId, userId, 'active']
        );

        if (check.rows.length === 0) {
            return res.status(403).json({
                success: false,
                error: 'FORBIDDEN',
                message: 'You do not have access to this workflow'
            });
        }

        // ✅ Get workflow details
        const workflowResult = await query(
            `SELECT
                w.*,
                t.name as template_name,
                t.icon as template_icon,
                o.name as organization_name,
                u.name as created_by_name
             FROM user_workflows w
             LEFT JOIN workflow_templates t ON w.template_id = t.id
             LEFT JOIN organizations o ON w.organization_id = o.id
             LEFT JOIN users u ON w.created_by = u.id
             WHERE w.id = $1`,
            [workflowId]
        );

        // ✅ Get tasks
        const tasksResult = await query(
            `SELECT
                t.*,
                u.name as assignee_name,
                u.email as assignee_email
             FROM workflow_tasks t
             LEFT JOIN users u ON t.assigned_to = u.id
             WHERE t.workflow_id = $1
             ORDER BY t.step_index`,
            [workflowId]
        );

        res.json({
            success: true,
            data: {
                workflow: workflowResult.rows[0],
                tasks: tasksResult.rows
            }
        });

    } catch (error) {
        console.error('Get workflow details error:', error);
        res.status(500).json({
            success: false,
            error: 'SERVER_ERROR',
            message: 'Failed to get workflow details'
        });
    }
});

// ============================================
// 7. UPDATE WORKFLOW
// ============================================
router.put('/:workflowId', authMiddleware, async (req, res) => {
    try {
        const { workflowId } = req.params;
        const userId = req.user.id;
        const { name, steps, assigned_to, status } = req.body;

        // ✅ Check ownership
        const check = await query(
            `SELECT * FROM user_workflows WHERE id = $1`,
            [workflowId]
        );

        if (check.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'NOT_FOUND',
                message: 'Workflow not found'
            });
        }

        const workflow = check.rows[0];

        // ✅ Check if user is creator or admin
        const memberCheck = await query(
            `SELECT role FROM org_members
             WHERE organization_id = $1 AND user_id = $2 AND status = $3`,
            [workflow.organization_id, userId, 'active']
        );

        const isAdmin = memberCheck.rows.length > 0 &&
            ['owner', 'admin'].includes(memberCheck.rows[0].role);

        if (workflow.created_by !== userId && !isAdmin) {
            return res.status(403).json({
                success: false,
                error: 'FORBIDDEN',
                message: 'You do not have permission to update this workflow'
            });
        }

        // ✅ Build UPDATE query
        const updates = [];
        const params = [];
        let paramIndex = 1;

        if (name) {
            updates.push(`name = $${paramIndex++}`);
            params.push(name);
        }
        if (steps) {
            updates.push(`steps = $${paramIndex++}`);
            params.push(steps);
        }
        if (status) {
            updates.push(`status = $${paramIndex++}`);
            params.push(status);
        }

        if (updates.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'NO_FIELDS',
                message: 'No fields to update'
            });
        }

        updates.push(`updated_at = NOW()`);
        params.push(workflowId);

        await query(
            `UPDATE user_workflows SET ${updates.join(', ')} WHERE id = $${paramIndex}`,
            params
        );

        // ✅ Update tasks if assigned_to provided
        if (assigned_to) {
            for (const [stepIndex, userId] of Object.entries(assigned_to)) {
                await query(
                    `UPDATE workflow_tasks
                     SET assigned_to = $1, updated_at = NOW()
                     WHERE workflow_id = $2 AND step_index = $3`,
                    [userId, workflowId, parseInt(stepIndex)]
                );
            }
        }

        res.json({
            success: true,
            message: 'Workflow updated successfully'
        });

    } catch (error) {
        console.error('Update workflow error:', error);
        res.status(500).json({
            success: false,
            error: 'SERVER_ERROR',
            message: 'Failed to update workflow'
        });
    }
});

// ============================================
// 8. UPDATE TASK STATUS
// ============================================
router.patch('/task/:taskId', authMiddleware, async (req, res) => {
    try {
        const { taskId } = req.params;
        const userId = req.user.id;
        const { status, notes } = req.body;

        // ✅ Check if task exists
        const taskCheck = await query(
            `SELECT t.*, w.organization_id
             FROM workflow_tasks t
             JOIN user_workflows w ON t.workflow_id = w.id
             WHERE t.id = $1`,
            [taskId]
        );

        if (taskCheck.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'TASK_NOT_FOUND',
                message: 'Task not found'
            });
        }

        const task = taskCheck.rows[0];

        // ✅ Check if user has access (assigned OR admin)
        const memberCheck = await query(
            `SELECT role FROM org_members
             WHERE organization_id = $1 AND user_id = $2 AND status = $3`,
            [task.organization_id, userId, 'active']
        );

        const isAdmin = memberCheck.rows.length > 0 &&
            ['owner', 'admin'].includes(memberCheck.rows[0].role);
        const isAssigned = task.assigned_to === userId;

        if (!isAssigned && !isAdmin) {
            return res.status(403).json({
                success: false,
                error: 'FORBIDDEN',
                message: 'You do not have permission to update this task'
            });
        }

        // ✅ Update task
        const result = await query(
            `UPDATE workflow_tasks
             SET status = $1,
                 notes = COALESCE($2, notes),
                 updated_at = NOW()
             WHERE id = $3
             RETURNING *`,
            [status, notes, taskId]
        );

        res.json({
            success: true,
            data: result.rows[0],
            message: 'Task updated successfully'
        });

    } catch (error) {
        console.error('Update task error:', error);
        res.status(500).json({
            success: false,
            error: 'SERVER_ERROR',
            message: 'Failed to update task'
        });
    }
});

// ============================================
// 9. DELETE WORKFLOW
// ============================================
router.delete('/:workflowId', authMiddleware, async (req, res) => {
    try {
        const { workflowId } = req.params;
        const userId = req.user.id;

        // ✅ Check workflow exists
        const check = await query(
            `SELECT w.* FROM user_workflows w
             JOIN org_members m ON m.organization_id = w.organization_id
             WHERE w.id = $1 AND m.user_id = $2 AND m.status = $3`,
            [workflowId, userId, 'active']
        );

        if (check.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'NOT_FOUND',
                message: 'Workflow not found or you do not have access'
            });
        }

        const workflow = check.rows[0];

        // ✅ Check if user is creator or admin
        const memberCheck = await query(
            `SELECT role FROM org_members
             WHERE organization_id = $1 AND user_id = $2 AND status = $3`,
            [workflow.organization_id, userId, 'active']
        );

        const isAdmin = memberCheck.rows.length > 0 &&
            ['owner', 'admin'].includes(memberCheck.rows[0].role);

        if (workflow.created_by !== userId && !isAdmin) {
            return res.status(403).json({
                success: false,
                error: 'FORBIDDEN',
                message: 'You do not have permission to delete this workflow'
            });
        }

        // ✅ Delete workflow (cascade will delete tasks)
        await query('DELETE FROM user_workflows WHERE id = $1', [workflowId]);

        res.json({
            success: true,
            message: 'Workflow deleted successfully'
        });

    } catch (error) {
        console.error('Delete workflow error:', error);
        res.status(500).json({
            success: false,
            error: 'SERVER_ERROR',
            message: 'Failed to delete workflow'
        });
    }
});

// ============================================
// 10. GET WORKFLOW STATS (Dashboard)
// ============================================
router.get('/stats/dashboard', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const { organizationId } = req.query;

        let orgFilter = '';
        const params = [userId];
        let paramIndex = 2;

        if (organizationId) {
            orgFilter = ` AND organization_id = $${paramIndex++}`;
            params.push(organizationId);
        }

        // ✅ Get stats
        const result = await query(
            `SELECT
                COUNT(*) as total,
                COUNT(*) FILTER (WHERE status = 'draft') as draft,
                COUNT(*) FILTER (WHERE status = 'in_progress') as in_progress,
                COUNT(*) FILTER (WHERE status = 'review') as review,
                COUNT(*) FILTER (WHERE status = 'completed') as completed,
                COUNT(*) FILTER (WHERE status = 'archived') as archived,
                AVG(progress) as avg_progress
             FROM user_workflows
             WHERE created_by = $1${orgFilter}`,
            params
        );

        const stats = result.rows[0];

        res.json({
            success: true,
            data: {
                total: parseInt(stats.total),
                draft: parseInt(stats.draft),
                in_progress: parseInt(stats.in_progress),
                review: parseInt(stats.review),
                completed: parseInt(stats.completed),
                archived: parseInt(stats.archived),
                avg_progress: Math.round(stats.avg_progress || 0)
            }
        });

    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({
            success: false,
            error: 'SERVER_ERROR',
            message: 'Failed to get stats'
        });
    }
});

// ============================================
// 11. GET RECENT WORKFLOWS (Dashboard)
// ============================================
router.get('/recent', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const { limit = 5, organizationId } = req.query;

        let orgFilter = '';
        const params = [userId];
        let paramIndex = 2;

        if (organizationId) {
            orgFilter = ` AND w.organization_id = $${paramIndex++}`;
            params.push(organizationId);
        }

        const result = await query(
            `SELECT
                w.id, w.name, w.status, w.progress, w.created_at,
                t.icon as template_icon,
                o.name as organization_name
             FROM user_workflows w
             LEFT JOIN workflow_templates t ON w.template_id = t.id
             LEFT JOIN organizations o ON w.organization_id = o.id
             WHERE w.created_by = $1${orgFilter}
             ORDER BY w.updated_at DESC
             LIMIT $${paramIndex}`,
            [...params, parseInt(limit)]
        );

        res.json({
            success: true,
            data: result.rows
        });

    } catch (error) {
        console.error('Get recent workflows error:', error);
        res.status(500).json({
            success: false,
            error: 'SERVER_ERROR',
            message: 'Failed to get recent workflows'
        });
    }
});

// ============================================
// 12. DUPLICATE WORKFLOW
// ============================================
router.post('/:workflowId/duplicate', authMiddleware, async (req, res) => {
    try {
        const { workflowId } = req.params;
        const userId = req.user.id;
        const { name } = req.body;

        // ✅ Get existing workflow
        const result = await query(
            `SELECT * FROM user_workflows WHERE id = $1`,
            [workflowId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'NOT_FOUND',
                message: 'Workflow not found'
            });
        }

        const existing = result.rows[0];
        const newId = uuidv4();
        const newName = name || `${existing.name} (Copy)`;

        // ✅ Duplicate workflow
        await query(
            `INSERT INTO user_workflows
             (id, template_id, organization_id, name, steps, created_by, status, assigned_to)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [newId, existing.template_id, existing.organization_id, newName,
                existing.steps, userId, 'draft', existing.assigned_to]
        );

        // ✅ Duplicate tasks
        const tasks = await query(
            `SELECT * FROM workflow_tasks WHERE workflow_id = $1`,
            [workflowId]
        );

        for (const task of tasks.rows) {
            await query(
                `INSERT INTO workflow_tasks
                 (workflow_id, step_index, step_name, assigned_to, status, notes)
                 VALUES ($1, $2, $3, $4, $5, $6)`,
                [newId, task.step_index, task.step_name, null, 'pending', null]
            );
        }

        res.status(201).json({
            success: true,
            data: {
                workflowId: newId,
                name: newName,
                message: 'Workflow duplicated successfully'
            }
        });

    } catch (error) {
        console.error('Duplicate workflow error:', error);
        res.status(500).json({
            success: false,
            error: 'SERVER_ERROR',
            message: 'Failed to duplicate workflow'
        });
    }
});

export default router;
