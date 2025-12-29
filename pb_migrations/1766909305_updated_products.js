/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ndqs167mvdu19ku")

  // remove
  collection.schema.removeField("jnlw2rj3")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "u8ad6n8v",
    "name": "name",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "nskpvx7v",
    "name": "photo",
    "type": "file",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "mimeTypes": [],
      "thumbs": [],
      "maxSelect": 1,
      "maxSize": 5242880,
      "protected": false
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "wllvumyk",
    "name": "warehouse",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "0cjc1f6crr4itqg",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ndqs167mvdu19ku")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "jnlw2rj3",
    "name": "warehouse_name",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  // remove
  collection.schema.removeField("u8ad6n8v")

  // remove
  collection.schema.removeField("nskpvx7v")

  // remove
  collection.schema.removeField("wllvumyk")

  return dao.saveCollection(collection)
})
