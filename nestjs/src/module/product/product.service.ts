import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductRepository } from './product.repository';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/createProduct.dto';
import { UpdateProductDto } from './dto/updateProduct.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductRepository)
    private readonly productRepository: ProductRepository,
  ) {}

  async findAll(): Promise<Product[]> {
    return await this.productRepository.find();
  }

  async findById(id: string): Promise<Product> {
    return await this.productRepository.findOne(id);
  }

  async create(product: CreateProductDto): Promise<Product> {
    const newProduct = await this.productRepository.create(product);
    return await this.productRepository.save(newProduct);
  }

  async update(product: UpdateProductDto): Promise<Product> {
    const { id } = product;
    const productToUpdate = await this.productRepository.findOne(id);
    return await this.productRepository.save({
      ...productToUpdate,
      ...product,
    });
  }

  async removeById(id: string): Promise<Product> {
    const product = await this.productRepository.findOne(id);
    return await this.productRepository.remove(product);
  }
}
