import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { TodosService } from "./todos.service";
import { CreateTodoDto } from './create-todo.dto';
import { UpdateTodoDto } from './update-todo.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('todos')
export class TodosController {
    constructor(private readonly todoService: TodosService) { }

    @UseGuards(AuthGuard('jwt'))
    @Get()
    getTodos(@Req() req) {
        console.log(req.user);
        return this.todoService.findAll()
    }

    @Post()
    createTodo(@Body() createTodoDto: CreateTodoDto) {
        return this.todoService.create(createTodoDto)
    }

    @Delete(":id")
    deleteTodo(@Param('id') id: string) {
        return this.todoService.delete(id)
    }

    @Patch(":id")
    updateTodo(@Param("id") id: string, @Body() updateTodoDto: UpdateTodoDto) {
        return this.todoService.update(id, updateTodoDto)
    }

}
