ReactiveDataArray = function (targetArray, cursor, callbacks = {}) {
    var arrayDep = new Tracker.Dependency;

    // Get index of doc inside target array using the _id
    var atIndex = function (id) {
        return targetArray.findIndex(function (doc) {
            return doc._id === id;
        });
    };

    var liveQuery = cursor.observeChanges({
        added: function (id, fields) {
            var doc = Object.assign({_id: id}, fields);
            targetArray.push(doc);

            if (callbacks.added) {callbacks.added(doc)}
            arrayDep.changed();
        },
        changed: function (id, fields) {
            // Merge (overwrite) changed fields into target doc
            var newDoc = Object.assign(targetArray[atIndex(id)], fields);

            if (callbacks.changed) {callbacks.changed(newDoc);}
            arrayDep.changed();
        },
        removed: function (id) {
            var oldDoc = targetArray.splice(atIndex(id), 1);

            if (callbacks.removed) {callbacks.removed(oldDoc);}
            arrayDep.changed();
        }
    });

    return {
        stop: liveQuery.stop,
        dep: arrayDep
    }
};