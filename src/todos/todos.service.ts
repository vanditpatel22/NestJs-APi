import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Todo, TodoDocument } from './todo.schema';

@Injectable()
export class TodosService {
    constructor(@InjectModel(Todo.name) private todoModel: Model<TodoDocument>) { }

    async findAll(userId: string) {
        return await this.todoModel.find({ userId: new Types.ObjectId(userId), isDeleted: false }).exec();
    }

    async create(userId: string, todo: CreateTodoDto) {
        const newTodo = new this.todoModel({ ...todo, userId: new Types.ObjectId(userId), });
        return await newTodo.save();
    }

    async delete(id: string, userId: string) {
        const result = await this.todoModel.findByIdAndDelete({ _id: id, userId });
        if (!result) {
            throw new NotFoundException(`text_todo_not_found`);
        }

        return result;
    }

    async softDelete(id: string, userId: string) {
        const todo = await this.todoModel.findOneAndUpdate(
            { _id: new Types.ObjectId(id), userId: new Types.ObjectId(userId), isDeleted: false },
            { isDeleted: true },
            { new: true },
        );
        console.log(todo, `softDelete`);


        if (!todo) {
            throw new NotFoundException('text_todo_not_found');
        }
        return todo;
    }

    async update(id: string, updateData: UpdateTodoDto, userId: string) {
        const updated = await this.todoModel.findByIdAndUpdate(
            { _id: id, userId },
            updateData,
            { new: true },
        );

        if (!updated) {
            throw new NotFoundException(`text_todo_not_found`);
        }

        return updated;
    }
}
