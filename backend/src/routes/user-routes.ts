import { Router } from "express";
import { getAllUsers, userLogout, usersLogin, usersSignup, verifyUser } from "../controllers/user-controllers.js";
import { loginValidator, signupValidator, validate } from "../utils/validators.js";
import { verifyToken } from "../utils/token-manager.js";

const userRoutes = Router();

userRoutes.get("/",getAllUsers);
userRoutes.post("/signup", validate(signupValidator), usersSignup);
userRoutes.post("/login",validate(loginValidator),usersLogin);
userRoutes.get("/auth-status",verifyToken,verifyUser);
userRoutes.get("/login",verifyToken,userLogout);

export default userRoutes;