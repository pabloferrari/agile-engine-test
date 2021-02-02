import { model, Schema, Model, Document } from 'mongoose';

export interface IToken extends Document {
  auth: boolean;
  token: string;
  date: Date;
}

const TokenSchema: Schema = new Schema({
    auth: { type: String, required: true },
    token: { type: String, required: true },
    date: { type: Date, required: false, defailt: new Date() }
});

export const Token: Model<IToken> = model('tokens', TokenSchema);