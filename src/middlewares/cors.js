/**
 * Author: Isamu Isozaki
 * Cors setup
 */
const cors = require('cors')
const { API_URL } = require('@/config')
const landingPageCors = cors({ origin: API_URL })

module.exports = { landingPageCors }
