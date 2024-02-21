/**
 * Author: Isamu Isozaki
 * .env file mapping from process.env to dict
 */
module.exports = {
  APP_PORT: process.env.APP_PORT || 10000,
  API_URL: process.env.API_URL || 'localhost:1000',
  TEMP_DIR: process.env.TEMP_DIR,
  SSH_HOST: process.env.SSH_HOST || 'localhost',
  SSH_USER: process.env.SSH_USER || 'kali',
  SSH_PASS: process.env.SSH_PASS || 'kali',
  SSH_PORT: process.env.SSH_PORT || 2222
}
