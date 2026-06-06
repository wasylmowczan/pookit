/// <reference path="../pb_data/types.d.ts" />

// `subscriptions` collection: one row per Polar subscription. Updated via the
// Polar webhook. Rules locked to the owning user (and superadmin).
migrate((app) => {
  const collection = new Collection();
  unmarshal({
    "name": "subscriptions",
    "type": "base",
    "fields": [
      { "name": "polar_id", "type": "text", "required": true, "max": 200 },
      { "name": "user", "type": "relation", "required": false, "collectionId": "_pb_users_auth_", "cascadeDelete": false, "maxSelect": 1 },
      { "name": "polar_customer_id", "type": "text", "required": true, "max": 200 },
      { "name": "product_id", "type": "text", "required": true, "max": 200 },
      { "name": "product_name", "type": "text", "required": false, "max": 200 },
      {
        "name": "status",
        "type": "select",
        "required": true,
        "maxSelect": 1,
        "values": ["incomplete", "incomplete_expired", "trialing", "active", "past_due", "canceled", "unpaid"]
      },
      { "name": "current_period_start", "type": "date", "required": false },
      { "name": "current_period_end", "type": "date", "required": false },
      { "name": "cancel_at_period_end", "type": "bool", "required": false },
      { "name": "amount", "type": "number", "required": false },
      { "name": "currency", "type": "text", "required": false, "max": 8 },
      { "name": "recurring_interval", "type": "text", "required": false, "max": 16 }
    ],
    "indexes": [
      "CREATE UNIQUE INDEX idx_subscriptions_polar_id ON subscriptions (polar_id)",
      "CREATE INDEX idx_subscriptions_user ON subscriptions (user)"
    ],
    "listRule": "@request.auth.id = user || @request.auth.email = \"mowczanwasyl@gmail.com\"",
    "viewRule": "@request.auth.id = user || @request.auth.email = \"mowczanwasyl@gmail.com\"",
    "createRule": null,
    "updateRule": null,
    "deleteRule": null
  }, collection);
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("subscriptions");
  return app.delete(collection);
});
