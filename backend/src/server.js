import app from './app.js';
import dotenv from 'dotenv';
import { testConnection } from './config/db.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', async () => {
  console.log(`Server is running on http://localhost:${PORT} and network interfaces on port ${PORT}`);
  await testConnection();
});
