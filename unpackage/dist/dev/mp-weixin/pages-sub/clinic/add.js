(global["webpackJsonp"] = global["webpackJsonp"] || []).push([["pages-sub/clinic/add"],{

/***/ 398:
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
var _add = _interopRequireDefault(__webpack_require__(/*! ./pages-sub/clinic/add.vue */ 399));
// @ts-ignore
wx.__webpack_require_UNI_MP_PLUGIN__ = __webpack_require__;
createPage(_add.default);
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/wx.js */ 1)["default"], __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 2)["createPage"]))

/***/ }),

/***/ 399:
/*!******************************************!*\
  !*** D:/AK-PMS/pages-sub/clinic/add.vue ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _add_vue_vue_type_template_id_0904e2e0_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./add.vue?vue&type=template&id=0904e2e0&scoped=true& */ 400);
/* harmony import */ var _add_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./add.vue?vue&type=script&lang=js& */ 402);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _add_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _add_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var _add_vue_vue_type_style_index_0_id_0904e2e0_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./add.vue?vue&type=style&index=0&id=0904e2e0&lang=scss&scoped=true& */ 404);
/* harmony import */ var _F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/runtime/componentNormalizer.js */ 32);

var renderjs





/* normalize component */

var component = Object(_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
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

/***/ 400:
/*!*************************************************************************************!*\
  !*** D:/AK-PMS/pages-sub/clinic/add.vue?vue&type=template&id=0904e2e0&scoped=true& ***!
  \*************************************************************************************/
/*! exports provided: render, staticRenderFns, recyclableRender, components */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_add_vue_vue_type_template_id_0904e2e0_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--17-0!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-uni-app-loader/page-meta.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./add.vue?vue&type=template&id=0904e2e0&scoped=true& */ 401);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_add_vue_vue_type_template_id_0904e2e0_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_add_vue_vue_type_template_id_0904e2e0_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "recyclableRender", function() { return _F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_add_vue_vue_type_template_id_0904e2e0_scoped_true___WEBPACK_IMPORTED_MODULE_0__["recyclableRender"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "components", function() { return _F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_add_vue_vue_type_template_id_0904e2e0_scoped_true___WEBPACK_IMPORTED_MODULE_0__["components"]; });



/***/ }),

/***/ 401:
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
  var g3 = _vm.showDiseaseList && _vm.filteredDiseases.length > 0
  var g4 = _vm.showTreatmentList && _vm.filteredTreatments.length > 0
  var g5 = _vm.showDrugList && _vm.filteredDrugs.length > 0
  var g6 = g5 ? _vm.filteredDrugs.length : null
  var g7 =
    _vm.showDrugList && _vm.drugSearchText && _vm.filteredDrugs.length === 0
  var m0 = _vm.selectedBatch
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
        m0: m0,
      },
    }
  )
}
var recyclableRender = false
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ 402:
/*!*******************************************************************!*\
  !*** D:/AK-PMS/pages-sub/clinic/add.vue?vue&type=script&lang=js& ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_add_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!./node_modules/babel-loader/lib!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--13-1!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./add.vue?vue&type=script&lang=js& */ 403);
