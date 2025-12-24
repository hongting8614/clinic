(global["webpackJsonp"] = global["webpackJsonp"] || []).push([["pages-sub/in/add"],{

/***/ 138:
/*!*********************************************************!*\
  !*** D:/AK-PMS/main.js?{"page":"pages-sub%2Fin%2Fadd"} ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(wx, createPage) {

var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
__webpack_require__(/*! uni-pages */ 26);
var _vue = _interopRequireDefault(__webpack_require__(/*! vue */ 25));
var _add = _interopRequireDefault(__webpack_require__(/*! ./pages-sub/in/add.vue */ 139));
// @ts-ignore
wx.__webpack_require_UNI_MP_PLUGIN__ = __webpack_require__;
createPage(_add.default);
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/wx.js */ 1)["default"], __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 2)["createPage"]))

/***/ }),

/***/ 139:
/*!**************************************!*\
  !*** D:/AK-PMS/pages-sub/in/add.vue ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _add_vue_vue_type_template_id_58f3a51d_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./add.vue?vue&type=template&id=58f3a51d&scoped=true& */ 140);
/* harmony import */ var _add_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./add.vue?vue&type=script&lang=js& */ 142);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _add_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _add_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var _add_vue_vue_type_style_index_0_id_58f3a51d_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./add.vue?vue&type=style&index=0&id=58f3a51d&lang=scss&scoped=true& */ 144);
/* harmony import */ var _HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../HBuilderX/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/runtime/componentNormalizer.js */ 32);

var renderjs





/* normalize component */

var component = Object(_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _add_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _add_vue_vue_type_template_id_58f3a51d_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
  _add_vue_vue_type_template_id_58f3a51d_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "58f3a51d",
  null,
  false,
  _add_vue_vue_type_template_id_58f3a51d_scoped_true___WEBPACK_IMPORTED_MODULE_0__["components"],
  renderjs
)

component.options.__file = "pages-sub/in/add.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ 140:
/*!*********************************************************************************!*\
  !*** D:/AK-PMS/pages-sub/in/add.vue?vue&type=template&id=58f3a51d&scoped=true& ***!
  \*********************************************************************************/
/*! exports provided: render, staticRenderFns, recyclableRender, components */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_add_vue_vue_type_template_id_58f3a51d_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../HBuilderX/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../HBuilderX/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--17-0!../../../HBuilderX/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!../../../HBuilderX/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-uni-app-loader/page-meta.js!../../../HBuilderX/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../HBuilderX/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./add.vue?vue&type=template&id=58f3a51d&scoped=true& */ 141);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_add_vue_vue_type_template_id_58f3a51d_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_add_vue_vue_type_template_id_58f3a51d_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "recyclableRender", function() { return _HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_add_vue_vue_type_template_id_58f3a51d_scoped_true___WEBPACK_IMPORTED_MODULE_0__["recyclableRender"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "components", function() { return _HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_add_vue_vue_type_template_id_58f3a51d_scoped_true___WEBPACK_IMPORTED_MODULE_0__["components"]; });



/***/ }),

/***/ 141:
/*!*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--17-0!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-uni-app-loader/page-meta.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!D:/AK-PMS/pages-sub/in/add.vue?vue&type=template&id=58f3a51d&scoped=true& ***!
  \*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns, recyclableRender, components */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "recyclableRender", function() { return recyclableRender; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "components", function() { return components; });
var components
try {
  components = {
    signature: function () {
      return __webpack_require__.e(/*! import() | components/signature/index */ "components/signature/index").then(__webpack_require__.bind(null, /*! @/components/signature/index.vue */ 462))
    },
  }
} catch (e) {
  if (
    e.message.indexOf("Cannot find module") !== -1 &&
    e.message.indexOf(".vue") !== -1
  ) {
    console.error(e.message)
    console.error("1. 排查组件名称拼写是否正确")
    console.error(
      "2. 排查组件是否符合 easycom 规范，文档：https://uniapp.dcloud.net.cn/collocation/pages?id=easycom"
    )
    console.error(
      "3. 若组件不符合 easycom 规范，需手动引入，并在 components 中注册该组件"
    )
  } else {
    throw e
  }
}
var render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  var g0 = _vm.showSearchResult && _vm.searchResults.length > 0
  var g1 = _vm.drugList.length
  var g2 = _vm.drugList.length
  var l0 =
    g2 > 0
      ? _vm.__map(_vm.drugList, function (item, index) {
          var $orig = _vm.__get_orig(item)
          var m0 = item.amount > 0 ? _vm.formatAmount(item.amount) : null
          return {
            $orig: $orig,
            m0: m0,
          }
        })
      : null
  var g3 =
    _vm.drugList.length === 0 && !_vm.searchKeyword && !_vm.showSearchResult
  var g4 = _vm.drugList.length
  var g5 = g4 > 0 ? _vm.drugList.length : null
  var m1 =
    g4 > 0 && _vm.totalAmount > 0 ? _vm.formatAmount(_vm.totalAmount) : null
  if (!_vm._isMounted) {
    _vm.e0 = function (e, index) {
      var args = [],
        len = arguments.length - 2
      while (len-- > 0) args[len] = arguments[len + 2]

      var _temp = args[args.length - 1].currentTarget.dataset,
        _temp2 = _temp.eventParams || _temp["event-params"],
        index = _temp2.index
      var _temp, _temp2
      return _vm.onDateChange(index, "productionDate", e.detail.value)
    }
    _vm.e1 = function (e, index) {
      var args = [],
        len = arguments.length - 2
      while (len-- > 0) args[len] = arguments[len + 2]

      var _temp3 = args[args.length - 1].currentTarget.dataset,
        _temp4 = _temp3.eventParams || _temp3["event-params"],
        index = _temp4.index
      var _temp3, _temp4
      return _vm.onDateChange(index, "expireDate", e.detail.value)
    }
  }
  _vm.$mp.data = Object.assign(
    {},
    {
      $root: {
        g0: g0,
        g1: g1,
        g2: g2,
        l0: l0,
        g3: g3,
        g4: g4,
        g5: g5,
        m1: m1,
      },
    }
  )
}
var recyclableRender = false
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ 142:
/*!***************************************************************!*\
  !*** D:/AK-PMS/pages-sub/in/add.vue?vue&type=script&lang=js& ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_add_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../HBuilderX/HBuilderX/plugins/uniapp-cli/node_modules/babel-loader/lib!../../../HBuilderX/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--13-1!../../../HBuilderX/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!../../../HBuilderX/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../HBuilderX/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./add.vue?vue&type=script&lang=js& */ 143);
