const { errorResponse } = require('../../middleware/apiResponse');

function validateRequest(checks) {
  return (req, res, next) => {
    const details = [];

    for (const check of checks) {
      const source = check.in || 'body';
      const value = req[source] ? req[source][check.field] : undefined;

      if (check.required && (value === undefined || value === null || value === '')) {
        details.push({ field: check.field, issue: 'required' });
        continue;
      }

      if ((value === undefined || value === null || value === '') && !check.required) {
        continue;
      }

      if (check.validate && !check.validate(value, req)) {
        details.push({ field: check.field, issue: check.issue || 'invalid', value });
      }
    }

    if (details.length) {
      return errorResponse(res, 400, 'VALIDATION_ERROR', 'Request validation failed', details);
    }

    next();
  };
}

const isStringMin = (min) => (value) => typeof value === 'string' && value.trim().length >= min;
const isEmail = (value) => typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const isPositiveIntLike = (value) => {
  const n = Number.parseInt(value, 10);
  return Number.isInteger(n) && n > 0;
};

module.exports = {
  validateRequest,
  isStringMin,
  isEmail,
  isPositiveIntLike
};