/* harmony import */ var _F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_add_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_add_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_add_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_add_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_add_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ 403:
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
var _asyncToGenerator2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ 36));
var _typeof2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/typeof */ 13));
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var Signature = function Signature() {
  __webpack_require__.e(/*! require.ensure | components/signature/index */ "components/signature/index").then((function () {
    return resolve(__webpack_require__(/*! @/components/signature/index.vue */ 427));
  }).bind(null, __webpack_require__)).catch(__webpack_require__.oe);
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
      // 药材搜索相关
      drugSearchText: '',
      allDrugs: [],
      filteredDrugs: [],
      showDrugList: false,
      // 疾病名称下拉列表
      diseaseOptions: ['感冒', '发烧', '头痛', '头晕', '咳嗽', '腹泻', '腹痛', '恶心呕吐', '外伤', '扭伤', '擦伤', '割伤', '烫伤', '中暑', '晕厥', '过敏', '皮疹', '咽喉痛', '牙痛', '关节痛', '腰痛', '胸闷', '心慌', '失眠', '其他'],
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
      // 下拉隐藏延迟计时器
      diseaseBlurTimer: null,
      complaintBlurTimer: null,
      diagnosisBlurTimer: null,
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
    }
  },
  onLoad: function onLoad() {
    var _this = this;
    this.updateDateTime();
    // 每分钟更新一次时间，并记录定时器 ID，便于卸载时清理
    this.dateTimeTimerId = setInterval(function () {
      _this.updateDateTime();
    }, 60000);

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
  },
  methods: {
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
      var _this2 = this;
      var index = [];

      // 1) 结构化模板库 diseaseTemplateLib
      Object.keys(this.diseaseTemplateLib || {}).forEach(function (disease) {
        var list = _this2.diseaseTemplateLib[disease] || [];
        list.forEach(function (tpl, idx) {
          if (tpl && tpl.complaint) {
            index.push({
              disease: disease,
              complaint: tpl.complaint,
              symptoms: tpl.symptoms || [],
              diagnoses: tpl.diagnoses || [],
              treatments: tpl.treatments || [],
              source: 'structured',
              idx: idx
            });
          }
        });
      });

      // 2) 旧版模板：complaintTemplates + diseaseTemplates + treatmentTemplates
      Object.keys(this.complaintTemplates || {}).forEach(function (disease) {
        var _this2$diseaseTemplat, _this2$treatmentTempl;
        var complaint = _this2.complaintTemplates[disease];
        var diagnoses = ((_this2$diseaseTemplat = _this2.diseaseTemplates) === null || _this2$diseaseTemplat === void 0 ? void 0 : _this2$diseaseTemplat[disease]) || [];
        var treatments = ((_this2$treatmentTempl = _this2.treatmentTemplates) === null || _this2$treatmentTempl === void 0 ? void 0 : _this2$treatmentTempl[disease]) || [];
        if (complaint) {
          index.push({
            disease: disease,
            complaint: complaint,
            symptoms: [],
            diagnoses: diagnoses,
            treatments: treatments,
            source: 'legacy'
          });
        }
      });

      // 3) 用户自定义模板 userDiseaseTemplates
      Object.keys(this.userDiseaseTemplates || {}).forEach(function (disease) {
        var userTpl = _this2.userDiseaseTemplates[disease];
        if (!userTpl) return;
        (userTpl.complaints || []).forEach(function (complaint, idx) {
          if (complaint) {
            index.push({
              disease: disease,
              complaint: complaint,
              symptoms: [],
              diagnoses: userTpl.diagnosis || [],
              treatments: userTpl.treatments || [],
              source: 'user',
              userIdx: idx
            });
          }
        });
      });
      this.templateIndex = index;
      console.log("\u6784\u5EFA\u6A21\u677F\u7D22\u5F15\u5B8C\u6210\uFF0C\u5171 ".concat(index.length, " \u6761\u8BB0\u5F55"));
    },
    // 全局搜索：多条件并列搜索(AND逻辑)，同时匹配疾病/主诉/诊断三个关键词
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

      // 多条件并列过滤：同时满足所有非空关键词
      var matchedRecords = this.templateIndex.filter(function (rec) {
        var match = true;

        // 疾病关键词匹配
        if (dKw) {
          match = match && rec.disease.toLowerCase().includes(dKw);
        }

        // 主诉关键词匹配
        if (cKw) {
          match = match && rec.complaint.toLowerCase().includes(cKw);
        }

        // 诊断关键词匹配
        if (dgKw) {
          match = match && (rec.diagnoses || []).some(function (d) {
            return d.toLowerCase().includes(dgKw);
          });
        }
        return match;
      });

      // 提取匹配的疾病、主诉、诊断（去重）
      var diseases = Array.from(new Set(matchedRecords.map(function (r) {
        return r.disease;
      })));
      var complaints = matchedRecords.map(function (r, idx) {
        return {
          key: "".concat(r.disease, "_").concat(idx),
          // 添加唯一 key
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
      return {
        diseases: diseases,
        complaints: complaints,
        diagnoses: diagnoses
      };
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
      var _this3 = this;
      var itemList = this.locations.map(function (l) {
        return l.label;
      });
      uni.showActionSheet({
        itemList: itemList,
        success: function success(res) {
          var idx = res.tapIndex;
          var target = _this3.locations[idx];
          if (target) {
            _this3.selectLocation(target.value);
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
      var _this4 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee() {
        var res;
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _context.next = 3;
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
                res = _context.sent;
                if (res.result.success) {
                  _this4.allDrugs = res.result.data.list || [];
                }
                _context.next = 10;
                break;
              case 7:
                _context.prev = 7;
                _context.t0 = _context["catch"](0);
                console.error('加载药材列表失败:', _context.t0);
              case 10:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[0, 7]]);
      }))();
    },
    // 药材输入框获得焦点
    onDrugInputFocus: function onDrugInputFocus() {
      var _this5 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2() {
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _this5.showDrugList = true;

                // 如果没有输入内容，显示当前园区的所有药材
                if (!_this5.drugSearchText || _this5.drugSearchText.trim() === '') {
                  // 没有输入内容，显示所有药材
                  _this5.filteredDrugs = _this5.allDrugs;
                } else {
                  _this5.onDrugSearch();
                }
              case 2:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }))();
    },
    // 加载当前园区的药材
    loadLocationDrugs: function loadLocationDrugs() {
      var _this6 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee3() {
        var res, stockList;
        return _regenerator.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.prev = 0;
                uni.showLoading({
                  title: '加载药材...'
                });
                _context3.next = 4;
                return wx.cloud.callFunction({
                  name: 'stockManage',
                  data: {
                    action: 'getStockList',
                    data: {
                      location: _this6.form.location,
                      pageSize: 1000
                    }
                  }
                });
              case 4:
                res = _context3.sent;
                uni.hideLoading();
                if (res.result.success) {
                  stockList = res.result.data.list || []; // 过滤出有库存的药材
                  _this6.filteredDrugs = stockList.filter(function (item) {
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
                  console.log("\u52A0\u8F7D\u4E86".concat(_this6.filteredDrugs.length, "\u79CD\u836F\u6750"));
                } else {
                  // 如果获取失败，显示所有药材
                  _this6.filteredDrugs = _this6.allDrugs.slice(0, 50);
                }
                _context3.next = 14;
                break;
              case 9:
                _context3.prev = 9;
                _context3.t0 = _context3["catch"](0);
                console.error('加载园区药材失败:', _context3.t0);
                uni.hideLoading();
                // 失败时显示所有药材
                _this6.filteredDrugs = _this6.allDrugs.slice(0, 50);
              case 14:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, null, [[0, 9]]);
      }))();
    },
    // 药材搜索
    onDrugSearch: function onDrugSearch() {
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
    },
    // 从列表选择药材
    selectDrugFromList: function selectDrugFromList(drug) {
      this.drugSearchText = drug.name;
      this.onDrugSelect(drug);
      this.showDrugList = false;
    },
    // 疾病名称获得焦点：显示下拉列表
    onDiseaseFocus: function onDiseaseFocus() {
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
    },
    onDiseaseBlur: function onDiseaseBlur() {
      var _this7 = this;
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
        _this7.showDiseaseList = false;
      }, 200);
    },
    // 疾病名称输入：触发全局搜索并联动主诉/诊断下拉
    onDiseaseInput: function onDiseaseInput() {
      var result = this.performGlobalSearch(this.form.diseaseName, this.form.chiefComplaint, this.form.diagnosis);
      this.filteredDiseases = result.diseases;
      this.filteredComplaints = result.complaints;
      this.filteredDiagnosis = result.diagnoses;
      this.showDiseaseList = this.filteredDiseases.length > 0;
      // 主诉和诊断下拉在用户聚焦时才显示，这里只更新数据
      // 如果当前输入的疾病名称与某个疾病完全匹配，则自动按该疾病刷新联动字段
      var kw = (this.form.diseaseName || '').trim();
      if (kw && this.filteredDiseases.includes(kw)) {
        this.selectDisease(kw);
      }
    },
    // 选择疾病：自动填充第一条匹配的主诉/诊断/处置
    selectDisease: function selectDisease(disease) {
      // 清除失焦隐藏计时器
      if (this.diseaseBlurTimer) {
        clearTimeout(this.diseaseBlurTimer);
        this.diseaseBlurTimer = null;
      }

      // 选择后关闭下拉
      this.showDiseaseList = false;

      // 查找该疾病的第一条模板记录
      var record = this.templateIndex.find(function (r) {
        return r.disease === disease;
      });
      if (record) {
        var mainDiagnosis = record.diagnoses && record.diagnoses[0] || '';
        this.form.diseaseName = mainDiagnosis || disease;
        this.form.chiefComplaint = record.complaint;
        if (record.symptoms && record.symptoms.length) {
          this.form.symptom = record.symptoms.join('；');
        }
        if (record.diagnoses && record.diagnoses.length) {
          // 初步诊断字段使用模板中的完整诊断组合
          this.form.diagnosis = record.diagnoses.join('；');
        }
        if (record.treatments && record.treatments.length) {
          this.form.treatment = record.treatments.join('；');
        }
        if (Array.isArray(record.suggestDrugs) && record.suggestDrugs.length) {
          this.applySuggestDrugs(record.suggestDrugs);
        }
      } else {
        // 回退到旧逻辑
        this.loadTemplatesForDisease(disease);
        this.autoFillByDisease(disease);
      }
    },
    // 依据疾病载入诊断与处置模板
    loadTemplatesForDisease: function loadTemplatesForDisease(disease) {
      var _this$diseaseTemplate, _this$diseaseTemplate2, _this$treatmentTempla;
      var baseDiag = ((_this$diseaseTemplate = this.diseaseTemplates) === null || _this$diseaseTemplate === void 0 ? void 0 : _this$diseaseTemplate[disease]) || [];
      // 合并结构化模板中的诊断
      var structDiag = (((_this$diseaseTemplate2 = this.diseaseTemplateLib) === null || _this$diseaseTemplate2 === void 0 ? void 0 : _this$diseaseTemplate2[disease]) || []).flatMap(function (t) {
        return t.diagnoses || [];
      });
      var diag = Array.from(new Set([].concat((0, _toConsumableArray2.default)(baseDiag || []), (0, _toConsumableArray2.default)(structDiag))));
      var treat = ((_this$treatmentTempla = this.treatmentTemplates) === null || _this$treatmentTempla === void 0 ? void 0 : _this$treatmentTempla[disease]) || [];
      this.filteredDiagnosis = diag;
      this.filteredTreatments = treat;
    },
    // 自动按疾病填入主诉/诊断/处置（可编辑）
    autoFillByDisease: function autoFillByDisease(disease) {
      var _this$complaintTempla, _this$diseaseTemplate3, _this$treatmentTempla2, _this$treatmentCautio;
      var complaint = (_this$complaintTempla = this.complaintTemplates) === null || _this$complaintTempla === void 0 ? void 0 : _this$complaintTempla[disease];
      var diagList = ((_this$diseaseTemplate3 = this.diseaseTemplates) === null || _this$diseaseTemplate3 === void 0 ? void 0 : _this$diseaseTemplate3[disease]) || [];
      var diag = diagList[0];
      var treats = (((_this$treatmentTempla2 = this.treatmentTemplates) === null || _this$treatmentTempla2 === void 0 ? void 0 : _this$treatmentTempla2[disease]) || []).slice(0, 2);
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
        // 疾病名称使用首个诊断，初步诊断使用全部诊断组合
        this.form.diseaseName = diag;
        this.form.diagnosis = diagList.length ? diagList.join('；') : diag;
      }
      if (merged.length) this.form.treatment = merged.join('；');
    },
    // 诊断输入与选择
    // 诊断获得焦点：显示下拉列表
    onDiagnosisFocus: function onDiagnosisFocus() {
      // 触发全局搜索，基于所有三个框的关键词
      var result = this.performGlobalSearch(this.form.diseaseName, this.form.chiefComplaint, this.form.diagnosis);
      this.filteredDiseases = result.diseases;
      this.filteredComplaints = result.complaints;
      this.filteredDiagnosis = result.diagnoses;

      // 显示下拉（即使为空也显示，基于其他框的关键词）
      this.showDiagnosisList = this.filteredDiagnosis.length > 0;
    },
    onDiagnosisInput: function onDiagnosisInput() {
      var result = this.performGlobalSearch(this.form.diseaseName, this.form.chiefComplaint, this.form.diagnosis);
      this.filteredDiseases = result.diseases;
      this.filteredComplaints = result.complaints;
      this.filteredDiagnosis = result.diagnoses;
      this.showDiagnosisList = this.filteredDiagnosis.length > 0;
    },
    selectDiagnosis: function selectDiagnosis(text) {
      var _this8 = this;
      // 查找包含该诊断的第一条模板记录
      var record = this.templateIndex.find(function (r) {
        return (r.diagnoses || []).some(function (d) {
          return d === text;
        });
      });
      if (record) {
        // 疾病名称直接使用所选标准诊断名
        this.form.diseaseName = text;
        this.form.chiefComplaint = record.complaint;
        // 初步诊断使用该模板下的完整诊断组合
        if (record.diagnoses && record.diagnoses.length) {
          this.form.diagnosis = record.diagnoses.join('；');
        } else {
          this.form.diagnosis = text;
        }
        if (record.symptoms && record.symptoms.length) {
          this.form.symptom = record.symptoms.join('；');
        }
        if (record.treatments && record.treatments.length) {
          this.form.treatment = record.treatments.join('；');
        }
        // 如模板提供推荐用药列表，自动按顺序触发联动药材逻辑
        if (Array.isArray(record.suggestDrugs) && record.suggestDrugs.length) {
          record.suggestDrugs.forEach(function (name) {
            if (name) {
              _this8.onDrugChip(name);
            }
          });
        }
      } else {
        this.form.diagnosis = text;
      }
      this.showDiagnosisList = false;
    },
    // 主诉获得焦点：根据编辑模式决定是否触发搜索
    onComplaintFocus: function onComplaintFocus() {
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
      var result = this.performGlobalSearch(this.form.diseaseName, this.form.chiefComplaint, this.form.diagnosis);
      this.filteredDiseases = result.diseases;
      this.filteredComplaints = result.complaints;
      this.filteredDiagnosis = result.diagnoses;

      // 即使主诉框为空，只要有其他框的关键词，也显示联动结果
      this.showComplaintList = this.filteredComplaints.length > 0;
    },
    onComplaintInput: function onComplaintInput() {
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

      // 搜索模式：执行全局搜索并显示下拉
      var result = this.performGlobalSearch(this.form.diseaseName, this.form.chiefComplaint, this.form.diagnosis);
      this.filteredDiseases = result.diseases;
      this.filteredComplaints = result.complaints;
      this.filteredDiagnosis = result.diagnoses;
      this.showComplaintList = this.filteredComplaints.length > 0;
    },
    onComplaintBlur: function onComplaintBlur() {
      var _this9 = this;
      // 失焦时重置聚焦状态
      this.complaintFocus = false;
      // 延迟隐藏下拉，给点击事件留时间
      this.complaintBlurTimer = setTimeout(function () {
        _this9.showComplaintList = false;
      }, 200);
    },
    selectComplaint: function selectComplaint(opt) {
      var _this10 = this;
      // 清除失焦隐藏计时器
      if (this.complaintBlurTimer) {
        clearTimeout(this.complaintBlurTimer);
        this.complaintBlurTimer = null;
      }
      if (!opt || !opt.record) return;
      var rec = opt.record;

      // 自动填充疾病、主诉、症状、诊断、处置
      var mainDiagnosis = rec.diagnoses && rec.diagnoses[0] || '';
      this.form.diseaseName = mainDiagnosis || rec.disease;
      this.form.chiefComplaint = rec.complaint;
      if (rec.symptoms && rec.symptoms.length) {
        this.form.symptom = rec.symptoms.join('；');
      }
      if (rec.diagnoses && rec.diagnoses.length) {
        // 初步诊断字段使用模板中的完整诊断组合
        this.form.diagnosis = rec.diagnoses.join('；');
      }
      if (rec.treatments && rec.treatments.length) {
        this.form.treatment = rec.treatments.join('；');
      }
      if (Array.isArray(rec.suggestDrugs) && rec.suggestDrugs.length) {
        this.applySuggestDrugs(rec.suggestDrugs);
      }

      // 进入自由编辑模式
      this.complaintSelectedMode = true;
      this.showComplaintList = false;

      // 自动聚焦到主诉输入框，方便立即编辑
      this.$nextTick(function () {
        _this10.complaintFocus = false;
        _this10.$nextTick(function () {
          _this10.complaintFocus = true;
        });
      });
    },
    // 处置输入与选择
    onTreatmentFocus: function onTreatmentFocus() {
      if (!this.form.treatment || this.form.treatment.trim() === '') {
        var _this$treatmentTempla3;
        var src = ((_this$treatmentTempla3 = this.treatmentTemplates) === null || _this$treatmentTempla3 === void 0 ? void 0 : _this$treatmentTempla3[this.form.diseaseName]) || [];
        this.filteredTreatments = src;
        this.showTreatmentList = src.length > 0;
      }
    },
    onTreatmentInput: function onTreatmentInput() {
      var _this$treatmentTempla4;
      var src = ((_this$treatmentTempla4 = this.treatmentTemplates) === null || _this$treatmentTempla4 === void 0 ? void 0 : _this$treatmentTempla4[this.form.diseaseName]) || [];
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
    },
    selectTreatment: function selectTreatment(text) {
      this.form.treatment = text;
      this.showTreatmentList = false;
    },
    appendTreatment: function appendTreatment(token) {
      var base = (this.form.treatment || '').trim();
      this.form.treatment = base ? "".concat(base, "\uFF1B").concat(token) : token;
    },
    // 将当前输入内容保存为自定义模板（全局搜索使用）
    saveCurrentAsTemplate: function saveCurrentAsTemplate() {
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
    },
    // 提交后提示保存模板
    promptSaveTemplate: function promptSaveTemplate() {
      var _this11 = this;
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
            _this11.saveCurrentAsTemplate();
          }
        }
      });
    },
    // —— 药材标签：与园区库存联动 —— //
    normalizeText: function normalizeText(text) {
      try {
        return String(text || '').toLowerCase().replace(/\\s+/g, '');
      } catch (e) {
        return '';
      }
    },
    ensureStockLoaded: function ensureStockLoaded() {
      var _this12 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee4() {
        return _regenerator.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                if (!(!_this12.filteredDrugs || _this12.filteredDrugs.length === 0)) {
                  _context4.next = 8;
                  break;
                }
                _context4.prev = 1;
                _context4.next = 4;
                return _this12.loadLocationDrugs();
              case 4:
                _context4.next = 8;
                break;
              case 6:
                _context4.prev = 6;
                _context4.t0 = _context4["catch"](1);
              case 8:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, null, [[1, 6]]);
      }))();
    },
    isPrescriptionDrug: function isPrescriptionDrug(name) {
      var n = (name || '').trim();
      if (!n) return false;
      return (this.rxDrugNames || []).includes(n);
    },
    applySuggestDrugs: function applySuggestDrugs(list) {
      var _this13 = this;
      if (!Array.isArray(list) || !list.length) return;
      list.forEach(function (name) {
        var n = (name || '').trim();
        if (!n) return;
        if (_this13.isPrescriptionDrug(n)) {
          _this13.appendTreatment("".concat(n, "\uFF08\u5904\u65B9\u836F\uFF0C\u9700\u5F00\u5177\u5904\u65B9\u5355\uFF0C\u5728\u9646\u56ED/\u6C34\u56ED\u836F\u623F\u53D1\u836F\uFF09"));
        } else {
          _this13.onDrugChip(n);
        }
      });
    },
    findDrugByName: function findDrugByName(name) {
      var _this14 = this;
      var target = this.normalizeText(name);
      var inList = function inList(list) {
        return (list || []).find(function (d) {
          var n1 = _this14.normalizeText(d.name || d.drugName);
          var n2 = _this14.normalizeText(d.specification || d.spec);
          return n1.includes(target) || target.includes(n1) || n2.includes(target);
        });
      };
      var found = inList(this.filteredDrugs);
      if (!found) found = inList(this.allDrugs);
      return found;
    },
    onDrugChip: function onDrugChip(name) {
      var _this15 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee5() {
        var drug;
        return _regenerator.default.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                // 1) 先附加“（一次）”到处置文本
                _this15.appendTreatment("".concat(name, "\uFF08\u4E00\u6B21\uFF09"));
                // 2) 加载当前园区库存，并尝试选中对应药材
                _context5.next = 3;
                return _this15.ensureStockLoaded();
              case 3:
                drug = _this15.findDrugByName(name);
                if (!(drug && drug._id)) {
                  _context5.next = 15;
                  break;
                }
                _context5.prev = 5;
                _context5.next = 8;
                return _this15.onDrugSelect(drug);
              case 8:
                uni.showToast({
                  title: "\u5DF2\u9009\u4E2D\u836F\u6750\uFF1A".concat(drug.name),
                  icon: 'none'
                });
                _context5.next = 13;
                break;
              case 11:
                _context5.prev = 11;
                _context5.t0 = _context5["catch"](5);
              case 13:
                _context5.next = 16;
                break;
              case 15:
                uni.showToast({
                  title: '当前园区暂无该药库存',
                  icon: 'none'
                });
              case 16:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, null, [[5, 11]]);
      }))();
    },
    // 恢复上次选择的园区
    restoreLastLocation: function restoreLastLocation() {
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
    },
    selectLocation: function selectLocation(location) {
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
    },
    // 地点输入框：获得焦点
    onLocationFocus: function onLocationFocus() {
      var text = (this.form.injuryLocation || '').trim().toLowerCase();
      if (!text) {
        // 展示全部常用地点
        this.filteredLocations = Array.from(new Set(this.allLocations));
      } else {
        this.onLocationInput();
      }
      this.showLocationList = true;
    },
    // 地点输入：过滤
    onLocationInput: function onLocationInput() {
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
    },
    // 选择地点
    selectLocationFromList: function selectLocationFromList(name) {
      this.form.injuryLocation = name;
      this.showLocationList = false;
    },
    onDrugSelect: function onDrugSelect(drug) {
      var _this16 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee6() {
        var res;
        return _regenerator.default.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                // 先设置基本信息
                _this16.form.drugId = drug._id;
                _this16.showDrugSelector = false;

                // 从药材档案获取完整信息
                _context6.prev = 2;
                uni.showLoading({
                  title: '加载药材信息...'
                });
                _context6.next = 6;
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
                res = _context6.sent;
                if (res.result.success && res.result.data) {
                  // 使用完整的药材信息
                  _this16.selectedDrug = _objectSpread(_objectSpread({}, res.result.data), {}, {
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
                  _this16.selectedDrug = _objectSpread(_objectSpread({}, drug), {}, {
                    minUnit: drug.minUnit || drug.unit || '个',
                    packUnit: drug.packUnit || drug.unit || '盒',
                    conversionRate: drug.conversionRate || 1
                  });
                }
                _context6.next = 14;
                break;
              case 10:
                _context6.prev = 10;
                _context6.t0 = _context6["catch"](2);
                console.error('获取药材详情失败:', _context6.t0);
                // 使用传入的drug数据
                _this16.selectedDrug = _objectSpread(_objectSpread({}, drug), {}, {
                  minUnit: drug.minUnit || drug.unit || '个',
                  packUnit: drug.packUnit || drug.unit || '盒',
                  conversionRate: drug.conversionRate || 1
                });
              case 14:
                _context6.prev = 14;
                uni.hideLoading();
                return _context6.finish(14);
              case 17:
                _context6.next = 19;
                return _this16.loadBatches();
              case 19:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, null, [[2, 10, 14, 17]]);
      }))();
    },
    loadBatches: function loadBatches() {
      var _this17 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee7() {
        var res, batches, parkName;
        return _regenerator.default.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                uni.showLoading({
                  title: '加载库存...'
                });
                _context7.prev = 1;
                _context7.next = 4;
                return wx.cloud.callFunction({
                  name: 'stockManage',
                  data: {
                    action: 'getBatchesByDrugId',
                    data: {
                      drugId: _this17.form.drugId,
                      location: _this17.form.location,
                      enableFIFO: true
                    }
                  }
                });
              case 4:
                res = _context7.sent;
                if (res.result.success && res.result.data.length > 0) {
                  batches = res.result.data;
                  _this17.selectedBatch = batches[0];
                  _this17.availableStock = batches.reduce(function (sum, b) {
                    return sum + b.quantity;
                  }, 0);
                } else {
                  _this17.selectedBatch = null;
                  _this17.availableStock = 0;
                  parkName = _this17.form.location === 'land_park' ? '陆园' : '水园';
                  uni.showToast({
                    title: "".concat(parkName, "\u8BE5\u836F\u6750\u5E93\u5B58\u4E0D\u8DB3"),
                    icon: 'none',
                    duration: 2000
                  });
                }
                _context7.next = 11;
                break;
              case 8:
                _context7.prev = 8;
                _context7.t0 = _context7["catch"](1);
                uni.showToast({
                  title: '加载库存失败',
                  icon: 'none'
                });
              case 11:
                _context7.prev = 11;
                uni.hideLoading();
                return _context7.finish(11);
              case 14:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, null, [[1, 8, 11, 14]]);
      }))();
    },
    openSignature: function openSignature() {
      this.showSignature = true;
    },
    onSignatureConfirm: function onSignatureConfirm(signatureData) {
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
    },
    handleSubmit: function handleSubmit() {
      var _this18 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee8() {
        var hasValidDrugUsage, submitData, intQuantity, res;
        return _regenerator.default.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                if (!(!_this18.form.location || _this18.form.location !== 'land_park' && _this18.form.location !== 'water_park')) {
                  _context8.next = 3;
                  break;
                }
                uni.showToast({
                  title: '请选择就诊园区',
                  icon: 'none'
                });
                return _context8.abrupt("return");
              case 3:
                if (!(!_this18.form.name || _this18.form.name.trim() === '')) {
                  _context8.next = 6;
                  break;
                }
                uni.showToast({
                  title: '请输入患者姓名',
                  icon: 'none'
                });
                return _context8.abrupt("return");
              case 6:
                if (_this18.form.gender) {
                  _context8.next = 9;
                  break;
                }
                uni.showToast({
                  title: '请选择性别',
                  icon: 'none'
                });
                return _context8.abrupt("return");
              case 9:
                if (!(!_this18.form.age || _this18.form.age <= 0)) {
                  _context8.next = 12;
                  break;
                }
                uni.showToast({
                  title: '请输入有效的年龄',
                  icon: 'none'
                });
                return _context8.abrupt("return");
              case 12:
                if (_this18.form.identity) {
                  _context8.next = 15;
                  break;
                }
                uni.showToast({
                  title: '请选择身份',
                  icon: 'none'
                });
                return _context8.abrupt("return");
              case 15:
                if (_this18.form.visitType) {
                  _context8.next = 18;
                  break;
                }
                uni.showToast({
                  title: '请选择接诊类型',
                  icon: 'none'
                });
                return _context8.abrupt("return");
              case 18:
                if (!(_this18.form.visitType === 'outcall' && (!_this18.form.injuryLocation || _this18.form.injuryLocation.trim() === ''))) {
                  _context8.next = 21;
                  break;
                }
                uni.showToast({
                  title: '出诊时需填写受伤地点',
                  icon: 'none'
                });
                return _context8.abrupt("return");
              case 21:
                if (!(!_this18.form.chiefComplaint || _this18.form.chiefComplaint.trim() === '')) {
                  _context8.next = 24;
                  break;
                }
                uni.showToast({
                  title: '请输入主诉',
                  icon: 'none'
                });
                return _context8.abrupt("return");
              case 24:
                if (!(!_this18.form.diseaseName || _this18.form.diseaseName.trim() === '')) {
                  _context8.next = 27;
                  break;
                }
                uni.showToast({
                  title: '请输入疾病名称',
                  icon: 'none'
                });
                return _context8.abrupt("return");
              case 27:
                if (!(!_this18.form.diagnosis || _this18.form.diagnosis.trim() === '')) {
                  _context8.next = 30;
                  break;
                }
                uni.showToast({
                  title: '请输入诊断',
                  icon: 'none'
                });
                return _context8.abrupt("return");
              case 30:
                if (!(!_this18.form.treatment || _this18.form.treatment.trim() === '')) {
                  _context8.next = 33;
                  break;
                }
                uni.showToast({
                  title: '请输入处置措施',
                  icon: 'none'
                });
                return _context8.abrupt("return");
              case 33:
                // 用药信息为选填：仅当选择了药材且数量>0时，才视为用药登记
                hasValidDrugUsage = false;
                if (!_this18.selectedDrug) {
                  _context8.next = 47;
                  break;
                }
                if (!(_this18.form.quantity && _this18.form.quantity > 0)) {
                  _context8.next = 42;
                  break;
                }
                if (!(_this18.form.quantity > _this18.availableStock)) {
                  _context8.next = 39;
                  break;
                }
                uni.showToast({
                  title: "\u5E93\u5B58\u4E0D\u8DB3\uFF0C\u6700\u591A".concat(_this18.availableStock).concat(_this18.selectedDrug.minUnit),
                  icon: 'none',
                  duration: 3000
                });
                return _context8.abrupt("return");
              case 39:
                hasValidDrugUsage = true;
                _context8.next = 47;
                break;
              case 42:
                // 选择了药材但未填写有效数量，视为本次不登记用药，清空用药相关状态
                _this18.form.drugId = '';
                _this18.form.quantity = null;
                _this18.selectedDrug = null;
                _this18.selectedBatch = null;
                _this18.availableStock = 0;
              case 47:
                _this18.submitting = true;
                uni.showLoading({
                  title: '保存中...'
                });
                _context8.prev = 49;
                // 准备数据
                submitData = {
                  visitDateTime: _this18.form.visitDateTime,
                  name: _this18.form.name.trim(),
                  gender: _this18.form.gender,
                  age: _this18.form.age,
                  identity: _this18.form.identity,
                  location: _this18.form.location,
                  // 园区（陆园/水园）
                  visitType: _this18.form.visitType,
                  isOutcall: _this18.form.visitType === 'outcall',
                  injuryLocation: _this18.form.injuryLocation.trim(),
                  chiefComplaint: _this18.form.chiefComplaint.trim(),
                  diseaseName: _this18.form.diseaseName.trim(),
                  diagnosis: _this18.form.diagnosis.trim(),
                  treatment: _this18.form.treatment.trim(),
                  remark: _this18.form.remark.trim()
                }; // 如果有有效用药信息，云函数会从对应园区扣减库存
                if (hasValidDrugUsage && _this18.selectedDrug && _this18.form.quantity) {
                  // 确保数量是整数，避免小数
                  intQuantity = Math.floor(_this18.form.quantity);
                  submitData.drugInfo = {
                    drugId: _this18.form.drugId,
                    // 系统内部ID（主键）
                    drugCode: _this18.selectedDrug.drugCode || _this18.selectedDrug.code || '',
                    // 药材代码（业务编码）
                    drugName: _this18.selectedDrug.name,
                    specification: _this18.selectedDrug.specification,
                    unit: _this18.selectedDrug.minUnit,
                    quantity: intQuantity,
                    batchId: _this18.selectedBatch._id,
                    batch: _this18.selectedBatch.batch,
                    location: _this18.form.location,
                    // 关联园区
                    minUnit: _this18.selectedDrug.minUnit,
                    packUnit: _this18.selectedDrug.packUnit,
                    conversionRate: _this18.selectedDrug.conversionRate
                  };

                  // 兼容旧字段
                  submitData.drugId = _this18.form.drugId; // 系统内部ID（主键）
                  submitData.drugCode = _this18.selectedDrug.drugCode || _this18.selectedDrug.code || ''; // 药材代码（业务编码）
                  submitData.drugName = _this18.selectedDrug.name;
                  submitData.specification = _this18.selectedDrug.specification;
                  submitData.batchId = _this18.selectedBatch._id;
                  submitData.quantityMin = intQuantity;
                  submitData.minUnit = _this18.selectedDrug.minUnit;
                  submitData.packUnit = _this18.selectedDrug.packUnit;
                  submitData.conversionRate = _this18.selectedDrug.conversionRate;
                  submitData.patient = _this18.form.name.trim();
                  submitData.symptom = (_this18.form.symptom || _this18.form.chiefComplaint || '').trim();
                }
                _context8.next = 54;
                return wx.cloud.callFunction({
                  name: 'clinicRecords',
                  data: {
                    action: 'add',
                    data: submitData
                  }
                });
              case 54:
                res = _context8.sent;
                if (res.result.success) {
                  // 提示保存为模板
                  _this18.promptSaveTemplate();
                  if (_this18.continueAfterSubmit) {
                    // 连续登记模式：立即清空表单
                    uni.showToast({
                      title: '登记成功，可继续登记',
                      icon: 'success',
                      duration: 2000
                    });
                    setTimeout(function () {
                      _this18.resetForm();
                      // 滚动到顶部
                      uni.pageScrollTo({
                        scrollTop: 0,
                        duration: 300
                      });
                    }, 800);
                  } else {
                    // 返回列表
                    uni.showToast({
                      title: '登记成功',
                      icon: 'success'
                    });
                    setTimeout(function () {
                      // 确保离开页面前也重置一次，避免热更新或返回后残留
                      _this18.resetForm();
                      uni.navigateBack();
                    }, 1500);
                  }
                } else {
                  uni.showToast({
                    title: res.result.error || '登记失败',
                    icon: 'none'
                  });
                }
                _context8.next = 62;
                break;
              case 58:
                _context8.prev = 58;
                _context8.t0 = _context8["catch"](49);
                console.error('登记失败:', _context8.t0);
                uni.showToast({
                  title: '登记失败',
                  icon: 'none'
                });
              case 62:
                _context8.prev = 62;
                _this18.submitting = false;
                uni.hideLoading();
                return _context8.finish(62);
              case 66:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, null, [[49, 58, 62, 66]]);
      }))();
    },
    resetForm: function resetForm() {
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
      this.form.diseaseName = '';
      this.form.diagnosis = '';
      this.form.treatment = '';
      this.form.drugId = '';
      this.form.quantity = null;
      this.form.remark = '';
      this.form.doctorSign = '';
      this.form.signTime = '';

      // 用药与库存相关状态
      this.selectedDrug = null;
      this.selectedBatch = null;
      this.availableStock = 0;
      this.convertedQuantity = null;
      this.drugSearchText = '';
      this.filteredDrugs = [];
      this.showDrugList = false;

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
    },
    formatDate: function formatDate(dateStr) {
      if (!dateStr) return '';
      var date = new Date(dateStr);
      var year = date.getFullYear();
      var month = String(date.getMonth() + 1).padStart(2, '0');
      var day = String(date.getDate()).padStart(2, '0');
      return "".concat(year, "-").concat(month, "-").concat(day);
    },
    // 切换连续登记模式
    toggleContinue: function toggleContinue() {
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
    },
    goBack: function goBack() {
      uni.navigateBack();
    },
    // 生成日报
    generateDailyReport: function generateDailyReport() {
      var _this19 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee9() {
        var today, year, month, day, dateStr, location, locationName, records, res, report, stats, tableData, reportDate;
        return _regenerator.default.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                _context9.prev = 0;
                uni.showLoading({
                  title: '生成中...'
                });

                // 获取当前日期和园区
                today = new Date();
                year = today.getFullYear();
                month = String(today.getMonth() + 1).padStart(2, '0');
                day = String(today.getDate()).padStart(2, '0');
                dateStr = "".concat(year, "-").concat(month, "-").concat(day); // 必须先选择就诊园区
                location = _this19.form.location;
                if (!(!location || location !== 'land_park' && location !== 'water_park')) {
                  _context9.next = 13;
                  break;
                }
                uni.hideLoading();
                uni.showToast({
                  title: '请选择就诊园区',
                  icon: 'none'
                });
                // 如有需要，可同时弹出园区选择提示
                _this19.showLocationTip = true;
                return _context9.abrupt("return");
              case 13:
                locationName = location === 'land_park' ? '陆园' : '水园'; // 查询当日的所有门诊记录
                // 查询 clinic_records 集合（完整门诊登记信息）
                records = [];
                _context9.prev = 15;
                _context9.next = 18;
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
                res = _context9.sent;
                if (res.result && res.result.success && res.result.data && res.result.data.list) {
                  records = res.result.data.list;
                }
                _context9.next = 25;
                break;
              case 22:
                _context9.prev = 22;
                _context9.t0 = _context9["catch"](15);
                console.error('查询门诊记录失败:', _context9.t0);
              case 25:
                if (!(records.length === 0)) {
                  _context9.next = 29;
                  break;
                }
                uni.hideLoading();
                uni.showToast({
                  title: '当日无门诊记录',
                  icon: 'none',
                  duration: 2000
                });
                return _context9.abrupt("return");
              case 29:
                // 生成文档和统计信息
                report = _this19.formatDailyReport(records, dateStr, locationName);
                stats = _this19.calculateStats(records); // 准备详细的表格数据
                tableData = _this19.prepareTableData(records);
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
                _context9.next = 42;
                break;
              case 37:
                _context9.prev = 37;
                _context9.t1 = _context9["catch"](0);
                console.error('生成日报失败:', _context9.t1);
                uni.hideLoading();
                uni.showToast({
                  title: '生成失败：' + (_context9.t1.message || '未知错误'),
                  icon: 'none',
                  duration: 3000
                });
              case 42:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9, null, [[0, 37], [15, 22]]);
      }))();
    },
    // 格式化日报
    formatDailyReport: function formatDailyReport(records, dateStr, locationName) {
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
    },
    // 计算统计信息
    calculateStats: function calculateStats(records) {
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
    },
    // 准备表格数据
    prepareTableData: function prepareTableData(records) {
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
    }
  }
};
exports.default = _default;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 2)["default"], __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/wx.js */ 1)["default"]))

