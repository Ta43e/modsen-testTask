import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from "./user.schema";

export type NoteDocument = HydratedDocument<Note>;

@Schema()
export class Note {
    @Prop({required:true})
    topic: string;

    @Prop({required:true})
    description: string;

    @Prop([String])
    tags: string[];

    @Prop()
    location: string

    @Prop()
    imgUrl: string

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: "User", required: true})
    owner: User
}

export const NoteSchema = SchemaFactory.createForClass(Note);