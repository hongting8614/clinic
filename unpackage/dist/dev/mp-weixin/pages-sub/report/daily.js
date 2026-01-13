(global["webpackJsonp"] = global["webpackJsonp"] || []).push([["pages-sub/report/daily"],{

/***/ 295:
/*!***************************************************************!*\
  !*** D:/AK-PMS/main.js?{"page":"pages-sub%2Freport%2Fdaily"} ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(wx, createPage) {

var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
__webpack_require__(/*! uni-pages */ 26);
var _vue = _interopRequireDefault(__webpack_require__(/*! vue */ 25));
var _daily = _interopRequireDefault(__webpack_require__(/*! ./pages-sub/report/daily.vue */ 296));
// @ts-ignore
wx.__webpack_require_UNI_MP_PLUGIN__ = __webpack_require__;
createPage(_daily.default);
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/wx.js */ 1)["default"], __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 2)["createPage"]))

/***/ }),

/***/ 296:
/*!********************************************!*\
  !*** D:/AK-PMS/pages-sub/report/daily.vue ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _daily_vue_vue_type_template_id_4d34a038_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./daily.vue?vue&type=template&id=4d34a038&scoped=true& */ 297);
/* harmony import */ var _daily_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./daily.vue?vue&type=script&lang=js& */ 299);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _daily_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _daily_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var _daily_vue_vue_type_style_index_0_id_4d34a038_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./daily.vue?vue&type=style&index=0&id=4d34a038&lang=scss&scoped=true& */ 301);
/* harmony import */ var _F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/runtime/componentNormalizer.js */ 32);

var renderjs





/* normalize component */

var component = Object(_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _daily_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _daily_vue_vue_type_template_id_4d34a038_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
  _daily_vue_vue_type_template_id_4d34a038_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "4d34a038",
  null,
  false,
  _daily_vue_vue_type_template_id_4d34a038_scoped_true___WEBPACK_IMPORTED_MODULE_0__["components"],
  renderjs
)

component.options.__file = "pages-sub/report/daily.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ 297:
/*!***************************************************************************************!*\
  !*** D:/AK-PMS/pages-sub/report/daily.vue?vue&type=template&id=4d34a038&scoped=true& ***!
  \***************************************************************************************/
/*! exports provided: render, staticRenderFns, recyclableRender, components */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_daily_vue_vue_type_template_id_4d34a038_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--17-0!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-uni-app-loader/page-meta.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./daily.vue?vue&type=template&id=4d34a038&scoped=true& */ 298);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_daily_vue_vue_type_template_id_4d34a038_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_daily_vue_vue_type_template_id_4d34a038_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "recyclableRender", function() { return _F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_daily_vue_vue_type_template_id_4d34a038_scoped_true___WEBPACK_IMPORTED_MODULE_0__["recyclableRender"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "components", function() { return _F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_daily_vue_vue_type_template_id_4d34a038_scoped_true___WEBPACK_IMPORTED_MODULE_0__["components"]; });



/***/ }),

/***/ 298:
/*!***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--17-0!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-uni-app-loader/page-meta.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!D:/AK-PMS/pages-sub/report/daily.vue?vue&type=template&id=4d34a038&scoped=true& ***!
  \***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns, recyclableRender, components */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "recyclableRender", function() { return recyclableRender; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "components", function() { return components; });
var components
var render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
}
var recyclableRender = false
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ 299:
/*!*********************************************************************!*\
  !*** D:/AK-PMS/pages-sub/report/daily.vue?vue&type=script&lang=js& ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_daily_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!./node_modules/babel-loader/lib!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--13-1!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./daily.vue?vue&type=script&lang=js& */ 300);