/***/ }),

/***/ 404:
/*!****************************************************************************************************!*\
  !*** D:/AK-PMS/pages-sub/clinic/add.vue?vue&type=style&index=0&id=0904e2e0&lang=scss&scoped=true& ***!
  \****************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_2_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_5_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_add_vue_vue_type_style_index_0_id_0904e2e0_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!./node_modules/mini-css-extract-plugin/dist/loader.js??ref--8-oneOf-1-0!./node_modules/css-loader/dist/cjs.js??ref--8-oneOf-1-1!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--8-oneOf-1-2!./node_modules/postcss-loader/src??ref--8-oneOf-1-3!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/sass-loader/dist/cjs.js??ref--8-oneOf-1-4!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--8-oneOf-1-5!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./add.vue?vue&type=style&index=0&id=0904e2e0&lang=scss&scoped=true& */ 405);
/* harmony import */ var _F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_2_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_5_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_add_vue_vue_type_style_index_0_id_0904e2e0_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_2_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_5_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_add_vue_vue_type_style_index_0_id_0904e2e0_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_2_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_5_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_add_vue_vue_type_style_index_0_id_0904e2e0_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_2_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_5_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_add_vue_vue_type_style_index_0_id_0904e2e0_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_2_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_5_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_F_google_HBuilderX_4_84_2025110307_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_add_vue_vue_type_style_index_0_id_0904e2e0_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ 405:
/*!********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js??ref--8-oneOf-1-0!./node_modules/css-loader/dist/cjs.js??ref--8-oneOf-1-1!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--8-oneOf-1-2!./node_modules/postcss-loader/src??ref--8-oneOf-1-3!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/sass-loader/dist/cjs.js??ref--8-oneOf-1-4!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--8-oneOf-1-5!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!D:/AK-PMS/pages-sub/clinic/add.vue?vue&type=style&index=0&id=0904e2e0&lang=scss&scoped=true& ***!
  \********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin
    if(false) { var cssReload; }
  

/***/ })

},[[398,"common/runtime","common/vendor"]]]);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages-sub/clinic/add.js.map