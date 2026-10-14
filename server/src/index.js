import 'dotenv/config';
import app from './app.js';
import dns from 'node:dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);
import { connectDB } from './config/db.js';
console.log("MONGO_URI loaded:", !!process.env.MONGO_URI);
const PORT = process.env.PORT || 4000;

async function bootstrap() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`API listening on http://localhost:${PORT}`);
  });
}
bootstrap();
