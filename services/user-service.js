const { check, validationResult } = require('express-validator/check');

const loginValidation = [
    check('password').exists(),
    check('username').exists()
];

const signupValidation = [
    check('username').exists(),
    check('password').exists(),
    check('name').exists(),
    check('family').exists(),
    check('email').exists().isEmail()
];

function checkValidationResult(req, res, next) {
    // Get the validation result
    const validationError = validationResult(req);

    // If there is no error call next middleware
    if (validationError.isEmpty())
        return next();
    
    // or if there is validatione error call
    // next middleware with error object.
    return next({
        code: getErrorCode(validationError.mapped()),
        message: 'Bad Request.'
    });
}

function getErrorCode(mappedError) {
    if (mappedError.email) {
        return 10;
    } else if (mappedError.username) {
        return 20;
    } else if (mappedError.password) {
        return 30;
    } else {
        return 40;
    }
}

class UserService {
    constructor(router, dbService) {
        this.router = router
        this.router.post('/login', loginValidation, checkValidationResult, (req, res, next) => this.login(req, res, next));
        this.router.post('/signup', signupValidation, checkValidationResult, (req, res, next) => this.signup(req, res, next));
        this.dbService = dbService;
    }

    async login(req, res, next) {
        try {
            let user = await this.dbService.login(req.body.username, req.body.password);
            res.status(200).json(user.getView());
        } catch (err) {
            return next(err);
        }
    }

    async signup(req, res, next) {
        try {
            await this.dbService.signup(req.body);
            res.status(200).send({
                status: 'ok',
                message: 'User created.'
            });
        } catch (err) {
            return next(err);
        }
    }

    getRouter() {
        return this.router;
    }
}

module.exports = UserService;