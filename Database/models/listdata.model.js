// models/user.model.js        
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// إنشاء اتصال بقاعدة البيانات
const pool = new Pool({
    connectionString: process.env.LISTDATABASE_URL,
});

// استعلام للحصول على البيانات مع الترقيم والبحث
const getDataByUserId = async (userId, searchQuery = '') => {
    let query = `
        SELECT requestnumber, arabicfullname,fullname,gov,sec,regionid, ssec,districtid, unitname, area, areatype, companyname, survey_team_id, mappuser_id,requestid
        FROM field_data_view_v2
        WHERE mappuser_id = $1 and guidancereport_status is null
    `;
    let countQuery = `
        SELECT COUNT(*) AS total
        FROM field_data_view_v2
        WHERE mappuser_id = $1
    `;
    let filteredCountQuery = countQuery;

    const params = [userId];
    const countParams = [userId];
    const filteredCountParams = [userId];

    if (searchQuery) {
        query += ` AND (requestnumber ILIKE $2 OR arabicfullname ILIKE $2 OR gov ILIKE $2 OR sec ILIKE $2 OR ssec ILIKE $2 OR unitname ILIKE $2 OR companyname ILIKE $2)`;
        filteredCountQuery += ` AND (requestnumber ILIKE $2 OR arabicfullname ILIKE $2 OR gov ILIKE $2 OR sec ILIKE $2 OR ssec ILIKE $2 OR unitname ILIKE $2 OR companyname ILIKE $2)`;
        params.push(`%${searchQuery}%`);
        filteredCountParams.push(`%${searchQuery}%`);
    }

    try {
        console.log('Executing query:', query);
        console.log('With parameters:', params);

        // استعلام للحصول على البيانات
        const { rows: dataRows } = await pool.query(query, params);

        // استعلام للحصول على عدد النتائج الإجمالي
        const { rows: countRows } = await pool.query(countQuery, countParams);
        const total = parseInt(countRows[0].total, 10);

        // استعلام للحصول على عدد النتائج المفلترة
        const { rows: filteredCountRows } = await pool.query(filteredCountQuery, filteredCountParams);
        const filteredTotal = parseInt(filteredCountRows[0].total, 10);

        return {
            data: dataRows,
            total,
            filteredTotal
        };
    } catch (error) {
        console.error('Database query failed:', error.message);
        throw new Error('Database query failed');
    }
};

export { getDataByUserId };
