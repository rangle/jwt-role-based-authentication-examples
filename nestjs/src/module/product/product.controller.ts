import {
  Controller,
  Get,
  Param,
  NotFoundException,
  Body,
  Post,
  Delete,
  Put,
  BadRequestException,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/createProduct.dto';
import { UpdateProductDto } from './dto/updateProduct.dto';

@Controller('/api/products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async findAll(): Promise<Product[]> {
    try {
      return await this.productService.findAll();
    } catch (error) {
      throw new NotFoundException(`Cannot find products`);
    }
  }

  @Get(':id')
  async findProductById(@Param() params): Promise<Product> {
    const { id } = params;
    try {
      return await this.productService.findById(id);
    } catch (error) {
      throw new NotFoundException(`Cannot find product #${id}`);
    }
  }

  @Post()
  async create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    try {
      return await this.productService.create(createProductDto);
    } catch (error) {
      throw new BadRequestException(`Failed to create product`);
    }
  }

  @Put()
  async update(@Body() product: UpdateProductDto): Promise<Product> {
    try {
      return await this.productService.update(product);
    } catch (error) {
      throw new BadRequestException(`Failed to update product`);
    }
  }

  @Delete(':id')
  async deleteProductById(@Param() params): Promise<Product> {
    const { id } = params;
    try {
      return await this.productService.removeById(id);
    } catch (error) {
      throw new BadRequestException(`Failed to remove product #${id}`);
    }
  }
}
