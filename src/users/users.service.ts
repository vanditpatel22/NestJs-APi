import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

    async create(email: string, password: string) {
        return this.userModel.create({ email, password })
    }

    async findByEmail(email: string) {
        return this.userModel.findOne({ email }).lean()
    }
}
