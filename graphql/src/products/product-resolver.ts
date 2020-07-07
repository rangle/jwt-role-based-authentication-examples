import { Query, Arg, Mutation, Resolver } from 'type-graphql';
import { Product } from '../entities/product';
import { ApolloError } from 'apollo-server-express';
import { CreateProductInput } from './types/create-product-input';
import { FindProductsInput } from './types/find-products-input';
import { PaginationInput } from '../shared/pagination-input';
import { Like } from 'typeorm';

@Resolver()
export class ProductResolver {
  @Query(() => Product)
  async product(@Arg('id') id: string) {
    const selectedProduct = await Product.findOne(id);
    if (!selectedProduct) {
      throw new ApolloError('Product not found.', 'NOT FOUND');
    }
    return selectedProduct;
  }

  // Filter products with keyword
  // Paginate product array
  @Query(() => [Product])
  async products(
    @Arg('input', { defaultValue: { filter: null, price: null } })
    { filter }: FindProductsInput,
    @Arg('pagination', { defaultValue: { skip: 0, take: 5 } })
    { skip, take }: PaginationInput
  ) {
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
}
