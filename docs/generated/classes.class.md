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
    * [.extend(destination, ...sources)](#CylinderClass+extend) ⇒ <code>Object</code>
    * [.resolve(parent, path, [returns])](#CylinderClass+resolve) ⇒ <code>Any</code> \| <code>Undefined</code>
    * [.dependency(...dependencies, [loud])](#CylinderClass+dependency) ⇒ <code>Boolean</code>
    * [.mix(func, [mixOnInit])](#CylinderClass+mix) ⇒ <code>Mixed</code>
    * [.module(name, func)](#CylinderClass+module) ⇒ <code>Any</code>
    * [.modules()](#CylinderClass+modules) ⇒ <code>Object</code>
    * [.init([callback])](#CylinderClass+init) ⇒ [<code>CylinderClass</code>](#CylinderClass)


* * *

<a name="new_CylinderClass_new"></a>

### new CylinderClass()
Main framework class.
Extends upon [Backbone.Events](http://backbonejs.org/#Events).


* * *

<a name="CylinderClass+version"></a>

### cylinderClass.version ⇒ <code>String</code>
Framework version.

**Kind**: instance property of [<code>CylinderClass</code>](#CylinderClass)  

* * *

<a name="CylinderClass+$"></a>

### cylinderClass.$ : <code>jQuery</code>
The jQuery instance.

**Kind**: instance property of [<code>CylinderClass</code>](#CylinderClass)  

* * *

<a name="CylinderClass+_"></a>

### cylinderClass._ : <code>Underscore</code>
The underscore.js instance.

**Kind**: instance property of [<code>CylinderClass</code>](#CylinderClass)  

* * *

<a name="CylinderClass+s"></a>

### cylinderClass.s : <code>UnderscoreString</code>
The underscore.string instance.

**Kind**: instance property of [<code>CylinderClass</code>](#CylinderClass)  

* * *

<a name="CylinderClass+initialized"></a>

### cylinderClass.initialized() ⇒ <code>Boolean</code>
Checks if the framework has been initialized.

**Kind**: instance method of [<code>CylinderClass</code>](#CylinderClass)  

* * *

<a name="CylinderClass+extend"></a>

### cylinderClass.extend(destination, ...sources) ⇒ <code>Object</code>
Performs a shallow copy of all properties in the **source** objects over to the **destination** object.
Any nested objects or arrays will not be duplicated.
The method respects the order of the given objects, so the last object's properties will always prevail over previous source objects.

**Kind**: instance method of [<code>CylinderClass</code>](#CylinderClass)  
**Returns**: <code>Object</code> - The same object passed in destination, but with properties from sources.  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>destination</td><td><code>Object</code></td><td><p>Object to be extended.</p>
</td>
    </tr><tr>
    <td>...sources</td><td><code>Object</code></td><td><p>Objects to extend the destination object with.</p>
</td>
    </tr>  </tbody>
</table>


* * *

<a name="CylinderClass+resolve"></a>

### cylinderClass.resolve(parent, path, [returns]) ⇒ <code>Any</code> \| <code>Undefined</code>
Attempts to resolve a given path inside a parent object and returns its corresponding value.

**Kind**: instance method of [<code>CylinderClass</code>](#CylinderClass)  
**Returns**: <code>Any</code> \| <code>Undefined</code> - Returns the value of the given path, or the value of `returns` if path is not found.  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>parent</td><td><code>Any</code></td><td><p>The parent object where we should search.</p>
</td>
    </tr><tr>
    <td>path</td><td><code>String</code></td><td><p>The string symbolizing the path to the desired property.</p>
</td>
    </tr><tr>
    <td>[returns]</td><td><code>Any</code></td><td><p>If given, the method will return this variable by default.</p>
</td>
    </tr>  </tbody>
</table>

**Example**  
```js
// searching inside nested objects for a given property
// only having a path and not worrying about errors

var famousPeople = {
    'e64d88': {
        name: 'Beyoncé',
        gender: 'female',
        dob: '1981/09/04',
        active: true,
        children: [
            {
                name: 'Blue Ivy Carter',
                gender: 'female',
                dob: '2012/01/07'
            }
        ]
    },
    '13d46f': {
        name: 'John Mayer',
        gender: 'male',
        dob: '1977/10/16',
        active: true,
        children: []
    }
};

// search for the given paths
// and attempt to find results

Cylinder.resolve(famousPeople, '13d46f.dob'); // '1977/10/16'
Cylinder.resolve(famousPeople, 'e64d88.children.length'); // 1              (works with standard properties of other types)
Cylinder.resolve(famousPeople, 'e64d88.children.0.gender'); // 'female'     (dot notation works)
Cylinder.resolve(famousPeople, 'e64d88.children[0].gender'); // 'female'    (array notation also works)
Cylinder.resolve(famousPeople, 'f33581.children[2].name'); // undefined     (path wasn't found and default value not set)
Cylinder.resolve(famousPeople, 'f33581.children[2].name', false); // false  (path wasn't found but `returns` was set)
```

* * *

<a name="CylinderClass+dependency"></a>

### cylinderClass.dependency(...dependencies, [loud]) ⇒ <code>Boolean</code>
Validate if a variable or a dependency exists.
The framework will check if it exists in the global scope.

**Kind**: instance method of [<code>CylinderClass</code>](#CylinderClass)  
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
// you can check if a dependency exists or not,
// so you can gracefully handle missing dependencies

if (Cylinder.dependency('$.fn.velocity')) {
    // velocity is present
    $('#element').velocity({ top: 0 });
}
else {
    // velocity.js is not defined
    // so you can use a fallback
    $('#element').animate({ top: 0 });
}
```
**Example**  
```js
// you can check for dependencies inside a variable,
// and the whole family tree will be checked from top-level

var everyDependency = Cylinder.dependency('$.fn.slick', 'Cylinder.router', 'Cylinder.resize');
```
**Example**  
```js
// you can also throw an exception if you pass `true` at the end.
// you can also specify objects if you want a cleaner exception output.

Cylinder.dependency(
    'jQuery',
    { package: '_', name: 'underscore.js' },
    { package: 's', name: 'underscore.string', scope: window, optional: true },
    'Backbone',
    'asdf', // imagine this variable doesn't exist
    true
);
```

* * *

<a name="CylinderClass+mix"></a>

### cylinderClass.mix(func, [mixOnInit]) ⇒ <code>Mixed</code>
Extends the framework's core with an object or the result of a callback.<br />
If <code>mixOnInit</code> is true, then the framework won't be mixed until properly initialized.

**Kind**: instance method of [<code>CylinderClass</code>](#CylinderClass)  
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
    <td>[mixOnInit]</td><td><code>Boolean</code></td><td><p>If true, the framework will only add &#39;func&#39; after &#39;init&#39; is called.</p>
</td>
    </tr>  </tbody>
</table>

**Example**  
```js
Cylinder.mix(function (cl) {
    var extension = {};
    extension.abc = 123;
    extension.dfg = 456;
    return extension;
});

console.log(Cylinder.abc); // 123
console.log(Cylinder.dfg); // 456
```

* * *

<a name="CylinderClass+module"></a>

### cylinderClass.module(name, func) ⇒ <code>Any</code>
Extends the framework with a specific named module.<br />
The module won't be added until the framework is properly initialized.
When, or if, <code>initialize()</code> is called, then the module will be added as well.

**Kind**: instance method of [<code>CylinderClass</code>](#CylinderClass)  
**Returns**: <code>Any</code> - Returns the result of 'func' after evaluated.  
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
Cylinder.module('mymodule', function (cl, module) {
    module.alert = function (str) {
        alert('abc');
    };
    return module;
});

Cylinder.mymodule.alert('hello!');
```

* * *

<a name="CylinderClass+modules"></a>

### cylinderClass.modules() ⇒ <code>Object</code>
Returns a list of existing modules.

**Kind**: instance method of [<code>CylinderClass</code>](#CylinderClass)  

* * *

<a name="CylinderClass+init"></a>

### cylinderClass.init([callback]) ⇒ [<code>CylinderClass</code>](#CylinderClass)
Properly initializes the framework and all of the modules and extensions added to it.<br />
Keep in mind that modules will be initialized before any extensions whose <code>mixOnInit</code> property is true.<br />
This method is based on jQuery's <code>$(document).ready()</code> shorthand.

**Kind**: instance method of [<code>CylinderClass</code>](#CylinderClass)  
**Returns**: [<code>CylinderClass</code>](#CylinderClass) - Returns the instance itself.  
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
// initialize the current instance
// onto a new, more type-friendly, variable
var cl = Cylinder.init(function () {
    console.log('cylinder is initialized!');
    console.log('modules present:', cl.modules());
});
```

* * *

