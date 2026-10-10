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
      isActive,
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
      params,
    );
    const total = parseInt(countResult.rows[0].count);

    // ✅ Get paginated results
    const validSortColumns = [
      'name',
      'category',
      'estimated_days',
      'created_at',
    ];
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
      [...params, parseInt(limit), offset],
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
          hasPrev: parseInt(page) > 1,
        },
        filters: {
          category: category || null,
          search: search || null,
          minDays: minDays || null,
          maxDays: maxDays || null,
          isActive: isActive !== undefined ? isActive === 'true' : null,
        },
      },
    });
  } catch (error) {
    console.error('Get templates error:', error);
    res.status(500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: 'Failed to get workflow templates',
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
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'NOT_FOUND',
        message: 'Template not found',
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Get template error:', error);
    res.status(500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: 'Failed to get template',
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
             ORDER BY category`,
    );

    const categories = result.rows.map((row) => ({
      name: row.category,
      count: parseInt(row.count),
    }));

    res.json({
      success: true,
      data: {
        categories,
        total: categories.length,
      },
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: 'Failed to get categories',
    });
  }
});

// ============================================
// 4. CREATE PROJECT / WORKFLOW
// ============================================
router.post('/create', authMiddleware, async (req, res) => {
  let client;

  try {
    const userId = req.user.id;

    console.log(userId, 'workflow Crete User Id');

    const {
      templateId = null,
      organizationId,
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
      steps = [],
      assignedTo = {},
      stepDeadlines = {},
      stepAttachments = {},
      customFields = {},
    } = req.body;

    if (!organizationId) {
      return res.status(400).json({
        success: false,
        error: 'MISSING_ORGANIZATION',
        message: 'organizationId is required',
      });
    }

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        error: 'MISSING_PROJECT_NAME',
        message: 'Project name is required',
      });
    }

    if (!Array.isArray(steps) || steps.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'MISSING_STEPS',
        message: 'At least one workflow step is required',
      });
    }

    const validProjectStatuses = [
      'planning',
      'active',
      'review',
      'completed',
      'on-hold',
    ];

    if (!validProjectStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'INVALID_PROJECT_STATUS',
        message: 'Invalid project status',
      });
    }

    const validPriorities = ['low', 'medium', 'high'];

    if (!validPriorities.includes(priority)) {
      return res.status(400).json({
        success: false,
        error: 'INVALID_PRIORITY',
        message: 'Invalid project priority',
      });
    }

    const { pool } = await import('../config/database.js');

    client = await pool.connect();

    await client.query('BEGIN');

    const memberCheck = await client.query(
      `
            SELECT id, role
            FROM org_members
            WHERE organization_id = $1
              AND user_id = $2
              AND status = $3
            `,
      [organizationId, userId, 'active'],
    );

    if (memberCheck.rows.length === 0) {
      await client.query('ROLLBACK');

      return res.status(403).json({
        success: false,
        error: 'NOT_A_MEMBER',
        message: 'You are not a member of this organization',
      });
    }

    if (templateId) {
      const templateCheck = await client.query(
        `
                SELECT id
                FROM workflow_templates
                WHERE id = $1
                  AND is_active = true
                `,
        [templateId],
      );

      if (templateCheck.rows.length === 0) {
        await client.query('ROLLBACK');

        return res.status(404).json({
          success: false,
          error: 'TEMPLATE_NOT_FOUND',
          message: 'Template not found or inactive',
        });
      }
    }

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
      [finalProjectHead, organizationId],
    );

    if (projectHeadCheck.rows.length === 0) {
      await client.query('ROLLBACK');

      return res.status(400).json({
        success: false,
        error: 'INVALID_PROJECT_HEAD',
        message: 'Project head must be an active organization member',
      });
    }

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
        message: 'Project start date cannot be after project end date',
      });
    }

    let normalizedTags = [];

    if (Array.isArray(tags)) {
      normalizedTags = tags.map((tag) => String(tag).trim()).filter(Boolean);
    } else if (typeof tags === 'string') {
      normalizedTags = tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean);
    }

    const normalizedSteps = [];

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];

      if (!step.name || !step.name.trim()) {
        await client.query('ROLLBACK');

        return res.status(400).json({
          success: false,
          error: 'INVALID_STEP',
          message: `Step ${i + 1} name is required`,
        });
      }

      if (!step.role || !step.role.trim()) {
        await client.query('ROLLBACK');

        return res.status(400).json({
          success: false,
          error: 'INVALID_STEP',
          message: `Step ${i + 1} role is required`,
        });
      }

      const stepStartDate = step.startDate || null;
      const stepEndDate = step.endDate || null;

      if (
        stepStartDate &&
        stepEndDate &&
        new Date(stepStartDate) > new Date(stepEndDate)
      ) {
        await client.query('ROLLBACK');

        return res.status(400).json({
          success: false,
          error: 'INVALID_STEP_DATES',
          message: `Step ${i + 1} start date cannot be after end date`,
        });
      }

      if (
        projectEndDate &&
        stepEndDate &&
        new Date(stepEndDate) > new Date(projectEndDate)
      ) {
        await client.query('ROLLBACK');

        return res.status(400).json({
          success: false,
          error: 'STEP_EXCEEDS_PROJECT',
          message: `Step ${i + 1} (${step.name}) ends after project end date`,
        });
      }

      let assignees = [];

      if (Array.isArray(step.assignees)) {
        assignees = [
          ...new Set(step.assignees.filter(Boolean).map((id) => String(id))),
        ];
      }

      const legacyAssignedUser = assignedTo?.[i];

      if (assignees.length === 0 && legacyAssignedUser) {
        assignees = [String(legacyAssignedUser)];
      }

      const deadline = step.deadline || stepDeadlines?.[i] || null;

      const stepFiles = Array.isArray(step.attachments)
        ? step.attachments
        : Array.isArray(stepAttachments?.[i])
          ? stepAttachments[i]
          : [];

      normalizedSteps.push({
        name: step.name.trim(),
        role: step.role.trim(),
        days: Number(step.days) || 1,
        assignees,
        startDate: stepStartDate,
        endDate: stepEndDate,
        deadline,
        attachments: stepFiles,
      });
    }

    const allAssigneeIds = [
      ...new Set(normalizedSteps.flatMap((step) => step.assignees)),
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
        [allAssigneeIds, organizationId],
      );

      const validAssigneeIds = new Set(assigneeCheck.rows.map((row) => row.id));

      const invalidAssignees = allAssigneeIds.filter(
        (id) => !validAssigneeIds.has(id),
      );

      if (invalidAssignees.length > 0) {
        await client.query('ROLLBACK');

        return res.status(400).json({
          success: false,
          error: 'INVALID_ASSIGNEE',
          message:
            'One or more assigned users are not active members of this organization',
        });
      }
    }

    const workflowId = uuidv4();

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
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
                $11, $12, $13, $14, $15, $16, $17, $18, $19, $20
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
        'draft',
        status,
        priority,
        category || null,
        JSON.stringify(normalizedTags),
        finalProjectHead,
        projectStartDate,
        projectEndDate,
        JSON.stringify(attachments || []),
        JSON.stringify(customFields || {}),
        JSON.stringify(normalizedSteps),
        JSON.stringify(assignedTo || {}),
        userId,
      ],
    );

    for (let i = 0; i < normalizedSteps.length; i++) {
      const step = normalizedSteps[i];

      const assignedUserId = step.assignees?.[0] || null;

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
                    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11
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
          step.deadline,
          JSON.stringify(step.attachments || []),
        ],
      );
    }

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
          assignedUsers: allAssigneeIds,
        }),
      ],
    );

    await client.query('COMMIT');

    return res.status(201).json({
      success: true,
      data: {
        workflowId,
        name: name.trim(),
        projectHead: finalProjectHead,
        status,
        priority,
        taskCount: normalizedSteps.length,
        message: 'Project created successfully',
      },
    });
  } catch (error) {
    if (client) {
      try {
        await client.query('ROLLBACK');
      } catch (rollbackError) {
        console.error('Rollback error:', rollbackError);
      }
    }

    console.error('Create project error:', error);

    return res.status(500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: 'Failed to create project',
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
      search,
      filterBy = '',
    } = req.query;

    const parsedPage = Math.max(parseInt(page) || 1, 1);
    const parsedLimit = Math.min(Math.max(parseInt(limit) || 20, 1), 100);

    const offset = (parsedPage - 1) * parsedLimit;

    // ============================================
    // BUILD WORKFLOW VISIBILITY
    //
    // OWNER:
    //   - All projects in own organization
    //
    // PROJECT HEAD:
    //   - All projects where user is project head
    //
    // MEMBER:
    //   - Only projects where user has at least
    //     one assigned workflow task
    // ============================================

    let whereClause = `
            WHERE m.user_id = $1
            AND m.status = 'active'
            AND (
                EXISTS (
                    SELECT 1
                    FROM organizations org_owner
                    WHERE org_owner.id = w.organization_id
                    AND org_owner.created_by = $1
                )
                OR w.project_head = $1
                OR EXISTS (
                    SELECT 1
                    FROM workflow_tasks wt
                    WHERE wt.workflow_id = w.id
                    AND wt.assigned_to = $1
                )
            )
        `;

    const params = [userId];
    let paramIndex = 2;

    // ============================================
    // OPTIONAL FILTERS
    // ============================================

    if (filterBy === 'owned') {
      whereClause += `
            AND EXISTS (
                SELECT 1
                FROM organizations org_owner
                WHERE org_owner.id = w.organization_id
                AND org_owner.created_by = $1
            )
        `;
    } else if (filterBy === 'assigned') {
      whereClause += `
            AND EXISTS (
                SELECT 1
                FROM workflow_tasks wt
                WHERE wt.workflow_id = w.id
                AND wt.assigned_to = $1
            )
        `;
    }

    if (organizationId) {
      whereClause += ` AND w.organization_id = $${paramIndex++}`;
      params.push(organizationId);
    }

    if (status) {
      whereClause += ` AND w.project_status = $${paramIndex++}`;
      params.push(status);
    }

    if (search) {
      whereClause += ` AND w.name ILIKE $${paramIndex++}`;
      params.push(`%${search}%`);
    }

    // ============================================
    // GET TOTAL COUNT
    // ============================================

    const countResult = await query(
      `SELECT COUNT(*)
             FROM user_workflows w
             INNER JOIN org_members m
                ON m.organization_id = w.organization_id
                AND m.user_id = $1
             ${whereClause}`,
      params,
    );

    const total = parseInt(countResult.rows[0].count);

    // ============================================
    // SORT
    // ============================================

    const validSortColumns = [
      'name',
      'status',
      'progress',
      'created_at',
      'updated_at',
      'start_date',
    ];

    const sortColumn = validSortColumns.includes(sortBy)
      ? sortBy
      : 'created_at';

    const order = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    // ============================================
    // GET WORKFLOWS
    // ============================================

    const result = await query(
      `SELECT
                w.id,
                w.name,
                w.description,
                w.client,
                w.goal,
                w.status,
                w.project_status,
                w.priority,
                w.category,
                w.tags,
                w.project_head,
                w.start_date,
                w.end_date,
                w.progress,
                w.attachments,
                w.created_at,
                w.updated_at,
                w.organization_id,
                w.created_by,

                t.name AS template_name,
                t.icon AS template_icon,
                t.category AS template_category,

                o.name AS organization_name,
                o.slug AS organization_slug,
                o.created_by AS org_owner_id,

                m.role AS user_role,
                m.joined_at AS user_joined_at,

                CASE
                    WHEN o.created_by = $1 THEN true
                    ELSE false
                END AS is_owner_org,

                ph.id AS project_head_id,
                ph.name AS project_head_name,
                ph.email AS project_head_email,

                cu.id AS created_by_id,
                cu.name AS created_by_name,

                -- ============================================
                -- TOTAL TASKS
                -- ============================================
                (SELECT COUNT(*)::INTEGER
                 FROM workflow_tasks wt
                 WHERE wt.workflow_id = w.id) AS total_tasks,

                -- ============================================
                -- DONE TASKS
                -- ============================================
                (SELECT COUNT(*)::INTEGER
                 FROM workflow_tasks wt
                 WHERE wt.workflow_id = w.id
                 AND wt.status = 'done') AS done_tasks,

                -- ============================================
                -- IN PROGRESS TASKS
                -- ============================================
                (SELECT COUNT(*)::INTEGER
                 FROM workflow_tasks wt
                 WHERE wt.workflow_id = w.id
                 AND wt.status = 'in_progress') AS in_progress_tasks,

                -- ============================================
                -- PENDING TASKS
                -- ============================================
                (SELECT COUNT(*)::INTEGER
                 FROM workflow_tasks wt
                 WHERE wt.workflow_id = w.id
                 AND wt.status = 'pending') AS pending_tasks,

                -- ============================================
                -- REVIEW TASKS
                -- ============================================
                (SELECT COUNT(*)::INTEGER
                 FROM workflow_tasks wt
                 WHERE wt.workflow_id = w.id
                 AND wt.status = 'review') AS review_tasks,

                -- ============================================
                -- BLOCKED TASKS
                -- ============================================
                (SELECT COUNT(*)::INTEGER
                 FROM workflow_tasks wt
                 WHERE wt.workflow_id = w.id
                 AND wt.status = 'blocked') AS blocked_tasks,

                -- ============================================
                -- OVERDUE TASKS
                -- ============================================
                (SELECT COUNT(*)::INTEGER
                 FROM workflow_tasks wt
                 WHERE wt.workflow_id = w.id
                 AND wt.status NOT IN ('done', 'blocked')
                 AND (
                    (wt.end_date IS NOT NULL AND wt.end_date < CURRENT_DATE)
                    OR
                    (wt.due_date IS NOT NULL AND wt.due_date < NOW())
                 )) AS overdue_tasks,

                -- ============================================
                -- MY ASSIGNED TASKS
                -- ============================================
                (SELECT COUNT(*)::INTEGER
                 FROM workflow_tasks wt
                 WHERE wt.workflow_id = w.id
                 AND wt.assigned_to = $1) AS my_assigned_tasks,

                -- ============================================
                -- MY DONE TASKS
                -- ============================================
                (SELECT COUNT(*)::INTEGER
                 FROM workflow_tasks wt
                 WHERE wt.workflow_id = w.id
                 AND wt.assigned_to = $1
                 AND wt.status = 'done') AS my_done_tasks,

                -- ============================================
                -- MY IN PROGRESS TASKS
                -- ============================================
                (SELECT COUNT(*)::INTEGER
                 FROM workflow_tasks wt
                 WHERE wt.workflow_id = w.id
                 AND wt.assigned_to = $1
                 AND wt.status = 'in_progress') AS my_in_progress_tasks,

                -- ============================================
                -- MY PENDING TASKS
                -- ============================================
                (SELECT COUNT(*)::INTEGER
                 FROM workflow_tasks wt
                 WHERE wt.workflow_id = w.id
                 AND wt.assigned_to = $1
                 AND wt.status = 'pending') AS my_pending_tasks,

                -- ============================================
                -- MY OVERDUE TASKS
                -- ============================================
                (SELECT COUNT(*)::INTEGER
                 FROM workflow_tasks wt
                 WHERE wt.workflow_id = w.id
                 AND wt.assigned_to = $1
                 AND wt.status NOT IN ('done', 'blocked')
                 AND (
                    (wt.end_date IS NOT NULL AND wt.end_date < CURRENT_DATE)
                    OR
                    (wt.due_date IS NOT NULL AND wt.due_date < NOW())
                 )) AS my_overdue_tasks

             FROM user_workflows w

             INNER JOIN org_members m
                ON m.organization_id = w.organization_id
                AND m.user_id = $1

             LEFT JOIN workflow_templates t
                ON w.template_id = t.id

             LEFT JOIN organizations o
                ON w.organization_id = o.id

             LEFT JOIN users ph
                ON ph.id = w.project_head

             LEFT JOIN users cu
                ON cu.id = w.created_by

             ${whereClause}

             ORDER BY w.${sortColumn} ${order}

             LIMIT $${paramIndex++}
             OFFSET $${paramIndex++}`,
      [...params, parsedLimit, offset],
    );

    // ============================================
    // RESPONSE
    // ============================================

    res.json({
      success: true,
      data: {
        workflows: result.rows,

        pagination: {
          total,
          page: parsedPage,
          limit: parsedLimit,
          totalPages: Math.ceil(total / parsedLimit),
          hasNext: parsedPage * parsedLimit < total,
          hasPrev: parsedPage > 1,
        },
      },
    });
  } catch (error) {
    console.error('Get user workflows error:', error);

    res.status(500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: 'Failed to get workflows',
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

    // ============================================
    // CHECK WORKFLOW ACCESS
    //
    // OWNER:
    //   Full access
    //
    // PROJECT HEAD:
    //   Full access
    //
    // MEMBER:
    //   Access only when at least one task is
    //   assigned to the logged-in user
    // ============================================

    const check = await query(
      `
      SELECT
        w.*,
        o.created_by AS organization_owner_id,

        EXISTS (
          SELECT 1
          FROM workflow_tasks wt
          WHERE wt.workflow_id = w.id
            AND wt.assigned_to = $2
        ) AS has_assigned_task

      FROM user_workflows w

      INNER JOIN organizations o
        ON o.id = w.organization_id

      INNER JOIN org_members m
        ON m.organization_id = w.organization_id

      WHERE w.id = $1
        AND m.user_id = $2
        AND m.status = 'active'
      `,
      [workflowId, userId],
    );

    // ============================================
    // USER NOT MEMBER / WORKFLOW NOT FOUND
    // ============================================

    if (check.rows.length === 0) {
      return res.status(403).json({
        success: false,
        error: 'FORBIDDEN',
        message: 'You do not have access to this workflow',
      });
    }

    const workflowAccess = check.rows[0];

    // ============================================
    // OWNER CHECK
    // ============================================

    const isOrganizationOwner = workflowAccess.organization_owner_id === userId;

    // ============================================
    // PROJECT HEAD CHECK
    // ============================================

    const isProjectHead = workflowAccess.project_head === userId;

    // ============================================
    // ASSIGNED MEMBER CHECK
    // ============================================

    const isAssignedMember = workflowAccess.has_assigned_task;

    // ============================================
    // FINAL ACCESS
    // ============================================

    const hasWorkflowAccess =
      isOrganizationOwner || isProjectHead || isAssignedMember;

    if (!hasWorkflowAccess) {
      return res.status(403).json({
        success: false,
        error: 'FORBIDDEN',
        message: 'You do not have access to this workflow',
      });
    }

    // ============================================
    // GET WORKFLOW DETAILS
    // ============================================

    const workflowResult = await query(
      `
      SELECT
        w.*,
        t.name AS template_name,
        t.icon AS template_icon,
        o.name AS organization_name,
        u.name AS created_by_name

      FROM user_workflows w

      LEFT JOIN workflow_templates t
        ON w.template_id = t.id

      LEFT JOIN organizations o
        ON w.organization_id = o.id

      LEFT JOIN users u
        ON w.created_by = u.id

      WHERE w.id = $1
      `,
      [workflowId],
    );

    // ============================================
    // GET TASKS
    //
    // OWNER / PROJECT HEAD
    // → ALL TASKS
    //
    // MEMBER
    // → ONLY ASSIGNED TASKS
    // ============================================

    let tasksResult;

    if (isOrganizationOwner || isProjectHead) {
      // ============================================
      // OWNER / PROJECT HEAD
      // → ALL WORKFLOW STEPS
      // ============================================

      tasksResult = await query(
        `
        SELECT
          t.*,
          u.name AS assignee_name,
          u.email AS assignee_email,

          (
            SELECT COUNT(*)::INTEGER
            FROM workflow_comments c
            WHERE c.task_id = t.id
          ) AS comment_count

        FROM workflow_tasks t

        LEFT JOIN users u
          ON t.assigned_to = u.id

        WHERE t.workflow_id = $1

        ORDER BY t.step_index
        `,
        [workflowId],
      );
    } else {
      // ============================================
      // MEMBER
      // → ONLY LOGGED-IN USER'S ASSIGNED STEPS
      // ============================================

      tasksResult = await query(
        `
        SELECT
          t.*,
          u.name AS assignee_name,
          u.email AS assignee_email,

          (
            SELECT COUNT(*)::INTEGER
            FROM workflow_comments c
            WHERE c.task_id = t.id
          ) AS comment_count

        FROM workflow_tasks t

        LEFT JOIN users u
          ON t.assigned_to = u.id

        WHERE t.workflow_id = $1
          AND t.assigned_to = $2

        ORDER BY t.step_index
        `,
        [workflowId, userId],
      );
    }

    // ============================================
    // RESPONSE
    // ============================================

    return res.json({
      success: true,
      data: {
        workflow: workflowResult.rows[0],
        tasks: tasksResult.rows,
      },
    });
  } catch (error) {
    console.error('Get workflow details error:', error);

    return res.status(500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: 'Failed to get workflow details',
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

    const check = await query(`SELECT * FROM user_workflows WHERE id = $1`, [
      workflowId,
    ]);

    if (check.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'NOT_FOUND',
        message: 'Workflow not found',
      });
    }

    const workflow = check.rows[0];

    const memberCheck = await query(
      `SELECT role FROM org_members
             WHERE organization_id = $1 AND user_id = $2 AND status = $3`,
      [workflow.organization_id, userId, 'active'],
    );

    // ✅ CHANGE 2: Sirf owner
    const isOwner =
      memberCheck.rows.length > 0 && memberCheck.rows[0].role === 'owner';

    if (workflow.created_by !== userId && !isOwner) {
      return res.status(403).json({
        success: false,
        error: 'FORBIDDEN',
        message: 'You do not have permission to update this workflow',
      });
    }

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
        message: 'No fields to update',
      });
    }

    updates.push(`updated_at = NOW()`);
    params.push(workflowId);

    await query(
      `UPDATE user_workflows SET ${updates.join(', ')} WHERE id = $${paramIndex}`,
      params,
    );

    if (assigned_to) {
      for (const [stepIndex, userId] of Object.entries(assigned_to)) {
        await query(
          `UPDATE workflow_tasks
                     SET assigned_to = $1, updated_at = NOW()
                     WHERE workflow_id = $2 AND step_index = $3`,
          [userId, workflowId, parseInt(stepIndex)],
        );
      }
    }

    res.json({
      success: true,
      message: 'Workflow updated successfully',
    });
  } catch (error) {
    console.error('Update workflow error:', error);
    res.status(500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: 'Failed to update workflow',
    });
  }
});

// ============================================
// UPDATE TASK STATUS + REMARK
// ============================================

router.patch('/task/:taskId', authMiddleware, async (req, res) => {
  try {
    const { taskId } = req.params;
    const userId = req.user.id;
    const { status, notes } = req.body;

    // ============================================
    // 1. VALIDATE STATUS
    // ============================================

    const validStatuses = [
      'pending',
      'in_progress',
      'review',
      'done',
      'blocked',
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'INVALID_STATUS',
        message: 'Please select a valid task status',
      });
    }

    // ============================================
    // 2. VALIDATE REMARK
    // ============================================

    if (
      notes !== undefined &&
      notes !== null &&
      typeof notes !== 'string'
    ) {
      return res.status(400).json({
        success: false,
        error: 'INVALID_REMARK',
        message: 'Remark must be a string',
      });
    }

    const normalizedNotes =
      typeof notes === 'string'
        ? notes.trim()
        : null;

    if (
      normalizedNotes !== null &&
      normalizedNotes.length > 2000
    ) {
      return res.status(400).json({
        success: false,
        error: 'REMARK_TOO_LONG',
        message: 'Remark cannot exceed 2000 characters',
      });
    }

    // ============================================
    // 3. BLOCKED STATUS REQUIRES A REASON
    // ============================================

    if (
      status === 'blocked' &&
      !normalizedNotes
    ) {
      return res.status(400).json({
        success: false,
        error: 'BLOCK_REASON_REQUIRED',
        message: 'Please explain why this task is blocked',
      });
    }

    // ============================================
    // 4. FETCH TASK AND PROJECT
    // ============================================

    const taskCheck = await query(
      `
      SELECT
        t.*,
        w.organization_id,
        w.project_head,
        o.created_by AS organization_owner_id

      FROM workflow_tasks t

      INNER JOIN user_workflows w
        ON w.id = t.workflow_id

      INNER JOIN organizations o
        ON o.id = w.organization_id

      WHERE t.id = $1
      `,
      [taskId],
    );

    if (taskCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'TASK_NOT_FOUND',
        message: 'Task not found',
      });
    }

    const task = taskCheck.rows[0];

    // ============================================
    // 5. CHECK ACTIVE ORGANIZATION MEMBERSHIP
    // ============================================

    const memberCheck = await query(
      `
      SELECT id
      FROM org_members

      WHERE organization_id = $1
        AND user_id = $2
        AND status = 'active'
      `,
      [task.organization_id, userId],
    );

    if (memberCheck.rows.length === 0) {
      return res.status(403).json({
        success: false,
        error: 'FORBIDDEN',
        message: 'You are not an active member of this organization',
      });
    }

    // ============================================
    // 6. CHECK PERMISSIONS
    //
    // ASSIGNED MEMBER:
    //   Can update assigned task
    //
    // ORGANIZATION OWNER:
    //   Can update any task in own organization
    //
    // PROJECT HEAD:
    //   Can update tasks in their project
    // ============================================

    const isOrganizationOwner =
      task.organization_owner_id === userId;

    const isProjectHead =
      task.project_head === userId;

    const isAssigned =
      task.assigned_to === userId;

    if (
      !isAssigned &&
      !isOrganizationOwner &&
      !isProjectHead
    ) {
      return res.status(403).json({
        success: false,
        error: 'FORBIDDEN',
        message: 'You do not have permission to update this task',
      });
    }

    // ============================================
    // 7. UPDATE STATUS AND REMARK
    //
    // If notes is omitted/null:
    //   Keep existing remark
    //
    // If notes is a string:
    //   Save the supplied remark
    // ============================================

    const result = await query(
      `
      UPDATE workflow_tasks

      SET
        status = $1,

        notes = CASE
          WHEN $2::text IS NULL THEN notes
          ELSE $2
        END,

        started_at = CASE
          WHEN $1 = 'in_progress'
            AND started_at IS NULL
          THEN NOW()
          ELSE started_at
        END,

        completed_at = CASE
          WHEN $1 = 'done'
          THEN COALESCE(completed_at, NOW())
          WHEN $1 <> 'done'
          THEN NULL
          ELSE completed_at
        END,

        updated_at = NOW()

      WHERE id = $3

      RETURNING *
      `,
      [
        status,
        normalizedNotes,
        taskId,
      ],
    );

    const updatedTask = result.rows[0];

    // ============================================
    // 8. LOG STATUS CHANGE
    // ============================================

    try {
      await query(
        `
        INSERT INTO workflow_activity_log
        (
          id,
          workflow_id,
          user_id,
          action,
          details
        )

        VALUES ($1, $2, $3, $4, $5)
        `,
        [
          uuidv4(),
          task.workflow_id,
          userId,
          'task_status_updated',
          JSON.stringify({
            taskId,
            taskName: task.step_name,
            previousStatus: task.status,
            newStatus: status,
            remark: normalizedNotes,
            message: 'Task status updated',
          }),
        ],
      );
    } catch (activityError) {
      console.error(
        'Task status activity log error:',
        activityError,
      );
    }

    // ============================================
    // 9. RESPONSE
    // ============================================

    return res.json({
      success: true,
      data: updatedTask,
      message: 'Task status updated successfully',
    });
  } catch (error) {
    console.error(
      'Update task status error:',
      error,
    );

    return res.status(500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: 'Failed to update task status',
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

    const check = await query(
      `SELECT w.* FROM user_workflows w
             JOIN org_members m ON m.organization_id = w.organization_id
             WHERE w.id = $1 AND m.user_id = $2 AND m.status = $3`,
      [workflowId, userId, 'active'],
    );

    if (check.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'NOT_FOUND',
        message: 'Workflow not found or you do not have access',
      });
    }

    const workflow = check.rows[0];

    const memberCheck = await query(
      `SELECT role FROM org_members
             WHERE organization_id = $1 AND user_id = $2 AND status = $3`,
      [workflow.organization_id, userId, 'active'],
    );

    // ✅ CHANGE 4: Sirf owner
    const isOwner =
      memberCheck.rows.length > 0 && memberCheck.rows[0].role === 'owner';

    if (workflow.created_by !== userId && !isOwner) {
      return res.status(403).json({
        success: false,
        error: 'FORBIDDEN',
        message: 'You do not have permission to delete this workflow',
      });
    }

    await query('DELETE FROM user_workflows WHERE id = $1', [workflowId]);

    res.json({
      success: true,
      message: 'Workflow deleted successfully',
    });
  } catch (error) {
    console.error('Delete workflow error:', error);
    res.status(500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: 'Failed to delete workflow',
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
      params,
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
        avg_progress: Math.round(stats.avg_progress || 0),
      },
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: 'Failed to get stats',
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
      [...params, parseInt(limit)],
    );

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Get recent workflows error:', error);
    res.status(500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: 'Failed to get recent workflows',
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

    const result = await query(`SELECT * FROM user_workflows WHERE id = $1`, [
      workflowId,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'NOT_FOUND',
        message: 'Workflow not found',
      });
    }

    const existing = result.rows[0];
    const newId = uuidv4();
    const newName = name || `${existing.name} (Copy)`;

    await query(
      `INSERT INTO user_workflows
             (id, template_id, organization_id, name, steps, created_by, status, assigned_to)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        newId,
        existing.template_id,
        existing.organization_id,
        newName,
        existing.steps,
        userId,
        'draft',
        existing.assigned_to,
      ],
    );

    const tasks = await query(
      `SELECT * FROM workflow_tasks WHERE workflow_id = $1`,
      [workflowId],
    );

    for (const task of tasks.rows) {
      await query(
        `INSERT INTO workflow_tasks
                 (workflow_id, step_index, step_name, assigned_to, status, notes)
                 VALUES ($1, $2, $3, $4, $5, $6)`,
        [newId, task.step_index, task.step_name, null, 'pending', null],
      );
    }

    res.status(201).json({
      success: true,
      data: {
        workflowId: newId,
        name: newName,
        message: 'Workflow duplicated successfully',
      },
    });
  } catch (error) {
    console.error('Duplicate workflow error:', error);
    res.status(500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: 'Failed to duplicate workflow',
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
      workflowId,
      page = 1,
      limit = 20,
    } = req.query;

    const parsedPage = Math.max(parseInt(page) || 1, 1);
    const parsedLimit = Math.min(Math.max(parseInt(limit) || 20, 1), 100);

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

    if (workflowId) {
      whereClause += `
                AND t.workflow_id = $${paramIndex++}
            `;

      params.push(workflowId);
    }

    if (status) {
      whereClause += `
                AND t.status = $${paramIndex++}
            `;

      params.push(status);
    }

    const countResult = await query(
      `
            SELECT COUNT(*)
            FROM workflow_tasks t
            INNER JOIN user_workflows w
                ON w.id = t.workflow_id
            ${whereClause}
            `,
      params,
    );

    const total = parseInt(countResult.rows[0].count);

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
      [...params, parsedLimit, offset],
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
          hasNext: parsedPage * parsedLimit < total,
          hasPrev: parsedPage > 1,
        },
      },
    });
  } catch (error) {
    console.error('Get my tasks error:', error);

    return res.status(500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: 'Failed to get assigned tasks',
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
      [taskId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'TASK_NOT_FOUND',
        message: 'Task not found',
      });
    }

    const task = result.rows[0];

    const memberCheck = await query(
      `SELECT role FROM org_members
             WHERE organization_id = $1 AND user_id = $2 AND status = $3`,
      [task.organization_id, userId, 'active'],
    );

    const userRoleInOrg = memberCheck.rows[0]?.role || null;
    const isMember = memberCheck.rows.length > 0;
    const isAssigned = task.assigned_to === userId;
    const isProjectHead = task.project_head === userId;

    // ✅ CHANGE 5: Sirf owner
    const isOwner = userRoleInOrg && userRoleInOrg === 'owner';

    if (!isMember && !isAssigned && !isProjectHead) {
      return res.status(403).json({
        success: false,
        error: 'FORBIDDEN',
        message: 'You do not have access to this task',
      });
    }

    const canEdit = isOwner || isProjectHead;
    const canUpdateStatus = canEdit || isAssigned;

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
        permissions: {
          userRole: userRoleInOrg,
          canEdit: canEdit,
          canUpdateStatus: canUpdateStatus,
          isAssigned: isAssigned,
          isProjectHead: isProjectHead,
          isMember: isMember,
          isOwner: isOwner,
        },
      },
    });
  } catch (error) {
    console.error('Get task details error:', error);
    res.status(500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: 'Failed to get task details',
    });
  }
});

