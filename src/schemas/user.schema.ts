import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Note } from "./note.schema";

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
    @Prop({required:true})
    login: string;

    @Prop({required:true})
    password: string;

    @Prop({type:[{type: mongoose.Schema.Types.ObjectId, ref:'Note'}]})
    notes: Note[];
}

export const UserSchema = SchemaFactory.createForClass(User);