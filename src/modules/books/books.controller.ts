import { UserRolesDecorator } from '@app/modules/auth/decorators/role.decorator';
import { JwtGuard } from '@app/modules/auth/guard/jwt.guard';
import { RoleGuard } from '@app/modules/auth/guard/role.guard';
import { BooksService } from '@app/modules/books/books.service';
import { BookFilterDto } from '@app/modules/books/dto/book-filter.dto';
import { CreateBookDto } from '@app/modules/books/dto/create-book.dto';
import { UserRole } from '@app/modules/users/enums/role.enum';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
@ApiTags('Books')
@ApiBearerAuth()
@Controller({ path: 'books', version: ['1'] })
export class BooksController {
  constructor(private readonly bookService: BooksService) {}

  @UserRolesDecorator(UserRole.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(JwtGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new book' })
  @ApiResponse({
    status: 201,
    description: 'The book has been successfully created.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request, validation error.',
  })
  async create(@Body() createBookDto: CreateBookDto) {
    return this.bookService.create(createBookDto);
  }

  @UserRolesDecorator(UserRole.ADMIN, UserRole.USER)
  @UseGuards(RoleGuard)
  @UseGuards(JwtGuard)
  @Get()
  @ApiOperation({ summary: 'Get all books with pagination' })
  @ApiResponse({
    status: 200,
    description: 'List of books retrieved successfully.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
  })
  async findAll(@Query() bookFilterDto: BookFilterDto) {
    return this.bookService.findAll(bookFilterDto);
  }

  @UserRolesDecorator(UserRole.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(JwtGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a book by ID' })
  @ApiResponse({
    status: 200,
    description: 'The book has been successfully deleted.',
  })
  @ApiResponse({
    status: 404,
    description: 'Book not found.',
  })
  async remove(@Param('id') id: string) {
    return this.bookService.delete(id);
  }
}
