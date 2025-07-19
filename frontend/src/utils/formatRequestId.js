// src/utils/formatRequestId.js

export const formatRequestId = (reqId) => {
  if (!reqId) return "";
  const [prefix, dateStr] = reqId.split("-");
  const year = dateStr?.slice(0, 4);
  const month = dateStr?.slice(4, 6);
  const day = dateStr?.slice(6, 8);
  return `${prefix} - ${day}/${month}/${year}`;
};
