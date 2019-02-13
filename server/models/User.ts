import { prop, Typegoose, ModelType, InstanceType } from "typegoose";

class User extends Typegoose {
  @prop({ required: true })
  name: String;

  @prop({ required: true })
  email: String;

  @prop({ required: true })
  password: String;

  @prop({ required: true }) // Either a provided image or a placeholder
  avatar: String;

  @prop({ default: Date.now() })
  date: Date;
}

const UserModel = new User().getModelForClass(User);

export default UserModel;
