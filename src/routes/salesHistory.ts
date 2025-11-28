import { Router } from 'express';
import { SaleController } from '../controllers/saleController';


const router = Router();

// POST /api/sales - Create new sale
router.post('/', SaleController.createSale);
  
// GET /api/sales - Get all sales with pagination
router.get('/', SaleController.getSales);

// GET /api/sales/today - Get today's sales with summary
router.get('/today', SaleController.getTodaySales);

// GET /api/sales/:id - Get sale by ID with items
router.get('/:id', SaleController.getSaleById);

// POST /api/sales/:id/refund - Refund a sale
router.post('/:id/refund', SaleController.refundSale);

export default router;