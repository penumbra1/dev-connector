/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import { prop, pre, Typegoose } from "typegoose";
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;
const DEFAULT_AVATAR =
  "https://res.cloudinary.com/penumbra1/image/upload/v1550234338/default_fb914l.svg";

@pre<User>("save", function(next) {
  if (this.isModified("password")) {
    return bcrypt
      .genSalt(SALT_ROUNDS)
      .then(salt => bcrypt.hash(this.password, salt))
      .then(hashed => {
        this.password = hashed;
      })
      .catch(next);
  }
})
class User extends Typegoose {
  @prop({ required: true })
  name: string;

  @prop({
    required: true,
    match: [/\S+@\S+/, "An e-mail must contain a @."]
  })
  email: string;

  @prop({
    required: true,
    minlength: [8, "Password must be at least 8 characters."]
  })
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
