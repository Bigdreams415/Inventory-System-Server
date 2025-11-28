import { Router } from 'express';
import { SaleController } from '../controllers/saleController';
import { dbService } from '../models/database';
import { AuthMiddleware } from '../middleware/authMiddleware';

const router = Router();

// ========== MAIN SALES ROUTES ==========

// POST /api/sales - Create new sale
router.post('/', SaleController.createSale);
  
// GET /api/sales - Get all sales with pagination
router.get('/', AuthMiddleware.requireAuth, SaleController.getSales);

// GET /api/sales/today - Get today's sales with summary
router.get('/today', AuthMiddleware.requireAuth, SaleController.getTodaySales);

// GET /api/sales/date-range - Get sales by date range
router.get('/by-date', AuthMiddleware.requireAuth, SaleController.getSalesBySpecificDate);

// GET /api/sales/:id - Get sale by ID with items
router.get('/:id', AuthMiddleware.requireAuth, SaleController.getSaleById);


// POST /api/sales/:id/refund - Refund a sale
router.post('/:id/refund', SaleController.refundSale);



export default router;