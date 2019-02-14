import { prop, pre, Typegoose } from "typegoose";
import bcrypt from "bcryptjs";
import gravatar from "gravatar";

const SALT_ROUNDS = 10;

@pre<User>("save", async function(next) {
  if (!this.avatar || this.isModified("email")) {
    // Gravatar params: {size, rating, default}, true for https
    this.avatar = gravatar.url(
      this.email,
      { s: "200", r: "pg", d: "retro" },
      true
    );
  }
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

  @prop({
    // default: () => {
    //   console.log(this);
    //   gravatar.url(this.email, { s: "200", r: "pg", d: "retro" }, true);
    // }
    required: true
  })
  avatar: string;

  @prop({ default: Date.now })
  date: Date;
}

const UserModel = new User().getModelForClass(User);

export default UserModel;
