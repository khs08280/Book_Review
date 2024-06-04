import jwt from "jsonwebtoken";
import User from "../models/user.js";
import passport from "passport";
import dotenv from "dotenv";
import Rating from "../models/rating.js";
import Review from "../models/review.js";

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
      return res.status(400).send({
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
          expiresIn: "5m",
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
      return res.status(500).send(err);
    }
    req.session.destroy();
    res.status(200).send("로그아웃에 성공했습니다.");
  });
};

export const myInfo = async (req, res) => {
  try {
    const userId = req.user._id;

    if (!userId) {
      return res.status(400).json({ error: "올바른 요청이 아닙니다." });
    }

    const user = await User.findById(userId)
      .select("-token -refreshToken -password -_id")
      .populate({
        path: "review",
        populate: {
          path: "book",
          select: "title",
        },
      });
    if (!user) {
      return res.status(404).json({ error: "유저를 찾을 수 없습니다" });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    res
      .status(500)
      .json({ error: "유저 데이터를 불러오는 중 에러가 발생했습니다" });
  }
};

export const deleteAccount = async (req, res) => {
  const { password, ...otherData } = req.body;
  const userId = req.user._id;

  if (Object.keys(otherData).length !== 0) {
    return res.status(400).json({
      message: "유효하지 않은 데이터가 포함되어 있습니다.",
    });
  }
  try {
    if (!userId || !password) {
      return res.status(400).json({
        message: "사용자 ID와 비밀번호를 입력해주세요.",
      });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ message: "해당 사용자를 찾을 수 없습니다." });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "비밀번호가 잘못되었습니다." });
    }

    await User.findByIdAndDelete(userId);
    await Rating.deleteMany({ author: userId });
    await Review.deleteMany({ author: userId });

    res.status(200).json({ message: "계정이 성공적으로 삭제되었습니다." });
  } catch (error) {
    console.error("계정 삭제 중 오류:", error);
    res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
};

export const updateIntroduce = async (req, res) => {
  const { content, ...otherData } = req.body;
  const userId = req.user._id;
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
  const { password, checkPassword, newPassword, ...otherData } = req.body;
  const userId = req.user._id;

  if (Object.keys(otherData).length !== 0) {
    return res.status(400).json({
      message: "유효하지 않은 데이터가 포함되어 있습니다.",
    });
  }

  if (password !== checkPassword) {
    return res.status(400).json({
      message: "비밀번호와 비밀번호확인이 다릅니다.",
    });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({
        message: "현재 비밀번호가 일치하지 않습니다.",
      });
    }
    if (password === newPassword) {
      return res.status(400).json({
        message: "새로운 비밀번호는 현재 비밀번호와 동일할 수 없습니다.",
      });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      message: "비밀번호가 성공적으로 수정되었습니다.",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "비밀번호 수정 중 에러가 발생했습니다." });
  }
};

export const reAccessToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  try {
    if (!refreshToken) {
      return res
        .status(400)
        .json({ error: "요청에 필요한 refreshToken이 없습니다." });
    }

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
        expiresIn: "5m",
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

export const refreshToLogin = async (req, res) => {
  try {
    if (!req.cookies.refreshToken) {
      return res
        .status(400)
        .json({ error: "요청에 필요한 refreshToken이 없습니다." });
    }

    const refreshToken = req.cookies.refreshToken;

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
    req.login(user, (err) => {
      if (err) {
        return res
          .status(403)
          .json({ error: "세션 갱신 중 에러가 발생했습니다." });
      }
      return res
        .status(200)
        .json({ message: "refresh로 passport 로그인 성공", success: true });
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "토큰 재발급 요청 중 에러가 발생했습니다." });
  }
};

export const followUser = async (req, res) => {
  const { targetUserId } = req.params;
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);
    const targetUser = await User.findById(targetUserId);

    if (!user || !targetUser) {
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }
    if (user.followings.includes(targetUserId)) {
      return res.status(404).json({ message: "이미 팔로우 중 입니다" });
    }

    user.followings.push(targetUserId);
    targetUser.followers.push(userId);

    await user.save();
    await targetUser.save();

    res.status(200).json({ message: "팔로우 성공", user, targetUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const unfollowUser = async (req, res) => {
  const { userId, targetUserId } = req.params;

  try {
    const user = await User.findById(userId);
    const targetUser = await User.findById(targetUserId);

    if (!user || !targetUser) {
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }

    user.following = user.following.filter(
      (id) => id.toString() !== targetUserId
    );
    targetUser.followers = targetUser.followers.filter(
      (id) => id.toString() !== userId
    );

    await user.save();
    await targetUser.save();

    res.status(200).json({ message: "언팔로우 성공", user, targetUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
