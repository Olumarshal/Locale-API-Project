import UserService from '@/resources/user/user.service';
import UserController from '@/resources/user/user.controller';
import mongoose from 'mongoose';
import supertest from 'supertest';
import App from '../app';

const userId = new mongoose.Types.ObjectId().toString();

const userController = new UserController();

const app = new App([userController], 8080);

const userPayload = {
    message:
        'Registration Successful, Kindly store your token in a safe and secure place',
    token: 'jRjMWUzOTY1YjcyMjkzOSIsImlhdCI6MTY4NzUyOTAyMSwiZXhwIjoyMDAzMTA1MDIxfQ.YxQYnGz8-8T8VipuX9gctswr3qJcSrJEJnIiYWc0LLA',
};

const testInput = {
    username: 'AlphaBeta2k9',
    email: 'sample12@test.com',
    password: 'Password890',
    confirmPassword: 'Password890',
};

describe('user', () => {
    describe('user registration', () => {
        describe('given the username, email and password are valid', () => {
            test('should return a message and token', async () => {
                const createUser = jest
                    .spyOn(UserService.prototype, 'register')
                    // @ts-ignore
                    .mockReturnValueOnce(userPayload);

                const { statusCode, body } = await supertest(app)
                    .post('/api/v1/users')

                    .send(testInput);

                expect(statusCode).toBe(201);

                expect(body).toEqual(userPayload);

                expect(createUser).toHaveBeenCalledWith(testInput);
            });
        });

        describe('given the user service throws', () => {
            test('should return a 400 error', async () => {
                const createUser = jest
                    .spyOn(UserService.prototype, 'register')
                    .mockRejectedValue('Can not be accepted!');

                const { statusCode } = await supertest(app)
                    .post('/api/v1/users')

                    .send(testInput);

                expect(statusCode).toBe(400);
                expect(createUser).toHaveBeenCalled();
            });
        });
    });
});

describe('user login', () => {
    describe('given the password does not match', async () => {
        const createUser = jest
            .spyOn(UserService.prototype, 'login')
            // @ts-ignore
            .mockReturnValueOnce(userPayload);

        const { statusCode } = await supertest(app)
            .post('/api/v1/users')

            .send({ ...testInput, confirmPassword: 'wrongpassword' });

        expect(statusCode).toBe(400);

        expect(createUser).not.toHaveBeenCalled();
    });
});
