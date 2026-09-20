import { Router } from "express";
import { randomUUID } from "node:crypto";
import { z } from "zod";

const orderSchema = z.object({
  customerId: z.string().min(1),
  items: z.array(
    z.object({
      sku: z.string().min(1),
      quantity: z.number().int().positive()
    })
  ).min(1)
});

type StoredResponse = {
  status: number;
  body: unknown;
};

const idempotencyStore = new Map<string, StoredResponse>();
export const ordersRouter = Router();

ordersRouter.post("/", (req, res) => {
  const key = req.header("Idempotency-Key");
  if (!key) {
    return res.status(400).json({ error: "missing_idempotency_key" });
  }

  const replay = idempotencyStore.get(key);
  if (replay) {
    res.setHeader("Idempotent-Replay", "true");
    return res.status(replay.status).json(replay.body);
  }

  const parsed = orderSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: "invalid_request",
      details: parsed.error.flatten()
    });
  }

  const body = {
    id: randomUUID(),
    customerId: parsed.data.customerId,
    items: parsed.data.items,
    status: "created"
  };

  idempotencyStore.set(key, { status: 201, body });
  return res.status(201).json(body);
});
