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
  if (username.length < 6 || username.length > 16) {
    return res.status(400).json({
      error: "아이디는 6글자 이상, 16글자 이하여야 합니다",
      success: false,
    });
  }
  if (password.length < 6) {
    return res
      .status(400)
      .json({ error: "비밀번호는 6글자 이상이어야 합니다", success: false });
  }
  if (nickname.length > 8) {
    return res
      .status(400)
      .json({ error: "닉네임은 8글자 이하여야 합니다.", success: false });
  }

  try {
    const existingUsername = await User.findOne({ username });
    const existingEmail = await User.findOne({ email });
    if (existingUsername) {
      return res.status(400).json({
        success: false,
        error: "이미 존재하는 아이디입니다.",
      });
    }
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        error: "이미 존재하는 이메일입니다.",
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
    return res
      .status(500)
      .json({ success: false, error: "회원가입 중 에러 발생" });
  }
};

export const login = async (req, res) => {
  const { username, password, ...otherData } = req.body;
  if (Object.keys(otherData).length !== 0) {
    return res.status(400).json({
      loginSuccess: false,
      error: "유효하지 않은 데이터가 포함되어 있습니다.",
    });
  }
  if (!username || !password) {
    return res
      .status(400)
      .json({ loginSuccess: false, error: "모든 정보를 입력해주세요." });
  }

  try {
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(400).json({
        loginSuccess: false,
        error: "존재하지 않는 아이디입니다",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        loginSuccess: false,
        error: "비밀번호가 틀렸습니다.",
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
    return res.status(500).json({ loginSuccess: false, error: "서버 에러" });
  }
};

export const logout = async (req, res) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, error: "로그인되지 않았습니다." });
    }

    await User.findOneAndUpdate({ _id: req.user._id }, { token: "" });
    res.clearCookie("x_auth");

    return res
      .status(200)
      .json({ success: true, message: "로그아웃에 성공했습니다." });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, error: "로그아웃 도중 에러 발생" });
  }
};
