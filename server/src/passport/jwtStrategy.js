import dotenv from "dotenv";
import pkg from "passport-jwt";
import passport from "passport";
import User from "../models/user.js";
const { ExtractJwt, Strategy: JWTStrategy } = pkg;

dotenv.config();

const JWTConfig = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};
const JWTVerify = async (payload, done) => {
  try {
    const user = await User.findById(payload.userId);
    if (!user) {
      return done(null, false, {
        message: "토큰과 일치하는 사용자가 없습니다",
      });
    }
    return done(null, user);
  } catch (error) {
    return done(error, false);
  }
};

const jwtSt = () => {
  passport.use("jwt", new JWTStrategy(JWTConfig, JWTVerify));
};
export default jwtSt;
