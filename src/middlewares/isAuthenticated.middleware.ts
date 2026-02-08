import { Request, Response, NextFunction } from "express";
import { UnauthorizedException } from "../utils/appError";

const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  console.log("Checking Authentication...");
  // console.log("Cookies:", req.session); 
  console.log("User in session:", req.user);

  if (!req.user || !req.user._id) {
    console.log("Authentication Failed: No user found in session.");
    throw new UnauthorizedException("Unauthorized. Please log in.");
  }
  next();
};

export default isAuthenticated;
