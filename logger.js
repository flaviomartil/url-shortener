// logger.js
const { ElasticsearchTransport } = require('winston-elasticsearch');
const { createLogger, format, transports } = require('winston');

const esTransportOpts = {
    level: 'info',
    clientOpts: { node: process.env.ELASTICSEARCH_URL },
    indexPrefix: 'your-index',
};

const logger = createLogger({
    format: format.combine(
        format.timestamp(),
        format.json()
    ),
    transports: [
        new transports.Console(),
        new ElasticsearchTransport(esTransportOpts)
    ]
});

module.exports = logger;
