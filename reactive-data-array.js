ReactiveDataArray = function (targetArray, cursor, callbacks = {}) {
    var atIndex = function (id) {
        return targetArray.findIndex(function (doc) {
            return doc._id === id;
        });
    };

    // Provide handle to stop live query
    return cursor.observeChanges({
        added: function (id, fields) {
            var doc = Object.assign({_id: id}, fields);
            targetArray.push(doc);

            if (callbacks.added) {callbacks.added(doc);}
        },
        changed: function (id, fields) {
            // Merge (overwrite) new fields into target doc
            var newDoc = Object.assign(targetArray[atIndex(id)], fields);

            if (callbacks.changed) {callbacks.changed(newDoc);}
        },
        removed: function (id) {
            var oldDoc = targetArray.splice(atIndex(id), 1);

            if (callbacks.removed) {callbacks.removed(oldDoc);}
        }
    });
};