/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2456230977");

  collection.fields.add(new Field({
    "hidden": false,
    "id": "bool4416250001",
    "name": "responded",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }));

  collection.fields.add(new Field({
    "hidden": false,
    "id": "date4416250002",
    "max": "",
    "min": "",
    "name": "responded_at",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2456230977");

  collection.fields.removeById("bool4416250001");
  collection.fields.removeById("date4416250002");

  return app.save(collection);
});
