/// <reference path="../pb_data/types.d.ts" />

// Adds `created` and `updated` autodate fields to the `subscriptions` and
// `orders` collections. The original migrations declared explicit `fields`
// arrays which overrode PocketBase's default system fields, so sorting by
// `created`/`updated` failed at runtime.
migrate(
  (app) => {
    for (const name of ["subscriptions", "orders"]) {
      const collection = app.findCollectionByNameOrId(name);
      collection.fields.add(
        new Field({
          name: "created",
          type: "autodate",
          onCreate: true,
          onUpdate: false
        })
      );
      collection.fields.add(
        new Field({
          name: "updated",
          type: "autodate",
          onCreate: true,
          onUpdate: true
        })
      );
      app.save(collection);
    }
  },
  (app) => {
    for (const name of ["subscriptions", "orders"]) {
      const collection = app.findCollectionByNameOrId(name);
      const created = collection.fields.getByName("created");
      const updated = collection.fields.getByName("updated");
      if (created) collection.fields.remove(created.id);
      if (updated) collection.fields.remove(updated.id);
      app.save(collection);
    }
  }
);
