const baseRoute = require('../../config/router-config');
const { BASE_URL } = require('../../config');

baseRoute.get('/', (req, res) => res.status(200).send(`<code>Backend Running...<a target="_blank" href="${BASE_URL}/docs" style="text-decoration: none; cursor: pointer; color: black; font-weight: bold">&lt;Check Docs/&gt;</a></code>`));

module.exports = baseRoute;
