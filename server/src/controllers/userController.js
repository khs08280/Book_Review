import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const join = async (req, res) => {
  const { username, email, password, nickname } = req.body;

  if (!username || !email || !password || !nickname) {
    return res
      .status(400)
      .json({ success: false, message: "모든 정보를 입력해주세요." });
  }

  try {
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "이미 존재하는 아이디 혹은 이메일입니다.",
      });
    }
    const newUser = new User({
      username,
      email,
      password,
      nickname,
    });
    await newUser.save();

    return res
      .status(201)
      .json({ success: true, message: "회원가입이 완료되었습니다." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "서버 에러" });
  }
};

export const login = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "존재하지 않는 아이디입니다",
      });
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.json({
        loginSuccess: false,
        message: "비밀번호가 틀렸습니다.",
      });
    }

    const token = jwt.sign({ userId: user._id }, "secretToken", {
      expiresIn: "1h",
    });

    user.token = token;
    await user.save();

    res.cookie("x_auth", token, { httpOnly: true }).status(200).json({
      loginSuccess: true,
      userId: user._id,
      token,
      message: "로그인 성공",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "서버 에러" });
  }
};

export const logout = (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, { token: "" })
    .then((user) => {
      return res
        .status(200)
        .send({ success: true, message: "로그아웃에 성공했습니다." });
    })
    .catch((err) => {
      if (err) return res.json({ success: false, err });
    });
};
