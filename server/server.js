const app = require('./app');
const dotenv = require('dotenv');

dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 Study Resource Sharing Server running on port ${PORT}`);
  console.log(`👉 API Base URL: http://localhost:${PORT}/api`);
  console.log(`====================================================`);
});
