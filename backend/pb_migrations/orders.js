/// <reference path="../pb_data/types.d.ts" />

// `orders` collection: one row per Polar order (one-time or subscription billing
// cycle). Populated by the Polar webhook. Read-only for the owning user.
migrate((app) => {
  const collection = new Collection();
  unmarshal({
    "name": "orders",
    "type": "base",
    "fields": [
      { "name": "polar_id", "type": "text", "required": true, "max": 200 },
      { "name": "user", "type": "relation", "required": false, "collectionId": "_pb_users_auth_", "cascadeDelete": false, "maxSelect": 1 },
      { "name": "polar_customer_id", "type": "text", "required": true, "max": 200 },
      { "name": "subscription_id", "type": "text", "required": false, "max": 200 },
      { "name": "product_id", "type": "text", "required": true, "max": 200 },
      { "name": "product_name", "type": "text", "required": false, "max": 200 },
      {
        "name": "status",
        "type": "select",
        "required": true,
        "maxSelect": 1,
        "values": ["pending", "paid", "refunded", "partially_refunded"]
      },
      { "name": "amount", "type": "number", "required": false },
      { "name": "currency", "type": "text", "required": false, "max": 8 },
      { "name": "billing_reason", "type": "text", "required": false, "max": 64 }
    ],
    "indexes": [
      "CREATE UNIQUE INDEX idx_orders_polar_id ON orders (polar_id)",
      "CREATE INDEX idx_orders_user ON orders (user)"
    ],
    "listRule": "@request.auth.id = user || @request.auth.email = \"mowczanwasyl@gmail.com\"",
    "viewRule": "@request.auth.id = user || @request.auth.email = \"mowczanwasyl@gmail.com\"",
    "createRule": null,
    "updateRule": null,
    "deleteRule": null
  }, collection);
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("orders");
  return app.delete(collection);
});
