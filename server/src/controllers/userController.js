import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import passport from "passport";
import dotenv from "dotenv";
dotenv.config();

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
      .json({ success: false, error: "회원가입 중 에러가 발생했습니다" });
  }
};

export const login = async (req, res) => {
  passport.authenticate("local", (authError, user, info) => {
    if (authError) {
      console.error(authError);
      return res
        .status(500)
        .json({ success: false, error: "인증 중 오류가 발생했습니다." });
    }
    if (!user) {
      return res.status(401).json({ success: false, error: info.message });
    }
    return req.login(user, async (loginError) => {
      if (loginError) {
        console.error(loginError);
        return res
          .status(500)
          .json({ success: false, error: "로그인 중 오류가 발생했습니다." });
      }
      const accessToken = jwt.sign(
        {
          username: user.username,
          userId: user._id,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "30m",
        }
      );
      const refreshToken = jwt.sign({}, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      user.refreshToken = refreshToken;
      await user.save();
      res.cookie("refreshToken", refreshToken, {
        maxAge: 24 * 60 * 60 * 1000,
        path: "/",
      });
      return res.status(200).json({
        success: true,
        accessToken,
      });
    });
  })(req, res);
};

export const logout = async (req, res) => {
  req.logout(function (err) {
    if (err) {
      return res.status(500).send("로그아웃 중에 오류가 발생했습니다.");
    }
    req.session.destroy();
    res.status(200).send("로그아웃에 성공했습니다.");
  });
};

export const myInfo = async (req, res) => {
  const userId = req.user._id;

  if (!userId) {
    return res.status(400).json({ error: "올바른 요청이 아닙니다." });
  }

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "유저를 찾을 수 없습니다" });
      }
      res.status(200).json({ data: user });
    })
    .catch((err) => {
      console.error("Error fetching user:", err);
      res
        .status(500)
        .json({ error: "유저 데이터를 불러오는 중 에러가 발생했습니다" });
    });
};

export const deleteAccount = async (req, res) => {
  const { userId, password, ...otherData } = req.body;

  if (Object.keys(otherData).length !== 0) {
    return res.status(400).json({
      success: false,
      error: "유효하지 않은 데이터가 포함되어 있습니다.",
    });
  }
  try {
    if (!userId || !password) {
      return res.status(400).json({
        success: false,
        message: "사용자 ID와 비밀번호를 입력해주세요.",
      });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "해당 사용자를 찾을 수 없습니다." });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "비밀번호가 잘못되었습니다." });
    }

    await user.deleteOne();

    res
      .status(200)
      .json({ success: true, message: "계정이 성공적으로 삭제되었습니다." });
  } catch (error) {
    console.error("계정 삭제 중 오류:", error);
    res
      .status(500)
      .json({ success: false, error: "서버 오류가 발생했습니다." });
  }
};

export const updateIntroduce = async (req, res) => {
  const { content, userId, ...otherData } = req.body;
  if (Object.keys(otherData).length !== 0) {
    return res.status(400).json({
      success: false,
      error: "유효하지 않은 데이터가 포함되어 있습니다.",
    });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, error: "사용자를 찾을 수 없습니다." });
    }

    user.introduction = content;
    await user.save();

    res.status(200).json({
      success: true,
      message: "자기소개가 성공적으로 수정되었습니다.",
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, error: "자기소개 수정 중 오류가 발생했습니다" });
  }
};

export const updatePassword = async (req, res) => {
  const { password, checkPassword, newPassword, userId, ...otherData } =
    req.body;

  if (Object.keys(otherData).length !== 0) {
    return res.status(400).json({
      success: false,
      error: "유효하지 않은 데이터가 포함되어 있습니다.",
    });
  }

  if (password !== checkPassword) {
    return res.status(400).json({
      success: false,
      error: "비밀번호와 비밀번호확인이 다릅니다.",
    });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, error: "사용자를 찾을 수 없습니다." });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        error: "현재 비밀번호가 일치하지 않습니다.",
      });
    }
    if (password === newPassword) {
      return res.status(400).json({
        success: false,
        error: "새로운 비밀번호는 현재 비밀번호와 동일할 수 없습니다.",
      });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "비밀번호가 성공적으로 수정되었습니다.",
    });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ success: false, error: "비밀번호 수정 중 에러가 발생했습니다." });
  }
};

export const reAccessToken = async (req, res) => {
  try {
    if (!req.headers.authorization) {
      return res
        .status(400)
        .json({ error: "요청에 필요한 refreshToken이 없습니다." });
    }

    const refreshToken = req.headers.authorization.split("Bearer ")[1];

    const user = await User.findOne({ refreshToken });
    if (!user) {
      return res
        .status(400)
        .json({ error: "요청 토큰에 일치하는 유저가 없습니다." });
    }
    const currentTime = new Date();
    const tokenExpiration = new Date(user.refreshToken.expiresAt);

    if (currentTime > tokenExpiration) {
      req.logout();
      req.session.destroy();
      return res.status(401).json({ error: "만료된 refreshToken입니다." });
    }
    const newAccessToken = jwt.sign(
      {
        username: user.username,
        userId: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "30m",
      }
    );
    return res
      .status(200)
      .json({ message: "refresh 성공", success: true, newAccessToken });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "토큰 재발급 요청 중 에러가 발생했습니다." });
  }
};
