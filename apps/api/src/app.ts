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
import { SampleRouter } from './routers/sample.router';
import { AuthRouter } from './routers/auth.router';
import { OrderRouter } from './routers/order.router';
import { StoreAdminRouter } from './routers/store-admin.router';
import { ProductRouter } from './routers/product.router';
import { StoreRouter } from './routers/store.router';
import { StoreProductRouter } from './routers/store-product.router';
import { CategoryRouter } from './routers/category.router';
import { StockJournalRouter } from './routers/stock-journal.router';

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
          res.status(500).send('Error !');
        } else {
          next();
        }
      },
    );
  }

  private routes(): void {
    const sampleRouter = new SampleRouter();
    const orderRouter = new OrderRouter();
    const authRouter = new AuthRouter();
    const storeAdminRouter = new StoreAdminRouter();
    const productRouter = new ProductRouter();
    const storeRouter = new StoreRouter();
    const storeProductRouter = new StoreProductRouter();
    const categoryRouter = new CategoryRouter();
    const stockJournalRouter = new StockJournalRouter();

    this.app.get('/api', (req: Request, res: Response) => {
      res.send(`Welcome to belanja.in API !`);
    });

    this.app.use('/samples', sampleRouter.getRouter());
    this.app.use('/api/orders', orderRouter.getRouter());
    this.app.use('/api/auth', authRouter.getRouter());
    this.app.use('/api/stores', storeRouter.getRouter());
    this.app.use('/api/store-admins', storeAdminRouter.getRouter());
    this.app.use('/api/store-products', storeProductRouter.getRouter());
    this.app.use('/api/products', productRouter.getRouter());
    this.app.use('/api/categories', categoryRouter.getRouter());
    this.app.use('/api/stock-journals', stockJournalRouter.getRouter());
  }

  public start(): void {
    this.app.listen(PORT, () => {
      console.log(`  ➜  [API] Local:   http://localhost:${PORT}/`);
    });
  }
}
