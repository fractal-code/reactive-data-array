ReactiveDataArray = function (targetArray, cursor, callback) {
    // Get index of doc inside target array using the _id
    var atIndex = function (id) {
        return targetArray.findIndex(function (doc) {
            return doc._id === id;
        });
    };

    return cursor.observeChanges({
        added: function (id, fields) {
            var doc = Object.assign({_id: id}, fields);
            targetArray.push(doc);

            // Suppress callbacks on initial calls for existing docs
            if (targetArray.length === cursor.count()) {
                if (callback) {callback("added", doc)}
            }
        },
        changed: function (id, fields) {
            // Merge (overwrite) changed fields into target doc
            var newDoc = Object.assign(targetArray[atIndex(id)], fields);

            if (callback) {callback("changed", newDoc);}
        },
        removed: function (id) {
            var oldDoc = targetArray.splice(atIndex(id), 1);

            if (callback) {callback("removed", oldDoc);}
        }
    });
};