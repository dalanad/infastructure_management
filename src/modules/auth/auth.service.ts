import { encrypt } from "../../lib/core";
import * as bcrypt from "bcryptjs";
import { UsersRepository } from "./users.repository";

export class AuthService {

    constructor(private usersRepository: UsersRepository) {  }

    async generateUserToken(username: string, password: string) {
        const user = await this.usersRepository.getActiveUser(username);
        if (user && (await bcrypt.compare(password, user.password))) {
            return encrypt(JSON.stringify({ uid: user.uid }));
        } else {
            throw Error("Invalid Credentials")
        }
    }

}