// App Config
const { APP, NLP, CONSUMER_APP } = require('./config');
const port = APP.port;
const connectionString = APP.connectionString;
const saltRounds = APP.saltRounds;
const session = APP.session;
const consumerAppSession = CONSUMER_APP.session;

// Internal dependencies
const ErrorHandler = require('./middlewares/error-handler');
const EnableCors = require('./middlewares/enable-cors');
const TokenAuth = require('./middlewares/token-auth');
const ExpressBootstrapper = require('./modules/express-bootstrapper');
const mongoose = require('mongoose');
mongoose.Promise = Promise;
const ResourceValidator = require('./modules/resources/resource-validator');
const SessionManager = require('./modules/session-manager');
const Brain = require('botbrain');
const Cognitive = require('./modules/cognitive');

//models
const userModel = require('./models/user-model');
const knowledgeModel = require('./models/knowledge-model');
const testModel = require('./models/test-model');
const appModel = require('./models/app-model');
const subscriptionModel = require('./models/subscription-model');

//utils
const errorHandler = new ErrorHandler();
const enableCors = new EnableCors();
const resourceValidator = new ResourceValidator();
const sessionManager = new SessionManager({ session, consumerAppSession });
const tokenAuth = new TokenAuth({ sessionManager });
const brain = new Brain({ degree: NLP.degree, scope: NLP.scope });
const cognitive = new Cognitive({ knowledgeModel }, { brain });


//routes
const Routes = require('./routes');
const TestRoute = require('./routes/test');
const ResourcesRoute = require('./routes/resources');
const UsersRoute = require('./routes/users');
const AuthenticateRoute = require('./routes/authenticate');
const AnalysesRoute = require('./routes/analyses');
const AppRoute = require('./routes/app');

// routes instances
const testRoute = new TestRoute({ knowledgeModel });
const resourcesroute = new ResourcesRoute({ knowledgeModel }, { tokenAuth }, { resourceValidator });
const usersRoute = new UsersRoute({ userModel }, { saltRounds });
const authenticateRoute = new AuthenticateRoute(
  { userModel },
  { sessionManager },
  { tokenAuth }
);
const analysesRoute = new AnalysesRoute(
  { knowledgeModel, testModel },
  { tokenAuth },
  { brain, cognitive }
);
const appRoute = new AppRoute(
  { appModel, subscriptionModel },
  { tokenAuth },
  { sessionManager }
);
// Mongo-connection
mongoose.connect(connectionString, { useNewUrlParser: true });

// Bootstrap
const expressBootstrapper = new ExpressBootstrapper(
  { errorHandler, enableCors }
);
expressBootstrapper.bootstrap();

const routes = new Routes(
  [
    testRoute,
    resourcesroute,
    usersRoute,
    authenticateRoute,
    analysesRoute,
    appRoute
  ],
  errorHandler
);

routes.initRoutes(expressBootstrapper.app);

expressBootstrapper.app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
