const jwt = require("jsonwebtoken");

const roles = {
  ADMIN: "Admin",
  OPERATOR: "Operator",
  PICKER: "Picker",
  CHECKER: "Checker",
  DISPATCHER: "Dispatcher",
};

const permissions = {
  [roles.ADMIN]: ["*"],
  [roles.OPERATOR]: ["receiving", "putaway", "inventory_view"],
  [roles.PICKER]: ["picking", "inventory_view"],
  [roles.CHECKER]: ["quality_check", "inventory_view"],
  [roles.DISPATCHER]: ["dispatch", "inventory_view"],
};

const authorize = (requiredPermission) => {
  return (req, res, next) => {
    const user = req.user; // Set by auth middleware

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userPermissions = permissions[user.role] || [];

    if (
      userPermissions.includes("*") ||
      userPermissions.includes(requiredPermission)
    ) {
      return next();
    }

    return res
      .status(403)
      .json({
        error: "Forbidden: You do not have permission to perform this action",
      });
  };
};

module.exports = { roles, authorize };
