/// <reference path="../pb_data/types.d.ts" />

// Merged users migration: sets latest rules for _pb_users_auth_ collection
migrate((app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_");
  // Latest rules from all user migrations
  unmarshal({
    "createRule": "@request.auth.id = id || @request.auth.email = \"mowczanwasyl@gmail.com\"",
    "deleteRule": "@request.auth.id = id || @request.auth.email = \"mowczanwasyl@gmail.com\"",
    "listRule": "@request.auth.id = id || @request.auth.email = \"mowczanwasyl@gmail.com\"",
    "updateRule": "@request.auth.id = id || @request.auth.email = \"mowczanwasyl@gmail.com\"",
    "viewRule": "@request.auth.id = id || @request.auth.email = \"mowczanwasyl@gmail.com\""
  }, collection);
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_");
  // Revert to fully locked rules
  unmarshal({
    "createRule": null,
    "deleteRule": null,
    "listRule": null,
    "updateRule": null,
    "viewRule": null
  }, collection);
  return app.save(collection);
});
