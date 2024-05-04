import jwt from "jsonwebtoken";
import User from "../models/user.js";

const auth = (req, res, next) => {
  const token = req.cookies.x_auth;
  if (!token) {
    return res
      .status(403)
      .json({ isAuth: false, error: "만료되었거나 없는 토큰입니다" });
  }
  jwt.verify(token, "secretToken", (err, decoded) => {
    if (err) {
      return res
        .status(401)
        .json({ isAuth: false, error: "인증에 실패하였습니다" });
    }
    User.findOne({ _id: decoded.userId })
      .then((user) => {
        if (!user) {
          return res.status(404).json({
            isAuth: false,
            error: "유저를 찾을 수 없습니다",
          });
        }
        req.token = token;
        req.user = user;
        next();
      })
      .catch((err) => {
        console.log(err);
        return res
          .status(401)
          .json({ isAuth: false, error: "토큰 인증 중 에러 발생" });
      });
  });
};

export default auth;
