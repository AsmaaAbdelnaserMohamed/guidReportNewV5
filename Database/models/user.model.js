import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// إنشاء اتصال بقاعدة البيانات
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

pool.connect()
    .then(() => {
        console.log('mapp user database is connected successfully');
    })
    .catch(err => {
        console.log('mapp user database error connection ', err.stack);
    });

// وظيفة للحصول على المستخدم حسب اسم المستخدم
export const findUserByUsername = async (username) => {
    const query = 'SELECT * FROM mapp_user WHERE name = $1';
    const result = await pool.query(query, [username]);
    return result.rows[0];
};

// وظيفة لإدخال مستخدم جديد في قاعدة البيانات
export const createUser = async (username, hashedPassword) => {
    const query = 'INSERT INTO mapp_user (name, password) VALUES ($1, $2)';
    await pool.query(query, [username, hashedPassword]);
};
