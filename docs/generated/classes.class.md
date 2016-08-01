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
    * [.dependency(...dependencies, [silent])](#CylinderClass+dependency) ⇒ <code>Boolean</code>
    * [.extend(func, [extendOnInit])](#CylinderClass+extend) ⇒ <code>Mixed</code>
    * [.module(name, func)](#CylinderClass+module) ⇒ <code>Mixed</code>
    * [.modules()](#CylinderClass+modules) ⇒ <code>Object</code>
    * [.init([callback])](#CylinderClass+init) ⇒ <code>[CylinderClass](#CylinderClass)</code>


* * *

<a name="new_CylinderClass_new"></a>

### new CylinderClass()
Main framework class.


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

### cylinderClass.dependency(...dependencies, [silent]) ⇒ <code>Boolean</code>
Validate if a variable or a dependency exists.

**Kind**: instance method of <code>[CylinderClass](#CylinderClass)</code>  
**Returns**: <code>Boolean</code> - Returns true if it exists, and throws an exception if it doesn't (unless the last argument is <code>true</code>).  
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
    <td>[silent]</td><td><code>Boolean</code></td><td><p>If true, the method will not throw an exception when a mandatory dependency is not found.</p>
</td>
    </tr>  </tbody>
</table>

**Example**  
```js
// throws an exception because "asdf" is not declared.
```
**Example**  
```js
// you can check for dependencies inside a variable
```
**Example**  
```js
// if `true` is sent at the end, the method doesn't throw an exception
```

* * *

<a name="CylinderClass+extend"></a>

### cylinderClass.extend(func, [extendOnInit]) ⇒ <code>Mixed</code>
Extends the framework's core.<br />

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
Cylinder.extend(function (cl) {
```

* * *

<a name="CylinderClass+module"></a>

### cylinderClass.module(name, func) ⇒ <code>Mixed</code>
Extends the framework with a specific named module.<br />

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
Cylinder.module('mymodule', function (cl, module) {
```

* * *

<a name="CylinderClass+modules"></a>

### cylinderClass.modules() ⇒ <code>Object</code>
Returns a list of existing modules.

**Kind**: instance method of <code>[CylinderClass](#CylinderClass)</code>  

* * *

<a name="CylinderClass+init"></a>

### cylinderClass.init([callback]) ⇒ <code>[CylinderClass](#CylinderClass)</code>
Properly initializes the framework and all of the modules and extensions added to it.<br />

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
// initialize the current instance
```

* * *