/* harmony import */ var _HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_add_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_add_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_add_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_add_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_add_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ 143:
/*!**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--13-1!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!D:/AK-PMS/pages-sub/in/add.vue?vue&type=script&lang=js& ***!
  \**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
var _asyncToGenerator2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ 36));
var _common = _interopRequireDefault(__webpack_require__(/*! @/utils/common.js */ 103));
var Signature = function Signature() {
  __webpack_require__.e(/*! require.ensure | components/signature/index */ "components/signature/index").then((function () {
    return resolve(__webpack_require__(/*! @/components/signature/index.vue */ 462));
  }).bind(null, __webpack_require__)).catch(__webpack_require__.oe);
};
var _default = {
  components: {
    signature: Signature
  },
  data: function data() {
    return {
      // 基本信息
      recordNo: '',
      currentDate: '',
      operator: '',
      remark: '',
      drugList: [],
      operatorSign: '',
      // 药材搜索相关
      searchKeyword: '',
      searchFocused: false,
      showSearchResult: false,
      searchResults: [],
      searchTimer: null,
      isSearchingAPI: false,
      // 新建药材（内联表单）
      showCreateForm: false,
      createFormSource: '',
      newDrug: {
        name: '',
        spec: '',
        unit: '',
        barcode: '',
        manufacturer: '',
        approvalNumber: ''
      },
      unitOptions: ['盒', '瓶', '袋', '支', '板', '片', '粒', '丸'],
      unitIndex: 0,
      // 日期范围
      minDate: '2020-01-01',
      maxDate: '',
      maxExpDate: '2035-12-31'
    };
  },
  computed: {
    totalQuantity: function totalQuantity() {
      return this.drugList.reduce(function (sum, item) {
        return sum + (Number(item.quantity) || 0);
      }, 0);
    },
    totalAmount: function totalAmount() {
      return this.drugList.reduce(function (sum, item) {
        return sum + (Number(item.amount) || 0);
      }, 0);
    }
  },
  onLoad: function onLoad() {
    this.initPage();
  },
  methods: {
    initPage: function initPage() {
      // 生成入库单号
      this.recordNo = _common.default.generateRecordNo('RK');

      // 获取当前时间
      var now = new Date();
      this.currentDate = _common.default.formatDate(now);
      this.maxDate = _common.default.formatDate(now);

      // 获取当前用户
      var userInfo = uni.getStorageSync('userInfo');
      this.operator = (userInfo === null || userInfo === void 0 ? void 0 : userInfo.name) || '未登录';
    },
    // ========== 药材搜索相关 ==========
    onSearchFocus: function onSearchFocus() {
      this.searchFocused = true;
      // 聚焦搜索框时，隐藏创建表单
      this.showCreateForm = false;
      if (this.searchKeyword) {
        this.showSearchResult = true;
      }
    },
    onSearchBlur: function onSearchBlur() {
      var _this = this;
      this.searchFocused = false;
      // 延迟隐藏，以便点击搜索结果
      setTimeout(function () {
        _this.showSearchResult = false;
      }, 200);
    },
    onSearchInput: function onSearchInput(e) {
      var _this2 = this;
      var keyword = e.detail.value.trim();
      if (!keyword) {
        this.searchResults = [];
        this.showSearchResult = false;
        return;
      }

      // 防抖搜索
      if (this.searchTimer) {
        clearTimeout(this.searchTimer);
      }
      this.searchTimer = setTimeout(function () {
        _this2.searchDrugs(keyword);
      }, 300);
    },
    onSearchConfirm: function onSearchConfirm() {
      if (this.searchKeyword.trim()) {
        this.searchDrugs();
      }
    },
    // ⭐ 智能搜索：本地 → NMPA → 手动创建
    searchDrugs: function searchDrugs(inputKeyword) {
      var _this3 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee() {
        var keyword, result, drugs, sourceText;
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                keyword = (inputKeyword || _this3.searchKeyword).trim();
                if (keyword) {
                  _context.next = 3;
                  break;
                }
                return _context.abrupt("return");
              case 3:
                _context.prev = 3;
                // 显示搜索中状态
                _this3.isSearchingAPI = true;
                _this3.showSearchResult = false;

                // 调用云函数（内部会先查本地，本地无则查NMPA并保存）
                _context.next = 8;
                return wx.cloud.callFunction({
                  name: 'drugSearch',
                  data: {
                    drugName: keyword
                  }
                });
              case 8:
                result = _context.sent;
                _this3.isSearchingAPI = false;
                if (result.result && result.result.success) {
                  // 找到结果（可能是本地或NMPA）
                  drugs = result.result.data; // 格式化为统一结构
                  _this3.searchResults = drugs.map(function (drug) {
                    return {
                      _id: drug._id || 'temp_' + Date.now(),
                      name: drug.name,
                      spec: drug.specification || '',
                      specification: drug.specification || '',
                      unit: drug.unit || '盒',
                      packUnit: drug.unit || '盒',
                      manufacturer: drug.manufacturer || '',
                      barcode: drug.barcode || '',
                      approvalNumber: drug.approvalNumber || '',
                      source: drug.source || result.result.source
                    };
                  });

                  // 显示搜索结果，隐藏创建表单
                  _this3.showSearchResult = true;
                  _this3.showCreateForm = false;

                  // 显示数据来源提示
                  sourceText = {
                    'local': '本地档案',
                    'nmpa': '国家药监局'
                  }[result.result.source] || '数据库';
                  uni.showToast({
                    title: "\u627E\u5230 ".concat(drugs.length, " \u6761 (").concat(sourceText, ")"),
                    icon: 'none',
                    duration: 1500
                  });
                } else {
                  // 未找到，提示手动创建
                  _this3.showSearchResult = false;
                  _this3.activateCreateFormManual(keyword);
                }
                _context.next = 18;
                break;
              case 13:
                _context.prev = 13;
                _context.t0 = _context["catch"](3);
                console.error('搜索失败:', _context.t0);
                _this3.isSearchingAPI = false;
                // 出错也激活手动创建
                _this3.activateCreateFormManual(keyword);
              case 18:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[3, 13]]);
      }))();
    },
    // 激活创建表单（API数据）⭐
    activateCreateFormWithAPI: function activateCreateFormWithAPI(apiData) {
      this.showCreateForm = true;
      this.createFormSource = 'api';
      this.showSearchResult = false;

      // 自动填充API返回的数据
      this.newDrug = {
        name: apiData.name || '',
        spec: apiData.specification || apiData.spec || '',
        unit: apiData.unit || '',
        barcode: apiData.barcode || '',
        manufacturer: apiData.manufacturer || '',
        approvalNumber: apiData.approvalNumber || ''
      };

      // 设置单位选择器索引
      var unitIdx = this.unitOptions.indexOf(this.newDrug.unit);
      this.unitIndex = unitIdx >= 0 ? unitIdx : 0;
      uni.showToast({
        title: '✅ 已从药监局获取数据',
        icon: 'none',
        duration: 2000
      });
    },
    // 激活创建表单（手动）⭐
    activateCreateFormManual: function activateCreateFormManual(keyword) {
      this.showCreateForm = true;
      this.createFormSource = 'manual';
      this.showSearchResult = false;

      // 仅填充搜索词
      this.newDrug = {
        name: keyword,
        spec: '',
        unit: '',
        barcode: '',
        manufacturer: '',
        approvalNumber: ''
      };
      this.unitIndex = 0;
      uni.showToast({
        title: '💡 未找到，请完善信息',
        icon: 'none',
        duration: 2000
      });
    },
    clearSearch: function clearSearch() {
      this.searchKeyword = '';
      this.searchResults = [];
      this.showSearchResult = false;
      this.showCreateForm = false;
      this.isSearchingAPI = false;
    },
    // 取消创建
    cancelCreate: function cancelCreate() {
      this.showCreateForm = false;
      this.newDrug = {
        name: '',
        spec: '',
        unit: '',
        barcode: '',
        manufacturer: '',
        approvalNumber: ''
      };
      this.unitIndex = 0;
    },
    // 确认创建并添加 ⭐⭐⭐
    confirmCreate: function confirmCreate() {
      var _this4 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2() {
        var db, result, newDrugItem;
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (!(!_this4.newDrug.name || !_this4.newDrug.spec || !_this4.newDrug.unit)) {
                  _context2.next = 3;
                  break;
                }
                uni.showToast({
                  title: '请填写完整信息',
                  icon: 'none'
                });
                return _context2.abrupt("return");
              case 3:
                uni.showLoading({
                  title: '创建中...',
                  mask: true
                });
                _context2.prev = 4;
                db = wx.cloud.database(); // 1. 创建药材档案
                _context2.next = 8;
                return db.collection('drugs').add({
                  data: {
                    name: _this4.newDrug.name,
                    spec: _this4.newDrug.spec,
                    specification: _this4.newDrug.spec,
                    // 兼容字段
                    packUnit: _this4.newDrug.unit,
                    unit: _this4.newDrug.unit,
                    // 兼容字段
                    barcode: _this4.newDrug.barcode || '',
                    manufacturer: _this4.newDrug.manufacturer || '',
                    approvalNumber: _this4.newDrug.approvalNumber || '',
                    createTime: new Date(),
                    createSource: _this4.createFormSource // 记录来源：api 或 manual
                  }
                });
              case 8:
                result = _context2.sent;
                uni.hideLoading();
                if (result._id) {
                  uni.showToast({
                    title: '✅ 创建成功',
                    icon: 'success',
                    duration: 1500
                  });

                  // 2. 自动添加到入库列表 ⭐⭐⭐
                  newDrugItem = {
                    drugId: result._id,
                    drugName: _this4.newDrug.name,
                    specification: _this4.newDrug.spec,
                    unit: _this4.newDrug.unit,
                    manufacturer: _this4.newDrug.manufacturer || '',
                    batch: '',
                    productionDate: '',
                    expireDate: '',
                    daysToExpiry: null,
                    quantity: '',
                    price: '',
                    amount: '',
                    hasError: false
                  }; // 添加到列表最前面（新的在上）
                  _this4.drugList.unshift(newDrugItem);

                  // 重置表单
                  _this4.cancelCreate();
                  _this4.searchKeyword = '';
                }
                _context2.next = 18;
                break;
              case 13:
                _context2.prev = 13;
                _context2.t0 = _context2["catch"](4);
                console.error('创建失败:', _context2.t0);
                uni.hideLoading();
                uni.showToast({
                  title: '创建失败: ' + _context2.t0.message,
                  icon: 'none'
                });
              case 18:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[4, 13]]);
      }))();
    },
    selectDrug: function selectDrug(drug) {
      var _this5 = this;
      // 检查是否已添加
      var exists = this.drugList.some(function (item) {
        return item.drugId === drug._id;
      });
      if (exists) {
        uni.showToast({
          title: '该药材已添加',
          icon: 'none'
        });
        return;
      }

      // 记录当前滚动位置
      uni.createSelectorQuery().selectViewport().scrollOffset(function (res) {
        var currentScrollTop = res.scrollTop || 0;

        // 立即清空搜索和隐藏结果
        _this5.searchKeyword = '';
        _this5.searchResults = [];
        _this5.showSearchResult = false;
        _this5.showCreateForm = false;
        _this5.isSearchingAPI = false;

        // 使用nextTick确保DOM更新后再添加药材
        _this5.$nextTick(function () {
          // 添加药材到列表顶部
          _this5.drugList.unshift({
            drugId: drug._id,
            drugName: drug.name,
            specification: drug.spec || drug.specification,
            unit: drug.packUnit || drug.unit || '盒',
            manufacturer: drug.manufacturer || '',
            batch: '',
            productionDate: '',
            expireDate: '',
            daysToExpiry: null,
            quantity: '',
            price: '',
            amount: 0,
            hasError: false
          });

          // 立即补偿滚动位置（新增药材卡片高度约450rpx）
          _this5.$nextTick(function () {
            uni.pageScrollTo({
              scrollTop: currentScrollTop + uni.upx2px(450),
              duration: 0 // 无动画，瞬间完成
            });
          });

          // 用户反馈
          uni.showToast({
            title: '已添加到列表',
            icon: 'success',
            duration: 1500
          });

          // 振动反馈
          wx.vibrateShort({
            type: 'light'
          });
        });
      }).exec();
    },
    // ========== 扫码相关 ==========
    scanBarcode: function scanBarcode() {
      var _this6 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee3() {
        var apiStats, res, scanRes, cleanBarcode;
        return _regenerator.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.prev = 0;
                _context3.next = 3;
                return _this6.getAPIStats();
              case 3:
                apiStats = _context3.sent;
                if (!(apiStats.remaining === 0)) {
                  _context3.next = 7;
                  break;
                }
                uni.showModal({
                  title: '🚫 API次数已用完',
                  content: "\u4ECA\u65E5API\u8C03\u7528\u6B21\u6570\u5DF2\u8FBE\u4E0A\u9650 (".concat(apiStats.todayUsed, "/").concat(apiStats.limit, ")\n\n\u5EFA\u8BAE\uFF1A\n1. \u624B\u52A8\u641C\u7D22\u836F\u6750\u6863\u6848\n2. \u65B0\u5EFA\u836F\u6750\u6863\u6848\n3. \u7B49\u5F85\u660E\u5929\u91CD\u7F6E"),
                  showCancel: false
                });
                return _context3.abrupt("return");
              case 7:
                if (!apiStats.critical) {
                  _context3.next = 13;
                  break;
                }
                _context3.next = 10;
                return uni.showModal({
                  title: '⚠️ API次数不足',
                  content: "\u4ECA\u65E5API\u6B21\u6570\u4EC5\u5269 ".concat(apiStats.remaining, " \u6B21\n\n\u662F\u5426\u7EE7\u7EED\u626B\u7801\uFF1F"),
                  confirmText: '继续',
                  cancelText: '取消'
                });
              case 10:
                res = _context3.sent;
                if (res.confirm) {
                  _context3.next = 13;
                  break;
                }
                return _context3.abrupt("return");
              case 13:
                _context3.next = 15;
                return uni.scanCode({
                  // 支持的码类型
                  scanType: ['barCode',
                  // 条形码（一维码）
                  'qrCode',
                  // 二维码
                  'datamatrix',
                  // Data Matrix码
                  'pdf417' // PDF417码
                  ],

                  // 是否只能从相机扫码，默认false（可以从相册选择）
                  onlyFromCamera: false,
                  // 是否自动解码
                  autoDecrypt: true
                });
              case 15:
                scanRes = _context3.sent;
                console.log('📷 扫码结果:', scanRes);
                console.log('📷 条形码:', scanRes.result);
                console.log('📷 条形码类型:', scanRes.scanType);

                // 检查扫码结果
                if (!(!scanRes || !scanRes.result)) {
                  _context3.next = 23;
                  break;
                }
                console.error('❌ 扫码结果为空');
                uni.showToast({
                  title: '扫码失败，请重试',
                  icon: 'none'
                });
                return _context3.abrupt("return");
              case 23:
                // 清洗条形码：去除空格、特殊字符
                cleanBarcode = scanRes.result.trim().replace(/\s/g, '');
                console.log('📷 清洗后条形码:', cleanBarcode);

                // 验证条形码格式
                if (!(!cleanBarcode || cleanBarcode.length < 8)) {
                  _context3.next = 28;
                  break;
                }
                uni.showToast({
                  title: '条形码格式错误',
                  icon: 'none'
                });
                return _context3.abrupt("return");
              case 28:
                _context3.next = 30;
                return _this6.queryDrugByBarcode(cleanBarcode);
              case 30:
                _context3.next = 36;
                break;
              case 32:
                _context3.prev = 32;
                _context3.t0 = _context3["catch"](0);
                console.error('扫码错误:', _context3.t0);
                if (_context3.t0.errMsg && !_context3.t0.errMsg.includes('cancel')) {
                  uni.showToast({
                    title: '扫码失败',
                    icon: 'none'
                  });
                }
              case 36:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, null, [[0, 32]]);
      }))();
    },
    getAPIStats: function getAPIStats() {
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee4() {
        var result;
        return _regenerator.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.prev = 0;
                _context4.next = 3;
                return wx.cloud.callFunction({
                  name: 'drugBarcodeQuery',
                  data: {
                    action: 'getUsageStats'
                  }
                });
              case 3:
                result = _context4.sent;
                if (!(result.result && result.result.success)) {
                  _context4.next = 6;
                  break;
                }
                return _context4.abrupt("return", result.result.data);
              case 6:
                _context4.next = 11;
                break;
              case 8:
                _context4.prev = 8;
                _context4.t0 = _context4["catch"](0);
                console.error('获取API统计失败:', _context4.t0);
              case 11:
                return _context4.abrupt("return", {
                  todayUsed: 0,
                  remaining: 99,
                  limit: 99,
                  warning: false,
                  critical: false
                });
              case 12:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, null, [[0, 8]]);
      }))();
    },
    queryDrugByBarcode: function queryDrugByBarcode(barcode) {
      var _this7 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee6() {
        var _res$result, _res$result2, res, drugInfo, exists, sourceText, stats;
        return _regenerator.default.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                console.log('========================================');
                console.log('🔍 开始查询条形码:', barcode);
                console.log('========================================');
                uni.showLoading({
                  title: '识别中...',
                  mask: true
                });
                _context6.prev = 4;
                // 调用云函数查询（优先本地档案 → API次数检查 → 第三方API）
                console.log('📡 调用云函数...');
                _context6.next = 8;
                return wx.cloud.callFunction({
                  name: 'drugBarcodeQuery',
                  data: {
                    action: 'queryByBarcode',
                    barcode: barcode
                  }
                });
              case 8:
                res = _context6.sent;
                console.log('📡 云函数返回:', res);
                console.log('result.success:', (_res$result = res.result) === null || _res$result === void 0 ? void 0 : _res$result.success);
                console.log('result.data:', (_res$result2 = res.result) === null || _res$result2 === void 0 ? void 0 : _res$result2.data);
                uni.hideLoading();
                if (!(res.result && res.result.success)) {
                  _context6.next = 27;
                  break;
                }
                console.log('✅ 找到药材！');
                // 找到药材
                drugInfo = res.result.data; // 检查是否已添加
                exists = _this7.drugList.some(function (item) {
                  return item.drugName === drugInfo.name && item.specification === drugInfo.specification;
                });
                if (!exists) {
                  _context6.next = 20;
                  break;
                }
                uni.showToast({
                  title: '该药材已添加',
                  icon: 'none'
                });
                return _context6.abrupt("return");
              case 20:
                // 添加到列表最前面(新的在上)
                _this7.drugList.unshift({
                  drugId: drugInfo.drugId || 'temp_' + Date.now(),
                  drugName: drugInfo.name,
                  specification: drugInfo.specification,
                  unit: drugInfo.unit || '盒',
                  manufacturer: drugInfo.manufacturer || '',
                  batch: '',
                  productionDate: '',
                  expireDate: '',
                  daysToExpiry: null,
                  quantity: '',
                  price: '',
                  amount: 0,
                  hasError: false,
                  isTemp: !drugInfo.drugId // 标记是否为临时药材
                });

                // 显示数据来源
                sourceText = {
                  'local': '本地档案',
                  'api': 'API查询'
                }[res.result.source] || '数据库';
                uni.showToast({
                  title: "\u2705 \u5DF2\u6DFB\u52A0 (".concat(sourceText, ")"),
                  icon: 'success',
                  duration: 2000
                });

                // 显示API使用情况
                if (res.result.source === 'api' && res.result.apiStats) {
                  stats = res.result.apiStats;
                  if (stats.warning) {
                    setTimeout(function () {
                      uni.showToast({
                        title: "\u26A0\uFE0F \u4ECA\u65E5\u5269\u4F59".concat(stats.remaining, "\u6B21API"),
                        icon: 'none',
                        duration: 2000
                      });
                    }, 2000);
                  }
                }

                // 振动反馈
                wx.vibrateShort({
                  type: 'light'
                });
                _context6.next = 28;
                break;
              case 27:
                if (res.result && res.result.reason === 'api_limit_exceeded') {
                  // API次数不足
                  uni.showModal({
                    title: '🚫 API次数不足',
                    content: res.result.message + '\n\n' + res.result.suggestion,
                    confirmText: '手动新建',
                    cancelText: '取消',
                    success: function success(modalRes) {
                      if (modalRes.confirm) {
                        _this7.newDrug.barcode = barcode;
                        _this7.showCreateDrug = true;
                      }
                    }
                  });
                } else {
                  // 未找到药材 - 简化录入
                  console.log('❌ 未找到药材，云函数返回:', res.result);
                  uni.hideLoading();

                  // 选择关联方式（只有2种）
                  uni.showActionSheet({
                    title: '首次识别此条形码',
                    itemList: ['从已有药材中选择', '手动新建药材'],
                    success: function () {
                      var _success = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee5(actionRes) {
                        return _regenerator.default.wrap(function _callee5$(_context5) {
                          while (1) {
                            switch (_context5.prev = _context5.next) {
                              case 0:
                                if (!(actionRes.tapIndex === 0)) {
                                  _context5.next = 5;
                                  break;
                                }
                                _context5.next = 3;
                                return _this7.selectExistingDrug(barcode);
                              case 3:
                                _context5.next = 6;
                                break;
                              case 5:
                                if (actionRes.tapIndex === 1) {
                                  // 手动新建药材
                                  _this7.newDrug.barcode = barcode;
                                  _this7.showCreateDrug = true;
                                }
                              case 6:
                              case "end":
                                return _context5.stop();
                            }
                          }
                        }, _callee5);
                      }));
                      function success(_x) {
                        return _success.apply(this, arguments);
                      }
                      return success;
                    }()
                  });
                }
              case 28:
                _context6.next = 35;
                break;
              case 30:
                _context6.prev = 30;
                _context6.t0 = _context6["catch"](4);
                uni.hideLoading();
                console.error('查询失败:', _context6.t0);
                uni.showModal({
                  title: '查询失败',
                  content: '条形码查询失败，是否手动新建药材？',
                  confirmText: '新建',
                  cancelText: '取消',
                  success: function success(modalRes) {
                    if (modalRes.confirm) {
                      _this7.newDrug.barcode = barcode;
                      _this7.showCreateDrug = true;
                    }
                  }
                });
              case 35:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, null, [[4, 30]]);
      }))();
    },
    // 创建映射并查询（首次录入）
    createMappingAndQuery: function createMappingAndQuery(barcode, drugName) {
      var _this8 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee7() {
        var res, drug;
        return _regenerator.default.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                uni.showLoading({
                  title: '查询中...',
                  mask: true
                });
                _context7.prev = 1;
                console.log('🆕 创建映射并查询NMPA...');
                console.log('条形码:', barcode);
                console.log('药材名称:', drugName);
                _context7.next = 7;
                return _this8.$api.callFunction({
                  name: 'drugBarcodeQuery',
                  data: {
                    action: 'createMappingAndQuery',
                    barcode: barcode,
                    drugName: drugName,
                    specification: '',
                    // 可选，用户稍后填写
                    unit: '盒'
                  }
                });
              case 7:
                res = _context7.sent;
                uni.hideLoading();
                console.log('云函数返回:', res.result);
                if (res.result.success && res.result.data) {
                  drug = res.result.data; // 添加到入库列表
                  _this8.drugList.push({
                    drugId: null,
                    barcode: drug.barcode,
                    name: drug.name,
                    specification: drug.specification || '',
                    unit: drug.unit || '盒',
                    manufacturer: drug.manufacturer || '',
                    批号: '',
                    有效期: '',
                    数量: 1,
                    单价: 0,
                    apiSource: drug.apiSource
                  });
                  uni.showToast({
                    title: '✅ 录入成功',
                    icon: 'success',
                    duration: 2000
                  });

                  // 显示提示信息
                  setTimeout(function () {
                    uni.showToast({
                      title: '下次扫码可直接识别',
                      icon: 'none',
                      duration: 3000
                    });
                  }, 2100);
                } else {
                  uni.showModal({
                    title: '提示',
                    content: res.result.message || '查询失败，请稍后重试',
                    showCancel: false
                  });
                }
                _context7.next = 18;
                break;
              case 13:
                _context7.prev = 13;
                _context7.t0 = _context7["catch"](1);
                uni.hideLoading();
                console.error('创建映射失败:', _context7.t0);
                uni.showModal({
                  title: '录入失败',
                  content: '自动录入失败，请手动新建药材档案',
                  confirmText: '新建档案',
                  cancelText: '取消',
                  success: function success(modalRes) {
                    if (modalRes.confirm) {
                      _this8.newDrug.name = drugName;
                      _this8.newDrug.barcode = barcode;
                      _this8.showCreateDrug = true;
                    }
                  }
                });
              case 18:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, null, [[1, 13]]);
      }))();
    },
    // 从已有药材中选择
    selectExistingDrug: function selectExistingDrug(barcode) {
      var _this9 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee9() {
        var res, drugNames;
        return _regenerator.default.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                uni.showLoading({
                  title: '加载药材列表...',
                  mask: true
                });
                _context9.prev = 1;
                _context9.next = 4;
                return _this9.$api.callFunction({
                  name: 'drugSearch',
                  data: {
                    action: 'getAllDrugs'
                  }
                });
              case 4:
                res = _context9.sent;
                uni.hideLoading();
                if (res.result.success && res.result.data && res.result.data.length > 0) {
                  // 显示药材选择器
                  drugNames = res.result.data.map(function (d) {
                    return d.name;
                  });
                  uni.showActionSheet({
                    itemList: drugNames,
                    success: function () {
                      var _success2 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee8(pickRes) {
                        var selectedDrug;
                        return _regenerator.default.wrap(function _callee8$(_context8) {
                          while (1) {
                            switch (_context8.prev = _context8.next) {
                              case 0:
                                selectedDrug = res.result.data[pickRes.tapIndex];
                                console.log('选择的药材:', selectedDrug);

                                // 关联条形码到选中的药材
                                _context8.next = 4;
                                return _this9.linkBarcodeToDrug(barcode, selectedDrug);
                              case 4:
                              case "end":
                                return _context8.stop();
                            }
                          }
                        }, _callee8);
                      }));
                      function success(_x2) {
                        return _success2.apply(this, arguments);
                      }
                      return success;
                    }()
                  });
                } else {
                  uni.showToast({
                    title: '暂无药材档案',
                    icon: 'none'
                  });
                  // 提示手动新建
                  setTimeout(function () {
                    _this9.newDrug.barcode = barcode;
                    _this9.showCreateDrug = true;
                  }, 1000);
                }
                _context9.next = 14;
                break;
              case 9:
                _context9.prev = 9;
                _context9.t0 = _context9["catch"](1);
                uni.hideLoading();
                console.error('加载药材失败:', _context9.t0);
                uni.showToast({
                  title: '加载失败',
                  icon: 'none'
                });
              case 14:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9, null, [[1, 9]]);
      }))();
    },
    // 关联条形码到现有药材
    linkBarcodeToDrug: function linkBarcodeToDrug(barcode, drug) {
      var _this10 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee10() {
        var db;
        return _regenerator.default.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                uni.showLoading({
                  title: '关联中...',
                  mask: true
                });
                _context10.prev = 1;
                _context10.next = 4;
                return _this10.$api.callFunction({
                  name: 'drugSearch',
                  data: {
                    action: 'updateDrugBarcode',
                    drugId: drug._id,
                    barcode: barcode
                  }
                });
              case 4:
                // 直接创建条形码映射到数据库（不需要云函数）
                db = wx.cloud.database();
                _context10.next = 7;
                return db.collection('barcode_mapping').add({
                  data: {
                    barcode: barcode,
                    drugName: drug.name,
                    specification: drug.specification || '',
                    unit: drug.unit || '盒',
                    manufacturer: drug.manufacturer || '',
                    approvalNumber: drug.approvalNumber || '',
                    isPrescription: drug.isPrescription || false,
                    prescriptionType: drug.prescriptionType || '非处方药',
                    source: 'manual',
                    createTime: db.serverDate()
                  }
                });
              case 7:
                uni.hideLoading();

                // 添加到入库列表
                _this10.drugList.push({
                  drugId: drug._id,
                  barcode: barcode,
                  name: drug.name,
                  specification: drug.specification || '',
                  unit: drug.unit || '盒',
                  manufacturer: drug.manufacturer || '',
                  批号: '',
                  有效期: '',
                  数量: 1,
                  单价: drug.price || 0
                });
                uni.showToast({
                  title: '✅ 关联成功',
                  icon: 'success'
                });
                setTimeout(function () {
                  uni.showToast({
                    title: '下次扫码可直接识别',
                    icon: 'none',
                    duration: 2000
                  });
                }, 1500);
                _context10.next = 18;
                break;
              case 13:
                _context10.prev = 13;
                _context10.t0 = _context10["catch"](1);
                uni.hideLoading();
                console.error('关联失败:', _context10.t0);
                uni.showToast({
                  title: '关联失败',
                  icon: 'none'
                });
              case 18:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10, null, [[1, 13]]);
      }))();
    },
    // ========== 新建药材 ==========
    onUnitChange: function onUnitChange(e) {
      this.unitIndex = e.detail.value;
      this.newDrug.unit = this.unitOptions[e.detail.value];
    },
    // 语音输入提示（使用输入法语音功能）
    startVoiceInput: function startVoiceInput(field) {
      // 根据字段显示不同提示
      var fieldNames = {
        'name': '药材名称',
        'spec': '规格'
      };
      uni.showModal({
        title: '💡 语音输入提示',
        content: "\u8BF7\u4F7F\u7528\u8F93\u5165\u6CD5\u7684\u8BED\u97F3\u529F\u80FD\uFF1A\n\n1. \u70B9\u51FB".concat(fieldNames[field], "\u8F93\u5165\u6846\n2. \u70B9\u51FB\u952E\u76D8\u4E0A\u7684\uD83C\uDFA4\u56FE\u6807\n3. \u8BF4\u51FA").concat(fieldNames[field], "\n4. \u7CFB\u7EDF\u81EA\u52A8\u8BC6\u522B\u5E76\u586B\u5165\n\n\u5FAE\u4FE1\u3001\u641C\u72D7\u7B49\u8F93\u5165\u6CD5\u90FD\u652F\u6301\u8BED\u97F3\u8F93\u5165"),
        showCancel: false,
        confirmText: '知道了'
      });
    },
    // ========== 表单操作 ==========
    onDateChange: function onDateChange(index, field, value) {
      this.drugList[index][field] = value;

      // 计算距有效期天数
      if (this.drugList[index].expireDate) {
        var expDate = new Date(this.drugList[index].expireDate);
        var today = new Date();
        var days = Math.floor((expDate - today) / (1000 * 60 * 60 * 24));
        this.drugList[index].daysToExpiry = days;
      }
      this.validateRow(index);
    },
    calculateAmount: function calculateAmount(index) {
      var item = this.drugList[index];
      var qty = Number(item.quantity) || 0;
      var price = Number(item.price) || 0;
      item.amount = qty * price;
    },
    validateRow: function validateRow(index) {
      var item = this.drugList[index];
      var hasError = false;
      if (!item.batch || !item.productionDate || !item.expireDate || !item.quantity || item.quantity <= 0) {
        hasError = true;
      }
      item.hasError = hasError;
    },
    formatAmount: function formatAmount(amount) {
      if (!amount) return '0.00';
      return Number(amount).toFixed(2);
    },
    deleteDrug: function deleteDrug(index) {
      var _this11 = this;
      uni.showModal({
        title: '确认删除',
        content: '确定要删除这个药材吗？',
        success: function success(res) {
          if (res.confirm) {
            _this11.drugList.splice(index, 1);
          }
        }
      });
    },
    // ========== 提交 ==========
    validateForm: function validateForm() {
      if (this.drugList.length === 0) {
        uni.showToast({
          title: '请至少添加一个药材',
          icon: 'none'
        });
        return false;
      }
      for (var i = 0; i < this.drugList.length; i++) {
        var item = this.drugList[i];
        var rowNum = i + 1;
        if (!item.batch) {
          uni.showToast({
            title: "\u7B2C".concat(rowNum, "\u884C\uFF1A\u6279\u53F7\u4E0D\u80FD\u4E3A\u7A7A"),
            icon: 'none'
          });
          return false;
        }
        if (!item.productionDate) {
          uni.showToast({
            title: "\u7B2C".concat(rowNum, "\u884C\uFF1A\u751F\u4EA7\u65E5\u671F\u4E0D\u80FD\u4E3A\u7A7A"),
            icon: 'none'
          });
          return false;
        }
        if (!item.expireDate) {
          uni.showToast({
            title: "\u7B2C".concat(rowNum, "\u884C\uFF1A\u6709\u6548\u671F\u4E0D\u80FD\u4E3A\u7A7A"),
            icon: 'none'
          });
          return false;
        }
        if (item.daysToExpiry !== null && item.daysToExpiry < 0) {
          uni.showToast({
            title: "\u7B2C".concat(rowNum, "\u884C\uFF1A\u836F\u6750\u5DF2\u8FC7\u671F\uFF0C\u4E0D\u80FD\u5165\u5E93"),
            icon: 'none'
          });
          return false;
        }
        if (!item.quantity || item.quantity <= 0) {
          uni.showToast({
            title: "\u7B2C".concat(rowNum, "\u884C\uFF1A\u6570\u91CF\u5FC5\u987B\u5927\u4E8E0"),
            icon: 'none'
          });
          return false;
        }
      }
      if (!this.operatorSign) {
        uni.showToast({
          title: '请先签名',
          icon: 'none'
        });
        return false;
      }
      return true;
    },
    submit: function submit() {
      var _this12 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee11() {
        var userInfo, result, _result$result;
        return _regenerator.default.wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                if (_this12.validateForm()) {
                  _context11.next = 2;
                  break;
                }
                return _context11.abrupt("return");
              case 2:
                uni.showLoading({
                  title: '提交中...',
                  mask: true
                });
                _context11.prev = 3;
                userInfo = uni.getStorageSync('userInfo');
                _context11.next = 7;
                return wx.cloud.callFunction({
                  name: 'inRecords',
                  data: {
                    action: 'create',
                    data: {
                      recordNo: _this12.recordNo,
                      remark: _this12.remark,
                      items: _this12.drugList.map(function (item) {
                        return {
                          drugId: item.drugId,
                          drugName: item.drugName,
                          specification: item.specification,
                          spec: item.specification,
                          unit: item.unit,
                          manufacturer: item.manufacturer,
                          batch: item.batch,
                          productionDate: item.productionDate,
                          expireDate: item.expireDate,
                          quantity: Number(item.quantity),
                          price: Number(item.price) || 0
                        };
                      }),
                      operator: _this12.operator,
                      operatorId: (userInfo === null || userInfo === void 0 ? void 0 : userInfo._id) || '',
                      operatorSign: _this12.operatorSign,
                      operatorSignTime: new Date().toISOString(),
                      status: 'pending_review'
                    }
                  }
                });
              case 7:
                result = _context11.sent;
                uni.hideLoading();
                if (!(result.result && result.result.success)) {
                  _context11.next = 14;
                  break;
                }
                uni.showToast({
                  title: '提交成功，等待复核',
                  icon: 'success',
                  duration: 2000
                });
                setTimeout(function () {
                  uni.navigateBack();
                }, 2000);
                _context11.next = 15;
                break;
              case 14:
                throw new Error(((_result$result = result.result) === null || _result$result === void 0 ? void 0 : _result$result.message) || '提交失败');
              case 15:
                _context11.next = 22;
                break;
              case 17:
                _context11.prev = 17;
                _context11.t0 = _context11["catch"](3);
                uni.hideLoading();
                console.error('提交失败:', _context11.t0);
                uni.showToast({
                  title: _context11.t0.message || '提交失败',
                  icon: 'none'
                });
              case 22:
              case "end":
                return _context11.stop();
            }
          }
        }, _callee11, null, [[3, 17]]);
      }))();
    }
  }
};
exports.default = _default;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 2)["default"], __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/wx.js */ 1)["default"]))

