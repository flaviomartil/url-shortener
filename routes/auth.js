const express = require('express');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = express.Router();

// Registrar usuário
router.post('/register', [
    check('email').isEmail().withMessage('Email inválido'),
    check('password').isLength({ min: 6 }).withMessage('Senha deve ter no mínimo 6 caracteres')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { email, password } = req.body;
        const user = new User({ email, password });
        await user.save();
        res.status(201).send({ message: 'Usuário criado com sucesso!' });
    } catch (error) {
        res.status(400).send({ error: 'Erro ao criar usuário.' });
    }
});

// Login de usuário
router.post('/login', [
    check('email').isEmail().withMessage('Email inválido'),
    check('password').exists().withMessage('Senha é obrigatória')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send({ error: 'Email ou senha incorretos.' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send({ error: 'Email ou senha incorretos.' });
        }

        const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY);
        res.send({ token });
    } catch (error) {
        res.status(500).send({ error: 'Erro no login.' });
    }
});

module.exports = router;
