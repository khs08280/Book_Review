import mongoose from "mongoose";
import bcrypt from "bcrypt";

const saltRounds = 10;

const userSchema = mongoose.Schema({
  username: {
    type: String,
    minlength: 6,
    maxlength: 16,
    unique: 1,
    required: true,
  },
  email: {
    type: String,
    trim: true,
    unique: 1,
    required: true,
  },
  password: {
    type: String,
    minlength: 6,
    required: true,
  },
  nickname: {
    type: String,
    unique: 1,
    maxlength: 8,
    required: true,
  },
  role: {
    type: Number,
    default: 0, // 0은 일반 유저, 1은 관리자
  },
  image: String,
  refreshToken: {
    type: String,
  },
  introduction: String,
  review: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
  communityArticles: [
    { type: mongoose.Schema.Types.ObjectId, ref: "CommunityArticle" },
  ],
  communityComments: [
    { type: mongoose.Schema.Types.ObjectId, ref: "CommunityComment" },
  ],
  recommendedBooks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],
  oneLineRecommends: [{ type: mongoose.Schema.Types.ObjectId, ref: "OneLine" }],
});

userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hashed = await bcrypt.hash(user.password, salt);
    user.password = hashed;
    next();
  } catch (err) {
    return next(err);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  const user = this;

  const isMatch = await bcrypt.compare(candidatePassword, user.password);
  return isMatch;
};

const User = mongoose.model("User", userSchema, "users");
export default User;
