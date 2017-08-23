<a name="module_scroll"></a>

## scroll
Scroll module for CylinderClass.<br />
This module extends on <a target="_blank" href="http://backbonejs.org/#Events">Backbone.Events</a>.


* [scroll](#module_scroll)
    * [.$el](#module_scroll.$el) : <code>jQueryObject</code>
    * [.done](#module_scroll.done) : <code>Boolean</code>
    * [.left](#module_scroll.left) : <code>Number</code>
    * [.top](#module_scroll.top) : <code>Number</code>
    * [.right](#module_scroll.right) : <code>Number</code>
    * [.bottom](#module_scroll.bottom) : <code>Number</code>
    * [.previous_left](#module_scroll.previous_left) : <code>Number</code>
    * [.previous_top](#module_scroll.previous_top) : <code>Number</code>
    * [.previous_right](#module_scroll.previous_right) : <code>Number</code>
    * [.previous_bottom](#module_scroll.previous_bottom) : <code>Number</code>
    * [.go(left, top, [duration])](#module_scroll.go)


* * *

<a name="module_scroll.$el"></a>

### scroll.$el : <code>jQueryObject</code>
The main element being targeted.

**Kind**: static property of [<code>scroll</code>](#module_scroll)  

* * *

<a name="module_scroll.done"></a>

### scroll.done : <code>Boolean</code>
Has the element been scrolled?

**Kind**: static property of [<code>scroll</code>](#module_scroll)  

* * *

<a name="module_scroll.left"></a>

### scroll.left : <code>Number</code>
Current element's scrollLeft.

**Kind**: static property of [<code>scroll</code>](#module_scroll)  

* * *

<a name="module_scroll.top"></a>

### scroll.top : <code>Number</code>
Current element's scrollTop.

**Kind**: static property of [<code>scroll</code>](#module_scroll)  

* * *

<a name="module_scroll.right"></a>

### scroll.right : <code>Number</code>
Current element's width + scrollLeft.

**Kind**: static property of [<code>scroll</code>](#module_scroll)  

* * *

<a name="module_scroll.bottom"></a>

### scroll.bottom : <code>Number</code>
Current element's height + scrollTop.

**Kind**: static property of [<code>scroll</code>](#module_scroll)  

* * *

<a name="module_scroll.previous_left"></a>

### scroll.previous_left : <code>Number</code>
Previous element's scrollLeft.

**Kind**: static property of [<code>scroll</code>](#module_scroll)  

* * *

<a name="module_scroll.previous_top"></a>

### scroll.previous_top : <code>Number</code>
Previous element's scrollTop.

**Kind**: static property of [<code>scroll</code>](#module_scroll)  

* * *

<a name="module_scroll.previous_right"></a>

### scroll.previous_right : <code>Number</code>
Previous element's width + scrollLeft.

**Kind**: static property of [<code>scroll</code>](#module_scroll)  

* * *

<a name="module_scroll.previous_bottom"></a>

### scroll.previous_bottom : <code>Number</code>
Previous element's height + scrollTop.

**Kind**: static property of [<code>scroll</code>](#module_scroll)  

* * *

<a name="module_scroll.go"></a>

### scroll.go(left, top, [duration])
Scrolls the current element to given coordinates.<br />
A jQuery object can also be given instead of <code>left</code> and <code>top</code>,
and the module will make the element's contents scroll into that object's left and top.

**Kind**: static method of [<code>scroll</code>](#module_scroll)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>left</td><td><code>Number</code></td><td><p>The horizontal coordinate to scroll to.</p>
</td>
    </tr><tr>
    <td>top</td><td><code>Number</code></td><td><p>The vertical coordinate to scroll to.</p>
</td>
    </tr><tr>
    <td>[duration]</td><td><code>Number</code></td><td><p>Time it takes for scrolling to finish.</p>
</td>
    </tr>  </tbody>
</table>


* * *

