<a name="module_resize"></a>

## resize
Resize module for CylinderClass.


* [resize](#module_resize)
    * [.done](#module_resize.done) : <code>Boolean</code>
    * [.width](#module_resize.width) : <code>Number</code>
    * [.height](#module_resize.height) : <code>Number</code>
    * [.previous_width](#module_resize.previous_width) : <code>Number</code>
    * [.previous_height](#module_resize.previous_height) : <code>Number</code>
    * [.addRule(name, rule)](#module_resize.addRule)
    * [.removeRule(name)](#module_resize.removeRule)
    * [.rules()](#module_resize.rules) ⇒ <code>Array.&lt;CylinderResizeRule&gt;</code>
    * [.trigger()](#module_resize.trigger)


* * *

<a name="module_resize.done"></a>

### resize.done : <code>Boolean</code>
Has the window been resized?

**Kind**: static property of <code>[resize](#module_resize)</code>  

* * *

<a name="module_resize.width"></a>

### resize.width : <code>Number</code>
Current window width.

**Kind**: static property of <code>[resize](#module_resize)</code>  

* * *

<a name="module_resize.height"></a>

### resize.height : <code>Number</code>
Current window height.

**Kind**: static property of <code>[resize](#module_resize)</code>  

* * *

<a name="module_resize.previous_width"></a>

### resize.previous_width : <code>Number</code>
Previous window width.

**Kind**: static property of <code>[resize](#module_resize)</code>  

* * *

<a name="module_resize.previous_height"></a>

### resize.previous_height : <code>Number</code>
Previous window height.

**Kind**: static property of <code>[resize](#module_resize)</code>  

* * *

<a name="module_resize.addRule"></a>

### resize.addRule(name, rule)
Adds a rule to the module.

**Kind**: static method of <code>[resize](#module_resize)</code>  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>name</td><td><code>String</code></td><td><p>The name of the rule to add.</p>
</td>
    </tr><tr>
    <td>rule</td><td><code>CylinderResizeRule</code></td><td><p>The rule object to add.</p>
</td>
    </tr>  </tbody>
</table>


* * *

<a name="module_resize.removeRule"></a>

### resize.removeRule(name)
Removes a rule from the module.

**Kind**: static method of <code>[resize](#module_resize)</code>  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>name</td><td><code>String</code></td><td><p>The name of the rule to remove.</p>
</td>
    </tr>  </tbody>
</table>


* * *

<a name="module_resize.rules"></a>

### resize.rules() ⇒ <code>Array.&lt;CylinderResizeRule&gt;</code>
Returns a collection of names and their CylinderResizeRules.

**Kind**: static method of <code>[resize](#module_resize)</code>  
**Returns**: <code>Array.&lt;CylinderResizeRule&gt;</code> - The collection of rules.  

* * *

<a name="module_resize.trigger"></a>

### resize.trigger()
Triggers a <code>resize</code> event on the instance this module is running on,
providing it the current width and height of the window.

**Kind**: static method of <code>[resize](#module_resize)</code>  

* * *