// ============================================
// GET TASK STATS
// ============================================
router.get('/tasks/stats', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { organizationId, workflowId } = req.query;

    let filter = '';
    const params = [userId];
    let paramIndex = 2;

    if (organizationId) {
      filter += ` AND w.organization_id = $${paramIndex++}`;
      params.push(organizationId);
    }

    if (workflowId) {
      filter += ` AND w.id = $${paramIndex++}`;
      params.push(workflowId);
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
                COUNT(*) FILTER (WHERE
                    t.status NOT IN ('done', 'blocked')
                    AND (
                        (t.end_date IS NOT NULL AND t.end_date < CURRENT_DATE)
                        OR (t.due_date IS NOT NULL AND t.due_date < NOW())
                    )
                ) as overdue
            FROM workflow_tasks t
            INNER JOIN user_workflows w ON w.id = t.workflow_id
            WHERE t.assigned_to = $1${filter}
            `,
      params,
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
        },
      },
    });
  } catch (error) {
    console.error('Get task stats error:', error);
    res.status(500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: 'Failed to get task stats',
    });
  }
});

// ============================================
// 16. UPDATE TASK (Full Edit) 🆕
// ============================================
router.put('/task/:taskId', authMiddleware, async (req, res) => {
  try {
    const { taskId } = req.params;
    const userId = req.user.id;

    const {
      stepName,
      role,
      durationDays,
      startDate,
      endDate,
      description,
      attachments,
    } = req.body;

    const taskCheck = await query(
      `SELECT t.*, w.organization_id, w.project_head, w.created_by, w.id AS workflow_id
             FROM workflow_tasks t
             JOIN user_workflows w ON t.workflow_id = w.id
             WHERE t.id = $1`,
      [taskId],
    );

    if (taskCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'TASK_NOT_FOUND',
        message: 'Task not found',
      });
    }

    const task = taskCheck.rows[0];

    const memberCheck = await query(
      `SELECT role FROM org_members
             WHERE organization_id = $1 AND user_id = $2 AND status = $3`,
      [task.organization_id, userId, 'active'],
    );

    const isOwner =
      memberCheck.rows.length > 0 && memberCheck.rows[0].role === 'owner';
    const isProjectHead = task.project_head === userId;
    const isCreatedBy = task.created_by === userId;

    if (!isOwner && !isProjectHead && !isCreatedBy) {
      return res.status(403).json({
        success: false,
        error: 'FORBIDDEN',
        message: 'You do not have permission to edit this task',
      });
    }

    const updates = [];
    const params = [];
    let paramIndex = 1;

    if (stepName !== undefined) {
      updates.push(`step_name = $${paramIndex++}`);
      params.push(stepName);
    }
    if (role !== undefined) {
      updates.push(`role = $${paramIndex++}`);
      params.push(role);
    }
    if (durationDays !== undefined) {
      updates.push(`duration_days = $${paramIndex++}`);
      params.push(durationDays);
    }
    if (startDate !== undefined) {
      updates.push(`start_date = $${paramIndex++}`);
      params.push(startDate);
    }
    if (endDate !== undefined) {
      updates.push(`end_date = $${paramIndex++}`);
      params.push(endDate);
    }
    if (attachments !== undefined) {
      updates.push(`attachments = $${paramIndex++}`);
      params.push(JSON.stringify(attachments));
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'NO_FIELDS',
        message: 'No fields to update',
      });
    }

    updates.push(`updated_at = NOW()`);
    params.push(taskId);

    const result = await query(
      `UPDATE workflow_tasks
             SET ${updates.join(', ')}
             WHERE id = $${paramIndex}
             RETURNING *`,
      params,
    );

    if (description !== undefined) {
      await query(
        `UPDATE user_workflows
                 SET description = $1, updated_at = NOW()
                 WHERE id = $2`,
        [description, task.workflow_id],
      );
    }

    await query(
      `INSERT INTO workflow_activity_log (id, workflow_id, user_id, action, details)
             VALUES ($1, $2, $3, $4, $5)`,
      [
        uuidv4(),
        task.workflow_id,
        userId,
        'task_updated',
        JSON.stringify({
          taskId,
          taskName: stepName || task.step_name,
          message: 'Task details updated',
        }),
      ],
    );

    res.json({
      success: true,
      data: result.rows[0],
      message: 'Task updated successfully',
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: 'Failed to update task',
    });
  }
});

// ============================================
// 17. GET TASK COMMENTS 🆕
// ============================================
// ============================================
// 17. GET TASK COMMENTS
// ============================================
router.get('/task/:taskId/comments', authMiddleware, async (req, res) => {
  try {
    const { taskId } = req.params;
    const userId = req.user.id;

    const taskCheck = await query(
      `
      SELECT
        t.id,
        t.assigned_to,
        w.organization_id,
        w.project_head,
        o.created_by AS organization_owner_id
      FROM workflow_tasks t
      INNER JOIN user_workflows w
        ON t.workflow_id = w.id
      INNER JOIN organizations o
        ON o.id = w.organization_id
      WHERE t.id = $1
      `,
      [taskId],
    );

    if (taskCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'TASK_NOT_FOUND',
        message: 'Task not found',
      });
    }

    const task = taskCheck.rows[0];

    const memberCheck = await query(
      `
      SELECT role
      FROM org_members
      WHERE organization_id = $1
        AND user_id = $2
        AND status = 'active'
      `,
      [task.organization_id, userId],
    );

    if (memberCheck.rows.length === 0) {
      return res.status(403).json({
        success: false,
        error: 'FORBIDDEN',
        message: 'You do not have access to these comments',
      });
    }

    const isOwner = task.organization_owner_id === userId;

    const isProjectHead = task.project_head === userId;

    const isAssigned = task.assigned_to === userId;

    if (!isOwner && !isProjectHead && !isAssigned) {
      return res.status(403).json({
        success: false,
        error: 'FORBIDDEN',
        message: 'You do not have access to these comments',
      });
    }

    const result = await query(
      `
      SELECT
        c.id,
        c.task_id,
        c.comment,
        c.user_id,
        c.parent_id,
        c.created_at,
        c.updated_at,
        u.name AS user_name,
        u.email AS user_email
      FROM workflow_comments c
      LEFT JOIN users u
        ON u.id = c.user_id
      WHERE c.task_id = $1
      ORDER BY c.created_at ASC
      `,
      [taskId],
    );

    return res.json({
      success: true,
      data: {
        comments: result.rows,
        total: result.rows.length,
      },
    });
  } catch (error) {
    console.error('Get comments error:', error);

    return res.status(500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: 'Failed to get comments',
    });
  }
});

// ============================================
// 18. ADD TASK COMMENT 🆕
// ============================================
// ============================================
// 18. ADD TASK COMMENT / REPLY
// ============================================
router.post('/task/:taskId/comments', authMiddleware, async (req, res) => {
  try {
    const { taskId } = req.params;
    const userId = req.user.id;

    const { comment, parentId = null } = req.body;

    if (!comment || !comment.trim()) {
      return res.status(400).json({
        success: false,
        error: 'MISSING_COMMENT',
        message: 'Comment text is required',
      });
    }

    const taskCheck = await query(
      `
      SELECT
        t.id,
        t.assigned_to,
        t.workflow_id,
        w.organization_id,
        w.project_head,
        o.created_by AS organization_owner_id
      FROM workflow_tasks t
      INNER JOIN user_workflows w
        ON t.workflow_id = w.id
      INNER JOIN organizations o
        ON o.id = w.organization_id
      WHERE t.id = $1
      `,
      [taskId],
    );

    if (taskCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'TASK_NOT_FOUND',
        message: 'Task not found',
      });
    }

    const task = taskCheck.rows[0];

    const memberCheck = await query(
      `
      SELECT role
      FROM org_members
      WHERE organization_id = $1
        AND user_id = $2
        AND status = 'active'
      `,
      [task.organization_id, userId],
    );

    if (memberCheck.rows.length === 0) {
      return res.status(403).json({
        success: false,
        error: 'FORBIDDEN',
        message: 'You do not have access to comment',
      });
    }

    const isOwner = task.organization_owner_id === userId;

    const isProjectHead = task.project_head === userId;

    const isAssigned = task.assigned_to === userId;

    if (!isOwner && !isProjectHead && !isAssigned) {
      return res.status(403).json({
        success: false,
        error: 'FORBIDDEN',
        message: 'You do not have permission to comment',
      });
    }

    // ============================================
    // VALIDATE REPLY PARENT
    // ============================================
    if (parentId) {
      const parentCheck = await query(
        `
        SELECT id
        FROM workflow_comments
        WHERE id = $1
          AND task_id = $2
        `,
        [parentId, taskId],
      );

      if (parentCheck.rows.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'INVALID_PARENT',
          message: 'Reply target comment not found',
        });
      }
    }

    const commentId = uuidv4();

    await query(
      `
      INSERT INTO workflow_comments
      (
        id,
        task_id,
        user_id,
        comment,
        parent_id
      )
      VALUES ($1, $2, $3, $4, $5)
      `,
      [commentId, taskId, userId, comment.trim(), parentId],
    );

    await query(
      `
      INSERT INTO workflow_activity_log
      (
        id,
        workflow_id,
        user_id,
        action,
        details
      )
      VALUES ($1, $2, $3, $4, $5)
      `,
      [
        uuidv4(),
        task.workflow_id,
        userId,
        parentId ? 'comment_reply_added' : 'comment_added',
        JSON.stringify({
          taskId,
          parentId,
          comment: comment.trim(),
          message: parentId ? 'Comment reply added' : 'Comment added',
        }),
      ],
    );

    const result = await query(
      `
      SELECT
        c.id,
        c.task_id,
        c.comment,
        c.user_id,
        c.parent_id,
        c.created_at,
        c.updated_at,
        u.name AS user_name,
        u.email AS user_email
      FROM workflow_comments c
      LEFT JOIN users u
        ON u.id = c.user_id
      WHERE c.id = $1
      `,
      [commentId],
    );

    return res.status(201).json({
      success: true,
      data: result.rows[0],
      message: parentId
        ? 'Reply added successfully'
        : 'Comment added successfully',
    });
  } catch (error) {
    console.error('Add comment error:', error);

    return res.status(500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: 'Failed to add comment',
    });
  }
});

// ============================================
// 19. GET TASK ACTIVITY LOG 🆕
// ============================================
router.get('/task/:taskId/activity', authMiddleware, async (req, res) => {
  try {
    const { taskId } = req.params;

    const taskCheck = await query(
      `SELECT workflow_id FROM workflow_tasks WHERE id = $1`,
      [taskId],
    );

    if (taskCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'TASK_NOT_FOUND',
        message: 'Task not found',
      });
    }

    const workflowId = taskCheck.rows[0].workflow_id;

    const result = await query(
      `SELECT
                a.id,
                a.action,
                a.details,
                a.created_at,
                a.user_id,
                u.name AS user_name,
                u.email AS user_email
             FROM workflow_activity_log a
             LEFT JOIN users u ON u.id = a.user_id
             WHERE a.workflow_id = $1
             ORDER BY a.created_at DESC
             LIMIT 50`,
      [workflowId],
    );

    const activity = result.rows.map((row) => {
      let details = row.details || {};
      if (typeof details === 'string') {
        try {
          details = JSON.parse(details);
        } catch {
          details = {};
        }
      }

      return {
        id: row.id,
        action: row.action,
        details: details.message || row.action,
        user_id: row.user_id,
        user_name: row.user_name,
        user_email: row.user_email,
        created_at: row.created_at,
      };
    });

    res.json({
      success: true,
      data: {
        activity,
        total: activity.length,
      },
    });
  } catch (error) {
    console.error('Get activity error:', error);
    res.status(500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: 'Failed to get activity',
    });
  }
});

// ============================================
// 20. GET WORKFLOW MEMBERS (Project-specific)
// ============================================
router.get('/:workflowId/members', authMiddleware, async (req, res) => {
  try {
    const { workflowId } = req.params;
    const userId = req.user.id;

    // ✅ Check access
    const check = await query(
      `SELECT w.id, w.organization_id, w.project_head
       FROM user_workflows w
       JOIN org_members m ON m.organization_id = w.organization_id
       WHERE w.id = $1 AND m.user_id = $2 AND m.status = 'active'`,
      [workflowId, userId],
    );

    if (check.rows.length === 0) {
      return res.status(403).json({
        success: false,
        error: 'FORBIDDEN',
        message: 'You do not have access to this workflow',
      });
    }

    const workflow = check.rows[0];

    // ✅ Get unique members assigned to this workflow's tasks
    const result = await query(
      `SELECT
         u.id,
         u.name,
         u.email,
         m.role AS org_role,
         CASE WHEN u.id = $2 THEN true ELSE false END AS is_project_head,
         (SELECT COUNT(*)::INTEGER
          FROM workflow_tasks wt
          WHERE wt.workflow_id = $1
          AND wt.assigned_to = u.id) AS assigned_tasks,
         (SELECT COUNT(*)::INTEGER
          FROM workflow_tasks wt
          WHERE wt.workflow_id = $1
          AND wt.assigned_to = u.id
          AND wt.status = 'done') AS completed_tasks
       FROM users u
       INNER JOIN org_members m
         ON m.user_id = u.id
         AND m.organization_id = $3
       WHERE u.id IN (
         SELECT DISTINCT assigned_to
         FROM workflow_tasks
         WHERE workflow_id = $1
         AND assigned_to IS NOT NULL
         UNION
         SELECT $2
       )
       ORDER BY is_project_head DESC, assigned_tasks DESC`,
      [workflowId, workflow.project_head, workflow.organization_id],
    );

    res.json({
      success: true,
      data: {
        members: result.rows,
        total: result.rows.length,
      },
    });
  } catch (error) {
    console.error('Get workflow members error:', error);
    res.status(500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: 'Failed to get workflow members',
    });
  }
});
export default router;
