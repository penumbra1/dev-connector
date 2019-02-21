import { Request, Response, NextFunction, RequestHandler } from "express";
import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import UserModel from "./models/User";
import { AuthenticationError } from "./errors";

const secret = process.env.JWT_SECRET;
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: secret
};

const jwtStrategy = new JwtStrategy(
  jwtOptions,
  ({ sub }, done) =>
    UserModel.findById(sub) // TODO: move this to actual route handlers for perf
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

// Passport returns err only if authenticate() failed to execute.
// If it ran but the credentials were wrong, err is null, user is false,
// and Passport sends a 401 to the client, bypassing other middleware.
// To send errors to the error handler via next(),
// passport.authenticate needs a closure with (req, res, next).
const authenticate = (
  strategy: string,
  errorMessage: string,
  options: passport.AuthenticateOptions = { session: false }
): RequestHandler => (req: Request, res: Response, next: NextFunction) =>
  passport.authenticate(strategy, options, (err, user) => {
    if (err) {
      return next(err); // Server-side error
    }
    if (!user) {
      return next(new AuthenticationError({ error: errorMessage }));
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
  jwt: authenticate(
    "jwt",
    "Invalid authentication token: please log out and back in again."
  ),
  local: authenticate("local", "Your email and password do not match.")
};

export default authenticator;
