import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import countriesRouter from "./countries";
import activitiesRouter from "./activities";
import tripsRouter from "./trips";
import reviewsRouter from "./reviews";
import favoritesRouter from "./favorites";
import packingRouter from "./packing";
import dashboardRouter from "./dashboard";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(countriesRouter);
router.use(activitiesRouter);
router.use(tripsRouter);
router.use(reviewsRouter);
router.use(favoritesRouter);
router.use(packingRouter);
router.use(dashboardRouter);

export default router;
