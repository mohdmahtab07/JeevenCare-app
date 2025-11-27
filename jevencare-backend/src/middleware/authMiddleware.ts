import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwtUtils";

export const protect = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,
        message: "Not authorized. No token provided.",
      });
      return;
    }

    const [, token] = authHeader.split(" ");

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Not authorized. Token missing.",
      });
      return;
    }

    const decoded = verifyAccessToken(token);
    if (!decoded) {
      res.status(401).json({
        success: false,
        message: "Not authorized. Invalid token.",
      });
      return;
    }

    (req as any).user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Not authorized",
    });
  }
};

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const userRole = (req as any).user.role;

    if (!roles.includes(userRole)) {
      res.status(403).json({
        success: false,
        message: `Role '${userRole}' is not authorized to access this resource`,
      });
      return;
    }

    next();
  };
};
