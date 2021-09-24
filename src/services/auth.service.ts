import {User} from '../models';
import {TokenService} from './index';
import {
    IRole,
    IAuth,
    IUserDTO,
    IService
} from '../interfaces';

export default class AuthService {
    public async register (userDTO: IUserDTO, role: IRole): Promise<IService<IAuth>> {
        try {
            const isEmailTaken = await User.isEmailTaken(userDTO.email);
            if (isEmailTaken) {
                return {error: 'email_taken'};
            }
            const user = await User.create({...userDTO, role});
            if (user) {
                const TS = new TokenService();
                const token = TS.generateToken(user);
                return {result: {user, token}};
            } else {
                return {error: 'register_error'};
            }
        } catch (e) {
            throw e;
        }
    }

    public async login (email: string, password: string, role: IRole): Promise<IService<IAuth>> {
        try {
            const user = await User.findOne({email});
            if (user) {
                if (await user.isPasswordMatch(password)) {
                    // Checking role
                    if (user.role === role) {
                        const TS = new TokenService();
                        const token = TS.generateToken(user);
                        return {result: {user, token}};
                    } else {
                        return {error: 'incorrect_role'};
                    }
                } else {
                    return {error: 'incorrect_password'};
                }
            } else {
                return {error: 'email_not_exists'};
            }
        } catch (e) {
            throw e;
        }
    }
}