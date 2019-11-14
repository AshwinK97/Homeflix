const isAuth = (req, res, next) => {
  return next();
  //   res.redirect("/");
};

module.exports = { isAuth };
