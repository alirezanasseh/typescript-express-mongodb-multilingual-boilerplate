import {User} from '../models';
import {TokenService} from './index';
import {
    IUserDTO,
    IUser,
    IUserRole
} from '../interfaces/project';
import {
    IAuthRegister,
    IAuthLogin,
    IService
} from "../interfaces/system";

export async function register (userDTO: IUserDTO, role: IUserRole): Promise<IService<IAuthRegister>> {
    try {
        const isEmailTaken = await User.isEmailTaken(userDTO.email);
        if (isEmailTaken) {
            return {error: 'email_taken'};
        }
        const user = await User.create({...userDTO, role});
        if (user) {
            const token = TokenService.generateToken(user);
            return {result: {id: user._id.toString(), token}};
        } else {
            return {error: 'register_error'};
        }
    } catch (e) {
        throw e;
    }
}

export async function login (email: string, password: string, role: IUserRole): Promise<IService<IAuthLogin>> {
    try {
        const user = await User.findOne({email});
        if (user) {
            if (await user.isPasswordMatch(password)) {
                // Checking role
                if (user.role === role) {
                    const token = TokenService.generateToken(user);
                    let returnUser: Partial<IUser> = {...user.toJSON()};
                    delete returnUser.password;
                    delete returnUser.salt;
                    return {result: {item: returnUser, token}};
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

export async function changePassword (currentUser: IUser, currentPassword: string, newPassword: string): Promise<IService<object>> {
    try {
        let user = await User.findById(currentUser._id);
        if (user && await user.isPasswordMatch(currentPassword)) {
            user.password = newPassword;
            await user.save();
            return {result: {done: true}};
        } else {
            return {error: 'incorrect_password'};
        }
    } catch (e) {
        throw e;
    }
}