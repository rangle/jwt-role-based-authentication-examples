import { Query, Arg, Mutation, Resolver, Authorized } from 'type-graphql';
import { Product } from '../entities/product';
import { ApolloError } from 'apollo-server-express';
import { CreateProductInput } from './types/create-product-input';
import { FindProductsInput } from './types/find-products-input';
import { PaginationInput } from '../types/pagination-input';
import { Like } from 'typeorm';
import { DeleteProductResponse } from './types/delete-product-response';

@Resolver()
export class ProductResolver {
  @Query(() => Product)
  async product(@Arg('id') id: string): Promise<Product> {
    const selectedProduct = await Product.findOne(id);
    if (!selectedProduct) {
      throw new ApolloError('Product not found.', 'NOT FOUND');
    }
    return selectedProduct;
  }

  // Filter products with keyword
  // Paginate product list
  @Query(() => [Product])
  async products(
    @Arg('input')
    { filter }: FindProductsInput,
    @Arg('pagination', { defaultValue: { skip: 0, take: 5 } })
    { skip, take }: PaginationInput
  ): Promise<Product[]> {
    const where = filter
      ? [{ title: Like(`%${filter}%`) }, { description: Like(`%${filter}%`) }]
      : [];
    const products = await Product.find({
      where,
      take,
      skip,
    });
    if (products.length === 0) {
      throw new ApolloError('No product found.', 'NOT FOUND');
    }
    return products;
  }

  @Mutation(() => Product)
  @Authorized('admin', 'manager') // only manager and admin and add new products
  async createProduct(
    @Arg('input')
    { title, description, price, count }: CreateProductInput
  ): Promise<Product> {
    const newProduct = await Product.create({
      title,
      description,
      price,
      count,
    }).save();

    if (!newProduct) {
      throw new ApolloError('Failed to create user.', 'FAILED TO CREATE');
    }
    return newProduct;
  }

  @Mutation(() => DeleteProductResponse)
  @Authorized('admin', 'manager') // only manager and admin and delete products
  async deleteProduct(@Arg('id') id: string): Promise<DeleteProductResponse> {
    const product = await Product.findOne(id);

    if (!product) {
      throw new ApolloError(`Product ${id} does not exist`, 'FAILED TO DELETE');
    }

    try {
      await Product.delete(id);
    } catch (error) {
      throw new ApolloError(
        `Failed to delete product ${id}`,
        'FAILED TO DELETE'
      );
    }

    return {
      message: 'Product deleted',
      id,
    };
  }
}
