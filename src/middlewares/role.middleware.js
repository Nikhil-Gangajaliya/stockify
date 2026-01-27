import { ApiError } from "../utils/ApiError.js";

export const authorizeRoles = (...allowedRoles) => {
  return (req, _, next) => {
    if (!req.user) {
      throw new ApiError(401, "User not authenticated");
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new ApiError(403, "You are not allowed to access this resource");
    }

    next();
  };
};
