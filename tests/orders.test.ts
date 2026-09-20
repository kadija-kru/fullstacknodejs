import { describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "../src/app.js";

describe("orders API", () => {
  it("creates only one order for repeated idempotency key", async () => {
    const app = createApp();
    const payload = {
      customerId: "cust_001",
      items: [{ sku: "SKU-1", quantity: 2 }]
    };

    const first = await request(app)
      .post("/api/orders")
      .set("Idempotency-Key", "checkout-123")
      .send(payload);

    const second = await request(app)
      .post("/api/orders")
      .set("Idempotency-Key", "checkout-123")
      .send(payload);

    expect(first.status).toBe(201);
    expect(second.status).toBe(201);
    expect(second.body.id).toBe(first.body.id);
    expect(second.headers["idempotent-replay"]).toBe("true");
  });

  it("rejects missing idempotency key", async () => {
    const app = createApp();
    const response = await request(app)
      .post("/api/orders")
      .send({ customerId: "cust_001", items: [{ sku: "A", quantity: 1 }] });

    expect(response.status).toBe(400);
  });
});
