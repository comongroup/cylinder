<a name="module_CylinderControllers"></a>

## CylinderControllers ⇐ <code>CylinderClass</code>
**Extends:** <code>CylinderClass</code>  

* [CylinderControllers](#module_CylinderControllers) ⇐ <code>CylinderClass</code>
    * [.controller(name, func)](#module_CylinderControllers.controller) ⇒ <code>Mixed</code>
    * [.controllers()](#module_CylinderControllers.controllers) ⇒ <code>Array</code>
    * [.initControllers([callback])](#module_CylinderControllers.initControllers) ⇒ <code>CylinderClass</code>


* * *

<a name="module_CylinderControllers.controller"></a>

### CylinderControllers.controller(name, func) ⇒ <code>Mixed</code>
Extends the framework with a specific named controller.<br />

**Kind**: static method of <code>[CylinderControllers](#module_CylinderControllers)</code>  
**Returns**: <code>Mixed</code> - Returns the result of 'func' after evaluated.  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>name</td><td><code>String</code></td><td><p>The controller&#39;s name.</p>
</td>
    </tr><tr>
    <td>func</td><td><code>function</code></td><td><p>The controller&#39;s constructor.</p>
</td>
    </tr>  </tbody>
</table>

**Example**  
```js
Cylinder.controller('myctrl', function (cl, controller) {
```

* * *

<a name="module_CylinderControllers.controllers"></a>

### CylinderControllers.controllers() ⇒ <code>Array</code>
Returns a list of existing controllers.

**Kind**: static method of <code>[CylinderControllers](#module_CylinderControllers)</code>  

* * *

<a name="module_CylinderControllers.initControllers"></a>

### CylinderControllers.initControllers([callback]) ⇒ <code>CylinderClass</code>
Properly initializes Cylinder's controllers.<br />

**Kind**: static method of <code>[CylinderControllers](#module_CylinderControllers)</code>  
**Returns**: <code>CylinderClass</code> - Returns the instance itself.  
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


* * *
