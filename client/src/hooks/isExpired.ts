import jwt, { JwtPayload } from "jsonwebtoken";
import { getCookie } from "../utils/react-cookie";

export const isExpired = async (accessToken: string | null) => {
  if (accessToken !== null) {
    const decoded = jwt.decode(accessToken) as JwtPayload;

    if (decoded.exp !== undefined) {
      const expirationTime = decoded.exp * 1000;
      const currentTimeDate = new Date();
      const currentTime = currentTimeDate.getTime();

      if (expirationTime > currentTime) {
        return false;
      } else {
        const refreshToken = getCookie("refreshToken");

        const response = await fetch(
          "http://localhost:5000/api/users/refresh",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${refreshToken}`,
            },
            credentials: "include",
          }
        );
        const responseData = await response.json();
        localStorage.setItem("accessToken", responseData.newAccessToken);
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