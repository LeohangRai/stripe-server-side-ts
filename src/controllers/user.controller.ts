import { Request, Response } from "express";
import { createUser, findAllUsers } from '../services/user.service'

export const createUserHandler = async function(req: Request, res: Response) {
    const user = await createUser(req.body);
    res.status(201).json({
        status: 'success',
        data: user
    });
}

export const findAllUsersHandler = async function (req: Request, res: Response) {
    const users = await findAllUsers();
    res.status(200).json({
        status: 'success',
        data: users
    });
}
