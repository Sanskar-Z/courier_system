import db from '../config/db.js';
import bcrypt from 'bcrypt';

export const getEmployees = async (req, res, next) => {
    try {
        const [employees] = await db.query('SELECT e.*, u.username, h.name as hub_name FROM employees e JOIN users u ON e.user_id = u.id LEFT JOIN hubs h ON e.hub_id = h.id');
        res.json(employees);
    } catch (err) {
        next(err);
    }
};

export const createEmployee = async (req, res, next) => {
    try {
        const { username, password, role, hub_id, employee_role } = req.body;
        
        const hash = await bcrypt.hash(password, 10);
        
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();
            const [result] = await conn.query('INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)', [username, hash, role || 'staff']);
            
            await conn.query('INSERT INTO employees (user_id, hub_id, role) VALUES (?, ?, ?)', [result.insertId, hub_id || null, employee_role || 'Staff']);
            
            await conn.commit();
            conn.release();
            res.status(201).json({ message: 'Employee created successfully' });
        } catch (err) {
            await conn.rollback();
            conn.release();
            next(err);
        }
    } catch (err) {
        next(err);
    }
};

export const updateEmployee = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { role, hub_id, employee_role } = req.body;
        await db.query('UPDATE employees SET role = ?, hub_id = ? WHERE id = ?', [employee_role || 'Staff', hub_id || null, id]);
        res.json({ message: 'Employee updated successfully' });
    } catch (err) {
        next(err);
    }
};