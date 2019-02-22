# Mongoose & Typegoose

Requires setting `"strictPropertyInitialization": false` in tsconfig - [see issue](https://github.com/szokodiakos/typegoose/issues/210).

String transformations on schema props are still [awaiting release](https://github.com/szokodiakos/typegoose/commit/714135b01320e0c030113493914340af57962f10). I added a GitHub dependency for now.

Pre-save hook inspired by [this answer](https://stackoverflow.com/a/53431995).
Note: pre-save hooks [don't run on update()](https://mongoosejs.com/docs/middleware.html#notes). I'm using find() and save(), as save() is performant enough due to diffing.

NoSQL injection: some say [Mongoose schema typing are enough](https://zanon.io/posts/nosql-injection-in-mongodb). However, Mongoose [just calls toString() on the input](https://mongoosejs.com/docs/schematypes.html#usage-notes), which could be anything. I'm running [mongo-sanitize](https://www.npmjs.com/package/mongo-sanitize) just to be sure.

# Auth

[401 is for auth, 403 for permissions](https://stackoverflow.com/questions/50143518), but [401 must come with a WWW-Authenticate header](https://stackoverflow.com/questions/48408530).

[JWT sub](https://tools.ietf.org/html/rfc7519#section-4.1.2) carries a user id from Mongo.

## Passport
... Is a mess if I want to report errors by field.

__Local strategy__

If any field is missing, the strategy callback doesn't execute at all. I have to check for missing credentials in req.body manually.
If credentials are provided but don't match, the strategy runs as specified.
In both cases, by default passport sends a 401 (and an ugly error) to the client, bypassing other middleware.

To clean up error messages and pass them to next(), I wrap passport.authenticate in a closure with (req, res, next) and provide a custom callback.

__JWT strategy__

Unlike local strategy, if the token is missing, the callback runs with an error as the info parameter. If the token is invalid, the error is an JsonWebTokenError. If no token is provided, it's a plain Error. Again, I need a custom callback.

There is no need to query the DB for the user during verification. Token payload can be passed to other handlers that will query the DB if needed => better perf. Invalidate the token on ban/deletion instead of on re-checking the user in the DB on every request.

# Error handling

https://stackoverflow.com/questions/28793098
https://wanago.io/2018/12/17/typescript-express-error-handling-validation/
https://gist.github.com/zcaceres/2854ef613751563a3b506fabce4501fd