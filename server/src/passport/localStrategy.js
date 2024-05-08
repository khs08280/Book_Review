import passport from "passport";
import LocalStrategy from "passport-local";
import bcrypt from "bcrypt";
import User from "../models/user.js";

const loginCallback = async (username, password, done) => {
  try {
    const exUser = await User.findOne({ username });
    if (exUser) {
      const result = await bcrypt.compare(password, exUser.password);
      if (result) {
        done(null, exUser);
      } else {
        done(null, false, { message: "비밀번호가 일치하지 않습니다." });
      }
    } else {
      done(null, false, { message: "가입되지 않은 회원입니다." });
    }
  } catch (error) {
    console.error(error);
    done(error);
  }
};

const local = () => {
  passport.use(
    "local",
    new LocalStrategy(
      {
        usernameField: "username",
        passwordField: "password",
      },
      loginCallback
    )
  );
};
export default local;
