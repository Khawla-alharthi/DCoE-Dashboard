import {
  BrowserModule,
  DomRendererFactory2
} from "./chunk-56BRNS65.js";
import "./chunk-5TS2TCTI.js";
import "./chunk-ZT5Z7H4T.js";
import {
  ANIMATION_MODULE_TYPE,
  DOCUMENT,
  Inject,
  Injectable,
  NgModule,
  NgZone,
  RendererFactory2,
  performanceMarkFeature,
  setClassMetadata,
  ɵɵdefineInjectable,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵinject
} from "./chunk-ULD2L2EY.js";
import "./chunk-XMEZVYR2.js";
import "./chunk-RKB2CBWC.js";
import "./chunk-Y4HBL2V5.js";
import {
  __commonJS,
  __name,
  __publicField,
  __toESM
} from "./chunk-TK2CMIGJ.js";

// optional-peer-dep:__vite-optional-peer-dep:@angular/animations/browser:@angular/platform-browser:false
var require_platform_browser_false = __commonJS({
  "optional-peer-dep:__vite-optional-peer-dep:@angular/animations/browser:@angular/platform-browser:false"(exports, module) {
    module.exports = {};
    throw new Error(`Could not resolve "@angular/animations/browser" imported by "@angular/platform-browser". Is it installed?`);
  }
});

