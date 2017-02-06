(function (scope) {

	// include main classes
	scope.CylinderClass = require('./classes/class');
	scope.CylinderException = require('./classes/exception');
	scope.CylinderResizeRule = require('./classes/resizerule');

	// include extension/module classes
	scope.CylinderClass.ExtensionControllers = require('./extensions/controllers');
	scope.CylinderClass.ModuleUtils = require('./modules/utils');
	scope.CylinderClass.ModuleDom = require('./modules/dom');
	scope.CylinderClass.ModuleStore = require('./modules/store');
	scope.CylinderClass.ModuleTemplates = require('./modules/templates');
	scope.CylinderClass.ModuleRouter = require('./modules/router');
	scope.CylinderClass.ModuleResize = require('./modules/resize');
	scope.CylinderClass.ModuleScroll = require('./modules/scroll');

	// instantiate
	scope.Cylinder = scope.cylinder = new CylinderClass();
	scope.Cylinder.extend(scope.CylinderClass.ExtensionControllers);
	scope.Cylinder.module('utils', scope.CylinderClass.ModuleUtils);
	scope.Cylinder.module('dom', scope.CylinderClass.ModuleDom);
	scope.Cylinder.module('store', scope.CylinderClass.ModuleStore);
	scope.Cylinder.module('templates', scope.CylinderClass.ModuleTemplates);
	scope.Cylinder.module('router', scope.CylinderClass.ModuleRouter);
	scope.Cylinder.module('resize', scope.CylinderClass.ModuleResize);
	scope.Cylinder.module('scroll', scope.CylinderClass.ModuleScroll);

})(window);
