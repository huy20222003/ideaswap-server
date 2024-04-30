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
//------------------------------------------------------------


function routes(app) {
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
}

export default routes;
