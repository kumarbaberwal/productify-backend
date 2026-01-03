import { Router } from "express";
import { syncUser } from "../controllers/userControllers.ts";
import { requireAuth } from "@clerk/express";

const router = Router();

router.post("/sync", requireAuth(), syncUser);


export default router;