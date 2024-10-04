const express = require('express');
const { check, validationResult } = require('express-validator');
const Url = require('../models/Url');
const auth = require('../middleware/auth');
const shortid = require('shortid');
const router = express.Router();

// Middleware de autenticação
const auth = (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.userId = decoded._id;
    next();
};

// Encurtar URL
router.post('/shorten', [
    check('originalUrl').isURL().withMessage('URL inválida')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { originalUrl } = req.body;
        const shortUrl = shortid.generate();
        const url = new Url({ originalUrl, shortUrl, createdBy: req.userId || null });
        await url.save();
        res.send({ shortUrl: `http://localhost/${shortUrl}` });
    } catch (error) {
        res.status(400).send({ error: 'Erro ao encurtar URL.' });
    }
});

// Listar URLs do usuário
router.get('/user-urls', auth, async (req, res) => {
    try {
        const urls = await Url.find({ createdBy: req.userId, deletedAt: null });
        res.send(urls);
    } catch (error) {
        res.status(400).send({ error: 'Erro ao listar URLs.' });
    }
});

// Redirecionar URL encurtada
router.get('/:shortUrl', async (req, res) => {
    try {
        const url = await Url.findOne({ shortUrl: req.params.shortUrl, deletedAt: null });
        if (!url) {
            return res.status(404).send({ error: 'URL não encontrada.' });
        }
        url.clicks += 1;
        await url.save();
        res.redirect(url.originalUrl);
    } catch (error) {
        res.status(400).send({ error: 'Erro ao redirecionar URL.' });
    }
});

// Deletar URL do usuário
router.delete('/delete/:id', auth, async (req, res) => {
    try {
        const url = await Url.findOneAndUpdate(
            { _id: req.params.id, createdBy: req.userId },
            { deletedAt: new Date() },
            { new: true }
        );
        if (!url) {
            return res.status(404).send({ error: 'URL não encontrada.' });
        }
        res.send({ message: 'URL deletada com sucesso.' });
    } catch (error) {
        res.status(400).send({ error: 'Erro ao deletar URL.' });
    }
});

// Atualizar URL do usuário
router.put('/update/:id', [
    check('originalUrl').isURL().withMessage('URL inválida')
], auth, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { originalUrl } = req.body;
        const url = await Url.findOneAndUpdate(
            { _id: req.params.id, createdBy: req.userId, deletedAt: null },
            { originalUrl, updatedAt: new Date() },
            { new: true }
        );
        if (!url) {
            return res.status(404).send({ error: 'URL não encontrada.' });
        }
        res.send({ message: 'URL atualizada com sucesso.', url });
    } catch (error) {
        res.status(400).send({ error: 'Erro ao atualizar URL.' });
    }
});

module.exports = router;
