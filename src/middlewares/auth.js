/**
 * Author: Isamu Isozaki
 */
const firebase = require('@/services/firebase')
const { createUser, findUserById } = require('@/app/user/repository')
/**
 *
 * @param {string} authHeader firebase authorization header
 * Get's firebase user token
 */
function parseAuthToken (authHeader) {
  if (!authHeader) return null
  const [prefix, token] = authHeader.split(' ')
  return prefix === 'Bearer' ? token : null
}

/**
 *
 * @param {object} req
 * @param {object} res
 * @param {function} next
 * Parse token and attach user to req.user and continue on to next middleware function
 */
async function attachUser (req, res, next) {
  try {
    const token = parseAuthToken(req.get('authorization'))
    if (!token) return next()
    const decoded = await firebase.auth().verifyIdToken(token)
    req.user = await findUserById(decoded.user_id)
    // Not sure if this is the best way to go about this - we automatically create a new user
    // if user is authenticated with firebase but there is no user found in mongo
    if (!req.user) {
      req.user = await createUser({
        _id: decoded.user_id,
        email: decoded.email
      })
    }

    next()
  } catch (err) {
    console.log(err);
    next()
  }
}

/**
 *
 * @param {object} req request
 * @param {object} res response
 * @param {function} next callback
 * If req.user is not attached, respond with unauthorized
 */
function requireUser (req, res, next) {
  if (!req.user) return res.unauthorized()
  next()
}

module.exports = {
  attachUser,
  authenticateUser: [attachUser, requireUser]
}
