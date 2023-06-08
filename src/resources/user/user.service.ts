import UserModel from '@/resources/user/user.model';
import token from '@/utils/token';

class UserService {
    private user = UserModel;

    // Register a user
    public async register(
        username: string,
        email: string,
        password: string
    ): Promise<string | Error> {
        try {
            const user = new UserModel({
                username,
                email,
                password,
            });

            await user.save();

            const accessToken = token.createToken(user);

            return accessToken;
        } catch (error) {
            throw new Error('Unable to register');
        }
    }

    // Login
    public async login(email: string, password: string): Promise<void | Error> {
        try {
            const user = await this.user.findOne({ email });

            if (!user) {
                throw new Error('Unable to find user with this email address');
            }

            const isCorrectPassword = await user.isValidPassword(password);
            if (isCorrectPassword) {
                return;
            } else {
                throw new Error('Invalid credentials');
            }
        } catch (error) {
            throw new Error('Unable to login');
        }
    }
}

export default UserService;
