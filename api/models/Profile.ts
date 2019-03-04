/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import {
  arrayProp,
  plugin,
  prop,
  PropOptionsWithNumberValidate,
  Ref,
  Typegoose
} from "typegoose";
import uniqueValidator from "mongoose-unique-validator";
import isURL from "validator/lib/isURL";
import { User } from "./User";

enum JobStatus {
  STUDENT = "Student",
  JUNIOR = "Junior",
  MIDDLE = "Middle",
  SENIOR = "Senior",
  LEAD = "Lead"
}

const urlValidator: PropOptionsWithNumberValidate = {
  validate: {
    validator: val => isURL(val),
    message: `{VALUE} is not a valid URL.`
  }
};

class Social extends Typegoose {
  @prop(urlValidator)
  youtube?: string;

  @prop(urlValidator)
  twitter?: string;

  @prop(urlValidator)
  facebook?: string;

  @prop(urlValidator)
  linkedin?: string;
}

class Job {
  @prop({ required: true })
  title: string;

  @prop({ required: true })
  company: string;

  @prop()
  location?: string;

  @prop()
  from?: Date;

  @prop()
  to?: Date;

  @prop()
  current?: boolean;

  @prop({ maxlength: 300 })
  description?: string;
}

class Degree {
  @prop({ required: true })
  degree: string;

  @prop({ required: true })
  field: string;

  @prop({ required: true })
  school: string;

  @prop()
  location?: string;

  @prop()
  from?: Date;

  @prop()
  to?: Date;

  @prop()
  current?: boolean;

  @prop({ maxlength: 300 })
  description?: string;
}

@plugin(uniqueValidator)
class Profile extends Typegoose {
  @prop({ required: true, ref: User })
  user: Ref<User>;

  @prop({
    required: true,
    unique: true,
    minlength: [2, "Handle should be between 2 and 40 characters."],
    maxlength: [40, "Handle should be between 2 and 40 characters."]
  })
  handle: string;

  @arrayProp({ items: String })
  skills?: string[];

  @prop({ maxlength: 1000 })
  bio?: string;

  @prop()
  company?: string;

  @prop()
  location?: string;

  @prop({ required: true, enum: JobStatus })
  status: JobStatus;

  @arrayProp({ items: Job })
  experience?: Job[];

  @arrayProp({ items: Degree })
  education?: Degree[];

  @prop(urlValidator)
  website?: string;

  @prop(urlValidator)
  github?: string;

  @prop({ _id: false })
  social?: Social;
}

const ProfileModel = new Profile().getModelForClass(Profile);
new Social().setModelForClass({ schemaOptions: { validateBeforeSave: false } });

export default ProfileModel;
