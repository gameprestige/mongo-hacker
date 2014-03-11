// confirm last remove command.
var _currentCollection = null,
    _currentQuery = null,
    _oldDBCollectionRemove = DBCollection.prototype.remove,
    confirm, cancel, hasPendingRemove;

confirm = function() {
    if (_currentCollection) {
        _oldDBCollectionRemove.call(_currentCollection, _currentQuery);
    }

    cancel();
};

cancel = function() {
    _currentCollection = null;
    _currentQuery = null;
};

hasPendingRemove = function() {
    return !!_currentCollection;
}

DBCollection.prototype.remove = function(query, justOne) {
    if (justOne) {
        return _oldDBCollectionRemove.call(this, query, justOne);
    }

    _currentCollection = this;
    _currentQuery = query;
    var count = this.find(query).count();

    if (count <= 1) {
        confirm();
        return;
    }

    var noticeColor = {
        color: "green",
        bright: true
    }
    var dataColor = {
        color: "yellow",
        bright: true
    };
    var confirmColor = {
        color: "green",
        bright: true,
        underline: true
    };
    var cancelColor = {
        color: "white",
        bright: true,
        underline: true
    };

    print(colorize("** Notice **", noticeColor));
    print("This remove operation will affect " + colorize(count, dataColor) + " records in collection " + colorize(this, dataColor) +". Are you sure?");
    print("\nEnter " + colorize("confirm()", confirmColor) + " to proceed it, or " + colorize("cancel()", cancelColor) + " to cancel it.");
}