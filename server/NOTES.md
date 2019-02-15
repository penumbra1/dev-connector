# Mongoose & Typegoose

Requires setting `"strictPropertyInitialization": false` in tsconfig - [see issue](https://github.com/szokodiakos/typegoose/issues/210).

Pre-save hook inspired by [this answer](https://stackoverflow.com/a/53431995).
Note: pre-save hooks [don't run on update()](https://mongoosejs.com/docs/middleware.html#notes). I'm using find() and save(), as save() is performant enough due to diffing.

# Auth

[401 is for auth, 403 for permissions](https://stackoverflow.com/questions/50143518), but [401 must come with a WWW-Authenticate header](https://stackoverflow.com/questions/48408530).

# Error handling

https://stackoverflow.com/questions/28793098
https://wanago.io/2018/12/17/typescript-express-error-handling-validation/
https://gist.github.com/zcaceres/2854ef613751563a3b506fabce4501fd
