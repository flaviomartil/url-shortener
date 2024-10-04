const express = require('express');
const router = express.Router();
const { createUser, getUser } = require('../services/userService');
const tenantMiddleware = require('../middlewares/tenantMiddleware');

router.use(tenantMiddleware);

router.post('/', async (req, res) => {
  try {
    const user = await createUser(req.db, req.body);
    res.status(201).send(user);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao criar usuário');
  }
});

router.get('/:id', async (req, res) => {
  try {
    const user = await getUser(req.db, req.params.id);
    if (!user) {
      return res.status(404).send('Usuário não encontrado');
    }
    res.send(user);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao buscar usuário');
  }
});

module.exports = router;