/* harmony import */ var _F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_daily_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_daily_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_daily_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_daily_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_daily_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ 300:
/*!****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--13-1!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!D:/AK-PMS/pages-sub/report/daily.vue?vue&type=script&lang=js& ***!
  \****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni, wx) {

var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _regenerator = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/regenerator */ 34));
var _slicedToArray2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ 5));
var _asyncToGenerator2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ 36));
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
var _default = {
  name: 'ReportDaily',
  data: function data() {
    return {
      reportContent: '',
      reportDate: '',
      reportLocation: '',
      stats: null,
      tableData: null,
      isEditingText: false,
      isEditingVisitor: false,
      isEditingEmployee: false,
      // 固定疾病清单（用于汇总报表），为空也要显示
      diseaseList: ['擦伤', '扭伤', '割伤', '烫伤', '跌伤', '撞伤', '脆伤', '挫伤', '头痛', '头晕', '感冒', '发烧', '咳嗽', '腹泻', '腹痛', '恶心呕吐', '过敏', '皮疹', '牙痛', '关节痛', '腰痛', '胸闷', '心慌', '晕厥', '中暑', '痛经', '胃痛', '骨折', '其他'],
      visitorSummary: null,
      employeeSummary: null
    };
  },
  onLoad: function onLoad(options) {
    // 优先从 URL 参数获取日期和园区
    var dateStr = '';
    var location = 'land_park';
    if (options.date) {
      dateStr = decodeURIComponent(options.date);
    }
    if (options.location) {
      location = decodeURIComponent(options.location);
    }

    // 如果没有传递日期，使用当天
    if (!dateStr) {
      var now = new Date();
      var y = now.getFullYear();
      var m = String(now.getMonth() + 1).padStart(2, '0');
      var d = String(now.getDate()).padStart(2, '0');
      dateStr = "".concat(y, "-").concat(m, "-").concat(d);
    }

    // 如果没有传递园区，尝试从缓存获取
    if (!options.location) {
      try {
        var saved = uni.getStorageSync('clinic_last_location');
        if (saved === 'land_park' || saved === 'water_park') location = saved;
      } catch (e) {}
    }

    // 统一生成日报
    this.generateFromClinicRecords(dateStr, location);
  },
  methods: {
    // 在本页直接调用门诊信息生成日报
    generateFromClinicRecords: function generateFromClinicRecords(dateStr, location) {
      var _this = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee() {
        var _res$result, _res$result$data, res, records, locationName, d, yy, mm, dd;
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                uni.showLoading({
                  title: '加载中...',
                  mask: true
                });
                _context.prev = 1;
                _context.next = 4;
                return wx.cloud.callFunction({
                  name: 'clinicRecords',
                  data: {
                    action: 'list',
                    data: {
                      location: location,
                      startDate: dateStr,
                      endDate: dateStr,
                      pageSize: 1000,
                      useClinicRecords: true
                    }
                  }
                });
              case 4:
                res = _context.sent;
                uni.hideLoading();
                records = (res === null || res === void 0 ? void 0 : (_res$result = res.result) === null || _res$result === void 0 ? void 0 : (_res$result$data = _res$result.data) === null || _res$result$data === void 0 ? void 0 : _res$result$data.list) || [];
                locationName = location === 'land_park' ? '陆园' : '水园'; // 生成文本、统计与表格
                _this.reportContent = _this.formatDailyReport(records, dateStr, locationName);
                _this.stats = _this.calculateStats(records);
                _this.tableData = _this.prepareTableData(records);
                d = new Date(dateStr);
                yy = d.getFullYear();
                mm = String(d.getMonth() + 1).padStart(2, '0');
                dd = String(d.getDate()).padStart(2, '0');
                _this.reportDate = "".concat(yy, "\u5E74").concat(mm, "\u6708").concat(dd, "\u65E5");
                _this.reportLocation = locationName;
                _this.generateSummaries();
                _context.next = 25;
                break;
              case 20:
                _context.prev = 20;
                _context.t0 = _context["catch"](1);
                uni.hideLoading();
                console.error('生成日报失败:', _context.t0);
                uni.showToast({
                  title: '生成失败',
                  icon: 'none'
                });
              case 25:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[1, 20]]);
      }))();
    },
    // 文本日报构建（与登记页口径一致）
    formatDailyReport: function formatDailyReport(records, dateStr, locationName) {
      var dt = new Date(dateStr);
      var y = dt.getFullYear();
      var m = dt.getMonth() + 1;
      var d = dt.getDate();
      var dateFormatted = "".concat(y, "\u5E74").concat(m, "\u6708").concat(d, "\u65E5");
      var agg = {
        total: records.length,
        visitor: [],
        employee: [],
        outcall: []
      };
      records.forEach(function (r) {
        var identity = r.identity || '游客';
        var disease = r.diseaseName || r.diagnosis || r.chiefComplaint || '未知';
        var site = r.injuryLocation || '';
        var isOut = r.isOutcall || r.visitType === 'outcall';
        if (isOut && site) {
          var ex = agg.outcall.find(function (i) {
            return i.location === site;
          });
          ex ? ex.count++ : agg.outcall.push({
            location: site,
            count: 1
          });
        }
        var bucket = identity === '员工' ? 'employee' : 'visitor';
        var list = agg[bucket];
        var existed = list.find(function (i) {
          return i.disease === disease;
        });
        if (existed) {
          existed.total++;
          if (bucket === 'visitor' && site) {
            var _existed$locations;
            var l = (_existed$locations = existed.locations) === null || _existed$locations === void 0 ? void 0 : _existed$locations.find(function (x) {
              return x.name === site;
            });
            l ? l.count++ : existed.locations.push({
              name: site,
              count: 1
            });
          }
        } else {
          list.push({
            disease: disease,
            total: 1,
            locations: bucket === 'visitor' && site ? [{
              name: site,
              count: 1
            }] : []
          });
        }
      });
      var report = "".concat(dateFormatted, "\u5317\u4EAC\u6B22\u4E50\u8C37\u533B\u52A1\u5BA4\uFF08").concat(locationName, "\uFF09\u5F53\u65E5\u63A5\u8BCA\u5171\u8BA1").concat(agg.total, "\u4EBA\u3002");
      if (agg.visitor.length) {
        var vt = agg.visitor.reduce(function (s, i) {
          return s + i.total;
        }, 0);
        var parts = agg.visitor.map(function (i) {
          var _i$locations;
          if ((_i$locations = i.locations) !== null && _i$locations !== void 0 && _i$locations.length) {
            var lp = i.locations.map(function (l) {
              return "".concat(l.name).concat(l.count, "\u4EBA");
            }).join('，');
            return "".concat(i.disease).concat(i.total, "\u4EBA\uFF08").concat(lp, "\uFF09");
          }
          return "".concat(i.disease).concat(i.total, "\u4EBA");
        });
        report += "\n\u6E38\u5BA2".concat(vt, "\u4EBA\uFF1A").concat(parts.join('，'), "\u3002");
      }
      if (agg.employee.length) {
        var et = agg.employee.reduce(function (s, i) {
          return s + i.total;
        }, 0);
        report += "\n\u5458\u5DE5".concat(et, "\u4EBA\uFF1A").concat(agg.employee.map(function (i) {
          return "".concat(i.disease).concat(i.total, "\u4EBA");
        }).join('，'), "\u3002");
      }
      if (agg.outcall.length) {
        var ot = agg.outcall.reduce(function (s, i) {
          return s + i.count;
        }, 0);
        report += "\n\u51FA\u8BCA".concat(ot, "\u6B21\uFF1A").concat(agg.outcall.map(function (i) {
          return "".concat(i.location).concat(i.count, "\u6B21");
        }).join('，'), "\u3002");
      }
      return report.trim();
    },
    // 简要统计
    calculateStats: function calculateStats(records) {
      var s = {
        total: records.length,
        visitorTotal: 0,
        employeeTotal: 0,
        outcallTotal: 0
      };
      records.forEach(function (r) {
        var id = r.identity || '游客';
        var isOut = r.isOutcall || r.visitType === 'outcall';
        if (id === '游客') s.visitorTotal++;else if (id === '员工') s.employeeTotal++;
        if (isOut) s.outcallTotal++;
      });
      return s;
    },
    // 表格数据
    prepareTableData: function prepareTableData(records) {
      var doctorName = '';
      try {
        var u = uni.getStorageSync('userInfo');
        doctorName = (u === null || u === void 0 ? void 0 : u.name) || '';
      } catch (e) {}
      var visitor = [];
      var employee = [];
      records.forEach(function (r) {
        var id = r.identity || '游客';
        var obj = {
          name: r.name || '',
          diseaseName: r.diseaseName || r.diagnosis || r.chiefComplaint || '未知',
          location: r.injuryLocation || '',
          visitTime: r.visitDateTime || r.createTime || '',
          isOutcall: r.isOutcall || r.visitType === 'outcall',
          doctorName: doctorName
        };
        if (id === '游客') visitor.push(obj);else if (id === '员工') employee.push(obj);
      });
      return {
        visitor: visitor,
        employee: employee
      };
    },
    // 生成员工/游客汇总
    generateSummaries: function generateSummaries() {
      var _this2 = this,
        _this$tableData,
        _this$tableData2;
      var initCounts = function initCounts() {
        var obj = {};
        _this2.diseaseList.forEach(function (name) {
          obj[name] = 0;
        });
        return obj;
      };
      var normalize = function normalize(name) {
        if (!name) return '其他';
        var found = _this2.diseaseList.find(function (d) {
          return name.indexOf(d) !== -1;
        });
        return found || '其他';
      };
      var build = function build(rows) {
        var counts = initCounts();
        (rows || []).forEach(function (item) {
          var key = normalize(item.diseaseName);
          counts[key] = (counts[key] || 0) + 1;
        });
        return counts;
      };
      this.visitorSummary = build(((_this$tableData = this.tableData) === null || _this$tableData === void 0 ? void 0 : _this$tableData.visitor) || []);
      this.employeeSummary = build(((_this$tableData2 = this.tableData) === null || _this$tableData2 === void 0 ? void 0 : _this$tableData2.employee) || []);
    },
    // 编辑日报文本
    editReportText: function editReportText() {
      this.isEditingText = !this.isEditingText;
      if (!this.isEditingText) {
        // 退出编辑模式时保存
        uni.showToast({
          title: '已保存',
          icon: 'success',
          duration: 1000
        });
      }
    },
    // 切换表格编辑模式
    toggleEditTable: function toggleEditTable(type) {
      if (type === 'visitor') {
        this.isEditingVisitor = !this.isEditingVisitor;
      } else if (type === 'employee') {
        this.isEditingEmployee = !this.isEditingEmployee;
      }
      if (type === 'visitor' && !this.isEditingVisitor || type === 'employee' && !this.isEditingEmployee) {
        // 退出编辑模式时保存
        uni.showToast({
          title: '已保存',
          icon: 'success',
          duration: 1000
        });
      }
    },
    // 复制表格（Excel格式）
    copyTable: function copyTable(type) {
      if (!this.tableData) {
        uni.showToast({
          title: '暂无表格数据',
          icon: 'none'
        });
        return;
      }
      var data = type === 'visitor' ? this.tableData.visitor : this.tableData.employee;
      if (!data || data.length === 0) {
        uni.showToast({
          title: '暂无数据',
          icon: 'none'
        });
        return;
      }

      // 生成Excel格式的表格文本（制表符分隔）
      var text = type === 'visitor' ? '游客接诊明细：\n' : '员工接诊明细：\n';
      // 表头（使用制表符分隔）
      text += '疾病名称\t地点\t出诊\t接诊医生\n';

      // 数据行（使用制表符分隔）
      data.forEach(function (item) {
        var disease = item.diseaseName || '-';
        var location = item.location || '-';
        var outcall = item.isOutcall ? '是' : '否';
        var doctor = item.doctorName || '-';
        text += "".concat(disease, "\t").concat(location, "\t").concat(outcall, "\t").concat(doctor, "\n");
      });
      uni.setClipboardData({
        data: text,
        success: function success() {
          uni.showToast({
            title: "\u5DF2\u590D\u5236".concat(type === 'visitor' ? '游客' : '员工', "\u6570\u636E\uFF08\u53EF\u7C98\u8D34\u5230Excel\uFF09"),
            icon: 'success',
            duration: 2000
          });
        },
        fail: function fail() {
          uni.showToast({
            title: '复制失败',
            icon: 'none'
          });
        }
      });
    },
    // 复制汇总数据（只复制数据，不复制疾病名列）
    copySummary: function copySummary(type) {
      var orientation = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'horizontal';
      var summary = type === 'visitor' ? this.visitorSummary : this.employeeSummary;
      if (!summary) {
        uni.showToast({
          title: '暂无汇总数据',
          icon: 'none'
        });
        return;
      }
      var values = this.diseaseList.map(function (name) {
        var _summary$name;
        return String((_summary$name = summary[name]) !== null && _summary$name !== void 0 ? _summary$name : 0);
      });
      var text = orientation === 'horizontal' ? values.join('\t') // 一行，制表符分隔
      : values.join('\n'); // 多行，一列

      uni.setClipboardData({
        data: text,
        success: function success() {
          uni.showToast({
            title: "\u5DF2\u590D\u5236".concat(type === 'visitor' ? '游客' : '员工', "\u6C47\u603B\u6570\u636E"),
            icon: 'success'
          });
        }
      });
    },
    // 导出日报（包含游客和员工的日报列表）
    exportDailyReport: function exportDailyReport() {
      if (!this.tableData) {
        uni.showToast({
          title: '暂无数据',
          icon: 'none'
        });
        return;
      }

      // 获取表头
      var header = this.getTemplateHeader();

      // 构建游客和员工的日报行
      var visitorRow = this.buildTemplateRow('visitor');
      var employeeRow = this.buildTemplateRow('employee');

      // 组合成完整的表格数据（制表符分隔，可直接粘贴到Excel）
      var content = '';

      // 添加表头
      content += header.join('\t') + '\n';

      // 添加游客数据行
      content += visitorRow.map(function (v) {
        return String(v !== null && v !== void 0 ? v : '');
      }).join('\t') + '\n';

      // 添加员工数据行
      content += employeeRow.map(function (v) {
        return String(v !== null && v !== void 0 ? v : '');
      }).join('\t') + '\n';

      // 复制到剪贴板
      uni.setClipboardData({
        data: content,
        success: function success() {
          uni.showToast({
            title: '已复制日报列表（可粘贴到Excel）',
            icon: 'success',
            duration: 2000
          });
        },
        fail: function fail() {
          uni.showToast({
            title: '复制失败',
            icon: 'none'
          });
        }
      });
    },
    // ================= 模板导出（指定列顺序） =================
    getTemplateHeader: function getTemplateHeader() {
      // 固定顺序（含两个“地点”）
      return ['日期/受伤类型', '扭伤', '擦伤', '地点', '烫伤', '磕伤', '冻伤', '腹泻', '头晕', '头痛', '感冒', '脱臼', '骨折', '地点', '过敏', '痛经', '测血压', '其他', '合计', '接诊医生', '备注'];
    },
    getTemplateMapping: function getTemplateMapping() {
      // 关键词映射（若匹配多个，以首次匹配为准）
      return {
        '扭伤': ['扭伤'],
        '擦伤': ['擦伤', '擦破'],
        '烫伤': ['烫伤', '烫热伤'],
        '磕伤': ['磕伤', '撞伤', '磕碰', '挫伤'],
        '冻伤': ['冻伤'],
        '腹泻': ['腹泻', '拉肚', '肠炎', '肠胃炎'],
        '头晕': ['头晕'],
        '头痛': ['头痛', '头疼'],
        '感冒': ['感冒', '上呼吸道感染'],
        '脱臼': ['脱臼', '关节脱位'],
        '骨折': ['骨折'],
        '过敏': ['过敏', '荨麻疹', '皮疹'],
        '痛经': ['痛经'],
        '测血压': ['测血压', '血压', '量血压']
      };
    },
    // 构建一行数据（不含表头）
    buildTemplateRow: function buildTemplateRow(type) {
      var _this$tableData3, _this$tableData4;
      var rows = type === 'visitor' ? ((_this$tableData3 = this.tableData) === null || _this$tableData3 === void 0 ? void 0 : _this$tableData3.visitor) || [] : ((_this$tableData4 = this.tableData) === null || _this$tableData4 === void 0 ? void 0 : _this$tableData4.employee) || [];
      var mapping = this.getTemplateMapping();
      var keys = Object.keys(mapping);
      var counts = {};
      keys.forEach(function (k) {
        return counts[k] = 0;
      });
      var other = 0;
      // 地点（擦伤、骨折）各取出现次数最多的一个地点
      var locCountFor = function locCountFor(diseaseKey) {
        var m = new Map();
        rows.forEach(function (r) {
          var disease = String(r.diseaseName || '');
          var location = (r.location || '').trim();
          var matched = mapping[diseaseKey].some(function (k) {
            return disease.indexOf(k) !== -1;
          });
          if (matched && location) {
            m.set(location, (m.get(location) || 0) + 1);
          }
        });
        var top = '';
        var max = 0;
        m.forEach(function (v, k) {
          if (v > max) {
            max = v;
            top = k;
          }
        });
        return top;
      };
      var loc擦伤 = locCountFor('擦伤');
      var loc骨折 = locCountFor('骨折');
      // 统计
      rows.forEach(function (r) {
        var name = String(r.diseaseName || '');
        var matchedKey = '';
        var _iterator = _createForOfIteratorHelper(keys),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var k = _step.value;
            if (mapping[k].some(function (w) {
              return name.indexOf(w) !== -1;
            })) {
              matchedKey = k;
              break;
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
        if (matchedKey) counts[matchedKey]++;else other++;
      });
      // 医生
      var doctorName = '';
      try {
        var u = uni.getStorageSync('userInfo');
        doctorName = (u === null || u === void 0 ? void 0 : u.name) || '';
      } catch (e) {}
      // 日期
      var dateText = this.reportDate || '';
      // 备注：收集归入“其他”的原疾病名（去重+次数）
      var otherMap = new Map();
      rows.forEach(function (r) {
        var name = String(r.diseaseName || '');
        var isOther = !keys.some(function (k) {
          return mapping[k].some(function (w) {
            return name.indexOf(w) !== -1;
          });
        });
        if (isOther && name) {
          otherMap.set(name, (otherMap.get(name) || 0) + 1);
        }
      });
      var remarkParts = [];
      otherMap.forEach(function (v, k) {
        return remarkParts.push("".concat(k).concat(v, "\u4EBA"));
      });

      // 收集出诊信息
      var outcallMap = new Map();
      var outcallTotal = 0;
      rows.forEach(function (r) {
        var isOutcall = r.isOutcall || false;
        var location = (r.location || '').trim();
        if (isOutcall) {
          outcallTotal++;
          if (location) {
            outcallMap.set(location, (outcallMap.get(location) || 0) + 1);
          }
        }
      });

      // 构建备注文本
      var remark = '';
      if (remarkParts.length > 0) {
        remark = remarkParts.join('，');
      }
      if (outcallTotal > 0) {
        var outcallParts = [];
        outcallMap.forEach(function (v, k) {
          return outcallParts.push("".concat(k).concat(v, "\u6B21"));
        });
        var outcallText = "\u5171\u8BA1\u51FA\u8BCA".concat(outcallTotal, "\u6B21") + (outcallParts.length > 0 ? "\uFF0C".concat(outcallParts.join('，')) : '');
        remark = remark ? "".concat(remark, "\u3002").concat(outcallText) : outcallText;
      }

      // 合计
      var total = rows.length;

      // 格式化函数：0显示为空字符串
      var formatCount = function formatCount(count) {
        return count === 0 ? '' : count;
      };

      // 如果当日无记录，所有数据列都为空，但合计显示为0
      if (total === 0) {
        return [dateText,
        // 日期/受伤类型
        '', '', '',
        // 扭伤、擦伤、地点
        '', '', '',
        // 烫伤、磕伤、冻伤
        '', '', '',
        // 腹泻、头晕、头痛
        '', '', '',
        // 感冒、脱臼、骨折
        '',
        // 地点
        '', '', '',
        // 过敏、痛经、测血压
        '',
        // 其他
        0,
        // 合计（0时显示为0）
        doctorName, '' // 备注
        ];
      }

      // 输出顺序
      return [dateText,
      // 日期/受伤类型
      formatCount(counts['扭伤']), formatCount(counts['擦伤']), loc擦伤 || '', formatCount(counts['烫伤']), formatCount(counts['磕伤']), formatCount(counts['冻伤']), formatCount(counts['腹泻']), formatCount(counts['头晕']), formatCount(counts['头痛']), formatCount(counts['感冒']), formatCount(counts['脱臼']), formatCount(counts['骨折']), loc骨折 || '', formatCount(counts['过敏']), formatCount(counts['痛经']), formatCount(counts['测血压']), remarkParts.join('，') || '',
      // 其他：显示具体疾病名称和人数
      total,
      // 合计（总数）
      doctorName, outcallTotal > 0 ? "\u51FA\u8BCA".concat(outcallTotal, "\u6B21") + (outcallMap.size > 0 ? "\uFF08".concat(Array.from(outcallMap.entries()).map(function (_ref) {
        var _ref2 = (0, _slicedToArray2.default)(_ref, 2),
          k = _ref2[0],
          v = _ref2[1];
        return "".concat(k).concat(v, "\u6B21");
      }).join('，'), "\uFF09") : '') : '' // 备注：只显示出诊信息
      ];
    },
    copyTemplateRow: function copyTemplateRow(type) {
      var row = this.buildTemplateRow(type);
      var text = row.map(function (v) {
        return String(v !== null && v !== void 0 ? v : '');
      }).join('\t');
      uni.setClipboardData({
        data: text,
        success: function success() {
          return uni.showToast({
            title: "\u5DF2\u590D\u5236".concat(type === 'visitor' ? '游客' : '员工', "\u6A21\u677F\u6570\u636E"),
            icon: 'success'
          });
        }
      });
    },
    exportTemplateCSV: function exportTemplateCSV(type) {
      var header = this.getTemplateHeader().join(',');
      var row = this.buildTemplateRow(type).map(function (v) {
        return "\"".concat(String(v !== null && v !== void 0 ? v : '').replace(/"/g, '""'), "\"");
      }).join(',');
      var csv = "".concat(header, "\n").concat(row, "\n");
      try {
        var fs = wx.getFileSystemManager();
        var filePath = "".concat(wx.env.USER_DATA_PATH, "/daily_").concat(type, "_").concat(Date.now(), ".csv");
        fs.writeFile({
          filePath: filePath,
          data: csv,
          encoding: 'utf8',
          success: function success() {
            return wx.openDocument({
              filePath: filePath,
              fileType: 'csv',
              showMenu: true
            });
          }
        });
      } catch (e) {
        uni.setClipboardData({
          data: csv,
          success: function success() {
            return uni.showToast({
              title: '已复制CSV文本',
              icon: 'success'
            });
          }
        });
      }
    },
    // 复制游客报表（只复制数据行，不复制表头）
    copyVisitorReport: function copyVisitorReport() {
      if (!this.tableData) {
        uni.showToast({
          title: '暂无数据',
          icon: 'none'
        });
        return;
      }

      // 构建游客的日报行（只有数据，不含表头）
      var visitorRow = this.buildTemplateRow('visitor');
      var text = visitorRow.map(function (v) {
        return String(v !== null && v !== void 0 ? v : '');
      }).join('\t');

      // 复制到剪贴板
      uni.setClipboardData({
        data: text,
        success: function success() {
          uni.showToast({
            title: '已复制游客报表（可粘贴到Excel）',
            icon: 'success',
            duration: 2000
          });
        },
        fail: function fail() {
          uni.showToast({
            title: '复制失败',
            icon: 'none'
          });
        }
      });
    },
    // 复制员工报表（只复制数据行，不复制表头）
    copyEmployeeReport: function copyEmployeeReport() {
      if (!this.tableData) {
        uni.showToast({
          title: '暂无数据',
          icon: 'none'
        });
        return;
      }

      // 构建员工的日报行（只有数据，不含表头）
      var employeeRow = this.buildTemplateRow('employee');
      var text = employeeRow.map(function (v) {
        return String(v !== null && v !== void 0 ? v : '');
      }).join('\t');

      // 复制到剪贴板
      uni.setClipboardData({
        data: text,
        success: function success() {
          uni.showToast({
            title: '已复制员工报表（可粘贴到Excel）',
            icon: 'success',
            duration: 2000
          });
        },
        fail: function fail() {
          uni.showToast({
            title: '复制失败',
            icon: 'none'
          });
        }
      });
    },
    // 返回
    goBack: function goBack() {
      uni.navigateBack();
    },
    // 跳转到门诊登记页面
    goClinic: function goClinic() {
      uni.navigateTo({
        url: '/pages-sub/clinic/add'
      });
    }
  }
};
exports.default = _default;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 2)["default"], __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/wx.js */ 1)["default"]))