// node_modules/@angular/platform-browser/fesm2022/animations.mjs
var i1 = __toESM(require_platform_browser_false(), 1);
var import_browser = __toESM(require_platform_browser_false(), 1);
var _InjectableAnimationEngine = class _InjectableAnimationEngine extends import_browser.ɵAnimationEngine {
  // The `ApplicationRef` is injected here explicitly to force the dependency ordering.
  // Since the `ApplicationRef` should be created earlier before the `AnimationEngine`, they
  // both have `ngOnDestroy` hooks and `flush()` must be called after all views are destroyed.
  constructor(doc, driver, normalizer) {
    super(doc, driver, normalizer);
  }
  ngOnDestroy() {
    this.flush();
  }
};
__name(_InjectableAnimationEngine, "InjectableAnimationEngine");
__publicField(_InjectableAnimationEngine, "ɵfac", /* @__PURE__ */ __name(function InjectableAnimationEngine_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _InjectableAnimationEngine)(ɵɵinject(DOCUMENT), ɵɵinject(i1.AnimationDriver), ɵɵinject(i1.ɵAnimationStyleNormalizer));
}, "InjectableAnimationEngine_Factory"));
__publicField(_InjectableAnimationEngine, "ɵprov", ɵɵdefineInjectable({
  token: _InjectableAnimationEngine,
  factory: _InjectableAnimationEngine.ɵfac
}));
var InjectableAnimationEngine = _InjectableAnimationEngine;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(InjectableAnimationEngine, [{
    type: Injectable
  }], () => [{
    type: Document,
    decorators: [{
      type: Inject,
      args: [DOCUMENT]
    }]
  }, {
    type: i1.AnimationDriver
  }, {
    type: i1.ɵAnimationStyleNormalizer
  }], null);
})();
function instantiateDefaultStyleNormalizer() {
  return new import_browser.ɵWebAnimationsStyleNormalizer();
}
__name(instantiateDefaultStyleNormalizer, "instantiateDefaultStyleNormalizer");
function instantiateRendererFactory(renderer, engine, zone) {
  return new import_browser.ɵAnimationRendererFactory(renderer, engine, zone);
}
__name(instantiateRendererFactory, "instantiateRendererFactory");
var SHARED_ANIMATION_PROVIDERS = [{
  provide: import_browser.ɵAnimationStyleNormalizer,
  useFactory: instantiateDefaultStyleNormalizer
}, {
  provide: import_browser.ɵAnimationEngine,
  useClass: InjectableAnimationEngine
}, {
  provide: RendererFactory2,
  useFactory: instantiateRendererFactory,
  deps: [DomRendererFactory2, import_browser.ɵAnimationEngine, NgZone]
}];
var BROWSER_NOOP_ANIMATIONS_PROVIDERS = [{
  provide: import_browser.AnimationDriver,
  useClass: import_browser.NoopAnimationDriver
}, {
  provide: ANIMATION_MODULE_TYPE,
  useValue: "NoopAnimations"
}, ...SHARED_ANIMATION_PROVIDERS];
var BROWSER_ANIMATIONS_PROVIDERS = [
  // Note: the `ngServerMode` happen inside factories to give the variable time to initialize.
  {
    provide: import_browser.AnimationDriver,
    useFactory: /* @__PURE__ */ __name(() => false ? new import_browser.NoopAnimationDriver() : new import_browser.ɵWebAnimationsDriver(), "useFactory")
  },
  {
    provide: ANIMATION_MODULE_TYPE,
    useFactory: /* @__PURE__ */ __name(() => false ? "NoopAnimations" : "BrowserAnimations", "useFactory")
  },
  ...SHARED_ANIMATION_PROVIDERS
];
var _BrowserAnimationsModule = class _BrowserAnimationsModule {
  /**
   * Configures the module based on the specified object.
   *
   * @param config Object used to configure the behavior of the `BrowserAnimationsModule`.
   * @see {@link BrowserAnimationsModuleConfig}
   *
   * @usageNotes
   * When registering the `BrowserAnimationsModule`, you can use the `withConfig`
   * function as follows:
   * ```ts
   * @NgModule({
   *   imports: [BrowserAnimationsModule.withConfig(config)]
   * })
   * class MyNgModule {}
   * ```
   */
  static withConfig(config) {
    return {
      ngModule: _BrowserAnimationsModule,
      providers: config.disableAnimations ? BROWSER_NOOP_ANIMATIONS_PROVIDERS : BROWSER_ANIMATIONS_PROVIDERS
    };
  }
};
__name(_BrowserAnimationsModule, "BrowserAnimationsModule");
__publicField(_BrowserAnimationsModule, "ɵfac", /* @__PURE__ */ __name(function BrowserAnimationsModule_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _BrowserAnimationsModule)();
}, "BrowserAnimationsModule_Factory"));
__publicField(_BrowserAnimationsModule, "ɵmod", ɵɵdefineNgModule({
  type: _BrowserAnimationsModule,
  exports: [BrowserModule]
}));
__publicField(_BrowserAnimationsModule, "ɵinj", ɵɵdefineInjector({
  providers: BROWSER_ANIMATIONS_PROVIDERS,
  imports: [BrowserModule]
}));
var BrowserAnimationsModule = _BrowserAnimationsModule;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BrowserAnimationsModule, [{
    type: NgModule,
    args: [{
      exports: [BrowserModule],
      providers: BROWSER_ANIMATIONS_PROVIDERS
    }]
  }], null, null);
})();
function provideAnimations() {
  performanceMarkFeature("NgEagerAnimations");
  return [...BROWSER_ANIMATIONS_PROVIDERS];
}
__name(provideAnimations, "provideAnimations");
var _NoopAnimationsModule = class _NoopAnimationsModule {
};
__name(_NoopAnimationsModule, "NoopAnimationsModule");
__publicField(_NoopAnimationsModule, "ɵfac", /* @__PURE__ */ __name(function NoopAnimationsModule_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _NoopAnimationsModule)();
}, "NoopAnimationsModule_Factory"));
__publicField(_NoopAnimationsModule, "ɵmod", ɵɵdefineNgModule({
  type: _NoopAnimationsModule,
  exports: [BrowserModule]
}));
__publicField(_NoopAnimationsModule, "ɵinj", ɵɵdefineInjector({
  providers: BROWSER_NOOP_ANIMATIONS_PROVIDERS,
  imports: [BrowserModule]
}));
var NoopAnimationsModule = _NoopAnimationsModule;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NoopAnimationsModule, [{
    type: NgModule,
    args: [{
      exports: [BrowserModule],
      providers: BROWSER_NOOP_ANIMATIONS_PROVIDERS
    }]
  }], null, null);
})();
function provideNoopAnimations() {
  return [...BROWSER_NOOP_ANIMATIONS_PROVIDERS];
}
__name(provideNoopAnimations, "provideNoopAnimations");
export {
  ANIMATION_MODULE_TYPE,
  BrowserAnimationsModule,
  NoopAnimationsModule,
  provideAnimations,
  provideNoopAnimations,
  InjectableAnimationEngine as ɵInjectableAnimationEngine
};
/*! Bundled license information:

@angular/platform-browser/fesm2022/animations.mjs:
  (**
   * @license Angular v20.3.0
   * (c) 2010-2025 Google LLC. https://angular.io/
   * License: MIT
   *)
*/
//# sourceMappingURL=@angular_platform-browser_animations.js.map
