import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import dotenv from 'dotenv';

const envPath = path.resolve(process.cwd(), '.env');
console.log('Loading .env from:', envPath);
dotenv.config({ path: envPath });

console.log('DATABASE_URL loaded:', !!process.env.DATABASE_URL);
console.log('NODE_ENV loaded:', process.env.NODE_ENV);

import { dbService } from './models/database';
import { PharmacyMiddleware } from './middleware/pharmacyMiddleware';
import productRoutes from './routes/products';
import saleRoutes from './routes/sales';
import dashboardRoutes from './routes/dashboard';
import servicesRoutes from './routes/services';
import serviceSalesRoutes from './routes/serviceSales';
import authRoutes from './routes/auth';
import pharmacyRoutes from './routes/pharmacyRoutes';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', PharmacyMiddleware.setPharmacyFromRequest);

app.get('/api/pharmacy/current', PharmacyMiddleware.getCurrentPharmacy);
app.post('/api/pharmacy/switch', PharmacyMiddleware.switchPharmacy);
app.get('/api/pharmacy/all', PharmacyMiddleware.getAllPharmacies);

async function startServer() {
  try {
    await dbService.connect();
    console.log('Database connected successfully');

    app.use('/api/pharmacies', pharmacyRoutes);
    app.use('/api/products', productRoutes);
    app.use('/api/sales', saleRoutes);
    app.use('/api/dashboard', dashboardRoutes);
    app.use('/api/services', servicesRoutes);
    app.use('/api/service-sales', serviceSalesRoutes);
    app.use('/api/auth', authRoutes);

    app.get('/api/health', (_req, res) => {
      res.json({ 
        success: true, 
        message: 'POS Server is running', 
        timestamp: new Date().toISOString() 
      });
    });

    app.get('/api', (_req, res) => {
      res.json({
        success: true,
        message: 'POS Inventory System API',
        version: '1.0.0',
        endpoints: {
          products: '/api/products',
          sales: '/api/sales',
          dashboard: '/api/dashboard',
          pharmacies: '/api/pharmacies',
          services: '/api/services',
          'service-sales': '/api/service-sales',
          pharmacy: {
            current: '/api/pharmacy/current',
            switch: '/api/pharmacy/switch',
            all: '/api/pharmacy/all'
          },
          health: '/api/health'
        }
      });
    });

    app.get('/', (_req, res) => {
      res.redirect('/api');
    });

    app.use((req, res) => {
      if (req.originalUrl.startsWith('/api/')) {
        res.status(404).json({
          success: false,
          error: 'API endpoint not found',
          path: req.originalUrl
        });
      } else {
        res.redirect('/api');
      }
    });

    app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
      console.error('Error:', err);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
      });
    });

    app.listen(PORT, () => {
      console.log(`POS Server running on http://localhost:${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/api/health`);
      console.log(`API Base: http://localhost:${PORT}/api`);
      console.log(`Current pharmacy: http://localhost:${PORT}/api/pharmacy/current`);
      console.log(`All pharmacies: http://localhost:${PORT}/api/pharmacy/all`);
      console.log(`Pharmacy CRUD: http://localhost:${PORT}/api/pharmacies`);
      console.log(`Services: http://localhost:${PORT}/api/services`);
      console.log(`Service Sales: http://localhost:${PORT}/api/service-sales`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

process.on('SIGINT', async () => {
  console.log('\nShutting down server gracefully...');
  try {
    await dbService.close();
    console.log('Database connection closed');
    process.exit(0);
  } catch (err) {
    console.error('Error during shutdown:', err);
    process.exit(1);
  }
});

process.on('SIGTERM', async () => {
  console.log('\nShutting down server gracefully...');
  try {
    await dbService.close();
    console.log('Database connection closed');
    process.exit(0);
  } catch (err) {
    console.error('Error during shutdown:', err);
    process.exit(1);
  }
});

startServer();