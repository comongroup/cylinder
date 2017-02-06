<a name="Cylinder"></a>

# Cylinder

Cylinder is a Javascript framework created by [comOn group](http://www.comon.pt/) for our front-end applications.

It gathers and uses multiple **popular libraries** that we've used on our websites - like [jQuery](http://jquery.com/), [Underscore.js](http://underscorejs.org/), and [Backbone.js](http://backbonejs.org/), - and builds upon them, creating **modules** such as Router, Templates and Store.

## Extensions, models and controllers

You can easily expand the framework with your own methods and properties, by directly extending it, or through modules that provide common functionality for your app.

```
var cl = Cylinder.init(function () {
    // Cylinder.init executes $(document).ready(),
    // so you can run all your jQuery code safely here.

    // adding variables to the instance
    cl.$container = $('#container');

    // changing module-related stuff
    cl.store.switch('localstorage'); // change store's default storage method
    cl.store.fetch(); // load all data from localstorage to the store (after switching)
    cl.store.set('start', Date.now()); // save a variable to the store
    cl.templates.options.parse = function (t) { Mustache.parse(t.html); }; // if mustache is included, you can have a template parser
    cl.templates.options.render = function (t, o, p) { return Mustache.render(t.html, o, p); }; // if mustache is included, you can render a template
    cl.templates.defaults['hello'] = function () { return 'world'; }; // default variable for all templates
    cl.router.options.push = true; // use pushState provided by Backbone.Router

    // starting controllers
    cl.initControllers(function () {
        // stuff after initializing all controllers
        cl.router.addHandler(); // add default click handler for all internal links
        cl.router.start(); // start processing all of the navigation, including the current location
    });
});
```

Cylinder also allows you to create basic controllers, to help you keep your code organized.

```
// this is a very rudimentary, barebones example
// of how you can organize your controllers.
Cylinder.controller('Todo', function (cl, controller) {
    controller.$element = $('#todo');
    controller.list = new TodoList(); // a previously created Backbone.Collection

    controller.list.on('add', function (model) {
        if (model.view) {
            model.view.$el.appendTo(controller.$element);
        }
    });

    controller.list.on('remove', function (model) {
        if (model.view) {
            model.view.$el.detach();
        }
    });

    window.Todo = controller;
    return controller; // always return your controllers!
});
```

## Dependencies used

Cylinder uses these libraries for common functionality:

- jQuery - http://jquery.com/
- Underscore - http://underscorejs.org/
- Underscore.string - http://epeli.github.io/underscore.string/
- Backbone - http://backbonejs.org/
