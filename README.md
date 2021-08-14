# TabJS
A Lightweight JavaScript Library for communicating with browser tabs of the same origin using localStorage.

# Installation

Add TabJS from the script tag
```html
<script src="path/to/tab.js"></script>
```
Or from [NodifyJS](https://www.github.com/DevBash1/NodifyJS)
```javascript
let tab = require("path/to/tab.js");
```

# Usage
You can communicate with other tabs pointing to the same url.
Example:
If the client opened two tabs of your website.

**Tab A** pointing to *www.example.com/home.html*

**Tab B** pointing to *www.example.com/shop.html*

Both tabs can now communicate with each other.

**Tab A**
```javascript
//Create Tab instance
let tab = new Tab();

//Say something to any other tab
tab.say("Hello Tab!"); //Globally
```

**Tab B**
```javascript
//Create Tab instance
let tab = new Tab();

//Listen for messages from other tabs
tab.onMessage(function(obj){
    console.log(obj.message) //Hello Tab!
    //Respond to the tab
    tab.sayTo(obj.from,"Hey, Fellow Tab!") //Privately
});
```

You can do other things like check for opened tabs

```javascript
//Create Tab instance
let tab = new Tab();

//TabIDs of opened tabs
console.log(tab.getTabs()) // [162438453,326352835]
```

You can now send private messages to specific tabs or emit data.

**Tab A**
```javascript
//Create Tab instance
let tab = new Tab();

//TabIDs of opened tabs
let tabs = tab.getTabs();

if(tabs.length > 0){
  tab.sayTo(tabs[0],"Hello First Tab!"); //Say Something to the first tab.
  tab.emitTo(tabs[0],"greet",{"msg":"Hello!"});
}
```

**Tab B**
```javascript
//Create Tab instance
let tab = new Tab();

tab.on("greet",function(obj){
    console.log(obj.data.msg) //Hello!
})
```
You can also emit globally.

```javascript
//Create Tab instance
let tab = new Tab();

tab.emit("url",location.href);
```

TabJS also allows you run some command on other tabs.

**Tab A**
```javascript
//Create Tab instance
let tab = new Tab();

//TabIDs of opened tabs
let tabs = tab.getTabs();

if(tabs.length > 0){
  tab.emit("refreshMe","");
}
```

**Tab B**
```javascript
//Create Tab instance
let tab = new Tab();

tab.on("refreshMe", function(obj){
    //Create a Tab Controller Instance with recieved TabID
    let myTab = new tab.getTab(obj.from);
    //reload the tab
    myTab.refresh();
})
```

This will reload **Tab A**

You can call other methods to do different things.
```javascript
myTab.close() //Will close tab
myTab.back() //Will take the tab back
myTab.forward() //Will take the tab forward
```

TabJS has inbuilt event listeners for listening for new Tab opening and closing.
```javascript
//Create Tab instance
let tab = new Tab();

//Get your TabID
console.log(tab.id) //12345678

tab.onTabClosed(function(tabID) {
    console.log("Tab " + tabID + " Closed!");
})

tab.onTabOpened(function(tabID) {
    console.log("Tab " + tabID + " Opened!");
})
```

Happy Coding!
Made in 🇳🇬
