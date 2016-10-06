webpackJsonp([1],{

/***/ 136:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__(0);
var angular2_modal_1 = __webpack_require__(4);
/**
 * A Dialog is a
 */
var VEXDialogButtons = (function () {
    function VEXDialogButtons() {
        /**
         * Emitted when a button was clicked
         * @type {EventEmitter<VEXButtonClickEvent>}
         */
        this.onButtonClick = new core_1.EventEmitter();
    }
    VEXDialogButtons.prototype.onClick = function (btn, $event) {
        $event.stopPropagation();
        this.onButtonClick.emit({ btn: btn, $event: $event });
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Array)
    ], VEXDialogButtons.prototype, "buttons", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], VEXDialogButtons.prototype, "onButtonClick", void 0);
    VEXDialogButtons = __decorate([
        core_1.Component({
            selector: 'vex-dialog-buttons',
            encapsulation: core_1.ViewEncapsulation.None,
            template: "<div class=\"vex-dialog-buttons\">\n    <button type=\"button\" \n         *ngFor=\"let btn of buttons;\"\n         [class]=\"btn.cssClass\"\n         (click)=\"onClick(btn, $event)\">{{btn.caption}}</button>\n</div>"
        }), 
        __metadata('design:paramtypes', [])
    ], VEXDialogButtons);
    return VEXDialogButtons;
}());
exports.VEXDialogButtons = VEXDialogButtons;
/**
 * A Dialog with customized buttons wrapped in a form.
 *
 */
var DialogFormModal = (function () {
    function DialogFormModal(dialog) {
        this.dialog = dialog;
        this.context = dialog.context;
    }
    DialogFormModal.prototype.onButtonClick = function ($event) {
        $event.btn.onClick(this, $event.$event);
    };
    DialogFormModal = __decorate([
        core_1.Component({
            selector: 'modal-dialog',
            encapsulation: core_1.ViewEncapsulation.None,
            template: "<form class=\"vex-dialog-form\">\n    <template [swapCmp]=\"context.content\"></template>\n    <vex-dialog-buttons [buttons]=\"context.buttons\"\n                        (onButtonClick)=\"onButtonClick($event)\"></vex-dialog-buttons>\n</form>"
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof angular2_modal_1.DialogRef !== 'undefined' && angular2_modal_1.DialogRef) === 'function' && _a) || Object])
    ], DialogFormModal);
    return DialogFormModal;
    var _a;
}());
exports.DialogFormModal = DialogFormModal;
var FormDropIn = (function () {
    function FormDropIn(dialog) {
        this.dialog = dialog;
        this.context = dialog.context;
    }
    FormDropIn = __decorate([
        core_1.Component({
            selector: 'drop-in-dialog',
            encapsulation: core_1.ViewEncapsulation.None,
            template: "<div class=\"vex-dialog-message\">{{context.message}}</div>\n <div *ngIf=\"context.showInput\" class=\"vex-dialog-input\">\n   <input #input\n          autofocus\n          name=\"vex\" \n          type=\"text\" \n          class=\"vex-dialog-prompt-input\"\n           (change)=\"context.defaultResult = input.value\" \n          placeholder=\"{{context.placeholder}}\">\n </div>\n <div *ngIf=\"context.showCloseButton\" \n      [class]=\"context.closeClassName\"\n      (click)=\"dialog.dismiss()\"></div>"
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof angular2_modal_1.DialogRef !== 'undefined' && angular2_modal_1.DialogRef) === 'function' && _a) || Object])
    ], FormDropIn);
    return FormDropIn;
    var _a;
}());
exports.FormDropIn = FormDropIn;


/***/ },

/***/ 137:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__(0);
var common_1 = __webpack_require__(20);
var angular2_modal_1 = __webpack_require__(4);
var index_1 = __webpack_require__(351);
var SharedModule = (function () {
    function SharedModule() {
    }
    SharedModule.forRoot = function () {
        return {
            ngModule: SharedModule,
            providers: []
        };
    };
    SharedModule = __decorate([
        core_1.NgModule({
            imports: [common_1.CommonModule, angular2_modal_1.ModalModule],
            declarations: [index_1.DemoHead],
            exports: [index_1.DemoHead, angular2_modal_1.ModalModule]
        }), 
        __metadata('design:paramtypes', [])
    ], SharedModule);
    return SharedModule;
}());
exports.SharedModule = SharedModule;


/***/ },

/***/ 206:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var Subject_1 = __webpack_require__(58);
__webpack_require__(584);
var createComponent_1 = __webpack_require__(208);
var BROWSER_PREFIX = ['webkit', 'moz', 'MS', 'o', ''];
function register(eventName, element, cb) {
    BROWSER_PREFIX.forEach(function (p) {
        element.addEventListener(p ? p + eventName : eventName.toLowerCase(), cb, false);
    });
}
/**
 * A base class for supporting dynamic components.
 * There are 3 main support areas:
 * 1 - Easy wrapper for dynamic styling via CSS classes and inline styles.
 * 2 - Easy wrapper for interception of transition/animation end events.
 * 3 - Easy wrapper for component creation and injection.
 *
 * Dynamic css is done via direct element manipulation (via renderer), it does not use change detection
 * or binding. This is to allow better control over animation.
 *
 * Animation support is limited, only transition/keyframes END even are notified.
 * The animation support is needed since currently the angular animation module is limited as well and
 * does not support CSS animation that are not pre-parsed and are not in the styles metadata of a component.
 *
 * Capabilities: Add/Remove styls, Add/Remove classes, listen to animation/transition end event,
 * add components
 */
var BaseDynamicComponent = (function () {
    function BaseDynamicComponent(el, renderer) {
        this.el = el;
        this.renderer = renderer;
    }
    BaseDynamicComponent.prototype.activateAnimationListener = function () {
        var _this = this;
        if (this.animationEnd)
            return;
        this.animationEnd = new Subject_1.Subject();
        this.animationEnd$ = this.animationEnd.asObservable();
        register('TransitionEnd', this.el.nativeElement, function (e) { return _this.onEnd(e); });
        register('AnimationEnd', this.el.nativeElement, function (e) { return _this.onEnd(e); });
    };
    /**
     * Set a specific inline style on the overlay host element.
     * @param prop The style key
     * @param value The value, undefined to remove
     * @returns {ModalOverlay}
     */
    BaseDynamicComponent.prototype.setStyle = function (prop, value) {
        this.renderer.setElementStyle(this.el.nativeElement, prop, value);
        return this;
    };
    BaseDynamicComponent.prototype.forceReflow = function () {
        this.el.nativeElement.offsetWidth;
    };
    BaseDynamicComponent.prototype.addClass = function (css, forceReflow) {
        var _this = this;
        if (forceReflow === void 0) { forceReflow = false; }
        css.split(' ')
            .forEach(function (c) { return _this.renderer.setElementClass(_this.el.nativeElement, c, true); });
        if (forceReflow)
            this.forceReflow();
    };
    BaseDynamicComponent.prototype.removeClass = function (css, forceReflow) {
        var _this = this;
        if (forceReflow === void 0) { forceReflow = false; }
        css.split(' ')
            .forEach(function (c) { return _this.renderer.setElementClass(_this.el.nativeElement, c, false); });
        if (forceReflow)
            this.forceReflow();
    };
    BaseDynamicComponent.prototype.ngOnDestroy = function () {
        if (this.animationEnd && !this.animationEnd.closed) {
            this.animationEnd.complete();
        }
    };
    BaseDynamicComponent.prototype.myAnimationEnd$ = function () {
        var _this = this;
        return this.animationEnd$
            .filter(function (e) { return e.target === _this.el.nativeElement; });
    };
    /**
     * Add a component, supply a view container ref.
     * Note: The components vcRef will result in a sibling.
     * @param component The component to add
     * @param vcRef The container to add to
     * @param bindings Bindings to use (added on top of the ViewContainerRef)
     * @returns {Promise<ComponentRef<any>>}
     */
    BaseDynamicComponent.prototype._addComponent = function (instructions) {
        var cmpRef = createComponent_1.createComponent(instructions);
        cmpRef.changeDetectorRef.detectChanges();
        return cmpRef;
    };
    BaseDynamicComponent.prototype.onEnd = function (event) {
        if (!this.animationEnd.closed) {
            this.animationEnd.next(event);
        }
    };
    return BaseDynamicComponent;
}());
exports.BaseDynamicComponent = BaseDynamicComponent;


/***/ },

/***/ 207:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var swap_component_directive_1 = __webpack_require__(534);
exports.SwapComponentDirective = swap_component_directive_1.SwapComponentDirective;
var base_dynamic_component_1 = __webpack_require__(206);
exports.BaseDynamicComponent = base_dynamic_component_1.BaseDynamicComponent;
var css_backdrop_1 = __webpack_require__(532);
exports.CSSBackdrop = css_backdrop_1.CSSBackdrop;
var css_dialog_container_1 = __webpack_require__(533);
exports.CSSDialogContainer = css_dialog_container_1.CSSDialogContainer;
// export { FadeInBackdrop } from './fade-in-backdrop';
// export { SplitScreenBackdrop } from './split-screen-backdrop';


/***/ },

/***/ 208:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__(0);
function createComponent(instructions) {
    var injector = getInjector(instructions);
    return instructions.vcRef.createComponent(injector.get(core_1.ComponentFactoryResolver).resolveComponentFactory(instructions.component), instructions.vcRef.length, injector, instructions.projectableNodes);
}
exports.createComponent = createComponent;
function getInjector(instructions) {
    var ctxInjector = instructions.injector || instructions.vcRef.parentInjector;
    return Array.isArray(instructions.bindings) && instructions.bindings.length > 0 ?
        core_1.ReflectiveInjector.fromResolvedProviders(instructions.bindings, ctxInjector) : ctxInjector;
}
// export function createComponent(cfr: ComponentFactoryResolver,
//                                         type: any,
//                                         vcr: ViewContainerRef,
//                                         bindings: ResolvedReflectiveProvider[],
//                                         projectableNodes?: any[][]): ComponentRef<any> {
//   return vcr.createComponent(
//     cfr.resolveComponentFactory(type),
//     vcr.length,
//     getInjector(vcr, bindings),
//     projectableNodes
//   );
// }
//
// function getInjector(viewContainer: ViewContainerRef, bindings: ResolvedReflectiveProvider[]) {
//   const ctxInjector = viewContainer.parentInjector;
//   return Array.isArray(bindings) && bindings.length > 0 ?
//     ReflectiveInjector.fromResolvedProviders(bindings, ctxInjector) : ctxInjector;
//
// }


/***/ },

/***/ 209:
/***/ function(module, exports) {

"use strict";
"use strict";
(function (DROP_IN_TYPE) {
    DROP_IN_TYPE[DROP_IN_TYPE["alert"] = 0] = "alert";
    DROP_IN_TYPE[DROP_IN_TYPE["prompt"] = 1] = "prompt";
    DROP_IN_TYPE[DROP_IN_TYPE["confirm"] = 2] = "confirm";
})(exports.DROP_IN_TYPE || (exports.DROP_IN_TYPE = {}));
var DROP_IN_TYPE = exports.DROP_IN_TYPE;
var OverlayRenderer = (function () {
    function OverlayRenderer() {
    }
    return OverlayRenderer;
}());
exports.OverlayRenderer = OverlayRenderer;


/***/ },

/***/ 210:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var overlay_directives_1 = __webpack_require__(538);
exports.OverlayTarget = overlay_directives_1.OverlayTarget;
exports.OverlayDialogBoundary = overlay_directives_1.OverlayDialogBoundary;
exports.DefaultOverlayTarget = overlay_directives_1.DefaultOverlayTarget;
var overlay_component_1 = __webpack_require__(537);
exports.ModalOverlay = overlay_component_1.ModalOverlay;
exports.EmbedComponentConfig = overlay_component_1.EmbedComponentConfig;
var overlay_service_1 = __webpack_require__(332);
exports.Overlay = overlay_service_1.Overlay;


/***/ },

/***/ 211:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__(0);
var angular2_modal_1 = __webpack_require__(4);
var BSMessageModalTitle = (function () {
    function BSMessageModalTitle(dialog) {
        this.dialog = dialog;
        this.context = dialog.context;
    }
    Object.defineProperty(BSMessageModalTitle.prototype, "titleHtml", {
        get: function () {
            return this.context.titleHtml ? 1 : 0;
        },
        enumerable: true,
        configurable: true
    });
    BSMessageModalTitle = __decorate([
        core_1.Component({
            selector: 'modal-title',
            encapsulation: core_1.ViewEncapsulation.None,
            template: "<div [ngClass]=\"context.headerClass\" [ngSwitch]=\"titleHtml\">\n      <button *ngIf=\"context.showClose\" type=\"button\" class=\"close\" \n              aria-label=\"Close\" (click)=\"dialog.dismiss()\">\n          <span aria-hidden=\"true\">\u00D7</span>\n      </button>\n      <div *ngSwitchCase=\"1\" [innerHtml]=\"context.titleHtml\"></div>\n      <h3 *ngSwitchDefault class=\"modal-title\">{{context.title}}</h3>\n </div>"
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof angular2_modal_1.DialogRef !== 'undefined' && angular2_modal_1.DialogRef) === 'function' && _a) || Object])
    ], BSMessageModalTitle);
    return BSMessageModalTitle;
    var _a;
}());
exports.BSMessageModalTitle = BSMessageModalTitle;
var BSMessageModalBody = (function () {
    function BSMessageModalBody(dialog) {
        this.dialog = dialog;
        this.context = dialog.context;
    }
    BSMessageModalBody = __decorate([
        core_1.Component({
            selector: 'modal-body',
            encapsulation: core_1.ViewEncapsulation.None,
            styles: [".form-group {\n    margin-top: 10px;\n  }"],
            template: "<div [ngClass]=\"context.bodyClass\"> \n    <div [innerHtml]=\"context.message\"></div>\n      <div *ngIf=\"context.showInput\" class=\"form-group\">\n        <input autofocus #input\n            name=\"bootstrap\" \n            type=\"text\" \n            class=\"form-control\"\n            [value]=\"context.defaultValue\"\n            (change)=\"context.defaultValue = input.value\"  \n            placeholder=\"{{context.placeholder}}\">\n      </div>\n    </div>\n"
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof angular2_modal_1.DialogRef !== 'undefined' && angular2_modal_1.DialogRef) === 'function' && _a) || Object])
    ], BSMessageModalBody);
    return BSMessageModalBody;
    var _a;
}());
exports.BSMessageModalBody = BSMessageModalBody;
/**
 * Represents the modal footer for storing buttons.
 */
var BSModalFooter = (function () {
    function BSModalFooter(dialog) {
        this.dialog = dialog;
    }
    BSModalFooter.prototype.onClick = function (btn, $event) {
        $event.stopPropagation();
        btn.onClick(this, $event);
    };
    BSModalFooter = __decorate([
        core_1.Component({
            selector: 'modal-footer',
            encapsulation: core_1.ViewEncapsulation.None,
            template: "<div [ngClass]=\"dialog.context.footerClass\">\n    <button *ngFor=\"let btn of dialog.context.buttons;\"\n            [ngClass]=\"btn.cssClass\"\n            (click)=\"onClick(btn, $event)\">{{btn.caption}}</button>\n</div>"
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof angular2_modal_1.DialogRef !== 'undefined' && angular2_modal_1.DialogRef) === 'function' && _a) || Object])
    ], BSModalFooter);
    return BSModalFooter;
    var _a;
}());
exports.BSModalFooter = BSModalFooter;
/**
 * A Component representing a generic bootstrap modal content element.
 *
 * By configuring a MessageModalContext instance you can:
 *
 *  Header:
 *      - Set header container class (default: modal-header)
 *      - Set title text (enclosed in H3 element)
 *      - Set title html (overrides text)
 *
 *  Body:
 *      - Set body container class.  (default: modal-body)
 *      - Set body container HTML.
 *
 *  Footer:
 *      - Set footer class.  (default: modal-footer)
 *      - Set button configuration (from 0 to n)
 */
var BSMessageModal = (function () {
    function BSMessageModal(dialog) {
        this.dialog = dialog;
    }
    BSMessageModal = __decorate([
        core_1.Component({
            selector: 'modal-content',
            encapsulation: core_1.ViewEncapsulation.None,
            template: "<modal-title></modal-title><modal-body></modal-body><modal-footer></modal-footer>"
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof angular2_modal_1.DialogRef !== 'undefined' && angular2_modal_1.DialogRef) === 'function' && _a) || Object])
    ], BSMessageModal);
    return BSMessageModal;
    var _a;
}());
exports.BSMessageModal = BSMessageModal;


/***/ },

/***/ 212:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__(0);
var angular2_modal_1 = __webpack_require__(4);
var BSModalContainer = (function (_super) {
    __extends(BSModalContainer, _super);
    function BSModalContainer(dialog, el, renderer) {
        _super.call(this, el, renderer);
        this.dialog = dialog;
        this.activateAnimationListener();
    }
    BSModalContainer = __decorate([
        core_1.Component({
            selector: 'bs-modal-container',
            host: {
                'tabindex': '-1',
                'role': 'dialog',
                'class': 'modal fade',
                'style': 'position: absolute; display: block'
            },
            encapsulation: core_1.ViewEncapsulation.None,
            template: "<div [ngClass]=\"dialog.context.dialogClass\" \n      [class.modal-lg]=\"dialog.context.size == 'lg'\"\n      [class.modal-sm]=\"dialog.context.size == 'sm'\">\n  <div class=\"modal-content\" style=\"display:block\" role=\"document\" overlayDialogBoundary>\n    <ng-content></ng-content>\n  </div>    \n</div>"
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof angular2_modal_1.DialogRef !== 'undefined' && angular2_modal_1.DialogRef) === 'function' && _a) || Object, (typeof (_b = typeof core_1.ElementRef !== 'undefined' && core_1.ElementRef) === 'function' && _b) || Object, (typeof (_c = typeof core_1.Renderer !== 'undefined' && core_1.Renderer) === 'function' && _c) || Object])
    ], BSModalContainer);
    return BSModalContainer;
    var _a, _b, _c;
}(angular2_modal_1.BaseDynamicComponent));
exports.BSModalContainer = BSModalContainer;


/***/ },

/***/ 213:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var angular2_modal_1 = __webpack_require__(4);
var message_modal_component_1 = __webpack_require__(211);
var modal_context_1 = __webpack_require__(333);
var DEFAULT_VALUES = {
    component: message_modal_component_1.BSMessageModal,
    headerClass: 'modal-header',
    bodyClass: 'modal-body',
    footerClass: 'modal-footer'
};
var DEFAULT_SETTERS = [
    'headerClass',
    'title',
    'titleHtml',
    'bodyClass',
    'footerClass'
];
/**
 * A Preset representing the configuration needed to open MessageModal.
 * This is an abstract implementation with no concrete behaviour.
 * Use derived implementation.
 */
var MessageModalPresetBuilder = (function (_super) {
    __extends(MessageModalPresetBuilder, _super);
    function MessageModalPresetBuilder(defaultValues, initialSetters, baseType) {
        if (defaultValues === void 0) { defaultValues = undefined; }
        if (initialSetters === void 0) { initialSetters = undefined; }
        if (baseType === void 0) { baseType = undefined; }
        _super.call(this, angular2_modal_1.extend(angular2_modal_1.extend({ buttons: [] }, DEFAULT_VALUES), defaultValues || {}), angular2_modal_1.arrayUnion(DEFAULT_SETTERS, initialSetters || []), baseType);
        angular2_modal_1.setAssignAlias(this, 'body', 'message', true);
    }
    MessageModalPresetBuilder.prototype.addButton = function (css, caption, onClick) {
        var btn = {
            cssClass: css,
            caption: caption,
            onClick: onClick
        };
        var key = angular2_modal_1.privateKey('buttons');
        this[key].push(btn);
        return this;
    };
    return MessageModalPresetBuilder;
}(modal_context_1.BSModalContextBuilder));
exports.MessageModalPresetBuilder = MessageModalPresetBuilder;


/***/ },

/***/ 214:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var modal_1 = __webpack_require__(215);
exports.Modal = modal_1.Modal;
var modal_context_1 = __webpack_require__(338);
exports.JSNativeModalContext = modal_context_1.JSNativeModalContext;
exports.JSNativeModalContextBuilder = modal_context_1.JSNativeModalContextBuilder;
var js_native_modal_renderer_1 = __webpack_require__(337);
exports.JSNativeModalRenderer = js_native_modal_renderer_1.JSNativeModalRenderer;
var js_native_preset_1 = __webpack_require__(339);
exports.JSNativePresetBuilder = js_native_preset_1.JSNativePresetBuilder;
var js_native_module_1 = __webpack_require__(540);
exports.JSNativeModalModule = js_native_module_1.JSNativeModalModule;
exports.providers = js_native_module_1.providers;


/***/ },

/***/ 215:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__(0);
var angular2_modal_1 = __webpack_require__(4);
var js_native_preset_1 = __webpack_require__(339);
var Modal = (function (_super) {
    __extends(Modal, _super);
    function Modal(overlay) {
        _super.call(this, overlay);
    }
    Modal.prototype.alert = function () {
        return new js_native_preset_1.JSNativePresetBuilder(this, angular2_modal_1.DROP_IN_TYPE.alert);
    };
    Modal.prototype.prompt = function () {
        return new js_native_preset_1.JSNativePresetBuilder(this, angular2_modal_1.DROP_IN_TYPE.prompt);
    };
    Modal.prototype.confirm = function () {
        return new js_native_preset_1.JSNativePresetBuilder(this, angular2_modal_1.DROP_IN_TYPE.confirm);
    };
    Modal.prototype.create = function (dialogRef, type, bindings) {
        return dialogRef;
    };
    Modal = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [(typeof (_a = typeof angular2_modal_1.Overlay !== 'undefined' && angular2_modal_1.Overlay) === 'function' && _a) || Object])
    ], Modal);
    return Modal;
    var _a;
}(angular2_modal_1.Modal));
exports.Modal = Modal;


/***/ },

/***/ 216:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var dom_modal_renderer_1 = __webpack_require__(542);
exports.DOMOverlayRenderer = dom_modal_renderer_1.DOMOverlayRenderer;
var modal_1 = __webpack_require__(543);
exports.Modal = modal_1.Modal;
var outside_event_plugin_1 = __webpack_require__(544);
exports.DOMOutsideEventPlugin = outside_event_plugin_1.DOMOutsideEventPlugin;


/***/ },

/***/ 327:
/***/ function(module, exports) {

"use strict";
"use strict";
var PRIVATE_PREFIX = '$$';
var RESERVED_REGEX = /^(\$\$).*/;
function validateMethodName(name) {
    if (!name) {
        throw new Error("Illegal method name. Empty method name is not allowed");
    }
    else if (name in this) {
        throw new Error("A member name '" + name + "' already defined.");
    }
}
/**
 * Returns a list of assigned property names (non private)
 * @param subject
 * @returns {string[]}
 */
function getAssignedPropertyNames(subject) {
    return Object.getOwnPropertyNames(subject)
        .filter(function (name) { return RESERVED_REGEX.test(name); })
        .map(function (name) { return name.substr(2); });
}
function privateKey(name) {
    return PRIVATE_PREFIX + name;
}
exports.privateKey = privateKey;
function objectDefinePropertyValue(obj, propertyName, value) {
    Object.defineProperty(obj, propertyName, {
        configurable: false,
        enumerable: false,
        writable: false,
        value: value
    });
}
/**
 * Given a FluentAssign instance, apply all of the supplied default values so calling
 * instance.toJSON will return those values (does not create a setter function)
 * @param instance
 * @param defaultValues
 */
function applyDefaultValues(instance, defaultValues) {
    Object.getOwnPropertyNames(defaultValues)
        .forEach(function (name) { return instance[privateKey(name)] = defaultValues[name]; });
}
/**
 * Create a function for setting a value for a property on a given object.
 * @param obj The object to apply the key & setter on.
 * @param propertyName The name of the property on the object
 * @param writeOnce If true will allow writing once (default: false)
 *
 * Example:
 * let obj = new FluentAssign<any>;
 * setAssignMethod(obj, 'myProp');
 * obj.myProp('someValue');
 * const result = obj.toJSON();
 * console.log(result); //{ myProp: 'someValue' }
 *
 *
 * let obj = new FluentAssign<any>;
 * setAssignMethod(obj, 'myProp', true); // applying writeOnce
 * obj.myProp('someValue');
 * obj.myProp('someValue'); // ERROR: Overriding config property 'myProp' is not allowed.
 */
function setAssignMethod(obj, propertyName, writeOnce) {
    var _this = this;
    if (writeOnce === void 0) { writeOnce = false; }
    validateMethodName.call(obj, propertyName);
    var key = privateKey(propertyName);
    objectDefinePropertyValue(obj, propertyName, function (value) {
        if (writeOnce && _this.hasOwnProperty(key)) {
            throw new Error("Overriding config property '" + propertyName + "' is not allowed.");
        }
        obj[key] = value;
        return obj;
    });
}
exports.setAssignMethod = setAssignMethod;
/**
 * Create a function for setting a value that is an alias to an other setter function.
 * @param obj The object to apply the key & setter on.
 * @param propertyName The name of the property on the object
 * @param srcPropertyName The name of the property on the object this alias points to
 * @param hard If true, will set a readonly property on the object that returns
 *        the value of the source property. Default: false
 *
 * Example:
 * let obj = new FluentAssign<any> ;
 * setAssignMethod(obj, 'myProp');
 * setAssignAlias(obj, 'myPropAlias', 'myProp');
 * obj.myPropAlias('someValue');
 * const result = obj.toJSON();
 * console.log(result); //{ myProp: 'someValue' }
 * result.myPropAlias // undefined
 *
 *
 * let obj = new FluentAssign<any> ;
 * setAssignMethod(obj, 'myProp');
 * setAssignAlias(obj, 'myPropAlias', 'myProp', true); // setting a hard alias.
 * obj.myPropAlias('someValue');
 * const result = obj.toJSON();
 * console.log(result); //{ myProp: 'someValue' }
 * result.myPropAlias // someValue
 */
function setAssignAlias(obj, propertyName, srcPropertyName, hard) {
    if (hard === void 0) { hard = false; }
    validateMethodName.call(obj, propertyName);
    objectDefinePropertyValue(obj, propertyName, function (value) {
        obj[srcPropertyName](value);
        return obj;
    });
    if (hard === true) {
        var key = privateKey(propertyName), srcKey_1 = privateKey(srcPropertyName);
        Object.defineProperty(obj, key, {
            configurable: false,
            enumerable: false,
            get: function () { return obj[srcKey_1]; }
        });
    }
}
exports.setAssignAlias = setAssignAlias;
/**
 * Represent a fluent API factory wrapper for defining FluentAssign instances.
 */
var FluentAssignFactory = (function () {
    function FluentAssignFactory(fluentAssign) {
        this._fluentAssign =
            fluentAssign instanceof FluentAssign ? fluentAssign : new FluentAssign();
    }
    /**
     * Create a setter method on the FluentAssign instance.
     * @param name The name of the setter function.
     * @param defaultValue If set (not undefined) set's the value on the instance immediately.
     * @returns {FluentAssignFactory}
     */
    FluentAssignFactory.prototype.setMethod = function (name, defaultValue) {
        if (defaultValue === void 0) { defaultValue = undefined; }
        setAssignMethod(this._fluentAssign, name);
        if (defaultValue !== undefined) {
            this._fluentAssign[name](defaultValue);
        }
        return this;
    };
    Object.defineProperty(FluentAssignFactory.prototype, "fluentAssign", {
        /**
         * The FluentAssign instance.
         * @returns {FluentAssign<T>}
         */
        get: function () {
            return this._fluentAssign;
        },
        enumerable: true,
        configurable: true
    });
    return FluentAssignFactory;
}());
exports.FluentAssignFactory = FluentAssignFactory;
/**
 * Represent an object where every property is a function representing an assignment function.
 * Calling each function with a value will assign the value to the object and return the object.
 * Calling 'toJSON' returns an object with the same properties but this time representing the
 * assigned values.
 *
 * This allows setting an object in a fluent API manner.
 * Example:
 let fluent = new FluentAssign<any>(undefined, ['some', 'went']);
 fluent.some('thing').went('wrong').toJSON();
 // { some: 'thing', went: 'wrong' }
 */
var FluentAssign = (function () {
    /**
     *
     * @param defaultValues An object representing default values for the underlying object.
     * @param initialSetters A list of initial setters for this FluentAssign.
     * @param baseType the class/type to create a new base. optional, {} is used if not supplied.
     */
    function FluentAssign(defaultValues, initialSetters, baseType) {
        var _this = this;
        if (defaultValues === void 0) { defaultValues = undefined; }
        if (initialSetters === void 0) { initialSetters = undefined; }
        if (baseType === void 0) { baseType = undefined; }
        if (Array.isArray(defaultValues)) {
            defaultValues.forEach(function (d) { return applyDefaultValues(_this, d); });
        }
        else if (defaultValues) {
            applyDefaultValues(this, defaultValues);
        }
        if (Array.isArray(initialSetters)) {
            initialSetters.forEach(function (name) { return setAssignMethod(_this, name); });
        }
        if (baseType) {
            this.__fluent$base__ = baseType;
        }
    }
    /**
     * Returns a FluentAssignFactory<FluentAssign<T>> ready to define a FluentAssign type.
     * @param defaultValues An object representing default values for the instance.
     * @param initialSetters A list of initial setters for the instance.
     * @returns {FluentAssignFactory<T>}
     */
    FluentAssign.compose = function (defaultValues, initialSetters) {
        if (defaultValues === void 0) { defaultValues = undefined; }
        if (initialSetters === void 0) { initialSetters = undefined; }
        return FluentAssign.composeWith(new FluentAssign(defaultValues, initialSetters));
    };
    /**
     * Returns a FluentAssignFactory<Z> where Z is an instance of FluentAssign<?> or a derived
     * class of it.
     * @param fluentAssign An instance of FluentAssign<?> or a derived class of FluentAssign<?>.
     * @returns {any}
     */
    FluentAssign.composeWith = function (fluentAssign) {
        return new FluentAssignFactory(fluentAssign);
    };
    FluentAssign.prototype.toJSON = function () {
        var _this = this;
        return getAssignedPropertyNames(this)
            .reduce(function (obj, name) {
            var key = privateKey(name);
            // re-define property descriptors (we dont want their value)
            var propDesc = Object.getOwnPropertyDescriptor(_this, key);
            if (propDesc) {
                Object.defineProperty(obj, name, propDesc);
            }
            else {
                obj[name] = _this[key];
            }
            return obj;
        }, this.__fluent$base__ ? new this.__fluent$base__() : {});
    };
    return FluentAssign;
}());
exports.FluentAssign = FluentAssign;


/***/ },

/***/ 328:
/***/ function(module, exports) {

"use strict";
"use strict";
var DialogBailOutError = (function (_super) {
    __extends(DialogBailOutError, _super);
    function DialogBailOutError(value) {
        _super.call(this);
        if (!value) {
            value = 'Dialog was forced to close by an unknown source.';
        }
        this.message = value;
    }
    return DialogBailOutError;
}(Error));
exports.DialogBailOutError = DialogBailOutError;


/***/ },

/***/ 329:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__(0);
var utils_1 = __webpack_require__(67);
var overlay_context_1 = __webpack_require__(330);
exports.DEFAULT_VALUES = {};
var DEFAULT_SETTERS = [
    'message'
];
var ModalContext = (function (_super) {
    __extends(ModalContext, _super);
    function ModalContext() {
        _super.apply(this, arguments);
    }
    return ModalContext;
}(overlay_context_1.OverlayContext));
exports.ModalContext = ModalContext;
/**
 * A core context builder for a modal window instance, used to define the context upon
 * a modal choose it's behaviour.
 */
var ModalContextBuilder = (function (_super) {
    __extends(ModalContextBuilder, _super);
    function ModalContextBuilder(defaultValues, initialSetters, baseType) {
        if (defaultValues === void 0) { defaultValues = undefined; }
        if (initialSetters === void 0) { initialSetters = undefined; }
        if (baseType === void 0) { baseType = undefined; }
        _super.call(this, utils_1.extend(exports.DEFAULT_VALUES, defaultValues || {}), utils_1.arrayUnion(DEFAULT_SETTERS, initialSetters || []), baseType);
    }
    ModalContextBuilder = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [Object, Array, Function])
    ], ModalContextBuilder);
    return ModalContextBuilder;
}(overlay_context_1.OverlayContextBuilder));
exports.ModalContextBuilder = ModalContextBuilder;


/***/ },

/***/ 330:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__(0);
var fluent_assign_1 = __webpack_require__(327);
var utils_1 = __webpack_require__(67);
exports.DEFAULT_VALUES = {
    inElement: false,
    isBlocking: true,
    keyboard: [27],
    supportsKey: function supportsKey(keyCode) {
        return this.keyboard.indexOf(keyCode) > -1;
    }
};
var DEFAULT_SETTERS = [
    'inElement',
    'isBlocking',
    'keyboard'
];
var OverlayContext = (function () {
    function OverlayContext() {
    }
    OverlayContext.prototype.normalize = function () {
        if (this.isBlocking !== false)
            this.isBlocking = true;
        if (this.keyboard === null) {
            this.keyboard = [];
        }
        else if (typeof this.keyboard === 'number') {
            this.keyboard = [this.keyboard];
        }
        else if (!Array.isArray(this.keyboard)) {
            this.keyboard = exports.DEFAULT_VALUES.keyboard;
        }
    };
    return OverlayContext;
}());
exports.OverlayContext = OverlayContext;
/**
 * A core context builder for a modal window instance, used to define the context upon
 * a modal choose it's behaviour.
 */
var OverlayContextBuilder = (function (_super) {
    __extends(OverlayContextBuilder, _super);
    function OverlayContextBuilder(defaultValues, initialSetters, baseType) {
        if (defaultValues === void 0) { defaultValues = undefined; }
        if (initialSetters === void 0) { initialSetters = undefined; }
        if (baseType === void 0) { baseType = undefined; }
        _super.call(this, utils_1.extend(exports.DEFAULT_VALUES, defaultValues || {}), utils_1.arrayUnion(DEFAULT_SETTERS, initialSetters || []), baseType || OverlayContext // https://github.com/Microsoft/TypeScript/issues/7234
        );
    }
    /**
     * Returns an new OverlayConfig with a context property representing the data in this builder.
     * @param base A base configuration that the result will extend
     * @returns OverlayConfig
     */
    OverlayContextBuilder.prototype.toOverlayConfig = function (base) {
        return utils_1.extend(base || {}, {
            context: this.toJSON()
        });
    };
    OverlayContextBuilder = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [Object, Array, Function])
    ], OverlayContextBuilder);
    return OverlayContextBuilder;
}(fluent_assign_1.FluentAssign));
exports.OverlayContextBuilder = OverlayContextBuilder;
/**
 * A helper to create an `OverlayConfig` on the fly.
 * Since `OverlayConfig` requires context it means a builder is needed, this process had some boilerplate.
 * When a quick, on the fly overlay config is needed use this helper to avoid that boilerplate.
 *
 * A builder is used as an API to allow setting the context and providing some operations around the modal.
 * When a developers knows the context before hand we can skip this step, this is what this factory is for.
 *
 * @param context The context for the modal
 * @param baseContextType Optional. The type/class of the context. This is the class used to init a new instance of the context
 * @param baseConfig A base configuration that the result will extend
 * @returns {OverlayConfig}
 */
function overlayConfigFactory(context, baseContextType, baseConfig) {
    return new OverlayContextBuilder(context, undefined, baseContextType).toOverlayConfig(baseConfig);
}
exports.overlayConfigFactory = overlayConfigFactory;


/***/ },

/***/ 331:
/***/ function(module, exports) {

"use strict";
"use strict";
var vcRefCollection = {};
function getVCRef(key) {
    return vcRefCollection[key] ? vcRefCollection[key].slice() : [];
}
function setVCRef(key, vcRef) {
    if (!vcRefCollection.hasOwnProperty(key)) {
        vcRefCollection[key] = [];
    }
    vcRefCollection[key].push(vcRef);
}
function delVCRef(key, vcRef) {
    if (!vcRef) {
        vcRefCollection[key] = [];
    }
    else {
        var coll = vcRefCollection[key] || [], idx = coll.indexOf(vcRef);
        if (idx > -1) {
            coll.splice(idx, 1);
        }
    }
}
/**
 * A Simple store that holds a reference to ViewContainerRef instances by a user defined key.
 * This, with the OverlayTarget directive makes it easy to block the overlay inside an element
 * without having to use the angular query boilerplate.
 * @type {{
 *  getVCRef: (function(string): ViewContainerRef),
 *  setVCRef: (function(string, ViewContainerRef): void),
 *  delVCRef: (function(string): void)
 *  }}
 */
exports.vcRefStore = { getVCRef: getVCRef, setVCRef: setVCRef, delVCRef: delVCRef };


/***/ },

/***/ 332:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__(0);
var tokens_1 = __webpack_require__(209);
var dialog_ref_stack_1 = __webpack_require__(535);
var vc_ref_store_1 = __webpack_require__(331);
var dialog_ref_1 = __webpack_require__(68);
var _stack = new dialog_ref_stack_1.DialogRefStack();
var Overlay = (function () {
    function Overlay(_modalRenderer) {
        this._modalRenderer = _modalRenderer;
    }
    Object.defineProperty(Overlay.prototype, "stackLength", {
        get: function () {
            return _stack.length;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Check if a given DialogRef is the top most ref in the stack.
     * TODO: distinguish between body modal vs in element modal.
     * @param dialogRef
     * @returns {boolean}
     */
    Overlay.prototype.isTopMost = function (dialogRef) {
        return _stack.indexOf(dialogRef) === _stack.length - 1;
    };
    Overlay.prototype.stackPosition = function (dialogRef) {
        return _stack.indexOf(dialogRef);
    };
    Overlay.prototype.groupStackLength = function (dialogRef) {
        return _stack.groupLength(_stack.groupOf(dialogRef));
    };
    /**
     * Creates an overlay and returns a dialog ref.
     * @param config instructions how to create the overlay
     * @param group A token to associate the new overlay with, used for reference (stacks usually)
     * @returns {DialogRef<T>[]}
     */
    Overlay.prototype.open = function (config, group) {
        var _this = this;
        var viewContainer = config.viewContainer, containers = [];
        if (typeof viewContainer === 'string') {
            containers = vc_ref_store_1.vcRefStore.getVCRef(viewContainer);
        }
        else if (Array.isArray(viewContainer)) {
            containers = viewContainer;
        }
        else if (viewContainer) {
            containers = [viewContainer];
        }
        if (!containers || !containers[0]) {
            if (!this.defaultViewContainer) {
                throw new Error('Default view container not set. Add the "defaultOverlayTarget" directive ' +
                    'to the application root component template (e.g: <span defaultOverlayTarget></span>. ' +
                    'You can also set it manually using the "Overlay" service "defaultViewContainer" property.');
            }
            containers = [this.defaultViewContainer];
        }
        return containers
            .map(function (vc) { return _this.createOverlay(config.renderer || _this._modalRenderer, vc, config, group); });
    };
    Overlay.prototype.createOverlay = function (renderer, vcRef, config, group) {
        if (config.context) {
            config.context.normalize();
        }
        var dialog = new dialog_ref_1.DialogRef(this, config.context || {});
        dialog.inElement = config.context && !!config.context.inElement;
        var cmpRef = renderer.render(dialog, vcRef, config.injector);
        Object.defineProperty(dialog, 'overlayRef', { value: cmpRef });
        _stack.pushManaged(dialog, group);
        return dialog;
    };
    Overlay = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [(typeof (_a = typeof tokens_1.OverlayRenderer !== 'undefined' && tokens_1.OverlayRenderer) === 'function' && _a) || Object])
    ], Overlay);
    return Overlay;
    var _a;
}());
exports.Overlay = Overlay;


/***/ },

/***/ 333:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var angular2_modal_1 = __webpack_require__(4);
var DEFAULT_VALUES = {
    dialogClass: 'modal-dialog',
    showClose: false
};
var DEFAULT_SETTERS = [
    'dialogClass',
    'size',
    'showClose'
];
var BSModalContext = (function (_super) {
    __extends(BSModalContext, _super);
    function BSModalContext() {
        _super.apply(this, arguments);
    }
    BSModalContext.prototype.normalize = function () {
        if (!this.dialogClass) {
            this.dialogClass = DEFAULT_VALUES.dialogClass;
        }
        _super.prototype.normalize.call(this);
    };
    return BSModalContext;
}(angular2_modal_1.ModalOpenContext));
exports.BSModalContext = BSModalContext;
var BSModalContextBuilder = (function (_super) {
    __extends(BSModalContextBuilder, _super);
    function BSModalContextBuilder(defaultValues, initialSetters, baseType) {
        if (defaultValues === void 0) { defaultValues = undefined; }
        if (initialSetters === void 0) { initialSetters = undefined; }
        if (baseType === void 0) { baseType = undefined; }
        _super.call(this, angular2_modal_1.extend(DEFAULT_VALUES, defaultValues || {}), angular2_modal_1.arrayUnion(DEFAULT_SETTERS, initialSetters || []), baseType || BSModalContext // https://github.com/Microsoft/TypeScript/issues/7234
        );
    }
    return BSModalContextBuilder;
}(angular2_modal_1.ModalOpenContextBuilder));
exports.BSModalContextBuilder = BSModalContextBuilder;


/***/ },

/***/ 334:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
__webpack_require__(583);
var core_1 = __webpack_require__(0);
var angular2_modal_1 = __webpack_require__(4);
var modal_container_component_1 = __webpack_require__(212);
var one_button_preset_1 = __webpack_require__(335);
var two_button_preset_1 = __webpack_require__(336);
var Modal = (function (_super) {
    __extends(Modal, _super);
    function Modal(overlay) {
        _super.call(this, overlay);
    }
    Modal.prototype.alert = function () {
        return new one_button_preset_1.OneButtonPresetBuilder(this, { isBlocking: false });
    };
    Modal.prototype.prompt = function () {
        return new two_button_preset_1.PromptPresetBuilder(this, { isBlocking: true, keyboard: null });
    };
    Modal.prototype.confirm = function () {
        return new two_button_preset_1.TwoButtonPresetBuilder(this, { isBlocking: true, keyboard: null });
    };
    Modal.prototype.create = function (dialogRef, content, bindings) {
        var _this = this;
        var backdropRef = this.createBackdrop(dialogRef, angular2_modal_1.CSSBackdrop);
        var containerRef = this.createContainer(dialogRef, modal_container_component_1.BSModalContainer, content, bindings);
        var overlay = dialogRef.overlayRef.instance;
        var backdrop = backdropRef.instance;
        var container = containerRef.instance;
        dialogRef.inElement ? overlay.insideElement() : overlay.fullscreen();
        // add body class if this is the only dialog in the stack
        if (!document.body.classList.contains('modal-open')) {
            document.body.classList.add('modal-open');
        }
        if (dialogRef.inElement) {
            backdrop.setStyle('position', 'absolute');
        }
        backdrop.addClass('modal-backdrop fade', true);
        backdrop.addClass('in');
        container.addClass('in');
        if (containerRef.location.nativeElement) {
            containerRef.location.nativeElement.focus();
        }
        overlay.beforeDestroy(function () {
            var completer = new angular2_modal_1.PromiseCompleter();
            backdrop.removeClass('in');
            container.removeClass('in');
            backdrop.myAnimationEnd$()
                .combineLatest(container.myAnimationEnd$(), function (s1, s2) { return [s1, s2]; })
                .subscribe(function (sources) {
                _this.overlay.groupStackLength(dialogRef) === 1 && document.body.classList.remove('modal-open');
                completer.resolve();
            });
            return completer.promise;
        });
        return dialogRef;
    };
    Modal = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [(typeof (_a = typeof angular2_modal_1.Overlay !== 'undefined' && angular2_modal_1.Overlay) === 'function' && _a) || Object])
    ], Modal);
    return Modal;
    var _a;
}(angular2_modal_1.Modal));
exports.Modal = Modal;


/***/ },

/***/ 335:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var angular2_modal_1 = __webpack_require__(4);
var message_modal_preset_1 = __webpack_require__(213);
/**
 * A Preset for a classic 1 button modal window.
 */
var OneButtonPresetBuilder = (function (_super) {
    __extends(OneButtonPresetBuilder, _super);
    function OneButtonPresetBuilder(modal, defaultValues) {
        if (defaultValues === void 0) { defaultValues = undefined; }
        _super.call(this, angular2_modal_1.extend({
            modal: modal,
            okBtn: 'OK',
            okBtnClass: 'btn btn-primary'
        }, defaultValues || {}), [
            'okBtn',
            'okBtnClass'
        ]);
    }
    OneButtonPresetBuilder.prototype.$$beforeOpen = function (config) {
        this.addButton(config.okBtnClass, config.okBtn, function (cmp, $event) { return cmp.dialog.close(true); });
        return _super.prototype.$$beforeOpen.call(this, config);
    };
    return OneButtonPresetBuilder;
}(message_modal_preset_1.MessageModalPresetBuilder));
exports.OneButtonPresetBuilder = OneButtonPresetBuilder;


/***/ },

/***/ 336:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var angular2_modal_1 = __webpack_require__(4);
var message_modal_preset_1 = __webpack_require__(213);
/** Common two button preset */
var AbstractTwoButtonPresetBuilder = (function (_super) {
    __extends(AbstractTwoButtonPresetBuilder, _super);
    function AbstractTwoButtonPresetBuilder(modal, defaultValues, initialSetters) {
        if (defaultValues === void 0) { defaultValues = undefined; }
        if (initialSetters === void 0) { initialSetters = []; }
        _super.call(this, angular2_modal_1.extend({
            modal: modal,
            okBtn: 'OK',
            okBtnClass: 'btn btn-primary',
            cancelBtn: 'Cancel',
            cancelBtnClass: 'btn btn-default'
        }, defaultValues || {}), angular2_modal_1.arrayUnion([
            'okBtn',
            'okBtnClass',
            'cancelBtn',
            'cancelBtnClass',
        ], initialSetters));
    }
    AbstractTwoButtonPresetBuilder.prototype.$$beforeOpen = function (config) {
        this.addButton(config.cancelBtnClass, config.cancelBtn, function (cmp, $event) { return cmp.dialog.dismiss(); });
        return _super.prototype.$$beforeOpen.call(this, config);
    };
    return AbstractTwoButtonPresetBuilder;
}(message_modal_preset_1.MessageModalPresetBuilder));
exports.AbstractTwoButtonPresetBuilder = AbstractTwoButtonPresetBuilder;
/**
 * A Preset for a classic 2 button modal window.
 */
var TwoButtonPresetBuilder = (function (_super) {
    __extends(TwoButtonPresetBuilder, _super);
    function TwoButtonPresetBuilder(modal, defaultValues) {
        if (defaultValues === void 0) { defaultValues = undefined; }
        _super.call(this, modal, defaultValues);
    }
    TwoButtonPresetBuilder.prototype.$$beforeOpen = function (config) {
        this.addButton(config.okBtnClass, config.okBtn, function (cmp, $event) { return cmp.dialog.close(true); });
        return _super.prototype.$$beforeOpen.call(this, config);
    };
    return TwoButtonPresetBuilder;
}(AbstractTwoButtonPresetBuilder));
exports.TwoButtonPresetBuilder = TwoButtonPresetBuilder;
var PromptPresetBuilder = (function (_super) {
    __extends(PromptPresetBuilder, _super);
    function PromptPresetBuilder(modal, defaultValues) {
        if (defaultValues === void 0) { defaultValues = undefined; }
        _super.call(this, modal, angular2_modal_1.extend({ showInput: true, defaultValue: '' }, defaultValues || {}), ['placeholder', 'defaultValue']);
    }
    PromptPresetBuilder.prototype.$$beforeOpen = function (config) {
        this.addButton(config.okBtnClass, config.okBtn, function (cmp, $event) {
            return cmp.dialog.close(cmp.dialog.context.defaultValue);
        });
        return _super.prototype.$$beforeOpen.call(this, config);
    };
    return PromptPresetBuilder;
}(AbstractTwoButtonPresetBuilder));
exports.PromptPresetBuilder = PromptPresetBuilder;


/***/ },

/***/ 337:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__(0);
var angular2_modal_1 = __webpack_require__(4);
var JSNativeModalRenderer = (function () {
    function JSNativeModalRenderer() {
    }
    JSNativeModalRenderer.prototype.render = function (dialog, vcRef) {
        var result;
        switch (dialog.context.dialogType) {
            case angular2_modal_1.DROP_IN_TYPE.alert:
                window.alert(dialog.context.message);
                result = true;
                break;
            case angular2_modal_1.DROP_IN_TYPE.prompt:
                result = window.prompt(dialog.context.message, dialog.context.promptDefault);
                break;
            case angular2_modal_1.DROP_IN_TYPE.confirm:
                result = window.confirm(dialog.context.message);
                break;
        }
        dialog.destroy = function () {
        };
        if (result === false) {
            dialog.dismiss();
        }
        else {
            dialog.close(result);
        }
        // we need to return ComponentRef<ModalOverlay> but a native dialog does'nt have that
        // so we resolve an empty promise, the user of this renderer should expect that.
        return {};
    };
    JSNativeModalRenderer = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], JSNativeModalRenderer);
    return JSNativeModalRenderer;
}());
exports.JSNativeModalRenderer = JSNativeModalRenderer;


/***/ },

/***/ 338:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var angular2_modal_1 = __webpack_require__(4);
var DEFAULT_SETTERS = [
    'promptDefault'
];
var JSNativeModalContext = (function (_super) {
    __extends(JSNativeModalContext, _super);
    function JSNativeModalContext() {
        _super.apply(this, arguments);
    }
    JSNativeModalContext.prototype.normalize = function () {
        if (!this.message)
            this.message = '';
        if (this.dialogType === undefined)
            this.dialogType = angular2_modal_1.DROP_IN_TYPE.alert;
    };
    return JSNativeModalContext;
}(angular2_modal_1.ModalOpenContext));
exports.JSNativeModalContext = JSNativeModalContext;
var JSNativeModalContextBuilder = (function (_super) {
    __extends(JSNativeModalContextBuilder, _super);
    function JSNativeModalContextBuilder(defaultValues, initialSetters, baseType) {
        if (defaultValues === void 0) { defaultValues = undefined; }
        if (initialSetters === void 0) { initialSetters = undefined; }
        if (baseType === void 0) { baseType = undefined; }
        _super.call(this, defaultValues || {}, angular2_modal_1.arrayUnion(DEFAULT_SETTERS, initialSetters || []), baseType || JSNativeModalContext);
    }
    return JSNativeModalContextBuilder;
}(angular2_modal_1.ModalOpenContextBuilder));
exports.JSNativeModalContextBuilder = JSNativeModalContextBuilder;


/***/ },

/***/ 339:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var modal_1 = __webpack_require__(215);
var modal_context_1 = __webpack_require__(338);
var js_native_modal_renderer_1 = __webpack_require__(337);
var JSNativePresetBuilder = (function (_super) {
    __extends(JSNativePresetBuilder, _super);
    function JSNativePresetBuilder(modal, dialogType) {
        _super.call(this, { modal: modal, dialogType: dialogType });
    }
    /**
     * Hook to alter config and return bindings.
     * @param config
     */
    JSNativePresetBuilder.prototype.$$beforeOpen = function (config) {
        return [];
    };
    /**
     * Open a modal window based on the configuration of this config instance.
     * @param viewContainer If set opens the modal inside the supplied viewContainer
     * @returns Promise<DialogRef>
     */
    JSNativePresetBuilder.prototype.open = function (viewContainer) {
        var context = this.toJSON();
        if (!(context.modal instanceof modal_1.Modal)) {
            return Promise.reject(new Error('Configuration Error: modal service not set.'));
        }
        var overlayConfig = {
            context: context,
            renderer: new js_native_modal_renderer_1.JSNativeModalRenderer(),
            viewContainer: viewContainer,
            bindings: typeof this.$$beforeOpen === 'function' && this.$$beforeOpen(context)
        };
        return context.modal.open(context.component, overlayConfig);
    };
    return JSNativePresetBuilder;
}(modal_context_1.JSNativeModalContextBuilder));
exports.JSNativePresetBuilder = JSNativePresetBuilder;


/***/ },

/***/ 340:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var modal_1 = __webpack_require__(342);
exports.Modal = modal_1.Modal;
var modal_context_1 = __webpack_require__(341);
exports.VEXBuiltInThemes = modal_context_1.VEXBuiltInThemes;
exports.VEXModalContext = modal_context_1.VEXModalContext;
exports.VEXModalContextBuilder = modal_context_1.VEXModalContextBuilder;
var dropin_preset_1 = __webpack_require__(344);
exports.DropInPreset = dropin_preset_1.DropInPreset;
exports.DropInPresetBuilder = dropin_preset_1.DropInPresetBuilder;
var dialog_form_modal_1 = __webpack_require__(136);
exports.DialogFormModal = dialog_form_modal_1.DialogFormModal;
exports.FormDropIn = dialog_form_modal_1.FormDropIn;
exports.VEXButtonClickEvent = dialog_form_modal_1.VEXButtonClickEvent;
exports.VEXButtonConfig = dialog_form_modal_1.VEXButtonConfig;
exports.VEXButtonHandler = dialog_form_modal_1.VEXButtonHandler;
exports.VEXDialogButtons = dialog_form_modal_1.VEXDialogButtons;
var dialog_preset_1 = __webpack_require__(343);
exports.DialogPreset = dialog_preset_1.DialogPreset;
exports.DialogPresetBuilder = dialog_preset_1.DialogPresetBuilder;
var vex_module_1 = __webpack_require__(541);
exports.VexModalModule = vex_module_1.VexModalModule;
exports.providers = vex_module_1.providers;


/***/ },

/***/ 341:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var angular2_modal_1 = __webpack_require__(4);
var DEFAULT_VALUES = {
    className: 'default',
    overlayClassName: 'vex-overlay',
    contentClassName: 'vex-content',
    closeClassName: 'vex-close'
};
var DEFAULT_SETTERS = [
    'className',
    'overlayClassName',
    'contentClassName',
    'closeClassName',
    'showCloseButton'
];
var VEXModalContext = (function (_super) {
    __extends(VEXModalContext, _super);
    function VEXModalContext() {
        _super.apply(this, arguments);
    }
    VEXModalContext.prototype.normalize = function () {
        if (!this.className) {
            this.className = DEFAULT_VALUES.className;
        }
        if (!this.overlayClassName) {
            this.overlayClassName = DEFAULT_VALUES.overlayClassName;
        }
        if (!this.contentClassName) {
            this.contentClassName = DEFAULT_VALUES.contentClassName;
        }
        if (!this.closeClassName) {
            this.closeClassName = DEFAULT_VALUES.closeClassName;
        }
        _super.prototype.normalize.call(this);
    };
    return VEXModalContext;
}(angular2_modal_1.ModalOpenContext));
exports.VEXModalContext = VEXModalContext;
var VEXModalContextBuilder = (function (_super) {
    __extends(VEXModalContextBuilder, _super);
    function VEXModalContextBuilder(defaultValues, initialSetters, baseType) {
        if (defaultValues === void 0) { defaultValues = undefined; }
        if (initialSetters === void 0) { initialSetters = undefined; }
        if (baseType === void 0) { baseType = undefined; }
        _super.call(this, angular2_modal_1.extend(DEFAULT_VALUES, defaultValues || {}), angular2_modal_1.arrayUnion(DEFAULT_SETTERS, initialSetters || []), baseType || VEXModalContext // https://github.com/Microsoft/TypeScript/issues/7234
        );
    }
    /**
     *
     * @aliasFor isBlocking
     */
    VEXModalContextBuilder.prototype.overlayClosesOnClick = function (value) {
        this[angular2_modal_1.privateKey('isBlocking')] = !value;
        return this;
    };
    return VEXModalContextBuilder;
}(angular2_modal_1.ModalOpenContextBuilder));
exports.VEXModalContextBuilder = VEXModalContextBuilder;


/***/ },

/***/ 342:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
__webpack_require__(585);
var core_1 = __webpack_require__(0);
var angular2_modal_1 = __webpack_require__(4);
var dropin_preset_1 = __webpack_require__(344);
var Modal = (function (_super) {
    __extends(Modal, _super);
    function Modal(overlay) {
        _super.call(this, overlay);
    }
    Modal.prototype.alert = function () {
        return new dropin_preset_1.DropInPresetBuilder(this, angular2_modal_1.DROP_IN_TYPE.alert, { isBlocking: false });
    };
    Modal.prototype.prompt = function () {
        return new dropin_preset_1.DropInPresetBuilder(this, angular2_modal_1.DROP_IN_TYPE.prompt, {
            isBlocking: true,
            keyboard: null
        });
    };
    Modal.prototype.confirm = function () {
        return new dropin_preset_1.DropInPresetBuilder(this, angular2_modal_1.DROP_IN_TYPE.confirm, {
            isBlocking: true,
            keyboard: null
        });
    };
    Modal.prototype.create = function (dialogRef, content, bindings) {
        var _this = this;
        var backdropRef = this.createBackdrop(dialogRef, angular2_modal_1.CSSBackdrop);
        var containerRef = this.createContainer(dialogRef, angular2_modal_1.CSSDialogContainer, content, bindings);
        var overlay = dialogRef.overlayRef.instance;
        var backdrop = backdropRef.instance;
        var container = containerRef.instance;
        dialogRef.inElement ? overlay.insideElement() : overlay.fullscreen();
        // add body class if this is the only dialog in the stack
        if (!document.body.classList.contains('vex-open')) {
            document.body.classList.add('vex-open');
        }
        overlay.addClass("vex vex-theme-" + dialogRef.context.className);
        backdrop.addClass('vex-overlay');
        container.addClass(dialogRef.context.contentClassName);
        container.setStyle('display', 'block');
        if (dialogRef.inElement) {
            overlay.setStyle('padding', '0');
            container.setStyle('margin-top', '20px');
        }
        if (containerRef.location.nativeElement) {
            containerRef.location.nativeElement.focus();
        }
        if (dialogRef.context.className === 'bottom-right-corner') {
            overlay.setStyle('overflow-y', 'hidden');
            container.setStyle('position', 'absolute');
        }
        overlay.beforeDestroy(function () {
            overlay.addClass('vex-closing');
            var completer = new angular2_modal_1.PromiseCompleter();
            var animationEnd$ = container.myAnimationEnd$();
            if (dialogRef.context.className !== 'bottom-right-corner') {
                animationEnd$ = animationEnd$.combineLatest(backdrop.myAnimationEnd$(), function (s1, s2) { return [s1, s2]; });
            }
            animationEnd$.subscribe(function (sources) {
                _this.overlay.groupStackLength(dialogRef) === 1 && document.body.classList.remove('vex-open');
                completer.resolve();
            });
            return completer.promise;
        });
        overlay.setClickBoundary(containerRef.location.nativeElement);
        return dialogRef;
    };
    Modal = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [(typeof (_a = typeof angular2_modal_1.Overlay !== 'undefined' && angular2_modal_1.Overlay) === 'function' && _a) || Object])
    ], Modal);
    return Modal;
    var _a;
}(angular2_modal_1.Modal));
exports.Modal = Modal;


/***/ },

/***/ 343:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var angular2_modal_1 = __webpack_require__(4);
var modal_context_1 = __webpack_require__(341);
var dialog_form_modal_1 = __webpack_require__(136);
var DEFAULT_SETTERS = [
    'content'
];
/**
 * Data definition
 */
var DialogPreset = (function (_super) {
    __extends(DialogPreset, _super);
    function DialogPreset() {
        _super.apply(this, arguments);
    }
    return DialogPreset;
}(modal_context_1.VEXModalContext));
exports.DialogPreset = DialogPreset;
/**
 * A Preset representing the configuration needed to open MessageModal.
 * This is an abstract implementation with no concrete behaviour.
 * Use derived implementation.
 */
var DialogPresetBuilder = (function (_super) {
    __extends(DialogPresetBuilder, _super);
    function DialogPresetBuilder(modal, defaultValues, initialSetters, baseType) {
        if (defaultValues === void 0) { defaultValues = undefined; }
        if (initialSetters === void 0) { initialSetters = undefined; }
        if (baseType === void 0) { baseType = undefined; }
        _super.call(this, angular2_modal_1.extend({ modal: modal, component: dialog_form_modal_1.DialogFormModal, buttons: [], defaultResult: true }, defaultValues || {}), angular2_modal_1.arrayUnion(DEFAULT_SETTERS, initialSetters || []), baseType || DialogPreset // https://github.com/Microsoft/TypeScript/issues/7234
        );
    }
    DialogPresetBuilder.prototype.addButton = function (css, caption, onClick) {
        var btn = {
            cssClass: css,
            caption: caption,
            onClick: onClick
        };
        var key = angular2_modal_1.privateKey('buttons');
        this[key].push(btn);
        return this;
    };
    DialogPresetBuilder.prototype.addOkButton = function (text) {
        if (text === void 0) { text = 'OK'; }
        this.addButton('vex-dialog-button-primary vex-dialog-button vex-first', text, function (cmp, $event) { return cmp.dialog.close(cmp.dialog.context.defaultResult); });
        return this;
    };
    DialogPresetBuilder.prototype.addCancelButton = function (text) {
        if (text === void 0) { text = 'CANCEL'; }
        this.addButton('vex-dialog-button-secondary vex-dialog-button vex-last', text, function (cmp, $event) { return cmp.dialog.dismiss(); });
        return this;
    };
    return DialogPresetBuilder;
}(modal_context_1.VEXModalContextBuilder));
exports.DialogPresetBuilder = DialogPresetBuilder;


/***/ },

/***/ 344:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var angular2_modal_1 = __webpack_require__(4);
var dialog_form_modal_1 = __webpack_require__(136);
var dialog_preset_1 = __webpack_require__(343);
var DEFAULT_VALUES = {
    component: dialog_form_modal_1.DialogFormModal,
    content: dialog_form_modal_1.FormDropIn,
    okBtn: 'OK',
    cancelBtn: 'Cancel'
};
var DEFAULT_SETTERS = [
    'okBtn',
    'cancelBtn',
    'placeholder'
];
/**
 * Data definition
 */
var DropInPreset = (function (_super) {
    __extends(DropInPreset, _super);
    function DropInPreset() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(DropInPreset.prototype, "showInput", {
        get: function () {
            return this.dropInType === angular2_modal_1.DROP_IN_TYPE.prompt;
        },
        enumerable: true,
        configurable: true
    });
    return DropInPreset;
}(dialog_preset_1.DialogPreset));
exports.DropInPreset = DropInPreset;
/**
 * A Preset representing all 3 drop ins (alert, prompt, confirm)
 */
var DropInPresetBuilder = (function (_super) {
    __extends(DropInPresetBuilder, _super);
    function DropInPresetBuilder(modal, dropInType, defaultValues) {
        if (defaultValues === void 0) { defaultValues = undefined; }
        _super.call(this, modal, angular2_modal_1.extend(angular2_modal_1.extend({ modal: modal, dropInType: dropInType }, DEFAULT_VALUES), defaultValues || {}), DEFAULT_SETTERS, DropInPreset);
    }
    DropInPresetBuilder.prototype.$$beforeOpen = function (config) {
        if (config.okBtn) {
            this.addOkButton(config.okBtn);
        }
        switch (config.dropInType) {
            case angular2_modal_1.DROP_IN_TYPE.prompt:
                config.defaultResult = undefined;
            case angular2_modal_1.DROP_IN_TYPE.confirm:
                if (config.cancelBtn) {
                    this.addCancelButton(config.cancelBtn);
                }
                break;
        }
        return _super.prototype.$$beforeOpen.call(this, config);
    };
    return DropInPresetBuilder;
}(dialog_preset_1.DialogPresetBuilder));
exports.DropInPresetBuilder = DropInPresetBuilder;


/***/ },

/***/ 345:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__(0);
var angular2_modal_1 = __webpack_require__(4);
var bootstrap_1 = __webpack_require__(84);
var custom_modal_sample_1 = __webpack_require__(346);
var presets = __webpack_require__(553);
var runtime_compiled_1 = __webpack_require__(547);
var runtimeModuleRefPromise;
var BootstrapDemoPage = (function () {
    function BootstrapDemoPage(modal, compiler, injector) {
        var _this = this;
        this.modal = modal;
        this.compiler = compiler;
        this.injector = injector;
        this.modalCommands = [
            {
                text: 'alert drop in',
                factory: function () { return presets.alert(_this.modal).open(); }
            },
            {
                text: 'prompt drop in',
                factory: function () { return presets.prompt(_this.modal).open(); }
            },
            {
                text: 'confirm drop in',
                factory: function () { return presets.confirm(_this.modal).open(); }
            },
            {
                text: 'Cascading example',
                factory: function () { return presets.cascading(_this.modal).open(); }
            },
            {
                text: 'In Element example',
                factory: function () { return presets.inElement(_this.modal).open('demo-head'); }
            },
            {
                text: 'String content',
                factory: function () { return _this.modal
                    .open('Hello modal!', angular2_modal_1.overlayConfigFactory({ isBlocking: false }, bootstrap_1.BSModalContext)); }
            },
            {
                text: 'TemplateRef content',
                factory: function () { return _this.modal
                    .open(_this.templateRef, angular2_modal_1.overlayConfigFactory({ isBlocking: false }, bootstrap_1.BSModalContext)); }
            },
            {
                text: 'Custom Modal content',
                factory: function () {
                    return _this.modal.open(custom_modal_sample_1.CustomModal, angular2_modal_1.overlayConfigFactory({ num1: 2, num2: 3 }, bootstrap_1.BSModalContext));
                    // we set the baseContextType to BSModalContext so the defaults for bootstrap will apply
                }
            },
            {
                text: 'JIT Compiled component',
                factory: function () {
                    if (!runtimeModuleRefPromise) {
                        runtimeModuleRefPromise = _this.compiler.compileModuleAsync(runtime_compiled_1.RuntimeCompiledModule)
                            .then(function (moduleFactory) { return moduleFactory.create(_this.injector); });
                    }
                    return runtimeModuleRefPromise.then(function (module) {
                        return _this.modal
                            .open(runtime_compiled_1.RuntimeCompiledComponent, angular2_modal_1.overlayConfigFactory({ isBlocking: false }, bootstrap_1.BSModalContext, {
                            injector: module.injector
                        }));
                    });
                }
            }
        ];
    }
    __decorate([
        core_1.ViewChild('templateRef'), 
        __metadata('design:type', (typeof (_a = typeof core_1.TemplateRef !== 'undefined' && core_1.TemplateRef) === 'function' && _a) || Object)
    ], BootstrapDemoPage.prototype, "templateRef", void 0);
    BootstrapDemoPage = __decorate([
        core_1.Component({
            selector: 'bootstrap-demo-page',
            styles: [__webpack_require__(745)],
            template: __webpack_require__(573)
        }), 
        __metadata('design:paramtypes', [(typeof (_b = typeof bootstrap_1.Modal !== 'undefined' && bootstrap_1.Modal) === 'function' && _b) || Object, (typeof (_c = typeof core_1.Compiler !== 'undefined' && core_1.Compiler) === 'function' && _c) || Object, (typeof (_d = typeof core_1.Injector !== 'undefined' && core_1.Injector) === 'function' && _d) || Object])
    ], BootstrapDemoPage);
    return BootstrapDemoPage;
    var _a, _b, _c, _d;
}());
exports.BootstrapDemoPage = BootstrapDemoPage;


/***/ },

/***/ 346:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__(0);
var angular2_modal_1 = __webpack_require__(4);
var index_1 = __webpack_require__(84);
var CustomModalContext = (function (_super) {
    __extends(CustomModalContext, _super);
    function CustomModalContext() {
        _super.apply(this, arguments);
    }
    return CustomModalContext;
}(index_1.BSModalContext));
exports.CustomModalContext = CustomModalContext;
/**
 * A Sample of how simple it is to create a new window, with its own injects.
 */
var CustomModal = (function () {
    function CustomModal(dialog) {
        this.dialog = dialog;
        this.context = dialog.context;
        this.wrongAnswer = true;
        dialog.setCloseGuard(this);
    }
    CustomModal.prototype.onKeyUp = function (value) {
        this.wrongAnswer = value != 5;
        this.dialog.close();
    };
    CustomModal.prototype.beforeDismiss = function () {
        return true;
    };
    CustomModal.prototype.beforeClose = function () {
        return this.wrongAnswer;
    };
    CustomModal = __decorate([
        core_1.Component({
            selector: 'modal-content',
            styles: ["\n        .custom-modal-container {\n            padding: 15px;\n        }\n\n        .custom-modal-header {\n            background-color: #219161;\n            color: #fff;\n            -webkit-box-shadow: 0px 3px 5px 0px rgba(0,0,0,0.75);\n            -moz-box-shadow: 0px 3px 5px 0px rgba(0,0,0,0.75);\n            box-shadow: 0px 3px 5px 0px rgba(0,0,0,0.75);\n            margin-top: -15px;\n            margin-bottom: 40px;\n        }\n    "],
            //TODO: [ngClass] here on purpose, no real use, just to show how to workaround ng2 issue #4330.
            // Remove when solved.
            /* tslint:disable */ template: "\n        <div class=\"container-fluid custom-modal-container\">\n            <div class=\"row custom-modal-header\">\n                <div class=\"col-sm-12\">\n                    <h1>A Custom modal design</h1>\n                </div>\n            </div>\n            <div class=\"row\" [ngClass]=\"{'myclass' : shouldUseMyClass}\">\n                <div class=\"col-xs-12\">\n                    <div class=\"jumbotron\">\n                        <h1>Do the math to quit:</h1>\n                        <p class=\"lead\">I received an injection of the number <strong>{{context.num1}}</strong> and the number <strong>{{context.num2}}</strong></p>\n                        <span>What is the sum?</span>\n                         <input class=\"form-control\" type=\"text\" #answer (keyup)=\"onKeyUp(answer.value)\" autofocus>\n                    </div>\n                </div>\n            </div>\n        </div>"
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof angular2_modal_1.DialogRef !== 'undefined' && angular2_modal_1.DialogRef) === 'function' && _a) || Object])
    ], CustomModal);
    return CustomModal;
    var _a;
}());
exports.CustomModal = CustomModal;


/***/ },

/***/ 347:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__(0);
var angular2_modal_1 = __webpack_require__(4);
var InnerRuntimeCompiledComponent = (function () {
    function InnerRuntimeCompiledComponent(dialogRef) {
        this.dialogRef = dialogRef;
    }
    InnerRuntimeCompiledComponent.prototype.close = function (value) {
        this.dialogRef.close(value);
    };
    InnerRuntimeCompiledComponent = __decorate([
        core_1.Component({
            selector: 'runtime-compiled-component',
            template: "<div class=\"modal-header\">\n    <h3>I'm another JIT compiled component!</h3>\n</div>\n<div class=\"modal-body\">\n  <h4>Choose a result:</h4>\n  <button class=\"btn btn-primary\" (click)=\"close('A')\">A</button>\n  <button class=\"btn btn-primary\" (click)=\"close('B')\">B</button>\n  <button class=\"btn btn-primary\" (click)=\"close('C')\">C</button>\n</div>"
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof angular2_modal_1.DialogRef !== 'undefined' && angular2_modal_1.DialogRef) === 'function' && _a) || Object])
    ], InnerRuntimeCompiledComponent);
    return InnerRuntimeCompiledComponent;
    var _a;
}());
exports.InnerRuntimeCompiledComponent = InnerRuntimeCompiledComponent;


/***/ },

/***/ 348:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__(0);
var angular2_modal_1 = __webpack_require__(4);
var bootstrap_1 = __webpack_require__(84);
var inner_runtime_compiled_1 = __webpack_require__(548);
var runtimeModuleRefPromise;
var RuntimeCompiledComponent = (function () {
    function RuntimeCompiledComponent(dialogRef, compiler, modal) {
        this.dialogRef = dialogRef;
        this.compiler = compiler;
        this.modal = modal;
        this.toKill = [];
    }
    RuntimeCompiledComponent.prototype.openInElement = function () {
        var _this = this;
        if (!runtimeModuleRefPromise) {
            runtimeModuleRefPromise = this.compiler.compileModuleAsync(inner_runtime_compiled_1.InnerRuntimeCompiledModule)
                .then(function (moduleFactory) { return moduleFactory.create(_this.modal.overlay.defaultViewContainer.parentInjector); });
        }
        runtimeModuleRefPromise
            .then(function (module) { return angular2_modal_1.overlayConfigFactory({ inElement: true }, bootstrap_1.BSModalContext, { injector: module.injector, viewContainer: 'demo-head' }); })
            .then(function (overlayConfig) { return _this.modal.open(inner_runtime_compiled_1.InnerRuntimeCompiledComponent, overlayConfig); })
            .then(function (dialogRef) { return _this.toKill.push(dialogRef); });
    };
    RuntimeCompiledComponent.prototype.ngOnDestroy = function () {
        var dlgRef;
        while (dlgRef = this.toKill.pop()) {
            dlgRef.close('');
        }
    };
    RuntimeCompiledComponent.prototype.openModal = function () {
        var _this = this;
        if (!runtimeModuleRefPromise) {
            runtimeModuleRefPromise = this.compiler.compileModuleAsync(inner_runtime_compiled_1.InnerRuntimeCompiledModule)
                .then(function (moduleFactory) { return moduleFactory.create(_this.modal.overlay.defaultViewContainer.parentInjector); });
        }
        runtimeModuleRefPromise
            .then(function (module) { return angular2_modal_1.overlayConfigFactory({ isBlocking: true }, bootstrap_1.BSModalContext, { injector: module.injector }); })
            .then(function (overlayConfig) { return _this.modal.open(inner_runtime_compiled_1.InnerRuntimeCompiledComponent, overlayConfig); })
            .then(function (dialogRef) { return dialogRef.result; })
            .then(function (value) { return _this.dialogRef.close(value); })
            .catch(function (err) { return _this.dialogRef.dismiss(); });
    };
    RuntimeCompiledComponent = __decorate([
        core_1.Component({
            selector: 'runtime-compiled-component',
            template: "\n<div class=\"modal-header\">\n    <h3>I'm a JIT compiled component!</h3>\n</div>\n<div class=\"modal-body\">\n  <p>This is a demonstration of JIT component displayed as a modal content, it also shows how to link the result of a chain of modals.</p>\n  <p>To JIT compile another (different) module inside this (JIT) compiled module press the button below.\n  The value selected on the popup opened will bubble down.</p>\n  <button class=\"btn btn-primary\" (click)=\"openModal()\">Compile and open again!</button>\n  \n  <hr>\n  \n  <p>To demonstrate opening a JIT compiled component inside a view container ref that was created before the component was compiled press the button below.</p>\n  <button class=\"btn btn-warning\" (click)=\"openInElement()\">Open in element!</button>\n</div>"
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof angular2_modal_1.DialogRef !== 'undefined' && angular2_modal_1.DialogRef) === 'function' && _a) || Object, (typeof (_b = typeof core_1.Compiler !== 'undefined' && core_1.Compiler) === 'function' && _b) || Object, (typeof (_c = typeof bootstrap_1.Modal !== 'undefined' && bootstrap_1.Modal) === 'function' && _c) || Object])
    ], RuntimeCompiledComponent);
    return RuntimeCompiledComponent;
    var _a, _b, _c;
}());
exports.RuntimeCompiledComponent = RuntimeCompiledComponent;


/***/ },

/***/ 349:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__(0);
var bootstrap_1 = __webpack_require__(84);
var BootstrapDemo = (function () {
    function BootstrapDemo() {
    }
    BootstrapDemo = __decorate([
        core_1.Component({
            selector: 'bootstrap-demo',
            template: "<router-outlet></router-outlet>",
            // We override providers set by the Module since this app is using multiple module plugins
            // (js-native, vex, bootstrap) which messes up the provider tree (last plugin wins)
            // usually an app will use one plugin and this line is not needed.
            providers: bootstrap_1.providers,
            encapsulation: core_1.ViewEncapsulation.None
        }), 
        __metadata('design:paramtypes', [])
    ], BootstrapDemo);
    return BootstrapDemo;
}());
exports.BootstrapDemo = BootstrapDemo;


/***/ },

/***/ 350:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__(0);
var angular2_modal_1 = __webpack_require__(4);
var ModalCustomisationWizard = (function () {
    function ModalCustomisationWizard(modal) {
        this.modal = modal;
        this.type = 'alert';
        this.preset = {
            size: 'lg',
            isBlocking: true,
            showClose: true,
            keyboard: 27,
            dialogClass: '',
            headerClass: '',
            title: 'Hello World',
            titleHtml: '',
            body: 'A Customized Modal',
            bodyClass: '',
            footerClass: '',
            okBtn: '',
            okBtnClass: '',
        };
    }
    ModalCustomisationWizard.prototype.createModal = function () {
        var p = this.preset;
        var fluent = this.modal[this.type]();
        for (var key in p) {
            var value = p[key];
            if (value === null || value === '')
                continue;
            fluent[key](value);
        }
        fluent.open();
    };
    ModalCustomisationWizard.prototype.logForm = function (value) {
        // do something
    };
    Object.defineProperty(ModalCustomisationWizard.prototype, "code", {
        get: function () {
            var p = this.preset, code = "modal." + this.type + "()\n";
            for (var key in p) {
                var value = p[key];
                if (value === null || value === '')
                    continue;
                code += "    ." + key + "(" + (typeof value === 'string' ? "'" + value + "'" : value) + ")\n";
            }
            code += '    .open();';
            return code;
        },
        enumerable: true,
        configurable: true
    });
    ModalCustomisationWizard = __decorate([
        core_1.Component({
            selector: 'customize-wizard',
            template: __webpack_require__(574)
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof angular2_modal_1.Modal !== 'undefined' && angular2_modal_1.Modal) === 'function' && _a) || Object])
    ], ModalCustomisationWizard);
    return ModalCustomisationWizard;
    var _a;
}());
exports.ModalCustomisationWizard = ModalCustomisationWizard;


/***/ },

/***/ 351:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
__export(__webpack_require__(554));


/***/ },

/***/ 352:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__(0);
var index_1 = __webpack_require__(353);
var Home = (function () {
    function Home(modal) {
        this.modal = modal;
    }
    Home.prototype.ngAfterViewInit = function () {
        this.modal.alert()
            .title('Angular 2 Modal')
            .templateRef(this.myTemplate)
            .inElement(true)
            .open('home-overlay-container')
            .then(function (d) { return d.result; })
            .catch(function (e) {
            console.log('This message should appear if you navigate away from the home page.');
            console.log('If a modal is opened in a view container within a component that is the page or' +
                'part of the page, navigation will destroy the page thus destroy the modal. To prevent ' +
                'memory leaks and unexpected behavior a "DialogBailOutError" error is thrown.');
            console.log(e);
        });
    };
    __decorate([
        core_1.ViewChild('myTemplate', { read: core_1.TemplateRef }), 
        __metadata('design:type', (typeof (_a = typeof core_1.TemplateRef !== 'undefined' && core_1.TemplateRef) === 'function' && _a) || Object)
    ], Home.prototype, "myTemplate", void 0);
    Home = __decorate([
        core_1.Component({
            selector: 'home',
            providers: index_1.InAppModalModule.getProviders(),
            template: __webpack_require__(576),
            encapsulation: core_1.ViewEncapsulation.None
        }), 
        __metadata('design:paramtypes', [(typeof (_b = typeof index_1.Modal !== 'undefined' && index_1.Modal) === 'function' && _b) || Object])
    ], Home);
    return Home;
    var _a, _b;
}());
exports.Home = Home;


/***/ },

/***/ 353:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__(0);
var common_1 = __webpack_require__(20);
var angular2_modal_1 = __webpack_require__(4);
var modal_1 = __webpack_require__(356);
var modal_backdrop_1 = __webpack_require__(354);
var modal_2 = __webpack_require__(356);
exports.Modal = modal_2.Modal;
var modal_context_1 = __webpack_require__(355);
exports.InAppModalContext = modal_context_1.InAppModalContext;
exports.InAppModalContextBuilder = modal_context_1.InAppModalContextBuilder;
function getProviders() {
    return [
        { provide: angular2_modal_1.Modal, useClass: modal_1.Modal },
        modal_1.Modal
    ];
}
exports.getProviders = getProviders;
var InAppModalModule = (function () {
    function InAppModalModule() {
    }
    InAppModalModule.getProviders = function () {
        return getProviders();
    };
    InAppModalModule = __decorate([
        core_1.NgModule({
            imports: [common_1.CommonModule],
            declarations: [
                modal_backdrop_1.InAppModalBackdrop
            ],
            providers: getProviders(),
            entryComponents: [
                modal_backdrop_1.InAppModalBackdrop
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], InAppModalModule);
    return InAppModalModule;
}());
exports.InAppModalModule = InAppModalModule;


/***/ },

/***/ 354:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__(0);
var angular2_modal_1 = __webpack_require__(4);
var InAppModalBackdrop = (function () {
    function InAppModalBackdrop(dialog) {
        this.dialog = dialog;
        this.zoomState = 'in';
    }
    InAppModalBackdrop = __decorate([
        core_1.Component({
            selector: 'modal-backdrop',
            animations: [
                core_1.trigger('zoomin', [
                    core_1.transition('void => in', [
                        core_1.animate('500ms ease-in', core_1.keyframes([
                            core_1.style({ transform: 'scale(0.1, 0.1)', offset: 0 }),
                            core_1.style({ transform: 'scale(1.2, 1.2)', offset: 0.5 }),
                            core_1.style({ transform: 'scale(1, 1)', offset: 1 })
                        ]))
                    ])
                ])
            ],
            styles: ["\n:host {        \n  width: 100%;\n  height: 100%;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  right: 0;\n\n}\n.in-app-modal-backdrop {\n  margin: 25px 0;\n}\n", "\narticle {\n  margin: auto;\n  width: 600px;\n  background: inherit;\n  border: 1px solid rgba(0, 0, 0, 0.1);\n  border-radius: 6px;\n  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.25);\n  overflow: hidden;\n}\narticle:before {\n  content: '';\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background: inherit;\n  -webkit-filter: blur(10px) saturate(2);\n  filter: blur(10px) saturate(2);\n}\narticle .title {\n  padding: 8px;    \n  background: rgba(235, 235, 235, 0.85);\n  border-bottom: 1px solid rgba(0, 0, 0, 0.1);\n  font-size:24px;\n  text-align: center;\n}\narticle .content {\n  padding: 8px;\n  background: rgba(255, 255, 255, 0.66);\n}"
            ],
            template: "<div class=\"in-app-modal-backdrop\">\n    <article [@zoomin]=\"zoomState\">\n        <div class=\"title\">\n            <span>{{dialog.context.title}}</span>\n        </div>\n        <div class=\"content\">\n            <template [ngTemplateOutlet]=\"dialog.context.templateRef\"></template>\n        </div>\n    </article>    \n</div>"
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof angular2_modal_1.DialogRef !== 'undefined' && angular2_modal_1.DialogRef) === 'function' && _a) || Object])
    ], InAppModalBackdrop);
    return InAppModalBackdrop;
    var _a;
}());
exports.InAppModalBackdrop = InAppModalBackdrop;


/***/ },

/***/ 355:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var angular2_modal_1 = __webpack_require__(4);
var InAppModalContext = (function (_super) {
    __extends(InAppModalContext, _super);
    function InAppModalContext() {
        _super.apply(this, arguments);
    }
    InAppModalContext.prototype.normalize = function () {
        if (!this.message)
            this.message = '';
    };
    return InAppModalContext;
}(angular2_modal_1.ModalOpenContext));
exports.InAppModalContext = InAppModalContext;
var InAppModalContextBuilder = (function (_super) {
    __extends(InAppModalContextBuilder, _super);
    function InAppModalContextBuilder(modal) {
        _super.call(this, { modal: modal }, ['title', 'templateRef'], InAppModalContext);
    }
    return InAppModalContextBuilder;
}(angular2_modal_1.ModalOpenContextBuilder));
exports.InAppModalContextBuilder = InAppModalContextBuilder;


/***/ },

/***/ 356:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__(0);
var angular2_modal_1 = __webpack_require__(4);
var modal_backdrop_1 = __webpack_require__(354);
var modal_context_1 = __webpack_require__(355);
var Modal = (function (_super) {
    __extends(Modal, _super);
    function Modal(overlay) {
        _super.call(this, overlay);
    }
    Modal.prototype.alert = function () {
        return new modal_context_1.InAppModalContextBuilder(this);
    };
    Modal.prototype.create = function (dialogRef, content, bindings) {
        if (dialogRef.inElement) {
            dialogRef.overlayRef.instance.insideElement();
        }
        else {
            dialogRef.overlayRef.instance.fullscreen();
        }
        dialogRef.overlayRef.instance.addComponent(modal_backdrop_1.InAppModalBackdrop, bindings);
        dialogRef.overlayRef.instance.setStyle('position', 'relative');
        dialogRef.overlayRef.instance.setStyle('display', 'block');
        return dialogRef;
    };
    Modal = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [(typeof (_a = typeof angular2_modal_1.Overlay !== 'undefined' && angular2_modal_1.Overlay) === 'function' && _a) || Object])
    ], Modal);
    return Modal;
    var _a;
}(angular2_modal_1.Modal));
exports.Modal = Modal;


/***/ },

/***/ 357:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__(0);
var js_native_1 = __webpack_require__(214);
var presets = __webpack_require__(557);
var JSNativeDemo = (function () {
    function JSNativeDemo(modal) {
        var _this = this;
        this.modal = modal;
        this.modalCommands = ['alert', 'prompt', 'confirm'].map(function (dropin) {
            return {
                text: dropin + " drop in",
                factory: function () { return presets[dropin](_this.modal).open(); }
            };
        });
    }
    JSNativeDemo = __decorate([
        core_1.Component({
            selector: 'js-native-demo',
            template: __webpack_require__(577),
            // We override providers set by the Module since this app is using multiple module plugins
            // (js-native, vex, bootstrap) which messes up the provider tree (last plugin wins)
            // usually an app will use one plugin and this line is not needed.
            providers: js_native_1.providers,
            encapsulation: core_1.ViewEncapsulation.None
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof js_native_1.Modal !== 'undefined' && js_native_1.Modal) === 'function' && _a) || Object])
    ], JSNativeDemo);
    return JSNativeDemo;
    var _a;
}());
exports.JSNativeDemo = JSNativeDemo;


/***/ },

/***/ 358:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__(0);
var angular2_modal_1 = __webpack_require__(4);
var LoginDialog = (function () {
    function LoginDialog(dialog) {
        this.dialog = dialog;
        this.context = dialog.context;
    }
    LoginDialog = __decorate([
        core_1.Component({
            selector: 'login-dialog',
            encapsulation: core_1.ViewEncapsulation.None,
            template: "<div class=\"vex-dialog-message\">{{context.message}}</div>\n    <div *ngIf=\"context.showInput\" class=\"vex-dialog-input\">\n        <input name=\"vex\" \n               type=\"text\" \n               class=\"vex-dialog-prompt-input\"\n               [(ngModel)]=\"context.defaultResult\" \n               placeholder=\"{{context.placeholder}}\">\n    </div>"
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof angular2_modal_1.DialogRef !== 'undefined' && angular2_modal_1.DialogRef) === 'function' && _a) || Object])
    ], LoginDialog);
    return LoginDialog;
    var _a;
}());
exports.LoginDialog = LoginDialog;


/***/ },

/***/ 359:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__(0);
var angular2_modal_1 = __webpack_require__(4);
var vex_1 = __webpack_require__(340);
var index_1 = __webpack_require__(351);
var presets = __webpack_require__(558);
var login_dialog_1 = __webpack_require__(358);
var VexDemo = (function () {
    function VexDemo(modal) {
        var _this = this;
        this.modal = modal;
        this.theme = 'default';
        this.modalCommands = [
            {
                text: 'alert drop in',
                factory: function () { return presets.alert.call(_this, _this.modal).open(); }
            },
            {
                text: 'prompt drop in',
                factory: function () { return presets.prompt.call(_this, _this.modal).open(); }
            },
            {
                text: 'confirm drop in',
                factory: function () { return presets.confirm.call(_this, _this.modal).open(); }
            },
            {
                text: 'Cascading example',
                factory: function () { return presets.cascading.call(_this, _this.modal).open(); }
            },
            {
                text: 'In Element example',
                factory: function () { return presets.alert.call(_this, _this.modal).inElement(true).open('demo-head'); }
            },
            {
                text: 'String content',
                factory: function () { return _this.modal
                    .open('Hello modal!', angular2_modal_1.overlayConfigFactory({ isBlocking: false }, vex_1.VEXModalContext)); }
            },
            {
                text: 'TemplateRef content',
                factory: function () { return _this.modal
                    .open(_this.templateRef, angular2_modal_1.overlayConfigFactory({ isBlocking: false }, vex_1.VEXModalContext)); }
            },
            {
                text: 'Custom Modal example',
                factory: function () {
                    return new vex_1.DialogPresetBuilder(_this.modal)
                        .className(_this.theme)
                        .content(login_dialog_1.LoginDialog)
                        .message('Ary you coming to the event?')
                        .addOkButton('Yep!')
                        .addButton('vex-dialog-button-primary vex-dialog-button', 'Maybe?', function (cmp, $event) { return cmp.dialog.close('Maybe'); })
                        .addCancelButton('Nope!')
                        .open();
                }
            },
            {
                text: 'no buttons',
                factory: function () { return presets.noButtons.call(_this, _this.modal).open(); }
            },
            {
                text: 'custom buttons',
                factory: function () { return presets.customButtons.call(_this, _this.modal).open(); }
            }
        ];
    }
    __decorate([
        core_1.ViewChild(index_1.DemoHead), 
        __metadata('design:type', (typeof (_a = typeof index_1.DemoHead !== 'undefined' && index_1.DemoHead) === 'function' && _a) || Object)
    ], VexDemo.prototype, "demoHead", void 0);
    __decorate([
        core_1.ViewChild('templateRef'), 
        __metadata('design:type', (typeof (_b = typeof core_1.TemplateRef !== 'undefined' && core_1.TemplateRef) === 'function' && _b) || Object)
    ], VexDemo.prototype, "templateRef", void 0);
    VexDemo = __decorate([
        core_1.Component({
            selector: 'vex-demo',
            styles: [
                __webpack_require__(753),
                __webpack_require__(747),
                __webpack_require__(749),
                __webpack_require__(750),
                __webpack_require__(752),
                __webpack_require__(748),
                __webpack_require__(751),
                __webpack_require__(746)
            ],
            template: __webpack_require__(578),
            // We override providers set by the Module since this app is using multiple module plugins
            // (js-native, vex, bootstrap) which messes up the provider tree (last plugin wins)
            // usually an app will use one plugin and this line is not needed.
            providers: vex_1.providers,
            encapsulation: core_1.ViewEncapsulation.None
        }), 
        __metadata('design:paramtypes', [(typeof (_c = typeof vex_1.Modal !== 'undefined' && vex_1.Modal) === 'function' && _c) || Object])
    ], VexDemo);
    return VexDemo;
    var _a, _b, _c;
}());
exports.VexDemo = VexDemo;


/***/ },

/***/ 4:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
__export(__webpack_require__(327));
var utils_1 = __webpack_require__(67);
exports.extend = utils_1.extend;
exports.arrayUnion = utils_1.arrayUnion;
exports.PromiseCompleter = utils_1.PromiseCompleter;
exports.Maybe = utils_1.Maybe;
var createComponent_1 = __webpack_require__(208);
exports.createComponent = createComponent_1.createComponent;
exports.CreateComponentArgs = createComponent_1.CreateComponentArgs;
__export(__webpack_require__(328));
var dialog_ref_1 = __webpack_require__(68);
exports.DialogRef = dialog_ref_1.DialogRef;
var tokens_1 = __webpack_require__(209);
exports.DROP_IN_TYPE = tokens_1.DROP_IN_TYPE;
exports.ModalComponent = tokens_1.ModalComponent;
exports.OverlayRenderer = tokens_1.OverlayRenderer;
exports.OverlayConfig = tokens_1.OverlayConfig;
exports.CloseGuard = tokens_1.CloseGuard;
exports.ContainerContent = tokens_1.ContainerContent;
var index_1 = __webpack_require__(216);
exports.Modal = index_1.Modal;
exports.DOMOverlayRenderer = index_1.DOMOverlayRenderer;
var overlay_context_1 = __webpack_require__(330);
exports.overlayConfigFactory = overlay_context_1.overlayConfigFactory;
exports.OverlayContext = overlay_context_1.OverlayContext;
exports.OverlayContextBuilder = overlay_context_1.OverlayContextBuilder;
exports.ModalControllingContextBuilder = overlay_context_1.ModalControllingContextBuilder;
var index_2 = __webpack_require__(210);
exports.Overlay = index_2.Overlay;
exports.EmbedComponentConfig = index_2.EmbedComponentConfig;
exports.ModalOverlay = index_2.ModalOverlay;
exports.OverlayDialogBoundary = index_2.OverlayDialogBoundary;
exports.OverlayTarget = index_2.OverlayTarget;
var modal_context_1 = __webpack_require__(329);
exports.DEFAULT_VALUES = modal_context_1.DEFAULT_VALUES;
exports.ModalContext = modal_context_1.ModalContext;
exports.ModalContextBuilder = modal_context_1.ModalContextBuilder;
var modal_open_context_1 = __webpack_require__(536);
exports.ModalOpenContext = modal_open_context_1.ModalOpenContext;
exports.ModalOpenContextBuilder = modal_open_context_1.ModalOpenContextBuilder;
__export(__webpack_require__(207));
var angular2_modal_module_1 = __webpack_require__(531);
exports.ModalModule = angular2_modal_module_1.ModalModule;


/***/ },

/***/ 408:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__(0);
var common_1 = __webpack_require__(20);
var platform_browser_1 = __webpack_require__(106);
var angular2_modal_1 = __webpack_require__(4);
var shared_module_1 = __webpack_require__(137);
var bootstrap_demo_module_1 = __webpack_require__(551);
var vex_demo_module_1 = __webpack_require__(559);
var js_native_demo_module_1 = __webpack_require__(555);
var app_1 = __webpack_require__(546);
var home_1 = __webpack_require__(352);
var app_routes_1 = __webpack_require__(545);
var index_1 = __webpack_require__(353);
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            imports: [
                platform_browser_1.BrowserModule,
                app_routes_1.routing,
                shared_module_1.SharedModule.forRoot(),
                angular2_modal_1.ModalModule.forRoot(),
                bootstrap_demo_module_1.BootstrapDemoModule,
                vex_demo_module_1.VexDemoModule,
                js_native_demo_module_1.JSNativeDemoModule,
                index_1.InAppModalModule
            ],
            declarations: [app_1.App, home_1.Home],
            bootstrap: [app_1.App],
            providers: [
                { provide: common_1.LocationStrategy, useClass: common_1.HashLocationStrategy },
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;


/***/ },

/***/ 531:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__(0);
var platform_browser_1 = __webpack_require__(106);
var index_1 = __webpack_require__(216);
var tokens_1 = __webpack_require__(209);
var index_2 = __webpack_require__(207);
var index_3 = __webpack_require__(210);
var ModalModule = (function () {
    function ModalModule() {
    }
    /**
     * Returns a ModalModule pre-loaded with a list of dynamically inserted components.
     * Since dynamic components are not analysed by the angular compiler they must register manually
     * using entryComponents, this is an easy way to do it.
     * @param entryComponents A list of dynamically inserted components (dialog's).
     * @returns {{ngModule: ModalModule, providers: {provide: OpaqueToken, useValue: Array<Type|any[]>, multi: boolean}[]}}
     */
    ModalModule.withComponents = function (entryComponents) {
        return {
            ngModule: ModalModule,
            providers: [
                { provide: core_1.ANALYZE_FOR_ENTRY_COMPONENTS, useValue: entryComponents, multi: true }
            ]
        };
    };
    /**
     * Returns a NgModule for use in the root Module.
     * @param entryComponents A list of dynamically inserted components (dialog's).
     * @returns ModuleWithProviders
     */
    ModalModule.forRoot = function (entryComponents) {
        return {
            ngModule: ModalModule,
            providers: [
                index_3.Overlay,
                { provide: tokens_1.OverlayRenderer, useClass: index_1.DOMOverlayRenderer },
                { provide: platform_browser_1.EVENT_MANAGER_PLUGINS, useClass: index_1.DOMOutsideEventPlugin, multi: true },
                { provide: core_1.ANALYZE_FOR_ENTRY_COMPONENTS, useValue: entryComponents || [], multi: true }
            ]
        };
    };
    ModalModule = __decorate([
        core_1.NgModule({
            declarations: [
                index_3.ModalOverlay,
                index_2.SwapComponentDirective,
                index_2.CSSBackdrop,
                index_2.CSSDialogContainer,
                index_3.OverlayDialogBoundary,
                index_3.OverlayTarget,
                index_3.DefaultOverlayTarget
            ],
            exports: [
                index_2.CSSBackdrop,
                index_2.CSSDialogContainer,
                index_2.SwapComponentDirective,
                index_3.OverlayDialogBoundary,
                index_3.OverlayTarget,
                index_3.DefaultOverlayTarget
            ],
            entryComponents: [
                index_3.ModalOverlay,
                index_2.CSSBackdrop,
                index_2.CSSDialogContainer
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], ModalModule);
    return ModalModule;
}());
exports.ModalModule = ModalModule;


/***/ },

/***/ 532:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__(0);
var base_dynamic_component_1 = __webpack_require__(206);
/**
 * Represents the modal backdrop shaped by CSS.
 */
var CSSBackdrop = (function (_super) {
    __extends(CSSBackdrop, _super);
    function CSSBackdrop(el, renderer) {
        var _this = this;
        _super.call(this, el, renderer);
        this.activateAnimationListener();
        var style = {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%'
        };
        Object.keys(style).forEach(function (k) { return _this.setStyle(k, style[k]); });
    }
    CSSBackdrop = __decorate([
        core_1.Component({
            selector: 'css-backdrop',
            host: {
                '[attr.class]': 'cssClass',
                '[attr.style]': 'styleStr'
            },
            encapsulation: core_1.ViewEncapsulation.None,
            template: ""
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof core_1.ElementRef !== 'undefined' && core_1.ElementRef) === 'function' && _a) || Object, (typeof (_b = typeof core_1.Renderer !== 'undefined' && core_1.Renderer) === 'function' && _b) || Object])
    ], CSSBackdrop);
    return CSSBackdrop;
    var _a, _b;
}(base_dynamic_component_1.BaseDynamicComponent));
exports.CSSBackdrop = CSSBackdrop;


/***/ },

/***/ 533:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__(0);
var base_dynamic_component_1 = __webpack_require__(206);
var dialog_ref_1 = __webpack_require__(68);
/**
 * A component that acts as a top level container for an open modal window.
 */
var CSSDialogContainer = (function (_super) {
    __extends(CSSDialogContainer, _super);
    function CSSDialogContainer(dialog, el, renderer) {
        _super.call(this, el, renderer);
        this.dialog = dialog;
        this.activateAnimationListener();
    }
    CSSDialogContainer = __decorate([
        core_1.Component({
            selector: 'css-dialog-container',
            host: {
                'tabindex': '-1',
                'role': 'dialog'
            },
            encapsulation: core_1.ViewEncapsulation.None,
            template: "<ng-content></ng-content>"
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof dialog_ref_1.DialogRef !== 'undefined' && dialog_ref_1.DialogRef) === 'function' && _a) || Object, (typeof (_b = typeof core_1.ElementRef !== 'undefined' && core_1.ElementRef) === 'function' && _b) || Object, (typeof (_c = typeof core_1.Renderer !== 'undefined' && core_1.Renderer) === 'function' && _c) || Object])
    ], CSSDialogContainer);
    return CSSDialogContainer;
    var _a, _b, _c;
}(base_dynamic_component_1.BaseDynamicComponent));
exports.CSSDialogContainer = CSSDialogContainer;


/***/ },

/***/ 534:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__(0);
// <template [dynCmp]="myCmp" [dynCmpBindings]="myBindings"></template>
// <template [dynCmp]="ctx.component" [dynCmpBindings]="ctx.bindings" [dynCmpProjectables]="ctx.projectableNodes"></template>
var SwapComponentDirective = (function () {
    function SwapComponentDirective(cfr, vcRef, tRef) {
        this.cfr = cfr;
        this.vcRef = vcRef;
        this.tRef = tRef;
        this.onCreate = new core_1.EventEmitter(false);
    }
    Object.defineProperty(SwapComponentDirective.prototype, "swapCmp", {
        set: function (component) {
            this.component = component;
            this.vcRef.clear();
            if (this.component) {
                var injector = this.swapCmpInjector || this.vcRef.parentInjector;
                if (Array.isArray(this.swapCmpBindings) && this.swapCmpBindings.length > 0) {
                    injector = core_1.ReflectiveInjector.fromResolvedProviders(this.swapCmpBindings, injector);
                }
                var cmpRef = this.vcRef.createComponent(this.cfr.resolveComponentFactory(component), this.vcRef.length, injector, this.swapCmpProjectables);
                cmpRef.changeDetectorRef.detectChanges();
                this.onCreate.emit(cmpRef);
            }
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Array)
    ], SwapComponentDirective.prototype, "swapCmpBindings", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', (typeof (_a = typeof core_1.Injector !== 'undefined' && core_1.Injector) === 'function' && _a) || Object)
    ], SwapComponentDirective.prototype, "swapCmpInjector", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Array)
    ], SwapComponentDirective.prototype, "swapCmpProjectables", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', (typeof (_b = typeof core_1.EventEmitter !== 'undefined' && core_1.EventEmitter) === 'function' && _b) || Object)
    ], SwapComponentDirective.prototype, "onCreate", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object), 
        __metadata('design:paramtypes', [Object])
    ], SwapComponentDirective.prototype, "swapCmp", null);
    SwapComponentDirective = __decorate([
        core_1.Directive({
            selector: '[swapCmp]'
        }), 
        __metadata('design:paramtypes', [(typeof (_c = typeof core_1.ComponentFactoryResolver !== 'undefined' && core_1.ComponentFactoryResolver) === 'function' && _c) || Object, (typeof (_d = typeof core_1.ViewContainerRef !== 'undefined' && core_1.ViewContainerRef) === 'function' && _d) || Object, (typeof (_e = typeof core_1.TemplateRef !== 'undefined' && core_1.TemplateRef) === 'function' && _e) || Object])
    ], SwapComponentDirective);
    return SwapComponentDirective;
    var _a, _b, _c, _d, _e;
}());
exports.SwapComponentDirective = SwapComponentDirective;
// <component-linker [linkedComponent]="ctx.component" [bindings]="ctx.bindings"></component-linker>
// @Component({
//   selector: 'component-linker',
//   template: ''
// })
// export class ComponentLinker {
//
//   @Input() linkedComponent: any;
//   @Input() bindings: ResolvedReflectiveProvider[];
//
//   @Output() onCreate: EventEmitter<ComponentRef<any>> = new EventEmitter<ComponentRef<any>>(false);
//   constructor(private vcRef: ViewContainerRef, private cfr: ComponentFactoryResolver) {
//
//   }
//
//   ngAfterViewInit() {
//     let injector = this.vcRef.parentInjector;
//
//     if (Array.isArray(this.bindings) && this.bindings.length > 0) {
//       injector = ReflectiveInjector.fromResolvedProviders(this.bindings, injector);
//     }
//
//     const cmpRef = this.vcRef.createComponent(
//       this.cfr.resolveComponentFactory(this.linkedComponent),
//       this.vcRef.length,
//       injector
//     );
//
//     cmpRef.changeDetectorRef.detectChanges();
//
//     this.onCreate.emit(cmpRef);
//   }
// } 


/***/ },

/***/ 535:
/***/ function(module, exports) {

"use strict";
"use strict";
var BASKET_GROUP = {};
/**
 * A dumb stack implementation over an array.
 */
var DialogRefStack = (function () {
    function DialogRefStack() {
        this._stack = [];
        this._stackMap = new Map();
    }
    Object.defineProperty(DialogRefStack.prototype, "length", {
        get: function () {
            return this._stack.length;
        },
        enumerable: true,
        configurable: true
    });
    DialogRefStack.prototype.push = function (dialogRef, group) {
        if (this._stack.indexOf(dialogRef) === -1) {
            this._stack.push(dialogRef);
            this._stackMap.set(dialogRef, group || BASKET_GROUP);
        }
    };
    /**
     * Push a DialogRef into the stack and manage it so when it's done
     * it will automatically kick itself out of the stack.
     * @param dialogRef
     */
    DialogRefStack.prototype.pushManaged = function (dialogRef, group) {
        var _this = this;
        this.push(dialogRef, group);
        dialogRef.onDestroy.subscribe(function () { return _this.remove(dialogRef); });
    };
    DialogRefStack.prototype.pop = function () {
        var dialogRef = this._stack.pop();
        this._stackMap.delete(dialogRef);
        return dialogRef;
    };
    /**
     * Remove a DialogRef from the stack.
     * @param dialogRef
     */
    DialogRefStack.prototype.remove = function (dialogRef) {
        var idx = this.indexOf(dialogRef);
        if (idx > -1) {
            this._stack.splice(idx, 1);
            this._stackMap.delete(dialogRef);
        }
    };
    DialogRefStack.prototype.index = function (index) {
        return this._stack[index];
    };
    DialogRefStack.prototype.indexOf = function (dialogRef) {
        return this._stack.indexOf(dialogRef);
    };
    DialogRefStack.prototype.groupOf = function (dialogRef) {
        return this._stackMap.get(dialogRef);
    };
    DialogRefStack.prototype.groupBy = function (group) {
        var arr = [];
        if (group) {
            this._stackMap.forEach(function (value, key) {
                if (value === group) {
                    arr.push(key);
                }
            });
        }
        return arr;
    };
    DialogRefStack.prototype.groupLength = function (group) {
        var count = 0;
        if (group) {
            this._stackMap.forEach(function (value, key) {
                if (value === group) {
                    count++;
                }
            });
        }
        return count;
    };
    return DialogRefStack;
}());
exports.DialogRefStack = DialogRefStack;


/***/ },

/***/ 536:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var index_1 = __webpack_require__(216);
var modal_context_1 = __webpack_require__(329);
var utils_1 = __webpack_require__(67);
var DEFAULT_SETTERS = [
    'component'
];
var ModalOpenContext = (function (_super) {
    __extends(ModalOpenContext, _super);
    function ModalOpenContext() {
        _super.apply(this, arguments);
    }
    return ModalOpenContext;
}(modal_context_1.ModalContext));
exports.ModalOpenContext = ModalOpenContext;
/**
 * A Modal Context that knows about the modal service, and so can open a modal window on demand.
 * Use the fluent API to configure the preset and then invoke the 'open' method to open a modal
 * based on the context.
 */
var ModalOpenContextBuilder = (function (_super) {
    __extends(ModalOpenContextBuilder, _super);
    function ModalOpenContextBuilder(defaultValues, initialSetters, baseType) {
        if (defaultValues === void 0) { defaultValues = undefined; }
        if (initialSetters === void 0) { initialSetters = undefined; }
        if (baseType === void 0) { baseType = undefined; }
        _super.call(this, defaultValues || {}, utils_1.arrayUnion(DEFAULT_SETTERS, initialSetters || []), baseType);
    }
    /**
     * Hook to alter config and return bindings.
     * @param config
     */
    ModalOpenContextBuilder.prototype.$$beforeOpen = function (config) {
        return [];
    };
    /**
     * Open a modal window based on the configuration of this config instance.
     * @param viewContainer If set opens the modal inside the supplied viewContainer
     * @returns Promise<DialogRef>
     */
    ModalOpenContextBuilder.prototype.open = function (viewContainer) {
        var context = this.toJSON();
        if (!(context.modal instanceof index_1.Modal)) {
            return Promise.reject(new Error('Configuration Error: modal service not set.'));
        }
        var overlayConfig = {
            context: context,
            viewContainer: viewContainer,
            bindings: typeof this.$$beforeOpen === 'function' && this.$$beforeOpen(context)
        };
        return context.modal.open(context.component, overlayConfig);
    };
    return ModalOpenContextBuilder;
}(modal_context_1.ModalContextBuilder));
exports.ModalOpenContextBuilder = ModalOpenContextBuilder;


/***/ },

/***/ 537:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__(0);
var utils_1 = __webpack_require__(67);
var dialog_ref_1 = __webpack_require__(68);
var index_1 = __webpack_require__(207);
/**
 * Represents the modal overlay.
 */
var ModalOverlay = (function (_super) {
    __extends(ModalOverlay, _super);
    function ModalOverlay(dialogRef, vcr, el, renderer) {
        _super.call(this, el, renderer);
        this.dialogRef = dialogRef;
        this.vcr = vcr;
        this.activateAnimationListener();
    }
    /**
     * @internal
     */
    ModalOverlay.prototype.getProjectables = function (content, bindings) {
        var nodes;
        if (typeof content === 'string') {
            nodes = [[this.renderer.createText(null, "" + content)]];
        }
        else if (content instanceof core_1.TemplateRef) {
            nodes = [
                this.dialogRef.overlay.defaultViewContainer
                    .createEmbeddedView(content, { dialogRef: this.dialogRef }).rootNodes
            ];
        }
        else {
            nodes = [this.embedComponent({ component: content, bindings: bindings }).rootNodes];
        }
        return nodes;
    };
    ModalOverlay.prototype.embedComponent = function (config) {
        return this.vcr.createEmbeddedView(this.template, {
            $implicit: config
        });
    };
    ModalOverlay.prototype.addComponent = function (type, bindings, projectableNodes) {
        if (bindings === void 0) { bindings = []; }
        if (projectableNodes === void 0) { projectableNodes = []; }
        return _super.prototype._addComponent.call(this, {
            component: type,
            vcRef: this.innerVcr,
            bindings: bindings,
            projectableNodes: projectableNodes
        });
    };
    ModalOverlay.prototype.fullscreen = function () {
        var _this = this;
        var style = {
            position: 'fixed',
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            'z-index': 1500
        };
        Object.keys(style).forEach(function (k) { return _this.setStyle(k, style[k]); });
    };
    ModalOverlay.prototype.insideElement = function () {
        var _this = this;
        var style = {
            position: 'absolute',
            overflow: 'hidden',
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            bottom: 0,
            right: 0
        };
        Object.keys(style).forEach(function (k) { return _this.setStyle(k, style[k]); });
    };
    /**
     * Define an element that click inside it will not trigger modal close.
     * Since events bubble, clicking on a dialog will bubble up to the overlay, a plugin
     * must define an element that represent the dialog, the overlay will make sure no to close when
     * it was clicked.
     * @param element
     */
    ModalOverlay.prototype.setClickBoundary = function (element) {
        var _this = this;
        var target;
        var elListener = function (event) { return target = event.target; };
        var docListener = function (event) {
            if (_this.dialogRef.context.isBlocking || !_this.dialogRef.overlay.isTopMost(_this.dialogRef)) {
                return;
            }
            var current = event.target;
            // on click, this will hit.
            if (current === target)
                return;
            // on mouse down -> drag -> release the current might not be 'target', it might be
            // a sibling or a child (i.e: not part of the tree-up direction). It might also be a release
            // outside the dialog... so we compare to the boundary element
            do {
                if (current === element) {
                    return;
                }
            } while (current.parentNode && (current = current.parentNode));
            _this.dialogRef.dismiss();
        };
        this.dialogRef.onDestroy.subscribe(function () {
            element.removeEventListener('click', elListener, false);
            element.removeEventListener('touchstart', elListener, false);
            document.removeEventListener('click', docListener, false);
            document.removeEventListener('touchend', docListener, false);
        });
        setTimeout(function () {
            element.addEventListener('mousedown', elListener, false);
            element.addEventListener('touchstart', docListener, false);
            document.addEventListener('click', docListener, false);
            document.addEventListener('touchend', docListener, false);
        });
    };
    /**
     * Temp workaround for animation where destruction of the top level component does not
     * trigger child animations. Solution should be found either in animation module or in design
     * of the modal component tree.
     * @returns {Promise<void>}
     */
    ModalOverlay.prototype.canDestroy = function () {
        var completer = new utils_1.PromiseCompleter();
        if (!Array.isArray(this.beforeDestroyHandlers)) {
            completer.resolve();
        }
        else {
            // run destroy notification but protect against halt.
            var id_1 = setTimeout(function () {
                id_1 = null;
                completer.reject();
            }, 1000);
            var resolve = function () {
                if (id_1 === null)
                    return;
                clearTimeout(id_1);
                completer.resolve();
            };
            Promise.all(this.beforeDestroyHandlers.map(function (fn) { return fn(); }))
                .then(resolve)
                .catch(resolve);
        }
        return completer.promise;
    };
    /**
     * A handler running before destruction of the overlay
     * use to delay destruction due to animation.
     * This is part of the workaround for animation, see canDestroy.
     *
     * NOTE: There is no guarantee that the listeners will fire, use dialog.onDestory for that.
     * @param fn
     */
    ModalOverlay.prototype.beforeDestroy = function (fn) {
        if (!this.beforeDestroyHandlers) {
            this.beforeDestroyHandlers = [];
        }
        this.beforeDestroyHandlers.push(fn);
    };
    ModalOverlay.prototype.documentKeypress = function (event) {
        // check that this modal is the last in the stack.
        if (!this.dialogRef.overlay.isTopMost(this.dialogRef))
            return;
        if (utils_1.supportsKey(event.keyCode, this.dialogRef.context.keyboard)) {
            this.dialogRef.dismiss();
        }
    };
    ModalOverlay.prototype.ngOnDestroy = function () {
        _super.prototype.ngOnDestroy.call(this);
        if (this.dialogRef.destroyed !== true) {
            // if we're here the overlay is destroyed by an external event that is not user invoked.
            // i.e: The user did no call dismiss or close and dialogRef.destroy() did not invoke.
            // this will happen when routing or killing an element containing a blocked overlay (ngIf)
            // we bail out, i.e gracefully shutting down.
            this.dialogRef.bailOut();
        }
    };
    __decorate([
        core_1.ViewChild('innerView', { read: core_1.ViewContainerRef }), 
        __metadata('design:type', (typeof (_a = typeof core_1.ViewContainerRef !== 'undefined' && core_1.ViewContainerRef) === 'function' && _a) || Object)
    ], ModalOverlay.prototype, "innerVcr", void 0);
    __decorate([
        core_1.ViewChild('template'), 
        __metadata('design:type', (typeof (_b = typeof core_1.TemplateRef !== 'undefined' && core_1.TemplateRef) === 'function' && _b) || Object)
    ], ModalOverlay.prototype, "template", void 0);
    ModalOverlay = __decorate([
        core_1.Component({
            selector: 'modal-overlay',
            host: {
                '(body:keydown)': 'documentKeypress($event)'
            },
            encapsulation: core_1.ViewEncapsulation.None,
            template: "<template #innerView></template>\n<template #template let-ctx>\n    <template [swapCmp]=\"ctx.component\" [swapCmpBindings]=\"ctx.bindings\" [swapCmpProjectables]=\"ctx.projectableNodes\"></template>\n</template>\n"
        }), 
        __metadata('design:paramtypes', [(typeof (_c = typeof dialog_ref_1.DialogRef !== 'undefined' && dialog_ref_1.DialogRef) === 'function' && _c) || Object, (typeof (_d = typeof core_1.ViewContainerRef !== 'undefined' && core_1.ViewContainerRef) === 'function' && _d) || Object, (typeof (_e = typeof core_1.ElementRef !== 'undefined' && core_1.ElementRef) === 'function' && _e) || Object, (typeof (_f = typeof core_1.Renderer !== 'undefined' && core_1.Renderer) === 'function' && _f) || Object])
    ], ModalOverlay);
    return ModalOverlay;
    var _a, _b, _c, _d, _e, _f;
}(index_1.BaseDynamicComponent));
exports.ModalOverlay = ModalOverlay;


/***/ },

/***/ 538:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__(0);
var dialog_ref_1 = __webpack_require__(68);
var vc_ref_store_1 = __webpack_require__(331);
var overlay_service_1 = __webpack_require__(332);
/**
 * A directive use to signal the overlay that the host of this directive
 * is a dialog boundary, i.e: over click outside of the element should close the modal
 * (if non blocking)
 */
var OverlayDialogBoundary = (function () {
    function OverlayDialogBoundary(el, dialogRef) {
        if (dialogRef && el.nativeElement) {
            dialogRef.overlayRef.instance.setClickBoundary(el.nativeElement);
        }
    }
    OverlayDialogBoundary = __decorate([
        core_1.Directive({
            selector: '[overlayDialogBoundary]'
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof core_1.ElementRef !== 'undefined' && core_1.ElementRef) === 'function' && _a) || Object, (typeof (_b = typeof dialog_ref_1.DialogRef !== 'undefined' && dialog_ref_1.DialogRef) === 'function' && _b) || Object])
    ], OverlayDialogBoundary);
    return OverlayDialogBoundary;
    var _a, _b;
}());
exports.OverlayDialogBoundary = OverlayDialogBoundary;
var OverlayTarget = (function () {
    function OverlayTarget(vcRef) {
        this.vcRef = vcRef;
    }
    Object.defineProperty(OverlayTarget.prototype, "targetKey", {
        set: function (value) {
            this._targetKey = value;
            if (value) {
                vc_ref_store_1.vcRefStore.setVCRef(value, this.vcRef);
            }
        },
        enumerable: true,
        configurable: true
    });
    OverlayTarget.prototype.ngOnDestroy = function () {
        if (this._targetKey) {
            vc_ref_store_1.vcRefStore.delVCRef(this._targetKey, this.vcRef);
        }
    };
    __decorate([
        core_1.Input('overlayTarget'), 
        __metadata('design:type', String), 
        __metadata('design:paramtypes', [String])
    ], OverlayTarget.prototype, "targetKey", null);
    OverlayTarget = __decorate([
        core_1.Directive({
            selector: '[overlayTarget]'
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof core_1.ViewContainerRef !== 'undefined' && core_1.ViewContainerRef) === 'function' && _a) || Object])
    ], OverlayTarget);
    return OverlayTarget;
    var _a;
}());
exports.OverlayTarget = OverlayTarget;
var noop = function () { };
var DefaultOverlayTarget = (function () {
    function DefaultOverlayTarget(overlay, vcRef) {
        this.overlay = overlay;
        overlay.defaultViewContainer = vcRef;
    }
    DefaultOverlayTarget.prototype.ngOnDestroy = function () {
        this.overlay.defaultViewContainer = undefined;
    };
    DefaultOverlayTarget = __decorate([
        core_1.Directive({
            selector: '[defaultOverlayTarget]'
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof overlay_service_1.Overlay !== 'undefined' && overlay_service_1.Overlay) === 'function' && _a) || Object, (typeof (_b = typeof core_1.ViewContainerRef !== 'undefined' && core_1.ViewContainerRef) === 'function' && _b) || Object])
    ], DefaultOverlayTarget);
    return DefaultOverlayTarget;
    var _a, _b;
}());
exports.DefaultOverlayTarget = DefaultOverlayTarget;


/***/ },

/***/ 539:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__(0);
var common_1 = __webpack_require__(20);
var angular2_modal_1 = __webpack_require__(4);
var modal_1 = __webpack_require__(334);
var modal_container_component_1 = __webpack_require__(212);
var message_modal_component_1 = __webpack_require__(211);
exports.providers = [
    { provide: angular2_modal_1.Modal, useClass: modal_1.Modal },
    { provide: modal_1.Modal, useClass: modal_1.Modal }
];
var BootstrapModalModule = (function () {
    function BootstrapModalModule() {
    }
    BootstrapModalModule.getProviders = function () {
        return exports.providers;
    };
    BootstrapModalModule = __decorate([
        core_1.NgModule({
            imports: [angular2_modal_1.ModalModule, common_1.CommonModule],
            declarations: [
                message_modal_component_1.BSModalFooter,
                message_modal_component_1.BSMessageModalTitle,
                message_modal_component_1.BSMessageModalBody,
                message_modal_component_1.BSMessageModal,
                modal_container_component_1.BSModalContainer
            ],
            providers: exports.providers,
            entryComponents: [
                modal_container_component_1.BSModalContainer,
                message_modal_component_1.BSMessageModal
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], BootstrapModalModule);
    return BootstrapModalModule;
}());
exports.BootstrapModalModule = BootstrapModalModule;


/***/ },

/***/ 540:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__(0);
var angular2_modal_1 = __webpack_require__(4);
var modal_1 = __webpack_require__(215);
exports.providers = [
    { provide: angular2_modal_1.Modal, useClass: modal_1.Modal },
    { provide: modal_1.Modal, useClass: modal_1.Modal }
];
var JSNativeModalModule = (function () {
    function JSNativeModalModule() {
    }
    JSNativeModalModule.getProviders = function () {
        return exports.providers;
    };
    JSNativeModalModule = __decorate([
        core_1.NgModule({
            providers: exports.providers
        }), 
        __metadata('design:paramtypes', [])
    ], JSNativeModalModule);
    return JSNativeModalModule;
}());
exports.JSNativeModalModule = JSNativeModalModule;


/***/ },

/***/ 541:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__(0);
var common_1 = __webpack_require__(20);
var angular2_modal_1 = __webpack_require__(4);
var modal_1 = __webpack_require__(342);
var dialog_form_modal_1 = __webpack_require__(136);
exports.providers = [
    { provide: angular2_modal_1.Modal, useClass: modal_1.Modal },
    { provide: modal_1.Modal, useClass: modal_1.Modal }
];
var VexModalModule = (function () {
    function VexModalModule() {
    }
    VexModalModule.getProviders = function () {
        return exports.providers;
    };
    VexModalModule = __decorate([
        core_1.NgModule({
            imports: [angular2_modal_1.ModalModule, common_1.CommonModule],
            declarations: [
                dialog_form_modal_1.VEXDialogButtons,
                dialog_form_modal_1.FormDropIn,
                dialog_form_modal_1.DialogFormModal
            ],
            providers: exports.providers,
            entryComponents: [
                dialog_form_modal_1.DialogFormModal,
                dialog_form_modal_1.FormDropIn
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], VexModalModule);
    return VexModalModule;
}());
exports.VexModalModule = VexModalModule;


/***/ },

/***/ 542:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__(0);
var createComponent_1 = __webpack_require__(208);
var dialog_ref_1 = __webpack_require__(68);
var index_1 = __webpack_require__(210);
var DOMOverlayRenderer = (function () {
    function DOMOverlayRenderer() {
    }
    DOMOverlayRenderer.prototype.render = function (dialog, vcRef, injector) {
        var bindings = core_1.ReflectiveInjector.resolve([
            { provide: dialog_ref_1.DialogRef, useValue: dialog }
        ]);
        var cmpRef = createComponent_1.createComponent({
            component: index_1.ModalOverlay,
            vcRef: vcRef,
            injector: injector,
            bindings: bindings
        });
        if (dialog.inElement) {
            vcRef.element.nativeElement.appendChild(cmpRef.location.nativeElement);
        }
        else {
            document.body.appendChild(cmpRef.location.nativeElement);
        }
        return cmpRef;
    };
    DOMOverlayRenderer = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], DOMOverlayRenderer);
    return DOMOverlayRenderer;
}());
exports.DOMOverlayRenderer = DOMOverlayRenderer;


/***/ },

/***/ 543:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__(0);
var dialog_ref_1 = __webpack_require__(68);
var UnsupportedDropInError = (function (_super) {
    __extends(UnsupportedDropInError, _super);
    function UnsupportedDropInError(dropInName) {
        _super.call(this);
        this.message = "Unsupported Drop-In " + dropInName;
    }
    return UnsupportedDropInError;
}(Error));
exports.UnsupportedDropInError = UnsupportedDropInError;
var Modal = (function () {
    function Modal(overlay) {
        this.overlay = overlay;
    }
    Modal.prototype.alert = function () {
        throw new UnsupportedDropInError('alert');
    };
    Modal.prototype.prompt = function () {
        throw new UnsupportedDropInError('prompt');
    };
    Modal.prototype.confirm = function () {
        throw new UnsupportedDropInError('confirm');
    };
    /**
     * Opens a modal window inside an existing component.
     * @param content The content to display, either string, template ref or a component.
     * @param config Additional settings.
     * @returns {Promise<DialogRef>}
     */
    Modal.prototype.open = function (content, config) {
        config = config || {};
        try {
            var dialogs = this.overlay.open(config, this.constructor);
            if (dialogs.length > 1) {
                console.warn("Attempt to open more then 1 overlay detected.\n        Multiple modal copies are not supported at the moment, \n        only the first viewContainer will display.");
            }
            // TODO:  Currently supporting 1 view container, hence working on dialogs[0].
            //        upgrade to multiple containers.
            return Promise.resolve(this.create(dialogs[0], content, config.bindings));
        }
        catch (e) {
            return Promise.reject(e);
        }
    };
    Modal.prototype.createBackdrop = function (dialogRef, BackdropComponent) {
        var b = core_1.ReflectiveInjector.resolve([{ provide: dialog_ref_1.DialogRef, useValue: dialogRef }]);
        return dialogRef.overlayRef.instance.addComponent(BackdropComponent, b);
    };
    Modal.prototype.createContainer = function (dialogRef, ContainerComponent, content, bindings) {
        var b = core_1.ReflectiveInjector.resolve([{ provide: dialog_ref_1.DialogRef, useValue: dialogRef }])
            .concat(bindings || []);
        var nodes = dialogRef.overlayRef.instance.getProjectables(content, b);
        return dialogRef.overlayRef.instance.addComponent(ContainerComponent, b, nodes);
    };
    /**
     * A helper function for derived classes to create backdrop & container
     * @param dialogRef
     * @param backdrop
     * @param container
     * @returns { backdropRef: ComponentRef<B>, containerRef: ComponentRef<C> }
     *
     * @deprecated use createBackdrop and createContainer instead
     */
    Modal.prototype.createModal = function (dialogRef, backdrop, container) {
        var b = core_1.ReflectiveInjector.resolve([{ provide: dialog_ref_1.DialogRef, useValue: dialogRef }]);
        return {
            backdropRef: dialogRef.overlayRef.instance.addComponent(backdrop, b),
            containerRef: dialogRef.overlayRef.instance.addComponent(container, b)
        };
    };
    return Modal;
}());
exports.Modal = Modal;


/***/ },

/***/ 544:
/***/ function(module, exports, __webpack_require__) {

"use strict";
// heavily inspired by:
// http://www.bennadel.com/blog/3025-creating-custom-dom-and-host-event-bindings-in-angular-2-beta-6.htm
"use strict";
var core_1 = __webpack_require__(0);
var utils_1 = __webpack_require__(67);
var eventMap = {
    clickOutside: 'click',
    mousedownOutside: 'mousedown',
    mouseupOutside: 'mouseup',
    mousemoveOutside: 'mousemove'
};
/**
 * An event handler factory for event handlers that bubble the event to a given handler
 * if the event target is not an ancestor of the given element.
 * @param element
 * @param handler
 * @returns {function(any): undefined}
 */
function bubbleNonAncestorHandlerFactory(element, handler) {
    return function (event) {
        var current = event.target;
        do {
            if (current === element) {
                return;
            }
        } while (current.parentNode && (current = current.parentNode));
        handler(event);
    };
}
var DOMOutsideEventPlugin = (function () {
    function DOMOutsideEventPlugin() {
        // TODO: use DI factory for this.
        if (!document || typeof document.addEventListener !== 'function') {
            this.addEventListener = utils_1.noop;
        }
    }
    DOMOutsideEventPlugin.prototype.supports = function (eventName) {
        return eventMap.hasOwnProperty(eventName);
    };
    DOMOutsideEventPlugin.prototype.addEventListener = function (element, eventName, handler) {
        var zone = this.manager.getZone();
        // A Factory that registers the event on the document, instead of the element.
        // the handler is created at runtime, and it acts as a propagation/bubble predicate, it will
        // bubble up the event (i.e: execute our original event handler) only if the event targer
        // is an ancestor of our element.
        // The event is fired inside the angular zone so change detection can kick into action.
        var onceOnOutside = function () {
            var listener = bubbleNonAncestorHandlerFactory(element, function (evt) { return zone.runGuarded(function () { return handler(evt); }); });
            // mimic BrowserDomAdapter.onAndCancel
            document.addEventListener(eventMap[eventName], listener, false);
            return function () { return document.removeEventListener(eventMap[eventName], listener, false); };
        };
        // we run the event registration for the document in a different zone, this will make sure
        // change detection is off.
        // It turns out that if a component that use DOMOutsideEventPlugin is built from a click
        // event, we might get here before the event reached the document, causing a quick false
        // positive handling (when stopPropagation() was'nt invoked). To workaround this we wait
        // for the next vm turn and register.
        // Event registration returns a dispose function for that event, angular use it to clean
        // up after component get's destroyed. Since we need to return a dispose function
        // synchronously we have to put a wrapper for it since we will get it asynchronously,
        // i.e: after we need to return it.
        //
        return zone.runOutsideAngular(function () {
            var fn;
            setTimeout(function () { return fn = onceOnOutside(); }, 0);
            return function () { return fn(); };
        });
    };
    DOMOutsideEventPlugin.prototype.addGlobalEventListener = function (target, eventName, handler) {
        throw 'not supported';
    };
    DOMOutsideEventPlugin = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], DOMOutsideEventPlugin);
    return DOMOutsideEventPlugin;
}());
exports.DOMOutsideEventPlugin = DOMOutsideEventPlugin;


/***/ },

/***/ 545:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var router_1 = __webpack_require__(87);
var home_1 = __webpack_require__(352);
exports.routes = [
    { path: 'home', component: home_1.Home },
    { path: '', redirectTo: 'home', pathMatch: 'full' }
];
exports.routing = router_1.RouterModule.forRoot(exports.routes);


/***/ },

/***/ 546:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__(0);
/*
 * App Component
 * Top Level Component
 */
var App = (function () {
    function App() {
    }
    App = __decorate([
        core_1.Component({
            selector: 'app',
            encapsulation: core_1.ViewEncapsulation.None,
            styles: [
                __webpack_require__(744)
            ],
            template: __webpack_require__(572)
        }), 
        __metadata('design:paramtypes', [])
    ], App);
    return App;
}());
exports.App = App;


/***/ },

/***/ 547:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var runtime_compiled_component_1 = __webpack_require__(348);
exports.RuntimeCompiledComponent = runtime_compiled_component_1.RuntimeCompiledComponent;
var runtime_compiled_module_1 = __webpack_require__(550);
exports.RuntimeCompiledModule = runtime_compiled_module_1.RuntimeCompiledModule;


/***/ },

/***/ 548:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var inner_runtime_compiled_component_1 = __webpack_require__(347);
exports.InnerRuntimeCompiledComponent = inner_runtime_compiled_component_1.InnerRuntimeCompiledComponent;
var inner_runtime_compiled_module_1 = __webpack_require__(549);
exports.InnerRuntimeCompiledModule = inner_runtime_compiled_module_1.InnerRuntimeCompiledModule;


/***/ },

/***/ 549:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__(0);
var common_1 = __webpack_require__(20);
var angular2_modal_1 = __webpack_require__(4);
var inner_runtime_compiled_component_1 = __webpack_require__(347);
var InnerRuntimeCompiledModule = (function () {
    function InnerRuntimeCompiledModule() {
    }
    InnerRuntimeCompiledModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule,
                angular2_modal_1.ModalModule
            ],
            declarations: [
                inner_runtime_compiled_component_1.InnerRuntimeCompiledComponent
            ],
            entryComponents: [
                inner_runtime_compiled_component_1.InnerRuntimeCompiledComponent
            ],
        }), 
        __metadata('design:paramtypes', [])
    ], InnerRuntimeCompiledModule);
    return InnerRuntimeCompiledModule;
}());
exports.InnerRuntimeCompiledModule = InnerRuntimeCompiledModule;


/***/ },

/***/ 550:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__(0);
var common_1 = __webpack_require__(20);
var angular2_modal_1 = __webpack_require__(4);
var bootstrap_1 = __webpack_require__(84);
var runtime_compiled_component_1 = __webpack_require__(348);
var RuntimeCompiledModule = (function () {
    function RuntimeCompiledModule() {
    }
    RuntimeCompiledModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule,
                angular2_modal_1.ModalModule,
                bootstrap_1.BootstrapModalModule
            ],
            declarations: [
                runtime_compiled_component_1.RuntimeCompiledComponent
            ],
            entryComponents: [
                runtime_compiled_component_1.RuntimeCompiledComponent
            ],
        }), 
        __metadata('design:paramtypes', [])
    ], RuntimeCompiledModule);
    return RuntimeCompiledModule;
}());
exports.RuntimeCompiledModule = RuntimeCompiledModule;


/***/ },

/***/ 551:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__(0);
var common_1 = __webpack_require__(20);
var forms_1 = __webpack_require__(152);
var bootstrap_1 = __webpack_require__(84);
var shared_module_1 = __webpack_require__(137);
var bootstrap_demo_routes_1 = __webpack_require__(552);
var bootstrap_demo_1 = __webpack_require__(349);
var bootstrap_demo_page_1 = __webpack_require__(345);
var custom_modal_sample_1 = __webpack_require__(346);
var modal_customisation_wizard_1 = __webpack_require__(350);
var BootstrapDemoModule = (function () {
    function BootstrapDemoModule() {
    }
    BootstrapDemoModule = __decorate([
        core_1.NgModule({
            imports: [forms_1.FormsModule, common_1.CommonModule, bootstrap_1.BootstrapModalModule, bootstrap_demo_routes_1.routing, shared_module_1.SharedModule],
            declarations: [
                bootstrap_demo_1.BootstrapDemo,
                bootstrap_demo_page_1.BootstrapDemoPage,
                custom_modal_sample_1.CustomModal,
                modal_customisation_wizard_1.ModalCustomisationWizard
            ],
            entryComponents: [custom_modal_sample_1.CustomModal]
        }), 
        __metadata('design:paramtypes', [])
    ], BootstrapDemoModule);
    return BootstrapDemoModule;
}());
exports.BootstrapDemoModule = BootstrapDemoModule;


/***/ },

/***/ 552:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var router_1 = __webpack_require__(87);
var bootstrap_demo_1 = __webpack_require__(349);
var bootstrap_demo_page_1 = __webpack_require__(345);
var modal_customisation_wizard_1 = __webpack_require__(350);
exports.routing = router_1.RouterModule.forChild([
    { path: 'bootstrap-demo', component: bootstrap_demo_1.BootstrapDemo, children: [
            { path: '', component: bootstrap_demo_page_1.BootstrapDemoPage, pathMatch: 'full' },
            { path: 'customizeModals', component: modal_customisation_wizard_1.ModalCustomisationWizard }
        ]
    }
]);


/***/ },

/***/ 553:
/***/ function(module, exports) {

"use strict";
"use strict";
function alert(modal) {
    return modal.alert()
        .size('lg')
        .showClose(true)
        .title('A simple Alert style modal window')
        .body("\n        <h4>Alert is a classic (title/body/footer) 1 button modal window that \n        does not block.</h4>\n        <b>Configuration:</b>\n        <ul>\n            <li>Non blocking (click anywhere outside to dismiss)</li>\n            <li>Size large</li>\n            <li>Dismissed with default keyboard key (ESC)</li>\n            <li>Close wth button click</li>\n            <li>HTML content</li>\n        </ul>");
}
exports.alert = alert;
function prompt(modal) {
    return modal.prompt()
        .size('lg')
        .title('A simple Prompt style modal window')
        .placeholder('This is a placeholder')
        .body('Please type a value!');
}
exports.prompt = prompt;
function confirm(modal) {
    return modal.confirm()
        .size('lg')
        .titleHtml("\n            <div class=\"modal-title\" \n                 style=\"font-size: 22px; color: grey; text-decoration: underline;\">\n                 A simple Confirm style modal window</div>")
        .body("\n            <h4>Confirm is a classic (title/body/footer) 2 button modal window that blocks.</h4>\n            <b>Configuration:</b>\n            <ul>\n                <li>Blocks (only button click can close/dismiss)</li>\n                <li>Size large</li>\n                <li>Keyboard can not dismiss</li>\n                <li>HTML Title</li>\n                <li>HTML content</li>\n            </ul>");
}
exports.confirm = confirm;
function cascading(modal) {
    var presets = [];
    presets.push(alert(modal));
    presets.push(prompt(modal));
    presets.push(confirm(modal));
    presets.push(modal.prompt()
        .size('sm')
        .title('Cascading modals!')
        .body('Find your way out...'));
    return {
        open: function () {
            var ret = presets.shift().open();
            while (presets.length > 0)
                presets.shift().open();
            return ret;
        }
    };
}
exports.cascading = cascading;
function inElement(modal) {
    return modal.prompt()
        .size('sm')
        .title('A modal contained by an element')
        .inElement(true)
        .body('Try stacking up more modals!');
}
exports.inElement = inElement;


/***/ },

/***/ 554:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__(0);
var DemoHead = (function () {
    function DemoHead() {
        this.dropInClick = new core_1.EventEmitter();
    }
    DemoHead.prototype.onClick = function (event, btn) {
        this.dropInClick.emit({
            event: event,
            source: btn
        });
        this.processDialog(btn.factory());
    };
    DemoHead.prototype.processDialog = function (dialog) {
        var _this = this;
        dialog.then(function (resultPromise) {
            return resultPromise.result.then(function (result) {
                _this.result = result;
            }, function () { return _this.result = 'Rejected!'; });
        });
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], DemoHead.prototype, "title", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], DemoHead.prototype, "description", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Array)
    ], DemoHead.prototype, "modalCommands", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', (typeof (_a = typeof core_1.EventEmitter !== 'undefined' && core_1.EventEmitter) === 'function' && _a) || Object)
    ], DemoHead.prototype, "dropInClick", void 0);
    DemoHead = __decorate([
        core_1.Component({
            selector: 'demo-head',
            styles: [
                "\n      .btn-dropin {\n          text-transform: uppercase;\n          margin: 15px;\n          background-color: #219161;\n          border: none;\n          box-shadow: 0 2px 5px 0 rgba(0,0,0,.26);\n          border-radius: 0;\n      }\n      "
            ],
            template: __webpack_require__(575),
            encapsulation: core_1.ViewEncapsulation.Emulated
        }), 
        __metadata('design:paramtypes', [])
    ], DemoHead);
    return DemoHead;
    var _a;
}());
exports.DemoHead = DemoHead;


/***/ },

/***/ 555:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__(0);
var common_1 = __webpack_require__(20);
var shared_module_1 = __webpack_require__(137);
var js_native_1 = __webpack_require__(214);
var js_native_demo_routes_1 = __webpack_require__(556);
var js_native_demo_1 = __webpack_require__(357);
var JSNativeDemoModule = (function () {
    function JSNativeDemoModule() {
    }
    JSNativeDemoModule = __decorate([
        core_1.NgModule({
            imports: [common_1.CommonModule, js_native_1.JSNativeModalModule, js_native_demo_routes_1.routing, shared_module_1.SharedModule],
            declarations: [js_native_demo_1.JSNativeDemo]
        }), 
        __metadata('design:paramtypes', [])
    ], JSNativeDemoModule);
    return JSNativeDemoModule;
}());
exports.JSNativeDemoModule = JSNativeDemoModule;


/***/ },

/***/ 556:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var router_1 = __webpack_require__(87);
var js_native_demo_1 = __webpack_require__(357);
exports.routing = router_1.RouterModule.forChild([
    { path: 'js-native-demo', component: js_native_demo_1.JSNativeDemo }
]);


/***/ },

/***/ 557:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var js_native_1 = __webpack_require__(214);
exports.JSNativePresetBuilder = js_native_1.JSNativePresetBuilder;
function alert(modal) {
    return modal.alert().message('This is a native alert!');
}
exports.alert = alert;
function prompt(modal) {
    return modal.prompt()
        .message('This is a native prompt!')
        .promptDefault('This is a default value');
}
exports.prompt = prompt;
function confirm(modal) {
    return modal.confirm().message('Yes or No?');
}
exports.confirm = confirm;


/***/ },

/***/ 558:
/***/ function(module, exports) {

"use strict";
"use strict";
function alert(modal) {
    return modal.alert()
        .className(this.theme)
        .message('An alert message!')
        .showCloseButton(true);
}
exports.alert = alert;
function prompt(modal) {
    return modal.prompt()
        .className(this.theme)
        .message('Please type a value!')
        .placeholder('This is a placeholder');
}
exports.prompt = prompt;
function confirm(modal) {
    return modal.confirm()
        .className(this.theme)
        .message('Yes or No?')
        .okBtn('Yes')
        .cancelBtn('No');
}
exports.confirm = confirm;
function noButtons(modal) {
    return modal.alert()
        .className(this.theme)
        .showCloseButton(true)
        .isBlocking(true)
        .message('Luckily I have an X button, phew...')
        .okBtn(null)
        .cancelBtn(null);
}
exports.noButtons = noButtons;
function customButtons(modal) {
    return modal.alert()
        .className(this.theme)
        .showCloseButton(true)
        .isBlocking(true)
        .message("Let's show some bootstrap style buttons...")
        .okBtn(null)
        .cancelBtn(null)
        .addButton('btn-primary', 'BTN-PRIMARY', function (cmp, $event) { return cmp.dialog.close('primary'); })
        .addButton('btn-warning', 'BTN-WARNING', function (cmp, $event) { return cmp.dialog.close('warning'); })
        .addButton('btn-success', 'BTN-SUCCESS', function (cmp, $event) { return cmp.dialog.close('success'); });
}
exports.customButtons = customButtons;
function cascading(modal) {
    var presets = [];
    presets.push(alert.call(this, modal));
    presets.push(prompt.call(this, modal));
    presets.push(confirm.call(this, modal));
    presets.push(modal.alert()
        .className(this.theme)
        .message('Cascading modals! Find your way out...'));
    return {
        open: function () {
            var ret = presets.shift().open();
            while (presets.length > 0)
                presets.shift().open();
            return ret;
        }
    };
}
exports.cascading = cascading;


/***/ },

/***/ 559:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__(0);
var common_1 = __webpack_require__(20);
var forms_1 = __webpack_require__(152);
var vex_1 = __webpack_require__(340);
var shared_module_1 = __webpack_require__(137);
var vex_demo_routes_1 = __webpack_require__(560);
var vex_demo_1 = __webpack_require__(359);
var login_dialog_1 = __webpack_require__(358);
var VexDemoModule = (function () {
    function VexDemoModule() {
    }
    VexDemoModule = __decorate([
        core_1.NgModule({
            imports: [forms_1.FormsModule, common_1.CommonModule, vex_1.VexModalModule, vex_demo_routes_1.routing, shared_module_1.SharedModule],
            declarations: [vex_demo_1.VexDemo, login_dialog_1.LoginDialog],
            entryComponents: [login_dialog_1.LoginDialog]
        }), 
        __metadata('design:paramtypes', [])
    ], VexDemoModule);
    return VexDemoModule;
}());
exports.VexDemoModule = VexDemoModule;


/***/ },

/***/ 560:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var router_1 = __webpack_require__(87);
var vex_demo_1 = __webpack_require__(359);
exports.routing = router_1.RouterModule.forChild([
    { path: 'vex-demo', component: vex_demo_1.VexDemo },
]);


/***/ },

/***/ 562:
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(37)();
// imports


// module
exports.push([module.i, "/* \n========================================= \n========================================= \n\nStartup Template By Bootstrapious.com\n========================================= \n========================================= */\n/*variant 2 - green */\n/*\n\n=====================\nGENERAL\n=====================\n\n*/\nhtml {\n  height: 100%;\n}\nbody {\n  height: 100%;\n  font-weight: 300;\n  padding-top: 80px;\n}\nheader {\n  z-index: 1000;\n}\nsection {\n  position: relative;\n  padding-top: 90px;\n  padding-bottom: 90px;\n}\nsection.background-gray-lighter {\n  background: #cdcdcd;\n}\nsection.background-gray-lightest {\n  background: #f7f7f7;\n  border-top: solid 1px #cdcdcd;\n  border-bottom: solid 1px #cdcdcd;\n}\nsection.background-secondary {\n  background: #9fb1bc;\n  border-top: solid 1px #658090;\n  border-bottom: solid 1px #658090;\n}\n.section-inverse {\n  color: #fff;\n}\n.section-inverse h1,\n.section-inverse h2,\n.section-inverse h3,\n.section-inverse h4,\n.section-inverse h5,\n.section-inverse h6 {\n  color: #fff;\n}\n.section-inverse .heading:after {\n  background: #fff;\n}\n.italic {\n  font-style: italic;\n  font-family: \"Georgia\", \"Times New Roman\", Times, serif;\n}\n.heading {\n  text-align: left;\n  margin-bottom: 40px;\n}\n.heading:after {\n  content: \" \";\n  display: block;\n  width: 100px;\n  height: 2px;\n  margin: 20px 0 20px;\n  background: #2b7551;\n}\n@media (min-width: 1200px) {\n  h1.heading {\n    font-size: 68px;\n  }\n  h2.heading {\n    font-size: 58px;\n  }\n}\n.img-responsive {\n  margin: 0 auto;\n}\n.no-space .box {\n  margin: 0 -15px;\n}\n.margin-top {\n  margin-top: 30px;\n}\n.margin-top--big {\n  margin-top: 60px !important;\n}\n.margin-bottom {\n  margin-bottom: 30px;\n}\n.margin-bottom--big {\n  margin-bottom: 60px !important;\n}\n.margin-bottom--zero {\n  margin-bottom: 0 !important;\n}\n.no-padding-top {\n  padding-top: 0;\n}\n.no-padding-bottom {\n  padding-bottom: 0;\n}\n.padding--small {\n  padding-top: 30px;\n  padding-bottom: 30px;\n}\n.weight-300 {\n  font-weight: 300 !important;\n}\n.weight-500 {\n  font-weight: 500 !important;\n}\n.weight-700 {\n  font-weight: 700 !important;\n}\n.text-gray {\n  color: #555555;\n}\n.text-gray-light {\n  color: #999999;\n}\n.text-gray-lighter {\n  color: #cdcdcd;\n}\n@media (max-width: 991px) {\n  .text-center-mobile {\n    text-align: center !important;\n  }\n}\na,\nbutton {\n  -webkit-transition: all 0.2s ease-out;\n  -moz-transition: all 0.2s ease-out;\n  transition: all 0.2s ease-out;\n}\na i.fa,\nbutton i.fa {\n  margin: 0 5px;\n}\n.clickable {\n  cursor: pointer !important;\n}\n.required {\n  color: #2b7551;\n}\n.accent {\n  color: #2b7551;\n}\n.text-uppercase {\n  text-transform: uppercase;\n  letter-spacing: 0.1em;\n}\n.list-style-none {\n  list-style: none;\n}\n.pages {\n  text-align: center;\n}\n#map {\n  height: 500px;\n  border-top: solid 1px #cdcdcd;\n  border-bottom: solid 1px #cdcdcd;\n}\n.btn-ghost {\n  color: #2b7551;\n  background-color: transparent;\n  border-color: #2b7551;\n}\n.btn-ghost:hover,\n.btn-ghost:focus,\n.btn-ghost:active,\n.btn-ghost.active,\n.open .dropdown-toggle.btn-ghost {\n  color: #2b7551;\n  background-color: rgba(0, 0, 0, 0);\n  border-color: #1b4832;\n}\n.btn-ghost:active,\n.btn-ghost.active,\n.open .dropdown-toggle.btn-ghost {\n  background-image: none;\n}\n.btn-ghost.disabled,\n.btn-ghost[disabled],\nfieldset[disabled] .btn-ghost,\n.btn-ghost.disabled:hover,\n.btn-ghost[disabled]:hover,\nfieldset[disabled] .btn-ghost:hover,\n.btn-ghost.disabled:focus,\n.btn-ghost[disabled]:focus,\nfieldset[disabled] .btn-ghost:focus,\n.btn-ghost.disabled:active,\n.btn-ghost[disabled]:active,\nfieldset[disabled] .btn-ghost:active,\n.btn-ghost.disabled.active,\n.btn-ghost[disabled].active,\nfieldset[disabled] .btn-ghost.active {\n  background-color: transparent;\n  border-color: #2b7551;\n}\n.btn-ghost .badge {\n  color: transparent;\n  background-color: #2b7551;\n}\n.btn-ghost:hover,\n.btn-ghost:focus,\n.btn-ghost:active,\n.btn-ghost.active,\n.open .dropdown-toggle.btn-ghost {\n  color: #fff;\n  background-color: #2b7551;\n  border-color: #2b7551;\n}\n.btn-white {\n  color: #ffffff;\n  background-color: transparent;\n  border-color: #ffffff;\n}\n.btn-white:hover,\n.btn-white:focus,\n.btn-white:active,\n.btn-white.active,\n.open .dropdown-toggle.btn-white {\n  color: #ffffff;\n  background-color: rgba(0, 0, 0, 0);\n  border-color: #e0e0e0;\n}\n.btn-white:active,\n.btn-white.active,\n.open .dropdown-toggle.btn-white {\n  background-image: none;\n}\n.btn-white.disabled,\n.btn-white[disabled],\nfieldset[disabled] .btn-white,\n.btn-white.disabled:hover,\n.btn-white[disabled]:hover,\nfieldset[disabled] .btn-white:hover,\n.btn-white.disabled:focus,\n.btn-white[disabled]:focus,\nfieldset[disabled] .btn-white:focus,\n.btn-white.disabled:active,\n.btn-white[disabled]:active,\nfieldset[disabled] .btn-white:active,\n.btn-white.disabled.active,\n.btn-white[disabled].active,\nfieldset[disabled] .btn-white.active {\n  background-color: transparent;\n  border-color: #ffffff;\n}\n.btn-white .badge {\n  color: transparent;\n  background-color: #ffffff;\n}\n.btn-white:hover,\n.btn-white:focus,\n.btn-white:active,\n.btn-white.active,\n.open .dropdown-toggle.btn-white {\n  color: #ffffff;\n  background-color: #fff;\n  border-color: #fff;\n}\n.icon {\n  display: inline-block;\n  width: 60px;\n  height: 60px;\n  line-height: 60px;\n  border-radius: 30px;\n  border: solid 1px #2b7551;\n  color: #2b7551;\n  -webkit-transition: all 0.2s ease-out;\n  -moz-transition: all 0.2s ease-out;\n  transition: all 0.2s ease-out;\n  font-size: 30px;\n  margin: 0 auto 30px;\n  text-align: center;\n}\n.icon.brand-secondary {\n  border-color: #9fb1bc;\n  color: #9fb1bc;\n}\n.icon.brand-terciary {\n  border-color: #6e8898;\n  color: #6e8898;\n}\n.icon.brand-four {\n  border-color: #1c3738;\n  color: #1c3738;\n}\n/*\n\n=====================\nINTRO\n=====================\n\n*/\n.text-intro {\n  text-align: center;\n  color: #ffffff;\n}\n.text-intro h1 {\n  font-weight: 700;\n}\n.text-intro a {\n  color: #fff;\n  text-decoration: underline;\n}\n.text-intro h1,\n.text-intro h2,\n.text-intro h3,\n.text-intro h4 {\n  color: #ffffff;\n}\n.text-intro span {\n  color: #2b7551;\n}\n@media (min-width: 1200px) {\n  .text-intro {\n    background: rgba(0, 0, 0, 0) linear-gradient(135deg, #8ec64e 0%, #41aba0 100%) repeat scroll 0 0;\n\n  }\n}\n@media (max-width: 1199px) {\n  .text-intro {\n    background: #6bb2b5;\n  }\n}\n/*\n\n=====================\nSERVICES / INTEGRATIONS\n=====================\n\n*/\n.services {\n  margin-top: 80px;\n  text-align: center;\n}\n.services .services-heading {\n  text-transform: uppercase;\n  letter-spacing: 0.1em;\n  font-size: 18px;\n  font-weight: 400;\n  color: #999999;\n  margin-bottom: 40px;\n}\n.services .heading {\n  font-size: 18px;\n  font-weight: 700;\n  margin-bottom: 20px;\n  text-align: center;\n}\n.services .heading:after {\n  content: \" \";\n  display: block;\n  width: 100px;\n  height: 1px;\n  margin: 20px auto 20px;\n  background: #2b7551;\n}\n.services p {\n  font-size: 14px;\n  line-height: 1.5;\n  margin-bottom: 60px;\n  color: #999999;\n}\n/*\n\n=====================\nCUSTOMERS\n=====================\n\n*/\n.customer {\n  text-align: center;\n}\n.customer img {\n  display: inline-block;\n  margin-top: 10px;\n  margin-bottom: 10px;\n  -webkit-filter: grayscale(100%);\n  filter: grayscale(100%);\n}\n.customer img:hover {\n  -webkit-filter: grayscale(0);\n  filter: grayscale(0);\n}\n/*\n\n=====================\nSIGN UP FORM\n=====================\n\n*/\n@media (max-width: 991px) {\n  .sign-up-form .form-control {\n    margin-bottom: 20px;\n  }\n  .sign-up-form .btn {\n    margin-bottom: 20px;\n  }\n}\n@media (min-width: 768px) {\n  .sign-up-form .form-control {\n    width: 350px;\n  }\n}\n/*\n\n=====================\nEKKO LIGHTBOX\n=====================\n\n*/\n.ekko-lightbox-container {\n  position: relative;\n}\n.ekko-lightbox-nav-overlay {\n  position: absolute;\n  top: 0;\n  left: 0;\n  z-index: 100;\n  width: 100%;\n  height: 100%;\n}\n.ekko-lightbox-nav-overlay a {\n  z-index: 100;\n  display: block;\n  width: 49%;\n  height: 100%;\n  font-size: 30px;\n  color: #fff;\n  opacity: 0;\n  text-decoration: none !important;\n  -webkit-transition: opacity 0.5s;\n  -moz-transition: opacity 0.5s;\n  -o-transition: opacity 0.5s;\n  transition: opacity 0.5s;\n}\n.ekko-lightbox-nav-overlay a:empty {\n  width: 49%;\n  color: transparent;\n}\n.ekko-lightbox a:hover,\na:focus,\na:active {\n  text-decoration: none;\n  opacity: 1;\n  color: #fff;\n}\n.ekko-lightbox .glyphicon-chevron-left {\n  left: 0;\n  float: left;\n  padding-left: 15px;\n  text-align: left;\n}\n.ekko-lightbox .glyphicon-chevron-right {\n  right: 0;\n  float: right;\n  padding-right: 15px;\n  text-align: right;\n}\n.ekko-lightbox .modal-footer {\n  text-align: left;\n}\n.owl-carousel .owl-controls .owl-page.active span,\n.owl-theme .owl-controls .owl-page.active span,\n.owl-carousel .owl-controls.clickable .owl-page:hover span,\n.owl-theme .owl-controls.clickable .owl-page:hover span {\n  background: #2b7551;\n}\n.owl-carousel .owl-controls .owl-buttons,\n.owl-theme .owl-controls .owl-buttons {\n  position: absolute;\n  top: 5px;\n  right: 0;\n}\n.owl-carousel .owl-controls .owl-buttons div,\n.owl-theme .owl-controls .owl-buttons div {\n  width: 26px;\n  height: 26px;\n  line-height: 25px;\n  margin: 0 5px 0 0;\n  font-size: 18px;\n  color: #2b7551;\n  padding: 0;\n  background: #fff;\n  border-radius: 13px;\n  vertical-align: middle;\n  text-align: center;\n  opacity: 1;\n  filter: alpha(opacity=100);\n}\n.testimonials {\n  padding: 0;\n  margin-bottom: 40px;\n}\n.testimonials .item {\n  list-style-type: none;\n  margin: 0 5px;\n  background: #fff;\n  padding-bottom: 60px;\n  -webkit-box-sizing: border-box;\n  -moz-box-sizing: border-box;\n  box-sizing: border-box;\n}\n.testimonials .item .testimonial {\n  position: relative;\n  padding: 20px;\n}\n.testimonials .item .testimonial:before,\n.testimonials .item .testimonial:after {\n  content: \" \";\n  display: table;\n}\n.testimonials .item .testimonial:after {\n  clear: both;\n}\n.testimonials .item .testimonial .text {\n  color: #999999;\n  margin-bottom: 50px;\n  font-size: 14px;\n  font-weight: 400;\n}\n.testimonials .item .testimonial .bottom {\n  position: absolute;\n  left: 0;\n  bottom: 0;\n  width: 100%;\n  -webkit-box-sizing: border-box;\n  -moz-box-sizing: border-box;\n  box-sizing: border-box;\n  padding: 20px;\n  height: 50px;\n}\n.testimonials .item .testimonial .bottom .testimonial-icon {\n  display: inline-block;\n  width: 30px;\n  height: 30px;\n  line-height: 30px;\n  border-radius: 15px;\n  color: #6e8898;\n  font-size: 40px;\n  float: left;\n  text-align: center;\n}\n.testimonials .item .testimonial .name-picture {\n  float: right;\n  width: 80%;\n  text-align: right;\n}\n.testimonials .item .testimonial .name-picture h5 {\n  font-size: 16px;\n  text-transform: uppercase;\n  letter-spacing: 0.08em;\n}\n.testimonials .item .testimonial .name-picture p {\n  color: #999999;\n  margin: 0;\n  font-size: 14px;\n}\n.testimonials .item .testimonial .name-picture img {\n  float: right;\n  width: 60px;\n  border-radius: 30px;\n  margin-left: 10px;\n}\n.box-simple {\n  text-align: center;\n  margin-bottom: 48px;\n}\n.box-simple h3 {\n  font-weight: normal;\n  font-size: 24px;\n  line-height: 1.5;\n  color: #555555;\n  font-weight: 400;\n}\n.box-simple h3 a {\n  color: #555555;\n}\n.box-simple p {\n  color: #999999;\n}\n.box-simple:hover .icon {\n  -webkit-transform: scale(1.1, 1.1);\n  -ms-transform: scale(1.1, 1.1);\n  transform: scale(1.1, 1.1);\n}\n.box-simple:hover .icon i {\n  -webkit-transform: scale(1, 1);\n  -ms-transform: scale(1, 1);\n  transform: scale(1, 1);\n}\n.box-simple.box-white {\n  padding: 20px;\n  border: dotted 1px #999999;\n}\n.box-simple.box-white .icon {\n  color: #555555;\n  border-color: transparent;\n  font-size: 70px;\n}\n.box-simple.box-dark {\n  padding: 20px;\n  border: dotted 1px #999999;\n  background: #555555;\n  color: #fff;\n}\n.box-simple.box-dark .icon {\n  color: #f7f7f7;\n  border-color: transparent;\n  font-size: 70px;\n}\n.box-simple.box-dark h3 {\n  color: #fff;\n}\n.box-simple.box-dark h3 a {\n  color: #fff;\n}\n.box-simple.box-dark p {\n  color: #fff;\n}\n.box-image {\n  position: relative;\n  overflow: hidden;\n  text-align: center;\n  margin: 15px 0;\n}\n.box-image .bg {\n  position: absolute;\n  top: auto;\n  bottom: 0;\n  width: 100%;\n  height: 100%;\n  opacity: 0;\n  filter: alpha(opacity=0);\n  background: #2b7551;\n}\n.box-image .name {\n  position: absolute;\n  width: 100%;\n  height: 50%;\n  bottom: 0;\n  -webkit-transform: translate(0, 100%);\n  -ms-transform: translate(0, 100%);\n  transform: translate(0, 100%);\n  -webkit-transition: all 0.2s ease-out;\n  -moz-transition: all 0.2s ease-out;\n  transition: all 0.2s ease-out;\n  color: #fff;\n  padding: 0 20px;\n}\n.box-image .name h3 {\n  color: #fff;\n  text-transform: uppercase;\n  font-size: 24px;\n  letter-spacing: 0.08em;\n}\n.box-image .name h3 a {\n  color: #fff;\n  text-decoration: none;\n}\n.box-image .text {\n  position: absolute;\n  width: 100%;\n  height: 50%;\n  top: 0;\n  -webkit-transform: translate(0, -150%);\n  -ms-transform: translate(0, -150%);\n  transform: translate(0, -150%);\n  -webkit-transition: all 0.2s ease-out;\n  -moz-transition: all 0.2s ease-out;\n  transition: all 0.2s ease-out;\n  color: #fff;\n  padding: 0 20px;\n}\n.box-image:hover .bg {\n  opacity: 0.7;\n  filter: alpha(opacity=70);\n}\n.box-image:hover .name {\n  position: absolute;\n  -webkit-transform: translate(0, -75%);\n  -ms-transform: translate(0, -75%);\n  transform: translate(0, -75%);\n}\n.box-image:hover .text {\n  position: absolute;\n  -webkit-transform: translate(0, 100%);\n  -ms-transform: translate(0, 100%);\n  transform: translate(0, 100%);\n}\n.box-image-text {\n  position: relative;\n  background: #fff;\n  overflow: hidden;\n  text-align: center;\n  margin: 15px 0;\n}\n.box-image-text .top {\n  position: relative;\n  margin-bottom: 10px;\n}\n.box-image-text .top .bg {\n  position: absolute;\n  top: auto;\n  bottom: 0;\n  width: 100%;\n  height: 100%;\n  opacity: 0;\n  filter: alpha(opacity=0);\n  background: #fff;\n}\n.box-image-text .top .logo {\n  width: 100%;\n  position: absolute;\n  text-align: center;\n  top: 50%;\n  -webkit-transform: translate(0, -50%);\n  -ms-transform: translate(0, -50%);\n  transform: translate(0, -50%);\n}\n.box-image-text .top .name {\n  position: absolute;\n  width: 100%;\n  height: 50%;\n  bottom: 0;\n  -webkit-transform: translate(0, 100%);\n  -ms-transform: translate(0, 100%);\n  transform: translate(0, 100%);\n  -webkit-transition: all 0.2s ease-out;\n  -moz-transition: all 0.2s ease-out;\n  transition: all 0.2s ease-out;\n  color: #fff;\n  padding: 0 20px;\n}\n.box-image-text .top .name h3 {\n  color: #fff;\n  text-transform: uppercase;\n  font-size: 24px;\n  letter-spacing: 0.08em;\n}\n.box-image-text .top .name h3 a {\n  color: #fff;\n  text-decoration: none;\n}\n.box-image-text .top .name h4 {\n  color: #fff;\n  text-transform: uppercase;\n  font-size: 24px;\n  letter-spacing: 0.08em;\n}\n.box-image-text .top .name h4 a {\n  color: #fff;\n  text-decoration: none;\n}\n.box-image-text .top .text {\n  position: absolute;\n  width: 100%;\n  height: 50%;\n  top: 0;\n  -webkit-transform: translate(0, -150%);\n  -ms-transform: translate(0, -150%);\n  transform: translate(0, -150%);\n  -webkit-transition: all 0.2s ease-out;\n  -moz-transition: all 0.2s ease-out;\n  transition: all 0.2s ease-out;\n  color: #fff;\n  padding: 0 20px;\n}\n.box-image-text .content {\n  padding: 15px 15px 0 15px;\n}\n.box-image-text .content h3,\n.box-image-text .content h4 {\n  text-transform: uppercase;\n  line-height: 1.5;\n  color: #555555;\n  font-weight: 800;\n  letter-spacing: 0.08em;\n}\n.box-image-text .content p {\n  color: #999999;\n}\n.box-image-text.bg-visible .bg {\n  opacity: 0.8;\n  filter: alpha(opacity=80);\n}\n.box-image-text:hover .bg {\n  opacity: 0.7;\n  filter: alpha(opacity=70);\n}\n.box-image-text:hover .name {\n  position: absolute;\n  -webkit-transform: translate(0, -75%);\n  -ms-transform: translate(0, -75%);\n  transform: translate(0, -75%);\n}\n.box-image-text:hover .text {\n  position: absolute;\n  -webkit-transform: translate(0, 100%);\n  -ms-transform: translate(0, 100%);\n  transform: translate(0, 100%);\n}\n/*\n\n=====================\nNAVBAR\n=====================\n\n*/\n.header {\n  width: 100%;\n}\n.navbar {\n  font-weight: 700;\n  box-shadow: 0 1px 5px #666;\n}\n@media (min-width: 768px) {\n  .navbar ul.nav > li > a {\n    border-top: solid 5px transparent;\n    padding-top: 23px;\n  }\n  .navbar ul.nav > li > a:hover {\n    border-top-color: #2b7551;\n  }\n  .navbar ul.nav > li.active > a,\n  .navbar ul.nav > li.open > a {\n    text-decoration: none !important;\n    border-top-color: #2b7551;\n  }\n}\n.navbar-toggle {\n  text-transform: uppercase;\n  letter-spacing: 0.1em;\n  color: #6e8898;\n}\nul.dropdown-menu li a {\n  -webkit-transition: all 0.2s ease-out;\n  -moz-transition: all 0.2s ease-out;\n  transition: all 0.2s ease-out;\n}\nul.dropdown-menu li a:hover {\n  -webkit-transition: all 0.2s ease-out;\n  -moz-transition: all 0.2s ease-out;\n  transition: all 0.2s ease-out;\n}\n#login-modal {\n  overflow: hidden;\n}\n#login-modal .modal-header h4 {\n  text-transform: uppercase;\n}\n#login-modal form {\n  margin-bottom: 24px;\n}\n#login-modal a {\n  color: #2b7551;\n}\n#login-modal p {\n  font-weight: 300;\n  margin-bottom: 24px;\n  font-size: 15px;\n}\n.modal-backdrop {\n  z-index: 1035;\n}\n.footer__copyright {\n  background: #1c3738;\n  color: #ccc;\n  padding: 20px 0;\n  font-size: 14px;\n  line-height: 28px;\n}\n.footer__copyright p {\n  margin: 0;\n}\n@media (max-width: 991px) {\n  .footer__copyright p {\n    float: none !important;\n    text-align: center;\n    margin-bottom: 10px;\n  }\n}\n/*\n\n=====================\nCOPYRIGHT\n=====================\n\n*/\n.copyright {\n  margin-top: 40px;\n  color: #999999;\n}\n.copyright p.credit {\n  text-align: right;\n}\n.copyright p.credit a {\n  color: #999999;\n}\n@media (max-width: 991px) {\n  .copyright p.credit {\n    text-align: center !important;\n  }\n}\n@media (min-width: 1200px) {\n  .copyright {\n    margin-top: 60px;\n  }\n}\n@media (max-width: 991px) {\n  .copyright {\n    text-align: center !important;\n  }\n}\n/*\n\n=====================\nSTYLE SWITCHER FOR DEMO\n=====================\n\n*/\n#style-switch-button {\n  position: fixed;\n  top: 120px;\n  left: 0px;\n  border-radius: 0;\n  z-index: 2;\n}\n#style-switch {\n  -webkit-box-sizing: border-box;\n  -moz-box-sizing: border-box;\n  box-sizing: border-box;\n  width: 300px;\n  padding: 20px;\n  position: fixed;\n  top: 160px;\n  left: 0;\n  background: #fff;\n  border: solid 1px #cdcdcd;\n  z-index: 2000;\n}\n#style-switch h4 {\n  color: #555555;\n}\n/* ========================================= */\n/* THEMING OF BOOTSTRAP COMPONENTS           */\n/* ========================================= */\n/* nav */\n.nav {\n  margin-bottom: 0;\n  padding-left: 0;\n  list-style: none;\n}\n.nav > li > a {\n  padding: 10px 15px;\n}\n.nav > li > a:hover,\n.nav > li > a:focus {\n  background-color: #cdcdcd;\n}\n.nav > li.disabled > a {\n  color: #999999;\n}\n.nav > li.disabled > a:hover,\n.nav > li.disabled > a:focus {\n  color: #999999;\n}\n.nav .open > a,\n.nav .open > a:hover,\n.nav .open > a:focus {\n  background-color: #cdcdcd;\n  border-color: #2b7551;\n}\n.nav-tabs {\n  border-bottom: 1px solid #dddddd;\n}\n.nav-tabs > li > a {\n  line-height: 1.55;\n  border-radius: 2px 2px 0 0;\n}\n.nav-tabs > li > a:hover {\n  border-color: #cdcdcd #cdcdcd #dddddd;\n}\n.nav-tabs > li.active > a,\n.nav-tabs > li.active > a:hover,\n.nav-tabs > li.active > a:focus {\n  color: #555555;\n  background-color: #ffffff;\n  border: 1px solid #dddddd;\n}\n.nav-pills > li > a {\n  border-radius: 0;\n}\n.nav-pills > li.active > a,\n.nav-pills > li.active > a:hover,\n.nav-pills > li.active > a:focus {\n  color: #ffffff;\n  background-color: #2b7551;\n}\n.nav-tabs-justified > li > a {\n  border-radius: 2px;\n}\n.nav-tabs-justified > .active > a,\n.nav-tabs-justified > .active > a:hover,\n.nav-tabs-justified > .active > a:focus {\n  border: 1px solid #dddddd;\n}\n@media (min-width: 768px) {\n  .nav-tabs-justified > li > a {\n    border-bottom: 1px solid #dddddd;\n    border-radius: 2px 2px 0 0;\n  }\n  .nav-tabs-justified > .active > a,\n  .nav-tabs-justified > .active > a:hover,\n  .nav-tabs-justified > .active > a:focus {\n    border-bottom-color: #ffffff;\n  }\n}\n/* navbar */\n.navbar {\n  font-family: \"Open Sans\", Helvetica, Arial, sans-serif;\n  min-height: 80px;\n  margin-bottom: 0;\n  border-top: none;\n  border-bottom: none;\n}\n@media (min-width: 768px) {\n  .navbar {\n    border-radius: 0;\n  }\n}\n.navbar-collapse {\n  max-height: 340px;\n  overflow-x: visible;\n  padding-right: 15px;\n  padding-left: 15px;\n}\n.navbar-collapse.in {\n  overflow-y: auto;\n}\n@media (min-width: 768px) and (max-width: 991px) {\n  .navbar-collapse {\n    font-size: 14px;\n  }\n}\n@media (min-width: 768px) {\n  .navbar-collapse {\n    width: auto;\n    border-top: 0;\n    box-shadow: none;\n  }\n  .navbar-collapse.collapse {\n    display: block !important;\n    height: auto !important;\n    padding-bottom: 0;\n    overflow: visible !important;\n  }\n  .navbar-collapse.in {\n    overflow-y: visible;\n  }\n  .navbar-collapse.right {\n    float: right;\n  }\n  .navbar-fixed-top .navbar-collapse,\n  .navbar-static-top .navbar-collapse,\n  .navbar-fixed-bottom .navbar-collapse {\n    padding-left: 0;\n    padding-right: 0;\n  }\n}\n.container > .navbar-header,\n.container-fluid > .navbar-header,\n.container > .navbar-collapse,\n.container-fluid > .navbar-collapse {\n  margin-right: -15px;\n  margin-left: -15px;\n}\n@media (min-width: 768px) {\n  .container > .navbar-header,\n  .container-fluid > .navbar-header,\n  .container > .navbar-collapse,\n  .container-fluid > .navbar-collapse {\n    margin-right: 0;\n    margin-left: 0;\n  }\n}\n.navbar-brand {\n  float: left;\n  padding: 10px 15px;\n  font-size: 20px;\n  line-height: 24px;\n  height: 80px;\n}\n.navbar-brand:hover,\n.navbar-brand:focus {\n  text-decoration: none;\n}\n@media (min-width: 768px) {\n  .navbar > .container .navbar-brand,\n  .navbar > .container-fluid .navbar-brand {\n    margin-left: -15px;\n  }\n}\n.navbar-toggle {\n  padding: 9px 10px !important;\n  margin-right: 15px;\n  border-radius: 2px;\n}\n.navbar-nav {\n  margin: 14px -15px;\n}\n.navbar-nav > li > a {\n  padding-top: 10px;\n  padding-bottom: 10px;\n  line-height: 24px;\n}\n@media (max-width: 767px) {\n  .navbar-nav .open .dropdown-menu > li > a,\n  .navbar-nav .open .dropdown-menu .dropdown-header {\n    padding: 5px 15px 5px 25px;\n  }\n  .navbar-nav .open .dropdown-menu > li > a {\n    line-height: 24px;\n  }\n  .navbar-nav .open .dropdown-menu > li > a:hover,\n  .navbar-nav .open .dropdown-menu > li > a:focus {\n    background-image: none;\n  }\n}\n@media (min-width: 768px) {\n  .navbar-nav {\n    margin: 0 auto;\n    display: table;\n    table-layout: fixed;\n    float: left;\n  }\n  .navbar-nav > li {\n    float: left;\n  }\n  .navbar-nav > li > a {\n    padding-top: 28px;\n    padding-bottom: 28px;\n  }\n  .navbar-nav.navbar-right:last-child {\n    margin-right: -15px;\n  }\n}\n.navbar-form {\n  margin-left: -15px;\n  margin-right: -15px;\n  padding: 10px 15px;\n  border: none;\n  margin-top: 21px;\n  margin-bottom: 21px;\n}\n@media (max-width: 767px) {\n  .navbar-form .form-group {\n    margin-bottom: 5px;\n  }\n}\n.navbar-btn {\n  margin-top: 21px;\n  margin-bottom: 21px;\n}\n.navbar-btn.btn-sm {\n  margin-top: 23.5px;\n  margin-bottom: 23.5px;\n}\n.navbar-btn.btn-xs {\n  margin-top: 29px;\n  margin-bottom: 29px;\n}\n.navbar-text {\n  margin-top: 28px;\n  margin-bottom: 28px;\n}\n@media (min-width: 768px) {\n  .navbar-text {\n    float: left;\n    margin-left: 15px;\n    margin-right: 15px;\n  }\n  .navbar-text.navbar-right:last-child {\n    margin-right: 0;\n  }\n}\n.navbar-default {\n  background-color: #ffffff;\n  border-bottom-color: transparent;\n}\n.navbar-default .navbar-brand {\n  color: #6e8898;\n}\n.navbar-default .navbar-brand:hover,\n.navbar-default .navbar-brand:focus {\n  color: #586e7b;\n  background-color: transparent;\n}\n.navbar-default .navbar-text {\n  color: #777777;\n}\n.navbar-default .navbar-nav > li > a {\n  color: #6e8898;\n}\n.navbar-default .navbar-nav > li > a:hover,\n.navbar-default .navbar-nav > li > a:focus {\n  color: #555555;\n  background-color: transparent;\n}\n.navbar-default .navbar-nav > .active > a,\n.navbar-default .navbar-nav > .active > a:hover,\n.navbar-default .navbar-nav > .active > a:focus {\n  color: #555555;\n  background-color: transparent;\n}\n.navbar-default .navbar-nav > .disabled > a,\n.navbar-default .navbar-nav > .disabled > a:hover,\n.navbar-default .navbar-nav > .disabled > a:focus {\n  color: #cccccc;\n  background-color: transparent;\n}\n.navbar-default .navbar-toggle {\n  border-color: transparent;\n}\n.navbar-default .navbar-toggle:hover,\n.navbar-default .navbar-toggle:focus {\n  background-color: transparent;\n}\n.navbar-default .navbar-toggle .icon-bar {\n  background-color: #6e8898;\n}\n.navbar-default .navbar-collapse {\n  border-color: transparent;\n}\n.navbar-default .navbar-nav > .open > a,\n.navbar-default .navbar-nav > .open > a:hover,\n.navbar-default .navbar-nav > .open > a:focus {\n  background-color: transparent;\n  color: #555555;\n}\n@media (max-width: 767px) {\n  .navbar-default .navbar-nav .open .dropdown-menu > li > a {\n    color: #6e8898;\n  }\n  .navbar-default .navbar-nav .open .dropdown-menu > li > a:hover,\n  .navbar-default .navbar-nav .open .dropdown-menu > li > a:focus {\n    color: #555555;\n    background-color: transparent;\n  }\n  .navbar-default .navbar-nav .open .dropdown-menu > .active > a,\n  .navbar-default .navbar-nav .open .dropdown-menu > .active > a:hover,\n  .navbar-default .navbar-nav .open .dropdown-menu > .active > a:focus {\n    color: #555555;\n    background-color: transparent;\n  }\n  .navbar-default .navbar-nav .open .dropdown-menu > .disabled > a,\n  .navbar-default .navbar-nav .open .dropdown-menu > .disabled > a:hover,\n  .navbar-default .navbar-nav .open .dropdown-menu > .disabled > a:focus {\n    color: #cccccc;\n    background-color: transparent;\n  }\n}\n.navbar-default .navbar-link {\n  color: #6e8898;\n}\n.navbar-default .navbar-link:hover {\n  color: #555555;\n}\n/* dropdowns */\n.dropdown-menu {\n  z-index: 1000;\n  font-size: 14px;\n  background-color: #ffffff;\n  border: 1px solid #cccccc;\n  border: 1px solid rgba(0, 0, 0, 0.15);\n  border-radius: 2px;\n}\n.dropdown-menu .divider {\n  height: 1px;\n  margin: 11px 0;\n  overflow: hidden;\n  background-color: #e5e5e5;\n}\n.dropdown-menu > li > a {\n  line-height: 1.55;\n  color: #555555;\n}\n.dropdown-menu > li > a:hover,\n.dropdown-menu > li > a:focus {\n  color: #262626;\n  background-color: #f5f5f5;\n}\n.dropdown-menu > .active > a,\n.dropdown-menu > .active > a:hover,\n.dropdown-menu > .active > a:focus {\n  color: #ffffff;\n  background-color: #2b7551;\n}\n/* modal */\n.modal-content {\n  background-color: #ffffff;\n  border: 1px solid #999999;\n  border: 1px solid rgba(0, 0, 0, 0.2);\n  border-radius: 0;\n}\n/* scaffolding */\nbody {\n  font-family: \"Open Sans\", Helvetica, Arial, sans-serif;\n  font-size: 16px;\n  line-height: 1.55;\n  color: #000000;\n  background-color: #ffffff;\n}\na {\n  color: #2b7551;\n  text-decoration: none;\n}\na:hover,\na:focus {\n  color: #163d2a;\n  text-decoration: underline;\n}\na:focus {\n  outline: thin dotted;\n  outline: 5px auto -webkit-focus-ring-color;\n  outline-offset: -2px;\n}\n.img-rounded {\n  border-radius: 0;\n}\nhr {\n  margin-top: 24px;\n  margin-bottom: 24px;\n  border: 0;\n  border-top: 1px solid #cdcdcd;\n}\n.progress {\n  overflow: hidden;\n  height: 24px;\n  margin-bottom: 24px;\n  background-color: #f5f5f5;\n  border-radius: 2px;\n  -webkit-box-shadow: inset 0 0 0 rgba(0, 0, 0, 0);\n  box-shadow: inset 0 0 0 rgba(0, 0, 0, 0);\n}\n.progress-bar {\n  float: left;\n  width: 0%;\n  height: 100%;\n  font-size: 14px;\n  line-height: 24px;\n  text-align: center;\n  -webkit-box-shadow: inset 0 0 0 rgba(0, 0, 0, 0);\n  box-shadow: inset 0 0 0 rgba(0, 0, 0, 0);\n  -webkit-transition: width 0.6s ease;\n  transition: width 0.6s ease;\n}\n/* breadcrumbs */\n.breadcrumb {\n  padding: 8px 0;\n  margin-bottom: 24px;\n  background-color: transparent;\n  border-radius: 0;\n  text-align: center;\n}\n.breadcrumb > li + li:before {\n  content: \"/\\A0\";\n  color: #cccccc;\n}\n.breadcrumb > .active {\n  color: #999999;\n}\n.breadcrumb a {\n  color: #2b7551;\n}\n@media (max-width: 991px) {\n  .breadcrumb {\n    padding: 8px 0;\n    text-align: center;\n  }\n}\n/* buttons  */\n.btn {\n  font-weight: 400;\n  font-family: \"Open Sans\", Helvetica, Arial, sans-serif;\n  padding: 6px 12px;\n  font-size: 16px;\n  line-height: 1.55;\n  border-radius: ;\n}\n.btn-primary {\n  color: #ffffff;\n  background-color: #2b7551;\n  border-color: #2b7551;\n}\n.btn-primary:hover,\n.btn-primary:focus,\n.btn-primary:active,\n.btn-primary.active,\n.open .dropdown-toggle.btn-primary {\n  color: #ffffff;\n  background-color: #20573c;\n  border-color: #1b4832;\n}\n.btn-primary:active,\n.btn-primary.active,\n.open .dropdown-toggle.btn-primary {\n  background-image: none;\n}\n.btn-primary.disabled,\n.btn-primary[disabled],\nfieldset[disabled] .btn-primary,\n.btn-primary.disabled:hover,\n.btn-primary[disabled]:hover,\nfieldset[disabled] .btn-primary:hover,\n.btn-primary.disabled:focus,\n.btn-primary[disabled]:focus,\nfieldset[disabled] .btn-primary:focus,\n.btn-primary.disabled:active,\n.btn-primary[disabled]:active,\nfieldset[disabled] .btn-primary:active,\n.btn-primary.disabled.active,\n.btn-primary[disabled].active,\nfieldset[disabled] .btn-primary.active {\n  background-color: #2b7551;\n  border-color: #2b7551;\n}\n.btn-primary .badge {\n  color: #2b7551;\n  background-color: #ffffff;\n}\n.btn-transparent {\n  color: #555555;\n  background-color: transparent;\n  border-color: #555555;\n}\n.btn-transparent:hover,\n.btn-transparent:focus,\n.btn-transparent:active,\n.btn-transparent.active,\n.open .dropdown-toggle.btn-transparent {\n  color: #555555;\n  background-color: rgba(0, 0, 0, 0);\n  border-color: #373737;\n}\n.btn-transparent:active,\n.btn-transparent.active,\n.open .dropdown-toggle.btn-transparent {\n  background-image: none;\n}\n.btn-transparent.disabled,\n.btn-transparent[disabled],\nfieldset[disabled] .btn-transparent,\n.btn-transparent.disabled:hover,\n.btn-transparent[disabled]:hover,\nfieldset[disabled] .btn-transparent:hover,\n.btn-transparent.disabled:focus,\n.btn-transparent[disabled]:focus,\nfieldset[disabled] .btn-transparent:focus,\n.btn-transparent.disabled:active,\n.btn-transparent[disabled]:active,\nfieldset[disabled] .btn-transparent:active,\n.btn-transparent.disabled.active,\n.btn-transparent[disabled].active,\nfieldset[disabled] .btn-transparent.active {\n  background-color: transparent;\n  border-color: #555555;\n}\n.btn-transparent .badge {\n  color: transparent;\n  background-color: #555555;\n}\n.btn-transparent:hover,\n.btn-transparent:focus,\n.btn-transparent:active,\n.btn-transparent.active {\n  background: #ffffff;\n  color: #2b7551;\n}\n.btn-lg {\n  padding: 10px 16px;\n  font-size: 20px;\n  line-height: 1.33;\n  border-radius: 2px;\n}\n.btn-sm {\n  padding: 5px 10px;\n  font-size: 14px;\n  line-height: 1.5;\n  border-radius: ;\n}\n.btn-xs {\n  padding: 1px 5px;\n  font-size: 14px;\n  line-height: 1.5;\n  border-radius: ;\n}\n/* dropdowns */\n.dropdown-menu > li > a {\n  padding: 8px 20px;\n}\n/* labels */\n.label {\n  font-family: \"Open Sans\", Helvetica, Arial, sans-serif;\n  font-weight: normal;\n  text-transform: uppercase;\n}\n/* forms.less */\nlabel {\n  font-weight: normal;\n}\n.form-control {\n  display: block;\n  width: 100%;\n  height: 38px;\n  padding: 6px 12px;\n  font-size: 16px;\n  line-height: 1.55;\n  color: #555555;\n  background-color: #ffffff;\n  background-image: none;\n  border: 1px solid #cccccc;\n  border-radius: 2px;\n  -webkit-box-shadow: none;\n  box-shadow: none;\n}\n.form-control::-moz-placeholder {\n  color: #999999;\n  opacity: 1;\n}\n.form-control:-ms-input-placeholder {\n  color: #999999;\n}\n.form-control::-webkit-input-placeholder {\n  color: #999999;\n}\n.form-control:focus {\n  border-color: #2b7551;\n  outline: 0;\n  -webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(43, 117, 81, 0.6);\n  box-shadow: inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(43, 117, 81, 0.6);\n}\n.form-group {\n  margin-bottom: 20px;\n}\n/* pager*/\n.pager {\n  margin: 24px 0;\n  border-top: solid 1px #cdcdcd;\n  padding-top: 24px;\n  text-transform: uppercase;\n  letter-spacing: 0.1em;\n  font-size: 14px;\n  font-family: \"Open Sans\", Helvetica, Arial, sans-serif;\n  font-weight: bold;\n}\n.pager li {\n  display: inline;\n}\n.pager li > a,\n.pager li > span {\n  background-color: #ffffff;\n  border: 1px solid #2b7551;\n  border-radius: 2px;\n}\n.pager li > a:hover,\n.pager li > a:focus {\n  text-decoration: none;\n  color: #fff;\n  background-color: #2b7551;\n}\n.pager .disabled > a,\n.pager .disabled > a:hover,\n.pager .disabled > a:focus,\n.pager .disabled > span {\n  color: #999999;\n  background-color: #ffffff;\n  border-color: #ddd;\n}\n/* pagination */\n.pagination {\n  margin: 24px 0;\n  font-family: \"Open Sans\", Helvetica, Arial, sans-serif;\n  border-radius: 0;\n}\n.pagination > li > a,\n.pagination > li > span {\n  padding: 6px 12px;\n  line-height: 1.55;\n  text-decoration: none;\n  color: #2b7551;\n  background-color: #ffffff;\n  border: 1px solid #dddddd;\n}\n.pagination > li:first-child > a,\n.pagination > li:first-child > span {\n  margin-left: 0;\n  border-bottom-left-radius: 2px;\n  border-top-left-radius: 2px;\n}\n.pagination > li:last-child > a,\n.pagination > li:last-child > span {\n  border-bottom-right-radius: 2px;\n  border-top-right-radius: 2px;\n}\n.pagination > li > a:hover,\n.pagination > li > span:hover,\n.pagination > li > a:focus,\n.pagination > li > span:focus {\n  color: #2b7551;\n  background-color: #6fca9e;\n  border-color: #dddddd;\n}\n.pagination > .active > a,\n.pagination > .active > span,\n.pagination > .active > a:hover,\n.pagination > .active > span:hover,\n.pagination > .active > a:focus,\n.pagination > .active > span:focus {\n  z-index: 2;\n  color: #ffffff;\n  background-color: #2b7551;\n  border-color: #2b7551;\n}\n.pagination > .disabled > span,\n.pagination > .disabled > span:hover,\n.pagination > .disabled > span:focus,\n.pagination > .disabled > a,\n.pagination > .disabled > a:hover,\n.pagination > .disabled > a:focus {\n  color: #999999;\n  background-color: #ffffff;\n  border-color: #dddddd;\n}\n/* responsive utilities */\n@media (max-width: 767px) {\n  .text-center-xs {\n    text-align: center !important;\n  }\n  .text-center-xs img {\n    display: block;\n    margin-left: auto;\n    margin-right: auto;\n  }\n}\n@media (min-width: 768px) and (max-width: 991px) {\n  .text-center-sm {\n    text-align: center !important;\n  }\n  .text-center-sm img {\n    display: block;\n    margin-left: auto;\n    margin-right: auto;\n  }\n}\n/* type */\nh1,\nh2,\nh3,\nh4,\nh5,\nh6,\n.h1,\n.h2,\n.h3,\n.h4,\n.h5,\n.h6 {\n  font-family: \"Open Sans\", Helvetica, Arial, sans-serif;\n  font-weight: 700;\n  line-height: 1.2;\n  color: #555555;\n}\nh1,\n.h1 {\n  font-size: 48px;\n}\nh2,\n.h2 {\n  font-size: 38px;\n}\nh3,\n.h3 {\n  font-size: 32px;\n  font-weight: 700;\n}\nh4,\n.h4 {\n  font-size: 24px;\n  font-weight: 700;\n}\nh5,\n.h5 {\n  font-size: 16px;\n  font-weight: 700;\n}\nh6,\n.h6 {\n  font-size: 14px;\n  font-weight: 700;\n}\nh1,\n.h1,\nh2,\n.h2,\nh3,\n.h3 {\n  margin-top: 0;\n  margin-bottom: 24px;\n}\np {\n  margin: 0 0 24px;\n}\n.lead {\n  margin-bottom: 24px;\n  font-size: 18px;\n}\n@media (min-width: 768px) {\n  .lead {\n    font-size: 24px;\n  }\n}\n.text-small {\n  font-size: 14px;\n}\n.text-large {\n  font-size: 20px;\n}\n.text-italic {\n  font-style: italic;\n}\n.text-primary {\n  color: #2b7551;\n}\na.text-primary:hover {\n  color: #1d5037;\n}\n.bg-primary {\n  color: #fff;\n  background-color: #2b7551;\n}\na.bg-primary:hover {\n  background-color: #1d5037;\n}\nabbr[title],\nabbr[data-original-title] {\n  border-bottom: 1px dotted #999999;\n}\nblockquote {\n  padding: 12px 24px;\n  margin: 0 0 24px;\n  font-size: 16px;\n  border-left: 5px solid #2b7551;\n}\nblockquote footer,\nblockquote small,\nblockquote .small {\n  display: block;\n  font-size: 80%;\n  line-height: 1.55;\n  color: #999999;\n}\nblockquote footer:before,\nblockquote small:before,\nblockquote .small:before {\n  content: '\\2014   \\A0';\n}\n.blockquote-reverse,\nblockquote.pull-right {\n  border-right: 5px solid #2b7551;\n}\naddress {\n  margin-bottom: 24px;\n  line-height: 1.55;\n}\n\n.panel-default {\n  border-color: #666666;\n}\n.panel-default > .panel-heading {\n  color: #333333;\n  background-color: #ffffff;\n  border-color: #666666;\n}\n.panel-default > .panel-heading + .panel-collapse .panel-body {\n  border-top-color: #666666;\n}\n.panel-default > .panel-footer + .panel-collapse .panel-body {\n  border-bottom-color: #666666;\n}\n.panel-primary {\n  border-color: #2b7551;\n}\n.panel-primary > .panel-heading {\n  color: #ffffff;\n  background-color: #2b7551;\n  border-color: #2b7551;\n}\n.panel-primary > .panel-heading + .panel-collapse .panel-body {\n  border-top-color: #2b7551;\n}\n.panel-primary > .panel-footer + .panel-collapse .panel-body {\n  border-bottom-color: #2b7551;\n}\n.panel-primary .panel-title {\n  font-weight: 300;\n}\n.panel-primary .panel-title a:hover {\n  color: #fff;\n  text-decoration: none;\n}\na.badge:hover,\na.badge:focus {\n  color: #ffffff;\n  text-decoration: none;\n  cursor: pointer;\n}\na.list-group-item.active > .badge,\n.nav-pills > .active > a > .badge {\n  color: #2b7551;\n  background-color: #ffffff;\n}\n.nav-pills > li > a > .badge {\n  margin-left: 3px;\n}\n/*\n\n=====================\nSOCIAL LINKS\n=====================\n\n*/\n.contact-form {\n  margin-bottom: 20px;\n}\np.social {\n  text-align: center;\n  margin-top: 20px;\n}\np.social a {\n  margin: 0 10px 0 0;\n  color: #fff;\n  display: inline-block;\n  width: 40px;\n  height: 40px;\n  border-radius: 20px;\n  line-height: 40px;\n  font-size: 15px;\n  text-align: center;\n  -webkit-transition: all 0.2s ease-out;\n  -moz-transition: all 0.2s ease-out;\n  transition: all 0.2s ease-out;\n  vertical-align: bottom;\n  border: solid 1px #ccc;\n}\np.social a i {\n  vertical-align: bottom;\n  line-height: 40px;\n}\np.social a.facebook {\n  background-color: #4460ae;\n  border-color: #4460ae;\n}\np.social a.gplus {\n  background-color: #c21f25;\n  border-color: #c21f25;\n}\np.social a.twitter {\n  background-color: #3cf;\n  border-color: #3cf;\n}\np.social a.instagram {\n  background-color: #cd4378;\n  border-color: #cd4378;\n}\np.social a.email {\n  background-color: #4a7f45;\n  border-color: #4a7f45;\n}\np.social a.link {\n  background-color: #871AFF;\n  border-color: #871AFF;\n}\np.social.social--outline a {\n  background: transparent;\n}\np.social.social--outline a.facebook {\n  color: #4460ae;\n  border-color: #4460ae;\n}\np.social.social--outline a.gplus {\n  color: #c21f25;\n  border-color: #c21f25;\n}\np.social.social--outline a.twitter {\n  color: #3cf;\n  border-color: #3cf;\n}\np.social.social--outline a.instagram {\n  color: #cd4378;\n  border-color: #cd4378;\n}\np.social.social--outline a.email {\n  color: #4a7f45;\n  border-color: #4a7f45;\n}\np.social.social--outline a.link {\n  color: #871AFF;\n  border-color: #871AFF;\n}\n", ""]);

// exports


/***/ },

/***/ 563:
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(37)();
// imports


// module
exports.push([module.i, ".simple-element {\n    position: relative;\n    display:block;\n    background-color: #219161\n}", ""]);

// exports


/***/ },

/***/ 564:
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(37)();
// imports


// module
exports.push([module.i, "@keyframes vex-slideup {\n  0% {\n    transform: translateY(0);\n    -webkit-transform: translateY(0);\n    -moz-transform: translateY(0);\n    -ms-transform: translateY(0);\n    -o-transform: translateY(0);\n    opacity: 0; }\n  1% {\n    transform: translateY(800px);\n    -webkit-transform: translateY(800px);\n    -moz-transform: translateY(800px);\n    -ms-transform: translateY(800px);\n    -o-transform: translateY(800px);\n    opacity: 0; }\n  2% {\n    transform: translateY(800px);\n    -webkit-transform: translateY(800px);\n    -moz-transform: translateY(800px);\n    -ms-transform: translateY(800px);\n    -o-transform: translateY(800px);\n    opacity: 1; }\n  100% {\n    transform: translateY(0);\n    -webkit-transform: translateY(0);\n    -moz-transform: translateY(0);\n    -ms-transform: translateY(0);\n    -o-transform: translateY(0);\n    opacity: 1; } }\n\n@-webkit-keyframes vex-slideup {\n  0% {\n    transform: translateY(0);\n    -webkit-transform: translateY(0);\n    -moz-transform: translateY(0);\n    -ms-transform: translateY(0);\n    -o-transform: translateY(0);\n    opacity: 0; }\n  1% {\n    transform: translateY(800px);\n    -webkit-transform: translateY(800px);\n    -moz-transform: translateY(800px);\n    -ms-transform: translateY(800px);\n    -o-transform: translateY(800px);\n    opacity: 0; }\n  2% {\n    transform: translateY(800px);\n    -webkit-transform: translateY(800px);\n    -moz-transform: translateY(800px);\n    -ms-transform: translateY(800px);\n    -o-transform: translateY(800px);\n    opacity: 1; }\n  100% {\n    transform: translateY(0);\n    -webkit-transform: translateY(0);\n    -moz-transform: translateY(0);\n    -ms-transform: translateY(0);\n    -o-transform: translateY(0);\n    opacity: 1; } }\n\n@-moz-keyframes vex-slideup {\n  0% {\n    transform: translateY(0);\n    -webkit-transform: translateY(0);\n    -moz-transform: translateY(0);\n    -ms-transform: translateY(0);\n    -o-transform: translateY(0);\n    opacity: 0; }\n  1% {\n    transform: translateY(800px);\n    -webkit-transform: translateY(800px);\n    -moz-transform: translateY(800px);\n    -ms-transform: translateY(800px);\n    -o-transform: translateY(800px);\n    opacity: 0; }\n  2% {\n    transform: translateY(800px);\n    -webkit-transform: translateY(800px);\n    -moz-transform: translateY(800px);\n    -ms-transform: translateY(800px);\n    -o-transform: translateY(800px);\n    opacity: 1; }\n  100% {\n    transform: translateY(0);\n    -webkit-transform: translateY(0);\n    -moz-transform: translateY(0);\n    -ms-transform: translateY(0);\n    -o-transform: translateY(0);\n    opacity: 1; } }\n\n@-ms-keyframes vex-slideup {\n  0% {\n    transform: translateY(0);\n    -webkit-transform: translateY(0);\n    -moz-transform: translateY(0);\n    -ms-transform: translateY(0);\n    -o-transform: translateY(0);\n    opacity: 0; }\n  1% {\n    transform: translateY(800px);\n    -webkit-transform: translateY(800px);\n    -moz-transform: translateY(800px);\n    -ms-transform: translateY(800px);\n    -o-transform: translateY(800px);\n    opacity: 0; }\n  2% {\n    transform: translateY(800px);\n    -webkit-transform: translateY(800px);\n    -moz-transform: translateY(800px);\n    -ms-transform: translateY(800px);\n    -o-transform: translateY(800px);\n    opacity: 1; }\n  100% {\n    transform: translateY(0);\n    -webkit-transform: translateY(0);\n    -moz-transform: translateY(0);\n    -ms-transform: translateY(0);\n    -o-transform: translateY(0);\n    opacity: 1; } }\n\n@-o-keyframes vex-slideup {\n  0% {\n    transform: translateY(0);\n    -webkit-transform: translateY(0);\n    -moz-transform: translateY(0);\n    -ms-transform: translateY(0);\n    -o-transform: translateY(0);\n    opacity: 0; }\n  1% {\n    transform: translateY(800px);\n    -webkit-transform: translateY(800px);\n    -moz-transform: translateY(800px);\n    -ms-transform: translateY(800px);\n    -o-transform: translateY(800px);\n    opacity: 0; }\n  2% {\n    transform: translateY(800px);\n    -webkit-transform: translateY(800px);\n    -moz-transform: translateY(800px);\n    -ms-transform: translateY(800px);\n    -o-transform: translateY(800px);\n    opacity: 1; }\n  100% {\n    transform: translateY(0);\n    -webkit-transform: translateY(0);\n    -moz-transform: translateY(0);\n    -ms-transform: translateY(0);\n    -o-transform: translateY(0);\n    opacity: 1; } }\n\n@keyframes vex-slidedown {\n  0% {\n    transform: translateY(0);\n    -webkit-transform: translateY(0);\n    -moz-transform: translateY(0);\n    -ms-transform: translateY(0);\n    -o-transform: translateY(0); }\n  100% {\n    transform: translateY(800px);\n    -webkit-transform: translateY(800px);\n    -moz-transform: translateY(800px);\n    -ms-transform: translateY(800px);\n    -o-transform: translateY(800px); } }\n\n@-webkit-keyframes vex-slidedown {\n  0% {\n    transform: translateY(0);\n    -webkit-transform: translateY(0);\n    -moz-transform: translateY(0);\n    -ms-transform: translateY(0);\n    -o-transform: translateY(0); }\n  100% {\n    transform: translateY(800px);\n    -webkit-transform: translateY(800px);\n    -moz-transform: translateY(800px);\n    -ms-transform: translateY(800px);\n    -o-transform: translateY(800px); } }\n\n@-moz-keyframes vex-slidedown {\n  0% {\n    transform: translateY(0);\n    -webkit-transform: translateY(0);\n    -moz-transform: translateY(0);\n    -ms-transform: translateY(0);\n    -o-transform: translateY(0); }\n  100% {\n    transform: translateY(800px);\n    -webkit-transform: translateY(800px);\n    -moz-transform: translateY(800px);\n    -ms-transform: translateY(800px);\n    -o-transform: translateY(800px); } }\n\n@-ms-keyframes vex-slidedown {\n  0% {\n    transform: translateY(0);\n    -webkit-transform: translateY(0);\n    -moz-transform: translateY(0);\n    -ms-transform: translateY(0);\n    -o-transform: translateY(0); }\n  100% {\n    transform: translateY(800px);\n    -webkit-transform: translateY(800px);\n    -moz-transform: translateY(800px);\n    -ms-transform: translateY(800px);\n    -o-transform: translateY(800px); } }\n\n@-o-keyframes vex-slidedown {\n  0% {\n    transform: translateY(0);\n    -webkit-transform: translateY(0);\n    -moz-transform: translateY(0);\n    -ms-transform: translateY(0);\n    -o-transform: translateY(0); }\n  100% {\n    transform: translateY(800px);\n    -webkit-transform: translateY(800px);\n    -moz-transform: translateY(800px);\n    -ms-transform: translateY(800px);\n    -o-transform: translateY(800px); } }\n\n@keyframes vex-pulse {\n  0% {\n    -moz-box-shadow: inset 0 0 0 300px transparent;\n    -webkit-box-shadow: inset 0 0 0 300px transparent;\n    box-shadow: inset 0 0 0 300px transparent; }\n  70% {\n    -moz-box-shadow: inset 0 0 0 300px rgba(255, 255, 255, 0.25);\n    -webkit-box-shadow: inset 0 0 0 300px rgba(255, 255, 255, 0.25);\n    box-shadow: inset 0 0 0 300px rgba(255, 255, 255, 0.25); }\n  100% {\n    -moz-box-shadow: inset 0 0 0 300px transparent;\n    -webkit-box-shadow: inset 0 0 0 300px transparent;\n    box-shadow: inset 0 0 0 300px transparent; } }\n\n@-webkit-keyframes vex-pulse {\n  0% {\n    -moz-box-shadow: inset 0 0 0 300px transparent;\n    -webkit-box-shadow: inset 0 0 0 300px transparent;\n    box-shadow: inset 0 0 0 300px transparent; }\n  70% {\n    -moz-box-shadow: inset 0 0 0 300px rgba(255, 255, 255, 0.25);\n    -webkit-box-shadow: inset 0 0 0 300px rgba(255, 255, 255, 0.25);\n    box-shadow: inset 0 0 0 300px rgba(255, 255, 255, 0.25); }\n  100% {\n    -moz-box-shadow: inset 0 0 0 300px transparent;\n    -webkit-box-shadow: inset 0 0 0 300px transparent;\n    box-shadow: inset 0 0 0 300px transparent; } }\n\n@-moz-keyframes vex-pulse {\n  0% {\n    -moz-box-shadow: inset 0 0 0 300px transparent;\n    -webkit-box-shadow: inset 0 0 0 300px transparent;\n    box-shadow: inset 0 0 0 300px transparent; }\n  70% {\n    -moz-box-shadow: inset 0 0 0 300px rgba(255, 255, 255, 0.25);\n    -webkit-box-shadow: inset 0 0 0 300px rgba(255, 255, 255, 0.25);\n    box-shadow: inset 0 0 0 300px rgba(255, 255, 255, 0.25); }\n  100% {\n    -moz-box-shadow: inset 0 0 0 300px transparent;\n    -webkit-box-shadow: inset 0 0 0 300px transparent;\n    box-shadow: inset 0 0 0 300px transparent; } }\n\n@-ms-keyframes vex-pulse {\n  0% {\n    -moz-box-shadow: inset 0 0 0 300px transparent;\n    -webkit-box-shadow: inset 0 0 0 300px transparent;\n    box-shadow: inset 0 0 0 300px transparent; }\n  70% {\n    -moz-box-shadow: inset 0 0 0 300px rgba(255, 255, 255, 0.25);\n    -webkit-box-shadow: inset 0 0 0 300px rgba(255, 255, 255, 0.25);\n    box-shadow: inset 0 0 0 300px rgba(255, 255, 255, 0.25); }\n  100% {\n    -moz-box-shadow: inset 0 0 0 300px transparent;\n    -webkit-box-shadow: inset 0 0 0 300px transparent;\n    box-shadow: inset 0 0 0 300px transparent; } }\n\n@-o-keyframes vex-pulse {\n  0% {\n    -moz-box-shadow: inset 0 0 0 300px transparent;\n    -webkit-box-shadow: inset 0 0 0 300px transparent;\n    box-shadow: inset 0 0 0 300px transparent; }\n  70% {\n    -moz-box-shadow: inset 0 0 0 300px rgba(255, 255, 255, 0.25);\n    -webkit-box-shadow: inset 0 0 0 300px rgba(255, 255, 255, 0.25);\n    box-shadow: inset 0 0 0 300px rgba(255, 255, 255, 0.25); }\n  100% {\n    -moz-box-shadow: inset 0 0 0 300px transparent;\n    -webkit-box-shadow: inset 0 0 0 300px transparent;\n    box-shadow: inset 0 0 0 300px transparent; } }\n\n.vex.vex-theme-bottom-right-corner {\n  top: auto;\n  bottom: 0;\n  right: 0;\n  overflow: visible; }\n  .vex.vex-theme-bottom-right-corner .vex-overlay {\n    display: none; }\n  .vex.vex-theme-bottom-right-corner.vex-closing .vex-content {\n    animation: vex-slidedown 0.5s;\n    -webkit-animation: vex-slidedown 0.5s;\n    -moz-animation: vex-slidedown 0.5s;\n    -ms-animation: vex-slidedown 0.5s;\n    -o-animation: vex-slidedown 0.5s;\n    -webkit-backface-visibility: hidden; }\n  .vex.vex-theme-bottom-right-corner .vex-content {\n    animation: vex-slideup 0.5s;\n    -webkit-animation: vex-slideup 0.5s;\n    -moz-animation: vex-slideup 0.5s;\n    -ms-animation: vex-slideup 0.5s;\n    -o-animation: vex-slideup 0.5s;\n    -webkit-backface-visibility: hidden; }\n  .vex.vex-theme-bottom-right-corner .vex-content {\n    -moz-border-radius: 5px 0 0 0;\n    -webkit-border-radius: 5px 0 0 0;\n    border-radius: 5px 0 0 0;\n    font-family: \"Helvetica Neue\", sans-serif;\n    background: #f0f0f0;\n    color: #444;\n    padding: 1em;\n    max-width: 100%;\n    width: 450px;\n    font-size: 1.1em;\n    line-height: 1.5em;\n    position: fixed;\n    bottom: 0;\n    right: 0;\n    left: auto; }\n    .vex.vex-theme-bottom-right-corner .vex-content h1, .vex.vex-theme-bottom-right-corner .vex-content h2, .vex.vex-theme-bottom-right-corner .vex-content h3, .vex.vex-theme-bottom-right-corner .vex-content h4, .vex.vex-theme-bottom-right-corner .vex-content h5, .vex.vex-theme-bottom-right-corner .vex-content h6, .vex.vex-theme-bottom-right-corner .vex-content p, .vex.vex-theme-bottom-right-corner .vex-content ul, .vex.vex-theme-bottom-right-corner .vex-content li {\n      color: inherit; }\n  .vex.vex-theme-bottom-right-corner .vex-close {\n    -moz-border-radius: 5px;\n    -webkit-border-radius: 5px;\n    border-radius: 5px;\n    position: absolute;\n    top: 0;\n    right: 0;\n    cursor: pointer; }\n    .vex.vex-theme-bottom-right-corner .vex-close:before {\n      -moz-border-radius: 3px;\n      -webkit-border-radius: 3px;\n      border-radius: 3px;\n      position: absolute;\n      content: \"\\D7\";\n      font-size: 26px;\n      font-weight: normal;\n      line-height: 31px;\n      height: 30px;\n      width: 30px;\n      text-align: center;\n      top: 3px;\n      right: 3px;\n      color: #bbb;\n      background: transparent; }\n    .vex.vex-theme-bottom-right-corner .vex-close:hover:before, .vex.vex-theme-bottom-right-corner .vex-close:active:before {\n      color: #777;\n      background: #e0e0e0; }\n  .vex.vex-theme-bottom-right-corner .vex-dialog-form .vex-dialog-message {\n    margin-bottom: .5em; }\n  .vex.vex-theme-bottom-right-corner .vex-dialog-form .vex-dialog-input {\n    margin-bottom: 1em; }\n    .vex.vex-theme-bottom-right-corner .vex-dialog-form .vex-dialog-input textarea, .vex.vex-theme-bottom-right-corner .vex-dialog-form .vex-dialog-input input[type=\"date\"], .vex.vex-theme-bottom-right-corner .vex-dialog-form .vex-dialog-input input[type=\"datetime\"], .vex.vex-theme-bottom-right-corner .vex-dialog-form .vex-dialog-input input[type=\"datetime-local\"], .vex.vex-theme-bottom-right-corner .vex-dialog-form .vex-dialog-input input[type=\"email\"], .vex.vex-theme-bottom-right-corner .vex-dialog-form .vex-dialog-input input[type=\"month\"], .vex.vex-theme-bottom-right-corner .vex-dialog-form .vex-dialog-input input[type=\"number\"], .vex.vex-theme-bottom-right-corner .vex-dialog-form .vex-dialog-input input[type=\"password\"], .vex.vex-theme-bottom-right-corner .vex-dialog-form .vex-dialog-input input[type=\"search\"], .vex.vex-theme-bottom-right-corner .vex-dialog-form .vex-dialog-input input[type=\"tel\"], .vex.vex-theme-bottom-right-corner .vex-dialog-form .vex-dialog-input input[type=\"text\"], .vex.vex-theme-bottom-right-corner .vex-dialog-form .vex-dialog-input input[type=\"time\"], .vex.vex-theme-bottom-right-corner .vex-dialog-form .vex-dialog-input input[type=\"url\"], .vex.vex-theme-bottom-right-corner .vex-dialog-form .vex-dialog-input input[type=\"week\"] {\n      -moz-border-radius: 3px;\n      -webkit-border-radius: 3px;\n      border-radius: 3px;\n      background: #fff;\n      width: 100%;\n      padding: .25em .67em;\n      border: 0;\n      font-family: inherit;\n      font-weight: inherit;\n      font-size: inherit;\n      min-height: 2.5em;\n      margin: 0 0 .25em; }\n      .vex.vex-theme-bottom-right-corner .vex-dialog-form .vex-dialog-input textarea:focus, .vex.vex-theme-bottom-right-corner .vex-dialog-form .vex-dialog-input input[type=\"date\"]:focus, .vex.vex-theme-bottom-right-corner .vex-dialog-form .vex-dialog-input input[type=\"datetime\"]:focus, .vex.vex-theme-bottom-right-corner .vex-dialog-form .vex-dialog-input input[type=\"datetime-local\"]:focus, .vex.vex-theme-bottom-right-corner .vex-dialog-form .vex-dialog-input input[type=\"email\"]:focus, .vex.vex-theme-bottom-right-corner .vex-dialog-form .vex-dialog-input input[type=\"month\"]:focus, .vex.vex-theme-bottom-right-corner .vex-dialog-form .vex-dialog-input input[type=\"number\"]:focus, .vex.vex-theme-bottom-right-corner .vex-dialog-form .vex-dialog-input input[type=\"password\"]:focus, .vex.vex-theme-bottom-right-corner .vex-dialog-form .vex-dialog-input input[type=\"search\"]:focus, .vex.vex-theme-bottom-right-corner .vex-dialog-form .vex-dialog-input input[type=\"tel\"]:focus, .vex.vex-theme-bottom-right-corner .vex-dialog-form .vex-dialog-input input[type=\"text\"]:focus, .vex.vex-theme-bottom-right-corner .vex-dialog-form .vex-dialog-input input[type=\"time\"]:focus, .vex.vex-theme-bottom-right-corner .vex-dialog-form .vex-dialog-input input[type=\"url\"]:focus, .vex.vex-theme-bottom-right-corner .vex-dialog-form .vex-dialog-input input[type=\"week\"]:focus {\n        -moz-box-shadow: inset 0 0 0 2px #8dbdf1;\n        -webkit-box-shadow: inset 0 0 0 2px #8dbdf1;\n        box-shadow: inset 0 0 0 2px #8dbdf1;\n        outline: none; }\n  .vex.vex-theme-bottom-right-corner .vex-dialog-form .vex-dialog-buttons {\n    *zoom: 1; }\n    .vex.vex-theme-bottom-right-corner .vex-dialog-form .vex-dialog-buttons:after {\n      content: \"\";\n      display: table;\n      clear: both; }\n  .vex.vex-theme-bottom-right-corner .vex-dialog-button {\n    -moz-border-radius: 3px;\n    -webkit-border-radius: 3px;\n    border-radius: 3px;\n    border: 0;\n    float: right;\n    margin: 0 0 0 .5em;\n    font-family: inherit;\n    text-transform: uppercase;\n    letter-spacing: .1em;\n    font-size: .8em;\n    line-height: 1em;\n    padding: .75em 2em; }\n    .vex.vex-theme-bottom-right-corner .vex-dialog-button.vex-last {\n      margin-left: 0; }\n    .vex.vex-theme-bottom-right-corner .vex-dialog-button:focus {\n      animation: vex-pulse 1.1s infinite;\n      -webkit-animation: vex-pulse 1.1s infinite;\n      -moz-animation: vex-pulse 1.1s infinite;\n      -ms-animation: vex-pulse 1.1s infinite;\n      -o-animation: vex-pulse 1.1s infinite;\n      -webkit-backface-visibility: hidden;\n      outline: none; }\n      @media (max-width: 568px) {\n        .vex.vex-theme-bottom-right-corner .vex-dialog-button:focus {\n          animation: none;\n          -webkit-animation: none;\n          -moz-animation: none;\n          -ms-animation: none;\n          -o-animation: none;\n          -webkit-backface-visibility: hidden; } }\n    .vex.vex-theme-bottom-right-corner .vex-dialog-button.vex-dialog-button-primary {\n      background: #3288e6;\n      color: #fff; }\n    .vex.vex-theme-bottom-right-corner .vex-dialog-button.vex-dialog-button-secondary {\n      background: #e0e0e0;\n      color: #777; }\n\n.vex-loading-spinner.vex-theme-bottom-right-corner {\n  -moz-box-shadow: 0 0 0 0.5em #f0f0f0, 0 0 1px 0.5em rgba(0, 0, 0, 0.3);\n  -webkit-box-shadow: 0 0 0 0.5em #f0f0f0, 0 0 1px 0.5em rgba(0, 0, 0, 0.3);\n  box-shadow: 0 0 0 0.5em #f0f0f0, 0 0 1px 0.5em rgba(0, 0, 0, 0.3);\n  -moz-border-radius: 100%;\n  -webkit-border-radius: 100%;\n  border-radius: 100%;\n  background: #f0f0f0;\n  border: .2em solid transparent;\n  border-top-color: #bbb;\n  top: -1.1em;\n  bottom: auto; }\n\nbody.vex-open {\n  overflow: initial; }\n", ""]);

// exports


/***/ },

/***/ 565:
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(37)();
// imports


// module
exports.push([module.i, "@keyframes vex-flyin {\n  0% {\n    opacity: 0;\n    transform: translateY(-40px);\n    -webkit-transform: translateY(-40px);\n    -moz-transform: translateY(-40px);\n    -ms-transform: translateY(-40px);\n    -o-transform: translateY(-40px); }\n  100% {\n    opacity: 1;\n    transform: translateY(0);\n    -webkit-transform: translateY(0);\n    -moz-transform: translateY(0);\n    -ms-transform: translateY(0);\n    -o-transform: translateY(0); } }\n\n@-webkit-keyframes vex-flyin {\n  0% {\n    opacity: 0;\n    transform: translateY(-40px);\n    -webkit-transform: translateY(-40px);\n    -moz-transform: translateY(-40px);\n    -ms-transform: translateY(-40px);\n    -o-transform: translateY(-40px); }\n  100% {\n    opacity: 1;\n    transform: translateY(0);\n    -webkit-transform: translateY(0);\n    -moz-transform: translateY(0);\n    -ms-transform: translateY(0);\n    -o-transform: translateY(0); } }\n\n@-moz-keyframes vex-flyin {\n  0% {\n    opacity: 0;\n    transform: translateY(-40px);\n    -webkit-transform: translateY(-40px);\n    -moz-transform: translateY(-40px);\n    -ms-transform: translateY(-40px);\n    -o-transform: translateY(-40px); }\n  100% {\n    opacity: 1;\n    transform: translateY(0);\n    -webkit-transform: translateY(0);\n    -moz-transform: translateY(0);\n    -ms-transform: translateY(0);\n    -o-transform: translateY(0); } }\n\n@-ms-keyframes vex-flyin {\n  0% {\n    opacity: 0;\n    transform: translateY(-40px);\n    -webkit-transform: translateY(-40px);\n    -moz-transform: translateY(-40px);\n    -ms-transform: translateY(-40px);\n    -o-transform: translateY(-40px); }\n  100% {\n    opacity: 1;\n    transform: translateY(0);\n    -webkit-transform: translateY(0);\n    -moz-transform: translateY(0);\n    -ms-transform: translateY(0);\n    -o-transform: translateY(0); } }\n\n@-o-keyframes vex-flyin {\n  0% {\n    opacity: 0;\n    transform: translateY(-40px);\n    -webkit-transform: translateY(-40px);\n    -moz-transform: translateY(-40px);\n    -ms-transform: translateY(-40px);\n    -o-transform: translateY(-40px); }\n  100% {\n    opacity: 1;\n    transform: translateY(0);\n    -webkit-transform: translateY(0);\n    -moz-transform: translateY(0);\n    -ms-transform: translateY(0);\n    -o-transform: translateY(0); } }\n\n@keyframes vex-flyout {\n  0% {\n    opacity: 1;\n    transform: translateY(0);\n    -webkit-transform: translateY(0);\n    -moz-transform: translateY(0);\n    -ms-transform: translateY(0);\n    -o-transform: translateY(0); }\n  100% {\n    opacity: 0;\n    transform: translateY(-40px);\n    -webkit-transform: translateY(-40px);\n    -moz-transform: translateY(-40px);\n    -ms-transform: translateY(-40px);\n    -o-transform: translateY(-40px); } }\n\n@-webkit-keyframes vex-flyout {\n  0% {\n    opacity: 1;\n    transform: translateY(0);\n    -webkit-transform: translateY(0);\n    -moz-transform: translateY(0);\n    -ms-transform: translateY(0);\n    -o-transform: translateY(0); }\n  100% {\n    opacity: 0;\n    transform: translateY(-40px);\n    -webkit-transform: translateY(-40px);\n    -moz-transform: translateY(-40px);\n    -ms-transform: translateY(-40px);\n    -o-transform: translateY(-40px); } }\n\n@-moz-keyframes vex-flyout {\n  0% {\n    opacity: 1;\n    transform: translateY(0);\n    -webkit-transform: translateY(0);\n    -moz-transform: translateY(0);\n    -ms-transform: translateY(0);\n    -o-transform: translateY(0); }\n  100% {\n    opacity: 0;\n    transform: translateY(-40px);\n    -webkit-transform: translateY(-40px);\n    -moz-transform: translateY(-40px);\n    -ms-transform: translateY(-40px);\n    -o-transform: translateY(-40px); } }\n\n@-ms-keyframes vex-flyout {\n  0% {\n    opacity: 1;\n    transform: translateY(0);\n    -webkit-transform: translateY(0);\n    -moz-transform: translateY(0);\n    -ms-transform: translateY(0);\n    -o-transform: translateY(0); }\n  100% {\n    opacity: 0;\n    transform: translateY(-40px);\n    -webkit-transform: translateY(-40px);\n    -moz-transform: translateY(-40px);\n    -ms-transform: translateY(-40px);\n    -o-transform: translateY(-40px); } }\n\n@-o-keyframes vex-flyout {\n  0% {\n    opacity: 1;\n    transform: translateY(0);\n    -webkit-transform: translateY(0);\n    -moz-transform: translateY(0);\n    -ms-transform: translateY(0);\n    -o-transform: translateY(0); }\n  100% {\n    opacity: 0;\n    transform: translateY(-40px);\n    -webkit-transform: translateY(-40px);\n    -moz-transform: translateY(-40px);\n    -ms-transform: translateY(-40px);\n    -o-transform: translateY(-40px); } }\n\n@keyframes vex-pulse {\n  0% {\n    -moz-box-shadow: inset 0 0 0 300px transparent;\n    -webkit-box-shadow: inset 0 0 0 300px transparent;\n    box-shadow: inset 0 0 0 300px transparent; }\n  70% {\n    -moz-box-shadow: inset 0 0 0 300px rgba(255, 255, 255, 0.25);\n    -webkit-box-shadow: inset 0 0 0 300px rgba(255, 255, 255, 0.25);\n    box-shadow: inset 0 0 0 300px rgba(255, 255, 255, 0.25); }\n  100% {\n    -moz-box-shadow: inset 0 0 0 300px transparent;\n    -webkit-box-shadow: inset 0 0 0 300px transparent;\n    box-shadow: inset 0 0 0 300px transparent; } }\n\n@-webkit-keyframes vex-pulse {\n  0% {\n    -moz-box-shadow: inset 0 0 0 300px transparent;\n    -webkit-box-shadow: inset 0 0 0 300px transparent;\n    box-shadow: inset 0 0 0 300px transparent; }\n  70% {\n    -moz-box-shadow: inset 0 0 0 300px rgba(255, 255, 255, 0.25);\n    -webkit-box-shadow: inset 0 0 0 300px rgba(255, 255, 255, 0.25);\n    box-shadow: inset 0 0 0 300px rgba(255, 255, 255, 0.25); }\n  100% {\n    -moz-box-shadow: inset 0 0 0 300px transparent;\n    -webkit-box-shadow: inset 0 0 0 300px transparent;\n    box-shadow: inset 0 0 0 300px transparent; } }\n\n@-moz-keyframes vex-pulse {\n  0% {\n    -moz-box-shadow: inset 0 0 0 300px transparent;\n    -webkit-box-shadow: inset 0 0 0 300px transparent;\n    box-shadow: inset 0 0 0 300px transparent; }\n  70% {\n    -moz-box-shadow: inset 0 0 0 300px rgba(255, 255, 255, 0.25);\n    -webkit-box-shadow: inset 0 0 0 300px rgba(255, 255, 255, 0.25);\n    box-shadow: inset 0 0 0 300px rgba(255, 255, 255, 0.25); }\n  100% {\n    -moz-box-shadow: inset 0 0 0 300px transparent;\n    -webkit-box-shadow: inset 0 0 0 300px transparent;\n    box-shadow: inset 0 0 0 300px transparent; } }\n\n@-ms-keyframes vex-pulse {\n  0% {\n    -moz-box-shadow: inset 0 0 0 300px transparent;\n    -webkit-box-shadow: inset 0 0 0 300px transparent;\n    box-shadow: inset 0 0 0 300px transparent; }\n  70% {\n    -moz-box-shadow: inset 0 0 0 300px rgba(255, 255, 255, 0.25);\n    -webkit-box-shadow: inset 0 0 0 300px rgba(255, 255, 255, 0.25);\n    box-shadow: inset 0 0 0 300px rgba(255, 255, 255, 0.25); }\n  100% {\n    -moz-box-shadow: inset 0 0 0 300px transparent;\n    -webkit-box-shadow: inset 0 0 0 300px transparent;\n    box-shadow: inset 0 0 0 300px transparent; } }\n\n@-o-keyframes vex-pulse {\n  0% {\n    -moz-box-shadow: inset 0 0 0 300px transparent;\n    -webkit-box-shadow: inset 0 0 0 300px transparent;\n    box-shadow: inset 0 0 0 300px transparent; }\n  70% {\n    -moz-box-shadow: inset 0 0 0 300px rgba(255, 255, 255, 0.25);\n    -webkit-box-shadow: inset 0 0 0 300px rgba(255, 255, 255, 0.25);\n    box-shadow: inset 0 0 0 300px rgba(255, 255, 255, 0.25); }\n  100% {\n    -moz-box-shadow: inset 0 0 0 300px transparent;\n    -webkit-box-shadow: inset 0 0 0 300px transparent;\n    box-shadow: inset 0 0 0 300px transparent; } }\n\n.vex.vex-theme-default {\n  padding-top: 160px;\n  padding-bottom: 160px; }\n  .vex.vex-theme-default.vex-closing .vex-content {\n    animation: vex-flyout 0.5s;\n    -webkit-animation: vex-flyout 0.5s;\n    -moz-animation: vex-flyout 0.5s;\n    -ms-animation: vex-flyout 0.5s;\n    -o-animation: vex-flyout 0.5s;\n    -webkit-backface-visibility: hidden; }\n  .vex.vex-theme-default .vex-content {\n    animation: vex-flyin 0.5s;\n    -webkit-animation: vex-flyin 0.5s;\n    -moz-animation: vex-flyin 0.5s;\n    -ms-animation: vex-flyin 0.5s;\n    -o-animation: vex-flyin 0.5s;\n    -webkit-backface-visibility: hidden; }\n  .vex.vex-theme-default .vex-content {\n    -moz-border-radius: 5px;\n    -webkit-border-radius: 5px;\n    border-radius: 5px;\n    font-family: \"Helvetica Neue\", sans-serif;\n    background: #f0f0f0;\n    color: #444;\n    padding: 1em;\n    position: relative;\n    margin: 0 auto;\n    max-width: 100%;\n    width: 450px;\n    font-size: 1.1em;\n    line-height: 1.5em; }\n    .vex.vex-theme-default .vex-content h1, .vex.vex-theme-default .vex-content h2, .vex.vex-theme-default .vex-content h3, .vex.vex-theme-default .vex-content h4, .vex.vex-theme-default .vex-content h5, .vex.vex-theme-default .vex-content h6, .vex.vex-theme-default .vex-content p, .vex.vex-theme-default .vex-content ul, .vex.vex-theme-default .vex-content li {\n      color: inherit; }\n  .vex.vex-theme-default .vex-close {\n    -moz-border-radius: 5px;\n    -webkit-border-radius: 5px;\n    border-radius: 5px;\n    position: absolute;\n    top: 0;\n    right: 0;\n    cursor: pointer; }\n    .vex.vex-theme-default .vex-close:before {\n      -moz-border-radius: 3px;\n      -webkit-border-radius: 3px;\n      border-radius: 3px;\n      position: absolute;\n      content: \"\\D7\";\n      font-size: 26px;\n      font-weight: normal;\n      line-height: 31px;\n      height: 30px;\n      width: 30px;\n      text-align: center;\n      top: 3px;\n      right: 3px;\n      color: #bbb;\n      background: transparent; }\n    .vex.vex-theme-default .vex-close:hover:before, .vex.vex-theme-default .vex-close:active:before {\n      color: #777;\n      background: #e0e0e0; }\n  .vex.vex-theme-default .vex-dialog-form .vex-dialog-message {\n    margin-bottom: .5em; }\n  .vex.vex-theme-default .vex-dialog-form .vex-dialog-input {\n    margin-bottom: 1em; }\n    .vex.vex-theme-default .vex-dialog-form .vex-dialog-input textarea, .vex.vex-theme-default .vex-dialog-form .vex-dialog-input input[type=\"date\"], .vex.vex-theme-default .vex-dialog-form .vex-dialog-input input[type=\"datetime\"], .vex.vex-theme-default .vex-dialog-form .vex-dialog-input input[type=\"datetime-local\"], .vex.vex-theme-default .vex-dialog-form .vex-dialog-input input[type=\"email\"], .vex.vex-theme-default .vex-dialog-form .vex-dialog-input input[type=\"month\"], .vex.vex-theme-default .vex-dialog-form .vex-dialog-input input[type=\"number\"], .vex.vex-theme-default .vex-dialog-form .vex-dialog-input input[type=\"password\"], .vex.vex-theme-default .vex-dialog-form .vex-dialog-input input[type=\"search\"], .vex.vex-theme-default .vex-dialog-form .vex-dialog-input input[type=\"tel\"], .vex.vex-theme-default .vex-dialog-form .vex-dialog-input input[type=\"text\"], .vex.vex-theme-default .vex-dialog-form .vex-dialog-input input[type=\"time\"], .vex.vex-theme-default .vex-dialog-form .vex-dialog-input input[type=\"url\"], .vex.vex-theme-default .vex-dialog-form .vex-dialog-input input[type=\"week\"] {\n      -moz-border-radius: 3px;\n      -webkit-border-radius: 3px;\n      border-radius: 3px;\n      background: #fff;\n      width: 100%;\n      padding: .25em .67em;\n      border: 0;\n      font-family: inherit;\n      font-weight: inherit;\n      font-size: inherit;\n      min-height: 2.5em;\n      margin: 0 0 .25em; }\n      .vex.vex-theme-default .vex-dialog-form .vex-dialog-input textarea:focus, .vex.vex-theme-default .vex-dialog-form .vex-dialog-input input[type=\"date\"]:focus, .vex.vex-theme-default .vex-dialog-form .vex-dialog-input input[type=\"datetime\"]:focus, .vex.vex-theme-default .vex-dialog-form .vex-dialog-input input[type=\"datetime-local\"]:focus, .vex.vex-theme-default .vex-dialog-form .vex-dialog-input input[type=\"email\"]:focus, .vex.vex-theme-default .vex-dialog-form .vex-dialog-input input[type=\"month\"]:focus, .vex.vex-theme-default .vex-dialog-form .vex-dialog-input input[type=\"number\"]:focus, .vex.vex-theme-default .vex-dialog-form .vex-dialog-input input[type=\"password\"]:focus, .vex.vex-theme-default .vex-dialog-form .vex-dialog-input input[type=\"search\"]:focus, .vex.vex-theme-default .vex-dialog-form .vex-dialog-input input[type=\"tel\"]:focus, .vex.vex-theme-default .vex-dialog-form .vex-dialog-input input[type=\"text\"]:focus, .vex.vex-theme-default .vex-dialog-form .vex-dialog-input input[type=\"time\"]:focus, .vex.vex-theme-default .vex-dialog-form .vex-dialog-input input[type=\"url\"]:focus, .vex.vex-theme-default .vex-dialog-form .vex-dialog-input input[type=\"week\"]:focus {\n        -moz-box-shadow: inset 0 0 0 2px #8dbdf1;\n        -webkit-box-shadow: inset 0 0 0 2px #8dbdf1;\n        box-shadow: inset 0 0 0 2px #8dbdf1;\n        outline: none; }\n  .vex.vex-theme-default .vex-dialog-form .vex-dialog-buttons {\n    *zoom: 1; }\n    .vex.vex-theme-default .vex-dialog-form .vex-dialog-buttons:after {\n      content: \"\";\n      display: table;\n      clear: both; }\n  .vex.vex-theme-default .vex-dialog-button {\n    -moz-border-radius: 3px;\n    -webkit-border-radius: 3px;\n    border-radius: 3px;\n    border: 0;\n    float: right;\n    margin: 0 0 0 .5em;\n    font-family: inherit;\n    text-transform: uppercase;\n    letter-spacing: .1em;\n    font-size: .8em;\n    line-height: 1em;\n    padding: .75em 2em; }\n    .vex.vex-theme-default .vex-dialog-button.vex-last {\n      margin-left: 0; }\n    .vex.vex-theme-default .vex-dialog-button:focus {\n      animation: vex-pulse 1.1s infinite;\n      -webkit-animation: vex-pulse 1.1s infinite;\n      -moz-animation: vex-pulse 1.1s infinite;\n      -ms-animation: vex-pulse 1.1s infinite;\n      -o-animation: vex-pulse 1.1s infinite;\n      -webkit-backface-visibility: hidden;\n      outline: none; }\n      @media (max-width: 568px) {\n        .vex.vex-theme-default .vex-dialog-button:focus {\n          animation: none;\n          -webkit-animation: none;\n          -moz-animation: none;\n          -ms-animation: none;\n          -o-animation: none;\n          -webkit-backface-visibility: hidden; } }\n    .vex.vex-theme-default .vex-dialog-button.vex-dialog-button-primary {\n      background: #3288e6;\n      color: #fff; }\n    .vex.vex-theme-default .vex-dialog-button.vex-dialog-button-secondary {\n      background: #e0e0e0;\n      color: #777; }\n\n.vex-loading-spinner.vex-theme-default {\n  -moz-box-shadow: 0 0 0 0.5em #f0f0f0, 0 0 1px 0.5em rgba(0, 0, 0, 0.3);\n  -webkit-box-shadow: 0 0 0 0.5em #f0f0f0, 0 0 1px 0.5em rgba(0, 0, 0, 0.3);\n  box-shadow: 0 0 0 0.5em #f0f0f0, 0 0 1px 0.5em rgba(0, 0, 0, 0.3);\n  -moz-border-radius: 100%;\n  -webkit-border-radius: 100%;\n  border-radius: 100%;\n  background: #f0f0f0;\n  border: .2em solid transparent;\n  border-top-color: #bbb;\n  top: -1.1em;\n  bottom: auto; }\n", ""]);

// exports


/***/ },

/***/ 566:
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(37)();
// imports


// module
exports.push([module.i, "@keyframes vex-flipin-horizontal {\n  0% {\n    opacity: 0;\n    transform: rotateY(-90deg);\n    -webkit-transform: rotateY(-90deg);\n    -moz-transform: rotateY(-90deg);\n    -ms-transform: rotateY(-90deg);\n    -o-transform: rotateY(-90deg); }\n  100% {\n    opacity: 1;\n    transform: rotateY(0deg);\n    -webkit-transform: rotateY(0deg);\n    -moz-transform: rotateY(0deg);\n    -ms-transform: rotateY(0deg);\n    -o-transform: rotateY(0deg); } }\n\n@-webkit-keyframes vex-flipin-horizontal {\n  0% {\n    opacity: 0;\n    transform: rotateY(-90deg);\n    -webkit-transform: rotateY(-90deg);\n    -moz-transform: rotateY(-90deg);\n    -ms-transform: rotateY(-90deg);\n    -o-transform: rotateY(-90deg); }\n  100% {\n    opacity: 1;\n    transform: rotateY(0deg);\n    -webkit-transform: rotateY(0deg);\n    -moz-transform: rotateY(0deg);\n    -ms-transform: rotateY(0deg);\n    -o-transform: rotateY(0deg); } }\n\n@-moz-keyframes vex-flipin-horizontal {\n  0% {\n    opacity: 0;\n    transform: rotateY(-90deg);\n    -webkit-transform: rotateY(-90deg);\n    -moz-transform: rotateY(-90deg);\n    -ms-transform: rotateY(-90deg);\n    -o-transform: rotateY(-90deg); }\n  100% {\n    opacity: 1;\n    transform: rotateY(0deg);\n    -webkit-transform: rotateY(0deg);\n    -moz-transform: rotateY(0deg);\n    -ms-transform: rotateY(0deg);\n    -o-transform: rotateY(0deg); } }\n\n@-ms-keyframes vex-flipin-horizontal {\n  0% {\n    opacity: 0;\n    transform: rotateY(-90deg);\n    -webkit-transform: rotateY(-90deg);\n    -moz-transform: rotateY(-90deg);\n    -ms-transform: rotateY(-90deg);\n    -o-transform: rotateY(-90deg); }\n  100% {\n    opacity: 1;\n    transform: rotateY(0deg);\n    -webkit-transform: rotateY(0deg);\n    -moz-transform: rotateY(0deg);\n    -ms-transform: rotateY(0deg);\n    -o-transform: rotateY(0deg); } }\n\n@-o-keyframes vex-flipin-horizontal {\n  0% {\n    opacity: 0;\n    transform: rotateY(-90deg);\n    -webkit-transform: rotateY(-90deg);\n    -moz-transform: rotateY(-90deg);\n    -ms-transform: rotateY(-90deg);\n    -o-transform: rotateY(-90deg); }\n  100% {\n    opacity: 1;\n    transform: rotateY(0deg);\n    -webkit-transform: rotateY(0deg);\n    -moz-transform: rotateY(0deg);\n    -ms-transform: rotateY(0deg);\n    -o-transform: rotateY(0deg); } }\n\n@keyframes vex-flipout-horizontal {\n  0% {\n    opacity: 1;\n    transform: rotateY(0deg);\n    -webkit-transform: rotateY(0deg);\n    -moz-transform: rotateY(0deg);\n    -ms-transform: rotateY(0deg);\n    -o-transform: rotateY(0deg); }\n  100% {\n    opacity: 0;\n    transform: rotateY(90deg);\n    -webkit-transform: rotateY(90deg);\n    -moz-transform: rotateY(90deg);\n    -ms-transform: rotateY(90deg);\n    -o-transform: rotateY(90deg); } }\n\n@-webkit-keyframes vex-flipout-horizontal {\n  0% {\n    opacity: 1;\n    transform: rotateY(0deg);\n    -webkit-transform: rotateY(0deg);\n    -moz-transform: rotateY(0deg);\n    -ms-transform: rotateY(0deg);\n    -o-transform: rotateY(0deg); }\n  100% {\n    opacity: 0;\n    transform: rotateY(90deg);\n    -webkit-transform: rotateY(90deg);\n    -moz-transform: rotateY(90deg);\n    -ms-transform: rotateY(90deg);\n    -o-transform: rotateY(90deg); } }\n\n@-moz-keyframes vex-flipout-horizontal {\n  0% {\n    opacity: 1;\n    transform: rotateY(0deg);\n    -webkit-transform: rotateY(0deg);\n    -moz-transform: rotateY(0deg);\n    -ms-transform: rotateY(0deg);\n    -o-transform: rotateY(0deg); }\n  100% {\n    opacity: 0;\n    transform: rotateY(90deg);\n    -webkit-transform: rotateY(90deg);\n    -moz-transform: rotateY(90deg);\n    -ms-transform: rotateY(90deg);\n    -o-transform: rotateY(90deg); } }\n\n@-ms-keyframes vex-flipout-horizontal {\n  0% {\n    opacity: 1;\n    transform: rotateY(0deg);\n    -webkit-transform: rotateY(0deg);\n    -moz-transform: rotateY(0deg);\n    -ms-transform: rotateY(0deg);\n    -o-transform: rotateY(0deg); }\n  100% {\n    opacity: 0;\n    transform: rotateY(90deg);\n    -webkit-transform: rotateY(90deg);\n    -moz-transform: rotateY(90deg);\n    -ms-transform: rotateY(90deg);\n    -o-transform: rotateY(90deg); } }\n\n@-o-keyframes vex-flipout-horizontal {\n  0% {\n    opacity: 1;\n    transform: rotateY(0deg);\n    -webkit-transform: rotateY(0deg);\n    -moz-transform: rotateY(0deg);\n    -ms-transform: rotateY(0deg);\n    -o-transform: rotateY(0deg); }\n  100% {\n    opacity: 0;\n    transform: rotateY(90deg);\n    -webkit-transform: rotateY(90deg);\n    -moz-transform: rotateY(90deg);\n    -ms-transform: rotateY(90deg);\n    -o-transform: rotateY(90deg); } }\n\n.vex.vex-theme-flat-attack {\n  -moz-perspective: 1300px;\n  -webkit-perspective: 1300px;\n  perspective: 1300px;\n  -moz-perspective-origin: 50% 150px;\n  -webkit-perspective-origin: 50% 150px;\n  perspective-origin: 50% 150px;\n  padding-top: 100px;\n  padding-bottom: 100px;\n  font-size: 1.5em; }\n  .vex.vex-theme-flat-attack.vex-closing .vex-content {\n    animation: vex-flipout-horizontal 0.5s;\n    -webkit-animation: vex-flipout-horizontal 0.5s;\n    -moz-animation: vex-flipout-horizontal 0.5s;\n    -ms-animation: vex-flipout-horizontal 0.5s;\n    -o-animation: vex-flipout-horizontal 0.5s;\n    -webkit-backface-visibility: hidden; }\n  .vex.vex-theme-flat-attack .vex-content {\n    -webkit-transform-style: preserve-3d;\n    -moz-transform-style: preserve-3d;\n    transform-style: preserve-3d;\n    animation: vex-flipin-horizontal 0.5s;\n    -webkit-animation: vex-flipin-horizontal 0.5s;\n    -moz-animation: vex-flipin-horizontal 0.5s;\n    -ms-animation: vex-flipin-horizontal 0.5s;\n    -o-animation: vex-flipin-horizontal 0.5s;\n    -webkit-backface-visibility: hidden; }\n  .vex.vex-theme-flat-attack .vex-content {\n    font-family: \"Helvetica Neue\", sans-serif;\n    font-weight: 200;\n    background: #fff;\n    color: #444;\n    padding: 2em 2em 3em 2em;\n    line-height: 1.5em;\n    position: relative;\n    margin: 0 auto;\n    max-width: 100%;\n    width: 600px; }\n    .vex.vex-theme-flat-attack .vex-content h1, .vex.vex-theme-flat-attack .vex-content h2, .vex.vex-theme-flat-attack .vex-content h3, .vex.vex-theme-flat-attack .vex-content h4, .vex.vex-theme-flat-attack .vex-content h5, .vex.vex-theme-flat-attack .vex-content h6, .vex.vex-theme-flat-attack .vex-content p, .vex.vex-theme-flat-attack .vex-content ul, .vex.vex-theme-flat-attack .vex-content li {\n      color: inherit; }\n  .vex.vex-theme-flat-attack .vex-close {\n    position: absolute;\n    top: 0;\n    right: 0;\n    cursor: pointer; }\n    .vex.vex-theme-flat-attack .vex-close:before {\n      font-family: \"Helvetica Neue\", sans-serif;\n      font-weight: 100;\n      line-height: 1px;\n      padding-top: .5em;\n      display: block;\n      font-size: 2em;\n      text-indent: 1px;\n      overflow: hidden;\n      height: 1.25em;\n      width: 1.25em;\n      text-align: center;\n      top: 0;\n      right: 0;\n      color: #fff;\n      background: #666; }\n  .vex.vex-theme-flat-attack .vex-dialog-form .vex-dialog-message {\n    margin-bottom: .5em; }\n  .vex.vex-theme-flat-attack .vex-dialog-form .vex-dialog-input {\n    margin-bottom: .5em; }\n    .vex.vex-theme-flat-attack .vex-dialog-form .vex-dialog-input textarea, .vex.vex-theme-flat-attack .vex-dialog-form .vex-dialog-input input[type=\"date\"], .vex.vex-theme-flat-attack .vex-dialog-form .vex-dialog-input input[type=\"datetime\"], .vex.vex-theme-flat-attack .vex-dialog-form .vex-dialog-input input[type=\"datetime-local\"], .vex.vex-theme-flat-attack .vex-dialog-form .vex-dialog-input input[type=\"email\"], .vex.vex-theme-flat-attack .vex-dialog-form .vex-dialog-input input[type=\"month\"], .vex.vex-theme-flat-attack .vex-dialog-form .vex-dialog-input input[type=\"number\"], .vex.vex-theme-flat-attack .vex-dialog-form .vex-dialog-input input[type=\"password\"], .vex.vex-theme-flat-attack .vex-dialog-form .vex-dialog-input input[type=\"search\"], .vex.vex-theme-flat-attack .vex-dialog-form .vex-dialog-input input[type=\"tel\"], .vex.vex-theme-flat-attack .vex-dialog-form .vex-dialog-input input[type=\"text\"], .vex.vex-theme-flat-attack .vex-dialog-form .vex-dialog-input input[type=\"time\"], .vex.vex-theme-flat-attack .vex-dialog-form .vex-dialog-input input[type=\"url\"], .vex.vex-theme-flat-attack .vex-dialog-form .vex-dialog-input input[type=\"week\"] {\n      -moz-border-radius: 3px;\n      -webkit-border-radius: 3px;\n      border-radius: 3px;\n      background: #f0f0f0;\n      width: 100%;\n      padding: .25em .67em;\n      border: 0;\n      font-family: inherit;\n      font-weight: inherit;\n      font-size: inherit;\n      min-height: 2.5em;\n      margin: 0 0 .25em; }\n      .vex.vex-theme-flat-attack .vex-dialog-form .vex-dialog-input textarea:focus, .vex.vex-theme-flat-attack .vex-dialog-form .vex-dialog-input input[type=\"date\"]:focus, .vex.vex-theme-flat-attack .vex-dialog-form .vex-dialog-input input[type=\"datetime\"]:focus, .vex.vex-theme-flat-attack .vex-dialog-form .vex-dialog-input input[type=\"datetime-local\"]:focus, .vex.vex-theme-flat-attack .vex-dialog-form .vex-dialog-input input[type=\"email\"]:focus, .vex.vex-theme-flat-attack .vex-dialog-form .vex-dialog-input input[type=\"month\"]:focus, .vex.vex-theme-flat-attack .vex-dialog-form .vex-dialog-input input[type=\"number\"]:focus, .vex.vex-theme-flat-attack .vex-dialog-form .vex-dialog-input input[type=\"password\"]:focus, .vex.vex-theme-flat-attack .vex-dialog-form .vex-dialog-input input[type=\"search\"]:focus, .vex.vex-theme-flat-attack .vex-dialog-form .vex-dialog-input input[type=\"tel\"]:focus, .vex.vex-theme-flat-attack .vex-dialog-form .vex-dialog-input input[type=\"text\"]:focus, .vex.vex-theme-flat-attack .vex-dialog-form .vex-dialog-input input[type=\"time\"]:focus, .vex.vex-theme-flat-attack .vex-dialog-form .vex-dialog-input input[type=\"url\"]:focus, .vex.vex-theme-flat-attack .vex-dialog-form .vex-dialog-input input[type=\"week\"]:focus {\n        -moz-box-shadow: inset 0 0 0 2px #666;\n        -webkit-box-shadow: inset 0 0 0 2px #666;\n        box-shadow: inset 0 0 0 2px #666;\n        outline: none; }\n  .vex.vex-theme-flat-attack .vex-dialog-form .vex-dialog-buttons {\n    *zoom: 1;\n    padding-top: 1em;\n    margin-bottom: -3em;\n    margin-left: -2em;\n    margin-right: -2em; }\n    .vex.vex-theme-flat-attack .vex-dialog-form .vex-dialog-buttons:after {\n      content: \"\";\n      display: table;\n      clear: both; }\n  .vex.vex-theme-flat-attack .vex-dialog-button {\n    -moz-border-radius: 0;\n    -webkit-border-radius: 0;\n    border-radius: 0;\n    border: 0;\n    margin: 0;\n    float: right;\n    padding: .5em 1em;\n    font-size: 1.13em;\n    text-transform: uppercase;\n    font-weight: 200;\n    letter-spacing: .1em;\n    line-height: 1em;\n    font-family: inherit; }\n    .vex.vex-theme-flat-attack .vex-dialog-button.vex-last {\n      margin-left: 0; }\n    .vex.vex-theme-flat-attack .vex-dialog-button:focus {\n      outline: none; }\n    .vex.vex-theme-flat-attack .vex-dialog-button.vex-dialog-button-primary {\n      background: #666;\n      color: #fff; }\n      .vex.vex-theme-flat-attack .vex-dialog-button.vex-dialog-button-primary:focus {\n        -moz-box-shadow: inset 0 3px rgba(0, 0, 0, 0.2);\n        -webkit-box-shadow: inset 0 3px rgba(0, 0, 0, 0.2);\n        box-shadow: inset 0 3px rgba(0, 0, 0, 0.2); }\n    .vex.vex-theme-flat-attack .vex-dialog-button.vex-dialog-button-secondary {\n      background: #fff;\n      color: #ccc; }\n      .vex.vex-theme-flat-attack .vex-dialog-button.vex-dialog-button-secondary:focus {\n        -moz-box-shadow: inset 0 3px #aaa;\n        -webkit-box-shadow: inset 0 3px #aaa;\n        box-shadow: inset 0 3px #aaa;\n        background: #eee;\n        color: #777; }\n      .vex.vex-theme-flat-attack .vex-dialog-button.vex-dialog-button-secondary:hover, .vex.vex-theme-flat-attack .vex-dialog-button.vex-dialog-button-secondary:active {\n        color: #777; }\n  .vex.vex-theme-flat-attack.vex-theme-flat-attack-pink .vex-close:before {\n    background: #ff7ea7; }\n  .vex.vex-theme-flat-attack.vex-theme-flat-attack-pink .vex-dialog-form .vex-dialog-input textarea:focus, .vex.vex-theme-flat-attack.vex-theme-flat-attack-pink .vex-dialog-form .vex-dialog-input input[type=\"date\"]:focus, .vex.vex-theme-flat-attack.vex-theme-flat-attack-pink .vex-dialog-form .vex-dialog-input input[type=\"datetime\"]:focus, .vex.vex-theme-flat-attack.vex-theme-flat-attack-pink .vex-dialog-form .vex-dialog-input input[type=\"datetime-local\"]:focus, .vex.vex-theme-flat-attack.vex-theme-flat-attack-pink .vex-dialog-form .vex-dialog-input input[type=\"email\"]:focus, .vex.vex-theme-flat-attack.vex-theme-flat-attack-pink .vex-dialog-form .vex-dialog-input input[type=\"month\"]:focus, .vex.vex-theme-flat-attack.vex-theme-flat-attack-pink .vex-dialog-form .vex-dialog-input input[type=\"number\"]:focus, .vex.vex-theme-flat-attack.vex-theme-flat-attack-pink .vex-dialog-form .vex-dialog-input input[type=\"password\"]:focus, .vex.vex-theme-flat-attack.vex-theme-flat-attack-pink .vex-dialog-form .vex-dialog-input input[type=\"search\"]:focus, .vex.vex-theme-flat-attack.vex-theme-flat-attack-pink .vex-dialog-form .vex-dialog-input input[type=\"tel\"]:focus, .vex.vex-theme-flat-attack.vex-theme-flat-attack-pink .vex-dialog-form .vex-dialog-input input[type=\"text\"]:focus, .vex.vex-theme-flat-attack.vex-theme-flat-attack-pink .vex-dialog-form .vex-dialog-input input[type=\"time\"]:focus, .vex.vex-theme-flat-attack.vex-theme-flat-attack-pink .vex-dialog-form .vex-dialog-input input[type=\"url\"]:focus, .vex.vex-theme-flat-attack.vex-theme-flat-attack-pink .vex-dialog-form .vex-dialog-input input[type=\"week\"]:focus {\n    -moz-box-shadow: inset 0 0 0 2px #ff7ea7;\n    -webkit-box-shadow: inset 0 0 0 2px #ff7ea7;\n    box-shadow: inset 0 0 0 2px #ff7ea7; }\n  .vex.vex-theme-flat-attack.vex-theme-flat-attack-pink .vex-dialog-form .vex-dialog-buttons .vex-dialog-button.vex-dialog-button-primary {\n    background: #ff7ea7; }\n  .vex.vex-theme-flat-attack.vex-theme-flat-attack-red .vex-close:before {\n    background: #ce4a55; }\n  .vex.vex-theme-flat-attack.vex-theme-flat-attack-red .vex-dialog-form .vex-dialog-input textarea:focus, .vex.vex-theme-flat-attack.vex-theme-flat-attack-red .vex-dialog-form .vex-dialog-input input[type=\"date\"]:focus, .vex.vex-theme-flat-attack.vex-theme-flat-attack-red .vex-dialog-form .vex-dialog-input input[type=\"datetime\"]:focus, .vex.vex-theme-flat-attack.vex-theme-flat-attack-red .vex-dialog-form .vex-dialog-input input[type=\"datetime-local\"]:focus, .vex.vex-theme-flat-attack.vex-theme-flat-attack-red .vex-dialog-form .vex-dialog-input input[type=\"email\"]:focus, .vex.vex-theme-flat-attack.vex-theme-flat-attack-red .vex-dialog-form .vex-dialog-input input[type=\"month\"]:focus, .vex.vex-theme-flat-attack.vex-theme-flat-attack-red .vex-dialog-form .vex-dialog-input input[type=\"number\"]:focus, .vex.vex-theme-flat-attack.vex-theme-flat-attack-red .vex-dialog-form .vex-dialog-input input[type=\"password\"]:focus, .vex.vex-theme-flat-attack.vex-theme-flat-attack-red .vex-dialog-form .vex-dialog-input input[type=\"search\"]:focus, .vex.vex-theme-flat-attack.vex-theme-flat-attack-red .vex-dialog-form .vex-dialog-input input[type=\"tel\"]:focus, .vex.vex-theme-flat-attack.vex-theme-flat-attack-red .vex-dialog-form .vex-dialog-input input[type=\"text\"]:focus, .vex.vex-theme-flat-attack.vex-theme-flat-attack-red .vex-dialog-form .vex-dialog-input input[type=\"time\"]:focus, .vex.vex-theme-flat-attack.vex-theme-flat-attack-red .vex-dialog-form .vex-dialog-input input[type=\"url\"]:focus, .vex.vex-theme-flat-attack.vex-theme-flat-attack-red .vex-dialog-form .vex-dialog-input input[type=\"week\"]:focus {\n    -moz-box-shadow: inset 0 0 0 2px #ce4a55;\n    -webkit-box-shadow: inset 0 0 0 2px #ce4a55;\n    box-shadow: inset 0 0 0 2px #ce4a55; }\n  .vex.vex-theme-flat-attack.vex-theme-flat-attack-red .vex-dialog-form .vex-dialog-buttons .vex-dialog-button.vex-dialog-button-primary {\n    background: #ce4a55; }\n  .vex.vex-theme-flat-attack.vex-theme-flat-attack-green .vex-close:before {\n    background: #34b989; }\n  .vex.vex-theme-flat-attack.vex-theme-flat-attack-green .vex-dialog-form .vex-dialog-input textarea:focus, .vex.vex-theme-flat-attack.vex-theme-flat-attack-green .vex-dialog-form .vex-dialog-input input[type=\"date\"]:focus, .vex.vex-theme-flat-attack.vex-theme-flat-attack-green .vex-dialog-form .vex-dialog-input input[type=\"datetime\"]:focus, .vex.vex-theme-flat-attack.vex-theme-flat-attack-green .vex-dialog-form .vex-dialog-input input[type=\"datetime-local\"]:focus, .vex.vex-theme-flat-attack.vex-theme-flat-attack-green .vex-dialog-form .vex-dialog-input input[type=\"email\"]:focus, .vex.vex-theme-flat-attack.vex-theme-flat-attack-green .vex-dialog-form .vex-dialog-input input[type=\"month\"]:focus, .vex.vex-theme-flat-attack.vex-theme-flat-attack-green .vex-dialog-form .vex-dialog-input input[type=\"number\"]:focus, .vex.vex-theme-flat-attack.vex-theme-flat-attack-green .vex-dialog-form .vex-dialog-input input[type=\"password\"]:focus, .vex.vex-theme-flat-attack.vex-theme-flat-attack-green .vex-dialog-form .vex-dialog-input input[type=\"search\"]:focus, .vex.vex-theme-flat-attack.vex-theme-flat-attack-green .vex-dialog-form .vex-dialog-input input[type=\"tel\"]:focus, .vex.vex-theme-flat-attack.vex-theme-flat-attack-green .vex-dialog-form .vex-dialog-input input[type=\"text\"]:focus, .vex.vex-theme-flat-attack.vex-theme-flat-attack-green .vex-dialog-form .vex-dialog-input input[type=\"time\"]:focus, .vex.vex-theme-flat-attack.vex-theme-flat-attack-green .vex-dialog-form .vex-dialog-input input[type=\"url\"]:focus, .vex.vex-theme-flat-attack.vex-theme-flat-attack-green .vex-dialog-form .vex-dialog-input input[type=\"week\"]:focus {\n    -moz-box-shadow: inset 0 0 0 2px #34b989;\n    -webkit-box-shadow: inset 0 0 0 2px #34b989;\n    box-shadow: inset 0 0 0 2px #34b989; }\n  .vex.vex-theme-flat-attack.vex-theme-flat-attack-green .vex-dialog-form .vex-dialog-buttons .vex-dialog-button.vex-dialog-button-primary {\n    background: #34b989; }\n  .vex.vex-theme-flat-attack.vex-theme-flat-attack-blue .vex-close:before {\n    background: #477FA5; }\n  .vex.vex-theme-flat-attack.vex-theme-flat-attack-blue .vex-dialog-form .vex-dialog-input textarea:focus, .vex.vex-theme-flat-attack.vex-theme-flat-attack-blue .vex-dialog-form .vex-dialog-input input[type=\"date\"]:focus, .vex.vex-theme-flat-attack.vex-theme-flat-attack-blue .vex-dialog-form .vex-dialog-input input[type=\"datetime\"]:focus, .vex.vex-theme-flat-attack.vex-theme-flat-attack-blue .vex-dialog-form .vex-dialog-input input[type=\"datetime-local\"]:focus, .vex.vex-theme-flat-attack.vex-theme-flat-attack-blue .vex-dialog-form .vex-dialog-input input[type=\"email\"]:focus, .vex.vex-theme-flat-attack.vex-theme-flat-attack-blue .vex-dialog-form .vex-dialog-input input[type=\"month\"]:focus, .vex.vex-theme-flat-attack.vex-theme-flat-attack-blue .vex-dialog-form .vex-dialog-input input[type=\"number\"]:focus, .vex.vex-theme-flat-attack.vex-theme-flat-attack-blue .vex-dialog-form .vex-dialog-input input[type=\"password\"]:focus, .vex.vex-theme-flat-attack.vex-theme-flat-attack-blue .vex-dialog-form .vex-dialog-input input[type=\"search\"]:focus, .vex.vex-theme-flat-attack.vex-theme-flat-attack-blue .vex-dialog-form .vex-dialog-input input[type=\"tel\"]:focus, .vex.vex-theme-flat-attack.vex-theme-flat-attack-blue .vex-dialog-form .vex-dialog-input input[type=\"text\"]:focus, .vex.vex-theme-flat-attack.vex-theme-flat-attack-blue .vex-dialog-form .vex-dialog-input input[type=\"time\"]:focus, .vex.vex-theme-flat-attack.vex-theme-flat-attack-blue .vex-dialog-form .vex-dialog-input input[type=\"url\"]:focus, .vex.vex-theme-flat-attack.vex-theme-flat-attack-blue .vex-dialog-form .vex-dialog-input input[type=\"week\"]:focus {\n    -moz-box-shadow: inset 0 0 0 2px #477FA5;\n    -webkit-box-shadow: inset 0 0 0 2px #477FA5;\n    box-shadow: inset 0 0 0 2px #477FA5; }\n  .vex.vex-theme-flat-attack.vex-theme-flat-attack-blue .vex-dialog-form .vex-dialog-buttons .vex-dialog-button.vex-dialog-button-primary {\n    background: #477FA5; }\n\n.vex-loading-spinner.vex-theme-flat-attack {\n  height: 4em;\n  width: 4em; }\n", ""]);

// exports


/***/ },

/***/ 567:
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(37)();
// imports


// module
exports.push([module.i, "@keyframes vex-flyin {\n  0% {\n    opacity: 0;\n    transform: translateY(-40px);\n    -webkit-transform: translateY(-40px);\n    -moz-transform: translateY(-40px);\n    -ms-transform: translateY(-40px);\n    -o-transform: translateY(-40px); }\n  100% {\n    opacity: 1;\n    transform: translateY(0);\n    -webkit-transform: translateY(0);\n    -moz-transform: translateY(0);\n    -ms-transform: translateY(0);\n    -o-transform: translateY(0); } }\n\n@-webkit-keyframes vex-flyin {\n  0% {\n    opacity: 0;\n    transform: translateY(-40px);\n    -webkit-transform: translateY(-40px);\n    -moz-transform: translateY(-40px);\n    -ms-transform: translateY(-40px);\n    -o-transform: translateY(-40px); }\n  100% {\n    opacity: 1;\n    transform: translateY(0);\n    -webkit-transform: translateY(0);\n    -moz-transform: translateY(0);\n    -ms-transform: translateY(0);\n    -o-transform: translateY(0); } }\n\n@-moz-keyframes vex-flyin {\n  0% {\n    opacity: 0;\n    transform: translateY(-40px);\n    -webkit-transform: translateY(-40px);\n    -moz-transform: translateY(-40px);\n    -ms-transform: translateY(-40px);\n    -o-transform: translateY(-40px); }\n  100% {\n    opacity: 1;\n    transform: translateY(0);\n    -webkit-transform: translateY(0);\n    -moz-transform: translateY(0);\n    -ms-transform: translateY(0);\n    -o-transform: translateY(0); } }\n\n@-ms-keyframes vex-flyin {\n  0% {\n    opacity: 0;\n    transform: translateY(-40px);\n    -webkit-transform: translateY(-40px);\n    -moz-transform: translateY(-40px);\n    -ms-transform: translateY(-40px);\n    -o-transform: translateY(-40px); }\n  100% {\n    opacity: 1;\n    transform: translateY(0);\n    -webkit-transform: translateY(0);\n    -moz-transform: translateY(0);\n    -ms-transform: translateY(0);\n    -o-transform: translateY(0); } }\n\n@-o-keyframes vex-flyin {\n  0% {\n    opacity: 0;\n    transform: translateY(-40px);\n    -webkit-transform: translateY(-40px);\n    -moz-transform: translateY(-40px);\n    -ms-transform: translateY(-40px);\n    -o-transform: translateY(-40px); }\n  100% {\n    opacity: 1;\n    transform: translateY(0);\n    -webkit-transform: translateY(0);\n    -moz-transform: translateY(0);\n    -ms-transform: translateY(0);\n    -o-transform: translateY(0); } }\n\n@keyframes vex-flyout {\n  0% {\n    opacity: 1;\n    transform: translateY(0);\n    -webkit-transform: translateY(0);\n    -moz-transform: translateY(0);\n    -ms-transform: translateY(0);\n    -o-transform: translateY(0); }\n  100% {\n    opacity: 0;\n    transform: translateY(-40px);\n    -webkit-transform: translateY(-40px);\n    -moz-transform: translateY(-40px);\n    -ms-transform: translateY(-40px);\n    -o-transform: translateY(-40px); } }\n\n@-webkit-keyframes vex-flyout {\n  0% {\n    opacity: 1;\n    transform: translateY(0);\n    -webkit-transform: translateY(0);\n    -moz-transform: translateY(0);\n    -ms-transform: translateY(0);\n    -o-transform: translateY(0); }\n  100% {\n    opacity: 0;\n    transform: translateY(-40px);\n    -webkit-transform: translateY(-40px);\n    -moz-transform: translateY(-40px);\n    -ms-transform: translateY(-40px);\n    -o-transform: translateY(-40px); } }\n\n@-moz-keyframes vex-flyout {\n  0% {\n    opacity: 1;\n    transform: translateY(0);\n    -webkit-transform: translateY(0);\n    -moz-transform: translateY(0);\n    -ms-transform: translateY(0);\n    -o-transform: translateY(0); }\n  100% {\n    opacity: 0;\n    transform: translateY(-40px);\n    -webkit-transform: translateY(-40px);\n    -moz-transform: translateY(-40px);\n    -ms-transform: translateY(-40px);\n    -o-transform: translateY(-40px); } }\n\n@-ms-keyframes vex-flyout {\n  0% {\n    opacity: 1;\n    transform: translateY(0);\n    -webkit-transform: translateY(0);\n    -moz-transform: translateY(0);\n    -ms-transform: translateY(0);\n    -o-transform: translateY(0); }\n  100% {\n    opacity: 0;\n    transform: translateY(-40px);\n    -webkit-transform: translateY(-40px);\n    -moz-transform: translateY(-40px);\n    -ms-transform: translateY(-40px);\n    -o-transform: translateY(-40px); } }\n\n@-o-keyframes vex-flyout {\n  0% {\n    opacity: 1;\n    transform: translateY(0);\n    -webkit-transform: translateY(0);\n    -moz-transform: translateY(0);\n    -ms-transform: translateY(0);\n    -o-transform: translateY(0); }\n  100% {\n    opacity: 0;\n    transform: translateY(-40px);\n    -webkit-transform: translateY(-40px);\n    -moz-transform: translateY(-40px);\n    -ms-transform: translateY(-40px);\n    -o-transform: translateY(-40px); } }\n\n@keyframes vex-pulse {\n  0% {\n    -moz-box-shadow: inset 0 0 0 300px transparent;\n    -webkit-box-shadow: inset 0 0 0 300px transparent;\n    box-shadow: inset 0 0 0 300px transparent; }\n  70% {\n    -moz-box-shadow: inset 0 0 0 300px rgba(255, 255, 255, 0.25);\n    -webkit-box-shadow: inset 0 0 0 300px rgba(255, 255, 255, 0.25);\n    box-shadow: inset 0 0 0 300px rgba(255, 255, 255, 0.25); }\n  100% {\n    -moz-box-shadow: inset 0 0 0 300px transparent;\n    -webkit-box-shadow: inset 0 0 0 300px transparent;\n    box-shadow: inset 0 0 0 300px transparent; } }\n\n@-webkit-keyframes vex-pulse {\n  0% {\n    -moz-box-shadow: inset 0 0 0 300px transparent;\n    -webkit-box-shadow: inset 0 0 0 300px transparent;\n    box-shadow: inset 0 0 0 300px transparent; }\n  70% {\n    -moz-box-shadow: inset 0 0 0 300px rgba(255, 255, 255, 0.25);\n    -webkit-box-shadow: inset 0 0 0 300px rgba(255, 255, 255, 0.25);\n    box-shadow: inset 0 0 0 300px rgba(255, 255, 255, 0.25); }\n  100% {\n    -moz-box-shadow: inset 0 0 0 300px transparent;\n    -webkit-box-shadow: inset 0 0 0 300px transparent;\n    box-shadow: inset 0 0 0 300px transparent; } }\n\n@-moz-keyframes vex-pulse {\n  0% {\n    -moz-box-shadow: inset 0 0 0 300px transparent;\n    -webkit-box-shadow: inset 0 0 0 300px transparent;\n    box-shadow: inset 0 0 0 300px transparent; }\n  70% {\n    -moz-box-shadow: inset 0 0 0 300px rgba(255, 255, 255, 0.25);\n    -webkit-box-shadow: inset 0 0 0 300px rgba(255, 255, 255, 0.25);\n    box-shadow: inset 0 0 0 300px rgba(255, 255, 255, 0.25); }\n  100% {\n    -moz-box-shadow: inset 0 0 0 300px transparent;\n    -webkit-box-shadow: inset 0 0 0 300px transparent;\n    box-shadow: inset 0 0 0 300px transparent; } }\n\n@-ms-keyframes vex-pulse {\n  0% {\n    -moz-box-shadow: inset 0 0 0 300px transparent;\n    -webkit-box-shadow: inset 0 0 0 300px transparent;\n    box-shadow: inset 0 0 0 300px transparent; }\n  70% {\n    -moz-box-shadow: inset 0 0 0 300px rgba(255, 255, 255, 0.25);\n    -webkit-box-shadow: inset 0 0 0 300px rgba(255, 255, 255, 0.25);\n    box-shadow: inset 0 0 0 300px rgba(255, 255, 255, 0.25); }\n  100% {\n    -moz-box-shadow: inset 0 0 0 300px transparent;\n    -webkit-box-shadow: inset 0 0 0 300px transparent;\n    box-shadow: inset 0 0 0 300px transparent; } }\n\n@-o-keyframes vex-pulse {\n  0% {\n    -moz-box-shadow: inset 0 0 0 300px transparent;\n    -webkit-box-shadow: inset 0 0 0 300px transparent;\n    box-shadow: inset 0 0 0 300px transparent; }\n  70% {\n    -moz-box-shadow: inset 0 0 0 300px rgba(255, 255, 255, 0.25);\n    -webkit-box-shadow: inset 0 0 0 300px rgba(255, 255, 255, 0.25);\n    box-shadow: inset 0 0 0 300px rgba(255, 255, 255, 0.25); }\n  100% {\n    -moz-box-shadow: inset 0 0 0 300px transparent;\n    -webkit-box-shadow: inset 0 0 0 300px transparent;\n    box-shadow: inset 0 0 0 300px transparent; } }\n\n.vex.vex-theme-os {\n  padding-top: 160px;\n  padding-bottom: 160px; }\n  .vex.vex-theme-os.vex-closing .vex-content {\n    animation: vex-flyout 0.5s;\n    -webkit-animation: vex-flyout 0.5s;\n    -moz-animation: vex-flyout 0.5s;\n    -ms-animation: vex-flyout 0.5s;\n    -o-animation: vex-flyout 0.5s;\n    -webkit-backface-visibility: hidden; }\n  .vex.vex-theme-os .vex-content {\n    animation: vex-flyin 0.5s;\n    -webkit-animation: vex-flyin 0.5s;\n    -moz-animation: vex-flyin 0.5s;\n    -ms-animation: vex-flyin 0.5s;\n    -o-animation: vex-flyin 0.5s;\n    -webkit-backface-visibility: hidden; }\n  .vex.vex-theme-os .vex-content {\n    -moz-border-radius: 5px;\n    -webkit-border-radius: 5px;\n    border-radius: 5px;\n    -moz-box-shadow: inset 0 1px #a6a6a6, 0 0 0 1px rgba(0, 0, 0, 0.08);\n    -webkit-box-shadow: inset 0 1px #a6a6a6, 0 0 0 1px rgba(0, 0, 0, 0.08);\n    box-shadow: inset 0 1px #a6a6a6, 0 0 0 1px rgba(0, 0, 0, 0.08);\n    font-family: \"Helvetica Neue\", sans-serif;\n    border-top: 20px solid #bbb;\n    background: #f0f0f0;\n    color: #444;\n    padding: 1em;\n    position: relative;\n    margin: 0 auto;\n    max-width: 100%;\n    width: 450px;\n    font-size: 1.1em;\n    line-height: 1.5em; }\n    .vex.vex-theme-os .vex-content h1, .vex.vex-theme-os .vex-content h2, .vex.vex-theme-os .vex-content h3, .vex.vex-theme-os .vex-content h4, .vex.vex-theme-os .vex-content h5, .vex.vex-theme-os .vex-content h6, .vex.vex-theme-os .vex-content p, .vex.vex-theme-os .vex-content ul, .vex.vex-theme-os .vex-content li {\n      color: inherit; }\n  .vex.vex-theme-os .vex-close {\n    -moz-border-radius: 0 5px 0 0;\n    -webkit-border-radius: 0 5px 0 0;\n    border-radius: 0 5px 0 0;\n    position: absolute;\n    top: 0;\n    right: 0;\n    cursor: pointer; }\n    .vex.vex-theme-os .vex-close:before {\n      -moz-border-radius: 3px;\n      -webkit-border-radius: 3px;\n      border-radius: 3px;\n      position: absolute;\n      content: \"\\D7\";\n      font-size: 26px;\n      font-weight: normal;\n      line-height: 31px;\n      height: 30px;\n      width: 30px;\n      text-align: center;\n      top: 3px;\n      right: 3px;\n      color: #bbb;\n      background: transparent; }\n    .vex.vex-theme-os .vex-close:hover:before, .vex.vex-theme-os .vex-close:active:before {\n      color: #777;\n      background: #e0e0e0; }\n  .vex.vex-theme-os .vex-dialog-form .vex-dialog-message {\n    margin-bottom: .5em; }\n  .vex.vex-theme-os .vex-dialog-form .vex-dialog-input {\n    margin-bottom: 1em; }\n    .vex.vex-theme-os .vex-dialog-form .vex-dialog-input textarea, .vex.vex-theme-os .vex-dialog-form .vex-dialog-input input[type=\"date\"], .vex.vex-theme-os .vex-dialog-form .vex-dialog-input input[type=\"datetime\"], .vex.vex-theme-os .vex-dialog-form .vex-dialog-input input[type=\"datetime-local\"], .vex.vex-theme-os .vex-dialog-form .vex-dialog-input input[type=\"email\"], .vex.vex-theme-os .vex-dialog-form .vex-dialog-input input[type=\"month\"], .vex.vex-theme-os .vex-dialog-form .vex-dialog-input input[type=\"number\"], .vex.vex-theme-os .vex-dialog-form .vex-dialog-input input[type=\"password\"], .vex.vex-theme-os .vex-dialog-form .vex-dialog-input input[type=\"search\"], .vex.vex-theme-os .vex-dialog-form .vex-dialog-input input[type=\"tel\"], .vex.vex-theme-os .vex-dialog-form .vex-dialog-input input[type=\"text\"], .vex.vex-theme-os .vex-dialog-form .vex-dialog-input input[type=\"time\"], .vex.vex-theme-os .vex-dialog-form .vex-dialog-input input[type=\"url\"], .vex.vex-theme-os .vex-dialog-form .vex-dialog-input input[type=\"week\"] {\n      -moz-border-radius: 3px;\n      -webkit-border-radius: 3px;\n      border-radius: 3px;\n      background: #fff;\n      width: 100%;\n      padding: .25em .67em;\n      border: 0;\n      font-family: inherit;\n      font-weight: inherit;\n      font-size: inherit;\n      min-height: 2.5em;\n      margin: 0 0 .25em; }\n      .vex.vex-theme-os .vex-dialog-form .vex-dialog-input textarea:focus, .vex.vex-theme-os .vex-dialog-form .vex-dialog-input input[type=\"date\"]:focus, .vex.vex-theme-os .vex-dialog-form .vex-dialog-input input[type=\"datetime\"]:focus, .vex.vex-theme-os .vex-dialog-form .vex-dialog-input input[type=\"datetime-local\"]:focus, .vex.vex-theme-os .vex-dialog-form .vex-dialog-input input[type=\"email\"]:focus, .vex.vex-theme-os .vex-dialog-form .vex-dialog-input input[type=\"month\"]:focus, .vex.vex-theme-os .vex-dialog-form .vex-dialog-input input[type=\"number\"]:focus, .vex.vex-theme-os .vex-dialog-form .vex-dialog-input input[type=\"password\"]:focus, .vex.vex-theme-os .vex-dialog-form .vex-dialog-input input[type=\"search\"]:focus, .vex.vex-theme-os .vex-dialog-form .vex-dialog-input input[type=\"tel\"]:focus, .vex.vex-theme-os .vex-dialog-form .vex-dialog-input input[type=\"text\"]:focus, .vex.vex-theme-os .vex-dialog-form .vex-dialog-input input[type=\"time\"]:focus, .vex.vex-theme-os .vex-dialog-form .vex-dialog-input input[type=\"url\"]:focus, .vex.vex-theme-os .vex-dialog-form .vex-dialog-input input[type=\"week\"]:focus {\n        -moz-box-shadow: inset 0 0 0 1px #3288e6;\n        -webkit-box-shadow: inset 0 0 0 1px #3288e6;\n        box-shadow: inset 0 0 0 1px #3288e6;\n        outline: none; }\n  .vex.vex-theme-os .vex-dialog-form .vex-dialog-buttons {\n    *zoom: 1; }\n    .vex.vex-theme-os .vex-dialog-form .vex-dialog-buttons:after {\n      content: \"\";\n      display: table;\n      clear: both; }\n  .vex.vex-theme-os .vex-dialog-button {\n    -moz-border-radius: 3px;\n    -webkit-border-radius: 3px;\n    border-radius: 3px;\n    border: 0;\n    float: right;\n    margin: 0 0 0 .5em;\n    font-family: inherit;\n    text-transform: uppercase;\n    letter-spacing: .1em;\n    font-size: .8em;\n    line-height: 1em;\n    padding: .75em 2em; }\n    .vex.vex-theme-os .vex-dialog-button.vex-last {\n      margin-left: 0; }\n    .vex.vex-theme-os .vex-dialog-button:focus {\n      animation: vex-pulse 1.1s infinite;\n      -webkit-animation: vex-pulse 1.1s infinite;\n      -moz-animation: vex-pulse 1.1s infinite;\n      -ms-animation: vex-pulse 1.1s infinite;\n      -o-animation: vex-pulse 1.1s infinite;\n      -webkit-backface-visibility: hidden;\n      outline: none; }\n      @media (max-width: 568px) {\n        .vex.vex-theme-os .vex-dialog-button:focus {\n          animation: none;\n          -webkit-animation: none;\n          -moz-animation: none;\n          -ms-animation: none;\n          -o-animation: none;\n          -webkit-backface-visibility: hidden; } }\n    .vex.vex-theme-os .vex-dialog-button.vex-dialog-button-primary {\n      background: #3288e6;\n      color: #fff; }\n    .vex.vex-theme-os .vex-dialog-button.vex-dialog-button-secondary {\n      background: #e0e0e0;\n      color: #777; }\n\n.vex-loading-spinner.vex-theme-os {\n  -moz-box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.2), 0 0 0.5em rgba(0, 0, 0, 0.2);\n  -webkit-box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.2), 0 0 0.5em rgba(0, 0, 0, 0.2);\n  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.2), 0 0 0.5em rgba(0, 0, 0, 0.2);\n  -moz-border-radius: 100%;\n  -webkit-border-radius: 100%;\n  border-radius: 100%;\n  background: rgba(255, 255, 255, 0.2);\n  width: 0;\n  height: 0;\n  border: 1.2em solid #bbb;\n  border-top-color: #f0f0f0;\n  border-bottom-color: #f0f0f0; }\n", ""]);

// exports


/***/ },

/***/ 568:
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(37)();
// imports


// module
exports.push([module.i, "@keyframes vex-pulse {\n  0% {\n    -moz-box-shadow: inset 0 0 0 300px transparent;\n    -webkit-box-shadow: inset 0 0 0 300px transparent;\n    box-shadow: inset 0 0 0 300px transparent; }\n  70% {\n    -moz-box-shadow: inset 0 0 0 300px rgba(255, 255, 255, 0.25);\n    -webkit-box-shadow: inset 0 0 0 300px rgba(255, 255, 255, 0.25);\n    box-shadow: inset 0 0 0 300px rgba(255, 255, 255, 0.25); }\n  100% {\n    -moz-box-shadow: inset 0 0 0 300px transparent;\n    -webkit-box-shadow: inset 0 0 0 300px transparent;\n    box-shadow: inset 0 0 0 300px transparent; } }\n\n@-webkit-keyframes vex-pulse {\n  0% {\n    -moz-box-shadow: inset 0 0 0 300px transparent;\n    -webkit-box-shadow: inset 0 0 0 300px transparent;\n    box-shadow: inset 0 0 0 300px transparent; }\n  70% {\n    -moz-box-shadow: inset 0 0 0 300px rgba(255, 255, 255, 0.25);\n    -webkit-box-shadow: inset 0 0 0 300px rgba(255, 255, 255, 0.25);\n    box-shadow: inset 0 0 0 300px rgba(255, 255, 255, 0.25); }\n  100% {\n    -moz-box-shadow: inset 0 0 0 300px transparent;\n    -webkit-box-shadow: inset 0 0 0 300px transparent;\n    box-shadow: inset 0 0 0 300px transparent; } }\n\n@-moz-keyframes vex-pulse {\n  0% {\n    -moz-box-shadow: inset 0 0 0 300px transparent;\n    -webkit-box-shadow: inset 0 0 0 300px transparent;\n    box-shadow: inset 0 0 0 300px transparent; }\n  70% {\n    -moz-box-shadow: inset 0 0 0 300px rgba(255, 255, 255, 0.25);\n    -webkit-box-shadow: inset 0 0 0 300px rgba(255, 255, 255, 0.25);\n    box-shadow: inset 0 0 0 300px rgba(255, 255, 255, 0.25); }\n  100% {\n    -moz-box-shadow: inset 0 0 0 300px transparent;\n    -webkit-box-shadow: inset 0 0 0 300px transparent;\n    box-shadow: inset 0 0 0 300px transparent; } }\n\n@-ms-keyframes vex-pulse {\n  0% {\n    -moz-box-shadow: inset 0 0 0 300px transparent;\n    -webkit-box-shadow: inset 0 0 0 300px transparent;\n    box-shadow: inset 0 0 0 300px transparent; }\n  70% {\n    -moz-box-shadow: inset 0 0 0 300px rgba(255, 255, 255, 0.25);\n    -webkit-box-shadow: inset 0 0 0 300px rgba(255, 255, 255, 0.25);\n    box-shadow: inset 0 0 0 300px rgba(255, 255, 255, 0.25); }\n  100% {\n    -moz-box-shadow: inset 0 0 0 300px transparent;\n    -webkit-box-shadow: inset 0 0 0 300px transparent;\n    box-shadow: inset 0 0 0 300px transparent; } }\n\n@-o-keyframes vex-pulse {\n  0% {\n    -moz-box-shadow: inset 0 0 0 300px transparent;\n    -webkit-box-shadow: inset 0 0 0 300px transparent;\n    box-shadow: inset 0 0 0 300px transparent; }\n  70% {\n    -moz-box-shadow: inset 0 0 0 300px rgba(255, 255, 255, 0.25);\n    -webkit-box-shadow: inset 0 0 0 300px rgba(255, 255, 255, 0.25);\n    box-shadow: inset 0 0 0 300px rgba(255, 255, 255, 0.25); }\n  100% {\n    -moz-box-shadow: inset 0 0 0 300px transparent;\n    -webkit-box-shadow: inset 0 0 0 300px transparent;\n    box-shadow: inset 0 0 0 300px transparent; } }\n\n.vex.vex-theme-plain {\n  padding-top: 160px;\n  padding-bottom: 160px; }\n  .vex.vex-theme-plain .vex-content {\n    font-family: \"Helvetica Neue\", sans-serif;\n    background: #fff;\n    color: #444;\n    padding: 1em;\n    position: relative;\n    margin: 0 auto;\n    max-width: 100%;\n    width: 450px;\n    font-size: 1.1em;\n    line-height: 1.5em; }\n    .vex.vex-theme-plain .vex-content h1, .vex.vex-theme-plain .vex-content h2, .vex.vex-theme-plain .vex-content h3, .vex.vex-theme-plain .vex-content h4, .vex.vex-theme-plain .vex-content h5, .vex.vex-theme-plain .vex-content h6, .vex.vex-theme-plain .vex-content p, .vex.vex-theme-plain .vex-content ul, .vex.vex-theme-plain .vex-content li {\n      color: inherit; }\n  .vex.vex-theme-plain .vex-close {\n    position: absolute;\n    top: 0;\n    right: 0;\n    cursor: pointer; }\n    .vex.vex-theme-plain .vex-close:before {\n      position: absolute;\n      content: \"\\D7\";\n      font-size: 26px;\n      font-weight: normal;\n      line-height: 31px;\n      height: 30px;\n      width: 30px;\n      text-align: center;\n      top: 3px;\n      right: 3px;\n      color: #bbb;\n      background: transparent; }\n    .vex.vex-theme-plain .vex-close:hover:before, .vex.vex-theme-plain .vex-close:active:before {\n      color: #777;\n      background: #e0e0e0; }\n  .vex.vex-theme-plain .vex-dialog-form .vex-dialog-message {\n    margin-bottom: .5em; }\n  .vex.vex-theme-plain .vex-dialog-form .vex-dialog-input {\n    margin-bottom: 1em; }\n    .vex.vex-theme-plain .vex-dialog-form .vex-dialog-input textarea, .vex.vex-theme-plain .vex-dialog-form .vex-dialog-input input[type=\"date\"], .vex.vex-theme-plain .vex-dialog-form .vex-dialog-input input[type=\"datetime\"], .vex.vex-theme-plain .vex-dialog-form .vex-dialog-input input[type=\"datetime-local\"], .vex.vex-theme-plain .vex-dialog-form .vex-dialog-input input[type=\"email\"], .vex.vex-theme-plain .vex-dialog-form .vex-dialog-input input[type=\"month\"], .vex.vex-theme-plain .vex-dialog-form .vex-dialog-input input[type=\"number\"], .vex.vex-theme-plain .vex-dialog-form .vex-dialog-input input[type=\"password\"], .vex.vex-theme-plain .vex-dialog-form .vex-dialog-input input[type=\"search\"], .vex.vex-theme-plain .vex-dialog-form .vex-dialog-input input[type=\"tel\"], .vex.vex-theme-plain .vex-dialog-form .vex-dialog-input input[type=\"text\"], .vex.vex-theme-plain .vex-dialog-form .vex-dialog-input input[type=\"time\"], .vex.vex-theme-plain .vex-dialog-form .vex-dialog-input input[type=\"url\"], .vex.vex-theme-plain .vex-dialog-form .vex-dialog-input input[type=\"week\"] {\n      background: #f0f0f0;\n      width: 100%;\n      padding: .25em .67em;\n      border: 0;\n      font-family: inherit;\n      font-weight: inherit;\n      font-size: inherit;\n      min-height: 2.5em;\n      margin: 0 0 .25em; }\n      .vex.vex-theme-plain .vex-dialog-form .vex-dialog-input textarea:focus, .vex.vex-theme-plain .vex-dialog-form .vex-dialog-input input[type=\"date\"]:focus, .vex.vex-theme-plain .vex-dialog-form .vex-dialog-input input[type=\"datetime\"]:focus, .vex.vex-theme-plain .vex-dialog-form .vex-dialog-input input[type=\"datetime-local\"]:focus, .vex.vex-theme-plain .vex-dialog-form .vex-dialog-input input[type=\"email\"]:focus, .vex.vex-theme-plain .vex-dialog-form .vex-dialog-input input[type=\"month\"]:focus, .vex.vex-theme-plain .vex-dialog-form .vex-dialog-input input[type=\"number\"]:focus, .vex.vex-theme-plain .vex-dialog-form .vex-dialog-input input[type=\"password\"]:focus, .vex.vex-theme-plain .vex-dialog-form .vex-dialog-input input[type=\"search\"]:focus, .vex.vex-theme-plain .vex-dialog-form .vex-dialog-input input[type=\"tel\"]:focus, .vex.vex-theme-plain .vex-dialog-form .vex-dialog-input input[type=\"text\"]:focus, .vex.vex-theme-plain .vex-dialog-form .vex-dialog-input input[type=\"time\"]:focus, .vex.vex-theme-plain .vex-dialog-form .vex-dialog-input input[type=\"url\"]:focus, .vex.vex-theme-plain .vex-dialog-form .vex-dialog-input input[type=\"week\"]:focus {\n        -moz-box-shadow: inset 0 0 0 2px rgba(0, 0, 0, 0.2);\n        -webkit-box-shadow: inset 0 0 0 2px rgba(0, 0, 0, 0.2);\n        box-shadow: inset 0 0 0 2px rgba(0, 0, 0, 0.2);\n        outline: none; }\n  .vex.vex-theme-plain .vex-dialog-form .vex-dialog-buttons {\n    *zoom: 1; }\n    .vex.vex-theme-plain .vex-dialog-form .vex-dialog-buttons:after {\n      content: \"\";\n      display: table;\n      clear: both; }\n  .vex.vex-theme-plain .vex-dialog-button {\n    -moz-border-radius: 0;\n    -webkit-border-radius: 0;\n    border-radius: 0;\n    border: 0;\n    float: right;\n    margin: 0 0 0 .5em;\n    font-family: inherit;\n    text-transform: uppercase;\n    letter-spacing: .1em;\n    font-size: .8em;\n    line-height: 1em;\n    padding: .75em 2em; }\n    .vex.vex-theme-plain .vex-dialog-button.vex-last {\n      margin-left: 0; }\n    .vex.vex-theme-plain .vex-dialog-button:focus {\n      animation: vex-pulse 1.1s infinite;\n      -webkit-animation: vex-pulse 1.1s infinite;\n      -moz-animation: vex-pulse 1.1s infinite;\n      -ms-animation: vex-pulse 1.1s infinite;\n      -o-animation: vex-pulse 1.1s infinite;\n      -webkit-backface-visibility: hidden;\n      outline: none; }\n      @media (max-width: 568px) {\n        .vex.vex-theme-plain .vex-dialog-button:focus {\n          animation: none;\n          -webkit-animation: none;\n          -moz-animation: none;\n          -ms-animation: none;\n          -o-animation: none;\n          -webkit-backface-visibility: hidden; } }\n    .vex.vex-theme-plain .vex-dialog-button.vex-dialog-button-primary {\n      background: #3288e6;\n      color: #fff; }\n    .vex.vex-theme-plain .vex-dialog-button.vex-dialog-button-secondary {\n      background: #e0e0e0;\n      color: #777; }\n\n.vex-loading-spinner.vex-theme-plain {\n  height: 2.5em;\n  width: 2.5em; }\n", ""]);

// exports


/***/ },

/***/ 569:
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(37)();
// imports


// module
exports.push([module.i, "@keyframes vex-dropin {\n  0% {\n    transform: translateY(0);\n    -webkit-transform: translateY(0);\n    -moz-transform: translateY(0);\n    -ms-transform: translateY(0);\n    -o-transform: translateY(0);\n    opacity: 0; }\n  1% {\n    transform: translateY(-800px);\n    -webkit-transform: translateY(-800px);\n    -moz-transform: translateY(-800px);\n    -ms-transform: translateY(-800px);\n    -o-transform: translateY(-800px);\n    opacity: 0; }\n  2% {\n    transform: translateY(-800px);\n    -webkit-transform: translateY(-800px);\n    -moz-transform: translateY(-800px);\n    -ms-transform: translateY(-800px);\n    -o-transform: translateY(-800px);\n    opacity: 1; }\n  100% {\n    transform: translateY(0);\n    -webkit-transform: translateY(0);\n    -moz-transform: translateY(0);\n    -ms-transform: translateY(0);\n    -o-transform: translateY(0);\n    opacity: 1; } }\n\n@-webkit-keyframes vex-dropin {\n  0% {\n    transform: translateY(0);\n    -webkit-transform: translateY(0);\n    -moz-transform: translateY(0);\n    -ms-transform: translateY(0);\n    -o-transform: translateY(0);\n    opacity: 0; }\n  1% {\n    transform: translateY(-800px);\n    -webkit-transform: translateY(-800px);\n    -moz-transform: translateY(-800px);\n    -ms-transform: translateY(-800px);\n    -o-transform: translateY(-800px);\n    opacity: 0; }\n  2% {\n    transform: translateY(-800px);\n    -webkit-transform: translateY(-800px);\n    -moz-transform: translateY(-800px);\n    -ms-transform: translateY(-800px);\n    -o-transform: translateY(-800px);\n    opacity: 1; }\n  100% {\n    transform: translateY(0);\n    -webkit-transform: translateY(0);\n    -moz-transform: translateY(0);\n    -ms-transform: translateY(0);\n    -o-transform: translateY(0);\n    opacity: 1; } }\n\n@-moz-keyframes vex-dropin {\n  0% {\n    transform: translateY(0);\n    -webkit-transform: translateY(0);\n    -moz-transform: translateY(0);\n    -ms-transform: translateY(0);\n    -o-transform: translateY(0);\n    opacity: 0; }\n  1% {\n    transform: translateY(-800px);\n    -webkit-transform: translateY(-800px);\n    -moz-transform: translateY(-800px);\n    -ms-transform: translateY(-800px);\n    -o-transform: translateY(-800px);\n    opacity: 0; }\n  2% {\n    transform: translateY(-800px);\n    -webkit-transform: translateY(-800px);\n    -moz-transform: translateY(-800px);\n    -ms-transform: translateY(-800px);\n    -o-transform: translateY(-800px);\n    opacity: 1; }\n  100% {\n    transform: translateY(0);\n    -webkit-transform: translateY(0);\n    -moz-transform: translateY(0);\n    -ms-transform: translateY(0);\n    -o-transform: translateY(0);\n    opacity: 1; } }\n\n@-ms-keyframes vex-dropin {\n  0% {\n    transform: translateY(0);\n    -webkit-transform: translateY(0);\n    -moz-transform: translateY(0);\n    -ms-transform: translateY(0);\n    -o-transform: translateY(0);\n    opacity: 0; }\n  1% {\n    transform: translateY(-800px);\n    -webkit-transform: translateY(-800px);\n    -moz-transform: translateY(-800px);\n    -ms-transform: translateY(-800px);\n    -o-transform: translateY(-800px);\n    opacity: 0; }\n  2% {\n    transform: translateY(-800px);\n    -webkit-transform: translateY(-800px);\n    -moz-transform: translateY(-800px);\n    -ms-transform: translateY(-800px);\n    -o-transform: translateY(-800px);\n    opacity: 1; }\n  100% {\n    transform: translateY(0);\n    -webkit-transform: translateY(0);\n    -moz-transform: translateY(0);\n    -ms-transform: translateY(0);\n    -o-transform: translateY(0);\n    opacity: 1; } }\n\n@-o-keyframes vex-dropin {\n  0% {\n    transform: translateY(0);\n    -webkit-transform: translateY(0);\n    -moz-transform: translateY(0);\n    -ms-transform: translateY(0);\n    -o-transform: translateY(0);\n    opacity: 0; }\n  1% {\n    transform: translateY(-800px);\n    -webkit-transform: translateY(-800px);\n    -moz-transform: translateY(-800px);\n    -ms-transform: translateY(-800px);\n    -o-transform: translateY(-800px);\n    opacity: 0; }\n  2% {\n    transform: translateY(-800px);\n    -webkit-transform: translateY(-800px);\n    -moz-transform: translateY(-800px);\n    -ms-transform: translateY(-800px);\n    -o-transform: translateY(-800px);\n    opacity: 1; }\n  100% {\n    transform: translateY(0);\n    -webkit-transform: translateY(0);\n    -moz-transform: translateY(0);\n    -ms-transform: translateY(0);\n    -o-transform: translateY(0);\n    opacity: 1; } }\n\n@keyframes vex-dropout {\n  0% {\n    transform: translateY(0);\n    -webkit-transform: translateY(0);\n    -moz-transform: translateY(0);\n    -ms-transform: translateY(0);\n    -o-transform: translateY(0); }\n  100% {\n    transform: translateY(-800px);\n    -webkit-transform: translateY(-800px);\n    -moz-transform: translateY(-800px);\n    -ms-transform: translateY(-800px);\n    -o-transform: translateY(-800px); } }\n\n@-webkit-keyframes vex-dropout {\n  0% {\n    transform: translateY(0);\n    -webkit-transform: translateY(0);\n    -moz-transform: translateY(0);\n    -ms-transform: translateY(0);\n    -o-transform: translateY(0); }\n  100% {\n    transform: translateY(-800px);\n    -webkit-transform: translateY(-800px);\n    -moz-transform: translateY(-800px);\n    -ms-transform: translateY(-800px);\n    -o-transform: translateY(-800px); } }\n\n@-moz-keyframes vex-dropout {\n  0% {\n    transform: translateY(0);\n    -webkit-transform: translateY(0);\n    -moz-transform: translateY(0);\n    -ms-transform: translateY(0);\n    -o-transform: translateY(0); }\n  100% {\n    transform: translateY(-800px);\n    -webkit-transform: translateY(-800px);\n    -moz-transform: translateY(-800px);\n    -ms-transform: translateY(-800px);\n    -o-transform: translateY(-800px); } }\n\n@-ms-keyframes vex-dropout {\n  0% {\n    transform: translateY(0);\n    -webkit-transform: translateY(0);\n    -moz-transform: translateY(0);\n    -ms-transform: translateY(0);\n    -o-transform: translateY(0); }\n  100% {\n    transform: translateY(-800px);\n    -webkit-transform: translateY(-800px);\n    -moz-transform: translateY(-800px);\n    -ms-transform: translateY(-800px);\n    -o-transform: translateY(-800px); } }\n\n@-o-keyframes vex-dropout {\n  0% {\n    transform: translateY(0);\n    -webkit-transform: translateY(0);\n    -moz-transform: translateY(0);\n    -ms-transform: translateY(0);\n    -o-transform: translateY(0); }\n  100% {\n    transform: translateY(-800px);\n    -webkit-transform: translateY(-800px);\n    -moz-transform: translateY(-800px);\n    -ms-transform: translateY(-800px);\n    -o-transform: translateY(-800px); } }\n\n@keyframes vex-pulse {\n  0% {\n    -moz-box-shadow: inset 0 0 0 300px transparent;\n    -webkit-box-shadow: inset 0 0 0 300px transparent;\n    box-shadow: inset 0 0 0 300px transparent; }\n  70% {\n    -moz-box-shadow: inset 0 0 0 300px rgba(255, 255, 255, 0.25);\n    -webkit-box-shadow: inset 0 0 0 300px rgba(255, 255, 255, 0.25);\n    box-shadow: inset 0 0 0 300px rgba(255, 255, 255, 0.25); }\n  100% {\n    -moz-box-shadow: inset 0 0 0 300px transparent;\n    -webkit-box-shadow: inset 0 0 0 300px transparent;\n    box-shadow: inset 0 0 0 300px transparent; } }\n\n@-webkit-keyframes vex-pulse {\n  0% {\n    -moz-box-shadow: inset 0 0 0 300px transparent;\n    -webkit-box-shadow: inset 0 0 0 300px transparent;\n    box-shadow: inset 0 0 0 300px transparent; }\n  70% {\n    -moz-box-shadow: inset 0 0 0 300px rgba(255, 255, 255, 0.25);\n    -webkit-box-shadow: inset 0 0 0 300px rgba(255, 255, 255, 0.25);\n    box-shadow: inset 0 0 0 300px rgba(255, 255, 255, 0.25); }\n  100% {\n    -moz-box-shadow: inset 0 0 0 300px transparent;\n    -webkit-box-shadow: inset 0 0 0 300px transparent;\n    box-shadow: inset 0 0 0 300px transparent; } }\n\n@-moz-keyframes vex-pulse {\n  0% {\n    -moz-box-shadow: inset 0 0 0 300px transparent;\n    -webkit-box-shadow: inset 0 0 0 300px transparent;\n    box-shadow: inset 0 0 0 300px transparent; }\n  70% {\n    -moz-box-shadow: inset 0 0 0 300px rgba(255, 255, 255, 0.25);\n    -webkit-box-shadow: inset 0 0 0 300px rgba(255, 255, 255, 0.25);\n    box-shadow: inset 0 0 0 300px rgba(255, 255, 255, 0.25); }\n  100% {\n    -moz-box-shadow: inset 0 0 0 300px transparent;\n    -webkit-box-shadow: inset 0 0 0 300px transparent;\n    box-shadow: inset 0 0 0 300px transparent; } }\n\n@-ms-keyframes vex-pulse {\n  0% {\n    -moz-box-shadow: inset 0 0 0 300px transparent;\n    -webkit-box-shadow: inset 0 0 0 300px transparent;\n    box-shadow: inset 0 0 0 300px transparent; }\n  70% {\n    -moz-box-shadow: inset 0 0 0 300px rgba(255, 255, 255, 0.25);\n    -webkit-box-shadow: inset 0 0 0 300px rgba(255, 255, 255, 0.25);\n    box-shadow: inset 0 0 0 300px rgba(255, 255, 255, 0.25); }\n  100% {\n    -moz-box-shadow: inset 0 0 0 300px transparent;\n    -webkit-box-shadow: inset 0 0 0 300px transparent;\n    box-shadow: inset 0 0 0 300px transparent; } }\n\n@-o-keyframes vex-pulse {\n  0% {\n    -moz-box-shadow: inset 0 0 0 300px transparent;\n    -webkit-box-shadow: inset 0 0 0 300px transparent;\n    box-shadow: inset 0 0 0 300px transparent; }\n  70% {\n    -moz-box-shadow: inset 0 0 0 300px rgba(255, 255, 255, 0.25);\n    -webkit-box-shadow: inset 0 0 0 300px rgba(255, 255, 255, 0.25);\n    box-shadow: inset 0 0 0 300px rgba(255, 255, 255, 0.25); }\n  100% {\n    -moz-box-shadow: inset 0 0 0 300px transparent;\n    -webkit-box-shadow: inset 0 0 0 300px transparent;\n    box-shadow: inset 0 0 0 300px transparent; } }\n\n.vex.vex-theme-top.vex-closing .vex-content {\n  animation: vex-dropout 0.5s;\n  -webkit-animation: vex-dropout 0.5s;\n  -moz-animation: vex-dropout 0.5s;\n  -ms-animation: vex-dropout 0.5s;\n  -o-animation: vex-dropout 0.5s;\n  -webkit-backface-visibility: hidden; }\n\n.vex.vex-theme-top .vex-content {\n  animation: vex-dropin 0.5s;\n  -webkit-animation: vex-dropin 0.5s;\n  -moz-animation: vex-dropin 0.5s;\n  -ms-animation: vex-dropin 0.5s;\n  -o-animation: vex-dropin 0.5s;\n  -webkit-backface-visibility: hidden; }\n\n.vex.vex-theme-top .vex-content {\n  -moz-border-radius: 0 0 5px 5px;\n  -webkit-border-radius: 0 0 5px 5px;\n  border-radius: 0 0 5px 5px;\n  font-family: \"Helvetica Neue\", sans-serif;\n  background: #f0f0f0;\n  color: #444;\n  padding: 1em;\n  position: relative;\n  margin: 0 auto;\n  max-width: 100%;\n  width: 450px;\n  font-size: 1.1em;\n  line-height: 1.5em; }\n  .vex.vex-theme-top .vex-content h1, .vex.vex-theme-top .vex-content h2, .vex.vex-theme-top .vex-content h3, .vex.vex-theme-top .vex-content h4, .vex.vex-theme-top .vex-content h5, .vex.vex-theme-top .vex-content h6, .vex.vex-theme-top .vex-content p, .vex.vex-theme-top .vex-content ul, .vex.vex-theme-top .vex-content li {\n    color: inherit; }\n\n.vex.vex-theme-top .vex-close {\n  -moz-border-radius: 5px;\n  -webkit-border-radius: 5px;\n  border-radius: 5px;\n  position: absolute;\n  top: 0;\n  right: 0;\n  cursor: pointer; }\n  .vex.vex-theme-top .vex-close:before {\n    -moz-border-radius: 3px;\n    -webkit-border-radius: 3px;\n    border-radius: 3px;\n    position: absolute;\n    content: \"\\D7\";\n    font-size: 26px;\n    font-weight: normal;\n    line-height: 31px;\n    height: 30px;\n    width: 30px;\n    text-align: center;\n    top: 3px;\n    right: 3px;\n    color: #bbb;\n    background: transparent; }\n  .vex.vex-theme-top .vex-close:hover:before, .vex.vex-theme-top .vex-close:active:before {\n    color: #777;\n    background: #e0e0e0; }\n\n.vex.vex-theme-top .vex-dialog-form .vex-dialog-message {\n  margin-bottom: .5em; }\n\n.vex.vex-theme-top .vex-dialog-form .vex-dialog-input {\n  margin-bottom: 1em; }\n  .vex.vex-theme-top .vex-dialog-form .vex-dialog-input textarea, .vex.vex-theme-top .vex-dialog-form .vex-dialog-input input[type=\"date\"], .vex.vex-theme-top .vex-dialog-form .vex-dialog-input input[type=\"datetime\"], .vex.vex-theme-top .vex-dialog-form .vex-dialog-input input[type=\"datetime-local\"], .vex.vex-theme-top .vex-dialog-form .vex-dialog-input input[type=\"email\"], .vex.vex-theme-top .vex-dialog-form .vex-dialog-input input[type=\"month\"], .vex.vex-theme-top .vex-dialog-form .vex-dialog-input input[type=\"number\"], .vex.vex-theme-top .vex-dialog-form .vex-dialog-input input[type=\"password\"], .vex.vex-theme-top .vex-dialog-form .vex-dialog-input input[type=\"search\"], .vex.vex-theme-top .vex-dialog-form .vex-dialog-input input[type=\"tel\"], .vex.vex-theme-top .vex-dialog-form .vex-dialog-input input[type=\"text\"], .vex.vex-theme-top .vex-dialog-form .vex-dialog-input input[type=\"time\"], .vex.vex-theme-top .vex-dialog-form .vex-dialog-input input[type=\"url\"], .vex.vex-theme-top .vex-dialog-form .vex-dialog-input input[type=\"week\"] {\n    -moz-border-radius: 3px;\n    -webkit-border-radius: 3px;\n    border-radius: 3px;\n    background: #fff;\n    width: 100%;\n    padding: .25em .67em;\n    border: 0;\n    font-family: inherit;\n    font-weight: inherit;\n    font-size: inherit;\n    min-height: 2.5em;\n    margin: 0 0 .25em; }\n    .vex.vex-theme-top .vex-dialog-form .vex-dialog-input textarea:focus, .vex.vex-theme-top .vex-dialog-form .vex-dialog-input input[type=\"date\"]:focus, .vex.vex-theme-top .vex-dialog-form .vex-dialog-input input[type=\"datetime\"]:focus, .vex.vex-theme-top .vex-dialog-form .vex-dialog-input input[type=\"datetime-local\"]:focus, .vex.vex-theme-top .vex-dialog-form .vex-dialog-input input[type=\"email\"]:focus, .vex.vex-theme-top .vex-dialog-form .vex-dialog-input input[type=\"month\"]:focus, .vex.vex-theme-top .vex-dialog-form .vex-dialog-input input[type=\"number\"]:focus, .vex.vex-theme-top .vex-dialog-form .vex-dialog-input input[type=\"password\"]:focus, .vex.vex-theme-top .vex-dialog-form .vex-dialog-input input[type=\"search\"]:focus, .vex.vex-theme-top .vex-dialog-form .vex-dialog-input input[type=\"tel\"]:focus, .vex.vex-theme-top .vex-dialog-form .vex-dialog-input input[type=\"text\"]:focus, .vex.vex-theme-top .vex-dialog-form .vex-dialog-input input[type=\"time\"]:focus, .vex.vex-theme-top .vex-dialog-form .vex-dialog-input input[type=\"url\"]:focus, .vex.vex-theme-top .vex-dialog-form .vex-dialog-input input[type=\"week\"]:focus {\n      -moz-box-shadow: inset 0 0 0 2px #8dbdf1;\n      -webkit-box-shadow: inset 0 0 0 2px #8dbdf1;\n      box-shadow: inset 0 0 0 2px #8dbdf1;\n      outline: none; }\n\n.vex.vex-theme-top .vex-dialog-form .vex-dialog-buttons {\n  *zoom: 1; }\n  .vex.vex-theme-top .vex-dialog-form .vex-dialog-buttons:after {\n    content: \"\";\n    display: table;\n    clear: both; }\n\n.vex.vex-theme-top .vex-dialog-button {\n  -moz-border-radius: 3px;\n  -webkit-border-radius: 3px;\n  border-radius: 3px;\n  border: 0;\n  float: right;\n  margin: 0 0 0 .5em;\n  font-family: inherit;\n  text-transform: uppercase;\n  letter-spacing: .1em;\n  font-size: .8em;\n  line-height: 1em;\n  padding: .75em 2em; }\n  .vex.vex-theme-top .vex-dialog-button.vex-last {\n    margin-left: 0; }\n  .vex.vex-theme-top .vex-dialog-button:focus {\n    animation: vex-pulse 1.1s infinite;\n    -webkit-animation: vex-pulse 1.1s infinite;\n    -moz-animation: vex-pulse 1.1s infinite;\n    -ms-animation: vex-pulse 1.1s infinite;\n    -o-animation: vex-pulse 1.1s infinite;\n    -webkit-backface-visibility: hidden;\n    outline: none; }\n    @media (max-width: 568px) {\n      .vex.vex-theme-top .vex-dialog-button:focus {\n        animation: none;\n        -webkit-animation: none;\n        -moz-animation: none;\n        -ms-animation: none;\n        -o-animation: none;\n        -webkit-backface-visibility: hidden; } }\n  .vex.vex-theme-top .vex-dialog-button.vex-dialog-button-primary {\n    background: #3288e6;\n    color: #fff; }\n  .vex.vex-theme-top .vex-dialog-button.vex-dialog-button-secondary {\n    background: #e0e0e0;\n    color: #777; }\n\n.vex-loading-spinner.vex-theme-top {\n  -moz-box-shadow: 0 0 0 0.5em #f0f0f0, 0 0 1px 0.5em rgba(0, 0, 0, 0.3);\n  -webkit-box-shadow: 0 0 0 0.5em #f0f0f0, 0 0 1px 0.5em rgba(0, 0, 0, 0.3);\n  box-shadow: 0 0 0 0.5em #f0f0f0, 0 0 1px 0.5em rgba(0, 0, 0, 0.3);\n  -moz-border-radius: 100%;\n  -webkit-border-radius: 100%;\n  border-radius: 100%;\n  background: #f0f0f0;\n  border: .2em solid transparent;\n  border-top-color: #bbb;\n  top: -1.1em;\n  bottom: auto; }\n", ""]);

// exports


/***/ },

/***/ 570:
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(37)();
// imports


// module
exports.push([module.i, "@keyframes vex-pulse {\n  0% {\n    -moz-box-shadow: inset 0 0 0 300px transparent;\n    -webkit-box-shadow: inset 0 0 0 300px transparent;\n    box-shadow: inset 0 0 0 300px transparent; }\n  70% {\n    -moz-box-shadow: inset 0 0 0 300px rgba(255, 255, 255, 0.25);\n    -webkit-box-shadow: inset 0 0 0 300px rgba(255, 255, 255, 0.25);\n    box-shadow: inset 0 0 0 300px rgba(255, 255, 255, 0.25); }\n  100% {\n    -moz-box-shadow: inset 0 0 0 300px transparent;\n    -webkit-box-shadow: inset 0 0 0 300px transparent;\n    box-shadow: inset 0 0 0 300px transparent; } }\n\n@-webkit-keyframes vex-pulse {\n  0% {\n    -moz-box-shadow: inset 0 0 0 300px transparent;\n    -webkit-box-shadow: inset 0 0 0 300px transparent;\n    box-shadow: inset 0 0 0 300px transparent; }\n  70% {\n    -moz-box-shadow: inset 0 0 0 300px rgba(255, 255, 255, 0.25);\n    -webkit-box-shadow: inset 0 0 0 300px rgba(255, 255, 255, 0.25);\n    box-shadow: inset 0 0 0 300px rgba(255, 255, 255, 0.25); }\n  100% {\n    -moz-box-shadow: inset 0 0 0 300px transparent;\n    -webkit-box-shadow: inset 0 0 0 300px transparent;\n    box-shadow: inset 0 0 0 300px transparent; } }\n\n@-moz-keyframes vex-pulse {\n  0% {\n    -moz-box-shadow: inset 0 0 0 300px transparent;\n    -webkit-box-shadow: inset 0 0 0 300px transparent;\n    box-shadow: inset 0 0 0 300px transparent; }\n  70% {\n    -moz-box-shadow: inset 0 0 0 300px rgba(255, 255, 255, 0.25);\n    -webkit-box-shadow: inset 0 0 0 300px rgba(255, 255, 255, 0.25);\n    box-shadow: inset 0 0 0 300px rgba(255, 255, 255, 0.25); }\n  100% {\n    -moz-box-shadow: inset 0 0 0 300px transparent;\n    -webkit-box-shadow: inset 0 0 0 300px transparent;\n    box-shadow: inset 0 0 0 300px transparent; } }\n\n@-ms-keyframes vex-pulse {\n  0% {\n    -moz-box-shadow: inset 0 0 0 300px transparent;\n    -webkit-box-shadow: inset 0 0 0 300px transparent;\n    box-shadow: inset 0 0 0 300px transparent; }\n  70% {\n    -moz-box-shadow: inset 0 0 0 300px rgba(255, 255, 255, 0.25);\n    -webkit-box-shadow: inset 0 0 0 300px rgba(255, 255, 255, 0.25);\n    box-shadow: inset 0 0 0 300px rgba(255, 255, 255, 0.25); }\n  100% {\n    -moz-box-shadow: inset 0 0 0 300px transparent;\n    -webkit-box-shadow: inset 0 0 0 300px transparent;\n    box-shadow: inset 0 0 0 300px transparent; } }\n\n@-o-keyframes vex-pulse {\n  0% {\n    -moz-box-shadow: inset 0 0 0 300px transparent;\n    -webkit-box-shadow: inset 0 0 0 300px transparent;\n    box-shadow: inset 0 0 0 300px transparent; }\n  70% {\n    -moz-box-shadow: inset 0 0 0 300px rgba(255, 255, 255, 0.25);\n    -webkit-box-shadow: inset 0 0 0 300px rgba(255, 255, 255, 0.25);\n    box-shadow: inset 0 0 0 300px rgba(255, 255, 255, 0.25); }\n  100% {\n    -moz-box-shadow: inset 0 0 0 300px transparent;\n    -webkit-box-shadow: inset 0 0 0 300px transparent;\n    box-shadow: inset 0 0 0 300px transparent; } }\n\n.vex.vex-theme-wireframe {\n  padding-top: 160px;\n  padding-bottom: 160px; }\n  .vex.vex-theme-wireframe .vex-overlay {\n    background: rgba(255, 255, 255, 0.4); }\n  .vex.vex-theme-wireframe .vex-content {\n    font-family: \"Helvetica Neue\", sans-serif;\n    background: #fff;\n    color: #000;\n    border: 2px solid #000;\n    padding: 2em;\n    position: relative;\n    margin: 0 auto;\n    max-width: 100%;\n    width: 400px;\n    font-size: 1.1em;\n    line-height: 1.5em; }\n    .vex.vex-theme-wireframe .vex-content h1, .vex.vex-theme-wireframe .vex-content h2, .vex.vex-theme-wireframe .vex-content h3, .vex.vex-theme-wireframe .vex-content h4, .vex.vex-theme-wireframe .vex-content h5, .vex.vex-theme-wireframe .vex-content h6, .vex.vex-theme-wireframe .vex-content p, .vex.vex-theme-wireframe .vex-content ul, .vex.vex-theme-wireframe .vex-content li {\n      color: inherit; }\n  .vex.vex-theme-wireframe .vex-close {\n    position: absolute;\n    top: 0;\n    right: 0;\n    cursor: pointer; }\n    .vex.vex-theme-wireframe .vex-close:before {\n      position: absolute;\n      content: \"\\D7\";\n      font-size: 40px;\n      font-weight: normal;\n      line-height: 80px;\n      height: 80px;\n      width: 80px;\n      text-align: center;\n      top: 3px;\n      right: 3px;\n      color: #000; }\n    .vex.vex-theme-wireframe .vex-close:hover:before, .vex.vex-theme-wireframe .vex-close:active:before {\n      color: #000; }\n  .vex.vex-theme-wireframe .vex-dialog-form .vex-dialog-message {\n    margin-bottom: .5em; }\n  .vex.vex-theme-wireframe .vex-dialog-form .vex-dialog-input {\n    margin-bottom: 1em; }\n    .vex.vex-theme-wireframe .vex-dialog-form .vex-dialog-input textarea, .vex.vex-theme-wireframe .vex-dialog-form .vex-dialog-input input[type=\"date\"], .vex.vex-theme-wireframe .vex-dialog-form .vex-dialog-input input[type=\"datetime\"], .vex.vex-theme-wireframe .vex-dialog-form .vex-dialog-input input[type=\"datetime-local\"], .vex.vex-theme-wireframe .vex-dialog-form .vex-dialog-input input[type=\"email\"], .vex.vex-theme-wireframe .vex-dialog-form .vex-dialog-input input[type=\"month\"], .vex.vex-theme-wireframe .vex-dialog-form .vex-dialog-input input[type=\"number\"], .vex.vex-theme-wireframe .vex-dialog-form .vex-dialog-input input[type=\"password\"], .vex.vex-theme-wireframe .vex-dialog-form .vex-dialog-input input[type=\"search\"], .vex.vex-theme-wireframe .vex-dialog-form .vex-dialog-input input[type=\"tel\"], .vex.vex-theme-wireframe .vex-dialog-form .vex-dialog-input input[type=\"text\"], .vex.vex-theme-wireframe .vex-dialog-form .vex-dialog-input input[type=\"time\"], .vex.vex-theme-wireframe .vex-dialog-form .vex-dialog-input input[type=\"url\"], .vex.vex-theme-wireframe .vex-dialog-form .vex-dialog-input input[type=\"week\"] {\n      background: #fff;\n      width: 100%;\n      padding: .25em .67em;\n      font-family: inherit;\n      font-weight: inherit;\n      font-size: inherit;\n      min-height: 2.5em;\n      margin: 0 0 .25em;\n      border: 2px solid #000; }\n      .vex.vex-theme-wireframe .vex-dialog-form .vex-dialog-input textarea:focus, .vex.vex-theme-wireframe .vex-dialog-form .vex-dialog-input input[type=\"date\"]:focus, .vex.vex-theme-wireframe .vex-dialog-form .vex-dialog-input input[type=\"datetime\"]:focus, .vex.vex-theme-wireframe .vex-dialog-form .vex-dialog-input input[type=\"datetime-local\"]:focus, .vex.vex-theme-wireframe .vex-dialog-form .vex-dialog-input input[type=\"email\"]:focus, .vex.vex-theme-wireframe .vex-dialog-form .vex-dialog-input input[type=\"month\"]:focus, .vex.vex-theme-wireframe .vex-dialog-form .vex-dialog-input input[type=\"number\"]:focus, .vex.vex-theme-wireframe .vex-dialog-form .vex-dialog-input input[type=\"password\"]:focus, .vex.vex-theme-wireframe .vex-dialog-form .vex-dialog-input input[type=\"search\"]:focus, .vex.vex-theme-wireframe .vex-dialog-form .vex-dialog-input input[type=\"tel\"]:focus, .vex.vex-theme-wireframe .vex-dialog-form .vex-dialog-input input[type=\"text\"]:focus, .vex.vex-theme-wireframe .vex-dialog-form .vex-dialog-input input[type=\"time\"]:focus, .vex.vex-theme-wireframe .vex-dialog-form .vex-dialog-input input[type=\"url\"]:focus, .vex.vex-theme-wireframe .vex-dialog-form .vex-dialog-input input[type=\"week\"]:focus {\n        border-style: dashed;\n        outline: none; }\n  .vex.vex-theme-wireframe .vex-dialog-form .vex-dialog-buttons {\n    *zoom: 1; }\n    .vex.vex-theme-wireframe .vex-dialog-form .vex-dialog-buttons:after {\n      content: \"\";\n      display: table;\n      clear: both; }\n  .vex.vex-theme-wireframe .vex-dialog-button {\n    -moz-border-radius: 0;\n    -webkit-border-radius: 0;\n    border-radius: 0;\n    border: 0;\n    float: right;\n    margin: 0 0 0 .5em;\n    font-family: inherit;\n    text-transform: uppercase;\n    letter-spacing: .1em;\n    font-size: .8em;\n    line-height: 1em;\n    padding: .75em 2em; }\n    .vex.vex-theme-wireframe .vex-dialog-button.vex-last {\n      margin-left: 0; }\n    .vex.vex-theme-wireframe .vex-dialog-button:focus {\n      animation: vex-pulse 1.1s infinite;\n      -webkit-animation: vex-pulse 1.1s infinite;\n      -moz-animation: vex-pulse 1.1s infinite;\n      -ms-animation: vex-pulse 1.1s infinite;\n      -o-animation: vex-pulse 1.1s infinite;\n      -webkit-backface-visibility: hidden;\n      outline: none; }\n      @media (max-width: 568px) {\n        .vex.vex-theme-wireframe .vex-dialog-button:focus {\n          animation: none;\n          -webkit-animation: none;\n          -moz-animation: none;\n          -ms-animation: none;\n          -o-animation: none;\n          -webkit-backface-visibility: hidden; } }\n    .vex.vex-theme-wireframe .vex-dialog-button.vex-dialog-button-primary {\n      background: #000;\n      color: #fff;\n      border: 2px solid transparent; }\n    .vex.vex-theme-wireframe .vex-dialog-button.vex-dialog-button-secondary {\n      background: #fff;\n      color: #000;\n      border: 2px solid #000; }\n\n.vex-loading-spinner.vex-theme-wireframe {\n  height: 2.5em;\n  width: 2.5em; }\n", ""]);

// exports


/***/ },

/***/ 571:
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(37)();
// imports


// module
exports.push([module.i, "@keyframes vex-fadein {\n  0% {\n    opacity: 0; }\n  100% {\n    opacity: 1; } }\n\n@-webkit-keyframes vex-fadein {\n  0% {\n    opacity: 0; }\n  100% {\n    opacity: 1; } }\n\n@-moz-keyframes vex-fadein {\n  0% {\n    opacity: 0; }\n  100% {\n    opacity: 1; } }\n\n@-ms-keyframes vex-fadein {\n  0% {\n    opacity: 0; }\n  100% {\n    opacity: 1; } }\n\n@-o-keyframes vex-fadein {\n  0% {\n    opacity: 0; }\n  100% {\n    opacity: 1; } }\n\n@keyframes vex-fadeout {\n  0% {\n    opacity: 1; }\n  100% {\n    opacity: 0; } }\n\n@-webkit-keyframes vex-fadeout {\n  0% {\n    opacity: 1; }\n  100% {\n    opacity: 0; } }\n\n@-moz-keyframes vex-fadeout {\n  0% {\n    opacity: 1; }\n  100% {\n    opacity: 0; } }\n\n@-ms-keyframes vex-fadeout {\n  0% {\n    opacity: 1; }\n  100% {\n    opacity: 0; } }\n\n@-o-keyframes vex-fadeout {\n  0% {\n    opacity: 1; }\n  100% {\n    opacity: 0; } }\n\n@keyframes vex-rotation {\n  0% {\n    transform: rotate(0deg);\n    -webkit-transform: rotate(0deg);\n    -moz-transform: rotate(0deg);\n    -ms-transform: rotate(0deg);\n    -o-transform: rotate(0deg); }\n  100% {\n    transform: rotate(359deg);\n    -webkit-transform: rotate(359deg);\n    -moz-transform: rotate(359deg);\n    -ms-transform: rotate(359deg);\n    -o-transform: rotate(359deg); } }\n\n@-webkit-keyframes vex-rotation {\n  0% {\n    transform: rotate(0deg);\n    -webkit-transform: rotate(0deg);\n    -moz-transform: rotate(0deg);\n    -ms-transform: rotate(0deg);\n    -o-transform: rotate(0deg); }\n  100% {\n    transform: rotate(359deg);\n    -webkit-transform: rotate(359deg);\n    -moz-transform: rotate(359deg);\n    -ms-transform: rotate(359deg);\n    -o-transform: rotate(359deg); } }\n\n@-moz-keyframes vex-rotation {\n  0% {\n    transform: rotate(0deg);\n    -webkit-transform: rotate(0deg);\n    -moz-transform: rotate(0deg);\n    -ms-transform: rotate(0deg);\n    -o-transform: rotate(0deg); }\n  100% {\n    transform: rotate(359deg);\n    -webkit-transform: rotate(359deg);\n    -moz-transform: rotate(359deg);\n    -ms-transform: rotate(359deg);\n    -o-transform: rotate(359deg); } }\n\n@-ms-keyframes vex-rotation {\n  0% {\n    transform: rotate(0deg);\n    -webkit-transform: rotate(0deg);\n    -moz-transform: rotate(0deg);\n    -ms-transform: rotate(0deg);\n    -o-transform: rotate(0deg); }\n  100% {\n    transform: rotate(359deg);\n    -webkit-transform: rotate(359deg);\n    -moz-transform: rotate(359deg);\n    -ms-transform: rotate(359deg);\n    -o-transform: rotate(359deg); } }\n\n@-o-keyframes vex-rotation {\n  0% {\n    transform: rotate(0deg);\n    -webkit-transform: rotate(0deg);\n    -moz-transform: rotate(0deg);\n    -ms-transform: rotate(0deg);\n    -o-transform: rotate(0deg); }\n  100% {\n    transform: rotate(359deg);\n    -webkit-transform: rotate(359deg);\n    -moz-transform: rotate(359deg);\n    -ms-transform: rotate(359deg);\n    -o-transform: rotate(359deg); } }\n\n.vex, .vex *, .vex *:before, .vex *:after {\n  -moz-box-sizing: border-box;\n  -webkit-box-sizing: border-box;\n  box-sizing: border-box; }\n\n.vex {\n  position: fixed;\n  overflow: auto;\n  -webkit-overflow-scrolling: touch;\n  z-index: 1111;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0; }\n\n.vex-scrollbar-measure {\n  position: absolute;\n  top: -9999px;\n  width: 50px;\n  height: 50px;\n  overflow: scroll; }\n\n.vex-overlay {\n  background: #000;\n  filter: alpha(opacity=40);\n  -ms-filter: \"progid:DXImageTransform.Microsoft.Alpha(Opacity=40)\"; }\n\n.vex-overlay {\n  animation: vex-fadein 0.5s;\n  -webkit-animation: vex-fadein 0.5s;\n  -moz-animation: vex-fadein 0.5s;\n  -ms-animation: vex-fadein 0.5s;\n  -o-animation: vex-fadein 0.5s;\n  -webkit-backface-visibility: hidden;\n  position: fixed;\n  background: rgba(0, 0, 0, 0.4);\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0; }\n  .vex.vex-closing .vex-overlay {\n    animation: vex-fadeout 0.5s;\n    -webkit-animation: vex-fadeout 0.5s;\n    -moz-animation: vex-fadeout 0.5s;\n    -ms-animation: vex-fadeout 0.5s;\n    -o-animation: vex-fadeout 0.5s;\n    -webkit-backface-visibility: hidden; }\n\n.vex-content {\n  animation: vex-fadein 0.5s;\n  -webkit-animation: vex-fadein 0.5s;\n  -moz-animation: vex-fadein 0.5s;\n  -ms-animation: vex-fadein 0.5s;\n  -o-animation: vex-fadein 0.5s;\n  -webkit-backface-visibility: hidden;\n  background: #fff; }\n  .vex.vex-closing .vex-content {\n    animation: vex-fadeout 0.5s;\n    -webkit-animation: vex-fadeout 0.5s;\n    -moz-animation: vex-fadeout 0.5s;\n    -ms-animation: vex-fadeout 0.5s;\n    -o-animation: vex-fadeout 0.5s;\n    -webkit-backface-visibility: hidden; }\n\n.vex-close:before {\n  font-family: Arial, sans-serif;\n  content: \"\\D7\"; }\n\n.vex-dialog-form {\n  margin: 0; }\n\n.vex-dialog-button {\n  text-rendering: optimizeLegibility;\n  -moz-appearance: none;\n  -webkit-appearance: none;\n  cursor: pointer;\n  -webkit-tap-highlight-color: transparent; }\n\n.vex-loading-spinner {\n  animation: vex-rotation 0.7s linear infinite;\n  -webkit-animation: vex-rotation 0.7s linear infinite;\n  -moz-animation: vex-rotation 0.7s linear infinite;\n  -ms-animation: vex-rotation 0.7s linear infinite;\n  -o-animation: vex-rotation 0.7s linear infinite;\n  -webkit-backface-visibility: hidden;\n  -moz-box-shadow: 0 0 1em rgba(0, 0, 0, 0.1);\n  -webkit-box-shadow: 0 0 1em rgba(0, 0, 0, 0.1);\n  box-shadow: 0 0 1em rgba(0, 0, 0, 0.1);\n  position: fixed;\n  z-index: 1112;\n  margin: auto;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  height: 2em;\n  width: 2em;\n  background: #fff; }\n\nbody.vex-open {\n  overflow: hidden; }\n", ""]);

// exports


/***/ },

/***/ 572:
/***/ function(module, exports) {

module.exports = "<span defaultOverlayTarget></span>\n<header class=\"header\">\n    <div role=\"navigation\" class=\"navbar navbar-default navbar-fixed-top\">\n        <div class=\"container\">\n            <div class=\"navbar-header\">\n\n            </div>\n            <div id=\"navigation\" class=\"navbar-right\">\n                <ul class=\"nav navbar-nav\">\n                    <li><a [routerLink]=\"['/home']\" class=\"scroll-to\">Home</a></li>\n                    <li><a [routerLink]=\"['/bootstrap-demo']\" class=\"scroll-to\">Bootstrap Plugin</a></li>\n                    <li><a [routerLink]=\"['/vex-demo']\" class=\"scroll-to\">VEX Plugin</a></li>\n                    <li><a [routerLink]=\"['/js-native-demo']\" class=\"scroll-to\">JS Native Plugin</a></li>\n                </ul>\n                <a class=\"btn navbar-btn btn-ghost\" href=\"https://github.com/shlomiassaf/angular2-modal\" target=\"_blank\">Fork on GitHub</a>\n            </div>\n        </div>\n    </div>\n</header>\n<main>\n    <router-outlet></router-outlet>\n</main>\n\n"

/***/ },

/***/ 573:
/***/ function(module, exports) {

module.exports = "<demo-head title=\"Bootstrap Modal plugin\"\n           description=\"An implementation of <a href='http://getbootstrap.com/javascript/#modals' target='_blank'>Bootstrap</a>\"\n           [modalCommands]=\"modalCommands\">\n    <br>\n    <div class=\"container\">\n        <div class=\"row\">\n            <div class=\"col-xs-12\">\n                <a class=\"lead\" [routerLink]=\"['customizeModals']\">Or use the modal code Generator!</a>\n            </div>\n        </div>\n    </div>\n</demo-head>\n<template #templateRef let-dialogRef=\"dialogRef\" let-ctx=\"dialogRef.context\">\n    <div style=\"padding: 10px\">\n        <div class=\"page-header\">\n            <h1>TemplateRef Example</h1>\n        </div>\n        <div class=\"jumbotron\">\n            <h1>Hello, modal!</h1>\n            <p>I'm a declarative TemplateRef!</p>\n            <p>TemplateRef can also access the DialogRef for context and modal control:</p>\n            <pre>{{ ctx | json }}</pre>\n            <button class=\"btn btn-primary\" (click)=\"dialogRef.close(true)\">Close Me</button>\n        </div>\n    </div>\n</template>"

/***/ },

/***/ 574:
/***/ function(module, exports) {

module.exports = "<div class=\"container-fluid\">\n    <h1>Customize A modal window</h1>\n    <p class=\"lead\">Configure a modal, see the code and view the output!</p>\n    <hr>\n    <div class=\"col-md-6\">\n        <div class=\"col-xs-6\">\n            <h3>Configuration:</h3>\n        </div>\n        <div class=\"col-xs-6 col-md-4\">\n            <button class=\"btn btn-success pull-right\" (click)=\"createModal()\">Open Modal</button>\n        </div>\n        <div class=\"col-xs-12\">\n            <form class=\"form-horizontal\" #form=\"ngForm\" (ngSubmit)=\"logForm(form.value)\">\n                <fieldset>\n\n                    <!-- Select Basic -->\n                    <div class=\"form-group\">\n                        <label class=\"col-md-4 control-label\" for=\"modalType\">Type</label>\n                        <div class=\"col-md-6\">\n                            <select id=\"modalType\" name=\"modalType\" class=\"form-control\"\n                                    [(ngModel)]=\"type\">\n                                <option value=\"alert\">Alert</option>\n                                <option value=\"prompt\">Prompt</option>\n                                <option value=\"confirm\">Confirm</option>\n                            </select>\n                        </div>\n                    </div>\n\n                    <div class=\"form-group\">\n                        <label class=\"col-md-4 control-label\" for=\"modalSize\">Modal Size</label>\n                        <div class=\"col-md-6\">\n                            <select id=\"modalSize\" name=\"modalSize\" class=\"form-control\"\n                                    [(ngModel)]=\"preset.size\">\n                                <option value=\"sm\">Small</option>\n                                <option value=\"lg\">Large</option>\n                            </select>\n                        </div>\n                    </div>\n\n                    <div class=\"form-group\">\n                        <label class=\"col-md-4 control-label\" for=\"checkbox\">Blocking?</label>\n                        <div class=\"col-md-6\">\n                            <input type=\"checkbox\" name=\"checkbox\" id=\"checkbox\"\n                                   [(ngModel)]=\"preset.isBlocking\">\n                        </div>\n                    </div>\n\n                    <div class=\"form-group\">\n                        <label class=\"col-md-4 control-label\" for=\"showClose\">Show Close Button?</label>\n                        <div class=\"col-md-6\">\n                            <input type=\"checkbox\" name=\"checkbox\" id=\"showClose\"\n                                   [(ngModel)]=\"preset.showClose\">\n                        </div>\n                    </div>\n\n                    <!-- Text input-->\n                    <div class=\"form-group\">\n                        <label class=\"col-md-4 control-label\" for=\"closeKeys\">Close Key</label>\n                        <div class=\"col-md-6\">\n                            <input id=\"closeKeys\" name=\"closeKeys\" type=\"number\" placeholder=\"27\"\n                                   class=\"form-control input-md\" [(ngModel)]=\"preset.keyboard\">\n                            <span class=\"help-block\">Key code for closing the window (e.g: 27 for ESC)</span>\n                        </div>\n                    </div>\n\n                    <div class=\"form-group\">\n                        <label class=\"col-md-4 control-label\" for=\"dialogClass\">Dialog Class</label>\n                        <div class=\"col-md-6\">\n                            <input id=\"dialogClass\" name=\"dialogClass\" type=\"text\"\n                                   placeholder=\"modal-dialog\"  class=\"form-control input-md\"\n                                   [(ngModel)]=\"preset.dialogClass\">\n                            <span class=\"help-block\">A Class for the dialog container.  Default: modal-dialog</span>\n                        </div>\n                    </div>\n\n                    <!-- Text input-->\n                    <div class=\"form-group\">\n                        <label class=\"col-md-4 control-label\" for=\"headerClass\">Header Class</label>\n                        <div class=\"col-md-6\">\n                            <input id=\"headerClass\" name=\"headerClass\" type=\"text\"\n                                   placeholder=\"modal-header\" class=\"form-control input-md\"\n                                   [(ngModel)]=\"preset.headerClass\">\n                            <span class=\"help-block\"> A Class for the header (title) container.  Default: modal-header</span>\n                        </div>\n                    </div>\n\n                    <!-- Text input-->\n                    <div class=\"form-group\">\n                        <label class=\"col-md-4 control-label\" for=\"title\">Title</label>\n                        <div class=\"col-md-6\">\n                            <input id=\"title\" name=\"title\" type=\"text\" placeholder=\"This is a title\"\n                                   class=\"form-control input-md\" [(ngModel)]=\"preset.title\">\n                            <span class=\"help-block\">Caption for the title, enclosed in a H3 container.</span>\n                        </div>\n                    </div>\n\n                    <!-- Textarea -->\n                    <div class=\"form-group\">\n                        <label class=\"col-md-4 control-label\" for=\"titleHtml\">Title (HTML)</label>\n                        <div class=\"col-md-6\">\n                        <textarea class=\"form-control\" id=\"titleHtml\" name=\"titleHtml\"\n                                  [(ngModel)]=\"preset.titleHtml\"></textarea>\n                        </div>\n                        <p class=\"help-block\">An HTML (not compiled) body, if set Title is ignored.</p>\n                    </div>\n\n                    <!-- Textarea -->\n                    <div class=\"form-group\">\n                        <label class=\"col-md-4 control-label\" for=\"body\">Body</label>\n                        <div class=\"col-md-4\">\n                        <textarea class=\"form-control\" id=\"body\" name=\"body\"\n                                  [(ngModel)]=\"preset.body\"></textarea>\n                        </div>\n                    </div>\n\n                    <!-- Text input-->\n                    <div class=\"form-group\">\n                        <label class=\"col-md-4 control-label\" for=\"bodyClass\">Body Class</label>\n                        <div class=\"col-md-6\">\n                            <input id=\"bodyClass\" name=\"bodyClass\" type=\"text\" placeholder=\"modal-body\"\n                                   class=\"form-control input-md\" [(ngModel)]=\"preset.bodyClass\">\n                            <span class=\"help-block\">A Class for the body container. Default: modal-body</span>\n                        </div>\n                    </div>\n\n                    <!-- Text input-->\n                    <div class=\"form-group\">\n                        <label class=\"col-md-4 control-label\" for=\"footerClass\">Footer Class</label>\n                        <div class=\"col-md-6\">\n                            <input id=\"footerClass\" name=\"footerClass\" type=\"text\"\n                                   placeholder=\"modal-footer\" class=\"form-control input-md\"\n                                   [(ngModel)]=\"preset.footerClass\">\n                            <span class=\"help-block\">A Class for the footer container. Default: modal-footer</span>\n                        </div>\n                    </div>\n\n                    <!-- Text input-->\n                    <div class=\"form-group\">\n                        <label class=\"col-md-4 control-label\" for=\"okBtn\">OK Button Text</label>\n                        <div class=\"col-md-6\">\n                            <input id=\"okBtn\" name=\"okBtn\" type=\"text\" placeholder=\"OK\"\n                                   class=\"form-control input-md\"\n                                   [(ngModel)]=\"preset.okBtn\">\n                            <span class=\"help-block\">Caption for the OK button. Default: OK</span>\n                        </div>\n                    </div>\n\n                    <!-- Text input-->\n                    <div class=\"form-group\">\n                        <label class=\"col-md-4 control-label\" for=\"okBtnClass\">OK Button Class</label>\n                        <div class=\"col-md-6\">\n                            <input id=\"okBtnClass\" name=\"okBtnClass\" type=\"text\"\n                                   placeholder=\"btn btn-primary\" class=\"form-control input-md\"\n                                   [(ngModel)]=\"preset.okBtnClass\">\n                            <span class=\"help-block\">A Class for the OK button. Default: btn btn-primary</span>\n                        </div>\n                    </div>\n\n                    <!-- Text input-->\n                    <div class=\"form-group\" *ngIf=\"type === 'confirm'\">\n                        <label class=\"col-md-4 control-label\" for=\"cancelBtn\">Cancel Button Text</label>\n                        <div class=\"col-md-6\">\n                            <input id=\"cancelBtn\" name=\"cancelBtn\" type=\"text\" placeholder=\"Cancel\"\n                                   class=\"form-control input-md\" [(ngModel)]=\"preset.cancelBtn\">\n                            <span class=\"help-block\">Caption for the Cancel button. Default: Cancel</span>\n                        </div>\n                    </div>\n\n                    <!-- Text input-->\n                    <div class=\"form-group\" *ngIf=\"type === 'confirm'\">\n                        <label class=\"col-md-4 control-label\" for=\"cancelBtnClass\">Cancel Button Class</label>\n                        <div class=\"col-md-6\">\n                            <input id=\"cancelBtnClass\" name=\"cancelBtnClass\" type=\"text\"\n                                   placeholder=\"btn btn-default\" class=\"form-control input-md\"\n                                   [(ngModel)]=\"preset.cancelBtnClass\">\n                            <span class=\"help-block\">A Class for the Cancel button. Default: btn btn-default</span>\n                        </div>\n                    </div>\n\n                </fieldset>\n            </form>\n        </div>\n    </div>\n    <div class=\"col-md-6\">\n        <h3>Code:</h3>\n        <pre>{{code}}</pre>\n    </div>\n</div>"

/***/ },

/***/ 575:
/***/ function(module, exports) {

module.exports = "<section class=\"section  padding--small\">\n    <div class=\"container\">\n        <h2>{{title}}</h2>\n        <p class=\"lead\" [innerHtml]=\"description\"></p>\n        <br>\n        <ng-content select=\"[extra-desc-content]\"></ng-content>\n    </div>\n    <section overlayTarget=\"demo-head\" class=\"section background-gray-lighter padding--small\" style=\"text-align: center\">\n        <button class=\"btn btn-white btn-dropin\" *ngFor=\"let btn of modalCommands\" (click)=\"onClick($event, btn)\">{{btn.text}}</button>\n        <h5>Last modal result: {{result}}</h5>\n    </section>\n\n\n    <ng-content></ng-content>\n</section>\n"

/***/ },

/***/ 576:
/***/ function(module, exports) {

module.exports = "<section id=\"intro\" class=\"text-intro\">\n    <div class=\"container\">\n        <div class=\"row\">\n            <div class=\"col-md-12\"  overlayTarget=\"home-overlay-container\">\n            </div>\n        </div>\n    </div>\n</section>\n\n<template #myTemplate>\n    <span>UI agnostic, Plugin oriented, easy to use.</span>\n    <div style=\"padding: 15px 20%;\"><pre class=\"text-left\"><p>modal.alert()<br>  .message('Angular 2 Modal')<br>  .open();</p></pre>\n    </div>\n    <div class=\"text-gray\">\n        <sub>* This window ia a ad-hoc plugin built within the demo application.</sub>\n        <br>\n        <sub>It is a simple OSX style modal plugin that display's a title and a <b>TemplateRef</b> provided to it.</sub>\n        <br>\n        <sub>Check it out in the demo application. (home component)</sub>\n    </div>\n</template>\n\n<section class=\"section no-padding-bottom\">\n    <div class=\"container\">\n        <div class=\"row\">\n            <div class=\"col-md-offset-2 col-md-8\">\n                A generic, customizable and fluent modal/dialog window implementation for Angular 2.\n                UI platform/framework agnostic, plugins are used to describe a UI implementation (e.g: Bootstrap)\n                This means virtually any modal implementation out there can be ported into the library.\n                Comes with some built in UI platforms, external UI platform can be added in the future or externally used using NPM modules.\n            </div>\n        </div>\n    </div>\n</section>\n"

/***/ },

/***/ 577:
/***/ function(module, exports) {

module.exports = "<demo-head title=\"JS Native Dialog\"\n           description=\"A (useless?) proof of concept how to apply a different renderer, ain't angular 2 great?\"\n           [modalCommands]=\"modalCommands\">\n</demo-head>\n"

/***/ },

/***/ 578:
/***/ function(module, exports) {

module.exports = "<demo-head title=\"VEX dialog plugin\"\n           description=\"An implementation of <a href='http://github.hubspot.com/vex/docs/welcome/' target='_blank'>VEX</a>\"\n           [modalCommands]=\"modalCommands\">\n    <div extra-desc-content>\n        <div class=\"row\">\n            <div class=\"col-xs-12\">\n                <div class=\"form-group\">\n                    <label class=\"col-md-4 control-label\" for=\"theme\">Select a VEX Theme:</label>\n                    <div class=\"col-md-6\">\n                        <select id=\"theme\" name=\"theme\" class=\"form-control\" [(ngModel)]=\"theme\">\n                            <option value=\"default\">default</option>\n                            <option value=\"os\">os</option>\n                            <option value=\"plain\">plain</option>\n                            <option value=\"wireframe\">wireframe</option>\n                            <option value=\"flat-attack\">flat-attack</option>\n                            <option value=\"top\">top</option>\n                            <option value=\"bottom-right-corner\">bottom-right-corner</option>\n                        </select>\n                    </div>\n                </div>\n            </div>\n        </div>\n        <br><br>\n    </div>\n</demo-head>\n<template #templateRef let-dialogRef=\"dialogRef\" let-ctx=\"dialogRef.context\">\n    <div style=\"padding: 10px\">\n        <div class=\"page-header\">\n            <h1>TemplateRef Example</h1>\n        </div>\n        <div class=\"jumbotron\">\n            <h1>Hello, modal!</h1>\n            <p> I'm a declarative TemplateRef!</p>\n            <p>TemplateRef can also access the DialogRef for context and modal control:</p>\n            <pre>{{ ctx | json }}</pre>\n            <button class=\"btn btn-primary\" (click)=\"dialogRef.close(true)\">Close Me</button>\n        </div>\n    </div>\n</template>"

/***/ },

/***/ 583:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var Observable_1 = __webpack_require__(16);
var combineLatest_1 = __webpack_require__(590);
Observable_1.Observable.prototype.combineLatest = combineLatest_1.combineLatest;
//# sourceMappingURL=combineLatest.js.map

/***/ },

/***/ 584:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var Observable_1 = __webpack_require__(16);
var filter_1 = __webpack_require__(591);
Observable_1.Observable.prototype.filter = filter_1.filter;
//# sourceMappingURL=filter.js.map

/***/ },

/***/ 585:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var Observable_1 = __webpack_require__(16);
var first_1 = __webpack_require__(368);
Observable_1.Observable.prototype.first = first_1.first;
//# sourceMappingURL=first.js.map

/***/ },

/***/ 590:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ArrayObservable_1 = __webpack_require__(218);
var isArray_1 = __webpack_require__(140);
var OuterSubscriber_1 = __webpack_require__(138);
var subscribeToResult_1 = __webpack_require__(141);
var none = {};
/**
 * Combines multiple Observables to create an Observable whose values are
 * calculated from the latest values of each of its input Observables.
 *
 * <span class="informal">Whenever any input Observable emits a value, it
 * computes a formula using the latest values from all the inputs, then emits
 * the output of that formula.</span>
 *
 * <img src="./img/combineLatest.png" width="100%">
 *
 * `combineLatest` combines the values from this Observable with values from
 * Observables passed as arguments. This is done by subscribing to each
 * Observable, in order, and collecting an array of each of the most recent
 * values any time any of the input Observables emits, then either taking that
 * array and passing it as arguments to an optional `project` function and
 * emitting the return value of that, or just emitting the array of recent
 * values directly if there is no `project` function.
 *
 * @example <caption>Dynamically calculate the Body-Mass Index from an Observable of weight and one for height</caption>
 * var weight = Rx.Observable.of(70, 72, 76, 79, 75);
 * var height = Rx.Observable.of(1.76, 1.77, 1.78);
 * var bmi = weight.combineLatest(height, (w, h) => w / (h * h));
 * bmi.subscribe(x => console.log('BMI is ' + x));
 *
 * @see {@link combineAll}
 * @see {@link merge}
 * @see {@link withLatestFrom}
 *
 * @param {Observable} other An input Observable to combine with the source
 * Observable. More than one input Observables may be given as argument.
 * @param {function} [project] An optional function to project the values from
 * the combined latest values into a new value on the output Observable.
 * @return {Observable} An Observable of projected values from the most recent
 * values from each input Observable, or an array of the most recent values from
 * each input Observable.
 * @method combineLatest
 * @owner Observable
 */
function combineLatest() {
    var observables = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        observables[_i - 0] = arguments[_i];
    }
    var project = null;
    if (typeof observables[observables.length - 1] === 'function') {
        project = observables.pop();
    }
    // if the first and only other argument besides the resultSelector is an array
    // assume it's been called with `combineLatest([obs1, obs2, obs3], project)`
    if (observables.length === 1 && isArray_1.isArray(observables[0])) {
        observables = observables[0];
    }
    observables.unshift(this);
    return new ArrayObservable_1.ArrayObservable(observables).lift(new CombineLatestOperator(project));
}
exports.combineLatest = combineLatest;
/* tslint:enable:max-line-length */
var CombineLatestOperator = (function () {
    function CombineLatestOperator(project) {
        this.project = project;
    }
    CombineLatestOperator.prototype.call = function (subscriber, source) {
        return source._subscribe(new CombineLatestSubscriber(subscriber, this.project));
    };
    return CombineLatestOperator;
}());
exports.CombineLatestOperator = CombineLatestOperator;
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var CombineLatestSubscriber = (function (_super) {
    __extends(CombineLatestSubscriber, _super);
    function CombineLatestSubscriber(destination, project) {
        _super.call(this, destination);
        this.project = project;
        this.active = 0;
        this.values = [];
        this.observables = [];
    }
    CombineLatestSubscriber.prototype._next = function (observable) {
        this.values.push(none);
        this.observables.push(observable);
    };
    CombineLatestSubscriber.prototype._complete = function () {
        var observables = this.observables;
        var len = observables.length;
        if (len === 0) {
            this.destination.complete();
        }
        else {
            this.active = len;
            this.toRespond = len;
            for (var i = 0; i < len; i++) {
                var observable = observables[i];
                this.add(subscribeToResult_1.subscribeToResult(this, observable, observable, i));
            }
        }
    };
    CombineLatestSubscriber.prototype.notifyComplete = function (unused) {
        if ((this.active -= 1) === 0) {
            this.destination.complete();
        }
    };
    CombineLatestSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        var values = this.values;
        var oldVal = values[outerIndex];
        var toRespond = !this.toRespond
            ? 0
            : oldVal === none ? --this.toRespond : this.toRespond;
        values[outerIndex] = innerValue;
        if (toRespond === 0) {
            if (this.project) {
                this._tryProject(values);
            }
            else {
                this.destination.next(values.slice());
            }
        }
    };
    CombineLatestSubscriber.prototype._tryProject = function (values) {
        var result;
        try {
            result = this.project.apply(this, values);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        this.destination.next(result);
    };
    return CombineLatestSubscriber;
}(OuterSubscriber_1.OuterSubscriber));
exports.CombineLatestSubscriber = CombineLatestSubscriber;
//# sourceMappingURL=combineLatest.js.map

/***/ },

/***/ 591:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscriber_1 = __webpack_require__(34);
/**
 * Filter items emitted by the source Observable by only emitting those that
 * satisfy a specified predicate.
 *
 * <span class="informal">Like
 * [Array.prototype.filter()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter),
 * it only emits a value from the source if it passes a criterion function.</span>
 *
 * <img src="./img/filter.png" width="100%">
 *
 * Similar to the well-known `Array.prototype.filter` method, this operator
 * takes values from the source Observable, passes them through a `predicate`
 * function and only emits those values that yielded `true`.
 *
 * @example <caption>Emit only click events whose target was a DIV element</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var clicksOnDivs = clicks.filter(ev => ev.target.tagName === 'DIV');
 * clicksOnDivs.subscribe(x => console.log(x));
 *
 * @see {@link distinct}
 * @see {@link distinctKey}
 * @see {@link distinctUntilChanged}
 * @see {@link distinctUntilKeyChanged}
 * @see {@link ignoreElements}
 * @see {@link partition}
 * @see {@link skip}
 *
 * @param {function(value: T, index: number): boolean} predicate A function that
 * evaluates each value emitted by the source Observable. If it returns `true`,
 * the value is emitted, if `false` the value is not passed to the output
 * Observable. The `index` parameter is the number `i` for the i-th source
 * emission that has happened since the subscription, starting from the number
 * `0`.
 * @param {any} [thisArg] An optional argument to determine the value of `this`
 * in the `predicate` function.
 * @return {Observable} An Observable of values from the source that were
 * allowed by the `predicate` function.
 * @method filter
 * @owner Observable
 */
function filter(predicate, thisArg) {
    return this.lift(new FilterOperator(predicate, thisArg));
}
exports.filter = filter;
var FilterOperator = (function () {
    function FilterOperator(predicate, thisArg) {
        this.predicate = predicate;
        this.thisArg = thisArg;
    }
    FilterOperator.prototype.call = function (subscriber, source) {
        return source._subscribe(new FilterSubscriber(subscriber, this.predicate, this.thisArg));
    };
    return FilterOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var FilterSubscriber = (function (_super) {
    __extends(FilterSubscriber, _super);
    function FilterSubscriber(destination, predicate, thisArg) {
        _super.call(this, destination);
        this.predicate = predicate;
        this.thisArg = thisArg;
        this.count = 0;
        this.predicate = predicate;
    }
    // the try catch block below is left specifically for
    // optimization and perf reasons. a tryCatcher is not necessary here.
    FilterSubscriber.prototype._next = function (value) {
        var result;
        try {
            result = this.predicate.call(this.thisArg, value, this.count++);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        if (result) {
            this.destination.next(value);
        }
    };
    return FilterSubscriber;
}(Subscriber_1.Subscriber));
//# sourceMappingURL=filter.js.map

/***/ },

/***/ 67:
/***/ function(module, exports) {

"use strict";
"use strict";
/**
 * Simple object extend
 * @param m1
 * @param m2
 * @returns {{}}
 */
function extend(m1, m2) {
    var m = {};
    for (var attr in m1) {
        if (m1.hasOwnProperty(attr)) {
            m[attr] = m1[attr];
        }
    }
    for (var attr in m2) {
        if (m2.hasOwnProperty(attr)) {
            m[attr] = m2[attr];
        }
    }
    return m;
}
exports.extend = extend;
/**
 * Simple, not optimized, array union of unique values.
 * @param arr1
 * @param arr2
 * @returns {T[]|any[]|any[][]|any[]}
 */
function arrayUnion(arr1, arr2) {
    return arr1
        .concat(arr2.filter(function (v) { return arr1.indexOf(v) === -1; }));
}
exports.arrayUnion = arrayUnion;
/**
 * Returns true if the config supports a given key.
 * @param key
 * @returns {boolean}
 */
function supportsKey(keyCode, config) {
    if (!Array.isArray(config))
        return config === null ? false : true;
    return config.indexOf(keyCode) > -1;
}
exports.supportsKey = supportsKey;
/**
 * Given an object representing a key/value map of css properties, returns a valid css string
 * representing the object.
 * Example:
 * console.log(toStyleString({
 *     position: 'absolute',
 *     width: '100%',
 *     height: '100%',
 *     top: '0',
 *     left: '0',
 *     right: '0',
 *     bottom: '0'
 * }));
 * // position:absolute;width:100%;height:100%;top:0;left:0;right:0;bottom:0
 * @param obj
 * @returns {string}
 */
function toStyleString(obj) {
    return Object.getOwnPropertyNames(obj)
        .map(function (k) { return (k + ":" + obj[k]); })
        .join(';');
    // let objStr = JSON.stringify(obj);
    // return objStr.substr(1, objStr.length - 2)
    //     .replace(/,/g, ';')
    //     .replace(/"/g, '');
}
exports.toStyleString = toStyleString;
var PromiseCompleter = (function () {
    function PromiseCompleter() {
        var _this = this;
        this.promise = new Promise(function (res, rej) {
            _this.resolve = res;
            _this.reject = rej;
        });
    }
    return PromiseCompleter;
}());
exports.PromiseCompleter = PromiseCompleter;
function noop() { }
exports.noop = noop;


/***/ },

/***/ 68:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var Subject_1 = __webpack_require__(58);
var utils_1 = __webpack_require__(67);
var errors_1 = __webpack_require__(328);
/**
 * API to an open modal window.
 */
var DialogRef = (function () {
    function DialogRef(overlay, context) {
        this.overlay = overlay;
        this.context = context;
        this._resultDeferred = new utils_1.PromiseCompleter();
        this._onDestroy = new Subject_1.Subject();
        this.onDestroy = this._onDestroy.asObservable();
    }
    Object.defineProperty(DialogRef.prototype, "result", {
        /**
         * A Promise that is resolved on a close event and rejected on a dismiss event.
         * @returns {Promise<T>|any|*|Promise<any>}
         */
        get: function () {
            return this._resultDeferred.promise;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Set a close/dismiss guard
     * @param g
     */
    DialogRef.prototype.setCloseGuard = function (guard) {
        this.closeGuard = guard;
    };
    /**
     *  Close the modal with a return value, i.e: result.
     */
    DialogRef.prototype.close = function (result) {
        var _this = this;
        if (result === void 0) { result = null; }
        var _close = function () {
            _this.destroy();
            _this._resultDeferred.resolve(result);
        };
        this._fireHook('beforeClose')
            .then(function (value) { return value !== true && _close(); })
            .catch(_close);
    };
    /**
     *  Close the modal without a return value, i.e: cancelled.
     *  This call is automatically invoked when a user either:
     *  - Presses an exit keyboard key (if configured).
     *  - Clicks outside of the modal window (if configured).
     *  Usually, dismiss represent a Cancel button or a X button.
     */
    DialogRef.prototype.dismiss = function () {
        var _this = this;
        var _dismiss = function () {
            _this.destroy();
            _this._resultDeferred.promise.catch(function () { });
            _this._resultDeferred.reject();
        };
        this._fireHook('beforeDismiss')
            .then(function (value) { return value !== true && _dismiss(); })
            .catch(_dismiss);
    };
    /**
     * Gracefully close the overlay/dialog with a rejected result.
     * Does not trigger canDestroy on the overlay.
     */
    DialogRef.prototype.bailOut = function () {
        if (this.destroyed !== true) {
            this.destroyed = true;
            this._onDestroy.next(null);
            this._onDestroy.complete();
            this._resultDeferred.reject(new errors_1.DialogBailOutError());
        }
    };
    DialogRef.prototype.destroy = function () {
        var _this = this;
        if (this.destroyed !== true) {
            this.destroyed = true;
            if (typeof this.overlayRef.instance.canDestroy === 'function') {
                this.overlayRef.instance.canDestroy()
                    .catch(function () { })
                    .then(function () { return _this._destroy(); });
            }
            else {
                this._destroy();
            }
        }
    };
    DialogRef.prototype._destroy = function () {
        this._onDestroy.next(null);
        this._onDestroy.complete();
        this.overlayRef.destroy();
    };
    DialogRef.prototype._fireHook = function (name) {
        var gurad = this.closeGuard, fn = gurad && typeof gurad[name] === 'function' && gurad[name];
        return Promise.resolve(fn ? fn.call(gurad) : false);
    };
    return DialogRef;
}());
exports.DialogRef = DialogRef;


/***/ },

/***/ 744:
/***/ function(module, exports, __webpack_require__) {


        var result = __webpack_require__(562);

        if (typeof result === "string") {
            module.exports = result;
        } else {
            module.exports = result.toString();
        }
    

/***/ },

/***/ 745:
/***/ function(module, exports, __webpack_require__) {


        var result = __webpack_require__(563);

        if (typeof result === "string") {
            module.exports = result;
        } else {
            module.exports = result.toString();
        }
    

/***/ },

/***/ 746:
/***/ function(module, exports, __webpack_require__) {


        var result = __webpack_require__(564);

        if (typeof result === "string") {
            module.exports = result;
        } else {
            module.exports = result.toString();
        }
    

/***/ },

/***/ 747:
/***/ function(module, exports, __webpack_require__) {


        var result = __webpack_require__(565);

        if (typeof result === "string") {
            module.exports = result;
        } else {
            module.exports = result.toString();
        }
    

/***/ },

/***/ 748:
/***/ function(module, exports, __webpack_require__) {


        var result = __webpack_require__(566);

        if (typeof result === "string") {
            module.exports = result;
        } else {
            module.exports = result.toString();
        }
    

/***/ },

/***/ 749:
/***/ function(module, exports, __webpack_require__) {


        var result = __webpack_require__(567);

        if (typeof result === "string") {
            module.exports = result;
        } else {
            module.exports = result.toString();
        }
    

/***/ },

/***/ 750:
/***/ function(module, exports, __webpack_require__) {


        var result = __webpack_require__(568);

        if (typeof result === "string") {
            module.exports = result;
        } else {
            module.exports = result.toString();
        }
    

/***/ },

/***/ 751:
/***/ function(module, exports, __webpack_require__) {


        var result = __webpack_require__(569);

        if (typeof result === "string") {
            module.exports = result;
        } else {
            module.exports = result.toString();
        }
    

/***/ },

/***/ 752:
/***/ function(module, exports, __webpack_require__) {


        var result = __webpack_require__(570);

        if (typeof result === "string") {
            module.exports = result;
        } else {
            module.exports = result.toString();
        }
    

/***/ },

/***/ 753:
/***/ function(module, exports, __webpack_require__) {


        var result = __webpack_require__(571);

        if (typeof result === "string") {
            module.exports = result;
        } else {
            module.exports = result.toString();
        }
    

/***/ },

/***/ 758:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var platform_browser_dynamic_1 = __webpack_require__(153);
// The app module
var app_module_1 = __webpack_require__(408);
var _bootstrapped = false;
function main() {
    if (_bootstrapped) {
        return Promise.reject(null);
    }
    else {
        _bootstrapped = true;
        return platform_browser_dynamic_1.platformBrowserDynamic().bootstrapModule(app_module_1.AppModule)
            .catch(function (err) { return console.error(err); });
    }
}
exports.main = main;
function isBootstrapped() {
    return _bootstrapped;
}
exports.isBootstrapped = isBootstrapped;
document.addEventListener('DOMContentLoaded', main);


/***/ },

/***/ 84:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var modal_context_1 = __webpack_require__(333);
exports.BootstrapModalSize = modal_context_1.BootstrapModalSize;
exports.BSModalContext = modal_context_1.BSModalContext;
exports.BSModalContextBuilder = modal_context_1.BSModalContextBuilder;
var modal_container_component_1 = __webpack_require__(212);
exports.BSModalContainer = modal_container_component_1.BSModalContainer;
var message_modal_component_1 = __webpack_require__(211);
exports.BSMessageModal = message_modal_component_1.BSMessageModal;
exports.BSMessageModalTitle = message_modal_component_1.BSMessageModalTitle;
exports.BSMessageModalBody = message_modal_component_1.BSMessageModalBody;
exports.BSModalFooter = message_modal_component_1.BSModalFooter;
exports.BSMessageModalButtonConfig = message_modal_component_1.BSMessageModalButtonConfig;
exports.BSMessageModalButtonHandler = message_modal_component_1.BSMessageModalButtonHandler;
var message_modal_preset_1 = __webpack_require__(213);
exports.MessageModalPreset = message_modal_preset_1.MessageModalPreset;
exports.MessageModalPresetBuilder = message_modal_preset_1.MessageModalPresetBuilder;
var angular2_modal_1 = __webpack_require__(4);
exports.ModalOpenContext = angular2_modal_1.ModalOpenContext;
exports.ModalOpenContextBuilder = angular2_modal_1.ModalOpenContextBuilder;
var one_button_preset_1 = __webpack_require__(335);
exports.OneButtonPreset = one_button_preset_1.OneButtonPreset;
exports.OneButtonPresetBuilder = one_button_preset_1.OneButtonPresetBuilder;
var two_button_preset_1 = __webpack_require__(336);
exports.TwoButtonPreset = two_button_preset_1.TwoButtonPreset;
exports.TwoButtonPresetBuilder = two_button_preset_1.TwoButtonPresetBuilder;
exports.PromptPreset = two_button_preset_1.PromptPreset;
exports.PromptPresetBuilder = two_button_preset_1.PromptPresetBuilder;
var modal_1 = __webpack_require__(334);
exports.Modal = modal_1.Modal;
var bootstrap_module_1 = __webpack_require__(539);
exports.BootstrapModalModule = bootstrap_module_1.BootstrapModalModule;
exports.providers = bootstrap_module_1.providers;


/***/ }

},[758]);
//# sourceMappingURL=main.e5758913904f989debb1.bundle.map