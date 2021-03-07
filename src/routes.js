import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import RentalSpaceController from './app/controllers/RentalSpaceController';

import authMiddleware from './app/middlewares/auth';
import EstablhishmentController from './app/controllers/EstablhishmentController';
import RentingController from './app/controllers/RentingController';

const routes = new Router();
// Importando o multer para trabalhar como um Middleware
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.put('/users', UserController.update);

routes.get('/establhishment', EstablhishmentController.index);

routes.post('/files', upload.single('file'), FileController.store);

routes.post('/rentalspace', RentalSpaceController.store);
routes.get('/rentalspace', RentalSpaceController.index);
routes.delete('/rentalspace/:id', RentalSpaceController.delete);

routes.post('/renting', RentingController.store);

export default routes;
