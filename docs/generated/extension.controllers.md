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
The controller's constructor won't be initialized until <code>initControllers()</code> is called.
When, or if, <code>initControllers()</code> is called, then the module will be added as well.<br /><br />
The controller itself will be added to the internal controller list
(accessible through <code>controllers()</code>), but it will not be added to the global scope.

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
    // you can add the controller to the global scope, if you want.
    // this way, you'll be able to access it easily.
    window.MyCtrl = controller;

    // controller logic goes here!
    controller.alert = function (str) {
        alert('abc');
    };

    // always return the parent variable itself in the end,
    // because this is what Cylinder will recognize as the controller to add.
    return controller;
});

// you now have two ways to access controllers,
// either from Cylinder's own method...
Cylinder.controllers().myctrl.alert('hello!');

// or through the global scope, like we added up.
MyCtrl.alert('hello, world!');
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
This method is based on jQuery's <code>$(document).ready()</code> shorthand.

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