/***/ }),

/***/ 144:
/*!************************************************************************************************!*\
  !*** D:/AK-PMS/pages-sub/in/add.vue?vue&type=style&index=0&id=58f3a51d&lang=scss&scoped=true& ***!
  \************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_2_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_5_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_add_vue_vue_type_style_index_0_id_58f3a51d_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../HBuilderX/HBuilderX/plugins/uniapp-cli/node_modules/mini-css-extract-plugin/dist/loader.js??ref--8-oneOf-1-0!../../../HBuilderX/HBuilderX/plugins/uniapp-cli/node_modules/css-loader/dist/cjs.js??ref--8-oneOf-1-1!../../../HBuilderX/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/stylePostLoader.js!../../../HBuilderX/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--8-oneOf-1-2!../../../HBuilderX/HBuilderX/plugins/uniapp-cli/node_modules/postcss-loader/src??ref--8-oneOf-1-3!../../../HBuilderX/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/sass-loader/dist/cjs.js??ref--8-oneOf-1-4!../../../HBuilderX/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--8-oneOf-1-5!../../../HBuilderX/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../HBuilderX/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./add.vue?vue&type=style&index=0&id=58f3a51d&lang=scss&scoped=true& */ 145);
/* harmony import */ var _HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_2_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_5_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_add_vue_vue_type_style_index_0_id_58f3a51d_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_2_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_5_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_add_vue_vue_type_style_index_0_id_58f3a51d_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_2_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_5_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_add_vue_vue_type_style_index_0_id_58f3a51d_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_2_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_5_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_add_vue_vue_type_style_index_0_id_58f3a51d_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_2_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_5_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_add_vue_vue_type_style_index_0_id_58f3a51d_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ 145:
/*!****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js??ref--8-oneOf-1-0!./node_modules/css-loader/dist/cjs.js??ref--8-oneOf-1-1!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--8-oneOf-1-2!./node_modules/postcss-loader/src??ref--8-oneOf-1-3!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/sass-loader/dist/cjs.js??ref--8-oneOf-1-4!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--8-oneOf-1-5!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!D:/AK-PMS/pages-sub/in/add.vue?vue&type=style&index=0&id=58f3a51d&lang=scss&scoped=true& ***!
  \****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin
    if(false) { var cssReload; }
  

/***/ })

},[[138,"common/runtime","common/vendor"]]]);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages-sub/in/add.js.map