/***/ }),

/***/ 301:
/*!******************************************************************************************************!*\
  !*** D:/AK-PMS/pages-sub/report/daily.vue?vue&type=style&index=0&id=4d34a038&lang=scss&scoped=true& ***!
  \******************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_2_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_5_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_daily_vue_vue_type_style_index_0_id_4d34a038_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!./node_modules/mini-css-extract-plugin/dist/loader.js??ref--8-oneOf-1-0!./node_modules/css-loader/dist/cjs.js??ref--8-oneOf-1-1!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--8-oneOf-1-2!./node_modules/postcss-loader/src??ref--8-oneOf-1-3!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/sass-loader/dist/cjs.js??ref--8-oneOf-1-4!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--8-oneOf-1-5!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./daily.vue?vue&type=style&index=0&id=4d34a038&lang=scss&scoped=true& */ 302);
/* harmony import */ var _F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_2_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_5_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_daily_vue_vue_type_style_index_0_id_4d34a038_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_2_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_5_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_daily_vue_vue_type_style_index_0_id_4d34a038_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_2_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_5_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_daily_vue_vue_type_style_index_0_id_4d34a038_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_2_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_5_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_daily_vue_vue_type_style_index_0_id_4d34a038_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_2_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_5_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_daily_vue_vue_type_style_index_0_id_4d34a038_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ 302:
/*!**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js??ref--8-oneOf-1-0!./node_modules/css-loader/dist/cjs.js??ref--8-oneOf-1-1!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--8-oneOf-1-2!./node_modules/postcss-loader/src??ref--8-oneOf-1-3!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/sass-loader/dist/cjs.js??ref--8-oneOf-1-4!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--8-oneOf-1-5!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!D:/AK-PMS/pages-sub/report/daily.vue?vue&type=style&index=0&id=4d34a038&lang=scss&scoped=true& ***!
  \**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin
    if(false) { var cssReload; }
  

/***/ })

},[[295,"common/runtime","common/vendor"]]]);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages-sub/report/daily.js.map