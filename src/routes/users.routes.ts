import express from 'express';
import {
  createUserHandler,
  findAllUsersHandler
} from '../controllers/user.controller';
import { validate } from '../middlewares/validate';
import wrapNext from '../middlewares/wrap-next';
import { createUserSchema } from '../schemas/user.schema';
const router = express.Router();

router
  .route('/')
  .get(wrapNext(findAllUsersHandler))
  .post(validate(createUserSchema), wrapNext(createUserHandler));

export default router;
