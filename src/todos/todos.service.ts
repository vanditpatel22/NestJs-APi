import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoDto } from './create-todo.dto';
import { UpdateTodoDto } from './update-todo.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Todo, TodoDocument } from './todo.schema';

@Injectable()
export class TodosService {
    constructor(@InjectModel(Todo.name) private todoModel: Model<TodoDocument>) { }

    async findAll(userId: string) {
        return await this.todoModel.find({ userId, isDeleted: false }).exec();
    }

    async create(userId: string, todo: CreateTodoDto) {
        const newTodo = new this.todoModel({ ...todo, userId: new Types.ObjectId(userId), });
        return await newTodo.save();
    }

    async delete(id: string, userId: string) {
        const result = await this.todoModel.findByIdAndDelete({ _id: id, userId });
        if (!result) {
            throw new NotFoundException(`Todo with ID ${id} not found`);
        }

        return { message: 'Todo deleted', deleted: result };
    }

    async softDelete(id: string, userId: string) {
        const todo = await this.todoModel.findOneAndUpdate(
            { _id: id, userId, isDeleted: false },
            { isDeleted: true },
            { new: true },
        );

        if (!todo) {
            throw new NotFoundException('Todo not found or already deleted');
        }
        return { message: 'Todo soft deleted', todo };
    }

    async update(id: string, updateData: UpdateTodoDto, userId: string) {
        const updated = await this.todoModel.findByIdAndUpdate(
            { _id: id, userId },
            updateData,
            { new: true },
        );

        if (!updated) {
            throw new NotFoundException(`Todo with ID ${id} not found`);
        }

        return { message: 'Todo updated', updated: updated };
    }
}
