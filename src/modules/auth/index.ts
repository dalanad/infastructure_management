import { AuthController } from './auth.controller'
import { AuthService } from "./auth.service";
import { UsersRepository } from "./users.repository";
import { getRouter } from "../../lib/core";

const authService = new AuthService(new UsersRepository())
let authController = new AuthController(authService)

export const AuthModuleRouter = getRouter(authController);
