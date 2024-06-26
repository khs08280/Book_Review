import jwt, { JwtPayload } from "jsonwebtoken";

export const isExpired = async (accessToken: string | null) => {
  if (accessToken !== null) {
    const decoded = jwt.decode(accessToken) as JwtPayload;

    if (decoded.exp !== undefined) {
      const expirationTime = decoded.exp * 1000;
      const currentTimeDate = new Date();
      const currentTime = currentTimeDate.getTime();

      if (expirationTime > currentTime) {
        console.log("만료 안됨");
        return false;
      } else {
        const response = await fetch(
          "https://bookreviewserver.shop/api/users/refresh",
          {
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          },
        );
        const data = await response.json();
        if (!response.ok) {
          console.log("refreshToken이 만료되거나 해서 재발급 실패");
          return true;
        }
        localStorage.setItem("accessToken", data.newAccessToken);
        console.log("토큰 새로 발급함");
        return false;
      }
    } else {
      console.log("토큰에 만료 시간이 없습니다.");
      return true;
    }
  } else {
    console.log("accessToken이 이상해요");
    return true;
  }
};

export const getUserId = async (
  accessToken: string | null,
): Promise<string | null> => {
  isExpired(accessToken);
  if (accessToken !== null) {
    const decoded = jwt.decode(accessToken) as JwtPayload;

    return decoded.userId;
  }

  return null;
};
