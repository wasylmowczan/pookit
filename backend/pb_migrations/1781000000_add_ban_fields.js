/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_");

  collection.fields.addAt(9, new Field({
    "hidden": false,
    "id": "bool3316249576",
    "name": "banned",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }));

  collection.fields.addAt(10, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text3316249577",
    "max": 1000,
    "min": 0,
    "name": "ban_reason",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }));

  collection.fields.addAt(11, new Field({
    "hidden": false,
    "id": "date3316249578",
    "max": "",
    "min": "",
    "name": "ban_expires",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_");

  collection.fields.removeById("bool3316249576");
  collection.fields.removeById("text3316249577");
  collection.fields.removeById("date3316249578");

  return app.save(collection);
});
