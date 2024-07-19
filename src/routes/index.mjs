//router
import authRouter from './authRouter.mjs';
import blogRouter from './blogRouter.mjs';
import heartRouter from './heartRouter.mjs';
import commentRouter from './commentRouter.mjs';
import shareRouter from './shareRouter.mjs';
import userRouter from './userRouter.mjs';
import couseRouter from './courseRouter.mjs';
import videoRouter from './videoRouter.mjs';
import censorshipsRouter from './censorshipsRouter.mjs';
import followRouter from './followRouter.mjs';
import managerAuthController from './managerAuthRouter.mjs';
import roleRouter from './roleRouter.mjs';
import managerRouter from './managerRouter.mjs';
import codeRouter from './codeRouter.mjs';
import documentRouter from './documentRouter.mjs';
import bannerRouter from './bannerRouter.mjs';
import notificationRouter from './notificationRouter.mjs';
import conversationRouter from './conversationsRouter.mjs';
import messageRouter from './messageRouter.mjs';
//swagger
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
//------------------------------------------------------------

const options = {
  definition: {
    failOnErrors: true,
    openapi: '3.0.0',
    info: {
      title: 'IdeaSwap API',
      description: 'API documentation for IdeaSwap application',
      version: '1.1.0',
    },
  },
  apis: ['./src/routes/*.mjs'], // files containing annotations as above
};

const openapiSpecification = swaggerJSDoc(options);

function routes(app) {
  app.use(
    '/api/v1/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(openapiSpecification)
  );
  app.use('/api/v1/auth', authRouter);
  app.use('/api/v1/auth/admin', managerAuthController);
  app.use('/api/v1/blog', blogRouter);
  app.use('/api/v1/heart', heartRouter);
  app.use('/api/v1/comment', commentRouter);
  app.use('/api/v1/share', shareRouter);
  app.use('/api/v1/user', userRouter);
  app.use('/api/v1/course', couseRouter);
  app.use('/api/v1/video', videoRouter);
  app.use('/api/v1/censorships', censorshipsRouter);
  app.use('/api/v1/follow', followRouter);
  app.use('/api/v1/role', roleRouter);
  app.use('/api/v1/manager', managerRouter);
  app.use('/api/v1/code', codeRouter);
  app.use('/api/v1/document', documentRouter);
  app.use('/api/v1/banner', bannerRouter);
  app.use('/api/v1/notification', notificationRouter);
  app.use('/api/v1/conversation', conversationRouter);
  app.use('/api/v1/message', messageRouter);
}

export default routes;
