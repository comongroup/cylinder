<a name="module_router"></a>

## router
Router module for CylinderClass.


* [router](#module_router)
    * [.options](#module_router.options) : <code>Object</code>
    * [.done](#module_router.done) : <code>Boolean</code>
    * [.url](#module_router.url) : <code>String</code>
    * [.route](#module_router.route) : <code>String</code>
    * [.args](#module_router.args) : <code>Array</code>
    * [.previous_url](#module_router.previous_url) : <code>String</code>
    * [.previous_route](#module_router.previous_route) : <code>String</code>
    * [.previous_args](#module_router.previous_args) : <code>Array</code>
    * [.domain()](#module_router.domain) ⇒ <code>String</code>
    * [.root()](#module_router.root) ⇒ <code>String</code>
    * [.path()](#module_router.path) ⇒ <code>String</code>
    * [.setup([domain], [root])](#module_router.setup) ⇒ <code>router</code>
    * [.start([silent])](#module_router.start) ⇒ <code>router</code>
    * [.stop()](#module_router.stop) ⇒ <code>router</code>
    * [.use(...functions)](#module_router.use) ⇒ <code>router</code>
    * [.unuse(...functions)](#module_router.unuse) ⇒ <code>router</code>
    * [.add([name], syntax, ...callbacks)](#module_router.add)
    * [.addHandler([selector])](#module_router.addHandler) ⇒ <code>router</code>
    * [.removeHandler([selector])](#module_router.removeHandler) ⇒ <code>router</code>
    * [.go([url], [options], [prefix])](#module_router.go) ⇒ <code>router</code>
    * [.reload([delay])](#module_router.reload)


* * *

<a name="module_router.options"></a>

### router.options : <code>Object</code>
The options taken by the module.

**Kind**: static property of <code>[router](#module_router)</code>  
**Properties**

<table>
  <thead>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>push</td><td><code>Boolean</code></td><td><p>If true, the module will attempt to use HTML5&#39;s pushState.<br />
                               See <a href="http://backbonejs.org/#History" target="_blank">http://backbonejs.org/#History</a>
                               for more details about how pushState works.</p>
</td>
    </tr><tr>
    <td>clicks</td><td><code>Boolean</code></td><td><p>If false, clicking on a link covered by <code>addHandler()</code> will bypass the module&#39;s default behaviour.</p>
</td>
    </tr><tr>
    <td>prefix</td><td><code>Boolean</code></td><td><p>Sets up a prefix for all links.</p>
</td>
    </tr><tr>
    <td>selector</td><td><code>Boolean</code></td><td><p>The default element selector for the click handler given by <code>addHandler()</code>.</p>
</td>
    </tr><tr>
    <td>navigate_defaults</td><td><code>Boolean</code></td><td><p>Allows for default properties to be passed to the module&#39;s internal Backbone.Router on <code>go()</code>.</p>
</td>
    </tr>  </tbody>
</table>


* * *

<a name="module_router.done"></a>

### router.done : <code>Boolean</code>
Has the router triggered?

**Kind**: static property of <code>[router](#module_router)</code>  

* * *

<a name="module_router.url"></a>

### router.url : <code>String</code>
Current router URL.

**Kind**: static property of <code>[router](#module_router)</code>  

* * *

<a name="module_router.route"></a>

### router.route : <code>String</code>
Current route name.

**Kind**: static property of <code>[router](#module_router)</code>  

* * *

<a name="module_router.args"></a>

### router.args : <code>Array</code>
Current route arguments.

**Kind**: static property of <code>[router](#module_router)</code>  

* * *

<a name="module_router.previous_url"></a>

### router.previous_url : <code>String</code>
Previous router URL.

**Kind**: static property of <code>[router](#module_router)</code>  

* * *

<a name="module_router.previous_route"></a>

### router.previous_route : <code>String</code>
Previous route name.

**Kind**: static property of <code>[router](#module_router)</code>  

* * *

<a name="module_router.previous_args"></a>

### router.previous_args : <code>Array</code>
Previous route arguments.

**Kind**: static property of <code>[router](#module_router)</code>  

* * *

<a name="module_router.domain"></a>

### router.domain() ⇒ <code>String</code>
Returns the current router's domain.

**Kind**: static method of <code>[router](#module_router)</code>  

* * *

<a name="module_router.root"></a>

### router.root() ⇒ <code>String</code>
Returns the current router's root path.

**Kind**: static method of <code>[router](#module_router)</code>  

* * *

<a name="module_router.path"></a>

### router.path() ⇒ <code>String</code>
Returns the current router's full path (domain + root).

**Kind**: static method of <code>[router](#module_router)</code>  

* * *

<a name="module_router.setup"></a>

### router.setup([domain], [root]) ⇒ <code>router</code>
Sets up the domain and root this router will operate on.

**Kind**: static method of <code>[router](#module_router)</code>  
**Returns**: <code>router</code> - Returns the module itself, to ease chaining.  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>[domain]</td><td><code>String</code></td><td><p>The base domain for this router.</p>
</td>
    </tr><tr>
    <td>[root]</td><td><code>String</code></td><td><p>The base path (after domain, the immutable part) for this router.</p>
</td>
    </tr>  </tbody>
</table>


* * *

<a name="module_router.start"></a>

### router.start([silent]) ⇒ <code>router</code>
Starts the router.It will automatically start processing URL changes.

**Kind**: static method of <code>[router](#module_router)</code>  
**Returns**: <code>router</code> - Returns the module itself, to ease chaining.  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>[silent]</td><td><code>Boolean</code></td><td><p>Determines whether the router should fire initial events or not.</p>
</td>
    </tr>  </tbody>
</table>


* * *

<a name="module_router.stop"></a>

### router.stop() ⇒ <code>router</code>
Stops the router.

**Kind**: static method of <code>[router](#module_router)</code>  
**Returns**: <code>router</code> - Returns the module itself, to ease chaining.  

* * *

<a name="module_router.use"></a>

### router.use(...functions) ⇒ <code>router</code>
Adds a middleware layer to the global router.The provided callback will be executed every time the URL changes.

**Kind**: static method of <code>[router](#module_router)</code>  
**Returns**: <code>router</code> - Returns the module itself, to ease chaining.  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>...functions</td><td><code>function</code></td><td><p>The callbacks to add.<br />
                                  The methods themselves will receive the name of the route and an array of arguments, along with a
                                  <code>next</code> callback at the end, in order to skip to the next function in the chain.</p>
</td>
    </tr>  </tbody>
</table>

**Example**  
```js
// this middleware can be used to check stuff in the new path.// for example, to update something in the app everytime the route changesCylinder.router.use(function (name, args, next) {    console.log(name); // name of the matched route, ex: "my-route"    console.log(args); // array of matched arguments, ex: ["hey", "john"]    next(); // keep the chain going.});
```
**Example**  
```js
// one good example of middleware is for authentication purposes,// for instance, if you probably need all of your routes protected,// so let's check if there's tokens and whatnotvar userData = null; // would be an object if logged invar userToken = null; // would be a stringvar unprotectedRoutes = ['login', 'register']; // routes that don't need login, but shouldn't be accessed if there is loginvar urlToRedirectAfterLogin = null; // URL to redirect the user after loginCylinder.router.use(function (name, args, next) {    if (unprotectedRoutes.indexOf(name) > -1) {        // we entered an unprotected route that shouldn't        // be entered unless we're logged out        if (userToken !== null) {            Cylinder.router.go('home');  // login has been made, so go to next            return; // stop processing here        }    }    if (userToken === null) {        // no login, let's redirect to the login page        urlToRedirectAfterLogin = Cylinder.router.url;        Cylinder.router.go('login');        return;    }    // no issues encountered?    // then let the user through!    next();});
```

* * *

<a name="module_router.unuse"></a>

### router.unuse(...functions) ⇒ <code>router</code>
Removes a middleware layer from the global router.You must provide the same callback you provided in <code>add()</code>, otherwise this method will do no good.

**Kind**: static method of <code>[router](#module_router)</code>  
**Returns**: <code>router</code> - Returns the module itself, to ease chaining.  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>...functions</td><td><code>function</code></td><td><p>The callbacks to remove.</p>
</td>
    </tr>  </tbody>
</table>


* * *

<a name="module_router.add"></a>

### router.add([name], syntax, ...callbacks)
Adds a handler to the router.This handler will be triggered every time the URL matches the syntax provided.

**Kind**: static method of <code>[router](#module_router)</code>  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>[name]</td><td><code>String</code></td><td><p>Name of the handler for identification purposes inside added middleware.
                                 This name will be slugified once added, so be careful when setting this to avoid mismatching.</p>
</td>
    </tr><tr>
    <td>syntax</td><td><code>String</code></td><td><p>The URL syntax that will be hash mapped to the handler.
                                 See <a href="http://backbonejs.org/#Router-routes" target="_blank">http://backbonejs.org/#Router-routes</a>
                                 to learn more about how this syntax can be set.</p>
</td>
    </tr><tr>
    <td>...callbacks</td><td><code>function</code></td><td><p>Callback functions specific to this handler. They will be executed in the order they&#39;re provided.<br />
                                 The methods themselves will receive all of the arguments passed into the syntax, along with a
                                 <code>next</code> callback at the end, in order to skip to the next function in the callback list.</p>
</td>
    </tr>  </tbody>
</table>

**Example**  
```js
// route with multiple callbacks,// in order to keep stuff organizedCylinder.router.add(    'my-route',    'test/:abc/:def',    function (abc, def, next) {        // intermediate function in chain,        // this can be used to validate something        if (abc === 'hey') {            throw 'You cannot hey me!';        }        next(); // no errors? keep going    },    function (abc, def) {        // final callback in chain,        // ...    });
```

* * *

<a name="module_router.addHandler"></a>

### router.addHandler([selector]) ⇒ <code>router</code>
Adds an event handler that will capture all clicks on internal site links, and calls the module's <code>go()</code> method.<br />The default selector will not capture clicks on hyperlinks with the [data-bypass] attribute.

**Kind**: static method of <code>[router](#module_router)</code>  
**Returns**: <code>router</code> - Returns the module itself, to ease chaining.  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>[selector]</td><td><code>String</code></td><td><p>Override the default selector provided to jQuery, in order to target custom elements.<br />
                              If empty, the method will provide the selector from <code>options.selector</code>.</p>
</td>
    </tr>  </tbody>
</table>


* * *

<a name="module_router.removeHandler"></a>

### router.removeHandler([selector]) ⇒ <code>router</code>
Removes the event handler added by <code>addHandler()</code>.

**Kind**: static method of <code>[router](#module_router)</code>  
**Returns**: <code>router</code> - Returns the module itself, to ease chaining.  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>[selector]</td><td><code>String</code></td><td><p>Previously provided selector to override the default one provided to jQuery, in order to target custom elements.<br />
                              If empty, the method will provide the selector from <code>options.selector</code>.</p>
</td>
    </tr>  </tbody>
</table>


* * *

<a name="module_router.go"></a>

### router.go([url], [options], [prefix]) ⇒ <code>router</code>
Changes the current URL to the one specified.<br />If <code>start()</code> wasn't called, then it will change URL location natively instead of going through the router's methods.

**Kind**: static method of <code>[router](#module_router)</code>  
**Returns**: <code>router</code> - Returns the module itself, to ease chaining.  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>[url]</td><td><code>String</code></td><td><p>The URL to navigate to. If null, it will navigate to the same page by forcing options.trigger to <code>true</code>.</p>
</td>
    </tr><tr>
    <td>[options]</td><td><code>Boolean</code></td><td><p>Options to pass to Backbone.Router&#39;s method.</p>
</td>
    </tr><tr>
    <td>[prefix]</td><td><code>Boolean</code></td><td><p>Should the method include the prefix set in the module&#39;s <code>options.prefix</code>?</p>
</td>
    </tr>  </tbody>
</table>


* * *

<a name="module_router.reload"></a>

### router.reload([delay])
Reloads the page instantaneously, unless a delay is set.

**Kind**: static method of <code>[router](#module_router)</code>  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>[delay]</td><td><code>Number</code> | <code>Boolean</code></td><td><p>The delay of the reload, in seconds.
                                  If &quot;false&quot; is passed, the timeout will be cancelled and the page won&#39;t be reloaded.</p>
</td>
    </tr>  </tbody>
</table>


* * *

