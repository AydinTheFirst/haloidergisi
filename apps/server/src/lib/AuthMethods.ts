import passport, { DoneCallback } from "passport";
import { Strategy as Local } from "passport-local";
import { Strategy as Bearer } from "passport-http-bearer";
import bcrypt from "bcrypt";
import { UserModel } from "@/database/UserSchema";

passport.use(
  new Local(async (username: string, password: string, done: any) => {
    const user = await UserModel.findOne({ email: username });

    if (!user) return done(null, false, "Invalid username or password!");

    if (!user.password) {
      user.password = await bcrypt.hash(password, 10);
      await user.save();
    }

    const ok = await bcrypt.compare(password, user.password);

    if (!ok) {
      return done(null, false, "Invalid username or password!");
    }

    // Success
    done(null, user);
  })
);

passport.use(
  new Bearer(async (token: string, done: DoneCallback) => {
    const user = await UserModel.findOne({ token });
    if (!user) {
      return done(null, false);
    }
    return done(null, user);
  })
);
