import passport from "passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { Request, Response, NextFunction } from "express";
import UserModel from "./models/User";
import { ClientError } from "./errorHandler";

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET!
};
const jwtStrategy = new Strategy(jwtOptions, ({ sub }, done) => {
  UserModel.findById(sub, (err, user) => {
    if (err) {
      // Server-side error
      return done(err);
    }
    if (!user) {
      return done(null, false);
    }
    return done(null, true);
  });
});

interface ClientErrorOptions {
  message: string;
  status: number;
}

// If auth fails, passport sends a 401 to the client, bypassing other middleware.
// To send errors to the error handling middleware via next(),
// passport.authenticate needs a request handler closure.
const authenticate = (
  strategy: string,
  options: passport.AuthenticateOptions,
  { message, status }: ClientErrorOptions
) => (req: Request, res: Response, next: NextFunction) =>
  passport.authenticate(strategy, options, (err, user) => {
    if (err) {
      // Server-side error
      return next(err);
    }
    if (!user) {
      return next(new ClientError(message, status));
    }
    next();
  })(req, res, next);

const authenticator = {
  initialize() {
    passport.use("jwt", jwtStrategy);
    return passport.initialize();
  },
  jwt: authenticate(
    "jwt",
    { session: false },
    { message: "Invalid authentication token", status: 401 }
  )
};

export { jwtStrategy, authenticator };
