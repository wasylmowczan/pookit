/// <reference path="../pb_data/types.d.ts" />

// Adds a polar_customer_id text field to the users collection so we can map
// PocketBase users <-> Polar customers when handling webhooks and portal links.
migrate((app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_");

  collection.fields.add(new Field({
    "name": "polar_customer_id",
    "type": "text",
    "required": false,
    "presentable": false,
    "system": false,
    "max": 200
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_");
  const field = collection.fields.getByName("polar_customer_id");
  if (field) {
    collection.fields.removeById(field.id);
  }
  return app.save(collection);
});
