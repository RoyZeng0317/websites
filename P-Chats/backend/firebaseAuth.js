// Verifies Firebase Auth ID tokens without needing a service-account secret on this box —
// Firebase ID tokens are RS256 JWTs signed with keys published (rotated) at this endpoint.
const jwt = require('jsonwebtoken')

const CERTS_URL = 'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com'
const PROJECT_ID = process.env.FIREBASE_PROJECT_ID || 'p-chats-26652'

let certsCache = { certs: null, expiresAt: 0 }

async function getCerts() {
  if (certsCache.certs && Date.now() < certsCache.expiresAt) return certsCache.certs
  const res = await fetch(CERTS_URL)
  if (!res.ok) throw new Error('Failed to fetch Firebase signing certs')
  const certs = await res.json()
  const cacheControl = res.headers.get('cache-control') || ''
  const maxAgeMatch = cacheControl.match(/max-age=(\d+)/)
  const maxAgeMs = maxAgeMatch ? parseInt(maxAgeMatch[1], 10) * 1000 : 3600_000
  certsCache = { certs, expiresAt: Date.now() + maxAgeMs }
  return certs
}

async function verifyFirebaseToken(token) {
  const decoded = jwt.decode(token, { complete: true })
  const kid = decoded && decoded.header && decoded.header.kid
  if (!kid) throw new Error('Invalid token header')

  const certs = await getCerts()
  const cert = certs[kid]
  if (!cert) throw new Error('Unknown signing key')

  const payload = jwt.verify(token, cert, {
    algorithms: ['RS256'],
    issuer: `https://securetoken.google.com/${PROJECT_ID}`,
    audience: PROJECT_ID,
  })
  if (!payload.sub) throw new Error('Token missing sub')
  return payload.sub // Firebase uid
}

async function authenticate(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) return res.status(401).json({ error: 'Missing bearer token' })
  try {
    req.uid = await verifyFirebaseToken(token)
    next()
  } catch (e) {
    res.status(401).json({ error: 'Invalid token' })
  }
}

module.exports = { authenticate, verifyFirebaseToken }
