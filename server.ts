import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './server/routes/authRoutes.ts';
import transactionRoutes from './server/routes/transactionRoutes.ts';
import analyticsRoutes from './server/routes/analyticsRoutes.ts';
import budgetRoutes from './server/routes/budgetRoutes.ts';
import categoryRoutes from './server/routes/categoryRoutes.ts';
import { errorHandler } from './server/middleware/errorHandler.ts';
import { seedInitialData } from './server/services/seedService.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || '3000', 10);

  // Initialize DB and Seed data
  await seedInitialData();

  app.use(express.json());

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/transactions', transactionRoutes);
  app.use('/api/analytics', analyticsRoutes);
  app.use('/api/budgets', budgetRoutes);
  app.use('/api/categories', categoryRoutes);

  // Health check endpoint
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'healthy', app: 'Ledgerly', timestamp: new Date().toISOString() });
  });

  // Error handling middleware for APIs
  app.use(errorHandler);

  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Ledgerly Server] Running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
