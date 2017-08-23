<a name="module_store"></a>

## store
Store module for CylinderClass.


* [store](#module_store)
    * [.Model](#module_store.Model) : <code>Model</code>
    * [.use(name, obj)](#module_store.use) ⇒ <code>Model</code>
    * [.unuse(name)](#module_store.unuse) ⇒ <code>Model</code>
    * [.models()](#module_store.models) ⇒ <code>Array</code>
    * [.with(name, exception)](#module_store.with) ⇒ <code>Model</code>
    * [.switch(name)](#module_store.switch) ⇒ <code>Model</code>


* * *

<a name="module_store.Model"></a>

### store.Model : <code>Model</code>
Default model that can and should be used to create new data models.<br />
The model is based on the standard <a href="http://backbonejs.org/#Model" target="_blank">Backbone.Model</a>, and uses the same methods.
You are free to override what this module considers as the main data model methods: <code>fetch()</code>, <code>save()</code>, and <code>destroy()</code>.

**Kind**: static property of [<code>store</code>](#module_store)  
**Properties**

<table>
  <thead>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>Model.fetch</td><td><code>function</code></td><td><p>Loads properties onto the model. The module does not call this method automatically.</p>
</td>
    </tr><tr>
    <td>Model.save</td><td><code>function</code></td><td><p>Saves properties from the model using your method of choice.</p>
</td>
    </tr><tr>
    <td>Model.destroy</td><td><code>function</code></td><td><p>Should be used to completely destroy a model. Use at your discretion.</p>
</td>
    </tr>  </tbody>
</table>

**Example**  
```js
// the following example creates a new model that will
// take advantage of the browser's local storage.
// Notice: Cylinder.store comes with a localstorage model by default!
var LocalStorageModel = Cylinder.store.Model.extend({
    namespace: 'abc',
    fetch: function () {
        // load the object in localStorage to the model
        this.set(window.localStorage[this.namespace]);
    },
    save: function () {
        // save the model as a plain object to localStorage
        window.localStorage[this.namespace] = this.toJSON();
    }
});

// we now add the model to the module
Cylinder.store.use('localstorage', new LocalStorageModel);

// we switch the store's context to always use it
// and use the get/set/unset/clear methods
Cylinder.store.switch('localstorage');
Cylinder.store.set('abc', 123);

// we can also fetch the model directly and chain operations without switching contexts.
// just be wary that some operations may not return the model itself, like .get() or .toJSON().
Cylinder.with('localstorage').set('def', 456).unset('abc').toJSON();
```
**Example**  
```js
// the following doesn't take advantage of the Model,
// but is an example of how to simply register a new data model
// without having to extend the default model, since .use() will
// automatically detect the type of object and convert it.
Cylinder.store.use('localstorage', {
    namespace: 'abc',
    fetch: function () {
        // load the object in localStorage to the model
        this.set(window.localStorage[this.namespace]);
    },
    save: function () {
        // save the model as a plain object to localStorage
        window.localStorage[this.namespace] = this.toJSON();
    }
});

Cylinder.store.switch('localstorage');
Cylinder.store.set('abc', 123);
```

* * *

<a name="module_store.use"></a>

### store.use(name, obj) ⇒ <code>Model</code>
Adds a model to the data store.<br />
The object provided can be either an already initialized instance of a data model,
an uninstanced data model, or a plain object that will be converted to a new data model.

**Kind**: static method of [<code>store</code>](#module_store)  
**Returns**: <code>Model</code> - Returns the model itself after being added and initialized.  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>name</td><td><code>String</code></td><td><p>The name of the model to add.</p>
</td>
    </tr><tr>
    <td>obj</td><td><code>Model</code> | <code>Object</code></td><td><p>The model to add.</p>
</td>
    </tr>  </tbody>
</table>


* * *

<a name="module_store.unuse"></a>

### store.unuse(name) ⇒ <code>Model</code>
Removes a model from the data store.

**Kind**: static method of [<code>store</code>](#module_store)  
**Returns**: <code>Model</code> - Returns the model itself after being removed.  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>name</td><td><code>String</code></td><td><p>The name of the data model to remove.</p>
</td>
    </tr>  </tbody>
</table>


* * *

<a name="module_store.models"></a>

### store.models() ⇒ <code>Array</code>
Returns a list of existing models.

**Kind**: static method of [<code>store</code>](#module_store)  

* * *

<a name="module_store.with"></a>

### store.with(name, exception) ⇒ <code>Model</code>
Returns a previously registered data model.

**Kind**: static method of [<code>store</code>](#module_store)  
**Returns**: <code>Model</code> - Returns the model itself, or null if it's not found and <code>exception</code> is <code>false</code>.  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>name</td><td><code>String</code></td><td><p>The name of the model.</p>
</td>
    </tr><tr>
    <td>exception</td><td><code>Boolean</code></td><td><p>If false, the method won&#39;t throw an exception if the model is not found.</p>
</td>
    </tr>  </tbody>
</table>


* * *

<a name="module_store.switch"></a>

### store.switch(name) ⇒ <code>Model</code>
Switches store contexts to a previously registered data model.<br /><br />
After switching, the following methods are available on the module:<br />
<ul>
<li><a href="http://backbonejs.org/#Model-fetch" target="_blank">fetch()</a></li>
<li><a href="http://backbonejs.org/#Model-save" target="_blank">save()</a></li>
<li><a href="http://backbonejs.org/#Model-destroy" target="_blank">destroy()</a></li>
<li><a href="http://backbonejs.org/#Model-get" target="_blank">get()</a></li>
<li><a href="http://backbonejs.org/#Model-escape" target="_blank">escape()</a></li>
<li><a href="http://backbonejs.org/#Model-set" target="_blank">set()</a></li>
<li><a href="http://backbonejs.org/#Model-has" target="_blank">has()</a></li>
<li><a href="http://backbonejs.org/#Model-unset" target="_blank">unset()</a></li>
<li><a href="http://backbonejs.org/#Model-clear" target="_blank">clear()</a></li>
<li><a href="http://backbonejs.org/#Model-toJSON" target="_blank">toJSON()</a></li>
</ul>

**Kind**: static method of [<code>store</code>](#module_store)  
**Returns**: <code>Model</code> - Returns the model itself after switching.  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>name</td><td><code>String</code></td><td><p>The name of the model.</p>
</td>
    </tr>  </tbody>
</table>

**Example**  
```js
Cylinder.store.switch('localstorage'); // switches the "Cylinder.store" context
Cylinder.store.set('abc', 123); // sets 'abc' on localStorage
Cylinder.store.get('abc'); // => 123
```

* * *

