/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import { Typegoose, prop, arrayProp, Ref } from "typegoose";
import { User } from "./User";

enum JobStatus {
  STUDENT = "Student",
  JUNIOR = "Junior",
  MIDDLE = "Middle",
  SENIOR = "Senior",
  LEAD = "Lead"
}

class Social extends Typegoose {
  @prop()
  youtube?: string;

  @prop()
  twitter?: string;

  @prop()
  facebook?: string;

  @prop()
  linkedin?: string;
}

class Job extends Typegoose {
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

class Degree extends Typegoose {
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

class Profile extends Typegoose {
  @prop({ required: true, ref: User })
  user: Ref<User>;

  @prop({ required: true, maxlength: 40 })
  handle: string;

  @prop()
  company?: string;

  @prop()
  website?: string;

  @prop()
  location?: string;

  @prop({ required: true, enum: JobStatus })
  JobStatus: JobStatus;

  @arrayProp({ items: String })
  skills?: string[];

  @prop({ maxlength: 1000 })
  bio?: string;

  @prop()
  github?: string;

  @arrayProp({ items: Job })
  experience?: Job[];

  @arrayProp({ items: Degree })
  education?: Degree[];

  @arrayProp({ items: Social })
  social: Social[];
}

const ProfileModel = new Profile().getModelForClass(Profile);

export default ProfileModel;
