import express from 'express'
import { createProductHandler, findAllProductsHandler } from '../controllers/product.controller';
import { validate } from '../middlewares/validate';
import wrapNext from '../middlewares/wrap-next';
import { createProductSchema } from '../schemas/product.schema';
const router = express.Router();

router
    .route('/')
    .get(wrapNext(findAllProductsHandler))
    .post(validate(createProductSchema), wrapNext(createProductHandler))

export default router;