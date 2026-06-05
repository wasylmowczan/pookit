/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {
  const collection = new Collection();
  unmarshal({
    "name": "email_events",
    "type": "base",
    "fields": [
      {
        "name": "email_id",
        "type": "text",
        "required": true
      },
      {
        "name": "event_type",
        "type": "select",
        "required": true,
        "maxSelect": 1,
        "values": ["email.bounced", "email.complained", "email.delivered"]
      },
      {
        "name": "to",
        "type": "text",
        "required": true
      },
      {
        "name": "subject",
        "type": "text",
        "required": false
      }
    ],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null
  }, collection);
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("email_events");
  return app.delete(collection);
});
