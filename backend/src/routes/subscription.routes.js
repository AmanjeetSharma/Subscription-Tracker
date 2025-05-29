import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import {
    createSubscription,
    getUserSubscriptions,
    deleteSubscription,
    updateSubscription
} from "../controllers/subscription.controller.js";

const subscriptionRouter = Router();

subscriptionRouter.get("/", (req, res) => res.send({ title: "GET all subscriptions" }));

subscriptionRouter.get("/:id", (req, res) => res.send({ title: "GET subscription details" }));

subscriptionRouter.post("/", verifyToken, createSubscription);

subscriptionRouter.put("/:id", verifyToken, updateSubscription);

subscriptionRouter.delete("/:id", verifyToken, deleteSubscription);

subscriptionRouter.get("/user/:id", verifyToken, getUserSubscriptions);

subscriptionRouter.put("/:id/cancel", (req, res) => res.send({ title: "Cancel subscription" }));

subscriptionRouter.get("/upcoming-renewals", (req, res) => res.send({ title: "GET upcoming renewals" }));

export default subscriptionRouter;