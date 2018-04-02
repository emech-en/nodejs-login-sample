const sinon = require('sinon');
const assert = require('assert');
const should = require('should');
// const Promise = require('Promise');
const UserService = require('../services/user-service');

describe('UserService', function() {
    let mockRouter, userService, mockBroker;

    beforeEach(function() {
        mockRouter = {
            post: sinon.spy()
        };
        mockBroker = {
            callService: sinon.spy(),
        };

        userService = new UserService(mockRouter, mockBroker);
    });

    afterEach(function() {
        mockRouter = undefined;
        mockBroker = undefined;
        userService = undefined;
    });

    describe('#constructor(router, broker)', function() {
        it('Should set router and broker', function() {
            assert.equal(userService.router, mockRouter);
            assert.equal(userService.broker, mockBroker);
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

        it('should call this.broker.callService', function() {
            userService.login(req, res, next);
            assert.equal(userService.broker.callService.callCount, 1);
        });

        it('should call this.broker.callService with correct params', function() {
            userService.login(req, res, next);

            var callArgs = userService.broker.callService.firstCall.args;
            callArgs[0].should.be.equal('db-service');
            callArgs[1].should.be.equal('login');
            callArgs[2].should.be.deepEqual({ username: req.body.username, password: req.body.password });
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

        it('should call this.broker.callService', function() {
            userService.signup(req, res, next);
            assert.equal(userService.broker.callService.callCount, 1);
        });

        it('should call this.broker.callService with correct params', function() {
            userService.signup(req, res, next);

            var callArgs = userService.broker.callService.firstCall.args;
            callArgs[0].should.be.equal('db-service');
            callArgs[1].should.be.equal('signup');
            callArgs[2].should.be.deepEqual({ account: req.body });
        });
    });
});