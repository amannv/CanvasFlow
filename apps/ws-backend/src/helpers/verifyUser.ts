 import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET;

 export const verifiedUser = (token: string): number | null => {
  try {
    const verified = jwt.verify(token, JWT_SECRET as string) as {
      userId: number;
    };

    if (!verified || !verified.userId) {
      return null;
    }

    return verified.userId;
  } catch (e) {
    console.error("Unauthorized user!");
    return null;
  }
};