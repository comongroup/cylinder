<a name="module_templates"></a>

## templates
Templates module for CylinderClass.


* [templates](#module_templates)
    * [.options](#module_templates.options) : <code>Object</code>
    * [.defaults](#module_templates.defaults) : <code>Object</code>
    * [.add(id, template, [defaults], [partials])](#module_templates.add) ⇒ <code>Object</code>
    * [.importFromObject(parent, [iterator])](#module_templates.importFromObject) ⇒ <code>Object</code>
    * [.importFromDOM([id])](#module_templates.importFromDOM) ⇒ <code>Array.&lt;Object&gt;</code>
    * [.has(id)](#module_templates.has) ⇒ <code>Boolean</code>
    * [.get(id)](#module_templates.get) ⇒ <code>Object</code> &#124; <code>Null</code>
    * [.render(id, [options], [partials], [trigger])](#module_templates.render) ⇒ <code>String</code> &#124; <code>Null</code>
    * [.apply($el, id, [options], [partials])](#module_templates.apply) ⇒ <code>jQueryObject</code>
    * [.replace($el, [options], [partials])](#module_templates.replace) ⇒ <code>jQueryObject</code>


* * *

<a name="module_templates.options"></a>

### templates.options : <code>Object</code>
The options taken by the module.

**Kind**: static property of <code>[templates](#module_templates)</code>  
**Properties**

<table>
  <thead>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>fire_events</td><td><code>Boolean</code></td><td><p>Fires all events when rendering or doing other things.</p>
</td>
    </tr><tr>
    <td>detach</td><td><code>Boolean</code></td><td><p>If true, the <code>apply</code> and <code>replace</code> methods attempt to remove all children first.
                                          Be wary that this might provoke memory leaks by not unbinding any data or events from the children.</p>
</td>
    </tr><tr>
    <td>dom_prefix</td><td><code>String</code></td><td><p>Selector prefix for DOM element IDs when importing templates from DOM.</p>
</td>
    </tr><tr>
    <td>dom_selector</td><td><code>String</code></td><td><p>Default selector for DOM elements when importing templates from DOM.</p>
</td>
    </tr><tr>
    <td>parse</td><td><code>function</code></td><td><p>Callback for parsing templates. Receives a template object, which always has an <code>html</code> string parameter.
                                          This method is called right before an added template is rendered, and is meant for applying optimizations.</p>
</td>
    </tr><tr>
    <td>render</td><td><code>function</code></td><td><p>Callback for rendering a template. Receives a template object, which always has an <code>html</code> string parameter.</p>
</td>
    </tr>  </tbody>
</table>


* * *

<a name="module_templates.defaults"></a>

### templates.defaults : <code>Object</code>
Default properties for templates.

**Kind**: static property of <code>[templates](#module_templates)</code>  

* * *

<a name="module_templates.add"></a>

### templates.add(id, template, [defaults], [partials]) ⇒ <code>Object</code>
Adds a template to the local cache.

**Kind**: static method of <code>[templates](#module_templates)</code>  
**Returns**: <code>Object</code> - Returns the generated internal template module's object.  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>id</td><td><code>String</code></td><td><p>The template&#39;s unique identifier.</p>
</td>
    </tr><tr>
    <td>template</td><td><code>String</code></td><td><p>The template&#39;s HTML structure.</p>
</td>
    </tr><tr>
    <td>[defaults]</td><td><code>Object</code></td><td><p>Default values for this template.</p>
</td>
    </tr><tr>
    <td>[partials]</td><td><code>Object</code></td><td><p>Included partial templates.</p>
</td>
    </tr>  </tbody>
</table>


* * *

<a name="module_templates.importFromObject"></a>

### templates.importFromObject(parent, [iterator]) ⇒ <code>Object</code>
Attempts to import templates from a parent variable.

**Kind**: static method of <code>[templates](#module_templates)</code>  
**Returns**: <code>Object</code> - Returns the object with the same keys but with each value replaced by the actual template object added into the module.  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>parent</td><td><code>Object</code></td><td><p>The object to fetch the templates from.</p>
</td>
    </tr><tr>
    <td>[iterator]</td><td><code>function</code></td><td><p>If a function is passed, the method will use it to iterate the object.</p>
</td>
    </tr>  </tbody>
</table>


* * *

<a name="module_templates.importFromDOM"></a>

### templates.importFromDOM([id]) ⇒ <code>Array.&lt;Object&gt;</code>
Attempts to import templates from `<script type="text/template">` objects.By default, every slash will be converted with an underscore when looking for a specific template by ID.If no ID is provided, the module will attempt to look through every element that matches the selector in options.dom_selector,and attempts to fetch a template ID and default options through `data-id` and `data-defaults` attributes respectively.

**Kind**: static method of <code>[templates](#module_templates)</code>  
**Returns**: <code>Array.&lt;Object&gt;</code> - Returns an array of generated template objects.  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>[id]</td><td><code>String</code></td><td><p>The ID of the template you wish to fetch from the DOM.</p>
</td>
    </tr>  </tbody>
</table>


* * *

<a name="module_templates.has"></a>

### templates.has(id) ⇒ <code>Boolean</code>
Checks if a template is in the local cache.

**Kind**: static method of <code>[templates](#module_templates)</code>  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>id</td><td><code>String</code></td><td><p>The template&#39;s unique identifier.</p>
</td>
    </tr>  </tbody>
</table>


* * *

<a name="module_templates.get"></a>

### templates.get(id) ⇒ <code>Object</code> &#124; <code>Null</code>
Returns a template if it exists, otherwise it'll return `null`.

**Kind**: static method of <code>[templates](#module_templates)</code>  
**Returns**: <code>Object</code> &#124; <code>Null</code> - Returns the template object, or null if not found.  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>id</td><td><code>String</code></td><td><p>The template&#39;s unique identifier.</p>
</td>
    </tr>  </tbody>
</table>


* * *

<a name="module_templates.render"></a>

### templates.render(id, [options], [partials], [trigger]) ⇒ <code>String</code> &#124; <code>Null</code>
Renders a template with the given ID.

**Kind**: static method of <code>[templates](#module_templates)</code>  
**Returns**: <code>String</code> &#124; <code>Null</code> - Returns the rendered template.  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>id</td><td><code>String</code></td><td><p>The unique identifier of the template to render.</p>
</td>
    </tr><tr>
    <td>[options]</td><td><code>Object</code></td><td><p>The object of options for the template to use.</p>
</td>
    </tr><tr>
    <td>[partials]</td><td><code>Object</code></td><td><p>The object of partials the template can use.</p>
</td>
    </tr><tr>
    <td>[trigger]</td><td><code>Boolean</code></td><td><p>If false, the method won&#39;t fire any events.</p>
</td>
    </tr>  </tbody>
</table>


* * *

<a name="module_templates.apply"></a>

### templates.apply($el, id, [options], [partials]) ⇒ <code>jQueryObject</code>
Renders a template and applies it to a jQuery element.<br /><br />If the element is not a jQuery element, it will throw an exception.

**Kind**: static method of <code>[templates](#module_templates)</code>  
**Returns**: <code>jQueryObject</code> - Returns the provided jQuery object.  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>$el</td><td><code>jQueryObject</code></td><td><p>The element to which the template should be rendered and applied to.</p>
</td>
    </tr><tr>
    <td>id</td><td><code>String</code></td><td><p>The unique identifier of the template to render.</p>
</td>
    </tr><tr>
    <td>[options]</td><td><code>Object</code></td><td><p>The object of options for the template to use.</p>
</td>
    </tr><tr>
    <td>[partials]</td><td><code>Object</code></td><td><p>The object of partials the template can use.</p>
</td>
    </tr>  </tbody>
</table>


* * *

<a name="module_templates.replace"></a>

### templates.replace($el, [options], [partials]) ⇒ <code>jQueryObject</code>
Replaces the entire HTML of an element with a rendered version of it.<br /><br />This method will store the original HTML of the selected element in cache.If replace is called again on the same element, it will reuse that HTML instead of rendering on top of that rendered result.<br />If the element is not a jQuery element, it will throw an exception.

**Kind**: static method of <code>[templates](#module_templates)</code>  
**Returns**: <code>jQueryObject</code> - Returns the provided jQuery object.  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>$el</td><td><code>jQueryObject</code></td><td><p>The element to replace the HTML on.</p>
</td>
    </tr><tr>
    <td>[options]</td><td><code>Object</code></td><td><p>The object of options for the template to use.</p>
</td>
    </tr><tr>
    <td>[partials]</td><td><code>Object</code></td><td><p>The object of partials the template can use.</p>
</td>
    </tr>  </tbody>
</table>


* * *

