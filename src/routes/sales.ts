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

// GET /api/sales/:id - Get sale by ID with items
router.get('/:id', AuthMiddleware.requireAuth, SaleController.getSaleById);

// GET /api/sales/date-range - Get sales by date range
router.get('/date-range', AuthMiddleware.requireAuth, SaleController.getSalesByDateRange);

// POST /api/sales/:id/refund - Refund a sale
router.post('/:id/refund', SaleController.refundSale);

// ========== DEBUG ROUTES (PostgreSQL compatible) ==========

// DEBUG: Check specific products by IDs
// router.get('/debug/check-products', async (req, res) => {
//   try {
//     const { productIds } = req.query;
    
//     if (!productIds || typeof productIds !== 'string') {
//       return res.status(400).json({
//         success: false,
//         error: 'productIds parameter is required'
//       });
//     }

//     const ids = productIds.split(',');
//     const placeholders = ids.map((_, index) => `$${index + 1}`).join(',');
    
//     const products = await dbService.all(
//       `SELECT id, name, stock, buy_price, sell_price FROM products WHERE id IN (${placeholders})`,
//       ids
//     ) as Array<{ id: string; name: string; stock: number; buy_price: number; sell_price: number }>;

//     const foundIds = products.map(p => p.id);
//     const missingIds = ids.filter(id => !foundIds.includes(id));

//     res.json({
//       success: true,
//       data: {
//         requestedIds: ids,
//         foundProducts: products,
//         missingIds: missingIds,
//         totalRequested: ids.length,
//         totalFound: products.length,
//         totalMissing: missingIds.length
//       }
//     });
//   } catch (error) {
//     console.error('Debug error:', error);
//     res.status(500).json({
//       success: false,
//       error: 'Failed to check products'
//     });
//   }
// });

// DEBUG: Get all products (for comparison)
// router.get('/debug/all-products', async (_req, res) => {
//   try {
//     const products = await dbService.all(`
//       SELECT id, name, stock, buy_price, sell_price, created_at 
//       FROM products 
//       ORDER BY created_at DESC
//     `);
    
//     res.json({
//       success: true,
//       data: products
//     });
//   } catch (error) {
//     console.error('Debug error:', error);
//     res.status(500).json({
//       success: false,
//       error: 'Failed to fetch products'
//     });
//   }
// });

// DEBUG: Check database schema (PostgreSQL version)

// router.get('/debug/schema', async (_req, res) => {
//   try {
//     const tables = await dbService.all(`
//       SELECT table_name as name 
//       FROM information_schema.tables 
//       WHERE table_schema = 'public' 
//       ORDER BY table_name
//     `);
    
//     res.json({
//       success: true,
//       data: tables
//     });
//   } catch (error) {
//     console.error('Debug error:', error);
//     res.status(500).json({
//       success: false,
//       error: 'Failed to fetch schema'
//     });
//   }
// });

// DEBUG: Check table structure for a specific table
// router.get('/debug/table-structure/:tableName', async (req, res) => {
//   try {
//     const { tableName } = req.params;
    
//     const columns = await dbService.all(`
//       SELECT 
//         column_name as name,
//         data_type as type,
//         is_nullable,
//         column_default
//       FROM information_schema.columns 
//       WHERE table_schema = 'public' AND table_name = $1
//       ORDER BY ordinal_position
//     `, [tableName]);
    
//     res.json({
//       success: true,
//       data: {
//         tableName,
//         columns
//       }
//     });
//   } catch (error) {
//     console.error('Debug error:', error);
//     res.status(500).json({
//       success: false,
//       error: 'Failed to fetch table structure'
//     });
//   }
// });

export default router;