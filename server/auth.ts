import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import { Request, Response, NextFunction } from "express";
import UserModel from "./models/User";
import { ClientError } from "./errorHandler";

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET!
};
const jwtStrategy = new JwtStrategy(
  jwtOptions,
  ({ sub }, done) =>
    UserModel.findById(sub)
      .then(user => done(null, user))
      .catch(done) // Server-side error
);

const localStrategy = new LocalStrategy(
  { usernameField: "email" },
  async (email, password, done) => {
    try {
      const user = await UserModel.findOne({ email });
      const match = user && (await bcrypt.compare(password, user.password));
      return done(null, match && user);
    } catch (e) {
      done(e); // Server-side error
    }
  }
);

// If auth fails, passport sends a 401 to the client, bypassing other middleware.
// To send errors to the error handling middleware via next(),
// passport.authenticate needs a request handler closure.
const authenticate = (
  strategy: string,
  options: passport.AuthenticateOptions,
  message: string
) => (req: Request, res: Response, next: NextFunction) =>
  passport.authenticate(strategy, options, (err, user) => {
    if (err) {
      // Server-side error
      return next(err);
    }
    if (!user) {
      return next(new ClientError(message, 401));
    }
    req.user = user.id;
    next();
  })(req, res, next);

const authenticator = {
  initialize() {
    passport.use("jwt", jwtStrategy);
    passport.use("local", localStrategy);
    return passport.initialize();
  },
  jwt: authenticate("jwt", { session: false }, "Invalid authentication token"),
  local: authenticate("local", { session: false }, "Invalid credentials")
};

export default authenticator;
