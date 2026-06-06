/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // remove field
  collection.fields.removeById("text_subscription_status")

  // remove field
  collection.fields.removeById("text_subscription_tier")

  // remove field
  collection.fields.removeById("date_subscription_period_end")

  // remove field
  collection.fields.removeById("json_purchased_product_ids")

  // remove field
  collection.fields.removeById("text_one_time_order_id")

  // remove field
  collection.fields.removeById("date_one_time_ordered_at")

  // remove field
  collection.fields.removeById("text1622944134")

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // add field
  collection.fields.addAt(10, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text_subscription_status",
    "max": 0,
    "min": 0,
    "name": "subscription_status",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(11, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text_subscription_tier",
    "max": 0,
    "min": 0,
    "name": "subscription_tier",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(12, new Field({
    "hidden": false,
    "id": "date_subscription_period_end",
    "max": "",
    "min": "",
    "name": "subscription_current_period_end",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  // add field
  collection.fields.addAt(13, new Field({
    "hidden": false,
    "id": "json_purchased_product_ids",
    "maxSize": 0,
    "name": "purchased_product_ids",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  // add field
  collection.fields.addAt(14, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text_one_time_order_id",
    "max": 0,
    "min": 0,
    "name": "one_time_order_id",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(15, new Field({
    "hidden": false,
    "id": "date_one_time_ordered_at",
    "max": "",
    "min": "",
    "name": "one_time_ordered_at",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  // add field
  collection.fields.addAt(16, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text1622944134",
    "max": 200,
    "min": 0,
    "name": "polar_customer_id",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
})
