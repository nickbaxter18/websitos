module.exports = {
  get: (_url, cb) => {
    cb({ on: () => {}, pipe: () => {} });
    return { on: () => {} };
  },
};
