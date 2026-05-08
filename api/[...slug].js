const app = require('../backend/server');

export default (req, res) => {
  return app(req, res);
};
