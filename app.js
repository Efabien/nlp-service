// App Config
const { APP } = require('./config');
const port = APP.port;
const connectionString = APP.connectionString;

// Internal dependencies
const ErrorHandler = require('./middlewares/error-handler');
const ExpressBootstrapper = require('./modules/express-bootstrapper');
const mongoose = require('mongoose');
mongoose.Promise = Promise;
const ResourceValidator = require('./modules/resources/resource-validator');

//utils
const errorHandler = new ErrorHandler();
const resourceValidator = new ResourceValidator();

//models
const userModel = require('./models/user-model');
const knowledgeModel = require('./models/knowledge-model');

//routes
const Routes = require('./routes');
const TestRoute = require('./routes/test');
const ResourcesRoute = require('./routes/resources');

// routes instances
const testRoute = new TestRoute({ knowledgeModel });
const resourcesroute = new ResourcesRoute({ knowledgeModel }, { resourceValidator });

// Mongo-connection
mongoose.connect(connectionString, { useNewUrlParser: true });

// Bootstrap
const expressBootstrapper = new ExpressBootstrapper(
  { errorHandler }
);
expressBootstrapper.bootstrap();

const routes = new Routes(
  [
    testRoute,
    resourcesroute
  ],
  errorHandler
);

routes.initRoutes(expressBootstrapper.app);

expressBootstrapper.app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
