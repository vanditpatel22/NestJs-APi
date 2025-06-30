import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { TodosService } from "./todos.service";
import { CreateTodoDto } from './create-todo.dto';
import { UpdateTodoDto } from './update-todo.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { JwtPayload } from 'src/auth/jwt-payload.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import { diskStorage } from 'multer';

@UseGuards(AuthGuard('jwt'))
@Controller('todos')
export class TodosController {

    constructor(private readonly todoService: TodosService) { }

    @Post()
    createTodo(@GetUser() user: JwtPayload, @Body() createTodoDto: CreateTodoDto) {
        return this.todoService.create(user.userId, createTodoDto)
    }


    @Get()
    getTodos(@GetUser() user: JwtPayload) {
        return this.todoService.findAll(user.userId)
    }


    @Patch(":id")
    updateTodo(@GetUser() user: JwtPayload, @Param("id") id: string, @Body() updateTodoDto: UpdateTodoDto) {
        return this.todoService.update(id, updateTodoDto, user.userId)
    }


    @Delete(":id")
    deleteTodo(@GetUser() user: JwtPayload, @Param('id') id: string) {
        return this.todoService.softDelete(id, user.userId)
    }


    @Post(':id/upload')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: './uploads',
                filename: (req, file, cb) => {
                    console.log(file);
                    
                    if (!file || !file.originalname) {
                        return cb(new Error('Invalid file upload'), '');
                    }
                    const ext = path.extname(file.originalname);
                    const fileName = `${file.fieldname}-${Date.now()}${ext}`;
                    cb(null, fileName);
                }
            }),
        }),
    )
    async uploadFile(
        @Param('id') id: string,
        @UploadedFile() file: Express.Multer.File,
        @GetUser() user: { userId: string },
    ) {
        console.log(file); // info about uploaded file
        // Optionally save file path in the DB
        return { message: 'File uploaded successfully', file };
    }


}

