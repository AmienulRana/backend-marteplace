module.exports = {
  error: (res, status, message, customJson = {}) => {
    return res.status(status).json({ message, ...customJson });
  },
  success: (res, message, customJson = {}) => {
    return res.status(200).json({ message, ...customJson });
  },
};
