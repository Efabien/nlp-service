// App Config
const { APP, NLP } = require('./config');
const port = APP.port;
const connectionString = APP.connectionString;
const saltRounds = APP.saltRounds;
const session = APP.session;

// Internal dependencies
const ErrorHandler = require('./middlewares/error-handler');
const TokenAuth = require('./middlewares/token-auth');
const ExpressBootstrapper = require('./modules/express-bootstrapper');
const mongoose = require('mongoose');
mongoose.Promise = Promise;
const ResourceValidator = require('./modules/resources/resource-validator');
const SessionManager = require('./modules/session-manager');
const Brain = require('botbrain');


//utils
const errorHandler = new ErrorHandler();
const resourceValidator = new ResourceValidator();
const sessionManager = new SessionManager({ session });
const tokenAuth = new TokenAuth({ sessionManager });
const brain = new Brain({ degree: NLP.degree, scope: NLP.scope });

//models
const userModel = require('./models/user-model');
const knowledgeModel = require('./models/knowledge-model');

//routes
const Routes = require('./routes');
const TestRoute = require('./routes/test');
const ResourcesRoute = require('./routes/resources');
const UsersRoute = require('./routes/users');
const AuthenticateRoute = require('./routes/authenticate');
const AnalysesRoute = require('./routes/analyses');

// routes instances
const testRoute = new TestRoute({ knowledgeModel });
const resourcesroute = new ResourcesRoute({ knowledgeModel }, { tokenAuth }, { resourceValidator });
const usersRoute = new UsersRoute({ userModel }, { saltRounds });
const authenticateRoute = new AuthenticateRoute({ userModel }, { sessionManager });
const analysesRoute = new AnalysesRoute({ knowledgeModel }, { tokenAuth }, { brain });
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
    resourcesroute,
    usersRoute,
    authenticateRoute,
    analysesRoute
  ],
  errorHandler
);

routes.initRoutes(expressBootstrapper.app);

expressBootstrapper.app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
