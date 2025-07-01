import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Req,
    Res,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { JwtPayload } from 'src/auth/interface/jwt-payload.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import { diskStorage } from 'multer';
import { logger } from 'src/logger/winston.logger';
import {
    RESPONSE_CODE,
    STATUS,
} from 'src/common/constants/response-codes.constant';
import { ResponseUtil } from 'src/common/utils/response.util';
import { handleControllerError } from 'src/common/helpers/error.helper';

@UseGuards(AuthGuard('jwt'))
@Controller('todos')
export class TodosController {
    constructor(
        private readonly todoService: TodosService,
        private readonly responseUtil: ResponseUtil,
    ) { }

    @Post()
    async createTodo(
        @Req() req: Request,
        @Res() res: Response,
        @Body() createTodoDto: CreateTodoDto,
    ) {
        try {
            const user = req.user as AuthenticatedUser;
            const createdTodo = await this.todoService.create(
                user?.userId,
                createTodoDto,
            );

            if (createdTodo != null) {
                return this.responseUtil.sendResponse(
                    req,
                    res,
                    STATUS.OK,
                    RESPONSE_CODE.SUCCESS,
                    { keyword: 'text_todo_create_succ', components: {} },
                    createdTodo,
                );
            } else {
                return this.responseUtil.sendResponse(
                    req,
                    res,
                    STATUS.NON_AUTHORITATIVE_INFORMATION,
                    RESPONSE_CODE.FAIL,
                    { keyword: 'text_todo_create_fail', components: {} },
                    null,
                );
            }
        } catch (error) {
            return handleControllerError(req, res, error, this.responseUtil);
        }
    }

    @Get()
    async getTodos(@Req() req: Request, @Res() res: Response) {
        try {
            const user = req.user as AuthenticatedUser;
            const todoList = await this.todoService.findAll(user.userId);

            if (todoList && todoList?.length > 0) {
                return this.responseUtil.sendResponse(
                    req,
                    res,
                    STATUS.OK,
                    RESPONSE_CODE.SUCCESS,
                    { keyword: 'text_todo_list_succ', components: {} },
                    todoList,
                );
            } else {
                return this.responseUtil.sendResponse(
                    req,
                    res,
                    STATUS.NON_AUTHORITATIVE_INFORMATION,
                    RESPONSE_CODE.NODATA,
                    { keyword: 'text_todo_list_fail', components: {} },
                    [],
                );
            }
        } catch (error) {
            return handleControllerError(req, res, error, this.responseUtil);
        }
    }

    @Patch(':id')
    async updateTodo(
        @Req() req: Request,
        @Res() res: Response,
        @Param('id') id: string,
        @Body() updateTodoDto: UpdateTodoDto,
    ) {

        try {
            const user = req.user as AuthenticatedUser;
            const updatedTodo = await this.todoService.update(id, updateTodoDto, user.userId);

            if (updatedTodo != null) {

                return this.responseUtil.sendResponse(
                    req,
                    res,
                    STATUS.OK,
                    RESPONSE_CODE.SUCCESS,
                    { keyword: 'text_todo_update_succ', components: {} },
                    updatedTodo,
                );

            } else {

                return this.responseUtil.sendResponse(
                    req,
                    res,
                    STATUS.NON_AUTHORITATIVE_INFORMATION,
                    RESPONSE_CODE.NODATA,
                    { keyword: 'text_todo_update_fail', components: {} },
                    null,
                );

            }

        } catch (error) {
            return handleControllerError(req, res, error, this.responseUtil);
        }


    }

    @Delete(':id')
    async deleteTodo(
        @Req() req: Request,
        @Res() res: Response,
        @Param('id') id: string,
    ) {

        try {
            const user = req.user as AuthenticatedUser;
            const deleteTodo = await this.todoService.softDelete(id, user.userId);

            if (deleteTodo != null) {

                return this.responseUtil.sendResponse(
                    req,
                    res,
                    STATUS.OK,
                    RESPONSE_CODE.SUCCESS,
                    { keyword: 'text_todo_delete_succ', components: {} },
                    null,
                );

            } else {

                return this.responseUtil.sendResponse(
                    req,
                    res,
                    STATUS.NON_AUTHORITATIVE_INFORMATION,
                    RESPONSE_CODE.NODATA,
                    { keyword: 'text_todo_delete_fail', components: {} },
                    null,
                );

            }

        } catch (error) {
            return handleControllerError(req, res, error, this.responseUtil);
        }
    }

    // For upload the file to server using multer
    @Post(':id/upload')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: './uploads',
                filename: (req, file, cb) => {
                    if (!file || !file.originalname) {
                        return cb(new Error('Invalid file upload'), '');
                    }
                    const ext = path.extname(file.originalname);
                    const fileName = `${file.fieldname}-${Date.now()}${ext}`;
                    cb(null, fileName);
                },
            }),
        }),
    )
    async uploadFile(
        @Param('id') id: string,
        @UploadedFile() file: Express.Multer.File,
        @GetUser() user: { userId: string },
    ) {
        // Optionally save file path in the DB
        return { message: 'File uploaded successfully', file };
    }
}
