/**
 * Placeholder auth function for when we add server side authentication.
 * Will be used as middleware between each request.
 */
const isAuth = (req, res, next) => {
  return next();
  //   res.redirect("/");
};

module.exports = { isAuth };
