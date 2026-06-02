/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // update collection data
  unmarshal({
    "deleteRule": "@request.auth.id = id",
    "listRule": "@request.auth.id = id",
    "updateRule": "@request.auth.id = id",
    "viewRule": "@request.auth.id = id"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // update collection data
  unmarshal({
    "deleteRule": "@request.auth.id = id || @request.auth.email = \"mowczanwasyl@gmail.com\"",
    "listRule": "@request.auth.id = id || @request.auth.email = \"mowczanwasyl@gmail.com\"",
    "updateRule": "@request.auth.id = id || @request.auth.email = \"mowczanwasyl@gmail.com\"",
    "viewRule": "@request.auth.id = id || @request.auth.email = \"mowczanwasyl@gmail.com\""
  }, collection)

  return app.save(collection)
})
