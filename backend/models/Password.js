var passwordValidator = require('password-validator');

const passwordSchema = new passwordValidator();

passwordSchema
.is().min(8)
.is().max(16)
.has().uppercase()
.has().lowercase()
.has().symbols()
.has().digits()
.has().not().spaces()
.is().not().oneOf(['Passw0rd.', 'Password123*', 'Azerty123*', 'Motdepasse123!']); 
//Could find or write a blacklist

module.exports = passwordSchema;