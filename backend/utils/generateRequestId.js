module.exports = (count) => {
  const date = new Date();
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${yyyy}/${dd}${mm}/${String(count + 1).padStart(4, "0")}`;
};
