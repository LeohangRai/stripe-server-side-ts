import { Request, Response } from "express";
import { createProduct, findAllProducts } from "../services/product.service";

export const createProductHandler = async function(req: Request, res: Response) {
    const product = await createProduct(req.body);
    res.status(201).json({
        status: 'success',
        data: product
    });
}

export const findAllProductsHandler = async function (req: Request, res: Response) {
    const products = await findAllProducts();
    res.status(200).json({
        status: 'success',
        data: products
    });
}