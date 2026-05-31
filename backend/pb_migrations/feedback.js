/// <reference path="../pb_data/types.d.ts" />

// Merged feedback migration: creates or updates feedback collection with latest schema and rules
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2456230977");
  // Latest rules from all feedback migrations
  unmarshal({
    "createRule": "@request.auth.id = id || @request.auth.email = \"mowczanwasyl@gmail.com\"",
    "deleteRule": "@request.auth.id = id || @request.auth.email = \"mowczanwasyl@gmail.com\"",
    "listRule": "@request.auth.id = id || @request.auth.email = \"mowczanwasyl@gmail.com\"",
    "updateRule": "@request.auth.id = id || @request.auth.email = \"mowczanwasyl@gmail.com\"",
    "viewRule": "@request.auth.id = id || @request.auth.email = \"mowczanwasyl@gmail.com\""
  }, collection);
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2456230977");
  // Revert to open rules
  unmarshal({
    "createRule": "",
    "deleteRule": "",
    "listRule": "",
    "updateRule": "",
    "viewRule": ""
  }, collection);
  return app.save(collection);
});
