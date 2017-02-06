<a name="module_dom"></a>

## dom
DOM management module for CylinderClass.


* [dom](#module_dom)
    * [.options](#module_dom.options) : <code>Object</code>
    * [.$window](#module_dom.$window) : <code>jQueryObject</code>
    * [.$document](#module_dom.$document) : <code>jQueryObject</code>
    * [.$html](#module_dom.$html) : <code>jQueryObject</code>
    * [.$head](#module_dom.$head) : <code>jQueryObject</code>
    * [.$body](#module_dom.$body) : <code>jQueryObject</code>
    * [.title(value, override)](#module_dom.title)
    * [.meta(obj)](#module_dom.meta)


* * *

<a name="module_dom.options"></a>

### dom.options : <code>Object</code>
The options taken by the module.

**Kind**: static property of <code>[dom](#module_dom)</code>  
**Properties**

<table>
  <thead>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>title</td><td><code>String</code></td><td><p>The app&#39;s default title.</p>
</td>
    </tr>  </tbody>
</table>


* * *

<a name="module_dom.$window"></a>

### dom.$window : <code>jQueryObject</code>
The cached element for the <code>window</code> DOM object.

**Kind**: static property of <code>[dom](#module_dom)</code>  

* * *

<a name="module_dom.$document"></a>

### dom.$document : <code>jQueryObject</code>
The cached element for the <code>document</code> DOM object.

**Kind**: static property of <code>[dom](#module_dom)</code>  

* * *

<a name="module_dom.$html"></a>

### dom.$html : <code>jQueryObject</code>
The cached element for <code>&lt;html&gt;</code>.

**Kind**: static property of <code>[dom](#module_dom)</code>  

* * *

<a name="module_dom.$head"></a>

### dom.$head : <code>jQueryObject</code>
The cached element for <code>&lt;head&gt;</code>.

**Kind**: static property of <code>[dom](#module_dom)</code>  

* * *

<a name="module_dom.$body"></a>

### dom.$body : <code>jQueryObject</code>
The cached element for <code>&lt;body&gt;</code>.

**Kind**: static property of <code>[dom](#module_dom)</code>  

* * *

<a name="module_dom.title"></a>

### dom.title(value, override)
Changes the tab's title and unescapes characters as needed.

**Kind**: static method of <code>[dom](#module_dom)</code>  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>value</td><td><code>String</code></td><td><p>The title to apply.</p>
</td>
    </tr><tr>
    <td>override</td><td><code>Boolean</code></td><td><p>If true, the app&#39;s default title won&#39;t be suffixed.</p>
</td>
    </tr>  </tbody>
</table>


* * *

<a name="module_dom.meta"></a>

### dom.meta(obj)
Changes meta tags.

**Kind**: static method of <code>[dom](#module_dom)</code>  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>obj</td><td><code>Object</code></td><td><p>A collection of meta-tag names and values.</p>
</td>
    </tr>  </tbody>
</table>


* * *

