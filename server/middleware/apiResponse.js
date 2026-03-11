function errorResponse(res, status, code, message, details) {
  const payload = { success: false, code, message };
  if (details !== undefined) payload.details = details;
  return res.status(status).json(payload);
}

module.exports = { errorResponse };
