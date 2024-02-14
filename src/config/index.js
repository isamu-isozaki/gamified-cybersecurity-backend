/**
 * Author: Isamu Isozaki
 * .env file mapping from process.env to dict
 */
module.exports = {
  APP_PORT: process.env.APP_PORT || 10000,
  API_URL: process.env.API_URL,
  TEMP_DIR: process.env.TEMP_DIR,
  SSH_HOST: process.env.SSH_HOST,
  SSH_USER: process.env.SSH_USER,
  SSH_PASS: process.env.SSH_PASS,
  SSH_PORT: process.env.SSH_PORT
}
