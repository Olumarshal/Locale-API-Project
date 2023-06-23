import 'dotenv/config';
import 'module-alias/register';
import validateEnv from '@/utils/validateEnv';
import App from './app';
import UserController from './resources/user/user.controller';
import LocaleController from './resources/locale/locale.controller';

validateEnv();

const app = new App([new UserController(), new LocaleController()],
Number(process.env.PORT || 3000));

app.listen();
