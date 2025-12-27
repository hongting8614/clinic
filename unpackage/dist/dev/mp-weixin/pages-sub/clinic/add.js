(global["webpackJsonp"] = global["webpackJsonp"] || []).push([["pages-sub/clinic/add"],{

/***/ 431:
/*!*************************************************************!*\
  !*** D:/AK-PMS/main.js?{"page":"pages-sub%2Fclinic%2Fadd"} ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(wx, createPage) {

var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
__webpack_require__(/*! uni-pages */ 26);
var _vue = _interopRequireDefault(__webpack_require__(/*! vue */ 25));
var _add = _interopRequireDefault(__webpack_require__(/*! ./pages-sub/clinic/add.vue */ 432));
// @ts-ignore
wx.__webpack_require_UNI_MP_PLUGIN__ = __webpack_require__;
createPage(_add.default);
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/wx.js */ 1)["default"], __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 2)["createPage"]))

/***/ }),

/***/ 432:
/*!******************************************!*\
  !*** D:/AK-PMS/pages-sub/clinic/add.vue ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _add_vue_vue_type_template_id_0904e2e0_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./add.vue?vue&type=template&id=0904e2e0&scoped=true& */ 433);
/* harmony import */ var _add_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./add.vue?vue&type=script&lang=js& */ 435);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _add_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _add_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var _add_vue_vue_type_style_index_0_id_0904e2e0_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./add.vue?vue&type=style&index=0&id=0904e2e0&lang=scss&scoped=true& */ 437);
/* harmony import */ var _HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../HBuilderX/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/runtime/componentNormalizer.js */ 32);

var renderjs





/* normalize component */

var component = Object(_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _add_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _add_vue_vue_type_template_id_0904e2e0_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
  _add_vue_vue_type_template_id_0904e2e0_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "0904e2e0",
  null,
  false,
  _add_vue_vue_type_template_id_0904e2e0_scoped_true___WEBPACK_IMPORTED_MODULE_0__["components"],
  renderjs
)

component.options.__file = "pages-sub/clinic/add.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ 433:
/*!*************************************************************************************!*\
  !*** D:/AK-PMS/pages-sub/clinic/add.vue?vue&type=template&id=0904e2e0&scoped=true& ***!
  \*************************************************************************************/
/*! exports provided: render, staticRenderFns, recyclableRender, components */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_add_vue_vue_type_template_id_0904e2e0_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../HBuilderX/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../HBuilderX/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--17-0!../../../HBuilderX/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!../../../HBuilderX/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-uni-app-loader/page-meta.js!../../../HBuilderX/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../HBuilderX/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./add.vue?vue&type=template&id=0904e2e0&scoped=true& */ 434);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_add_vue_vue_type_template_id_0904e2e0_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_add_vue_vue_type_template_id_0904e2e0_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "recyclableRender", function() { return _HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_add_vue_vue_type_template_id_0904e2e0_scoped_true___WEBPACK_IMPORTED_MODULE_0__["recyclableRender"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "components", function() { return _HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_add_vue_vue_type_template_id_0904e2e0_scoped_true___WEBPACK_IMPORTED_MODULE_0__["components"]; });



/***/ }),

/***/ 434:
/*!*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--17-0!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-uni-app-loader/page-meta.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!D:/AK-PMS/pages-sub/clinic/add.vue?vue&type=template&id=0904e2e0&scoped=true& ***!
  \*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
  var g0 = _vm.showComplaintList && _vm.filteredComplaints.length > 0
  var g1 = _vm.showLocationList && _vm.filteredLocations.length > 0
  var g2 = _vm.showDiagnosisList && _vm.filteredDiagnosis.length > 0
  var g3 = g2 ? _vm.filteredDiagnosis.length : null
  var g4 = _vm.showSymptomList && _vm.filteredSymptoms.length > 0
  var g5 = _vm.showDiseaseList && _vm.filteredDiseases.length > 0
  var g6 = _vm.showTreatmentList && _vm.filteredTreatments.length > 0
  var g7 = _vm.showDrugList && _vm.filteredDrugs.length > 0
  var g8 = g7 ? _vm.filteredDrugs.length : null
  var g9 =
    _vm.showDrugList && _vm.drugSearchText && _vm.filteredDrugs.length === 0
  var m0 = _vm.selectedDrug ? _vm.getRealMinUnit(_vm.selectedDrug) : null
  var m1 = _vm.selectedDrug ? _vm.getRealMinUnit(_vm.selectedDrug) : null
  var m2 =
    _vm.selectedDrug && _vm.form.quantity > _vm.availableStock
      ? _vm.getRealMinUnit(_vm.selectedDrug)
      : null
  var m3 = _vm.selectedDrug ? _vm.getDosagePlaceholder(_vm.selectedDrug) : null
  var g10 = _vm.enablePrescription ? _vm.prescriptionList.length : null
  var l1 = _vm.enablePrescription
    ? _vm.__map(_vm.prescriptionList, function (item, index) {
        var $orig = _vm.__get_orig(item)
        var m4 = _vm.formatSpecQuantity(item)
        var m5 =
          item.dosage || item.route || item.frequency
            ? _vm.formatUsage(item)
            : null
        var g11 = item.batchAllocation && item.batchAllocation.length > 0
        var l0 = g11
          ? _vm.__map(item.batchAllocation, function (batch, bIndex) {
              var $orig = _vm.__get_orig(batch)
              var m6 = _vm.formatDate(batch.expireDate)
              return {
                $orig: $orig,
                m6: m6,
              }
            })
          : null
        return {
          $orig: $orig,
          m4: m4,
          m5: m5,
          g11: g11,
          l0: l0,
        }
      })
    : null
  var g12 = _vm.enablePrescription ? _vm.prescriptionList.length : null
  var g13 =
    _vm.enablePrescription && g12 > 0 ? _vm.prescriptionList.length : null
  var m7 = _vm.selectedBatch
    ? _vm.formatDate(_vm.selectedBatch.expiryDate)
    : null
  if (!_vm._isMounted) {
    _vm.e0 = function ($event) {
      _vm.noTipNextTime = !_vm.noTipNextTime
    }
    _vm.e1 = function ($event) {
      _vm.form.gender = "男"
    }
    _vm.e2 = function ($event) {
      _vm.form.gender = "女"
    }
    _vm.e3 = function ($event) {
      _vm.ageFocus = true
    }
    _vm.e4 = function ($event) {
      _vm.ageFocus = false
    }
    _vm.e5 = function ($event) {
      _vm.showDrugSelector = false
    }
    _vm.e6 = function ($event) {
      _vm.showDrugSelector = false
    }
  }
  _vm.$mp.data = Object.assign(
    {},
    {
      $root: {
        g0: g0,
        g1: g1,
        g2: g2,
        g3: g3,
        g4: g4,
        g5: g5,
        g6: g6,
        g7: g7,
        g8: g8,
        g9: g9,
        m0: m0,
        m1: m1,
        m2: m2,
        m3: m3,
        g10: g10,
        l1: l1,
        g12: g12,
        g13: g13,
        m7: m7,
      },
    }
  )
}
var recyclableRender = false
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ 435:
/*!*******************************************************************!*\
  !*** D:/AK-PMS/pages-sub/clinic/add.vue?vue&type=script&lang=js& ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_add_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../HBuilderX/HBuilderX/plugins/uniapp-cli/node_modules/babel-loader/lib!../../../HBuilderX/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--13-1!../../../HBuilderX/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!../../../HBuilderX/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../HBuilderX/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./add.vue?vue&type=script&lang=js& */ 436);
