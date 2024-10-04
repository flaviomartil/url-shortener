const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.userId = decoded._id;
        next();
    } catch (error) {
        res.status(401).send({ error: 'Por favor, autentique-se.' });
    }
};

module.exports = auth;
