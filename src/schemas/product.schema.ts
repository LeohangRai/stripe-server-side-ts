import { number, object, string } from 'zod';
import { findProductByName } from '../services/product.service';

export const createProductSchema = object({
  body: object({
    name: string({
      required_error: 'Name is required'
    }).refine(isUniqueProductName, { message: 'Product name must be unique' }),
    price: number({
      required_error: 'Price is required',
      invalid_type_error: 'Price must be a number'
    }).gt(0, 'Price must be greater than 0')
  })
});

async function isUniqueProductName(name: string): Promise<boolean> {
  const product = await findProductByName(name);
  return product == null;
}