/* harmony import */ var _HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_add_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_add_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_add_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_add_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_add_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ 436:
/*!**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--13-1!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!D:/AK-PMS/pages-sub/clinic/add.vue?vue&type=script&lang=js& ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
var _defineProperty2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/defineProperty */ 11));
var _toConsumableArray2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/toConsumableArray */ 18));
var _typeof2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/typeof */ 13));
var _asyncToGenerator2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ 36));
var _methods;
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
var Signature = function Signature() {
  __webpack_require__.e(/*! require.ensure | components/signature/index */ "components/signature/index").then((function () {
    return resolve(__webpack_require__(/*! @/components/signature/index.vue */ 453));
  }).bind(null, __webpack_require__)).catch(__webpack_require__.oe);
};
// 欢乐谷主诉-关键词映射库（前端专用，用于主诉下拉联想）
// 说明：
// - key 为医生可能输入的关键词（疾病名/症状/场景词）
// - value 为若干主诉模板，每条包含疾病场景与规范主诉句子
var hvComplaintKeywordIndex = {
  // 外伤类 TR-01 皮肤擦伤/挫伤
  '擦伤': [{
    diseaseId: 'TR-01',
    diseaseName: '皮肤擦伤/挫伤',
    complaint: '摔倒后膝盖擦伤、疼痛'
  }, {
    diseaseId: 'TR-01',
    diseaseName: '皮肤擦伤/挫伤',
    complaint: '碰撞后手臂蹭破皮、红肿'
  }, {
    diseaseId: 'TR-01',
    diseaseName: '皮肤擦伤/挫伤',
    complaint: '被游乐设施擦伤、轻微出血'
  }, {
    diseaseId: 'TR-01',
    diseaseName: '皮肤擦伤/挫伤',
    complaint: '摔倒后多处擦伤、疼痛'
  }],
  '挫伤': [{
    diseaseId: 'TR-01',
    diseaseName: '皮肤擦伤/挫伤',
    complaint: '摔倒后膝盖擦伤、疼痛'
  }, {
    diseaseId: 'TR-01',
    diseaseName: '皮肤擦伤/挫伤',
    complaint: '碰撞后手臂蹭破皮、红肿'
  }],
  // 外伤类 TR-02 关节扭伤
  '扭伤': [{
    diseaseId: 'TR-02',
    diseaseName: '关节扭伤',
    complaint: '崴脚后脚踝疼痛、肿胀'
  }, {
    diseaseId: 'TR-02',
    diseaseName: '关节扭伤',
    complaint: '跑步摔倒后手腕扭伤、活动受限'
  }, {
    diseaseId: 'TR-02',
    diseaseName: '关节扭伤',
    complaint: '跳跃后膝关节扭伤、不能承重'
  }, {
    diseaseId: 'TR-02',
    diseaseName: '关节扭伤',
    complaint: '手腕扭伤、疼痛、活动困难'
  }],
  '崴脚': [{
    diseaseId: 'TR-02',
    diseaseName: '关节扭伤',
    complaint: '崴脚后脚踝疼痛、肿胀'
  }],
  // 外伤类 TR-03 头部轻微外伤
  '头部外伤': [{
    diseaseId: 'TR-03',
    diseaseName: '头部轻微外伤',
    complaint: '撞到头后头痛、头晕'
  }, {
    diseaseId: 'TR-03',
    diseaseName: '头部轻微外伤',
    complaint: '头部撞伤、起包、恶心'
  }, {
    diseaseId: 'TR-03',
    diseaseName: '头部轻微外伤',
    complaint: '头部碰伤、头痛想吐'
  }, {
    diseaseId: 'TR-03',
    diseaseName: '头部轻微外伤',
    complaint: '头部外伤后头晕、注意力不集中'
  }],
  // 外伤类 TR-04 可疑骨折
  '骨折': [{
    diseaseId: 'TR-04',
    diseaseName: '可疑骨折',
    complaint: '摔倒后手腕畸形、剧痛'
  }, {
    diseaseId: 'TR-04',
    diseaseName: '可疑骨折',
    complaint: '腿部撞击后肿胀变形、不能动'
  }, {
    diseaseId: 'TR-04',
    diseaseName: '可疑骨折',
    complaint: '高处跌落脚踝剧痛、畸形'
  }, {
    diseaseId: 'TR-04',
    diseaseName: '可疑骨折',
    complaint: '手指挤压后畸形、活动异常'
  }],
  // 环境类 EN-01 轻度中暑
  '中暑': [{
    diseaseId: 'EN-01',
    diseaseName: '轻度中暑',
    complaint: '太阳下排队后头晕、口渴、乏力'
  }, {
    diseaseId: 'EN-01',
    diseaseName: '轻度中暑',
    complaint: '天气热感觉头晕、恶心、出汗多'
  }, {
    diseaseId: 'EN-01',
    diseaseName: '轻度中暑',
    complaint: '长时间暴晒后头痛、乏力、口渴'
  }, {
    diseaseId: 'EN-01',
    diseaseName: '轻度中暑',
    complaint: '热天游玩后头晕、心慌、想吐'
  }],
  '暴晒': [{
    diseaseId: 'EN-01',
    diseaseName: '轻度中暑',
    complaint: '长时间暴晒后头痛、乏力、口渴'
  }, {
    diseaseId: 'EN-02',
    diseaseName: '热痉挛/热衰竭',
    complaint: '暴晒后大量出汗、头晕、肌肉痉挛'
  }],
  // 环境类 EN-02 热痉挛/热衰竭
  '热痉挛': [{
    diseaseId: 'EN-02',
    diseaseName: '热痉挛/热衰竭',
    complaint: '高温下活动后头晕、恶心、肌肉抽筋'
  }, {
    diseaseId: 'EN-02',
    diseaseName: '热痉挛/热衰竭',
    complaint: '热天跑步后乏力、头晕、小腿抽筋'
  }, {
    diseaseId: 'EN-02',
    diseaseName: '热痉挛/热衰竭',
    complaint: '暴晒后大量出汗、头晕、肌肉痉挛'
  }, {
    diseaseId: 'EN-02',
    diseaseName: '热痉挛/热衰竭',
    complaint: '高温环境头晕、呕吐、全身无力'
  }],
  // 环境类 EN-03 日光性皮炎
  '晒伤': [{
    diseaseId: 'EN-03',
    diseaseName: '日光性皮炎',
    complaint: '晒伤后皮肤发红、疼痛、灼热感'
  }, {
    diseaseId: 'EN-03',
    diseaseName: '日光性皮炎',
    complaint: '暴晒后皮肤红肿、刺痛、痒'
  }, {
    diseaseId: 'EN-03',
    diseaseName: '日光性皮炎',
    complaint: '晒后皮肤起红斑、脱皮、疼痛'
  }, {
    diseaseId: 'EN-03',
    diseaseName: '日光性皮炎',
    complaint: '太阳晒后皮肤发红起泡、灼痛'
  }],
  // 环境类 EN-04 蚊虫叮咬过敏
  '蚊虫叮咬': [{
    diseaseId: 'EN-04',
    diseaseName: '蚊虫叮咬过敏',
    complaint: '被蚊子咬后红肿、瘙痒'
  }, {
    diseaseId: 'EN-04',
    diseaseName: '蚊虫叮咬过敏',
    complaint: '虫咬后起大包、很痒'
  }, {
    diseaseId: 'EN-04',
    diseaseName: '蚊虫叮咬过敏',
    complaint: '蚊虫叮咬处红肿热痛'
  }, {
    diseaseId: 'EN-04',
    diseaseName: '蚊虫叮咬过敏',
    complaint: '虫咬后皮疹、瘙痒难忍'
  }],
  // 消化 GI-01 急性胃肠炎
  '腹泻': [{
    diseaseId: 'GI-01',
    diseaseName: '急性胃肠炎',
    complaint: '吃坏肚子后呕吐、腹泻、腹痛'
  }, {
    diseaseId: 'GI-01',
    diseaseName: '急性胃肠炎',
    complaint: '进食后恶心呕吐、拉肚子'
  }, {
    diseaseId: 'GI-01',
    diseaseName: '急性胃肠炎',
    complaint: '呕吐腹泻、肚子绞痛、发热'
  }, {
    diseaseId: 'GI-01',
    diseaseName: '急性胃肠炎',
    complaint: '恶心、拉肚子、肚子咕咕叫'
  }],
  // 消化 GI-02 功能性消化不良
  '消化不良': [{
    diseaseId: 'GI-02',
    diseaseName: '功能性消化不良',
    complaint: '吃太多后胃胀、反酸、不舒服'
  }, {
    diseaseId: 'GI-02',
    diseaseName: '功能性消化不良',
    complaint: '饭后胃痛、饱胀感、嗳气'
  }, {
    diseaseId: 'GI-02',
    diseaseName: '功能性消化不良',
    complaint: '胃部不适、食欲不振、腹胀'
  }, {
    diseaseId: 'GI-02',
    diseaseName: '功能性消化不良',
    complaint: '吃东西后胃疼、反酸烧心'
  }],
  // 神经 NS-01 晕动病
  '晕动病': [{
    diseaseId: 'NS-01',
    diseaseName: '晕动病',
    complaint: '坐旋转项目后头晕、恶心、想吐'
  }, {
    diseaseId: 'NS-01',
    diseaseName: '晕动病',
    complaint: '玩游乐设施后头晕、出冷汗、心慌'
  }, {
    diseaseId: 'NS-01',
    diseaseName: '晕动病',
    complaint: '晕车样感觉、头晕恶心、脸色苍白'
  }, {
    diseaseId: 'NS-01',
    diseaseName: '晕动病',
    complaint: '旋转后眩晕、呕吐、乏力'
  }],
  '眩晕': [{
    diseaseId: 'NS-01',
    diseaseName: '晕动病',
    complaint: '旋转后眩晕、呕吐、乏力'
  }, {
    diseaseId: 'VR-01',
    diseaseName: '游乐设施后眩晕',
    complaint: '旋转项目后眩晕、恶心'
  }, {
    diseaseId: 'VR-02',
    diseaseName: '前庭性眩晕',
    complaint: '天旋地转的眩晕、伴呕吐'
  }],
  // 神经 NS-02 过度惊吓反应
  '惊吓': [{
    diseaseId: 'NS-02',
    diseaseName: '过度惊吓反应',
    complaint: '鬼屋出来后心慌、手抖、害怕'
  }, {
    diseaseId: 'NS-02',
    diseaseName: '过度惊吓反应',
    complaint: '受惊吓后心慌、头晕、出汗'
  }, {
    diseaseId: 'NS-02',
    diseaseName: '过度惊吓反应',
    complaint: '惊吓后心跳很快、紧张不安'
  }, {
    diseaseId: 'NS-02',
    diseaseName: '过度惊吓反应',
    complaint: '恐怖项目后恐惧、失眠、噩梦'
  }],
  // 心理 PS-01 儿童分离焦虑
  '走失': [{
    diseaseId: 'PS-01',
    diseaseName: '儿童分离焦虑',
    complaint: '小孩与父母走散后哭闹、害怕'
  }, {
    diseaseId: 'PS-01',
    diseaseName: '儿童分离焦虑',
    complaint: '儿童找不到家长、焦虑哭闹'
  }, {
    diseaseId: 'PS-01',
    diseaseName: '儿童分离焦虑',
    complaint: '孩子分离后恐慌、不肯离开'
  }, {
    diseaseId: 'PS-01',
    diseaseName: '儿童分离焦虑',
    complaint: '儿童焦虑、紧抓不放、哭泣'
  }],
  // 心理 PS-02 过度换气综合征
  '过度换气': [{
    diseaseId: 'PS-02',
    diseaseName: '过度换气综合征',
    complaint: '紧张后呼吸急促、手脚发麻'
  }, {
    diseaseId: 'PS-02',
    diseaseName: '过度换气综合征',
    complaint: '焦虑发作呼吸快、头晕、手麻'
  }, {
    diseaseId: 'PS-02',
    diseaseName: '过度换气综合征',
    complaint: '恐慌时喘不过气、手抽筋'
  }, {
    diseaseId: 'PS-02',
    diseaseName: '过度换气综合征',
    complaint: '呼吸过快、胸口闷、嘴唇发麻'
  }],
  // VR-01 游乐设施后眩晕
  '过山车': [{
    diseaseId: 'VR-01',
    diseaseName: '游乐设施后眩晕',
    complaint: '玩过山车后头晕、站不稳'
  }, {
    diseaseId: 'MS-01',
    diseaseName: '颈部挥鞭样损伤',
    complaint: '坐过山车后脖子痛、僵硬'
  }],
  '游乐设施': [{
    diseaseId: 'VR-01',
    diseaseName: '游乐设施后眩晕',
    complaint: '游乐设施后头昏、平衡差'
  }, {
    diseaseId: 'MS-01',
    diseaseName: '颈部挥鞭样损伤',
    complaint: '游乐设施后颈部酸痛、头晕'
  }],
  // VR-02 前庭性眩晕 & VR-03 耳石症
  '前庭性眩晕': [{
    diseaseId: 'VR-02',
    diseaseName: '前庭性眩晕',
    complaint: '天旋地转的眩晕、伴呕吐'
  }, {
    diseaseId: 'VR-02',
    diseaseName: '前庭性眩晕',
    complaint: '眩晕感觉房子在转、恶心'
  }, {
    diseaseId: 'VR-02',
    diseaseName: '前庭性眩晕',
    complaint: '剧烈眩晕、必须闭眼躺下'
  }, {
    diseaseId: 'VR-02',
    diseaseName: '前庭性眩晕',
    complaint: '旋转性眩晕、伴耳鸣'
  }],
  '耳石症': [{
    diseaseId: 'VR-03',
    diseaseName: '耳石症',
    complaint: '转头时突发眩晕、几秒钟就好'
  }, {
    diseaseId: 'VR-03',
    diseaseName: '耳石症',
    complaint: '起床翻身时短暂天旋地转'
  }, {
    diseaseId: 'VR-03',
    diseaseName: '耳石症',
    complaint: '头位变化时剧烈眩晕、不敢动'
  }, {
    diseaseId: 'VR-03',
    diseaseName: '耳石症',
    complaint: '特定姿势时眩晕发作'
  }],
  // GY-01/02/03 痛经
  '痛经': [{
    diseaseId: 'GY-01',
    diseaseName: '轻度痛经',
    complaint: '来月经肚子隐痛、腰酸'
  }, {
    diseaseId: 'GY-01',
    diseaseName: '轻度痛经',
    complaint: '经期小腹坠痛、乏力'
  }, {
    diseaseId: 'GY-02',
    diseaseName: '中度痛经',
    complaint: '痛经明显、影响游玩'
  }, {
    diseaseId: 'GY-03',
    diseaseName: '重度痛经',
    complaint: '痛经剧痛、出冷汗、想吐'
  }],
  // MT-01/02/03 低血糖
  '低血糖': [{
    diseaseId: 'MT-01',
    diseaseName: '轻度低血糖',
    complaint: '心慌手抖、出冷汗、饥饿感'
  }, {
    diseaseId: 'MT-01',
    diseaseName: '轻度低血糖',
    complaint: '头晕心慌、手抖乏力'
  }, {
    diseaseId: 'MT-01',
    diseaseName: '轻度低血糖',
    complaint: '游玩久了心慌、出汗、饿'
  }, {
    diseaseId: 'MT-02',
    diseaseName: '中重度低血糖',
    complaint: '低血糖意识模糊、反应迟钝'
  }, {
    diseaseId: 'MT-03',
    diseaseName: '低血糖昏迷',
    complaint: '低血糖昏迷、意识丧失'
  }]
};
var _default = {
  components: {
    Signature: Signature
  },
  data: function data() {
    return {
      locations: [{
        label: '陆园',
        value: 'land_park'
      }, {
        label: '水园',
        value: 'water_park'
      }],
      identityOptions: [{
        label: '游客',
        value: '游客'
      }, {
        label: '员工',
        value: '员工'
      }],
      visitTypeOptions: [{
        label: '否',
        value: 'clinic'
      }, {
        label: '是',
        value: 'outcall'
      }],
      // 疾病→诊断与处置模板
      diseaseTemplates: {
        '扭伤': ['踝关节扭伤', '腕关节扭伤', '膝关节扭伤', '肩关节扭伤', '颈部肌肉拉伤', '腰部肌筋膜拉伤', '外侧副韧带拉伤'],
        '擦伤': ['皮肤表浅擦伤', '肘部擦伤', '膝部擦伤', '手掌擦伤', '面部擦伤', '小腿擦伤', '躯干擦伤'],
        '烫伤': ['Ⅰ度热烫伤', '手部轻度烫伤', '前臂轻度烫伤', '躯干轻度烫伤', '热液烫伤（表浅）', '蒸汽烫伤（表浅）'],
        '磕伤': ['软组织挫伤', '头皮挫伤', '膝部挫伤', '前臂挫伤', '小腿挫伤', '肩部挫伤', '足背挫伤'],
        '冻伤': ['末端轻度冻伤', '面部轻度冻伤', '手指冻伤（表浅）', '耳廓冻伤（表浅）', '足趾冻伤（表浅）'],
        '腹泻': ['急性胃肠炎', '受凉所致腹泻', '饮食不洁所致腹泻', '功能性腹泻', '旅游者腹泻'],
        '头晕': ['体位性低血压', '中暑轻型后遗症', '疲劳性头晕', '低血糖相关头晕', '颈源性头晕可能'],
        '头痛': ['紧张性头痛', '外伤后轻度头痛', '偏头痛样头痛（既往史）', '感冒相关头痛', '鼻窦炎相关头痛可能'],
        '感冒': ['上呼吸道感染（轻）', '风寒感冒', '暑湿感冒', '咽喉炎伴感冒', '腺样体样症状可能'],
        '脱臼': ['手指小关节脱位（已复位）', '肩关节轻度半脱位（建议转诊）', '髌骨半脱位可能'],
        '骨折': ['疑似骨折（建议影像学检查）', '手指末节疑似骨折', '前臂疑似骨折', '锁骨疑似骨折'],
        '过敏': ['荨麻疹样皮疹', '接触性皮炎', '虫咬后过敏反应', '花粉过敏样反应', '食物相关过敏可能'],
        '痛经': ['原发性痛经', '寒凝血瘀型痛经', '气滞血瘀型痛经'],
        '测血压': ['血压偏高待复测', '血压偏低伴轻度头晕', '血压正常记录观察'],
        '其他': ['一般外伤处理', '非特异性不适，建议观察', '情绪紧张相关不适']
      },
      treatmentTemplates: {
        '扭伤': ['冷敷+弹性绷带加压包扎', '制动抬高24-48h', '必要时外固定并转诊', '48小时后热敷功能锻炼'],
        '擦伤': ['清创冲洗（盐水/3%双氧水）', '碘伏消毒+无菌敷贴', '必要时外用湿润烧伤膏', '换药观察渗出感染'],
        '烫伤': ['冷水冲洗15-20分钟', '碘伏/湿润烧伤膏外用', '无菌敷贴覆盖', '避免刺破水疱并观察'],
        '磕伤': ['局部冷敷+弹力绷带', '碘伏消毒处理', '必要时观察肿胀变化', '超过48小时改热敷促进吸收'],
        '冻伤': ['温水复温（37-40℃）', '干燥保暖与保护', '避免摩擦与再次受冷', '必要时外用保护性敷贴'],
        '腹泻': ['口服补液/葡萄糖粉剂一次', '饮食清淡+观察', '必要时解痉止泻', '注意补盐与复诊提示'],
        '头晕': ['测血压、观察休息', '口服葡萄糖粉剂一次', '必要时对症处理', '避免剧烈运动与久站'],
        '头痛': ['对症止痛（布洛芬一次）', '补液与休息', '观察诱因与复诊建议', '避免强光久屏使用'],
        '感冒': ['藿香正气水一次', '对症退热镇痛（布洛芬一次）', '多饮水休息', '含服草珊瑚/板蓝根冲剂'],
        '脱臼': ['制动固定+冷敷', '建议影像学及专科处理', '避免自行反复活动'],
        '骨折': ['制动固定+冷敷', '立即转诊影像学检查', '必要时止痛处理'],
        '过敏': ['口服氯雷他定一次', '外用红肿冷敷', '观察呼吸道症状', '避免继续接触可疑过敏原'],
        '痛经': ['热敷腹部、休息', '必要时对症解痉', '注意保暖与规律作息'],
        '测血压': ['复测并记录', '异常者建议随访或转诊', '生活方式指导'],
        '其他': ['对症观察+健康教育', '必要时随访']
      },
      // 主诉（症状）模板
      complaintTemplates: {
        '扭伤': '扭伤后局部疼痛肿胀，活动受限',
        '擦伤': '皮肤表浅擦伤，轻度渗血/疼痛',
        '烫伤': '热液/蒸汽烫伤，局部红肿灼痛',
        '磕伤': '碰撞致局部疼痛肿胀',
        '冻伤': '受寒后局部麻木疼痛，皮肤颜色改变',
        '腹泻': '近一天腹泻多次，伴轻度腹痛/乏力',
        '头晕': '阵发性头晕，伴乏力/站立不稳',
        '头痛': '持续性头痛，紧张诱发明显',
        '感冒': '咳嗽流涕咽痛，乏力/低热',
        '脱臼': '外伤后关节畸形疼痛，活动受限',
        '骨折': '外伤后局部肿胀疼痛，活动受限',
        '过敏': '全身/局部皮疹瘙痒，接触史阳性',
        '痛经': '经期下腹阵发性疼痛',
        '测血压': '测血压复查，无明显不适',
        '中暑': '户外暴晒后头晕乏力出汗增多',
        '咽喉痛': '咽部疼痛，吞咽不适',
        '皮疹': '皮疹伴瘙痒，抓挠后加重',
        '牙痛': '患牙疼痛，冷热刺激明显',
        '关节痛': '关节活动痛，活动后加重'
      },
      // 注意事项/复诊提示（按疾病自动附加到处置）
      treatmentCautions: {
        '腹泻': ['补液：小口频饮，注意补盐', '清淡饮食，避免油腻辛辣', '48小时未缓解或伴高热/血便请及时复诊'],
        '头晕': ['休息，避免久站/剧烈运动', '监测血压与症状变化', '症状持续或加重请复诊'],
        '头痛': ['注意休息与补水', '减少长时间屏幕与强光刺激', '频繁发作或伴呕吐/视物模糊请复诊'],
        '感冒': ['多饮水休息，注意保暖与口罩礼仪', '对症用药后观察', '发热＞38.5℃或持续超过3天请复诊']
      },
      hvTriage: null,
      // 结构化疾病模板库：每个疾病下多条主诉，每条主诉有独立的症状/诊断/处置
      // 后续可以扩展 drugs 字段
      diseaseTemplateLib: {
        '感冒': [{
          complaint: '咳嗽流涕咽痛，伴乏力低热',
          symptoms: ['近1～2日出现咳嗽、流涕、咽痛，体温不高于38.5℃', '伴轻度乏力，无明显呼吸困难'],
          diagnoses: ['上呼吸道感染（轻型）', '病毒性上呼吸道感染可能'],
          treatments: ['多饮水休息，注意保暖', '口服对症药物（如退热镇痛药）', '观察体温及症状变化，必要时复诊']
        }, {
          complaint: '受凉后出现流涕咳嗽、咽痛，伴头痛乏力',
          symptoms: ['受凉后出现流涕、咳嗽、咽痛约1日', '伴头痛乏力，无胸闷气促'],
          diagnoses: ['风寒感冒', '急性上呼吸道感染'],
          treatments: ['口服感冒药物一次，注意用药间隔', '注意保暖，减少户外暴露', '嘱如体温持续升高或症状加重及时就诊']
        }, {
          complaint: '游玩途中出现流涕、喷嚏、轻度咳嗽，伴乏力',
          symptoms: ['游玩途中出现流涕、喷嚏，偶有轻度咳嗽', '体温基本正常或轻度升高'],
          diagnoses: ['普通感冒', '上呼吸道感染待排'],
          treatments: ['暂时减少剧烈项目，多饮温水', '根据需要给予含片或口服感冒药', '嘱观察症状，如发热明显或精神状态差需就诊']
        }],
        '扭伤': [{
          complaint: '行走时不慎扭伤踝关节，局部肿胀疼痛，活动受限',
          symptoms: ['踝关节局部肿胀疼痛，活动受限', '皮肤完整，无明显畸形'],
          diagnoses: ['踝关节软组织扭伤', '韧带拉伤可能'],
          treatments: ['24小时内局部冷敷', '弹力绷带加压包扎，减少负重', '抬高患肢，必要时转诊影像学检查']
        }, {
          complaint: '运动时扭伤膝关节，行走困难',
          symptoms: ['膝关节局部肿胀疼痛，行走时加重', '关节活动受限'],
          diagnoses: ['膝关节扭伤', '内侧副韧带拉伤可能'],
          treatments: ['局部冷敷、制动休息', '建议影像学检查，必要时转诊', '避免剧烈运动及负重行走']
        }, {
          complaint: '玩项目时不慎扭伤腕关节，局部疼痛肿胀',
          symptoms: ['腕关节局部压痛、轻度肿胀', '活动时疼痛加重，静息时稍缓解'],
          diagnoses: ['腕关节软组织扭伤'],
          treatments: ['局部冷敷，抬高患肢', '弹力绷带适度加压固定', '嘱避免提重物，如疼痛明显或活动受限加重及时复诊']
        }],
        '擦伤': [{
          complaint: '玩耍时摔倒致膝部皮肤擦伤，伴轻度渗血疼痛',
          symptoms: ['膝部皮肤表浅擦伤，少量渗血', '局部疼痛，无明显肿胀'],
          diagnoses: ['膝部皮肤表浅擦伤'],
          treatments: ['清水/生理盐水冲洗创面', '碘伏消毒后无菌敷贴覆盖', '交代保持创面清洁干燥，观察感染迹象'],
          suggestDrugs: ['碘伏', '无菌敷贴', '海诺创可贴']
        }, {
          complaint: '活动时摔倒致手掌擦伤，局部疼痛',
          symptoms: ['手掌皮肤表浅擦伤，少量渗血或渗液', '局部疼痛，活动基本自如'],
          diagnoses: ['手掌皮肤表浅擦伤'],
          treatments: ['冲洗清洁创面', '碘伏消毒后覆以创可贴或无菌敷贴', '嘱避免频繁摩擦及浸水'],
          suggestDrugs: ['碘伏', '海诺创可贴']
        }, {
          complaint: '滑倒致肘部擦伤，局部疼痛伴少量渗血',
          symptoms: ['肘部局部表浅皮肤擦伤，少量渗血或结痂', '关节活动基本自如，可有轻微牵拉痛'],
          diagnoses: ['肘部皮肤表浅擦伤'],
          treatments: ['生理盐水或清水冲洗创面', '碘伏消毒后敷贴无菌敷料', '嘱保持伤口清洁干燥，避免剧烈活动']
        }],
        '烫伤': [{
          complaint: '被热饮不慎泼洒致手部局部红肿灼痛',
          symptoms: ['手背/手掌局部皮肤潮红、水肿', '疼痛明显，无大疱或少量小疱'],
          diagnoses: ['手部表浅Ⅰ度热烫伤'],
          treatments: ['流动冷水冲洗15～20分钟', '外用湿润烧伤膏或同类药物', '无菌敷料覆盖，嘱避免刺破水疱'],
          suggestDrugs: ['湿润烧伤膏', '无菌敷贴']
        }, {
          complaint: '接触热汤/蒸汽后前臂烫伤，局部红肿疼痛',
          symptoms: ['前臂局部皮肤潮红，轻度水肿', '疼痛明显，部分可见小疱'],
          diagnoses: ['前臂表浅热烫伤'],
          treatments: ['及时冷水冲洗降温', '局部外用烧伤药物并覆盖敷料', '交代观察感染迹象，如红肿加重及时复诊']
        }, {
          complaint: '不慎接触热锅边缘致手指局部烫伤',
          symptoms: ['手指局部皮肤潮红或轻度水疱', '局部灼痛明显，活动基本不受限'],
          diagnoses: ['手指轻度热烫伤'],
          treatments: ['冷水冲洗患处10～15分钟', '外用湿润烧伤膏或同类药物', '避免刺破水疱，注意保持患处清洁']
        }],
        '中暑': [{
          complaint: '户外排队久站后出现头晕乏力出汗增多',
          symptoms: ['在高温环境中活动后出现头晕、乏力、出汗增多', '皮肤潮红或湿冷，口渴'],
          diagnoses: ['中暑轻型'],
          treatments: ['转移至阴凉通风处休息', '口服补液或葡萄糖溶液', '物理降温（冷敷额头、颈部等）', '观察症状变化，如加重及时转诊'],
          suggestDrugs: ['藿香正气水', '葡萄糖粉剂']
        }, {
          complaint: '在阳光下玩耍后感到头痛、恶心、全身乏力',
          symptoms: ['户外暴晒后出现头痛、恶心、乏力', '部分伴有轻度心悸'],
          diagnoses: ['中暑样反应'],
          treatments: ['立即脱离高温环境，卧床休息', '口服补液，必要时给予对症药物', '嘱家属/同伴观察，如出现意识改变立即送医']
        }],
        '腹泻': [{
          complaint: '进食冷饮或不洁食物后出现腹泻，多次稀便',
          symptoms: ['近1日多次稀便，伴轻度腹痛', '无明显高热或严重脱水表现'],
          diagnoses: ['急性胃肠炎（轻型）'],
          treatments: ['口服补液盐/葡萄糖溶液，小口多次', '暂避油腻辛辣及生冷饮食', '观察体温及大便次数，症状加重时及时就诊'],
          suggestDrugs: ['诺氟沙星胶囊', '藿香正气水']
        }, {
          complaint: '游玩期间出现腹泻伴轻度腹痛乏力',
          symptoms: ['反复稀便，腹部隐痛或阵发性腹痛', '伴乏力，食欲下降'],
          diagnoses: ['功能性腹泻可能', '消化不良'],
          treatments: ['建议口服补液，注意休息', '清淡饮食，避免刺激性食物', '如出现血便、高热等需尽快就诊']
        }],
        '过敏': [{
          complaint: '接触不明物后出现全身皮疹瘙痒',
          symptoms: ['全身或局部出现红色丘疹/风团样皮疹', '瘙痒明显，无呼吸困难'],
          diagnoses: ['荨麻疹样皮疹', '过敏反应'],
          treatments: ['口服抗组胺药一次', '局部可外用止痒药物', '避免继续接触可疑过敏原，观察症状变化'],
          suggestDrugs: ['氯雷他定片（开瑞坦）']
        }, {
          complaint: '虫咬后局部红肿瘙痒不适',
          symptoms: ['局部红肿、皮疹，瘙痒明显', '一般全身情况尚可'],
          diagnoses: ['虫咬性皮炎'],
          treatments: ['局部冷敷或外用止痒药膏', '必要时口服抗过敏药', '嘱避免搔抓，观察有无加重或全身反应']
        }, {
          complaint: '食用某种食物后出现口唇轻度肿胀瘙痒',
          symptoms: ['食用可疑食物后短时间内出现口周或口唇轻度肿胀、瘙痒', '无明显呼吸困难或胸闷气促'],
          diagnoses: ['食物相关轻度过敏反应'],
          treatments: ['口服抗组胺药一次', '暂避可疑食物，嘱观察症状变化', '如出现呼吸困难、胸闷或全身症状需立即就医']
        }],
        '头晕': [{
          complaint: '在园区内长时间排队后出现头晕乏力',
          symptoms: ['长时间站立或排队后感到头晕、眼前发黑', '伴轻度乏力，平卧休息后好转'],
          diagnoses: ['体位性低血压可能', '疲劳相关头晕'],
          treatments: ['协助平卧或半卧休息', '口服葡萄糖溶液或温水', '嘱缓慢起身，短期内避免剧烈项目']
        }, {
          complaint: '天气炎热时活动后出现头晕伴出汗乏力',
          symptoms: ['在高温环境下活动后出现头晕、乏力、大量出汗', '皮肤潮红或湿冷，口渴'],
          diagnoses: ['中暑轻型', '高温相关不适'],
          treatments: ['转移至阴凉通风处休息', '口服补液盐或葡萄糖溶液', '适当物理降温，观察症状变化']
        }],
        '头痛': [{
          complaint: '久看手机或屏幕后出现头痛、眼胀',
          symptoms: ['长时间使用电子屏幕后出现额部或双侧头痛', '伴眼胀、颈部酸痛，休息后可缓解'],
          diagnoses: ['紧张性头痛', '视疲劳相关头痛'],
          treatments: ['建议暂时远离屏幕，闭目休息', '根据需要口服对症止痛药一次', '注意补水与颈肩放松练习']
        }, {
          complaint: '户外活动后出现搏动性头痛，伴轻度恶心',
          symptoms: ['一侧或双侧搏动样头痛', '可伴恶心、对强光和噪声敏感'],
          diagnoses: ['偏头痛样头痛可能'],
          treatments: ['安排在安静、光线柔和环境休息', '根据情况口服止痛药物一次', '如反复发作或伴有神经系统症状建议进一步检查']
        }],
        // 低血糖相关
        '低血糖': [{
          complaint: '空腹游玩后出现心慌出汗手抖',
          symptoms: ['长时间未进食后出现心慌、出冷汗、手抖', '可伴轻度头晕、乏力'],
          diagnoses: ['低血糖样反应', '空腹相关低血糖可能'],
          treatments: ['立即口服含糖饮料或葡萄糖溶液', '短期观察症状变化，缓解后继续补充少量主食', '提醒避免长时间空腹进行高强度活动，如症状不缓解建议就医'],
          suggestDrugs: ['葡萄糖粉剂']
        }, {
          complaint: '测血糖结果偏低，伴头晕乏力',
          symptoms: ['血糖监测结果低于正常范围', '伴有乏力、头晕、出汗等不适'],
          diagnoses: ['低血糖发作（轻型）'],
          treatments: ['立即补充糖分，口服葡萄糖或含糖饮料', '复测血糖并观察症状变化', '有糖尿病等基础疾病者建议回原随访医院评估用药']
        }],
        // 发作/癫痫/晕厥相关
        '发作': [{
          complaint: '既往有癫痫史，本次在园区内出现抽搐发作',
          symptoms: ['突发意识障碍，伴四肢抽动', '发作后短暂嗜睡或意识模糊'],
          diagnoses: ['癫痫发作（既往癫痫史）'],
          treatments: ['发作期注意头偏向一侧，防止误吸，勿强行按压肢体', '发作停止后侧卧位休息，保持呼吸道通畅', '建议尽快联系家属并由神经专科进一步评估']
        }, {
          complaint: '无明确既往史，本次突发抽搐样发作伴短暂意识丧失',
          symptoms: ['短暂意识障碍或意识丧失', '四肢不自主抽动，事后记忆不清'],
          diagnoses: ['癫痫样发作待排'],
          treatments: ['发作期注意安全保护，防止跌落伤及头面部', '发作后注意生命体征监测', '建议尽快转诊神经专科完善检查']
        }, {
          complaint: '短暂晕倒后自行苏醒，无持续神经功能缺损',
          symptoms: ['突发短暂意识丧失，倒地后很快清醒', '事后可伴轻度乏力或头晕'],
          diagnoses: ['不明原因晕厥待排'],
          treatments: ['平卧抬高下肢，监测血压和心率', '建议行心电图及相关检查', '如反复发作或伴胸痛气促等症状应尽快就医']
        }],
        // 痛经类
        '痛经': [{
          complaint: '来月经肚子隐痛、腰酸',
          symptoms: ['经期下腹部隐痛或胀痛，可放射至腰骶部', '伴腰酸、乏力，疼痛程度较轻，不影响日常活动', '月经量正常或略多，无血块或血块较少'],
          diagnoses: ['轻度痛经', '原发性痛经可能'],
          treatments: ['热敷腹部、休息', '必要时对症解痉', '注意保暖与规律作息'],
          suggestDrugs: ['布洛芬缓释胶囊']
        }, {
          complaint: '经期小腹坠痛、乏力',
          symptoms: ['经期下腹部坠痛或胀痛，疼痛程度中等', '伴乏力、腰酸，可能影响部分活动', '月经量正常，可有少量血块', '无恶心、呕吐等严重症状'],
          diagnoses: ['中度痛经', '原发性痛经', '寒凝血瘀型痛经可能'],
          treatments: ['热敷腹部、休息', '口服解痉止痛药（如布洛芬）', '注意保暖，避免受凉', '规律作息，避免过度劳累'],
          suggestDrugs: ['布洛芬缓释胶囊', '元胡止痛片']
        }, {
          complaint: '痛经明显、影响游玩',
          symptoms: ['经期下腹部明显疼痛，疼痛程度较重', '疼痛影响正常活动，可能需要休息', '可伴腰酸、乏力、情绪不佳', '月经量正常或略多，可有血块'],
          diagnoses: ['中度痛经', '原发性痛经', '气滞血瘀型痛经可能'],
          treatments: ['热敷腹部、休息', '口服解痉止痛药', '注意保暖与规律作息', '如疼痛持续或加重，建议妇科门诊进一步检查'],
          suggestDrugs: ['布洛芬缓释胶囊', '元胡止痛片']
        }, {
          complaint: '痛经剧痛、出冷汗、想吐',
          symptoms: ['经期下腹部剧烈疼痛，呈痉挛性或持续性', '疼痛难以忍受，严重影响活动', '伴出冷汗、面色苍白、恶心、想吐', '可伴头晕、乏力，甚至需要卧床休息', '月经量正常或略多，血块可能较多'],
          diagnoses: ['重度痛经', '原发性痛经', '继发性痛经待排'],
          treatments: ['立即休息，平卧休息', '热敷腹部，注意保暖', '口服解痉止痛药（如布洛芬）', '建议完善妇科检查，排除器质性疾病', '如症状严重或持续不缓解，建议转诊妇科专科'],
          suggestDrugs: ['布洛芬缓释胶囊', '元胡止痛片']
        }],
        // 测量/监测类
        '测量监测': [{
          complaint: '因自觉不适前来测量血压',
          symptoms: ['主诉头晕、心慌或乏力等症状', '血压监测结果在正常范围或略有波动'],
          diagnoses: ['血压监测（结果正常）'],
          treatments: ['记录血压结果，建议保持良好作息', '如反复出现不适或血压明显波动，建议门诊随访']
        }, {
          complaint: '因头晕来测血压，结果偏高',
          symptoms: ['血压监测结果偏高，伴轻度不适', '可有头晕、头胀或耳鸣'],
          diagnoses: ['血压监测（结果偏高）', '血压偏高待复测'],
          treatments: ['建议安静休息后复测血压', '如多次测量均偏高，建议至门诊进一步评估', '注意饮食和作息管理']
        }, {
          complaint: '因乏力、心慌等不适来测血糖',
          symptoms: ['血糖监测结果偏低', '伴有乏力、头晕、手抖等低血糖相关症状'],
          diagnoses: ['血糖监测（结果偏低）', '低血糖样反应'],
          treatments: ['口服含糖饮料或葡萄糖溶液', '短期内避免再次空腹高强度活动', '如症状不缓解或反复发作应尽快就医'],
          suggestDrugs: ['葡萄糖粉剂']
        }],
        // 劳损/慢性疼痛（主要面向员工）
        '劳损/慢性疼痛': [{
          complaint: '长时间站立或弯腰后出现腰背酸痛',
          symptoms: ['腰背部酸胀不适', '活动后疼痛加重，休息后可缓解'],
          diagnoses: ['腰背肌筋膜炎'],
          treatments: ['减少久坐久站，适当活动和拉伸腰背肌肉', '可外用止痛贴等对症处理', '如疼痛持续加重或伴下肢放射痛建议进一步检查']
        }, {
          complaint: '长期伏案或低头工作后颈肩部酸痛不适',
          symptoms: ['颈肩部肌肉紧张酸痛', '久坐或保持同一姿势后症状加重'],
          diagnoses: ['颈椎病可能'],
          treatments: ['注意工作姿势，每小时起身活动颈肩部', '可行颈肩放松训练及局部热敷', '如伴上肢放射痛或麻木应尽快就医']
        }]
      },
      // 常用药材（口服/外用一次）
      drugSuggestionList: ['棉签', '碘伏', '海诺创可贴', '云南白药创可贴', '一次性乳胶手套', '纱布块', '3%过氧化氢消毒液', '余氯试纸', '葡萄糖粉剂', '利多卡因气雾剂', '消旋山莨菪碱片', '甲氧氯普胺片', '诺氟沙星胶囊', '维U颠茄铝胶囊', '草珊瑚含片', '氯芬黄敏片', '布洛芬缓释胶囊', '多潘立酮片', '速效救心丸', '脱敏胶带', '盐水清洗液', '一次性吸氧管', '氧气袋', '红霉素眼膏', '左氧氟沙星滴眼液', '藿香正气水', '板蓝根颗粒', '无菌敷贴', '外科口罩', '湿润烧伤膏', '氯雷他定片（开瑞坦）', '金士康和盐水清洗液'],
      rxDrugNames: ['诺氟沙星胶囊', '速效救心丸', '布洛芬缓释胶囊', '多潘立酮片', '甲氧氯普胺片'],
      form: {
        visitDateTime: '',
        name: '',
        gender: '男',
        age: null,
        identity: '游客',
        location: '',
        visitType: 'clinic',
        injuryLocation: '',
        chiefComplaint: '',
        symptom: '',
        diseaseName: '',
        diagnosis: '',
        treatment: '',
        drugId: '',
        quantity: null,
        remark: '',
        doctorSign: '',
        signTime: ''
      },
      showLocationTip: true,
      // 控制园区提示弹框是否显示
      noTipNextTime: false,
      // 下次不再提醒
      currentDateTime: '',
      selectedDrug: null,
      selectedBatch: null,
      availableStock: 0,
      // 处方功能开关
      enablePrescription: false,
      // 处方列表
      prescriptionList: [],
      prescriptionNo: '',
      // 处方编号
      currentDate: '',
      // 当前日期

      // 签名组件key，用于强制重新渲染
      signatureKey: 0,
      // 当前正在编辑的药品信息
      currentDrug: {
        dosage: '',
        frequency: '',
        route: '',
        usage: ''
      },
      // 用法用量选择器索引
      frequencyIndex: 0,
      routeIndex: 0,
      // 用法用量模板
      dosageTemplates: {
        '口服': ['0.5g', '1g', '10ml', '20ml', '适量'],
        '外用': ['适量', '少量', '薄层涂抹'],
        '含服': ['1片', '适量']
      },
      routeOptions: ['口服', '外用', '含服', '舌下含服', '涂擦患处', '肌肉注射', '静脉注射'],
      frequencyOptions: ['即刻', '每日3次', '每日2次', '每日1次', '每8小时1次', '每12小时1次', '必要时', '睡前', '每日3-4次', '隔日1次'],
      // 药材搜索相关
      drugSearchText: '',
      allDrugs: [],
      filteredDrugs: [],
      showDrugList: false,
      // 疾病名称下拉列表（标准疾病名称）
      diseaseOptions: ['扭伤', '擦伤', '烫伤', '磕伤', '冻伤', '腹泻', '头晕', '头痛', '感冒', '脱臼', '骨折', '过敏', '痛经', '测血压', '其他'],
      filteredDiseases: [],
      showDiseaseList: false,
      // 诊断/处置下拉
      filteredDiagnosis: [],
      showDiagnosisList: false,
      filteredTreatments: [],
      showTreatmentList: false,
      // 主诉下拉
      filteredComplaints: [],
      showComplaintList: false,
      complaintSelectedMode: false,
      // 主诉是否已选择（自由编辑模式）
      complaintFocus: false,
      // 控制主诉输入框聚焦
      // 症状相关
      filteredSymptoms: [],
      showSymptomList: false,
      standardizedSymptoms: [],
      // 从主诉标准化提取的症状列表
      symptomBlurTimer: null,
      symptomInputTimer: null,
      // 症状输入防抖计时器
      fetchHvSuggestionTimer: null,
      // 获取诊断建议防抖计时器
      // 下拉隐藏延迟计时器
      diseaseBlurTimer: null,
      complaintBlurTimer: null,
      diagnosisBlurTimer: null,
      // 输入防抖计时器
      diseaseInputTimer: null,
      diagnosisInputTimer: null,
      // 年龄输入焦点（用于强制弹出数字键盘）
      ageFocus: false,
      // 园区常用地点词库（来自园区运营文件与现场点位）
      allLocations: [
      // 大区
      '欢乐时光区', '甜品王国区', '香格里拉区', '失落玛雅区', '爱琴港区', '峡湾深林区',
      // 典型点位/场所
      '欢乐广场', '星闪舞台', '旱喷泉', '环道', '树屋打卡点', '情人廊', '外广场', '停车场', '闸口', '水公园闸口', '大剧院正门',
      // 乐园入口/屏幕
      '香格里拉大屏幕', '二期舞台屏幕', '太空盒子外屏幕', '海洋馆小舞台', '奇幻海洋馆',
      // 餐饮/店铺/项目口
      '乐迪历险记门口', '超飞主题餐厅', '克罗索斯餐厅', '家庭过山车入口', '玛雅天灾入口',
      // 糖果摊位
      '甜蜜蜜', '牛角包', '太阳',
      // 大型景观/设备标识
      '水晶神翼大山', '音乐过山车提升段', '雪域金翅提升段', '大剧院'],
      filteredLocations: [],
      showLocationList: false,
      showDrugSelector: false,
      submitting: false,
      continueAfterSubmit: true,
      // 默认开启连续登记

      // 当前聚焦字段的容器 id，用于配合 scroll-view 的 scroll-into-view，让输入框始终滚到键盘上方
      activeFieldId: '',
      // 定时器 ID：用于更新就诊时间，页面卸载时清理
      dateTimeTimerId: null,
      // 用户自定义疾病模板（本地持久化），按疾病名分组
      // 结构示例：
      // {
      //   '扭伤': {
      //      complaints: [ '行走时不慎扭伤踝关节，局部肿胀疼痛，活动受限', ... ],
      //      diagnosis: [ '软组织扭伤（待进一步检查）', ... ],
      //      treatments: [ '局部冷敷', '弹力绷带加压包扎', ... ]
      //   },
      //   ...
      // }
      userDiseaseTemplates: {},
      // 多框搜索统一索引：汇总所有模板为 [{disease, complaint, diagnoses[], treatments[], symptoms[], source}]
      templateIndex: [],
      // 全局搜索关键词（用于跨字段联动）
      globalSearchKeyword: ''
    };
  },
  computed: {
    currentLocationLabel: function currentLocationLabel() {
      var _this$form;
      var loc = (_this$form = this.form) === null || _this$form === void 0 ? void 0 : _this$form.location;
      if (loc === 'land_park') return '陆园';
      if (loc === 'water_park') return '水园';
      return '未选择';
    },
    // 未选择合法园区时，锁定表单核心输入
    locationLocked: function locationLocked() {
      var _this$form2;
      var loc = (_this$form2 = this.form) === null || _this$form2 === void 0 ? void 0 : _this$form2.location;
      return !loc || loc !== 'land_park' && loc !== 'water_park';
    },
    // 根据主诉内容长度动态调整字号
    complaintFontSizeClass: function complaintFontSizeClass() {
      var length = (this.form.chiefComplaint || '').length;
      if (length > 50) return 'font-small';
      if (length > 30) return 'font-medium';
      return '';
    },
    // 根据诊断内容长度动态调整字号
    diagnosisFontSizeClass: function diagnosisFontSizeClass() {
      var length = (this.form.diagnosis || '').length;
      if (length > 50) return 'font-small';
      if (length > 30) return 'font-medium';
      return '';
    },
    // 当前选择的用药频次标签
    currentFrequencyLabel: function currentFrequencyLabel() {
      return this.frequencyOptions[this.frequencyIndex] || '请选择';
    },
    // 当前选择的给药途径标签
    currentRouteLabel: function currentRouteLabel() {
      return this.routeOptions[this.routeIndex] || '请选择';
    }
  },
  onLoad: function onLoad() {
    var _this = this;
    this.updateDateTime();
    // 每分钟更新一次时间，并记录定时器 ID，便于卸载时清理
    this.dateTimeTimerId = setInterval(function () {
      _this.updateDateTime();
    }, 60000);

    // 初始化处方编号和日期
    this.initPrescription();

    // 恢复上次选择的园区
    this.restoreLastLocation();

    // 恢复用户自定义疾病模板
    this.restoreUserDiseaseTemplates();

    // 构建多框搜索统一索引
    this.buildTemplateIndex();

    // 加载药材列表
    this.loadAllDrugs();
  },
  onUnload: function onUnload() {
    // 页面卸载时清理定时器，避免多次进入页面产生重复计时
    if (this.dateTimeTimerId) {
      clearInterval(this.dateTimeTimerId);
      this.dateTimeTimerId = null;
    }
    // 清理防抖计时器
    if (this.symptomInputTimer) {
      clearTimeout(this.symptomInputTimer);
      this.symptomInputTimer = null;
    }
    if (this.fetchHvSuggestionTimer) {
      clearTimeout(this.fetchHvSuggestionTimer);
      this.fetchHvSuggestionTimer = null;
    }
    if (this.diseaseInputTimer) {
      clearTimeout(this.diseaseInputTimer);
      this.diseaseInputTimer = null;
    }
    if (this.diagnosisInputTimer) {
      clearTimeout(this.diagnosisInputTimer);
      this.diagnosisInputTimer = null;
    }
    if (this.complaintInputTimer) {
      clearTimeout(this.complaintInputTimer);
      this.complaintInputTimer = null;
    }
    if (this.complaintFocusTimer) {
      clearTimeout(this.complaintFocusTimer);
      this.complaintFocusTimer = null;
    }
  },
  watch: {
    // 监听主诉字段变化，清空时联动清空所有相关字段
    'form.chiefComplaint': function formChiefComplaint(newVal, oldVal) {
      var _this2 = this;
      var newComplaint = (newVal || '').trim();
      var oldComplaint = (oldVal || '').trim();

      // 从有内容变为空
      if (oldComplaint && !newComplaint) {
        // 检查是否有已填写的相关字段
        var hasRelatedData = this.form.symptom || this.form.diagnosis || this.form.diseaseName || this.form.treatment || this.prescriptionList.length > 0;
        if (hasRelatedData) {
          // 延迟执行，避免与输入事件冲突
          this.$nextTick(function () {
            uni.showModal({
              title: '清空确认',
              content: '清空主诉将同时清空症状、诊断、疾病名称、处置和处方等相关信息，是否继续？',
              confirmText: '确认清空',
              cancelText: '取消',
              confirmColor: '#dc2626',
              success: function success(res) {
                if (res.confirm) {
                  _this2.clearAllRelatedFields();
                } else {
                  // 恢复主诉内容
                  _this2.form.chiefComplaint = oldComplaint;
                }
              }
            });
          });
        } else {
          // 没有相关数据，直接清空
          this.clearAllRelatedFields();
        }
      }
    }
  },
  methods: (_methods = {
    // ✨ 清空所有相关字段（主诉清空时调用）
    clearAllRelatedFields: function clearAllRelatedFields() {
      // 1. 清空就诊信息相关字段
      this.form.symptom = ''; // 症状
      this.form.diagnosis = ''; // 诊断
      this.form.diseaseName = ''; // 疾病名称
      this.form.treatment = ''; // 处置

      // 2. 清空用药信息
      this.selectedDrug = null; // 选中的药材
      this.form.drugId = ''; // 药材ID
      this.form.quantity = null; // 用药数量
      this.drugSearchText = ''; // 药材搜索文本

      // 3. 清空处方列表
      this.prescriptionList = []; // 处方列表

      // 4. 清空辅助数据
      this.standardizedSymptoms = []; // 标准化症状
      this.hvTriage = null; // 分诊建议

      // 5. 重置模式
      this.complaintSelectedMode = false;

      // 6. 关闭所有下拉列表
      this.showSymptomList = false;
      this.showDiagnosisList = false;
      this.showDiseaseList = false;
      this.showTreatmentList = false;
      this.showDrugList = false;
      this.showComplaintList = false;
      console.log('[clinic/add] 已清空主诉及所有相关字段');
    },
    // 初始化处方信息
    initPrescription: function initPrescription() {
      // 生成处方编号：格式 年份-流水号（如2025-0001）
      var now = new Date();
      var year = now.getFullYear();
      var month = (now.getMonth() + 1).toString().padStart(2, '0');
      var day = now.getDate().toString().padStart(2, '0');

      // 使用时间戳的后4位作为流水号（简化版，实际应该从数据库获取）
      var timestamp = Date.now();
      var serialNo = (timestamp % 10000).toString().padStart(4, '0');
      this.prescriptionNo = "".concat(year, "-").concat(serialNo);
      this.currentDate = "".concat(year, "\u5E74").concat(month, "\u6708").concat(day, "\u65E5");
    },
    // 用药频次选择器变化
    onFrequencyChange: function onFrequencyChange(e) {
      this.frequencyIndex = e.detail.value;
      this.currentDrug.frequency = this.frequencyOptions[this.frequencyIndex];
    },
    // 给药途径选择器变化
    onRouteChange: function onRouteChange(e) {
      this.routeIndex = e.detail.value;
      this.currentDrug.route = this.routeOptions[this.routeIndex];
    },
    // 处方开关切换
    onPrescriptionSwitch: function onPrescriptionSwitch(e) {
      this.enablePrescription = e.detail.value;

      // 如果开启处方，初始化处方信息
      if (this.enablePrescription && !this.prescriptionNo) {
        this.initPrescription();
      }
    },
    // 从药品规格中提取真正的最小单位
    getRealMinUnit: function getRealMinUnit(drug) {
      var spec = drug.specification || '';

      // 常见的最小单位
      var minUnits = ['片', '粒', '丸', '支', '袋', '包'];

      // 从规格中查找最小单位
      for (var _i = 0, _minUnits = minUnits; _i < _minUnits.length; _i++) {
        var unit = _minUnits[_i];
        if (spec.includes(unit)) {
          return unit;
        }
      }

      // 如果规格中没有找到，返回原始的minUnit
      return drug.minUnit;
    },
    // 从药品规格中提取默认单次剂量
    // 如果有剂量单位（如0.1g, 5mg），返回剂量；否则返回最小单位（如1片、1粒）
    getDefaultDosage: function getDefaultDosage(drug) {
      if (!drug) return '';
      var spec = drug.specification || '';

      // 尝试匹配剂量格式：如 0.25g、5mg、10ml 等
      // 匹配模式：数字 + 单位（g, mg, ml, μg, mcg, ug等）
      // 优先匹配规格开头的剂量部分（如 "0.25g×24粒/盒" 中的 "0.25g"）
      var dosageMatch = spec.match(/^(\d+\.?\d*)\s*(mg|g|ml|μg|mcg|ug|毫升|ML)/i);
      if (dosageMatch) {
        // 找到剂量单位，返回剂量值+单位
        return "".concat(dosageMatch[1]).concat(dosageMatch[2].toLowerCase());
      }

      // 如果开头没有，尝试匹配整个规格中的第一个剂量（如 "24粒/盒" 中没有剂量，但 "0.25g×24粒/盒" 中有）
      var anyDosageMatch = spec.match(/(\d+\.?\d*)\s*(mg|g|ml|μg|mcg|ug|毫升|ML)/i);
      if (anyDosageMatch) {
        return "".concat(anyDosageMatch[1]).concat(anyDosageMatch[2].toLowerCase());
      }

      // 如果没有找到剂量单位，返回最小单位（如1片、1粒）
      var minUnit = this.getRealMinUnit(drug);
      return "1".concat(minUnit);
    },
    // 获取单次剂量占位符文本
    getDosagePlaceholder: function getDosagePlaceholder(drug) {
      if (!drug) return '如：1片';
      var spec = drug.specification || '';

      // 检查是否有剂量单位
      var hasDosageUnit = /(\d+\.?\d*)\s*(mg|g|ml|μg|mcg|ug|毫升|ML)/i.test(spec);
      if (hasDosageUnit) {
        // 有剂量单位，提示可以输入剂量或单位
        return '如：0.1g、5mg等';
      } else {
        // 没有剂量单位，提示输入最小单位
        var minUnit = this.getRealMinUnit(drug);
        return "\u5982\uFF1A1".concat(minUnit);
      }
    },
    // 添加到处方（使用 FIFO 自动分配批次）
    addToPrescription: function addToPrescription() {
      var _this3 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee() {
        var res, allocation, nearExpiryBatches, nearExpiryInfo, errorMsg;
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (_this3.selectedDrug) {
                  _context.next = 3;
                  break;
                }
                uni.showToast({
                  title: '请先选择药材',
                  icon: 'none',
                  duration: 2000
                });
                return _context.abrupt("return");
              case 3:
                if (!(!_this3.form.quantity || _this3.form.quantity <= 0)) {
                  _context.next = 6;
                  break;
                }
                uni.showToast({
                  title: '请输入有效数量',
                  icon: 'none',
                  duration: 2000
                });
                return _context.abrupt("return");
              case 6:
                // 3. 调用 FIFO 云函数自动分配批次
                uni.showLoading({
                  title: '分配批次中...'
                });
                _context.prev = 7;
                _context.next = 10;
                return wx.cloud.callFunction({
                  name: 'stockManage',
                  data: {
                    action: 'allocateBatchesFIFO',
                    data: {
                      drugId: _this3.selectedDrug._id,
                      requiredQuantity: _this3.form.quantity,
                      location: _this3.form.location
                    }
                  }
                });
              case 10:
                res = _context.sent;
                uni.hideLoading();
                console.log('[FIFO分配结果]:', res.result);
                if (res.result.success) {
                  allocation = res.result.data; // 4. 检查是否有近效期药品
                  if (allocation.hasNearExpiry) {
                    // 找出近效期的批次
                    nearExpiryBatches = allocation.allocation.filter(function (b) {
                      return b.isNearExpiry;
                    });
                    nearExpiryInfo = nearExpiryBatches.map(function (b) {
                      return "\u6279\u6B21".concat(b.batch, "\uFF1A").concat(b.daysToExpire, "\u5929\u540E\u8FC7\u671F");
                    }).join('\n'); // 显示近效期提示，让用户确认
                    uni.showModal({
                      title: '⚠️ 近效期提示',
                      content: "\u68C0\u6D4B\u5230\u8FD1\u6548\u671F\u836F\u54C1\uFF0890\u5929\u5185\u8FC7\u671F\uFF09\uFF1A\n\n".concat(nearExpiryInfo, "\n\n\u662F\u5426\u7EE7\u7EED\u6DFB\u52A0\u5230\u5904\u65B9\uFF1F"),
                      confirmText: '继续添加',
                      cancelText: '取消',
                      success: function success(modalRes) {
                        if (modalRes.confirm) {
                          // 用户确认后添加
                          _this3.doAddToPrescription(allocation);
                        }
                      }
                    });
                  } else {
                    // 5. 没有近效期，直接添加
                    _this3.doAddToPrescription(allocation);
                  }
                } else {
                  // FIFO 分配失败（库存不足等）
                  errorMsg = res.result.message || '批次分配失败'; // 如果是库存不足，给用户选择是否继续
                  if (errorMsg.includes('库存不足')) {
                    uni.showModal({
                      title: '库存不足提醒',
                      content: "".concat(errorMsg, "\n\n\u662F\u5426\u4ECD\u8981\u6DFB\u52A0\u5230\u5904\u65B9\uFF1F"),
                      confirmText: '仍要添加',
                      cancelText: '取消',
                      success: function success(modalRes) {
                        if (modalRes.confirm) {
                          // 用户确认后，使用空的分配信息添加
                          _this3.doAddToPrescription(null);
                        }
                      }
                    });
                  } else {
                    // 其他错误，直接提示
                    uni.showToast({
                      title: errorMsg,
                      icon: 'none',
                      duration: 2000
                    });
                  }
                }
                _context.next = 21;
                break;
              case 16:
                _context.prev = 16;
                _context.t0 = _context["catch"](7);
                uni.hideLoading();
                console.error('[FIFO分配异常]:', _context.t0);
                uni.showToast({
                  title: '批次分配失败',
                  icon: 'none',
                  duration: 2000
                });
              case 21:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[7, 16]]);
      }))();
    },
    // 执行添加到处方的核心逻辑
    // @param {Object} allocation - FIFO分配结果（可选）
    doAddToPrescription: function doAddToPrescription() {
      var allocation = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      // 使用表单中的用法用量数据
      var dosage = (this.currentDrug.dosage || '').trim();
      var route = (this.currentDrug.route || '').trim();
      var frequency = (this.currentDrug.frequency || '').trim();

      // 构建处方项基本信息
      var prescriptionItem = {
        // 药品基本信息
        drugId: this.selectedDrug._id,
        drugName: this.selectedDrug.name,
        specification: this.selectedDrug.specification,
        manufacturer: this.selectedDrug.manufacturer,
        // 数量和单位
        quantity: this.form.quantity,
        unit: this.getRealMinUnit(this.selectedDrug),
        packUnit: this.selectedDrug.packUnit,
        minUnit: this.selectedDrug.minUnit,
        conversionRate: this.selectedDrug.conversionRate,
        // 用法用量
        dosage: dosage,
        route: route,
        frequency: frequency,
        usage: (this.currentDrug.usage || '').trim(),
        // 完整的 drug 对象引用（用于后续处理）
        drug: this.selectedDrug
      };

      // 如果有 FIFO 分配结果，使用分配的批次信息
      if (allocation && allocation.allocation && allocation.allocation.length > 0) {
        // ✅ 使用 FIFO 分配的批次信息
        prescriptionItem.batchAllocation = allocation.allocation; // 完整的批次分配信息
        prescriptionItem.batchCount = allocation.batchCount; // 批次数量
        prescriptionItem.hasNearExpiry = allocation.hasNearExpiry; // 是否有近效期

        // 为了兼容性，设置第一个批次为主批次
        var firstBatch = allocation.allocation[0];
        prescriptionItem.batchId = firstBatch.batchId;
        prescriptionItem.batchNumber = firstBatch.batch;
        prescriptionItem.expiryDate = firstBatch.expireDate;
        prescriptionItem.batch = {
          _id: firstBatch.batchId,
          batch: firstBatch.batch,
          expireDate: firstBatch.expireDate,
          quantity: firstBatch.quantity
        };
      } else {
        var _this$selectedBatch, _this$selectedBatch2, _this$selectedBatch3;
        // ✅ 没有 FIFO 分配结果，使用旧的批次选择方式（兼容）
        prescriptionItem.batchId = (_this$selectedBatch = this.selectedBatch) === null || _this$selectedBatch === void 0 ? void 0 : _this$selectedBatch._id;
        prescriptionItem.batchNumber = (_this$selectedBatch2 = this.selectedBatch) === null || _this$selectedBatch2 === void 0 ? void 0 : _this$selectedBatch2.batch;
        prescriptionItem.expiryDate = (_this$selectedBatch3 = this.selectedBatch) === null || _this$selectedBatch3 === void 0 ? void 0 : _this$selectedBatch3.expireDate;
        prescriptionItem.batch = this.selectedBatch;
        prescriptionItem.batchAllocation = null;
        prescriptionItem.batchCount = this.selectedBatch ? 1 : 0;
        prescriptionItem.hasNearExpiry = false;
      }

      // 添加到处方列表
      this.prescriptionList.push(prescriptionItem);

      // ✅ 自动开启处方开关
      if (!this.enablePrescription) {
        this.enablePrescription = true;
      }

      // ✅ 清空数量输入框
      this.form.quantity = null;

      // ✅ 重新加载批次和库存
      if (this.selectedDrug && this.selectedDrug._id) {
        this.loadBatches();
      }

      // 成功提示
      uni.showToast({
        title: "\u5DF2\u52A0\u5165\u5904\u65B9\uFF1A".concat(this.selectedDrug.name),
        icon: 'success',
        duration: 2000
      });

      // ✅ 滚动到处方区域，让用户看到添加结果
      this.$nextTick(function () {
        uni.pageScrollTo({
          selector: '.prescription-section',
          duration: 300
        });
      });
    },
    // 格式化规格和数量显示（例如：0.3gX1粒）
    formatSpecQuantity: function formatSpecQuantity(item) {
      var parts = [];

      // 提取基本规格（去除包装信息）
      if (item.specification) {
        // 匹配规格中的基本单位部分，如 "0.3g" 从 "0.3g*20粒" 中提取
        var baseSpecMatch = item.specification.match(/^(\d+\.?\d*\s*(?:mg|g|ml|μg|mcg|ug|毫升|ML))/i);
        if (baseSpecMatch) {
          // 如果有基本规格（如 0.3g），只使用基本规格
          parts.push(baseSpecMatch[1]);
        } else {
          // 如果没有匹配到基本规格，使用完整规格
          parts.push(item.specification);
        }
      }

      // 添加实际数量
      if (item.quantity && item.unit) {
        var quantityStr = "X".concat(item.quantity).concat(item.unit);
        parts.push(quantityStr);
      }
      return parts.length > 0 ? parts.join('') : '';
    },
    // 格式化用法用量显示
    formatUsage: function formatUsage(item) {
      var parts = [];
      if (item.dosage) parts.push(item.dosage);
      if (item.route) parts.push(item.route);
      if (item.frequency) parts.push(item.frequency);
      return parts.join('  ');
    },
    // 从处方中移除
    removeFromPrescription: function removeFromPrescription(index) {
      var _this4 = this;
      uni.showModal({
        title: '确认删除',
        content: '确定要从处方中移除这味药吗？',
        success: function success(res) {
          if (res.confirm) {
            _this4.prescriptionList.splice(index, 1);
            uni.showToast({
              title: '已移除',
              icon: 'success'
            });
          }
        }
      });
    },
    // 快速添加到处方（从药材选择区域）
    quickAddToPrescription: function quickAddToPrescription() {
      var _this5 = this;
      // 如果没有选择药材，提示用户先选择
      if (!this.selectedDrug) {
        uni.showToast({
          title: '请先选择药材',
          icon: 'none',
          duration: 2000
        });
        // 滚动到药材选择区域
        this.$nextTick(function () {
          uni.pageScrollTo({
            selector: '#field-drug',
            duration: 300
          });
        });
        return;
      }

      // 如果没有输入数量，提示用户输入
      if (!this.form.quantity || this.form.quantity <= 0) {
        uni.showToast({
          title: '请先输入用药数量',
          icon: 'none',
          duration: 2000
        });
        return;
      }

      // 检查库存
      if (this.form.quantity > this.availableStock) {
        uni.showModal({
          title: '库存不足',
          content: "\u5F53\u524D\u5E93\u5B58\uFF1A".concat(this.availableStock, " ").concat(this.getRealMinUnit(this.selectedDrug), "\uFF0C\u662F\u5426\u4ECD\u8981\u6DFB\u52A0\uFF1F"),
          success: function success(res) {
            if (res.confirm) {
              _this5.addToPrescription();
            }
          }
        });
        return;
      }

      // 直接调用添加到处方方法
      this.addToPrescription();
    },
    onFieldFocus: function onFieldFocus(id) {
      this.activeFieldId = id;
    },
    // 医生签名组件回调
    onDoctorSignChange: function onDoctorSignChange(value) {
      // value 为签名图片的云文件ID或Base64，由 Signature 组件约定
      this.form.doctorSign = value;
      // 同时记录签名时间，便于在页面显示“签名时间”
      var now = new Date();
      var y = now.getFullYear();
      var m = (now.getMonth() + 1).toString().padStart(2, '0');
      var d = now.getDate().toString().padStart(2, '0');
      var hh = now.getHours().toString().padStart(2, '0');
      var mm = now.getMinutes().toString().padStart(2, '0');
      var ss = now.getSeconds().toString().padStart(2, '0');
      this.form.signTime = "".concat(y, "-").concat(m, "-").concat(d, " ").concat(hh, ":").concat(mm, ":").concat(ss);
    },
    // 恢复用户自定义疾病模板（本地存储）
    restoreUserDiseaseTemplates: function restoreUserDiseaseTemplates() {
      try {
        var stored = uni.getStorageSync('clinic_user_disease_templates');
        if (stored && (0, _typeof2.default)(stored) === 'object') {
          this.userDiseaseTemplates = stored;
        }
      } catch (e) {
        console.error('恢复用户疾病模板失败:', e);
        this.userDiseaseTemplates = {};
      }
    },
    // 构建多框搜索统一索引：汇总系统模板、结构化模板、用户自定义模板
    buildTemplateIndex: function buildTemplateIndex() {
      var index = [];
      var maxIndexSize = 1000; // 限制索引最大数量，避免内存和性能问题

      // 1) 结构化模板库 diseaseTemplateLib
      var diseaseKeys = Object.keys(this.diseaseTemplateLib || {});
      for (var i = 0; i < diseaseKeys.length && index.length < maxIndexSize; i++) {
        var disease = diseaseKeys[i];
        var list = this.diseaseTemplateLib[disease] || [];
        var maxListSize = Math.min(list.length, 50); // 每个疾病最多50条模板
        for (var j = 0; j < maxListSize && index.length < maxIndexSize; j++) {
          var tpl = list[j];
          if (tpl && tpl.complaint) {
            index.push({
              disease: disease,
              complaint: tpl.complaint,
              symptoms: tpl.symptoms || [],
              diagnoses: tpl.diagnoses || [],
              treatments: tpl.treatments || [],
              source: 'structured',
              idx: j
            });
          }
        }
      }

      // 2) 旧版模板：complaintTemplates + diseaseTemplates + treatmentTemplates
      if (index.length < maxIndexSize) {
        var complaintKeys = Object.keys(this.complaintTemplates || {});
        for (var _i2 = 0; _i2 < complaintKeys.length && index.length < maxIndexSize; _i2++) {
          var _this$diseaseTemplate, _this$treatmentTempla;
          var _disease = complaintKeys[_i2];
          var complaint = this.complaintTemplates[_disease];
          var diagnoses = ((_this$diseaseTemplate = this.diseaseTemplates) === null || _this$diseaseTemplate === void 0 ? void 0 : _this$diseaseTemplate[_disease]) || [];
          var treatments = ((_this$treatmentTempla = this.treatmentTemplates) === null || _this$treatmentTempla === void 0 ? void 0 : _this$treatmentTempla[_disease]) || [];
          if (complaint) {
            index.push({
              disease: _disease,
              complaint: complaint,
              symptoms: [],
              diagnoses: diagnoses,
              treatments: treatments,
              source: 'legacy'
            });
          }
        }
      }

      // 3) 用户自定义模板 userDiseaseTemplates
      if (index.length < maxIndexSize) {
        var userKeys = Object.keys(this.userDiseaseTemplates || {});
        for (var _i3 = 0; _i3 < userKeys.length && index.length < maxIndexSize; _i3++) {
          var _disease2 = userKeys[_i3];
          var userTpl = this.userDiseaseTemplates[_disease2];
          if (!userTpl) continue;
          var complaints = userTpl.complaints || [];
          var maxComplaints = Math.min(complaints.length, 20); // 每个疾病最多20条用户模板
          for (var _j = 0; _j < maxComplaints && index.length < maxIndexSize; _j++) {
            var _complaint = complaints[_j];
            if (_complaint) {
              index.push({
                disease: _disease2,
                complaint: _complaint,
                symptoms: [],
                diagnoses: userTpl.diagnosis || [],
                treatments: userTpl.treatments || [],
                source: 'user',
                userIdx: _j
              });
            }
          }
        }
      }
      this.templateIndex = index;
      console.log("\u6784\u5EFA\u6A21\u677F\u7D22\u5F15\u5B8C\u6210\uFF0C\u5171 ".concat(index.length, " \u6761\u8BB0\u5F55"));
    },
    // 全局搜索：多条件并列搜索(AND逻辑)，同时匹配疾病/主诉/诊断三个关键词
    // 并结合 hvComplaintKeywordIndex 做主诉关键词→多主诉模板联想
    performGlobalSearch: function performGlobalSearch(diseaseKw, complaintKw, diagnosisKw) {
      var dKw = (diseaseKw || '').trim().toLowerCase();
      var cKw = (complaintKw || '').trim().toLowerCase();
      var dgKw = (diagnosisKw || '').trim().toLowerCase();

      // 如果三个关键词都为空，返回所有疾病和空列表
      if (!dKw && !cKw && !dgKw) {
        return {
          diseases: this.diseaseOptions,
          complaints: [],
          diagnoses: []
        };
      }

      // 性能优化：限制搜索范围，避免遍历过多数据
      var maxSearchCount = 500; // 最多搜索500条记录
      var searchIndex = this.templateIndex.slice(0, maxSearchCount);

      // 多条件并列过滤：同时满足所有非空关键词（基于结构化模板索引）
      var matchedRecords = [];
      for (var i = 0; i < searchIndex.length; i++) {
        var rec = searchIndex[i];
        var match = true;
        // 疾病关键词匹配
        if (dKw) {
          match = match && rec.disease && rec.disease.toLowerCase().includes(dKw);
        }
        // 主诉关键词匹配
        if (cKw) {
          match = match && rec.complaint && rec.complaint.toLowerCase().includes(cKw);
        }
        // 诊断关键词匹配
        if (dgKw) {
          match = match && (rec.diagnoses || []).some(function (d) {
            return d && d.toLowerCase().includes(dgKw);
          });
        }
        if (match) {
          matchedRecords.push(rec);
          // 限制结果数量，找到足够的结果就停止
          if (matchedRecords.length >= 50) break;
        }
      }

      // 提取匹配的疾病、主诉、诊断（去重）
      var diseases = Array.from(new Set(matchedRecords.map(function (r) {
        return r.disease;
      })));
      var baseComplaints = matchedRecords.map(function (r, idx) {
        return {
          key: "".concat(r.disease, "_").concat(idx),
          label: r.complaint,
          disease: r.disease,
          record: r
        };
      });
      var diagSet = new Set();
      matchedRecords.forEach(function (r) {
        (r.diagnoses || []).forEach(function (d) {
          return diagSet.add(d);
        });
      });
      var diagnoses = Array.from(diagSet);

      // 基于主诉关键词，追加 hvComplaintKeywordIndex 中的主诉模板（限制数量）
      var extraComplaints = [];
      if (cKw) {
        var keywordKeys = Object.keys(hvComplaintKeywordIndex || {});
        var maxKeywords = Math.min(keywordKeys.length, 20); // 最多检查20个关键词
        for (var _i4 = 0; _i4 < maxKeywords && extraComplaints.length < 20; _i4++) {
          var key = keywordKeys[_i4];
          var k = (key || '').toLowerCase();
          // 关键词双向包含："中暑" / "扭伤" / "晕动病" 等
          if (!k) continue;
          if (k.includes(cKw) || cKw.includes(k)) {
            var items = hvComplaintKeywordIndex[key] || [];
            var maxItems = Math.min(items.length, 5); // 每个关键词最多5条
            for (var j = 0; j < maxItems && extraComplaints.length < 20; j++) {
              var item = items[j];
              extraComplaints.push({
                key: "hv_".concat(key, "_").concat(j),
                label: item.complaint,
                disease: item.diseaseName,
                record: {
                  disease: item.diseaseName,
                  complaint: item.complaint,
                  symptoms: [],
                  diagnoses: [item.diseaseName],
                  treatments: [],
                  source: 'hv_keyword'
                }
              });
            }
          }
        }
      }

      // 合并去重（按 complaint 文本去重）
      var mergedMap = new Map();
      [].concat((0, _toConsumableArray2.default)(baseComplaints), extraComplaints).forEach(function (c) {
        if (!mergedMap.has(c.label)) {
          mergedMap.set(c.label, c);
        }
      });
      var complaints = Array.from(mergedMap.values());
      return {
        diseases: diseases,
        complaints: complaints,
        diagnoses: diagnoses
      };
    },
    // 查找最匹配的模板记录（基于多个字段同时匹配）
    findBestMatchingRecord: function findBestMatchingRecord(diagnosis, complaint, diseaseName) {
      var bestMatch = null;
      var bestScore = 0;

      // 如果所有参数都为空，返回null
      if (!diagnosis && !complaint && !diseaseName) {
        return null;
      }
      var _iterator = _createForOfIteratorHelper(this.templateIndex),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var record = _step.value;
          var score = 0;

          // 诊断匹配度（权重最高）
          if (diagnosis && record.diagnoses && record.diagnoses.length) {
            var diagnosisMatch = record.diagnoses.some(function (d) {
              if (!d) return false;
              var dLower = d.toLowerCase();
              var diagnosisLower = diagnosis.toLowerCase();
              return d === diagnosis || dLower === diagnosisLower || dLower.includes(diagnosisLower) || diagnosisLower.includes(dLower);
            });
            if (diagnosisMatch) score += 5; // 诊断匹配权重最高
          }

          // 主诉匹配度
          if (complaint && record.complaint) {
            var complaintLower = (record.complaint || '').toLowerCase();
            var inputComplaintLower = complaint.toLowerCase();
            if (complaintLower === inputComplaintLower) {
              score += 4; // 完全匹配
            } else if (complaintLower.includes(inputComplaintLower) || inputComplaintLower.includes(complaintLower)) {
              score += 2; // 部分匹配
            }
          }

          // 疾病名称匹配度
          if (diseaseName && record.disease) {
            var diseaseLower = (record.disease || '').toLowerCase();
            var inputDiseaseLower = diseaseName.toLowerCase();
            if (diseaseLower === inputDiseaseLower) {
              score += 3; // 完全匹配
            } else if (diseaseLower.includes(inputDiseaseLower) || inputDiseaseLower.includes(diseaseLower)) {
              score += 1; // 部分匹配
            }
          }

          // 选择得分最高的记录
          if (score > bestScore) {
            bestScore = score;
            bestMatch = record;
          }
        }

        // 只有得分大于0的记录才返回（至少有一个字段匹配）
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      return bestScore > 0 ? bestMatch : null;
    },
    // 智能填充字段：只填充空白字段，保留用户已输入的内容
    smartFillFields: function smartFillFields(record) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      if (!record) return;
      var _options$preserveComp = options.preserveComplaint,
        preserveComplaint = _options$preserveComp === void 0 ? false : _options$preserveComp,
        _options$preserveSymp = options.preserveSymptom,
        preserveSymptom = _options$preserveSymp === void 0 ? false : _options$preserveSymp,
        _options$preserveDiag = options.preserveDiagnosis,
        preserveDiagnosis = _options$preserveDiag === void 0 ? false : _options$preserveDiag,
        _options$preserveTrea = options.preserveTreatment,
        preserveTreatment = _options$preserveTrea === void 0 ? false : _options$preserveTrea;

      // 主诉：如果为空或允许覆盖，则填充
      if (!preserveComplaint) {
        var currentComplaint = (this.form.chiefComplaint || '').trim();
        if (!currentComplaint && record.complaint) {
          this.form.chiefComplaint = record.complaint;
        }
      }

      // 症状：如果为空或允许覆盖，则填充
      if (!preserveSymptom) {
        var currentSymptom = (this.form.symptom || '').trim();
        if (!currentSymptom && record.symptoms && record.symptoms.length) {
          this.form.symptom = record.symptoms.join('；');
        }
      }

      // 诊断：如果为空或允许覆盖，则填充
      if (!preserveDiagnosis) {
        var currentDiagnosis = (this.form.diagnosis || '').trim();
        if (!currentDiagnosis && record.diagnoses && record.diagnoses.length) {
          this.form.diagnosis = record.diagnoses.join('；');
        }
      }

      // 处置：如果为空或允许覆盖，则填充
      if (!preserveTreatment) {
        var currentTreatment = (this.form.treatment || '').trim();
        if (!currentTreatment && record.treatments && record.treatments.length) {
          this.form.treatment = record.treatments.join('；');
        }
      }

      // 疾病名称：始终更新（用于分类），但基于诊断分析
      if (record.diagnoses && record.diagnoses.length) {
        var mainDiagnosis = record.diagnoses[0];
        var analyzedDisease = this.analyzeDiseaseFromDiagnosis(mainDiagnosis);
        if (analyzedDisease) {
          this.form.diseaseName = analyzedDisease;
        } else if (record.disease) {
          this.form.diseaseName = record.disease;
        }
      } else if (record.disease) {
        this.form.diseaseName = record.disease;
      }
    },
    setIdentity: function setIdentity(val) {
      if (!this.form) return;
      this.form.identity = val;
    },
    setVisitType: function setVisitType(val) {
      if (!this.form) return;
      this.form.visitType = val;
    },
    openLocationSelector: function openLocationSelector() {
      var _this6 = this;
      var itemList = this.locations.map(function (l) {
        return l.label;
      });
      uni.showActionSheet({
        itemList: itemList,
        success: function success(res) {
          var idx = res.tapIndex;
          var target = _this6.locations[idx];
          if (target) {
            _this6.selectLocation(target.value);
          }
        }
      });
    },
    // 关闭园区提示弹框
    closeLocationTip: function closeLocationTip() {
      this.showLocationTip = false;
      try {
        if (this.noTipNextTime) {
          uni.setStorageSync('clinic_location_tip_closed', true);
        }
      } catch (e) {}
    },
    // 从弹框中选择园区
    handleLocationSelect: function handleLocationSelect(location) {
      this.selectLocation(location);
      try {
        if (this.noTipNextTime) {
          uni.setStorageSync('clinic_location_tip_closed', true);
        }
      } catch (e) {}
      this.showLocationTip = false;
    },
    updateDateTime: function updateDateTime() {
      var now = new Date();
      var year = now.getFullYear();
      var month = String(now.getMonth() + 1).padStart(2, '0');
      var day = String(now.getDate()).padStart(2, '0');
      var hours = String(now.getHours()).padStart(2, '0');
      var minutes = String(now.getMinutes()).padStart(2, '0');
      this.currentDateTime = "".concat(year, "-").concat(month, "-").concat(day, " ").concat(hours, ":").concat(minutes);
      this.form.visitDateTime = "".concat(year, "-").concat(month, "-").concat(day, " ").concat(hours, ":").concat(minutes);
    },
    // 加载所有药材
    loadAllDrugs: function loadAllDrugs() {
      var _this7 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2() {
        var res;
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                _context2.next = 3;
                return wx.cloud.callFunction({
                  name: 'drugManage',
                  data: {
                    action: 'getList',
                    data: {
                      pageSize: 1000
                    }
                  }
                });
              case 3:
                res = _context2.sent;
                if (res.result.success) {
                  _this7.allDrugs = res.result.data.list || [];
                }
                _context2.next = 10;
                break;
              case 7:
                _context2.prev = 7;
                _context2.t0 = _context2["catch"](0);
                console.error('加载药材列表失败:', _context2.t0);
              case 10:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[0, 7]]);
      }))();
    },
    // 药材输入框获得焦点
    onDrugInputFocus: function onDrugInputFocus() {
      var _this8 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee3() {
        return _regenerator.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _this8.showDrugList = true;

                // 如果没有输入内容，显示当前园区的所有药材
                if (!_this8.drugSearchText || _this8.drugSearchText.trim() === '') {
                  // 没有输入内容，显示所有药材
                  _this8.filteredDrugs = _this8.allDrugs;
                } else {
                  _this8.onDrugSearch();
                }
              case 2:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }))();
    },
    // 加载当前园区的药材
    loadLocationDrugs: function loadLocationDrugs() {
      var _this9 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee4() {
        var res, stockList;
        return _regenerator.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.prev = 0;
                uni.showLoading({
                  title: '加载药材...'
                });
                _context4.next = 4;
                return wx.cloud.callFunction({
                  name: 'stockManage',
                  data: {
                    action: 'getStockList',
                    data: {
                      location: _this9.form.location,
                      pageSize: 1000
                    }
                  }
                });
              case 4:
                res = _context4.sent;
                uni.hideLoading();
                if (res.result.success) {
                  stockList = res.result.data.list || []; // 过滤出有库存的药材
                  _this9.filteredDrugs = stockList.filter(function (item) {
                    return item.quantity > 0;
                  }).map(function (item) {
                    return {
                      _id: item.drugId,
                      name: item.drugName || item.name,
                      specification: item.specification || item.spec,
                      minUnit: item.minUnit || item.unit,
                      packUnit: item.packUnit || item.unit,
                      conversionRate: item.conversionRate || 1,
                      stock: item.quantity
                    };
                  });
                  console.log("\u52A0\u8F7D\u4E86".concat(_this9.filteredDrugs.length, "\u79CD\u836F\u6750"));
                } else {
                  // 如果获取失败，显示所有药材
                  _this9.filteredDrugs = _this9.allDrugs.slice(0, 50);
                }
                _context4.next = 14;
                break;
              case 9:
                _context4.prev = 9;
                _context4.t0 = _context4["catch"](0);
                console.error('加载园区药材失败:', _context4.t0);
                uni.hideLoading();
                // 失败时显示所有药材
                _this9.filteredDrugs = _this9.allDrugs.slice(0, 50);
              case 14:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, null, [[0, 9]]);
      }))();
    }
  }, (0, _defineProperty2.default)(_methods, "onDrugInputFocus", function onDrugInputFocus() {
    // 检查是否已选择园区
    if (!this.form.location) {
      uni.showToast({
        title: '请先选择就诊园区',
        icon: 'none',
        duration: 2000
      });
      this.showLocationTip = true;
      return;
    }

    // 如果没有搜索内容，加载当前园区的所有药材
    if (!this.drugSearchText || this.drugSearchText.trim() === '') {
      this.loadLocationDrugs();
    }

    // 显示药品下拉列表
    this.showDrugList = true;
  }), (0, _defineProperty2.default)(_methods, "onDrugSearch", function onDrugSearch() {
    if (!this.drugSearchText || this.drugSearchText.trim() === '') {
      // 没有搜索内容时，加载当前园区药材
      this.loadLocationDrugs();
      return;
    }
    var keyword = this.drugSearchText.toLowerCase();
    // 从当前园区的药材中搜索
    if (this.filteredDrugs.length > 0 && !this.drugSearchText) {
      // 已经加载了园区药材，在其中搜索
      var currentList = (0, _toConsumableArray2.default)(this.filteredDrugs);
      this.filteredDrugs = currentList.filter(function (drug) {
        var name = (drug.name || '').toLowerCase();
        var genericName = (drug.genericName || '').toLowerCase();
        var spec = (drug.specification || '').toLowerCase();
        var tradeNames = Array.isArray(drug.tradeNames) ? drug.tradeNames : [];
        var hitTrade = tradeNames.some(function (t) {
          return (t || '').toLowerCase().includes(keyword);
        });
        return name.includes(keyword) || genericName.includes(keyword) || spec.includes(keyword) || hitTrade;
      });
    } else {
      // 从所有药材中搜索
      this.filteredDrugs = this.allDrugs.filter(function (drug) {
        var name = (drug.name || '').toLowerCase();
        var genericName = (drug.genericName || '').toLowerCase();
        var pinyin = (drug.pinyin || '').toLowerCase();
        var spec = (drug.specification || drug.spec || '').toLowerCase();
        var tradeNames = Array.isArray(drug.tradeNames) ? drug.tradeNames : [];
        var hitTrade = tradeNames.some(function (t) {
          return (t || '').toLowerCase().includes(keyword);
        });
        return name.includes(keyword) || genericName.includes(keyword) || pinyin.includes(keyword) || spec.includes(keyword) || hitTrade;
      }).slice(0, 30); // 最多显示30个结果
    }
  }), (0, _defineProperty2.default)(_methods, "selectDrugFromList", function selectDrugFromList(drug) {
    this.drugSearchText = drug.name;
    this.onDrugSelect(drug);
    this.showDrugList = false;

    // 选择药材后自动联动填充默认值
    this.autoFillDrugDefaults(drug);
  }), (0, _defineProperty2.default)(_methods, "autoFillDrugDefaults", function autoFillDrugDefaults(drug) {
    // 1. 根据药材类型自动设置默认用药数量
    if (!this.form.quantity || this.form.quantity === 0) {
      // 根据药材名称智能推荐数量
      if (drug.name.includes('创可贴') || drug.name.includes('纱布') || drug.name.includes('棉签')) {
        this.form.quantity = 1; // 外用材料默认1个
      } else if (drug.name.includes('片') || drug.name.includes('粒') || drug.name.includes('胶囊')) {
        this.form.quantity = 2; // 口服药默认2片/粒
      } else if (drug.name.includes('水') || drug.name.includes('液')) {
        this.form.quantity = 10; // 液体默认10ml
      } else {
        this.form.quantity = 1; // 其他默认1
      }
    }

    // 2. 根据药材类型自动设置单次剂量
    if (!this.currentDrug.dosage) {
      if (drug.name.includes('布洛芬')) {
        this.currentDrug.dosage = '0.3g';
      } else if (drug.name.includes('片') || drug.name.includes('粒')) {
        this.currentDrug.dosage = '1片';
      } else if (drug.name.includes('胶囊')) {
        this.currentDrug.dosage = '1粒';
      } else if (drug.specification) {
        this.currentDrug.dosage = drug.specification;
      }
    }

    // 3. 根据药材类型自动设置给药途径
    if (!this.currentDrug.route) {
      if (drug.name.includes('创可贴') || drug.name.includes('碘伏') || drug.name.includes('纱布') || drug.name.includes('湿润烧伤膏') || drug.name.includes('红霉素眼膏')) {
        this.currentDrug.route = '外用';
        this.routeIndex = 1; // 外用
      } else if (drug.name.includes('含片') || drug.name.includes('草珊瑚')) {
        this.currentDrug.route = '含服';
        this.routeIndex = 2; // 含服
      } else if (drug.name.includes('速效救心丸')) {
        this.currentDrug.route = '舌下含服';
        this.routeIndex = 3; // 舌下含服
      } else {
        this.currentDrug.route = '口服';
        this.routeIndex = 0; // 口服
      }
    }

    // 4. 根据药材类型自动设置用药频次
    if (!this.currentDrug.frequency) {
      if (drug.name.includes('创可贴') || drug.name.includes('纱布') || drug.name.includes('碘伏')) {
        this.currentDrug.frequency = '即刻';
        this.frequencyIndex = 0; // 即刻
      } else if (drug.name.includes('速效救心丸')) {
        this.currentDrug.frequency = '必要时';
        this.frequencyIndex = 6; // 必要时
      } else if (drug.name.includes('布洛芬') || drug.name.includes('止痛')) {
        this.currentDrug.frequency = '每日3次';
        this.frequencyIndex = 1; // 每日3次
      } else {
        this.currentDrug.frequency = '即刻';
        this.frequencyIndex = 0; // 即刻
      }
    }

    // 5. 自动开启处方功能
    if (!this.enablePrescription) {
      this.enablePrescription = true;
    }

    // 提示用户已自动填充
    console.log('✅ 已自动填充药材默认值:', {
      quantity: this.form.quantity,
      dosage: this.currentDrug.dosage,
      route: this.currentDrug.route,
      frequency: this.currentDrug.frequency
    });
  }), (0, _defineProperty2.default)(_methods, "onDiseaseFocus", function onDiseaseFocus() {
    // 清除失焦隐藏计时器
    if (this.diseaseBlurTimer) {
      clearTimeout(this.diseaseBlurTimer);
      this.diseaseBlurTimer = null;
    }

    // 触发全局搜索，基于所有三个框的关键词
    var result = this.performGlobalSearch(this.form.diseaseName, this.form.chiefComplaint, this.form.diagnosis);
    this.filteredDiseases = result.diseases;
    this.filteredComplaints = result.complaints;
    this.filteredDiagnosis = result.diagnoses;

    // 显示下拉（即使为空也显示，会显示所有疾病）
    this.showDiseaseList = this.filteredDiseases.length > 0;
  }), (0, _defineProperty2.default)(_methods, "onDiseaseBlur", function onDiseaseBlur() {
    var _this10 = this;
    var text = (this.form.diseaseName || '').trim();
    if (text) {
      // 1）先按疾病大类精确匹配
      var hasDisease = this.templateIndex.some(function (r) {
        return r.disease === text;
      });
      if (hasDisease) {
        this.selectDisease(text);
      } else {
        // 2）再按标准诊断名匹配
        var diagRecord = this.templateIndex.find(function (r) {
          return (r.diagnoses || []).some(function (d) {
            return d === text;
          });
        });
        if (diagRecord) {
          this.selectDiagnosis(text);
        }
      }
    }

    // 延迟隐藏下拉，给点击事件留时间
    this.diseaseBlurTimer = setTimeout(function () {
      _this10.showDiseaseList = false;
    }, 200);
  }), (0, _defineProperty2.default)(_methods, "onDiseaseInput", function onDiseaseInput() {
    var _this11 = this;
    // 清除之前的计时器
    if (this.diseaseInputTimer) {
      clearTimeout(this.diseaseInputTimer);
    }

    // 防抖处理，延迟200ms执行
    this.diseaseInputTimer = setTimeout(function () {
      var result = _this11.performGlobalSearch(_this11.form.diseaseName, _this11.form.chiefComplaint, _this11.form.diagnosis);
      _this11.filteredDiseases = result.diseases;
      _this11.filteredComplaints = result.complaints;
      _this11.filteredDiagnosis = result.diagnoses;
      _this11.showDiseaseList = _this11.filteredDiseases.length > 0;
      // 主诉和诊断下拉在用户聚焦时才显示，这里只更新数据
    }, 200);
    // 如果当前输入的疾病名称与某个疾病完全匹配，则自动按该疾病刷新联动字段
    var kw = (this.form.diseaseName || '').trim();
    if (kw && this.filteredDiseases.includes(kw)) {
      this.selectDisease(kw);
    }
  }), (0, _defineProperty2.default)(_methods, "selectDisease", function selectDisease(disease) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
      forceFill: true
    };
    // 清除失焦隐藏计时器
    if (this.diseaseBlurTimer) {
      clearTimeout(this.diseaseBlurTimer);
      this.diseaseBlurTimer = null;
    }

    // 选择后关闭下拉
    this.showDiseaseList = false;

    // 查找该疾病的第一条模板记录（使用最佳匹配）
    var record = this.templateIndex.find(function (r) {
      return r.disease === disease;
    });
    if (record) {
      var force = (options === null || options === void 0 ? void 0 : options.forceFill) === true;
      // 智能填充：默认强制覆盖，满足“先选疾病反向自动填充”需求
      this.smartFillFields(record, {
        preserveComplaint: !force && !!(this.form.chiefComplaint && this.form.chiefComplaint.trim()),
        preserveSymptom: !force && !!(this.form.symptom && this.form.symptom.trim()),
        preserveDiagnosis: !force && !!(this.form.diagnosis && this.form.diagnosis.trim()),
        preserveTreatment: !force && !!(this.form.treatment && this.form.treatment.trim())
      });

      // 如果模板记录里缺少部分字段，兜底再用疾病模板填充缺失项
      var needComplaint = !this.form.chiefComplaint;
      var needDiagnosis = !this.form.diagnosis;
      var needTreatment = !this.form.treatment;
      if (needComplaint || needDiagnosis || needTreatment) {
        this.autoFillByDisease(disease);
      }

      // 确保疾病名称使用标准名称
      if (this.diseaseOptions.includes(disease)) {
        this.form.diseaseName = disease;
      }

      // 自动选择推荐用药
      if (Array.isArray(record.suggestDrugs) && record.suggestDrugs.length) {
        this.applySuggestDrugs(record.suggestDrugs);
      }
    } else {
      // 回退到旧逻辑（如果找不到结构化模板）
      this.loadTemplatesForDisease(disease);
      this.autoFillByDisease(disease);
      // 确保疾病名称使用标准名称
      if (!this.diseaseOptions.includes(this.form.diseaseName)) {
        var analyzedDisease = this.analyzeDiseaseFromDiagnosis(this.form.diagnosis || this.form.diseaseName);
        if (analyzedDisease) {
          this.form.diseaseName = analyzedDisease;
        } else {
          this.form.diseaseName = '其他';
        }
      }
    }
  }), (0, _defineProperty2.default)(_methods, "loadTemplatesForDisease", function loadTemplatesForDisease(disease) {
    var _this$diseaseTemplate2, _this$diseaseTemplate3, _this$treatmentTempla2;
    var baseDiag = ((_this$diseaseTemplate2 = this.diseaseTemplates) === null || _this$diseaseTemplate2 === void 0 ? void 0 : _this$diseaseTemplate2[disease]) || [];
    // 合并结构化模板中的诊断
    var structDiag = (((_this$diseaseTemplate3 = this.diseaseTemplateLib) === null || _this$diseaseTemplate3 === void 0 ? void 0 : _this$diseaseTemplate3[disease]) || []).flatMap(function (t) {
      return t.diagnoses || [];
    });
    var diag = Array.from(new Set([].concat((0, _toConsumableArray2.default)(baseDiag || []), (0, _toConsumableArray2.default)(structDiag))));
    var treat = ((_this$treatmentTempla2 = this.treatmentTemplates) === null || _this$treatmentTempla2 === void 0 ? void 0 : _this$treatmentTempla2[disease]) || [];
    this.filteredDiagnosis = diag;
    this.filteredTreatments = treat;
  }), (0, _defineProperty2.default)(_methods, "autoFillByDisease", function autoFillByDisease(disease) {
    var _this$complaintTempla, _this$diseaseTemplate4, _this$treatmentTempla3, _this$treatmentCautio;
    var complaint = (_this$complaintTempla = this.complaintTemplates) === null || _this$complaintTempla === void 0 ? void 0 : _this$complaintTempla[disease];
    var diagList = ((_this$diseaseTemplate4 = this.diseaseTemplates) === null || _this$diseaseTemplate4 === void 0 ? void 0 : _this$diseaseTemplate4[disease]) || [];
    var diag = diagList[0];
    var treats = (((_this$treatmentTempla3 = this.treatmentTemplates) === null || _this$treatmentTempla3 === void 0 ? void 0 : _this$treatmentTempla3[disease]) || []).slice(0, 2);
    // 附加注意事项/复诊提示
    var cautions = ((_this$treatmentCautio = this.treatmentCautions) === null || _this$treatmentCautio === void 0 ? void 0 : _this$treatmentCautio[disease]) || [];
    var merged = [];
    var pushUnique = function pushUnique(arr) {
      arr.forEach(function (t) {
        if (t && !merged.includes(t)) merged.push(t);
      });
    };
    pushUnique(treats);
    pushUnique(cautions);
    // 每次选择疾病时，都用模板覆盖联动字段，保证重新选择疾病也会刷新
    if (complaint) this.form.chiefComplaint = complaint;
    if (diag) {
      // 初步诊断使用模板中的完整诊断组合
      this.form.diagnosis = diagList.length ? diagList.join('；') : diag;
      // 从诊断中分析提取标准疾病名称（确保使用标准名称归类）
      var analyzedDisease = this.analyzeDiseaseFromDiagnosis(this.form.diagnosis);
      if (analyzedDisease) {
        this.form.diseaseName = analyzedDisease;
      } else if (this.diseaseOptions.includes(disease)) {
        // 如果疾病名称本身是标准名称，直接使用
        this.form.diseaseName = disease;
      } else {
        this.form.diseaseName = '其他';
      }
    }
    if (merged.length) this.form.treatment = merged.join('；');
  }), (0, _defineProperty2.default)(_methods, "onDiagnosisFocus", function onDiagnosisFocus() {
    // 触发全局搜索，基于所有三个框的关键词
    var result = this.performGlobalSearch(this.form.diseaseName, this.form.chiefComplaint, this.form.diagnosis);
    this.filteredDiseases = result.diseases;
    this.filteredComplaints = result.complaints;
    this.filteredDiagnosis = result.diagnoses;

    // 显示下拉（即使为空也显示，基于其他框的关键词）
    this.showDiagnosisList = this.filteredDiagnosis.length > 0;
  }), (0, _defineProperty2.default)(_methods, "onDiagnosisInput", function onDiagnosisInput() {
    var _this12 = this;
    // 清除之前的计时器
    if (this.diagnosisInputTimer) {
      clearTimeout(this.diagnosisInputTimer);
    }

    // 防抖处理，延迟200ms执行
    this.diagnosisInputTimer = setTimeout(function () {
      var result = _this12.performGlobalSearch(_this12.form.diseaseName, _this12.form.chiefComplaint, _this12.form.diagnosis);
      _this12.filteredDiseases = result.diseases;
      _this12.filteredComplaints = result.complaints;
      _this12.filteredDiagnosis = result.diagnoses;
      _this12.showDiagnosisList = _this12.filteredDiagnosis.length > 0;
    }, 200);
  }), (0, _defineProperty2.default)(_methods, "selectDiagnosis", function selectDiagnosis(text) {
    var _this13 = this;
    // 查找最匹配的模板记录（考虑当前已输入的字段）
    var bestRecord = this.findBestMatchingRecord(text,
    // 选择的诊断
    this.form.chiefComplaint,
    // 当前主诉
    this.form.diseaseName // 当前疾病名称
    );

    if (bestRecord) {
      // 智能填充：强制更新症状和处置，确保与诊断一致
      this.smartFillFields(bestRecord, {
        preserveComplaint: !!(this.form.chiefComplaint && this.form.chiefComplaint.trim()),
        // 如果主诉已输入，保留
        preserveSymptom: false,
        // ⚠️ 强制更新症状，确保与诊断一致
        preserveDiagnosis: false,
        // 诊断字段用新选择的替换
        preserveTreatment: false // ⚠️ 强制更新处置，确保与诊断一致
      });

      // 确保诊断字段使用选择的诊断（如果模板中有完整诊断组合，使用组合；否则使用选择的诊断）
      if (bestRecord.diagnoses && bestRecord.diagnoses.length) {
        // 检查选择的诊断是否在模板的诊断列表中
        var hasExactMatch = bestRecord.diagnoses.some(function (d) {
          return d === text;
        });
        if (hasExactMatch) {
          // 如果完全匹配，使用模板的完整诊断组合
          this.form.diagnosis = bestRecord.diagnoses.join('；');
        } else {
          // 否则使用选择的诊断
          this.form.diagnosis = text;
        }
      } else {
        this.form.diagnosis = text;
      }

      // 自动选择推荐用药
      if (Array.isArray(bestRecord.suggestDrugs) && bestRecord.suggestDrugs.length) {
        bestRecord.suggestDrugs.forEach(function (name) {
          if (name) {
            _this13.onDrugChip(name);
          }
        });
      }
    } else {
      // 如果没有找到匹配记录，只更新诊断和疾病名称
      this.form.diagnosis = text;
      var analyzedDisease = this.analyzeDiseaseFromDiagnosis(text);
      this.form.diseaseName = analyzedDisease || '其他';
    }
    this.showDiagnosisList = false;
  }), (0, _defineProperty2.default)(_methods, "onComplaintFocus", function onComplaintFocus() {
    var _this14 = this;
    // 清除失焦隐藏计时器
    if (this.complaintBlurTimer) {
      clearTimeout(this.complaintBlurTimer);
      this.complaintBlurTimer = null;
    }
    var currentComplaint = (this.form.chiefComplaint || '').trim();

    // 情况1：自由编辑模式（已选择过） → 不触发搜索，不显示下拉
    if (this.complaintSelectedMode && currentComplaint) {
      this.showComplaintList = false;
      return;
    }

    // 情况2：输入框为空 → 重置为搜索模式，基于其他框的关键词显示联动结果
    if (!currentComplaint) {
      this.complaintSelectedMode = false;
    }

    // 情况3：搜索模式 → 触发全局搜索（基于AND逻辑）并显示下拉
    // 使用防抖避免频繁调用
    if (this.complaintFocusTimer) {
      clearTimeout(this.complaintFocusTimer);
    }
    this.complaintFocusTimer = setTimeout(function () {
      var result = _this14.performGlobalSearch(_this14.form.diseaseName, _this14.form.chiefComplaint, _this14.form.diagnosis);
      _this14.filteredDiseases = result.diseases;
      _this14.filteredComplaints = result.complaints;
      _this14.filteredDiagnosis = result.diagnoses;

      // 即使主诉框为空，只要有其他框的关键词，也显示联动结果
      _this14.showComplaintList = _this14.filteredComplaints.length > 0;
    }, 150);
  }), (0, _defineProperty2.default)(_methods, "onComplaintInput", function onComplaintInput() {
    var _this15 = this;
    var currentComplaint = (this.form.chiefComplaint || '').trim();

    // 如果内容被清空，重置为搜索模式
    if (!currentComplaint) {
      this.complaintSelectedMode = false;
    }

    // 如果已选择主诉（自由编辑模式），不显示下拉
    if (this.complaintSelectedMode && currentComplaint) {
      this.showComplaintList = false;
      return;
    }

    // 搜索模式：执行全局搜索并显示下拉（添加防抖）
    if (this.complaintInputTimer) {
      clearTimeout(this.complaintInputTimer);
    }
    this.complaintInputTimer = setTimeout(function () {
      var result = _this15.performGlobalSearch(_this15.form.diseaseName, _this15.form.chiefComplaint, _this15.form.diagnosis);
      _this15.filteredDiseases = result.diseases;
      _this15.filteredComplaints = result.complaints;
      _this15.filteredDiagnosis = result.diagnoses;
      _this15.showComplaintList = _this15.filteredComplaints.length > 0;
    }, 200);
  }), (0, _defineProperty2.default)(_methods, "onComplaintBlur", function onComplaintBlur() {
    var _this16 = this;
    // 失焦时重置聚焦状态
    this.complaintFocus = false;
    // 延迟隐藏下拉，给点击事件留时间
    this.complaintBlurTimer = setTimeout(function () {
      _this16.showComplaintList = false;
    }, 200);
    // 主诉编辑完成后，根据最新主诉获取系统诊断建议（防抖处理）
    if (this.fetchHvSuggestionTimer) {
      clearTimeout(this.fetchHvSuggestionTimer);
    }
    this.fetchHvSuggestionTimer = setTimeout(function () {
      _this16.fetchHvSuggestion();
    }, 300);
  }), (0, _defineProperty2.default)(_methods, "fetchHvSuggestion", function fetchHvSuggestion() {
    var _this17 = this;
    return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee5() {
      var text, res, payload, symptomText;
      return _regenerator.default.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              text = (_this17.form.chiefComplaint || '').trim();
              if (text) {
                _context5.next = 6;
                break;
              }
              _this17.hvTriage = null;
              _this17.standardizedSymptoms = [];
              // 主诉为空时，清空症状以保持一致
              _this17.form.symptom = '';
              return _context5.abrupt("return");
            case 6:
              _context5.prev = 6;
              _context5.next = 9;
              return wx.cloud.callFunction({
                name: 'clinicRecords',
                data: {
                  action: 'suggestHvDiagnosis',
                  data: {
                    chiefComplaint: text
                  }
                }
              });
            case 9:
              res = _context5.sent;
              console.log('[clinic/add] fetchHvSuggestion result:', res);
              payload = res.result && res.result.success ? res.result.data : null; // 提取标准化症状
              if (payload && payload.standardized && payload.standardized.details) {
                _this17.standardizedSymptoms = payload.standardized.details.map(function (detail) {
                  return {
                    code: detail.code,
                    name: detail.standardName || detail.name,
                    category: detail.category,
                    severity: detail.severity || 1,
                    selected: false
                  };
                });

                // 根据主诉自动更新症状，保持与主诉一致（用分号连接标准化症状）
                symptomText = _this17.standardizedSymptoms.map(function (s) {
                  return s.name;
                }).join('；');
                if (symptomText) {
                  _this17.form.symptom = symptomText;
                }
              } else {
                _this17.standardizedSymptoms = [];
                // 如果没有标准化症状，使用主诉内容作为症状
                if (text) {
                  _this17.form.symptom = text;
                }
              }
              _this17.hvTriage = payload.triage || null;
              _context5.next = 21;
              break;
            case 16:
              _context5.prev = 16;
              _context5.t0 = _context5["catch"](6);
              console.error('获取标准化症状失败:', _context5.t0);
              _this17.hvTriage = null;
              _this17.standardizedSymptoms = [];
            case 21:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5, null, [[6, 16]]);
    }))();
  }), (0, _defineProperty2.default)(_methods, "onSymptomFocus", function onSymptomFocus() {
    // 清除失焦隐藏计时器
    if (this.symptomBlurTimer) {
      clearTimeout(this.symptomBlurTimer);
      this.symptomBlurTimer = null;
    }

    // 如果症状框为空，显示标准化症状建议
    var currentSymptom = (this.form.symptom || '').trim();
    if (!currentSymptom && this.standardizedSymptoms.length > 0) {
      this.filteredSymptoms = this.standardizedSymptoms.map(function (s) {
        return {
          name: s.name,
          category: s.category,
          code: s.code
        };
      });
      this.showSymptomList = true;
    } else if (currentSymptom) {
      // 基于输入内容过滤症状建议
      this.filterSymptomsByInput(currentSymptom);
    }
  }), (0, _defineProperty2.default)(_methods, "onSymptomInput", function onSymptomInput() {
    var _this18 = this;
    // 清除之前的计时器
    if (this.symptomInputTimer) {
      clearTimeout(this.symptomInputTimer);
    }

    // 防抖处理，延迟300ms执行
    this.symptomInputTimer = setTimeout(function () {
      var text = (_this18.form.symptom || '').trim();
      if (!text) {
        // 如果清空，显示标准化症状
        if (_this18.standardizedSymptoms.length > 0) {
          _this18.filteredSymptoms = _this18.standardizedSymptoms.map(function (s) {
            return {
              name: s.name,
              category: s.category,
              code: s.code
            };
          });
          _this18.showSymptomList = true;
        } else {
          _this18.showSymptomList = false;
        }
        return;
      }

      // 基于输入内容过滤
      _this18.filterSymptomsByInput(text);
    }, 300);
  }), (0, _defineProperty2.default)(_methods, "filterSymptomsByInput", function filterSymptomsByInput(text) {
    var lowerText = text.toLowerCase();
    var matched = [];
    var matchedNames = new Set(); // 用于去重

    // 1. 从标准化症状中匹配（限制数量）
    if (this.standardizedSymptoms && this.standardizedSymptoms.length > 0) {
      for (var i = 0; i < Math.min(this.standardizedSymptoms.length, 50); i++) {
        var s = this.standardizedSymptoms[i];
        if (s.name && s.name.toLowerCase().includes(lowerText)) {
          if (!matchedNames.has(s.name)) {
            matched.push({
              name: s.name,
              category: s.category,
              code: s.code
            });
            matchedNames.add(s.name);
          }
        }
        // 如果已经找到足够的匹配项，提前退出
        if (matched.length >= 20) break;
      }
    }

    // 2. 从模板索引中提取症状建议（限制遍历数量）
    if (this.templateIndex && this.templateIndex.length > 0 && matched.length < 20) {
      var maxIndex = Math.min(this.templateIndex.length, 100); // 最多遍历100条模板
      for (var _i5 = 0; _i5 < maxIndex; _i5++) {
        var rec = this.templateIndex[_i5];
        if (rec.symptoms && Array.isArray(rec.symptoms)) {
          for (var j = 0; j < rec.symptoms.length && matched.length < 20; j++) {
            var symptom = rec.symptoms[j];
            if (symptom && typeof symptom === 'string' && symptom.toLowerCase().includes(lowerText)) {
              if (!matchedNames.has(symptom)) {
                matched.push({
                  name: symptom,
                  category: '',
                  code: ''
                });
                matchedNames.add(symptom);
              }
            }
          }
        }
        // 如果已经找到足够的匹配项，提前退出
        if (matched.length >= 20) break;
      }
    }
    this.filteredSymptoms = matched.slice(0, 20); // 限制最多20条
    this.showSymptomList = matched.length > 0;
  }), (0, _defineProperty2.default)(_methods, "onSymptomBlur", function onSymptomBlur() {
    var _this19 = this;
    // 延迟隐藏下拉，给点击事件留时间
    this.symptomBlurTimer = setTimeout(function () {
      _this19.showSymptomList = false;
    }, 200);
  }), (0, _defineProperty2.default)(_methods, "selectSymptom", function selectSymptom(symptom) {
    // 清除失焦隐藏计时器
    if (this.symptomBlurTimer) {
      clearTimeout(this.symptomBlurTimer);
      this.symptomBlurTimer = null;
    }
    var currentSymptom = (this.form.symptom || '').trim();
    var symptomName = typeof symptom === 'string' ? symptom : symptom.name || '';
    if (currentSymptom) {
      // 如果已有内容，追加（用分号分隔）
      if (!currentSymptom.includes(symptomName)) {
        this.form.symptom = "".concat(currentSymptom, "\uFF1B").concat(symptomName);
      }
    } else {
      // 如果为空，直接填入
      this.form.symptom = symptomName;
    }
    this.showSymptomList = false;
  }), (0, _defineProperty2.default)(_methods, "toggleSymptomTag", function toggleSymptomTag(symptom) {
    symptom.selected = !symptom.selected;
    var currentSymptom = (this.form.symptom || '').trim();
    var symptomName = symptom.name;
    if (symptom.selected) {
      // 添加到症状框
      if (currentSymptom) {
        if (!currentSymptom.includes(symptomName)) {
          this.form.symptom = "".concat(currentSymptom, "\uFF1B").concat(symptomName);
        }
      } else {
        this.form.symptom = symptomName;
      }
    } else {
      // 从症状框移除
      if (currentSymptom.includes(symptomName)) {
        var parts = currentSymptom.split('；').filter(function (s) {
          return s.trim() !== symptomName;
        });
        this.form.symptom = parts.join('；');
      }
    }
  }), (0, _defineProperty2.default)(_methods, "analyzeDiseaseFromDiagnosis", function analyzeDiseaseFromDiagnosis(diagnosisText) {
    if (!diagnosisText) return null;
    var text = diagnosisText.toLowerCase();

    // 疾病名称匹配规则（按优先级排序，包含常见医学诊断术语）
    var diseaseRules = [
    // 扭伤类
    {
      keywords: ['扭伤', '崴', '扭到', '关节扭伤', '脚踝扭伤', '手腕扭伤', '踝关节扭伤', '腕关节扭伤', '软组织扭伤'],
      disease: '扭伤'
    },
    // 擦伤类
    {
      keywords: ['擦伤', '蹭破', '擦破', '皮肤擦伤', '挫伤', '表皮擦伤', '浅表擦伤'],
      disease: '擦伤'
    },
    // 烫伤类
    {
      keywords: ['烫伤', '烧伤', '灼伤', '烫到', '热烧伤', '化学烧伤'],
      disease: '烫伤'
    },
    // 磕伤类
    {
      keywords: ['磕伤', '磕到', '撞伤', '碰伤', '磕碰', '撞击伤', '碰撞伤'],
      disease: '磕伤'
    },
    // 冻伤类
    {
      keywords: ['冻伤', '冻到', '冻疮', '冻僵'],
      disease: '冻伤'
    },
    // 腹泻类（包含胃肠炎等）
    {
      keywords: ['腹泻', '拉肚子', '拉稀', '泻', '急性胃肠炎', '胃肠炎', '肠胃炎', '肠炎', '急性肠炎', '细菌性肠炎', '病毒性肠炎', '消化不良', '胃肠功能紊乱'],
      disease: '腹泻'
    },
    // 头晕类
    {
      keywords: ['头晕', '头昏', '眩晕', '晕', '眼前发黑', '体位性低血压', '低血糖', '贫血性头晕'],
      disease: '头晕'
    },
    // 头痛类
    {
      keywords: ['头痛', '头疼', '头部不适', '头胀', '偏头痛', '紧张性头痛', '血管性头痛'],
      disease: '头痛'
    },
    // 感冒类
    {
      keywords: ['感冒', '着凉', '受凉', '风寒', '上呼吸道感染', '上感', '普通感冒', '病毒性感冒'],
      disease: '感冒'
    },
    // 脱臼类
    {
      keywords: ['脱臼', '脱位', '关节脱位', '肩关节脱位', '肘关节脱位'],
      disease: '脱臼'
    },
    // 骨折类
    {
      keywords: ['骨折', '骨裂', '断骨', '闭合性骨折', '开放性骨折', '不完全骨折'],
      disease: '骨折'
    },
    // 过敏类
    {
      keywords: ['过敏', '过敏性', '过敏反应', '过敏性皮炎', '过敏性鼻炎', '荨麻疹', '湿疹'],
      disease: '过敏'
    },
    // 痛经类
    {
      keywords: ['痛经', '经期疼痛', '月经痛', '原发性痛经', '继发性痛经'],
      disease: '痛经'
    },
    // 测血压类
    {
      keywords: ['测血压', '血压', '量血压', '血压监测', '血压检查', '血压测量'],
      disease: '测血压'
    }];

    // 按优先级匹配
    for (var _i6 = 0, _diseaseRules = diseaseRules; _i6 < _diseaseRules.length; _i6++) {
      var rule = _diseaseRules[_i6];
      var _iterator2 = _createForOfIteratorHelper(rule.keywords),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var keyword = _step2.value;
          if (text.includes(keyword.toLowerCase())) {
            return rule.disease;
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    }

    // 如果没有匹配到，返回 null，保持原值或使用"其他"
    return null;
  }), (0, _defineProperty2.default)(_methods, "onDiagnosisBlur", function onDiagnosisBlur() {
    // 诊断输入框失焦时，关闭下拉列表
    this.showDiagnosisList = false;

    // 根据诊断自动更新处置，保持与诊断一致
    var diagnosisText = (this.form.diagnosis || '').trim();
    if (!diagnosisText) {
      // 诊断为空时，清空处置以保持一致
      this.form.treatment = '';
      return;
    }

    // 从诊断中分析提取标准疾病名称（强制更新，确保使用标准名称）
    var analyzedDisease = this.analyzeDiseaseFromDiagnosis(diagnosisText);
    if (analyzedDisease) {
      // 如果分析出标准疾病名称，直接更新（确保使用标准名称归类）
      this.form.diseaseName = analyzedDisease;
    } else {
      // 如果无法分析出标准疾病名称，设置为"其他"
      this.form.diseaseName = '其他';
    }

    // 使用最佳匹配逻辑查找最准确的模板记录
    var bestRecord = this.findBestMatchingRecord(diagnosisText,
    // 当前诊断
    this.form.chiefComplaint,
    // 当前主诉
    this.form.diseaseName // 当前疾病名称
    );

    if (bestRecord && bestRecord.treatments && bestRecord.treatments.length) {
      // 找到匹配的模板记录，智能填充处置（如果处置为空）
      if (!this.form.treatment || !this.form.treatment.trim()) {
        this.form.treatment = bestRecord.treatments.join('；');
      }
      // 如果主诉为空，也可以填充主诉（确保字段关联）
      if (!this.form.chiefComplaint || !this.form.chiefComplaint.trim()) {
        if (bestRecord.complaint) {
          this.form.chiefComplaint = bestRecord.complaint;
        }
      }
      // 如果症状为空，也可以填充症状
      if (!this.form.symptom || !this.form.symptom.trim()) {
        if (bestRecord.symptoms && bestRecord.symptoms.length) {
          this.form.symptom = bestRecord.symptoms.join('；');
        }
      }
    } else {
      // 如果没有找到完整匹配，尝试根据疾病名称查找处置模板
      var diseaseName = (this.form.diseaseName || '').trim();
      if (diseaseName && (!this.form.treatment || !this.form.treatment.trim())) {
        var _this$treatmentTempla4;
        var treatments = ((_this$treatmentTempla4 = this.treatmentTemplates) === null || _this$treatmentTempla4 === void 0 ? void 0 : _this$treatmentTempla4[diseaseName]) || [];
        if (treatments.length > 0) {
          // 使用前两个处置模板
          this.form.treatment = treatments.slice(0, 2).join('；');
        }
      }
    }
  }), (0, _defineProperty2.default)(_methods, "openDiagnosisGuide", function openDiagnosisGuide() {
    var _this20 = this;
    // 添加模板库匹配的诊断
    var result = this.performGlobalSearch(this.form.diseaseName, this.form.chiefComplaint, this.form.diagnosis);

    // 更新过滤列表
    this.filteredDiagnosis = result.diagnoses;

    // 4. 显示诊断下拉列表
    if (this.filteredDiagnosis.length > 0) {
      this.showDiagnosisList = true;
      // 聚焦到诊断输入框，触发下拉显示
      this.$nextTick(function () {
        // 触发诊断输入框的焦点事件，显示下拉列表
        _this20.onDiagnosisFocus();
      });
    } else {
      // 如果没有可用的诊断选项，提示用户
      uni.showToast({
        title: '请输入疾病名称或主诉以查看诊断参考',
        icon: 'none',
        duration: 2000
      });
    }
  }), (0, _defineProperty2.default)(_methods, "selectComplaint", function selectComplaint(opt) {
    var _this21 = this;
    // 清除失焦隐藏计时器
    if (this.complaintBlurTimer) {
      clearTimeout(this.complaintBlurTimer);
      this.complaintBlurTimer = null;
    }
    if (!opt || !opt.record) return;
    var rec = opt.record;

    // 智能填充：只填充空白字段，保留用户已输入的内容
    this.smartFillFields(rec, {
      preserveComplaint: false,
      // 主诉用新选择的替换
      preserveSymptom: !!(this.form.symptom && this.form.symptom.trim()),
      preserveDiagnosis: !!(this.form.diagnosis && this.form.diagnosis.trim()),
      preserveTreatment: !!(this.form.treatment && this.form.treatment.trim())
    });

    // 确保主诉字段使用选择的主诉
    this.form.chiefComplaint = rec.complaint;

    // 自动选择推荐用药
    if (Array.isArray(rec.suggestDrugs) && rec.suggestDrugs.length) {
      this.applySuggestDrugs(rec.suggestDrugs);
    }

    // 进入自由编辑模式
    this.complaintSelectedMode = true;
    this.showComplaintList = false;

    // 自动聚焦到主诉输入框，方便立即编辑
    this.$nextTick(function () {
      _this21.complaintFocus = false;
      _this21.$nextTick(function () {
        _this21.complaintFocus = true;
      });
    });
  }), (0, _defineProperty2.default)(_methods, "onTreatmentFocus", function onTreatmentFocus() {
    if (!this.form.treatment || this.form.treatment.trim() === '') {
      var _this$treatmentTempla5;
      var src = ((_this$treatmentTempla5 = this.treatmentTemplates) === null || _this$treatmentTempla5 === void 0 ? void 0 : _this$treatmentTempla5[this.form.diseaseName]) || [];
      this.filteredTreatments = src;
      this.showTreatmentList = src.length > 0;
    }
  }), (0, _defineProperty2.default)(_methods, "onTreatmentInput", function onTreatmentInput() {
    var _this$treatmentTempla6;
    var src = ((_this$treatmentTempla6 = this.treatmentTemplates) === null || _this$treatmentTempla6 === void 0 ? void 0 : _this$treatmentTempla6[this.form.diseaseName]) || [];
    var text = (this.form.treatment || '').trim().toLowerCase();
    if (!text) {
      this.filteredTreatments = src;
      this.showTreatmentList = src.length > 0;
      return;
    }
    this.filteredTreatments = src.filter(function (s) {
      return s.toLowerCase().includes(text);
    });
    this.showTreatmentList = this.filteredTreatments.length > 0;
  }), (0, _defineProperty2.default)(_methods, "selectTreatment", function selectTreatment(text) {
    this.form.treatment = text;
    this.showTreatmentList = false;
  }), (0, _defineProperty2.default)(_methods, "appendTreatment", function appendTreatment(token) {
    var base = (this.form.treatment || '').trim();
    this.form.treatment = base ? "".concat(base, "\uFF1B").concat(token) : token;
  }), (0, _defineProperty2.default)(_methods, "saveCurrentAsTemplate", function saveCurrentAsTemplate() {
    var disease = (this.form.diseaseName || '').trim();
    if (!disease) {
      uni.showToast({
        title: '请先选择疾病名称',
        icon: 'none'
      });
      return;
    }
    var complaint = (this.form.chiefComplaint || '').trim();
    var diagnosis = (this.form.diagnosis || '').trim();
    var treatment = (this.form.treatment || '').trim();
    if (!complaint && !diagnosis && !treatment) {
      uni.showToast({
        title: '请输入主诉/诊断/处置后再保存',
        icon: 'none'
      });
      return;
    }

    // 直接更新 userDiseaseTemplates
    if (!this.userDiseaseTemplates[disease]) {
      this.userDiseaseTemplates[disease] = {
        complaints: [],
        diagnosis: [],
        treatments: []
      };
    }
    var target = this.userDiseaseTemplates[disease];
    if (complaint && !target.complaints.includes(complaint)) {
      target.complaints.unshift(complaint);
      target.complaints = target.complaints.slice(0, 20);
    }
    if (diagnosis && !target.diagnosis.includes(diagnosis)) {
      target.diagnosis.unshift(diagnosis);
      target.diagnosis = target.diagnosis.slice(0, 20);
    }
    if (treatment && !target.treatments.includes(treatment)) {
      target.treatments.unshift(treatment);
      target.treatments = target.treatments.slice(0, 20);
    }

    // 持久化到本地
    try {
      uni.setStorageSync('userDiseaseTemplates', this.userDiseaseTemplates);
      // 重新构建模板索引，包含新保存的模板
      this.buildTemplateIndex();
      uni.showToast({
        title: '模板已保存',
        icon: 'success'
      });
    } catch (e) {
      console.error('保存模板失败:', e);
      uni.showToast({
        title: '保存失败',
        icon: 'none'
      });
    }
  }), (0, _defineProperty2.default)(_methods, "promptSaveTemplate", function promptSaveTemplate() {
    var _this22 = this;
    var disease = (this.form.diseaseName || '').trim();
    var complaint = (this.form.chiefComplaint || '').trim();
    var diagnosis = (this.form.diagnosis || '').trim();
    var treatment = (this.form.treatment || '').trim();

    // 必须有疾病名和至少一项内容
    if (!disease || !complaint && !diagnosis && !treatment) {
      return;
    }
    uni.showModal({
      title: '保存为模板',
      content: '是否将当前主诉、诊断、处置保存为自定义模板？下次可快速调用',
      confirmText: '保存',
      cancelText: '跳过',
      success: function success(res) {
        if (res.confirm) {
          _this22.saveCurrentAsTemplate();
        }
      }
    });
  }), (0, _defineProperty2.default)(_methods, "normalizeText", function normalizeText(text) {
    try {
      return String(text || '').toLowerCase().replace(/\\s+/g, '');
    } catch (e) {
      return '';
    }
  }), (0, _defineProperty2.default)(_methods, "ensureStockLoaded", function ensureStockLoaded() {
    var _this23 = this;
    return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee6() {
      return _regenerator.default.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              if (!(!_this23.filteredDrugs || _this23.filteredDrugs.length === 0)) {
                _context6.next = 8;
                break;
              }
              _context6.prev = 1;
              _context6.next = 4;
              return _this23.loadLocationDrugs();
            case 4:
              _context6.next = 8;
              break;
            case 6:
              _context6.prev = 6;
              _context6.t0 = _context6["catch"](1);
            case 8:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6, null, [[1, 6]]);
    }))();
  }), (0, _defineProperty2.default)(_methods, "isPrescriptionDrug", function isPrescriptionDrug(name) {
    var n = (name || '').trim();
    if (!n) return false;
    return (this.rxDrugNames || []).includes(n);
  }), (0, _defineProperty2.default)(_methods, "applySuggestDrugs", function applySuggestDrugs(list) {
    var _this24 = this;
    if (!Array.isArray(list) || !list.length) return;
    list.forEach(function (name) {
      var n = (name || '').trim();
      if (!n) return;
      if (_this24.isPrescriptionDrug(n)) {
        _this24.appendTreatment("".concat(n, "\uFF08\u5904\u65B9\u836F\uFF0C\u9700\u5F00\u5177\u5904\u65B9\u5355\uFF0C\u5728\u9646\u56ED/\u6C34\u56ED\u836F\u623F\u53D1\u836F\uFF09"));
      } else {
        _this24.onDrugChip(n);
      }
    });
  }), (0, _defineProperty2.default)(_methods, "findDrugByName", function findDrugByName(name) {
    var _this25 = this;
    var target = this.normalizeText(name);
    var inList = function inList(list) {
      return (list || []).find(function (d) {
        var n1 = _this25.normalizeText(d.name || d.drugName);
        var n2 = _this25.normalizeText(d.specification || d.spec);
        return n1.includes(target) || target.includes(n1) || n2.includes(target);
      });
    };
    var found = inList(this.filteredDrugs);
    if (!found) found = inList(this.allDrugs);
    return found;
  }), (0, _defineProperty2.default)(_methods, "onDrugChip", function onDrugChip(name) {
    var _this26 = this;
    return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee7() {
      var drug;
      return _regenerator.default.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              // 1) 先附加“（一次）”到处置文本
              _this26.appendTreatment("".concat(name, "\uFF08\u4E00\u6B21\uFF09"));
              // 2) 加载当前园区库存，并尝试选中对应药材
              _context7.next = 3;
              return _this26.ensureStockLoaded();
            case 3:
              drug = _this26.findDrugByName(name);
              if (!(drug && drug._id)) {
                _context7.next = 15;
                break;
              }
              _context7.prev = 5;
              _context7.next = 8;
              return _this26.onDrugSelect(drug);
            case 8:
              uni.showToast({
                title: "\u5DF2\u9009\u4E2D\u836F\u6750\uFF1A".concat(drug.name),
                icon: 'none'
              });
              _context7.next = 13;
              break;
            case 11:
              _context7.prev = 11;
              _context7.t0 = _context7["catch"](5);
            case 13:
              _context7.next = 16;
              break;
            case 15:
              uni.showToast({
                title: '当前园区暂无该药库存',
                icon: 'none'
              });
            case 16:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee7, null, [[5, 11]]);
    }))();
  }), (0, _defineProperty2.default)(_methods, "restoreLastLocation", function restoreLastLocation() {
    try {
      var lastLocation = uni.getStorageSync('clinic_last_location');
      var tipClosed = uni.getStorageSync('clinic_location_tip_closed');
      var isValidLocation = lastLocation === 'land_park' || lastLocation === 'water_park';

      // 规则：
      // 1）默认不选园区，每次进入都弹窗；
      // 2）只有当用户勾选了“下次不再提醒”并关闭弹窗时，才记住园区且下次不再弹窗；
      // 3）此时才在进入页面时自动带出上次园区。
      if (tipClosed && isValidLocation) {
        // 用户明确选择了不再提醒，并有合法园区记录
        this.form.location = lastLocation;
        this.showLocationTip = false;
        var locationName = lastLocation === 'land_park' ? '陆园' : '水园';
        console.log("\u5DF2\u6309\u4E0A\u6B21\u8BB0\u5F55\u81EA\u52A8\u9009\u62E9\u56ED\u533A: ".concat(locationName));
      } else {
        // 其余情况：不自动选园区，始终弹出提示
        this.form.location = '';
        this.showLocationTip = true;
      }

      // 恢复连续登记模式设置
      var continueMode = uni.getStorageSync('clinic_continue_mode');
      if (continueMode !== undefined && continueMode !== null) {
        this.continueAfterSubmit = continueMode;
      }
    } catch (err) {
      console.error('恢复园区选择失败:', err);
      this.form.location = '';
    }
  }), (0, _defineProperty2.default)(_methods, "selectLocation", function selectLocation(location) {
    this.form.location = location;

    // 保存到本地存储，记忆用户选择
    try {
      uni.setStorageSync('clinic_last_location', location);
    } catch (err) {
      console.error('保存园区选择失败:', err);
    }

    // 切换园区后重新加载批次
    if (this.selectedDrug) {
      uni.showToast({
        title: "\u5DF2\u5207\u6362\u5230".concat(location === 'land_park' ? '陆园' : '水园'),
        icon: 'none',
        duration: 1500
      });
      this.loadBatches();
    }
  }), (0, _defineProperty2.default)(_methods, "onLocationFocus", function onLocationFocus() {
    var text = (this.form.injuryLocation || '').trim().toLowerCase();
    if (!text) {
      // 展示全部常用地点
      this.filteredLocations = Array.from(new Set(this.allLocations));
    } else {
      this.onLocationInput();
    }
    this.showLocationList = true;
  }), (0, _defineProperty2.default)(_methods, "onLocationInput", function onLocationInput() {
    var text = (this.form.injuryLocation || '').trim().toLowerCase();
    var src = Array.from(new Set(this.allLocations));
    if (!text) {
      this.filteredLocations = src;
    } else {
      this.filteredLocations = src.filter(function (name) {
        return name.toLowerCase().includes(text);
      });
    }
    this.showLocationList = true;
  }), (0, _defineProperty2.default)(_methods, "selectLocationFromList", function selectLocationFromList(name) {
    this.form.injuryLocation = name;
    this.showLocationList = false;
  }), (0, _defineProperty2.default)(_methods, "onDrugSelect", function onDrugSelect(drug) {
    var _this27 = this;
    return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee8() {
      var res;
      return _regenerator.default.wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              // 先设置基本信息
              _this27.form.drugId = drug._id;
              _this27.showDrugSelector = false;

              // 从药材档案获取完整信息
              uni.showLoading({
                title: '加载药材信息...'
              });
              _context8.prev = 3;
              _context8.next = 6;
              return wx.cloud.callFunction({
                name: 'drugManage',
                data: {
                  action: 'getDetail',
                  data: {
                    id: drug._id
                  }
                }
              });
            case 6:
              res = _context8.sent;
              if (res.result.success && res.result.data) {
                // 使用完整的药材信息
                _this27.selectedDrug = _objectSpread(_objectSpread({}, res.result.data), {}, {
                  _id: res.result.data._id,
                  drugCode: res.result.data.drugCode || res.result.data.code || '',
                  name: res.result.data.name,
                  specification: res.result.data.specification || res.result.data.spec || '',
                  minUnit: res.result.data.minUnit || res.result.data.unit || '个',
                  packUnit: res.result.data.packUnit || res.result.data.unit || '盒',
                  conversionRate: res.result.data.conversionRate || 1,
                  manufacturer: res.result.data.manufacturer || ''
                });
              } else {
                // 如果获取失败，使用传入的drug数据
                _this27.selectedDrug = _objectSpread(_objectSpread({}, drug), {}, {
                  minUnit: drug.minUnit || drug.unit || '个',
                  packUnit: drug.packUnit || drug.unit || '盒',
                  conversionRate: drug.conversionRate || 1
                });
              }
              _context8.next = 14;
              break;
            case 10:
              _context8.prev = 10;
              _context8.t0 = _context8["catch"](3);
              console.error('获取药材详情失败:', _context8.t0);
              // 使用传入的drug数据
              _this27.selectedDrug = _objectSpread(_objectSpread({}, drug), {}, {
                minUnit: drug.minUnit || drug.unit || '个',
                packUnit: drug.packUnit || drug.unit || '盒',
                conversionRate: drug.conversionRate || 1
              });
            case 14:
              _context8.prev = 14;
              // 关闭第一个loading
              uni.hideLoading();
              return _context8.finish(14);
            case 17:
              // 初始化单次剂量（从规格中提取）
              if (_this27.selectedDrug) {
                _this27.currentDrug.dosage = _this27.getDefaultDosage(_this27.selectedDrug);
              }

              // 加载该园区的批次和库存（loadBatches内部会管理loading状态）
              _context8.next = 20;
              return _this27.loadBatches();
            case 20:
            case "end":
              return _context8.stop();
          }
        }
      }, _callee8, null, [[3, 10, 14, 17]]);
    }))();
  }), (0, _defineProperty2.default)(_methods, "loadBatches", function loadBatches() {
    var _this28 = this;
    return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee9() {
      var res, batches, parkName;
      return _regenerator.default.wrap(function _callee9$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              if (!(!_this28.form.drugId || !_this28.form.location)) {
                _context9.next = 5;
                break;
              }
              console.warn('[loadBatches] 缺少必要参数:', {
                drugId: _this28.form.drugId,
                location: _this28.form.location
              });
              _this28.selectedBatch = null;
              _this28.availableStock = 0;
              return _context9.abrupt("return");
            case 5:
              uni.showLoading({
                title: '加载库存...'
              });
              _context9.prev = 6;
              console.log('[loadBatches] 查询参数:', {
                drugId: _this28.form.drugId,
                location: _this28.form.location,
                enableFIFO: true
              });
              _context9.next = 10;
              return wx.cloud.callFunction({
                name: 'stockManage',
                data: {
                  action: 'getBatchesByDrugId',
                  data: {
                    drugId: _this28.form.drugId,
                    location: _this28.form.location,
                    enableFIFO: true
                  }
                }
              });
            case 10:
              res = _context9.sent;
              console.log('[loadBatches] 查询结果:', res.result);
              if (res.result.success && res.result.data && res.result.data.length > 0) {
                batches = res.result.data;
                console.log('[loadBatches] 找到批次:', batches.length, '个');
                console.log('[loadBatches] 批次详情:', batches);
                _this28.selectedBatch = batches[0];
                // 确保数量是数字类型
                _this28.availableStock = batches.reduce(function (sum, b) {
                  var qty = Number(b.quantity) || 0;
                  console.log('[loadBatches] 批次数量:', b.batch, '=', qty);
                  return sum + qty;
                }, 0);
                console.log('[loadBatches] 总库存:', _this28.availableStock);
              } else {
                console.warn('[loadBatches] 未找到批次或查询失败:', res.result);
                _this28.selectedBatch = null;
                _this28.availableStock = 0;
                parkName = _this28.form.location === 'land_park' ? '陆园' : '水园';
                uni.showToast({
                  title: "".concat(parkName, "\u8BE5\u836F\u6750\u5E93\u5B58\u4E0D\u8DB3"),
                  icon: 'none',
                  duration: 2000
                });
              }
              _context9.next = 21;
              break;
            case 15:
              _context9.prev = 15;
              _context9.t0 = _context9["catch"](6);
              console.error('[loadBatches] 查询异常:', _context9.t0);
              uni.showToast({
                title: '加载库存失败',
                icon: 'none'
              });
              _this28.selectedBatch = null;
              _this28.availableStock = 0;
            case 21:
              _context9.prev = 21;
              uni.hideLoading();
              return _context9.finish(21);
            case 24:
            case "end":
              return _context9.stop();
          }
        }
      }, _callee9, null, [[6, 15, 21, 24]]);
    }))();
  }), (0, _defineProperty2.default)(_methods, "openSignature", function openSignature() {
    this.showSignature = true;
  }), (0, _defineProperty2.default)(_methods, "onSignatureConfirm", function onSignatureConfirm(signatureData) {
    this.form.doctorSign = signatureData;

    // 记录签名时间
    var now = new Date();
    var year = now.getFullYear();
    var month = String(now.getMonth() + 1).padStart(2, '0');
    var day = String(now.getDate()).padStart(2, '0');
    var hours = String(now.getHours()).padStart(2, '0');
    var minutes = String(now.getMinutes()).padStart(2, '0');
    this.form.signTime = "".concat(year, "-").concat(month, "-").concat(day, " ").concat(hours, ":").concat(minutes);
    this.showSignature = false;
    uni.showToast({
      title: '签名成功',
      icon: 'success',
      duration: 1500
    });
  }), (0, _defineProperty2.default)(_methods, "handleSubmit", function handleSubmit() {
    var _this29 = this;
    return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee10() {
      var hasValidDrugUsage, drugItems, _loop, i, _ret, baseData, successCount, failCount, _i7, item, submitData, realMinUnit, quantityMin, res, _item, _submitData, _realMinUnit, _quantityMin, _res, _res2;
      return _regenerator.default.wrap(function _callee10$(_context11) {
        while (1) {
          switch (_context11.prev = _context11.next) {
            case 0:
              if (!(!_this29.form.location || _this29.form.location !== 'land_park' && _this29.form.location !== 'water_park')) {
                _context11.next = 3;
                break;
              }
              uni.showToast({
                title: '请选择就诊园区',
                icon: 'none'
              });
              return _context11.abrupt("return");
            case 3:
              if (!(!_this29.form.name || _this29.form.name.trim() === '')) {
                _context11.next = 6;
                break;
              }
              uni.showToast({
                title: '请输入患者姓名',
                icon: 'none'
              });
              return _context11.abrupt("return");
            case 6:
              if (_this29.form.gender) {
                _context11.next = 9;
                break;
              }
              uni.showToast({
                title: '请选择性别',
                icon: 'none'
              });
              return _context11.abrupt("return");
            case 9:
              if (!(!_this29.form.age || _this29.form.age <= 0)) {
                _context11.next = 12;
                break;
              }
              uni.showToast({
                title: '请输入有效的年龄',
                icon: 'none'
              });
              return _context11.abrupt("return");
            case 12:
              if (_this29.form.identity) {
                _context11.next = 15;
                break;
              }
              uni.showToast({
                title: '请选择身份',
                icon: 'none'
              });
              return _context11.abrupt("return");
            case 15:
              if (_this29.form.visitType) {
                _context11.next = 18;
                break;
              }
              uni.showToast({
                title: '请选择接诊类型',
                icon: 'none'
              });
              return _context11.abrupt("return");
            case 18:
              if (!(_this29.form.visitType === 'outcall' && (!_this29.form.injuryLocation || _this29.form.injuryLocation.trim() === ''))) {
                _context11.next = 21;
                break;
              }
              uni.showToast({
                title: '出诊时需填写受伤地点',
                icon: 'none'
              });
              return _context11.abrupt("return");
            case 21:
              if (!(!_this29.form.chiefComplaint || _this29.form.chiefComplaint.trim() === '')) {
                _context11.next = 24;
                break;
              }
              uni.showToast({
                title: '请输入主诉',
                icon: 'none'
              });
              return _context11.abrupt("return");
            case 24:
              if (!(!_this29.form.diseaseName || _this29.form.diseaseName.trim() === '')) {
                _context11.next = 27;
                break;
              }
              uni.showToast({
                title: '请输入疾病名称',
                icon: 'none'
              });
              return _context11.abrupt("return");
            case 27:
              if (!(!_this29.form.diagnosis || _this29.form.diagnosis.trim() === '')) {
                _context11.next = 30;
                break;
              }
              uni.showToast({
                title: '请输入诊断',
                icon: 'none'
              });
              return _context11.abrupt("return");
            case 30:
              if (!(!_this29.form.treatment || _this29.form.treatment.trim() === '')) {
                _context11.next = 33;
                break;
              }
              uni.showToast({
                title: '请输入处置措施',
                icon: 'none'
              });
              return _context11.abrupt("return");
            case 33:
              // 用药信息为选填：仅当选择了药材且数量>0时，才视为用药登记
              // 优先检查处方列表，如果有处方列表，使用处方列表；否则使用单个药品
              hasValidDrugUsage = false;
              drugItems = []; // 需要提交的药品列表
              // 优先使用处方列表
              if (!(_this29.prescriptionList && _this29.prescriptionList.length > 0)) {
                _context11.next = 51;
                break;
              }
              _loop = /*#__PURE__*/_regenerator.default.mark(function _loop(i) {
                var item, _drugRes$result, _drugRes$result2, _drugRes$result3, drugRes, _drugRes$result4, _drugRes$result5, errorMsg, drug, batchRes, locationName, _errorMsg, batches, totalStock, batch;
                return _regenerator.default.wrap(function _loop$(_context10) {
                  while (1) {
                    switch (_context10.prev = _context10.next) {
                      case 0:
                        item = _this29.prescriptionList[i];
                        if (!(!item.drugId || !item.quantity || item.quantity <= 0)) {
                          _context10.next = 3;
                          break;
                        }
                        return _context10.abrupt("return", "continue");
                      case 3:
                        _context10.prev = 3;
                        console.log('🔍 [提交处方] 获取药品详细信息:', {
                          drugId: item.drugId,
                          drugName: item.drugName,
                          index: i
                        });
                        _context10.next = 7;
                        return wx.cloud.callFunction({
                          name: 'drugManage',
                          data: {
                            action: 'getDetail',
                            data: {
                              id: item.drugId
                            }
                          }
                        });
                      case 7:
                        drugRes = _context10.sent;
                        console.log('📦 [提交处方] 药品信息查询结果:', {
                          success: (_drugRes$result = drugRes.result) === null || _drugRes$result === void 0 ? void 0 : _drugRes$result.success,
                          hasData: !!((_drugRes$result2 = drugRes.result) !== null && _drugRes$result2 !== void 0 && _drugRes$result2.data),
                          error: (_drugRes$result3 = drugRes.result) === null || _drugRes$result3 === void 0 ? void 0 : _drugRes$result3.error
                        });
                        if (!(!drugRes.result.success || !drugRes.result.data)) {
                          _context10.next = 19;
                          break;
                        }
                        uni.hideLoading();
                        _this29.submitting = false;

                        // 提供更详细的错误信息
                        errorMsg = "\u836F\u54C1".concat(item.drugName || '', "\u4FE1\u606F\u83B7\u53D6\u5931\u8D25");
                        if ((_drugRes$result4 = drugRes.result) !== null && _drugRes$result4 !== void 0 && _drugRes$result4.error) {
                          errorMsg += "\n\n\u9519\u8BEF\u8BE6\u60C5: ".concat(drugRes.result.error);
                        }
                        if (!item.drugId) {
                          errorMsg += "\n\n\u53EF\u80FD\u539F\u56E0: \u836F\u54C1ID\u4E3A\u7A7A";
                        } else {
                          errorMsg += "\n\n\u836F\u54C1ID: ".concat(item.drugId);
                        }
                        errorMsg += "\n\n\u5EFA\u8BAE: \u8BF7\u91CD\u65B0\u9009\u62E9\u8BE5\u836F\u54C1\u540E\u518D\u6DFB\u52A0\u5230\u5904\u65B9";
                        console.error('❌ [提交处方] 药品信息获取失败:', {
                          drugId: item.drugId,
                          drugName: item.drugName,
                          error: (_drugRes$result5 = drugRes.result) === null || _drugRes$result5 === void 0 ? void 0 : _drugRes$result5.error
                        });
                        uni.showModal({
                          title: '药品信息获取失败',
                          content: errorMsg,
                          showCancel: false,
                          confirmText: '知道了'
                        });
                        return _context10.abrupt("return", {
                          v: void 0
                        });
                      case 19:
                        drug = drugRes.result.data; // 获取批次信息
                        console.log('🔍 [提交处方] 获取批次信息:', {
                          drugId: item.drugId,
                          drugName: item.drugName,
                          location: _this29.form.location,
                          locationName: _this29.form.location === 'land_park' ? '陆园' : '水园'
                        });
                        _context10.next = 23;
                        return wx.cloud.callFunction({
                          name: 'stockManage',
                          data: {
                            action: 'getBatchesByDrugId',
                            data: {
                              drugId: item.drugId,
                              location: _this29.form.location,
                              enableFIFO: true
                            }
                          }
                        });
                      case 23:
                        batchRes = _context10.sent;
                        console.log('📦 [提交处方] 批次查询结果:', {
                          success: batchRes.result.success,
                          dataLength: batchRes.result.data ? batchRes.result.data.length : 0,
                          message: batchRes.result.message
                        });
                        if (!(!batchRes.result.success || !batchRes.result.data || batchRes.result.data.length === 0)) {
                          _context10.next = 34;
                          break;
                        }
                        // 提供更详细的错误信息
                        locationName = _this29.form.location === 'land_park' ? '陆园' : '水园';
                        _errorMsg = "\u836F\u54C1".concat(item.drugName || '', "\u5F53\u524D\u5E93\u5B58\u53D6\u8D27\u5931\u8D25");
                        if (!batchRes.result.success) {
                          _errorMsg += "\n\n\u5931\u8D25\u539F\u56E0: ".concat(batchRes.result.message || '查询失败');
                        } else if (!batchRes.result.data || batchRes.result.data.length === 0) {
                          _errorMsg += "\n\n\u5931\u8D25\u539F\u56E0: ".concat(locationName, "\u6682\u65E0\u5E93\u5B58");
                          _errorMsg += "\n\n\u5EFA\u8BAE: \u8BF7\u68C0\u67E5\u8BE5\u836F\u54C1\u662F\u5426\u5DF2\u5165\u5E93\u5230".concat(locationName);
                        }
                        console.error('❌ [提交处方] 批次获取失败:', _errorMsg);
                        uni.hideLoading();
                        _this29.submitting = false;
                        uni.showModal({
                          title: '库存获取失败',
                          content: _errorMsg,
                          showCancel: false,
                          confirmText: '知道了'
                        });
                        return _context10.abrupt("return", {
                          v: void 0
                        });
                      case 34:
                        batches = batchRes.result.data;
                        totalStock = batches.reduce(function (sum, b) {
                          return sum + b.quantity;
                        }, 0);
                        batch = item.batchId ? batches.find(function (b) {
                          return b._id === item.batchId;
                        }) || batches[0] : batches[0]; // 验证库存
                        if (!(item.quantity > totalStock)) {
                          _context10.next = 42;
                          break;
                        }
                        uni.hideLoading();
                        _this29.submitting = false;
                        uni.showToast({
                          title: "".concat(item.drugName || '', "\u5E93\u5B58\u4E0D\u8DB3\uFF0C\u6700\u591A").concat(totalStock).concat(drug.minUnit || item.unit),
                          icon: 'none',
                          duration: 3000
                        });
                        return _context10.abrupt("return", {
                          v: void 0
                        });
                      case 42:
                        // 添加到药品列表
                        drugItems.push({
                          drugId: item.drugId,
                          drugName: item.drugName || drug.name,
                          specification: item.specification || drug.specification,
                          quantity: Math.floor(item.quantity),
                          unit: item.unit || drug.minUnit,
                          batchId: batch._id,
                          batch: batch.batch,
                          drug: drug
                        });
                        _context10.next = 52;
                        break;
                      case 45:
                        _context10.prev = 45;
                        _context10.t0 = _context10["catch"](3);
                        console.error("\u83B7\u53D6\u836F\u54C1".concat(item.drugName, "\u4FE1\u606F\u5931\u8D25:"), _context10.t0);
                        uni.hideLoading();
                        _this29.submitting = false;
                        uni.showToast({
                          title: "\u83B7\u53D6".concat(item.drugName || '', "\u4FE1\u606F\u5931\u8D25"),
                          icon: 'none'
                        });
                        return _context10.abrupt("return", {
                          v: void 0
                        });
                      case 52:
                      case "end":
                        return _context10.stop();
                    }
                  }
                }, _loop, null, [[3, 45]]);
              });
              i = 0;
            case 38:
              if (!(i < _this29.prescriptionList.length)) {
                _context11.next = 48;
                break;
              }
              return _context11.delegateYield(_loop(i), "t0", 40);
            case 40:
              _ret = _context11.t0;
              if (!(_ret === "continue")) {
                _context11.next = 43;
                break;
              }
              return _context11.abrupt("continue", 45);
            case 43:
              if (!((0, _typeof2.default)(_ret) === "object")) {
                _context11.next = 45;
                break;
              }
              return _context11.abrupt("return", _ret.v);
            case 45:
              i++;
              _context11.next = 38;
              break;
            case 48:
              hasValidDrugUsage = drugItems.length > 0;
              _context11.next = 65;
              break;
            case 51:
              if (!_this29.selectedDrug) {
                _context11.next = 65;
                break;
              }
              if (!(_this29.form.quantity && _this29.form.quantity > 0)) {
                _context11.next = 60;
                break;
              }
              if (!(_this29.form.quantity > _this29.availableStock)) {
                _context11.next = 56;
                break;
              }
              uni.showToast({
                title: "\u5E93\u5B58\u4E0D\u8DB3\uFF0C\u6700\u591A".concat(_this29.availableStock).concat(_this29.selectedDrug.minUnit),
                icon: 'none',
                duration: 3000
              });
              return _context11.abrupt("return");
            case 56:
              drugItems.push({
                drugId: _this29.form.drugId,
                drugName: _this29.selectedDrug.name,
                specification: _this29.selectedDrug.specification,
                quantity: Math.floor(_this29.form.quantity),
                unit: _this29.getRealMinUnit(_this29.selectedDrug),
                batchId: _this29.selectedBatch._id,
                batch: _this29.selectedBatch.batch,
                drug: _this29.selectedDrug
              });
              hasValidDrugUsage = true;
              _context11.next = 65;
              break;
            case 60:
              // 选择了药材但未填写有效数量，视为本次不登记用药，清空用药相关状态
              _this29.form.drugId = '';
              _this29.form.quantity = null;
              _this29.selectedDrug = null;
              _this29.selectedBatch = null;
              _this29.availableStock = 0;
            case 65:
              _this29.submitting = true;
              uni.showLoading({
                title: '保存中...'
              });
              _context11.prev = 67;
              // 准备基础数据
              baseData = {
                visitDateTime: _this29.form.visitDateTime,
                name: _this29.form.name.trim(),
                gender: _this29.form.gender,
                age: _this29.form.age,
                identity: _this29.form.identity,
                location: _this29.form.location,
                // 园区（陆园/水园）
                visitType: _this29.form.visitType,
                isOutcall: _this29.form.visitType === 'outcall',
                injuryLocation: _this29.form.injuryLocation.trim(),
                chiefComplaint: _this29.form.chiefComplaint.trim(),
                diseaseName: _this29.form.diseaseName.trim(),
                diagnosis: _this29.form.diagnosis.trim(),
                treatment: _this29.form.treatment.trim(),
                remark: _this29.form.remark.trim()
              }; // 如果有多个药品，需要为每个药品创建一条记录
              if (!(drugItems.length > 1)) {
                _context11.next = 110;
                break;
              }
              // 多个药品：为每个药品创建一条门诊记录
              successCount = 0;
              failCount = 0;
              _i7 = 0;
            case 73:
              if (!(_i7 < drugItems.length)) {
                _context11.next = 107;
                break;
              }
              item = drugItems[_i7];
              submitData = _objectSpread({}, baseData); // 设置药品信息
              realMinUnit = item.unit || item.drug.minUnit; // 确保quantityMin是数字类型且大于0
              quantityMin = Math.floor(Number(item.quantity)) || 0;
              if (!(quantityMin <= 0)) {
                _context11.next = 82;
                break;
              }
              console.warn("\u836F\u54C1".concat(item.drugName, "\u7684\u6570\u91CF\u65E0\u6548:"), item.quantity);
              failCount++;
              return _context11.abrupt("continue", 104);
            case 82:
              submitData.drugId = item.drugId;
              submitData.drugName = item.drugName;
              submitData.specification = item.specification || item.drug.specification;
              submitData.batchId = item.batchId;
              submitData.quantityMin = quantityMin; // 确保是数字类型
              submitData.minUnit = realMinUnit;
              submitData.packUnit = item.drug.packUnit || item.drug.unit;
              submitData.conversionRate = item.drug.conversionRate || 1;
              submitData.patient = _this29.form.name.trim();
              submitData.symptom = (_this29.form.symptom || _this29.form.chiefComplaint || '').trim();

              // 构建drugInfo（使用quantityMin而不是item.quantity）
              submitData.drugInfo = "".concat(item.drugName, " ").concat(quantityMin).concat(realMinUnit);
              _context11.prev = 93;
              _context11.next = 96;
              return wx.cloud.callFunction({
                name: 'clinicRecords',
                data: {
                  action: 'add',
                  data: submitData
                }
              });
            case 96:
              res = _context11.sent;
              if (res.result.success) {
                successCount++;
              } else {
                failCount++;
                console.error("\u836F\u54C1".concat(item.drugName, "\u63D0\u4EA4\u5931\u8D25:"), res.result.error);
              }
              _context11.next = 104;
              break;
            case 100:
              _context11.prev = 100;
              _context11.t1 = _context11["catch"](93);
              failCount++;
              console.error("\u836F\u54C1".concat(item.drugName, "\u63D0\u4EA4\u5F02\u5E38:"), _context11.t1);
            case 104:
              _i7++;
              _context11.next = 73;
              break;
            case 107:
              if (failCount > 0) {
                uni.showToast({
                  title: "\u90E8\u5206\u836F\u54C1\u63D0\u4EA4\u5931\u8D25(".concat(successCount, "/").concat(drugItems.length, ")"),
                  icon: 'none',
                  duration: 3000
                });
              } else {
                // 提示保存为模板
                _this29.promptSaveTemplate();
                if (_this29.continueAfterSubmit) {
                  uni.showToast({
                    title: '登记成功，可继续登记',
                    icon: 'success',
                    duration: 2000
                  });
                  setTimeout(function () {
                    _this29.resetForm();
                    uni.pageScrollTo({
                      scrollTop: 0,
                      duration: 300
                    });
                  }, 800);
                } else {
                  uni.showToast({
                    title: '登记成功',
                    icon: 'success'
                  });
                  setTimeout(function () {
                    _this29.resetForm();
                    uni.navigateBack();
                  }, 1500);
                }
              }
              _context11.next = 141;
              break;
            case 110:
              if (!(drugItems.length === 1)) {
                _context11.next = 137;
                break;
              }
              // 单个药品：使用原有逻辑
              _item = drugItems[0];
              _submitData = _objectSpread({}, baseData);
              _realMinUnit = _item.unit || _item.drug.minUnit; // 确保quantityMin是数字类型且大于0
              _quantityMin = Math.floor(Number(_item.quantity)) || 0;
              if (!(_quantityMin <= 0)) {
                _context11.next = 120;
                break;
              }
              uni.showToast({
                title: '药品数量无效',
                icon: 'none'
              });
              _this29.submitting = false;
              uni.hideLoading();
              return _context11.abrupt("return");
            case 120:
              _submitData.drugId = _item.drugId;
              _submitData.drugName = _item.drugName;
              _submitData.specification = _item.specification || _item.drug.specification;
              _submitData.batchId = _item.batchId;
              _submitData.quantityMin = _quantityMin; // 确保是数字类型
              _submitData.minUnit = _realMinUnit;
              _submitData.packUnit = _item.drug.packUnit || _item.drug.unit;
              _submitData.conversionRate = _item.drug.conversionRate || 1;
              _submitData.patient = _this29.form.name.trim();
              _submitData.symptom = (_this29.form.symptom || _this29.form.chiefComplaint || '').trim();
              _submitData.drugInfo = {
                drugId: _item.drugId,
                drugCode: _item.drug.drugCode || _item.drug.code || '',
                drugName: _item.drugName,
                specification: _item.specification || _item.drug.specification,
                unit: _realMinUnit,
                quantity: _item.quantity,
                batchId: _item.batchId,
                batch: _item.batch,
                location: _this29.form.location,
                minUnit: _realMinUnit,
                packUnit: _item.drug.packUnit || _item.drug.unit,
                conversionRate: _item.drug.conversionRate || 1
              };
              _context11.next = 133;
              return wx.cloud.callFunction({
                name: 'clinicRecords',
                data: {
                  action: 'add',
                  data: _submitData
                }
              });
            case 133:
              _res = _context11.sent;
              if (_res.result.success) {
                // 提示保存为模板
                _this29.promptSaveTemplate();
                if (_this29.continueAfterSubmit) {
                  uni.showToast({
                    title: '登记成功，可继续登记',
                    icon: 'success',
                    duration: 2000
                  });
                  setTimeout(function () {
                    _this29.resetForm();
                    uni.pageScrollTo({
                      scrollTop: 0,
                      duration: 300
                    });
                  }, 800);
                } else {
                  uni.showToast({
                    title: '登记成功',
                    icon: 'success'
                  });
                  setTimeout(function () {
                    _this29.resetForm();
                    uni.navigateBack();
                  }, 1500);
                }
              } else {
                uni.showToast({
                  title: _res.result.error || '登记失败',
                  icon: 'none'
                });
              }
              _context11.next = 141;
              break;
            case 137:
              _context11.next = 139;
              return wx.cloud.callFunction({
                name: 'clinicRecords',
                data: {
                  action: 'add',
                  data: baseData
                }
              });
            case 139:
              _res2 = _context11.sent;
              if (_res2.result.success) {
                // 提示保存为模板
                _this29.promptSaveTemplate();
                if (_this29.continueAfterSubmit) {
                  uni.showToast({
                    title: '登记成功，可继续登记',
                    icon: 'success',
                    duration: 2000
                  });
                  setTimeout(function () {
                    _this29.resetForm();
                    uni.pageScrollTo({
                      scrollTop: 0,
                      duration: 300
                    });
                  }, 800);
                } else {
                  uni.showToast({
                    title: '登记成功',
                    icon: 'success'
                  });
                  setTimeout(function () {
                    _this29.resetForm();
                    uni.navigateBack();
                  }, 1500);
                }
              } else {
                uni.showToast({
                  title: _res2.result.error || '登记失败',
                  icon: 'none'
                });
              }
            case 141:
              _context11.next = 147;
              break;
            case 143:
              _context11.prev = 143;
              _context11.t2 = _context11["catch"](67);
              console.error('登记失败:', _context11.t2);
              uni.showToast({
                title: '登记失败',
                icon: 'none'
              });
            case 147:
              _context11.prev = 147;
              _this29.submitting = false;
              uni.hideLoading();
              return _context11.finish(147);
            case 151:
            case "end":
              return _context11.stop();
          }
        }
      }, _callee10, null, [[67, 143, 147, 151], [93, 100]]);
    }))();
  }), (0, _defineProperty2.default)(_methods, "resetForm", function resetForm() {
    // 保留当前园区选择，其他信息全部重置
    var currentLocation = this.form.location || '';

    // 更新时间（就诊时间始终为当前时间）
    this.updateDateTime();

    // 逐字段重置，避免整体替换对象可能带来的响应式问题
    this.form.name = '';
    this.form.gender = '男';
    this.form.age = null;
    this.form.identity = '游客';
    this.form.location = currentLocation; // 保留园区选择
    this.form.visitType = 'clinic';
    this.form.injuryLocation = '';
    this.form.chiefComplaint = '';
    this.form.symptom = '';
    this.standardizedSymptoms = [];
    this.form.diseaseName = '';
    this.form.diagnosis = '';
    this.form.treatment = '';
    this.form.drugId = '';
    this.form.quantity = null;
    this.form.remark = '';
    this.form.doctorSign = '';
    this.form.signTime = '';

    // 更新签名组件key，强制重新渲染签名组件
    this.signatureKey = Date.now();

    // 用药与库存相关状态
    this.selectedDrug = null;
    this.selectedBatch = null;
    this.availableStock = 0;
    this.convertedQuantity = null;
    this.drugSearchText = '';
    this.filteredDrugs = [];
    this.showDrugList = false;

    // 重置处方相关状态
    this.prescriptionList = [];
    this.enablePrescription = false;
    this.prescriptionNo = '';
    this.currentDrug = {
      dosage: '',
      frequency: '',
      route: '',
      usage: ''
    };
    this.frequencyIndex = 0;
    this.routeIndex = 0;

    // 疾病/模板/下拉相关状态
    this.filteredDiseases = [];
    this.showDiseaseList = false;
    this.filteredDiagnosis = [];
    this.showDiagnosisList = false;
    this.filteredTreatments = [];
    this.showTreatmentList = false;
    this.filteredComplaints = [];
    this.showComplaintList = false;
    this.complaintSelectedMode = false; // 重置主诉编辑模式
    // 症状相关状态
    this.filteredSymptoms = [];
    this.showSymptomList = false;
    this.standardizedSymptoms = [];
    // 清理计时器
    if (this.symptomInputTimer) {
      clearTimeout(this.symptomInputTimer);
      this.symptomInputTimer = null;
    }
    if (this.fetchHvSuggestionTimer) {
      clearTimeout(this.fetchHvSuggestionTimer);
      this.fetchHvSuggestionTimer = null;
    }
    if (this.diseaseInputTimer) {
      clearTimeout(this.diseaseInputTimer);
      this.diseaseInputTimer = null;
    }
    if (this.diagnosisInputTimer) {
      clearTimeout(this.diagnosisInputTimer);
      this.diagnosisInputTimer = null;
    }
    if (this.complaintInputTimer) {
      clearTimeout(this.complaintInputTimer);
      this.complaintInputTimer = null;
    }
    if (this.complaintFocusTimer) {
      clearTimeout(this.complaintFocusTimer);
      this.complaintFocusTimer = null;
    }
  }), (0, _defineProperty2.default)(_methods, "formatDate", function formatDate(dateStr) {
    if (!dateStr) return '';
    var date = new Date(dateStr);
    var year = date.getFullYear();
    var month = String(date.getMonth() + 1).padStart(2, '0');
    var day = String(date.getDate()).padStart(2, '0');
    return "".concat(year, "-").concat(month, "-").concat(day);
  }), (0, _defineProperty2.default)(_methods, "toggleContinue", function toggleContinue() {
    this.continueAfterSubmit = !this.continueAfterSubmit;

    // 保存用户偏好
    try {
      uni.setStorageSync('clinic_continue_mode', this.continueAfterSubmit);
    } catch (err) {
      console.error('保存连续登记设置失败:', err);
    }
    uni.showToast({
      title: this.continueAfterSubmit ? '已开启连续登记' : '已关闭连续登记',
      icon: 'none',
      duration: 1500
    });
  }), (0, _defineProperty2.default)(_methods, "goBack", function goBack() {
    uni.navigateBack();
  }), (0, _defineProperty2.default)(_methods, "generateDailyReport", function generateDailyReport() {
    var _this30 = this;
    return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee11() {
      var today, year, month, day, dateStr, location, locationName, records, res, report, stats, tableData, reportDate;
      return _regenerator.default.wrap(function _callee11$(_context12) {
        while (1) {
          switch (_context12.prev = _context12.next) {
            case 0:
              _context12.prev = 0;
              uni.showLoading({
                title: '生成中...'
              });

              // 获取当前日期和园区
              today = new Date();
              year = today.getFullYear();
              month = String(today.getMonth() + 1).padStart(2, '0');
              day = String(today.getDate()).padStart(2, '0');
              dateStr = "".concat(year, "-").concat(month, "-").concat(day); // 必须先选择就诊园区
              location = _this30.form.location;
              if (!(!location || location !== 'land_park' && location !== 'water_park')) {
                _context12.next = 13;
                break;
              }
              uni.hideLoading();
              uni.showToast({
                title: '请选择就诊园区',
                icon: 'none'
              });
              // 如有需要，可同时弹出园区选择提示
              _this30.showLocationTip = true;
              return _context12.abrupt("return");
            case 13:
              locationName = location === 'land_park' ? '陆园' : '水园'; // 查询当日的所有门诊记录
              // 查询 clinic_records 集合（完整门诊登记信息）
              records = [];
              _context12.prev = 15;
              _context12.next = 18;
              return wx.cloud.callFunction({
                name: 'clinicRecords',
                data: {
                  action: 'list',
                  data: {
                    location: location,
                    startDate: dateStr,
                    endDate: dateStr,
                    pageSize: 1000,
                    useClinicRecords: true // 查询完整的门诊登记记录
                  }
                }
              });
            case 18:
              res = _context12.sent;
              if (res.result && res.result.success && res.result.data && res.result.data.list) {
                records = res.result.data.list;
              }
              _context12.next = 25;
              break;
            case 22:
              _context12.prev = 22;
              _context12.t0 = _context12["catch"](15);
              console.error('查询门诊记录失败:', _context12.t0);
            case 25:
              if (!(records.length === 0)) {
                _context12.next = 29;
                break;
              }
              uni.hideLoading();
              uni.showToast({
                title: '当日无门诊记录',
                icon: 'none',
                duration: 2000
              });
              return _context12.abrupt("return");
            case 29:
              // 生成文档和统计信息
              report = _this30.formatDailyReport(records, dateStr, locationName);
              stats = _this30.calculateStats(records); // 准备详细的表格数据
              tableData = _this30.prepareTableData(records);
              uni.hideLoading();

              // 跳转到日报显示页面
              reportDate = "".concat(year, "\u5E74").concat(month, "\u6708").concat(day, "\u65E5");
              uni.navigateTo({
                url: "/pages-sub/report/daily?content=".concat(encodeURIComponent(report), "&date=").concat(encodeURIComponent(reportDate), "&location=").concat(encodeURIComponent(locationName), "&stats=").concat(encodeURIComponent(JSON.stringify(stats)), "&tableData=").concat(encodeURIComponent(JSON.stringify(tableData))),
                fail: function fail(err) {
                  console.error('跳转失败:', err);
                  // 如果跳转失败，复制到剪贴板
                  uni.setClipboardData({
                    data: report,
                    success: function success() {
                      uni.showToast({
                        title: '已复制到剪贴板',
                        icon: 'success'
                      });
                    }
                  });
                }
              });
              _context12.next = 42;
              break;
            case 37:
              _context12.prev = 37;
              _context12.t1 = _context12["catch"](0);
              console.error('生成日报失败:', _context12.t1);
              uni.hideLoading();
              uni.showToast({
                title: '生成失败：' + (_context12.t1.message || '未知错误'),
                icon: 'none',
                duration: 3000
              });
            case 42:
            case "end":
              return _context12.stop();
          }
        }
      }, _callee11, null, [[0, 37], [15, 22]]);
    }))();
  }), (0, _defineProperty2.default)(_methods, "formatDailyReport", function formatDailyReport(records, dateStr, locationName) {
    // 解析日期
    var date = new Date(dateStr);
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var dateFormatted = "".concat(year, "\u5E74").concat(month, "\u6708").concat(day, "\u65E5");

    // 统计信息
    var stats = {
      total: records.length,
      visitor: [],
      employee: [],
      outcall: []
    };

    // 按身份和疾病分类统计
    records.forEach(function (record) {
      var identity = record.identity || '游客';
      var diseaseName = record.diseaseName || '未知';
      var injuryLocation = record.injuryLocation || '';
      var isOutcall = record.isOutcall || record.visitType === 'outcall';
      if (isOutcall && injuryLocation) {
        // 统计出诊
        var existing = stats.outcall.find(function (item) {
          return item.location === injuryLocation;
        });
        if (existing) {
          existing.count++;
        } else {
          stats.outcall.push({
            location: injuryLocation,
            count: 1
          });
        }
      }
      if (identity === '游客') {
        // 游客统计
        var _existing = stats.visitor.find(function (item) {
          return item.disease === diseaseName;
        });
        if (_existing) {
          if (injuryLocation && injuryLocation.trim()) {
            var loc = _existing.locations.find(function (l) {
              return l.name === injuryLocation;
            });
            if (loc) {
              loc.count++;
            } else {
              _existing.locations.push({
                name: injuryLocation,
                count: 1
              });
            }
          }
          _existing.total++;
        } else {
          stats.visitor.push({
            disease: diseaseName,
            total: 1,
            locations: injuryLocation && injuryLocation.trim() ? [{
              name: injuryLocation,
              count: 1
            }] : []
          });
        }
      } else if (identity === '员工') {
        // 员工统计
        var _existing2 = stats.employee.find(function (item) {
          return item.disease === diseaseName;
        });
        if (_existing2) {
          _existing2.total++;
        } else {
          stats.employee.push({
            disease: diseaseName,
            total: 1
          });
        }
      }
    });

    // 生成文档内容
    var report = "".concat(dateFormatted, "\u6B22\u4E50\u8C37\u533B\u52A1\u5BA4\uFF08").concat(locationName, "\uFF09\u5F53\u65E5\u63A5\u8BCA").concat(stats.total, "\u4EBA\u3002\n");

    // 游客统计
    if (stats.visitor.length > 0) {
      var visitorTotal = stats.visitor.reduce(function (sum, item) {
        return sum + item.total;
      }, 0);
      report += "\u6E38\u5BA2".concat(visitorTotal, "\u4EBA\uFF1A");
      var visitorParts = [];
      stats.visitor.forEach(function (item) {
        if (item.locations && item.locations.length > 0) {
          // 有地点的疾病：疾病X人（地点1X人，地点2X人）
          var locationParts = item.locations.map(function (loc) {
            return "".concat(loc.name).concat(loc.count, "\u4EBA");
          });
          visitorParts.push("".concat(item.disease).concat(item.total, "\u4EBA\uFF08").concat(locationParts.join('，'), "\uFF09"));
        } else {
          // 无地点的疾病：疾病X人
          visitorParts.push("".concat(item.disease).concat(item.total, "\u4EBA"));
        }
      });
      report += visitorParts.join('，') + '。\n';
    }

    // 员工统计
    if (stats.employee.length > 0) {
      var employeeTotal = stats.employee.reduce(function (sum, item) {
        return sum + item.total;
      }, 0);
      report += "\u5458\u5DE5".concat(employeeTotal, "\u4EBA\uFF1A");
      var employeeParts = stats.employee.map(function (item) {
        return "".concat(item.disease).concat(item.total, "\u4EBA");
      });
      report += employeeParts.join('，') + '。\n';
    }

    // 出诊统计
    if (stats.outcall.length > 0) {
      var outcallTotal = stats.outcall.reduce(function (sum, item) {
        return sum + item.count;
      }, 0);
      report += "\u51FA\u8BCA".concat(outcallTotal, "\u6B21\uFF1A");
      var outcallParts = stats.outcall.map(function (item) {
        return "".concat(item.location).concat(item.count, "\u6B21");
      });
      report += outcallParts.join('，') + '。\n';
    }
    return report.trim();
  }), (0, _defineProperty2.default)(_methods, "calculateStats", function calculateStats(records) {
    var stats = {
      total: records.length,
      visitorTotal: 0,
      employeeTotal: 0,
      outcallTotal: 0
    };
    records.forEach(function (record) {
      var identity = record.identity || '游客';
      var isOutcall = record.isOutcall || record.visitType === 'outcall';
      if (identity === '游客') {
        stats.visitorTotal++;
      } else if (identity === '员工') {
        stats.employeeTotal++;
      }
      if (isOutcall) {
        stats.outcallTotal++;
      }
    });
    return stats;
  }), (0, _defineProperty2.default)(_methods, "prepareTableData", function prepareTableData(records) {
    var visitorData = [];
    var employeeData = [];
    var doctorName = '';
    try {
      var userInfo = uni.getStorageSync('userInfo');
      doctorName = (userInfo === null || userInfo === void 0 ? void 0 : userInfo.name) || '';
    } catch (err) {
      console.error('获取用户信息失败:', err);
    }
    records.forEach(function (record) {
      var identity = record.identity || '游客';
      var diseaseName = record.diseaseName || record.diagnosis || record.chiefComplaint || '未知';
      var data = {
        name: record.name || '',
        diseaseName: diseaseName,
        location: record.injuryLocation || '',
        visitTime: record.visitDateTime || record.createTime || '',
        isOutcall: record.isOutcall || record.visitType === 'outcall',
        doctorName: doctorName
      };
      if (identity === '游客') {
        visitorData.push(data);
      } else if (identity === '员工') {
        employeeData.push(data);
      }
    });
    return {
      visitor: visitorData,
      employee: employeeData
    };
  }), _methods)
};
exports.default = _default;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 2)["default"], __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/wx.js */ 1)["default"]))

