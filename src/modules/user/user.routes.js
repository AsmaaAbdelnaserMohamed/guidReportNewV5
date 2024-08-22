// routes/auth.routes.js
import express from 'express';
import { loginUser, registerUser } from './user.controller.js';
import authenticateToken from '../../middleware/auth.middleware.js';

const routerAuth = express.Router();

// مسار تسجيل المستخدم
routerAuth.post('/register', registerUser);

// مسار تسجيل الدخول
routerAuth.post('/login', loginUser);

// // مثال على مسار محمي
routerAuth.get('/profile', authenticateToken, (req, res) => {
  res.status(200).json({ message: 'مرحبا بك في الملف الشخصي', user: req.user });
});

export default routerAuth;
