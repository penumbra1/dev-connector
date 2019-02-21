# Mongoose & Typegoose

Requires setting `"strictPropertyInitialization": false` in tsconfig - [see issue](https://github.com/szokodiakos/typegoose/issues/210).

String transformations on schema props are still [awaiting release](https://github.com/szokodiakos/typegoose/commit/714135b01320e0c030113493914340af57962f10). I added a GitHub dependency for now.

Pre-save hook inspired by [this answer](https://stackoverflow.com/a/53431995).
Note: pre-save hooks [don't run on update()](https://mongoosejs.com/docs/middleware.html#notes). I'm using find() and save(), as save() is performant enough due to diffing.

NoSQL injection: some say [Mongoose schema typing are enough](https://zanon.io/posts/nosql-injection-in-mongodb). However, Mongoose [just calls toString() on the input](https://mongoosejs.com/docs/schematypes.html#usage-notes), which could be anything. I'm running [mongo-sanitize](https://www.npmjs.com/package/mongo-sanitize) just to be sure.

# Auth

[401 is for auth, 403 for permissions](https://stackoverflow.com/questions/50143518), but [401 must come with a WWW-Authenticate header](https://stackoverflow.com/questions/48408530).

[JWT sub](https://tools.ietf.org/html/rfc7519#section-4.1.2) carries a user id from Mongo.

JWT strategy: there is no need to query the DB for the user during verification. Token payload can be passed to other handlers that will query the DB if needed => better perf. Invalidate the token on ban/deletion instead of on re-checking the user in the DB on every request.

# Error handling

https://stackoverflow.com/questions/28793098
https://wanago.io/2018/12/17/typescript-express-error-handling-validation/
https://gist.github.com/zcaceres/2854ef613751563a3b506fabce4501fd

__TODO__: error messages in JSON by fields.