/***/ }),

/***/ 437:
/*!****************************************************************************************************!*\
  !*** D:/AK-PMS/pages-sub/clinic/add.vue?vue&type=style&index=0&id=0904e2e0&lang=scss&scoped=true& ***!
  \****************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_2_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_5_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_add_vue_vue_type_style_index_0_id_0904e2e0_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../HBuilderX/HBuilderX/plugins/uniapp-cli/node_modules/mini-css-extract-plugin/dist/loader.js??ref--8-oneOf-1-0!../../../HBuilderX/HBuilderX/plugins/uniapp-cli/node_modules/css-loader/dist/cjs.js??ref--8-oneOf-1-1!../../../HBuilderX/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/stylePostLoader.js!../../../HBuilderX/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--8-oneOf-1-2!../../../HBuilderX/HBuilderX/plugins/uniapp-cli/node_modules/postcss-loader/src??ref--8-oneOf-1-3!../../../HBuilderX/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/sass-loader/dist/cjs.js??ref--8-oneOf-1-4!../../../HBuilderX/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--8-oneOf-1-5!../../../HBuilderX/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../HBuilderX/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./add.vue?vue&type=style&index=0&id=0904e2e0&lang=scss&scoped=true& */ 438);
/* harmony import */ var _HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_2_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_5_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_add_vue_vue_type_style_index_0_id_0904e2e0_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_2_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_5_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_add_vue_vue_type_style_index_0_id_0904e2e0_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_2_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_5_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_add_vue_vue_type_style_index_0_id_0904e2e0_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_2_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_5_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_add_vue_vue_type_style_index_0_id_0904e2e0_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_2_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_5_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_add_vue_vue_type_style_index_0_id_0904e2e0_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ 438:
/*!********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js??ref--8-oneOf-1-0!./node_modules/css-loader/dist/cjs.js??ref--8-oneOf-1-1!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--8-oneOf-1-2!./node_modules/postcss-loader/src??ref--8-oneOf-1-3!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/sass-loader/dist/cjs.js??ref--8-oneOf-1-4!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--8-oneOf-1-5!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!D:/AK-PMS/pages-sub/clinic/add.vue?vue&type=style&index=0&id=0904e2e0&lang=scss&scoped=true& ***!
  \********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin
    if(false) { var cssReload; }
  

/***/ })

},[[431,"common/runtime","common/vendor"]]]);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages-sub/clinic/add.js.map