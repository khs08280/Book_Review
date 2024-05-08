import passport from "passport";
import local from "./localStrategy.js";
import User from "../models/user.js";
import jwtSt from "./jwtStrategy.js";

const passportConfig = () => {
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  passport.deserializeUser((id, done) => {
    User.findById(id)
      .then((user) => {
        if (!user) {
          return done(null, false, { message: "사용자를 찾을 수 없습니다." });
        }
        return done(null, user);
      })
      .catch((err) => done(err));
  });
  local();
  jwtSt();
};
export default passportConfig;
