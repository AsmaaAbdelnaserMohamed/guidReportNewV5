// controllers/user.controller.js
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { createUser, findUserByUsername } from '../../../Database/models/user.model.js';
import { validateRegister } from './user.validation.js';

// تسجيل المستخدم
export const registerUser = async (req, res) => {
  const { error } = validateRegister(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { username, password } = req.body;

  try {
    // تحقق إذا كان المستخدم موجودًا
    const existingUser = await findUserByUsername(username);
    if (existingUser) {
      return res.status(400).json({ message: 'المستخدم موجود بالفعل' });
    }

    // تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(password, 10);

    // إدراج المستخدم في قاعدة البيانات
    await createUser(username, hashedPassword);

    res.status(201).json({ message: 'تم التسجيل بنجاح' });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في الخادم', error });
  }
};

// تسجيل الدخول

const SHA1 = (password) => {
  return crypto.createHash('sha1').update(password).digest('hex');
};

export const loginUser = async (req, res) => {
  const { error } = req.body;
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { username, password } = req.body;

  try {
    // التحقق من المستخدم
    const user = await findUserByUsername(username);
    if (!user) {
      return res.status(400).json({ message: 'اسم المستخدم أو كلمة المرور غير صحيحة' });
    }

    // التحقق من كلمة المرور
    const hashedPassword = SHA1(password);
    if (hashedPassword !== user.password) {
      return res.status(400).json({ message: 'اسم المستخدم أو كلمة المرور غير صحيحة' });
    }

    // إنشاء JWT
    const token = jwt.sign({ userId: user.id, username: user.username }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    res.status(200).json({ message: 'تم تسجيل الدخول بنجاح', token });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في الخادم', error });
  }
};

// export const loginUser = async (req, res) => {
//   const { error } = (req.body);
//   if (error) return res.status(400).json({ message: error.details[0].message });

//   const { username, password } = req.body;

//   try {
//     // التحقق من المستخدم
//     const user = await findUserByUsername(username);
//     if (!user) {
//       return res.status(400).json({ message: 'اسم المستخدم أو كلمة المرور غير صحيحة' });
//     }

//     // التحقق من كلمة المرور
//     const validPassword = await bcrypt.compare(password, user.password);
//     if (!validPassword) {
//       return res.status(400).json({ message: 'اسم المستخدم أو كلمة المرور غير صحيحة' });
//     }

//     // إنشاء JWT
//     const token = jwt.sign({ userId: user.id, username: user.username }, process.env.JWT_SECRET, {
//       expiresIn: '1h',
//     });

//     res.status(200).json({ message: 'تم تسجيل الدخول بنجاح', token });
//   } catch (error) {
//     res.status(500).json({ message: 'خطأ في الخادم', error });
//   }
// };
