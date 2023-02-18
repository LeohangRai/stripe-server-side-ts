import { myDataSource } from "../app-data-source";
import { ProductEntity } from "../entity/product.entity";
import CustomError from "../utils/custom-error";

const productRepository = myDataSource.getRepository(ProductEntity);

export const createProduct = async function(data: Partial<ProductEntity>) {
    const productCount = await productRepository.findOneBy({
        name: data.name
    });
    if (productCount != null) {
        throw new CustomError(422, "Product name must be unique.")
    }

    const productData = productRepository.create(data);
    return productRepository.save(productData);
}

export const findAllProducts = function() {
    return productRepository.find();
}

export const findProductByName = function(name: string) {
    return productRepository.findOneBy({ name })
}
