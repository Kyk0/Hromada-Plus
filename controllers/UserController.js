const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { isUserNearHromada } = require('../utils/locationCheck');

const register = async (req, res) => {
    const { name, surname, email, password, hromada_id } = req.body;

    if (!name || !surname || !email || !password || !hromada_id) {
        return res.status(400).json({ error: 'Усі поля є обовʼязковими' });
    }

    if (!email.includes('@') || !email.includes('.')) {
        return res.status(400).json({ error: 'Некоректна електронна пошта' });
    }

    if (password.length < 8) {
        return res.status(400).json({ error: 'Пароль повинен містити щонайменше 8 символів' });
    }

    const allowed = await isUserNearHromada(hromada_id);
    if (!allowed) {
        return res.status(403).json({ error: 'Ваша геолокація не відповідає обраній громаді' });
    }

    const existingUser = await User.findByEmail(email);
    if (existingUser) {
        return res.status(409).json({ error: 'Користувач з такою поштою вже існує' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
        name,
        surname,
        email,
        password: hashedPassword,
        account_type: 'user',
        hromada_id
    });

    res.status(201).json({ message: 'Користувача успішно зареєстровано' });
};

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Пошта та пароль є обовʼязковими' });
    }

    const user = await User.findByEmail(email);
    if (!user) return res.status(401).json({ error: 'Невірна пошта або пароль' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Невірна пошта або пароль' });

    const token = jwt.sign(
        { id: user.id, email: user.email, account_type: user.account_type },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );

    res.json({ token });
};

const getMe = async (req, res) => {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'Користувача не знайдено' });

    const { password, ...userData } = user;
    res.json(userData);
};

const changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: 'Поточний і новий пароль є обовʼязковими' });
    }

    if (newPassword.length < 8) {
        return res.status(400).json({ error: 'Новий пароль повинен містити щонайменше 8 символів' });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'Користувача не знайдено' });

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) return res.status(403).json({ error: 'Неправильний поточний пароль' });

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await User.updatePassword(user.id, hashedNewPassword);

    res.json({ message: 'Пароль успішно змінено' });
};

module.exports = { register, login, getMe, changePassword };
