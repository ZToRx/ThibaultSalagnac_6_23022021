const passwordSchema =  require('../models/Password');

module.exports = (req, res, next) => {
    //Email verification
    const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    if(emailRegex.test(req.body.email)) {
        //Password verification
        const details = passwordSchema.validate(req.body.password, { details: true });
        if(passwordSchema.validate(req.body.password)) {
            next();
        } else {
            res.status(400).json({ message: details });
        }
    } else {
        res.status(400).json({ message: 'invalid email'});
    }
};