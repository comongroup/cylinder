<a name="module_templates"></a>

## templates
Templates module for CylinderClass.


* [templates](#module_templates)
    * [.options](#module_templates.options) : <code>Object</code>
    * [.defaults](#module_templates.defaults) : <code>Object</code>
    * [.has(id)](#module_templates.has) ⇒ <code>Boolean</code>
    * [.add(id, template, [defaults], [partials])](#module_templates.add) ⇒ <code>Object</code>
    * [.get(id)](#module_templates.get) ⇒ <code>Object</code>
    * [.load(...ids, [request])](#module_templates.load) ⇒ <code>Promise</code>
    * [.render(id, [options], [partials])](#module_templates.render) ⇒ <code>String</code>
    * [.apply($el, id, [options], [partials])](#module_templates.apply) ⇒ <code>Promise</code>
    * [.replace($el, [options], [partials])](#module_templates.replace) ⇒ <code>Promise</code>


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
    <td>load</td><td><code>Boolean</code></td><td><p>If true, the module will try to load templates automatically.</p>
</td>
    </tr><tr>
    <td>load_cache</td><td><code>Boolean</code></td><td><p>If true, the browser will cache any remotely-fetched templates.</p>
</td>
    </tr><tr>
    <td>load_base_path</td><td><code>Boolean</code></td><td><p>Remote template base path.</p>
</td>
    </tr><tr>
    <td>load_extension</td><td><code>Boolean</code></td><td><p>Remote template file extension.</p>
</td>
    </tr><tr>
    <td>fire_events</td><td><code>Boolean</code></td><td><p>Fires all events when rendering or doing other things.</p>
</td>
    </tr><tr>
    <td>detach</td><td><code>Boolean</code></td><td><p>If true, the <code>apply</code> and <code>replace</code> methods attempt to remove all children first.
                                            Be wary that this might provoke memory leaks by not unbinding any data or events from the children.</p>
</td>
    </tr><tr>
    <td>partials</td><td><code>Boolean</code></td><td><p>All templates will always be available as partials.</p>
</td>
    </tr><tr>
    <td>premades</td><td><code>String</code> | <code>Boolean</code></td><td><p>If not false, the module will look for a specific object variable for templates (default: JST).</p>
</td>
    </tr>  </tbody>
</table>


* * *

<a name="module_templates.defaults"></a>

### templates.defaults : <code>Object</code>
Default options for templates.

**Kind**: static property of <code>[templates](#module_templates)</code>  

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

<a name="module_templates.get"></a>

### templates.get(id) ⇒ <code>Object</code>
Returns a template if it exists, and attempts to fetch from the local DOM if it doesn't.

**Kind**: static method of <code>[templates](#module_templates)</code>  
**Returns**: <code>Object</code> - Returns the generated internal template module's object, or an empty object if not found.  
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

<a name="module_templates.load"></a>

### templates.load(...ids, [request]) ⇒ <code>Promise</code>
Attempts to load a remote template.<br />
If multiple strings are provided, the method will call <code>Promise.fail(err)</code> if one of them fails to load, regardless of whether others succeeded.<br /><br />
Notice: this method should be considered and used as an asynchronous method.

**Kind**: static method of <code>[templates](#module_templates)</code>  
**Returns**: <code>Promise</code> - Returns a Promise object.  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>...ids</td><td><code>String</code></td><td><p>The unique identifier(s) of the template(s) to load.</p>
</td>
    </tr><tr>
    <td>[request]</td><td><code>Object</code></td><td><p>Additional parameters for the AJAX request. This argument will not be accepted if there are multiple IDs to be loaded.</p>
</td>
    </tr>  </tbody>
</table>


* * *

<a name="module_templates.render"></a>

### templates.render(id, [options], [partials]) ⇒ <code>String</code>
Renders a template.

**Kind**: static method of <code>[templates](#module_templates)</code>  
**Returns**: <code>String</code> - Returns the rendered template.  
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
    </tr>  </tbody>
</table>


* * *

<a name="module_templates.apply"></a>

### templates.apply($el, id, [options], [partials]) ⇒ <code>Promise</code>
Renders a template and applies it to a jQuery element.<br /><br />
If the element is not a jQuery element, it will throw an exception.<br />
If the template does not exist and 'options.load' is enabled, then it will attempt to load the template first.<br /><br />
Notice: this method should be considered and used as an asynchronous method.

**Kind**: static method of <code>[templates](#module_templates)</code>  
**Returns**: <code>Promise</code> - Returns a Promise object.  
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

### templates.replace($el, [options], [partials]) ⇒ <code>Promise</code>
Replaces the entire HTML of an element with a rendered version of it.<br /><br />
This method will store the original HTML of the selected element in cache.
If replace is called again on the same element, it will reuse that HTML instead of rendering on top of that rendered result.<br />
If the element is not a jQuery element, it will throw an exception.<br /><br />
Notice: this method is synchronous, however it still returns a promise object
in order to keep consistency between it and <code>apply()</code>, and should be used as such.

**Kind**: static method of <code>[templates](#module_templates)</code>  
**Returns**: <code>Promise</code> - Returns a Promise object.  
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

