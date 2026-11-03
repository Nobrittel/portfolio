import jwt from 'jsonwebtoken'

export const COOKIE_NAME = 'portfolio_token'

export function getCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  }
}

export function requireAuth(req, res, next) {
  const token = req.cookies?.[COOKIE_NAME]

  if (!token) {
    return res.status(401).json({ error: 'Non authentifié' })
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ['HS256'],
    })
    req.user = { id: Number(payload.sub), role: payload.role }
    next()
  } catch {
    res.status(401).json({ error: 'Session expirée, reconnecte-toi.' })
  }
}

export function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Accès refusé' })
  }
  next()
}