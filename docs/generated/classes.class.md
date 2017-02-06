<a name="CylinderClass"></a>

## CylinderClass
**Kind**: global class  

* [CylinderClass](#CylinderClass)
    * [new CylinderClass()](#new_CylinderClass_new)
    * [.version](#CylinderClass+version) ⇒ <code>String</code>
    * [.$](#CylinderClass+$) : <code>jQuery</code>
    * [._](#CylinderClass+_) : <code>Underscore</code>
    * [.s](#CylinderClass+s) : <code>UnderscoreString</code>
    * [.initialized()](#CylinderClass+initialized) ⇒ <code>Boolean</code>
    * [.dependency(...dependencies, [loud])](#CylinderClass+dependency) ⇒ <code>Boolean</code>
    * [.extend(func, [extendOnInit])](#CylinderClass+extend) ⇒ <code>Mixed</code>
    * [.module(name, func)](#CylinderClass+module) ⇒ <code>Mixed</code>
    * [.modules()](#CylinderClass+modules) ⇒ <code>Object</code>
    * [.init([callback])](#CylinderClass+init) ⇒ <code>[CylinderClass](#CylinderClass)</code>


* * *

<a name="new_CylinderClass_new"></a>

### new CylinderClass()
Main framework class.Extends upon [Backbone.Events](http://backbonejs.org/#Events).


* * *

<a name="CylinderClass+version"></a>

### cylinderClass.version ⇒ <code>String</code>
Framework version.

**Kind**: instance property of <code>[CylinderClass](#CylinderClass)</code>  

* * *

<a name="CylinderClass+$"></a>

### cylinderClass.$ : <code>jQuery</code>
The jQuery instance.

**Kind**: instance property of <code>[CylinderClass](#CylinderClass)</code>  

* * *

<a name="CylinderClass+_"></a>

### cylinderClass._ : <code>Underscore</code>
The underscore.js instance.

**Kind**: instance property of <code>[CylinderClass](#CylinderClass)</code>  

* * *

<a name="CylinderClass+s"></a>

### cylinderClass.s : <code>UnderscoreString</code>
The underscore.string instance.

**Kind**: instance property of <code>[CylinderClass](#CylinderClass)</code>  

* * *

<a name="CylinderClass+initialized"></a>

### cylinderClass.initialized() ⇒ <code>Boolean</code>
Checks if the framework has been initialized.

**Kind**: instance method of <code>[CylinderClass](#CylinderClass)</code>  

* * *

<a name="CylinderClass+dependency"></a>

### cylinderClass.dependency(...dependencies, [loud]) ⇒ <code>Boolean</code>
Validate if a variable or a dependency exists.The framework will check if it exists in the global scope.

**Kind**: instance method of <code>[CylinderClass](#CylinderClass)</code>  
**Returns**: <code>Boolean</code> - Returns true or false depending whether the dependency exists. If `loud` is `true`, it throws an exception if the dependency doesn't exist.  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>...dependencies</td><td><code>String</code> | <code>Object</code></td><td><p>The names of the dependencies to be checked.</p>
</td>
    </tr><tr>
    <td>[loud]</td><td><code>Boolean</code></td><td><p>If <code>true</code>, the method will throw an exception when a specified dependency is not found.</p>
</td>
    </tr>  </tbody>
</table>

**Example**  
```js
// you can check if a dependency exists or not,// so you can gracefully handle missing dependenciesif (Cylinder.dependency('$.fn.velocity')) {    // velocity is present    $('#element').velocity({ top: 0 });}else {    // velocity.js is not defined    // so you can use a fallback    $('#element').animate({ top: 0 });}
```
**Example**  
```js
// you can check for dependencies inside a variable,// and the whole family tree will be checked from top-levelvar everyDependency = Cylinder.dependency('$.fn.slick', 'Cylinder.router', 'Cylinder.resize');
```
**Example**  
```js
// you can also throw an exception if you pass `true` at the end.// you can also specify objects if you want a cleaner exception output.Cylinder.dependency(    'jQuery',    { package: '_', name: 'underscore.js' },    { package: 's', name: 'underscore.string', scope: window, optional: true },    'Backbone',    'asdf', // imagine this variable doesn't exist    true);
```

* * *

<a name="CylinderClass+extend"></a>

### cylinderClass.extend(func, [extendOnInit]) ⇒ <code>Mixed</code>
Extends the framework's core.<br />If <code>extendOnInit</code> is true, then the framework won't be extended until properly initialized.

**Kind**: instance method of <code>[CylinderClass](#CylinderClass)</code>  
**Returns**: <code>Mixed</code> - Returns the result of 'func' after evaluated.  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>func</td><td><code>function</code> | <code>Object</code></td><td><p>The extension&#39;s constructor.</p>
</td>
    </tr><tr>
    <td>[extendOnInit]</td><td><code>Boolean</code></td><td><p>If true, the framework will only add &#39;func&#39; after &#39;init&#39; is called.</p>
</td>
    </tr>  </tbody>
</table>

**Example**  
```js
Cylinder.extend(function (cl) {    var extension = {};    extension.abc = 123;    extension.dfg = 456;    return extension;});console.log(Cylinder.abc); // 123console.log(Cylinder.dfg); // 456
```

* * *

<a name="CylinderClass+module"></a>

### cylinderClass.module(name, func) ⇒ <code>Mixed</code>
Extends the framework with a specific named module.<br />The module won't be added until the framework is properly initialized.When, or if, <code>initialize()</code> is called, then the module will be added as well.

**Kind**: instance method of <code>[CylinderClass](#CylinderClass)</code>  
**Returns**: <code>Mixed</code> - Returns the result of 'func' after evaluated.  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>name</td><td><code>String</code></td><td><p>The module&#39;s name.</p>
</td>
    </tr><tr>
    <td>func</td><td><code>function</code></td><td><p>The module&#39;s constructor.</p>
</td>
    </tr>  </tbody>
</table>

**Example**  
```js
Cylinder.module('mymodule', function (cl, module) {    module.alert = function (str) {        alert('abc');    };    return module;});Cylinder.mymodule.alert('hello!');
```

* * *

<a name="CylinderClass+modules"></a>

### cylinderClass.modules() ⇒ <code>Object</code>
Returns a list of existing modules.

**Kind**: instance method of <code>[CylinderClass](#CylinderClass)</code>  

* * *

<a name="CylinderClass+init"></a>

### cylinderClass.init([callback]) ⇒ <code>[CylinderClass](#CylinderClass)</code>
Properly initializes the framework and all of the modules and extensions added to it.<br />Keep in mind that modules will be initialized before any extensions whose <code>extendOnInit</code> property is true.<br />This method is based on jQuery's <code>$(document).ready()</code> shorthand.

**Kind**: instance method of <code>[CylinderClass](#CylinderClass)</code>  
**Returns**: <code>[CylinderClass](#CylinderClass)</code> - Returns the instance itself.  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>[callback]</td><td><code>function</code></td><td><p>Function to run after initialization.</p>
</td>
    </tr>  </tbody>
</table>

**Example**  
```js
// initialize the current instance// onto a new, more type-friendly, variablevar cl = Cylinder.init(function () {    console.log('cylinder is initialized!');    console.log('modules present:', cl.modules());});
```

* * *

