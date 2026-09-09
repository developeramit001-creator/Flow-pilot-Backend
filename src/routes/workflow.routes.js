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
// ============================================
// 4. CREATE PROJECT
// ============================================
// ============================================
// CREATE PROJECT / WORKFLOW
// ============================================
router.post('/create', authMiddleware, async (req, res) => {
    let client;

    try {
        const userId = req.user.id;

        const {
            templateId = null,
            organizationId,

            // Project details
            name,
            description,
            client: projectClient,
            goal,
            status = 'planning',
            priority = 'medium',
            category,
            tags,
            projectHead,
            timeline,
            attachments = [],

            // Workflow
            steps = [],
            assignedTo = {},
            stepDeadlines = {},
            stepAttachments = {},

            // Future workflow-specific fields
            customFields = {}
        } = req.body;

        // ============================================
        // 1. BASIC VALIDATION
        // ============================================

        if (!organizationId) {
            return res.status(400).json({
                success: false,
                error: 'MISSING_ORGANIZATION',
                message: 'organizationId is required'
            });
        }

        if (!name || !name.trim()) {
            return res.status(400).json({
                success: false,
                error: 'MISSING_PROJECT_NAME',
                message: 'Project name is required'
            });
        }

        if (!Array.isArray(steps) || steps.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'MISSING_STEPS',
                message: 'At least one workflow step is required'
            });
        }

        // ============================================
        // 2. VALID PROJECT STATUS
        // ============================================

        const validProjectStatuses = [
            'planning',
            'active',
            'review',
            'completed',
            'on-hold'
        ];

        if (!validProjectStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                error: 'INVALID_PROJECT_STATUS',
                message: 'Invalid project status'
            });
        }

        // ============================================
        // 3. VALID PRIORITY
        // ============================================

        const validPriorities = [
            'low',
            'medium',
            'high'
        ];

        if (!validPriorities.includes(priority)) {
            return res.status(400).json({
                success: false,
                error: 'INVALID_PRIORITY',
                message: 'Invalid project priority'
            });
        }

        // ============================================
        // 4. GET DATABASE CLIENT
        // ============================================

        // IMPORTANT:
        // Use one DB connection for the complete transaction.
        // This prevents project being created without its tasks
        // if any task insertion fails.
        const { pool } = await import('../config/database.js');

        client = await pool.connect();

        await client.query('BEGIN');

        // ============================================
        // 5. CHECK ORGANIZATION MEMBERSHIP
        // ============================================

        const memberCheck = await client.query(
            `
            SELECT id, role
            FROM org_members
            WHERE organization_id = $1
              AND user_id = $2
              AND status = $3
            `,
            [organizationId, userId, 'active']
        );

        if (memberCheck.rows.length === 0) {
            await client.query('ROLLBACK');

            return res.status(403).json({
                success: false,
                error: 'NOT_A_MEMBER',
                message: 'You are not a member of this organization'
            });
        }

        // ============================================
        // 6. VALIDATE TEMPLATE IF PROVIDED
        // ============================================
        //
        // Template is ONLY the origin/reference.
        //
        // We DO NOT copy the current template again here.
        // Final project steps/settings come from the frontend
        // and are stored as a project snapshot.
        //
        // Therefore, if the template changes later,
        // this project will NOT change.
        // ============================================

        if (templateId) {
            const templateCheck = await client.query(
                `
                SELECT id
                FROM workflow_templates
                WHERE id = $1
                  AND is_active = true
                `,
                [templateId]
            );

            if (templateCheck.rows.length === 0) {
                await client.query('ROLLBACK');

                return res.status(404).json({
                    success: false,
                    error: 'TEMPLATE_NOT_FOUND',
                    message: 'Template not found or inactive'
                });
            }
        }

        // ============================================
        // 7. VALIDATE PROJECT HEAD
        // ============================================

        const finalProjectHead = projectHead || userId;

        const projectHeadCheck = await client.query(
            `
            SELECT u.id
            FROM users u
            INNER JOIN org_members m
                ON m.user_id = u.id
            WHERE u.id = $1
              AND m.organization_id = $2
              AND m.status = 'active'
            `,
            [finalProjectHead, organizationId]
        );

        if (projectHeadCheck.rows.length === 0) {
            await client.query('ROLLBACK');

            return res.status(400).json({
                success: false,
                error: 'INVALID_PROJECT_HEAD',
                message: 'Project head must be an active organization member'
            });
        }

        // ============================================
        // 8. PROJECT TIMELINE
        // ============================================

        const projectStartDate = timeline?.start || null;
        const projectEndDate = timeline?.end || null;

        if (
            projectStartDate &&
            projectEndDate &&
            new Date(projectStartDate) > new Date(projectEndDate)
        ) {
            await client.query('ROLLBACK');

            return res.status(400).json({
                success: false,
                error: 'INVALID_PROJECT_TIMELINE',
                message: 'Project start date cannot be after project end date'
            });
        }

        // ============================================
        // 9. NORMALIZE TAGS
        // ============================================

        let normalizedTags = [];

        if (Array.isArray(tags)) {
            normalizedTags = tags
                .map(tag => String(tag).trim())
                .filter(Boolean);
        } else if (typeof tags === 'string') {
            normalizedTags = tags
                .split(',')
                .map(tag => tag.trim())
                .filter(Boolean);
        }

        // ============================================
        // 10. VALIDATE + NORMALIZE STEPS
        // ============================================

        const normalizedSteps = [];

        for (let i = 0; i < steps.length; i++) {
            const step = steps[i];

            if (!step.name || !step.name.trim()) {
                await client.query('ROLLBACK');

                return res.status(400).json({
                    success: false,
                    error: 'INVALID_STEP',
                    message: `Step ${i + 1} name is required`
                });
            }

            if (!step.role || !step.role.trim()) {
                await client.query('ROLLBACK');

                return res.status(400).json({
                    success: false,
                    error: 'INVALID_STEP',
                    message: `Step ${i + 1} role is required`
                });
            }

            const stepStartDate = step.startDate || null;
            const stepEndDate = step.endDate || null;

            // --------------------------------------------
            // Step date validation
            // --------------------------------------------

            if (
                stepStartDate &&
                stepEndDate &&
                new Date(stepStartDate) > new Date(stepEndDate)
            ) {
                await client.query('ROLLBACK');

                return res.status(400).json({
                    success: false,
                    error: 'INVALID_STEP_DATES',
                    message: `Step ${i + 1} start date cannot be after end date`
                });
            }

            // --------------------------------------------
            // Step cannot exceed project end
            // --------------------------------------------

            if (
                projectEndDate &&
                stepEndDate &&
                new Date(stepEndDate) > new Date(projectEndDate)
            ) {
                await client.query('ROLLBACK');

                return res.status(400).json({
                    success: false,
                    error: 'STEP_EXCEEDS_PROJECT',
                    message:
                        `Step ${i + 1} (${step.name}) ends after project end date`
                });
            }

            // --------------------------------------------
            // Assignment
            // --------------------------------------------

            let assignees = [];

            if (Array.isArray(step.assignees)) {
                assignees = [
                    ...new Set(
                        step.assignees
                            .filter(Boolean)
                            .map(id => String(id))
                    )
                ];
            }

            // Backward compatibility with existing frontend
            const legacyAssignedUser = assignedTo?.[i];

            if (
                assignees.length === 0 &&
                legacyAssignedUser
            ) {
                assignees = [String(legacyAssignedUser)];
            }

            // --------------------------------------------
            // Deadline
            // --------------------------------------------

            const deadline =
                step.deadline ||
                stepDeadlines?.[i] ||
                null;

            // --------------------------------------------
            // Attachments
            // --------------------------------------------

            const stepFiles =
                Array.isArray(step.attachments)
                    ? step.attachments
                    : (
                        Array.isArray(stepAttachments?.[i])
                            ? stepAttachments[i]
                            : []
                    );

            normalizedSteps.push({
                name: step.name.trim(),
                role: step.role.trim(),
                days: Number(step.days) || 1,
                assignees,
                startDate: stepStartDate,
                endDate: stepEndDate,
                deadline,
                attachments: stepFiles
            });
        }

        // ============================================
        // 11. VALIDATE ALL ASSIGNEES
        // ============================================
        //
        // Every assigned user MUST belong to the same
        // organization and must be an active member.
        // ============================================

        const allAssigneeIds = [
            ...new Set(
                normalizedSteps.flatMap(step => step.assignees)
            )
        ];

        if (allAssigneeIds.length > 0) {
            const assigneeCheck = await client.query(
                `
                SELECT u.id
                FROM users u
                INNER JOIN org_members m
                    ON m.user_id = u.id
                WHERE u.id = ANY($1::uuid[])
                  AND m.organization_id = $2
                  AND m.status = 'active'
                `,
                [allAssigneeIds, organizationId]
            );

            const validAssigneeIds =
                new Set(
                    assigneeCheck.rows.map(row => row.id)
                );

            const invalidAssignees =
                allAssigneeIds.filter(
                    id => !validAssigneeIds.has(id)
                );

            if (invalidAssignees.length > 0) {
                await client.query('ROLLBACK');

                return res.status(400).json({
                    success: false,
                    error: 'INVALID_ASSIGNEE',
                    message:
                        'One or more assigned users are not active members of this organization'
                });
            }
        }

        // ============================================
        // 12. CREATE PROJECT
        // ============================================

        const workflowId = uuidv4();

        /*
         * IMPORTANT:
         *
         * status = 'draft'
         *
         * This is the INTERNAL WORKFLOW status.
         *
         * project_status = frontend Project Settings status
         * (planning / active / review / completed / on-hold)
         *
         * They are intentionally separate concepts.
         */

        await client.query(
            `
            INSERT INTO user_workflows
            (
                id,
                template_id,
                organization_id,
                name,
                description,
                client,
                goal,
                status,
                project_status,
                priority,
                category,
                tags,
                project_head,
                start_date,
                end_date,
                attachments,
                custom_fields,
                steps,
                assigned_to,
                created_by
            )
            VALUES
            (
                $1,
                $2,
                $3,
                $4,
                $5,
                $6,
                $7,
                $8,
                $9,
                $10,
                $11,
                $12,
                $13,
                $14,
                $15,
                $16,
                $17,
                $18,
                $19,
                $20
            )
            `,
            [
                workflowId,
                templateId,
                organizationId,
                name.trim(),
                description || null,
                projectClient || null,
                goal || null,

                // Internal workflow lifecycle
                'draft',

                // Project Settings status
                status,

                priority,
                category || null,
                JSON.stringify(normalizedTags),
                finalProjectHead,
                projectStartDate,
                projectEndDate,
                JSON.stringify(attachments || []),
                JSON.stringify(customFields || {}),

                // FINAL PROJECT SNAPSHOT
                JSON.stringify(normalizedSteps),

                // Existing legacy assignment object
                JSON.stringify(assignedTo || {}),

                userId
            ]
        );

        // ============================================
        // 13. CREATE TASKS + ASSIGN MEMBERS
        // ============================================
        //
        // Example:
        //
        // Step 0 -> Script Writing -> Sumit
        // Step 1 -> Video Editing  -> Amit
        // Step 2 -> Thumbnail      -> Rahul
        //
        // Each task gets the actual user's UUID in
        // workflow_tasks.assigned_to.
        // ============================================

        for (let i = 0; i < normalizedSteps.length; i++) {
            const step = normalizedSteps[i];

            /*
             * Current workflow_tasks schema supports one
             * primary assignee per task.
             *
             * If multiple assignees are selected later,
             * the first one becomes the primary task owner.
             *
             * Later we can introduce:
             * workflow_task_assignees
             * for true many-to-many assignment.
             */
            const assignedUserId =
                step.assignees?.[0] || null;

            await client.query(
                `
                INSERT INTO workflow_tasks
                (
                    workflow_id,
                    step_index,
                    step_name,
                    role,
                    duration_days,
                    assigned_to,
                    status,
                    start_date,
                    end_date,
                    due_date,
                    attachments
                )
                VALUES
                (
                    $1,
                    $2,
                    $3,
                    $4,
                    $5,
                    $6,
                    $7,
                    $8,
                    $9,
                    $10,
                    $11
                )
                `,
                [
                    workflowId,
                    i,
                    step.name,
                    step.role,
                    step.days,
                    assignedUserId,
                    'pending',
                    step.startDate,
                    step.endDate,

                    // Task deadline
                    step.deadline,

                    JSON.stringify(step.attachments || [])
                ]
            );

            // ============================================
            // PUSH NOTIFICATION — FUTURE
            // ============================================
            //
            // Later we will add push notification here.
            //
            // Example:
            //
            // notifyUser({
            //     userId: assignedUserId,
            //     type: 'TASK_ASSIGNED',
            //     projectId: workflowId,
            //     taskName: step.name
            // });
            //
            // Notification should happen AFTER the DB
            // transaction is successfully committed.
            // ============================================
        }

        // ============================================
        // 14. ACTIVITY LOG
        // ============================================

        await client.query(
            `
            INSERT INTO workflow_activity_log
            (
                id,
                workflow_id,
                user_id,
                action,
                details
            )
            VALUES
            ($1, $2, $3, $4, $5)
            `,
            [
                uuidv4(),
                workflowId,
                userId,
                'project_created',
                JSON.stringify({
                    projectName: name.trim(),
                    projectHead: finalProjectHead,
                    taskCount: normalizedSteps.length,
                    assignedUsers: allAssigneeIds
                })
            ]
        );

        // ============================================
        // 15. COMMIT
        // ============================================

        await client.query('COMMIT');

        // ============================================
        // 16. PUSH NOTIFICATION — FUTURE
        // ============================================
        //
        // IMPORTANT:
        // Notifications should be sent AFTER COMMIT.
        //
        // Otherwise notification could be sent even if
        // database transaction fails/rolls back.
        //
        // Later:
        //
        // await notifyAssignedMembers(...);
        //
        // ============================================

        return res.status(201).json({
            success: true,
            data: {
                workflowId,
                name: name.trim(),
                projectHead: finalProjectHead,
                status,
                priority,
                taskCount: normalizedSteps.length,
                message: 'Project created successfully'
            }
        });

    } catch (error) {

        // ============================================
        // ROLLBACK ON ERROR
        // ============================================

        if (client) {
            try {
                await client.query('ROLLBACK');
            } catch (rollbackError) {
                console.error(
                    'Rollback error:',
                    rollbackError
                );
            }
        }

        console.error(
            'Create project error:',
            error
        );

        return res.status(500).json({
            success: false,
            error: 'SERVER_ERROR',
            message: 'Failed to create project'
        });

    } finally {

        if (client) {
            client.release();
        }
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


// ============================================
// GET MY ASSIGNED TASKS
// ============================================
router.get('/tasks/my', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;

        const {
            organizationId,
            status,
            page = 1,
            limit = 20
        } = req.query;

        const parsedPage = Math.max(parseInt(page) || 1, 1);
        const parsedLimit = Math.min(
            Math.max(parseInt(limit) || 20, 1),
            100
        );

        const offset = (parsedPage - 1) * parsedLimit;

        let whereClause = `
            WHERE t.assigned_to = $1
        `;

        const params = [userId];
        let paramIndex = 2;

        if (organizationId) {
            whereClause += `
                AND w.organization_id = $${paramIndex++}
            `;

            params.push(organizationId);
        }

        if (status) {
            whereClause += `
                AND t.status = $${paramIndex++}
            `;

            params.push(status);
        }

        // ============================================
        // TOTAL
        // ============================================

        const countResult = await query(
            `
            SELECT COUNT(*)
            FROM workflow_tasks t
            INNER JOIN user_workflows w
                ON w.id = t.workflow_id
            ${whereClause}
            `,
            params
        );

        const total = parseInt(countResult.rows[0].count);

        // ============================================
        // TASKS
        // ============================================

        const result = await query(
            `
            SELECT
                t.id,
                t.workflow_id,
                t.step_index,
                t.step_name,
                t.role,
                t.duration_days,
                t.assigned_to,
                t.status,
                t.due_date,
                t.start_date,
                t.end_date,
                t.notes,
                t.attachments,
                t.created_at,
                t.updated_at,

                w.name AS project_name,
                w.description AS project_description,
                w.client AS project_client,
                w.priority AS project_priority,
                w.category AS project_category,
                w.project_head,
                w.start_date AS project_start_date,
                w.end_date AS project_end_date,

                o.name AS organization_name,

                u.name AS project_head_name,
                u.email AS project_head_email

            FROM workflow_tasks t

            INNER JOIN user_workflows w
                ON w.id = t.workflow_id

            LEFT JOIN organizations o
                ON o.id = w.organization_id

            LEFT JOIN users u
                ON u.id = w.project_head

            ${whereClause}

            ORDER BY
                t.start_date ASC NULLS LAST,
                t.due_date ASC NULLS LAST,
                t.created_at DESC

            LIMIT $${paramIndex++}
            OFFSET $${paramIndex++}
            `,
            [
                ...params,
                parsedLimit,
                offset
            ]
        );

        return res.json({
            success: true,
            data: {
                tasks: result.rows,
                pagination: {
                    total,
                    page: parsedPage,
                    limit: parsedLimit,
                    totalPages: Math.ceil(total / parsedLimit),
                    hasNext:
                        parsedPage * parsedLimit < total,
                    hasPrev:
                        parsedPage > 1
                }
            }
        });

    } catch (error) {
        console.error('Get my tasks error:', error);

        return res.status(500).json({
            success: false,
            error: 'SERVER_ERROR',
            message: 'Failed to get assigned tasks'
        });
    }
});









