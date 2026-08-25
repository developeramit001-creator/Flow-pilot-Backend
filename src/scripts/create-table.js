// src/scripts/create-table.js
import { query } from '../config/database.js';

async function createTable() {
    try {
        console.log('🚀 Creating workflow_templates table...');

        // ============================================
        // 1. CREATE TABLE
        // ============================================
        await query(`
            CREATE TABLE IF NOT EXISTS workflow_templates (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                name VARCHAR(255) NOT NULL,
                category VARCHAR(100) NOT NULL,
                icon VARCHAR(50),
                description TEXT,
                steps JSONB NOT NULL,
                estimated_days INTEGER,
                is_active BOOLEAN DEFAULT true,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            )
        `);
        console.log('✅ Table "workflow_templates" created successfully');

        // ============================================
        // 2. CREATE INDEXES
        // ============================================
        await query(`
            CREATE INDEX IF NOT EXISTS idx_workflow_templates_category
            ON workflow_templates(category)
        `);
        console.log('✅ Category index created');

        await query(`
            CREATE INDEX IF NOT EXISTS idx_workflow_templates_active
            ON workflow_templates(is_active)
        `);
        console.log('✅ Active index created');

        await query(`
            CREATE INDEX IF NOT EXISTS idx_workflow_templates_name
            ON workflow_templates(name)
        `);
        console.log('✅ Name index created');

        // ============================================
        // 3. VERIFY TABLE EXISTS
        // ============================================
        const check = await query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables
                WHERE table_name = 'workflow_templates'
            )
        `);

        if (check.rows[0].exists) {
            console.log('\n✅ Table verified! Ready to insert workflows.');
            console.log('📊 Run: node src/scripts/generate-10000-workflows.js');
        } else {
            console.log('\n❌ Table creation failed!');
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        process.exit(0);
    }
}

createTable();
