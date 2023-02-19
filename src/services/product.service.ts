import { myDataSource } from '../app-data-source';
import { ProductEntity } from '../entity/product.entity';

const productRepository = myDataSource.getRepository(ProductEntity);

export const createProduct = async function (data: Partial<ProductEntity>) {
  const productData = productRepository.create(data);
  return productRepository.save(productData);
};

export const findAllProducts = function () {
  return productRepository.find();
};

export const findProductByName = function (name: string) {
  return productRepository.findOneBy({ name });
};
