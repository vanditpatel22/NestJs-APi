import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    },
})
export class User {
    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop()
    created_at?: Date;

    @Prop()
    updated_at?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.set('toJSON', {
    versionKey: false,
});
