import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TodoDocument = Todo & Document;

@Schema({
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    },
})
export class Todo {
    @Prop({ required: true })
    title: string;

    @Prop({ type: Types.ObjectId, required: true, ref: 'users' })
    userId: Types.ObjectId;

    @Prop({ default: false })
    isDeleted: boolean;

    @Prop()
    created_at?: Date;

    @Prop()
    updated_at?: Date;
}

export const TodoSchema = SchemaFactory.createForClass(Todo);
TodoSchema.set('toJSON', {
    versionKey: false,
});
