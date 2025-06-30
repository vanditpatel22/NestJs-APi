import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoDto } from './create-todo.dto';
import { UpdateTodoDto } from './update-todo.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Todo, TodoDocument } from './todo.schema';

@Injectable()
export class TodosService {

    constructor(
        @InjectModel(Todo.name) private todoModel: Model<TodoDocument>,
    ) { }


    async findAll() {
        return await this.todoModel.find().exec()
    }

    async create(todo: CreateTodoDto) {
        const newTodo = new this.todoModel(todo)
        return await newTodo.save();
    }

    async delete(id: string) {
        const result = await this.todoModel.findByIdAndDelete(id);
        if (!result) {
            throw new NotFoundException(`Todo with ID ${id} not found`)
        }

        return { message: "Todo deleted", deleted: result }
    }

    async update(id: string, updateData: UpdateTodoDto) {

        const updated = await this.todoModel.findByIdAndUpdate(id, updateData, {
            new: true
        })

        if (!updated) {
            throw new NotFoundException(`Todo with ID ${id} not found`)
        }

        return { message: "Todo updated", updated: updated }

    }
}
