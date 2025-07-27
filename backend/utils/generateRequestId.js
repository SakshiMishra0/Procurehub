const Request = require("../models/Request");

module.exports = async (count, departmentCode = "") => {
  const date = new Date();
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();

  const requestCount = await Request.countDocuments();
  const paddedCount = String(count + 1).padStart(4, "0");

  const baseId = `${yyyy}/${dd}${mm}/${paddedCount}`;
  const dept = departmentCode.trim().toUpperCase();

  return dept ? `${baseId}-${dept}` : baseId;
};