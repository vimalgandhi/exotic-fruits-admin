// Route protection middleware
const routeProtectionMiddleware = (req, res, next) => {
  if (!req.user) return res.redirect('/login');
  next();
};
export default routeProtectionMiddleware;