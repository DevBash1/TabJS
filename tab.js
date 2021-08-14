function Tab() {
    let tab = this;
    let tabId = Math.floor(Math.random() * 1000000000000);
    let listener = [];
    let callbacks = [];
    let template = {};
    let message = false;
    let closed = false;
    let opened = false;
    let totalTabs = null;
    let emits = [];
    let emitsCallbacks = [];

    let tabs = {
        from: 1,
        to: 2,
        message: "hi",
    }

    tab.id = tabId;

    tab.say = function(message) {
        let data = {};
        data = {
            "from": tabId,
            "to": "*",
            "message": message,
        }
        localStorage.setItem("TabJS", JSON.stringify(data));
    }

    tab.sayTo = function(id, message) {
        let data = {};
        data = {
            "from": tabId,
            "to": id,
            "message": message,
        }
        localStorage.setItem("TabJS", JSON.stringify(data));
    }

    tab.emit = function(action, message) {
        let data = {};
        data = {
            "from": tabId,
            "to": "*",
            "emit": action,
            "data": message,
        }
        localStorage.setItem("TabJS", JSON.stringify(data));
    }

    tab.emitTo = function(id, action, message) {
        let data = {};
        data = {
            "from": tabId,
            "to": id,
            "emit": action,
            "data": message,
        }
        localStorage.setItem("TabJS", JSON.stringify(data));
    }

    tab.on = function(action, callback) {
        emits.push(action);
        emitsCallbacks.push(callback);
    }

    tab.onTabClosed = function(callback) {
        closed = callback;
    }

    tab.onTabOpened = function(callback) {
        opened = callback;
    }

    tab.onMessage = function(callback) {
        message = callback;
    }

    tab.getTabs = function() {
        let ActiveTabs = [];
        let allItem = Object.keys(localStorage);
        allItem.forEach(function(each) {
            if (each.startsWith("TabJS_")) {
                let getTab = each.substring(6, each.length);
                ActiveTabs.push(Number(getTab));
            }
        })
        if (ActiveTabs.includes(tabId)) {
            let index = ActiveTabs.indexOf(tabId);
            ActiveTabs.splice(index, 1);
        }
        return ActiveTabs;

    }

    //Interval to keep reading localStorage
    //and watch for changes

    setInterval(function() {
        let data = localStorage.getItem("TabJS");
        //Check if data has been set and is valid
        if (data == null) {
            let stringified = JSON.stringify(template)
            localStorage.setItem("TabJS", stringified);
        }
        try {
            JSON.parse(localStorage.getItem("TabJS"));
        } catch (e) {
            let stringified = JSON.stringify(template);
            localStorage.setItem("TabJS", stringified);
        }
        let recieved = localStorage.getItem("TabJS");
        try {
            let json = JSON.parse(recieved);
            if (json.to == tabId) {
                if (listener.includes(json.message) && json.action == undefined) {
                    let index = listener.indexOf(json.message);
                    localStorage.setItem("TabJS", "{}");
                    callbacks[index](json);
                } else if (message && json.action == undefined) {
                    localStorage.setItem("TabJS", "{}");
                    message(json);
                } else if (json.emit != undefined) {
                    if (emits.includes(json.emit)) {
                        localStorage.setItem("TabJS", "{}");
                        let index = emits.indexOf(json.emit);
                        emitsCallbacks[index](json);
                    }
                } else if (json.action != undefined) {
                    localStorage.setItem("TabJS", "{}")
                    if (json.action == "refresh") {
                        location.href = location.href;
                    }
                    if (json.action == "back") {
                        history.back();
                    }
                    if (json.action == "forward") {
                        history.forward();
                    }
                    if(json.action == "close"){
                        window.close();
                        opener.window.focus();
                    }
                }
            } else if (json.to == "*" && json.from != tabId) {
                console.log(json)
                if (message && json.message != undefined) {
                    localStorage.setItem("TabJS", "{}");
                    message(json);
                } else if (json.emit != undefined) {
                    if (emits.includes(json.emit)) {
                        localStorage.setItem("TabJS", "{}");
                        let index = emits.indexOf(json.emit);
                        emitsCallbacks[index](json);
                    }
                }
            }
        } catch {
            let stringified = JSON.stringify(template);
            localStorage.setItem("TabJS", stringified);
        }
        //Check for active tabs and keep them updated
        localStorage.setItem("TabJS_" + tabId, Date.now());

        //Updating Tab Data
        let AllItem = Object.keys(localStorage);
        let TabJS_keys = [];
        let json = {};
        json.tabs = [];
        json.time = [];

        AllItem.forEach(function(each) {
            if (each.startsWith("TabJS_")) {
                let time = localStorage.getItem(each);
                json.tabs.push(each);
                json.time.push(time);
            }
        })

        if (totalTabs < json.tabs.length && totalTabs != null) {
            if (opened) {
                if (Number(json.tabs[json.tabs.length - 1].substring(6)) != tabId) {
                    opened(json.tabs[json.tabs.length - 1].substring(6));
                }
            }
        }

        json.time.forEach(function(each, i) {
            let currentTime = Date.now();
            each = Number(each);
            if ((currentTime - each) > 5000) {
                if (closed) {
                    closed(json.tabs[i].substring(6));
                }
                localStorage.removeItem(json.tabs[i]);
            }
        })

        totalTabs = json.tabs.length;

    }, 100)

    let sendAction = function(id, action) {
        let data = {};
        data = {
            "from": tabId,
            "to": id,
            "action": action,
        }
        setTimeout(function() {
            localStorage.setItem("TabJS", JSON.stringify(data));
        }, 500)
    }

    this.getTab = function(id) {
        this.refresh = function() {
            sendAction(id, "refresh");
        }
        this.back = function() {
            sendAction(id, "back")
        }
        this.forward = function() {
            sendAction(id, "forward")
        }
        this.close = function() {
            sendAction(id, "close")
        }
    }
}

//For Use with NodifyJS

try {
    module.exports = Tab;
} catch (e) {
}
