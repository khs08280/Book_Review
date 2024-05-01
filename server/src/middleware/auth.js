import jwt from "jsonwebtoken";
import User from "../models/user.js";

const auth = (req, res, next) => {
  const token = req.cookies.x_auth;
  if (!token) {
    return res.json({ isAuth: false, error: true });
  }
  jwt.verify(token, "secretToken", (err, decoded) => {
    if (err) {
      return res.json({ isAuth: false, error: true });
    }
    User.findOne({ _id: decoded.userId })
      .then((user) => {
        if (!user) {
          return res.json({
            isAuth: false,
            error: true,
            message: "유저를 찾을 수 없습니다",
          });
        }
        req.token = token;
        req.user = user;
        next();
      })
      .catch((err) => {
        console.log(err);
        return res.json({ isAuth: false, error: true });
      });
  });
};

export default auth;
