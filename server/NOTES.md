# Mongoose & Typegoose

Requires setting `"strictPropertyInitialization": false` in tsconfig - [see issue](https://github.com/szokodiakos/typegoose/issues/210).

Pre-save hook inspired by [this answer](https://stackoverflow.com/a/53431995).
Note: pre-save hooks [don't run on update()](https://mongoosejs.com/docs/middleware.html#notes). I'm using find() and save(), as save() is performant enough due to diffing.
