module.exports = (function() {

  'use strict';

  const Nodal = require('nodal');
  const router = new Nodal.Router();

  /* Middleware */
  /* executed *before* Controller-specific middleware */

  const CORSMiddleware = Nodal.require('middleware/cors_middleware.js');
  // const ForceWWWMiddleware = Nodal.require('middleware/force_www_middleware.js');
  // const ForceHTTPSMiddleware = Nodal.require('middleware/force_https_middleware.js');

  router.middleware.use(CORSMiddleware);
  // router.middleware.use(ForceWWWMiddleware);
  // router.middleware.use(ForceHTTPSMiddleware);

  /* Renderware */
  /* executed *after* Controller-specific renderware */

  const GzipRenderware = Nodal.require('renderware/gzip_renderware.js')

  router.renderware.use(GzipRenderware);

  /* Routes */

  const IndexController = Nodal.require('app/controllers/index_controller.js');
  const AskController = Nodal.require('app/controllers/ask_controller.js');
  const StaticController = Nodal.require('app/controllers/static_controller.js');
  const Error404Controller = Nodal.require('app/controllers/error/404_controller.js');

  /* generator: begin imports */

  const V1QuestionsController = Nodal.require('app/controllers/v1/questions_controller.js');

  /* generator: end imports */

  router.route('/').use(IndexController);
  router.route('/static/*').use(StaticController);
  router.route('/ask/*').use(AskController);

  /* generator: begin routes */

  router.route('/v1/questions/{id}').use(V1QuestionsController);

  /* generator: end routes */

  router.route('/*').use(Error404Controller);

  return router;

})();
