import hbs from 'nodemailer-express-handlebars';
import path from 'path';

/** __dirname = `.netlify\functions-internal` */
const PATH_TO_APP = '../../app/';

export const handlebars = hbs({
  viewEngine: {
    defaultLayout: false,
    extname: '.hbs',
    partialsDir: path.resolve(__dirname, PATH_TO_APP, 'views/partials/')
  },
  viewPath: path.resolve(__dirname, PATH_TO_APP, 'views/'),
  extName: '.hbs'
});
