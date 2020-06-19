exports.sessCheck = async (req, res, next) => {
    const sess = req.session;

    if (sess.token) return next();
    else return res.render('UserLoginView');
}