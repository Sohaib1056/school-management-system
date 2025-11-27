import http from 'http';
import app from './app.js';
import { loadEnv } from './config/env.js';

loadEnv();

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
server.listen(PORT, () => {
  console.log(`API server listening on port ${PORT}`);
});
