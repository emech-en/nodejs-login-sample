const sinon = require('sinon');
const assert = require('assert');
const should = require('should');
// const Promise = require('Promise');
const UserService = require('../services/user-service');

describe('UserService', function() {
    let mockRouter, userService, mockDbService;

    beforeEach(function() {
        mockRouter = {
            post: sinon.spy()
        };
        mockDbService = {
            login: sinon.spy(),
            signup: sinon.spy(async function(account, cb) { return cb(); })
        };

        userService = new UserService(mockRouter, mockDbService);
    });

    afterEach(function() {
        mockRouter = undefined;
        mockDbService = undefined;
        userService = undefined;
    });

    describe('#constructor(router, dbService)', function() {
        it('Should set router and dbService', function() {
            assert.equal(userService.router, mockRouter);
            assert.equal(userService.dbService, mockDbService);
        });

        it('Should call router.post twice', function() {
            assert.equal(mockRouter.post.callCount, 2);
        });

        it('Should pass correct params to first router.post() call', function() {
            var callArgs = mockRouter.post.firstCall.args;

            callArgs[0].should.be.String();
            callArgs[0].should.be.equal('/login');
            callArgs[1].should.be.Array();
            callArgs[2].should.be.Function();
            callArgs[3].should.be.Function();
        });

        it('Should pass correct params to second router.post() call', function() {
            var callArgs = mockRouter.post.secondCall.args;

            callArgs[0].should.be.String();
            callArgs[0].should.be.equal('/signup');
            callArgs[1].should.be.Array();
            callArgs[2].should.be.Function();
            callArgs[3].should.be.Function();
        });
    });

    describe('#getRouter()', function() {
        it('Should return this.router object', function() {
            var router = userService.getRouter();
            router.should.be.equal(mockRouter);
        });
    });

    describe('#login(req, res, next)', function() {
        const req = {
            body: {
                'username': 'test',
                'password': 'test'
            }
        };
        const res = {};
        const next = function() {};

        it('should call this.dbService.login', function() {
            userService.login(req, res, next);
            assert.equal(userService.dbService.login.callCount, 1);
        });

        it('should call this.dbService.login with correct params', function() {
            userService.login(req, res, next);

            var callArgs = userService.dbService.login.firstCall.args;
            callArgs[0].should.be.equal(req.body.username);
            callArgs[1].should.be.equal(req.body.password);
            callArgs[2].should.be.Function();
        });
    });

    describe('#signup(req, res, next)', function() {
        const req = {
            body: {
                'username': 'test',
                'password': 'test',
                'name': 'testName',
                'family': 'testFamily',
                'email': 'test@email.com'
            }
        };
        const res = {};
        const next = function() {};

        it('should call this.dbService.signup', function() {
            userService.signup(req, res, next);
            assert.equal(userService.dbService.signup.callCount, 1);
        });

        it('should call this.dbService.signup with correct params', function() {
            userService.signup(req, res, next);

            var callArgs = userService.dbService.signup.firstCall.args;
            var account = callArgs[0];
            account.should.be.deepEqual(req.body);
        });
    });
});