<a name="module_utils"></a>

## utils
Utilities module for CylinderClass.


* [utils](#module_utils)
    * [.text(str)](#module_utils.text) ⇒ <code>String</code>
    * [.unserialize(string)](#module_utils.unserialize) ⇒ <code>Object</code>
    * [.query(key, [serialized])](#module_utils.query) ⇒ <code>String</code> &#124; <code>Null</code>


* * *

<a name="module_utils.text"></a>

### utils.text(str) ⇒ <code>String</code>
Removes all HTML from a string.

**Kind**: static method of <code>[utils](#module_utils)</code>  
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

### utils.unserialize(string) ⇒ <code>Object</code>
Unserializes a string into an object.<br /><br />
This method is based on the implementation by Bruce Kirkpatrick.<br />
<a target="_blank" href="https://gist.github.com/brucekirkpatrick/7026682#gistcomment-1442581">https://gist.github.com/brucekirkpatrick/7026682#gistcomment-1442581</a>

**Kind**: static method of <code>[utils](#module_utils)</code>  
**Returns**: <code>Object</code> - - The string, unserialized into an object.  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>string</td><td><code>String</code></td><td><p>The serialized object.</p>
</td>
    </tr>  </tbody>
</table>


* * *

<a name="module_utils.query"></a>

### utils.query(key, [serialized]) ⇒ <code>String</code> &#124; <code>Null</code>
Extracts a named variable from a string.

**Kind**: static method of <code>[utils](#module_utils)</code>  
**Returns**: <code>String</code> &#124; <code>Null</code> - The value in form of a string, or <code>null</code> if it doesn't exist.  
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

