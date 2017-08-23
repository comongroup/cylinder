<a name="module_utils"></a>

## utils
Utilities module for CylinderClass.


* [utils](#module_utils)
    * [.string(obj)](#module_utils.string) ⇒ <code>String</code>
    * [.text(str)](#module_utils.text) ⇒ <code>String</code>
    * [.unserialize(str)](#module_utils.unserialize) ⇒ <code>Object</code>
    * [.query(key, [serialized])](#module_utils.query) ⇒ <code>String</code> \| <code>Null</code>
    * [.clamp(min, value, max)](#module_utils.clamp) ⇒ <code>Number</code>
    * [.lerp(start, end, t)](#module_utils.lerp) ⇒ <code>Number</code>
    * [.vlerp(arr, t)](#module_utils.vlerp) ⇒ <code>Number</code>


* * *

<a name="module_utils.string"></a>

### utils.string(obj) ⇒ <code>String</code>
Transforms an object into a string.<br /><br />
This method is based on the implementation from underscore.string.<br />
<a target="_blank" href="https://github.com/epeli/underscore.string/blob/master/helper/makeString.js">https://github.com/epeli/underscore.string/blob/master/helper/makeString.js</a>

**Kind**: static method of [<code>utils</code>](#module_utils)  
**Returns**: <code>String</code> - The new string.  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>obj</td><td><code>Any</code></td><td><p>The object to transform.</p>
</td>
    </tr>  </tbody>
</table>


* * *

<a name="module_utils.text"></a>

### utils.text(str) ⇒ <code>String</code>
Removes all HTML from a string.<br /><br />
This method is based on the implementation from underscore.string.<br />
<a target="_blank" href="https://github.com/epeli/underscore.string/blob/master/stripTags.js">https://github.com/epeli/underscore.string/blob/master/stripTags.js</a>

**Kind**: static method of [<code>utils</code>](#module_utils)  
**Returns**: <code>String</code> - The string without HTML.  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>str</td><td><code>String</code></td><td><p>The string to clean.</p>
</td>
    </tr>  </tbody>
</table>


* * *

<a name="module_utils.unserialize"></a>

### utils.unserialize(str) ⇒ <code>Object</code>
Unserializes a string into an object.<br /><br />
This method is based on the implementation by Bruce Kirkpatrick.<br />
<a target="_blank" href="https://gist.github.com/brucekirkpatrick/7026682#gistcomment-1442581">https://gist.github.com/brucekirkpatrick/7026682#gistcomment-1442581</a>

**Kind**: static method of [<code>utils</code>](#module_utils)  
**Returns**: <code>Object</code> - The string, unserialized into an object.  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>str</td><td><code>String</code></td><td><p>The serialized object.</p>
</td>
    </tr>  </tbody>
</table>


* * *

<a name="module_utils.query"></a>

### utils.query(key, [serialized]) ⇒ <code>String</code> \| <code>Null</code>
Extracts a named variable from a string.

**Kind**: static method of [<code>utils</code>](#module_utils)  
**Returns**: <code>String</code> \| <code>Null</code> - The value in form of a string, or <code>null</code> if it doesn't exist.  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>key</td><td><code>String</code></td><td><p>The variable to extract.</p>
</td>
    </tr><tr>
    <td>[serialized]</td><td><code>String</code></td><td><p>The string to extract from. If null, the method will use the browser&#39;s query string.</p>
</td>
    </tr>  </tbody>
</table>


* * *

<a name="module_utils.clamp"></a>

### utils.clamp(min, value, max) ⇒ <code>Number</code>
Clamps a numeric value.

**Kind**: static method of [<code>utils</code>](#module_utils)  
**Returns**: <code>Number</code> - The final clamped value.  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>min</td><td><code>Number</code></td><td><p>Minimum value.</p>
</td>
    </tr><tr>
    <td>value</td><td><code>Number</code></td><td><p>Value to clamp.</p>
</td>
    </tr><tr>
    <td>max</td><td><code>Number</code></td><td><p>Maximum value.</p>
</td>
    </tr>  </tbody>
</table>


* * *

<a name="module_utils.lerp"></a>

### utils.lerp(start, end, t) ⇒ <code>Number</code>
Lerps between two given values.

**Kind**: static method of [<code>utils</code>](#module_utils)  
**Returns**: <code>Number</code> - The final lerped value.  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>start</td><td><code>Number</code></td><td><p>Starting value.</p>
</td>
    </tr><tr>
    <td>end</td><td><code>Number</code></td><td><p>Ending value.</p>
</td>
    </tr><tr>
    <td>t</td><td><code>Number</code></td><td><p>Lerp progress, should be between 0 and 1.</p>
</td>
    </tr>  </tbody>
</table>


* * *

<a name="module_utils.vlerp"></a>

### utils.vlerp(arr, t) ⇒ <code>Number</code>
Lerps between the first two numeric values in an array.

**Kind**: static method of [<code>utils</code>](#module_utils)  
**Returns**: <code>Number</code> - The final lerped value.  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>arr</td><td><code>Number</code></td><td><p>Array with numeric values.</p>
</td>
    </tr><tr>
    <td>t</td><td><code>Number</code></td><td><p>Lerp progress, should be between 0 and 1.</p>
</td>
    </tr>  </tbody>
</table>


* * *

