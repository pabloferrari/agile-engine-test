import { model, Schema, Model, Document } from 'mongoose';

export interface IImage extends Document {
    id: string;
    author: string;
    camera: string;
    tags: string;
    cropped_picture: string;
    full_picture: string;
}

const ImageSchema: Schema = new Schema({
    id: { type: String, required: true, unique: true },
    cropped_picture: { type: String, required: true },
    author: { type: String, required: false },
    camera: { type: String, required: false },
    tags: { type: String, required: false },
    full_picture: { type: String, required: false },
    created: { type: Date, required: false }
});

export const Image: Model<IImage> = model('images', ImageSchema);