import { prop, pre, Typegoose, InstanceType, staticMethod } from "typegoose";
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;
const DEFAULT_AVATAR =
  "https://res.cloudinary.com/penumbra1/image/upload/v1550234338/default_fb914l.svg";

@pre<User>("save", async function(next) {
  if (this.isModified("password")) {
    try {
      const salt = await bcrypt.genSalt(SALT_ROUNDS);
      this.password = await bcrypt.hash(this.password, salt);
    } catch (err) {
      return next(err);
    }
  }
  return next();
})
class User extends Typegoose {
  @prop({ required: true })
  name: string;

  @prop({ required: true })
  email: string;

  @prop({ required: true })
  password: string;

  @prop({ default: Date.now })
  date: Date;

  @prop({
    default: DEFAULT_AVATAR
  })
  avatar: string;
}

const UserModel = new User().getModelForClass(User);

export default UserModel;
