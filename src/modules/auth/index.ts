import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UsersRepository } from "./users.repository";
import { generateRouter, NodemailerService } from "../../lib/core";

const authService = new AuthService(new UsersRepository(), new NodemailerService());
let authController = new AuthController(authService);

export const AuthModuleRouter = generateRouter(authController);
