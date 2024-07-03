import express, {
  json,
  urlencoded,
  Express,
  Request,
  Response,
  NextFunction,
  static as static_,
} from 'express';
import cors from 'cors';
import { join } from 'path';
import { PORT } from './config';
import { AuthRouter } from './routers/auth.router';
import { OrderRouter } from './routers/order.router';
import { StoreAdminRouter } from './routers/store-admin.router';
import { ProductRouter } from './routers/product.router';
import { StoreRouter } from './routers/store.router';
import { StoreProductRouter } from './routers/store-product.router';
import { CategoryRouter } from './routers/category.router';
import { StockJournalRouter } from './routers/stock-journal.router';
import { UserRouter } from './routers/user.router';
import { DiscountRouter } from './routers/discount.router';
import { AddressRouter } from './routers/address.router';
import { CartRouter } from './routers/cart.router';
import { DeliveryRouter } from './routers/delivery.router';
import { ReportRouter } from './routers/report.router';

export default class App {
  private app: Express;

  constructor() {
    this.app = express();
    this.configure();
    this.routes();
    this.handleError();
  }

  private configure(): void {
    this.app.use(cors());
    this.app.use(json());
    this.app.use(urlencoded({ extended: true }));
    this.app.use('/api/assets', static_(join(__dirname, '../public')));
  }

  private handleError(): void {
    // not found
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      if (req.path.includes('/api/')) {
        res.status(404).send('Not found !');
      } else {
        next();
      }
    });

    // error
    this.app.use(
      (err: Error, req: Request, res: Response, next: NextFunction) => {
        if (req.path.includes('/api/')) {
          console.error('Error : ', err.stack);
          res
            .status(500)
            .send(err.stack?.split('\n')[0].replace('Error: ', ''));
        } else {
          next();
        }
      },
    );
  }

  private routes(): void {
    const orderRouter = new OrderRouter();
    const authRouter = new AuthRouter();
    const storeAdminRouter = new StoreAdminRouter();
    const productRouter = new ProductRouter();
    const storeRouter = new StoreRouter();
    const storeProductRouter = new StoreProductRouter();
    const categoryRouter = new CategoryRouter();
    const stockJournalRouter = new StockJournalRouter();
    const userRouter = new UserRouter();
    const discountRouter = new DiscountRouter();
    // const voucherRouter = new VoucherRouter();
    const addressRouter = new AddressRouter();
    const cartRouter = new CartRouter();
    const deliveryRouter = new DeliveryRouter();
    const reportRouter = new ReportRouter();

    this.app.get('/api', (req: Request, res: Response) => {
      res.send(`Welcome to belanja.in API !`);
    });

    this.app.use('/api/orders', orderRouter.getRouter());
    this.app.use('/api/auth', authRouter.getRouter());
    this.app.use('/api/stores', storeRouter.getRouter());
    this.app.use('/api/store-admins', storeAdminRouter.getRouter());
    this.app.use('/api/store-products', storeProductRouter.getRouter());
    this.app.use('/api/products', productRouter.getRouter());
    this.app.use('/api/categories', categoryRouter.getRouter());
    this.app.use('/api/stock-journals', stockJournalRouter.getRouter());
    this.app.use('/api/users', userRouter.getRouter());
    this.app.use('/api/discounts', discountRouter.getRouter());
    // this.app.use('/api/vouchers', voucherRouter.getRouter());
    this.app.use('/api/address', addressRouter.getRouter());
    this.app.use('/api/carts', cartRouter.getRouter());
    this.app.use('/api/delivery', deliveryRouter.getRouter());
    this.app.use('/api/reports', reportRouter.getRouter());
  }

  public start(): void {
    this.app.listen(PORT, () => {
      console.log(`  ➜  [API] Local:   http://localhost:${PORT}/`);
    });
  }
}
