// App Config
const { APP } = require('./config');
const port = APP.port;
const connectionString = APP.connectionString;

// Internal dependencies
const ErrorHandler = require('./middlewares/error-handler');
const mongoose = require('mongoose');
mongoose.Promise = Promise;

//utils
const errorHandler = new ErrorHandler();

// Internal dependencies
const ExpressBootstrapper = require('./modules/express-bootstrapper');

//models
const userModel = require('./models/user-model');
const knowledgeModel = require('./models/knowledge-model');

//routes
const Routes = require('./routes');
const TestRoute = require('./routes/test');

// routes instances
const testRoute = new TestRoute();

// Mongo-connection
mongoose.connect(connectionString, { useNewUrlParser: true });

// Bootstrap
const expressBootstrapper = new ExpressBootstrapper(
  { errorHandler }
);
expressBootstrapper.bootstrap();

const routes = new Routes(
  [
    testRoute
  ],
  errorHandler
);

routes.initRoutes(expressBootstrapper.app);

expressBootstrapper.app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
