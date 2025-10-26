module.exports = {
  ensureAuthenticated: (req, res, next) => {
    if (req.session && req.session.user) return next();
    return res.redirect('/login');
  },
  ensureAdmin: (req, res, next) => {
    if (req.session && req.session.user && req.session.user.role === 'admin') return next();
    return res.status(403).render('error', { 
      title: 'Error',
      message: 'Forbidden: Admins only',
      error: null 
    });
  }
};