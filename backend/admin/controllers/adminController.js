// Example admin controller
exports.getAdminDashboard = (req, res) => {
  if (req.user && req.user.role === 'admin') {
    return res.json({ message: 'Welcome to the admin dashboard!' });
  }
  res.status(403).json({ message: 'Admin access required' });
};
