export const isLoggedIn = (req, res, next) => {
  console.log(req);
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(403).send("로그인이 필요합니다");
  }
};
export const isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    res.status(403).send("로그아웃을 해주세요");
  }
};