// ============================================
// GET SINGLE TASK DETAILS
// ============================================
router.get('/task/:taskId/details', authMiddleware, async (req, res) => {
    try {
        const { taskId } = req.params;
        const userId = req.user.id;

        // ✅ Get task with project and organization details
        const result = await query(
            `
            SELECT
                t.id,
                t.workflow_id,
                t.step_index,
                t.step_name,
                t.role,
                t.duration_days,
                t.assigned_to,
                t.status,
                t.due_date,
                t.start_date,
                t.end_date,
                t.notes,
                t.attachments,
                t.created_at,
                t.updated_at,

                w.id AS project_id,
                w.name AS project_name,
                w.description AS project_description,
                w.client AS project_client,
                w.priority AS project_priority,
                w.project_status,
                w.project_head,
                w.start_date AS project_start_date,
                w.end_date AS project_end_date,

                o.id AS organization_id,
                o.name AS organization_name,

                u.id AS assignee_id,
                u.name AS assignee_name,
                u.email AS assignee_email,

                ph.id AS project_head_id,
                ph.name AS project_head_name,
                ph.email AS project_head_email

            FROM workflow_tasks t

            INNER JOIN user_workflows w
                ON w.id = t.workflow_id

            INNER JOIN organizations o
                ON o.id = w.organization_id

            LEFT JOIN users u
                ON u.id = t.assigned_to

            LEFT JOIN users ph
                ON ph.id = w.project_head

            WHERE t.id = $1
            `,
            [taskId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'TASK_NOT_FOUND',
                message: 'Task not found'
            });
        }

        const task = result.rows[0];

        // ✅ Check if user has access
        const memberCheck = await query(
            `SELECT role FROM org_members
             WHERE organization_id = $1 AND user_id = $2 AND status = $3`,
            [task.organization_id, userId, 'active']
        );

        const isMember = memberCheck.rows.length > 0;
        const isAssigned = task.assigned_to === userId;
        const isProjectHead = task.project_head === userId;

        if (!isMember && !isAssigned && !isProjectHead) {
            return res.status(403).json({
                success: false,
                error: 'FORBIDDEN',
                message: 'You do not have access to this task'
            });
        }

        res.json({
            success: true,
            data: {
                task: {
                    id: task.id,
                    projectId: task.project_id,
                    projectName: task.project_name,
                    projectDescription: task.project_description,
                    projectClient: task.project_client,
                    projectPriority: task.project_priority,
                    projectStatus: task.project_status,
                    projectHead: {
                        id: task.project_head_id,
                        name: task.project_head_name,
                        email: task.project_head_email,
                    },
                    organization: {
                        id: task.organization_id,
                        name: task.organization_name,
                    },
                    stepIndex: task.step_index,
                    stepName: task.step_name,
                    role: task.role,
                    durationDays: task.duration_days,
                    assignedTo: {
                        id: task.assignee_id,
                        name: task.assignee_name,
                        email: task.assignee_email,
                        isYou: task.assignee_id === userId,
                    },
                    status: task.status,
                    dueDate: task.due_date,
                    startDate: task.start_date,
                    endDate: task.end_date,
                    notes: task.notes,
                    attachments: task.attachments || [],
                    createdAt: task.created_at,
                    updatedAt: task.updated_at,
                },
                userRole: {
                    isAssigned: isAssigned,
                    isProjectHead: isProjectHead,
                    isMember: isMember,
                }
            }
        });

    } catch (error) {
        console.error('Get task details error:', error);
        res.status(500).json({
            success: false,
            error: 'SERVER_ERROR',
            message: 'Failed to get task details'
        });
    }
});


 

