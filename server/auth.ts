import { Request, Response, NextFunction } from "express";
import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import UserModel from "./models/User";
import { AuthenticationError, ClientError } from "./errors";

const secret = process.env.JWT_SECRET;
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: secret
};

// Note: there is no need to check if the user exists here (which is a perf hit).
// A user who provides a valid token definitely exists (has logged in before).
// If a user is deleted, all their tokens must be revoked.
const jwtStrategy = new JwtStrategy(jwtOptions, ({ sub }, done) =>
  done(null, sub)
);

const localStrategy = new LocalStrategy(
  {
    usernameField: "email"
  },
  async (email, password, done) => {
    try {
      const user = await UserModel.findOne({ email });
      const match = user && (await bcrypt.compare(password, user.password));
      return done(null, match && user, {
        message: "Your email and password do not match."
      });
    } catch (e) {
      done(e); // Server-side error
    }
  }
);

const authenticator = {
  initialize() {
    passport.use("jwt", jwtStrategy);
    passport.use("local", localStrategy);
    return passport.initialize();
  },
  jwt: (req: Request, res: Response, next: NextFunction) =>
    passport.authenticate("jwt", { session: false }, (err, user, info) => {
      if (err) {
        return next(err); // Server-side error
      }
      if (!user && info) {
        // Info contains the error object - both if token was not provided
        // and if the provided token was invalid
        return next(
          new AuthenticationError(
            "Invalid authentication token: please log out and back in again."
          )
        );
      }

      req.user = user; // user is the data encoded in the token (i.e. the id)
      next();
    })(req, res, next),
  local: (req: Request, res: Response, next: NextFunction) =>
    passport.authenticate("local", { session: false }, (err, user, info) => {
      if (err) {
        return next(err); // Server-side error
      }
      // Check for missing credentials - otherwise Passport will fail silently
      const { email, password } = req.body;
      if (!email || !password) {
        const errorsForClient = {
          ...(!email && { email: "Please provide your email" }),
          ...(!password && { password: "Please provide your password" })
        };
        return next(new ClientError(errorsForClient));
      }
      if (!user) {
        return next(new AuthenticationError(info.message));
      }
      req.user = user.id;
      next();
    })(req, res, next)
};

export default authenticator;