// ============================================
// GET TASK STATS
// ============================================
router.get('/tasks/stats', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const { organizationId } = req.query;

        let orgFilter = '';
        const params = [userId];
        let paramIndex = 2;

        if (organizationId) {
            orgFilter = ` AND w.organization_id = $${paramIndex++}`;
            params.push(organizationId);
        }

        const result = await query(
            `
            SELECT
                COUNT(*) as total,
                COUNT(*) FILTER (WHERE t.status = 'pending') as pending,
                COUNT(*) FILTER (WHERE t.status = 'in_progress') as in_progress,
                COUNT(*) FILTER (WHERE t.status = 'review') as review,
                COUNT(*) FILTER (WHERE t.status = 'done') as done,
                COUNT(*) FILTER (WHERE t.status = 'blocked') as blocked,
                COUNT(*) FILTER (WHERE t.due_date < NOW() AND t.status NOT IN ('done', 'blocked')) as overdue
            FROM workflow_tasks t
            INNER JOIN user_workflows w ON w.id = t.workflow_id
            WHERE t.assigned_to = $1${orgFilter}
            `,
            params
        );

        res.json({
            success: true,
            data: {
                stats: result.rows[0],
                totals: {
                    total: parseInt(result.rows[0].total) || 0,
                    pending: parseInt(result.rows[0].pending) || 0,
                    in_progress: parseInt(result.rows[0].in_progress) || 0,
                    review: parseInt(result.rows[0].review) || 0,
                    done: parseInt(result.rows[0].done) || 0,
                    blocked: parseInt(result.rows[0].blocked) || 0,
                    overdue: parseInt(result.rows[0].overdue) || 0,
                }
            }
        });

    } catch (error) {
        console.error('Get task stats error:', error);
        res.status(500).json({
            success: false,
            error: 'SERVER_ERROR',
            message: 'Failed to get task stats'
        });
    }
});
export default router;
