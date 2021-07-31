<template>
  <div
    class="el-transfer-panel"
    :class="{ characterLeft: !isRight, selectedNum: isRight }"
  >
    <p class=" currentQuantityBox">
      <!-- v-show="false" -->
      <el-checkbox
        v-if="!isRight"
        v-model="allChecked"
        :class="{ currentQuantityBox: !isRight, currentQuantityBox: isRight }"
        @change="handleAllCheckedChange"
        :indeterminate="isIndeterminate"
      >
        {{ pinyinQuery ? "首字母为" + pinyinQuery + "的人脸库" : title }}
        <span>{{ checkedSummary }}项</span>
      </el-checkbox>
      <span v-if="isRight">
        <div class="fl selectedPersonNum">
          {{ title }}{{ this.data.length }}项
        </div>
        <!--没有选择人物时allEmpty不可用，有选择人物时加上active-->
        <!-- <a href="javascript:;"  class="fr allEmpty">全部清空</a> -->
        <el-checkbox-group v-model="allChecked" class="fr allEmpty" :class="{active : this.data.length > 0}">
          <el-checkbox-button @change="handleAllCheckedChange(true)"
            >全部清空</el-checkbox-button
          >
        </el-checkbox-group>
      </span>
    </p>

    <div
      :class="['el-transfer-panel__body', hasFooter ? 'is-with-footer' : '']"
    >
      <div class="textName">
        <el-input
          class="el-transfer-panel__filter"
          v-model="query"
          size="small"
          :placeholder="placeholder"
          @mouseenter.native="inputHover = true"
          @mouseleave.native="inputHover = false"
          v-if="filterable"
        >
          <i
            slot="suffix"
            :class="['el-input__icon', 'el-icon-' + inputIcon]"
            @click="clearQuery"
          ></i>
        </el-input>
      </div>
      <div class="letterFilter clearfix" v-if="!isRight && !this.query">
        <label class="fl">首字母</label>
        <div class="fl btnLetter">
          <a
            href="javascript:;"
            v-for="(item, index) in pinyinQueryList"
            :class="{ active: pinyinActive == item, allLetter: index == 0 }"
            :key="index"
            @click="filterablePinYinFun(item)"
            >{{ item == "" ? "全部" : item }}</a
          >
        </div>
      </div>
      <el-checkbox-group
        v-model="checked"
        v-show="!hasNoMatch && data.length > 0"
        :class="{ 'is-filterable': filterable }"
        class="el-transfer-panel__list"
      >
        <!-- <el-checkbox
            class="el-transfer-panel__item"
            :label="item[keyProp]"
            :disabled="item[disabledProp]"
            :key="item[keyProp]"
            v-for="item in filteredData">
            <option-content :option="item"></option-content>
              <span v-if="isRight" class="icon-close" style="float:right;margin-right:10px;width:20px;margin-top:5px;line-height:20px;text-align:center;height:20px;background-color:#ddd;border-radius:50%;">×</span>
          </el-checkbox> -->
        <!--此处加了个判断是否为右边框给其加上相应的关闭按钮，isRight通过属性值进行传入-->

        <el-checkbox-button
          class="el-transfer-panel__item"
          v-for="item in filteredData"
          :key="item[keyProp]"
          :label="item[keyProp]"
        >
          {{ item.label }}
          <svg
            class="icon svg-icon-closeWhite"
            aria-hidden="true"
            v-if="isRight"
          >
            <use xlink:href="#icontubiaozhizuomoban4" fill="#fff"></use>
          </svg>
          <!-- <span v-if="isRight" class="icon-close" style="float:right;margin-right:10px;width:20px;margin-top:5px;line-height:20px;text-align:center;height:20px;background-color:#ddd;border-radius:50%;">×</span> -->
        </el-checkbox-button>
      </el-checkbox-group>

      <p class="el-transfer-panel__empty" v-show="hasNoMatch">
        {{ t("el.transfer.noMatch") }}
      </p>
      <div
        class="el-transfer-panel__empty"
        v-show="data.length === 0 && !hasNoMatch"
      >
        <!-- {{ t('el.transfer.noData') }} -->
        <div class="noDataBox" v-show="!hasNoMatch && filteredData.length == 0">
          <div>
            <svg class="icon svg-icon-diaOperWh" aria-hidden="true">
              <use xlink:href="#iconkongbaiye1"></use>
            </svg>
          </div>
          <div class="noDataWord">暂无数据</div>
        </div>
      </div>
    </div>
    <p class="el-transfer-panel__footer" v-if="hasFooter">
      <slot></slot>
    </p>
  </div>
</template>

<script>
import ElCheckboxGroup from "element-ui/packages/checkbox-group";
import ElCheckbox from "element-ui/packages/checkbox";
import ElInput from "element-ui/packages/input";
import Locale from "element-ui/src/mixins/locale";

export default {
  mixins: [Locale],

  name: "ElTransferPanel",

  componentName: "ElTransferPanel",

  components: {
    ElCheckboxGroup,
    ElCheckbox,
    ElInput,
    OptionContent: {
      props: {
        option: Object
      },
      render(h) {
        const getParent = vm => {
          if (vm.$options.componentName === "ElTransferPanel") {
            return vm;
          } else if (vm.$parent) {
            return getParent(vm.$parent);
          } else {
            return vm;
          }
        };
        const panel = getParent(this);
        const transfer = panel.$parent || panel;
        return panel.renderContent ? (
          panel.renderContent(h, this.option)
        ) : transfer.$scopedSlots.default ? (
          transfer.$scopedSlots.default({ option: this.option })
        ) : (
          <span>
            {this.option[panel.labelProp] || this.option[panel.keyProp]}
          </span>
        );
      }
    }
  },

  props: {
    data: {
      type: Array,
      default() {
        return [];
      }
    },
    renderContent: Function,
    placeholder: String,
    title: String,
    filterable: Boolean,
    isRight: Boolean,
    format: Object,
    filterMethod: Function,
    defaultChecked: Array,
    props: Object
  },

  data() {
    return {
      checked: [],
      allChecked: false,
      query: "",
      inputHover: false,
      checkChangeByUser: true,
      pinyinQuery: "",
      pinyinQueryList: [
        "",
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "O",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "U",
        "V",
        "W",
        "X",
        "Y",
        "Z"
      ],
      pinyinActive: ""
    };
  },

  watch: {
    checked(val, oldVal) {
      this.updateAllChecked();
      if (this.checkChangeByUser) {
        const movedKeys = val
          .concat(oldVal)
          .filter(v => val.indexOf(v) === -1 || oldVal.indexOf(v) === -1);
        this.$emit("checked-change", val, movedKeys);
      } else {
        this.$emit("checked-change", val);
        //console.log("Check by User");
        this.checkChangeByUser = true;
      }
    },

    data() {
      const checked = [];
      const filteredDataKeys = this.filteredData.map(
        item => item[this.keyProp]
      );
      this.checked.forEach(item => {
        if (filteredDataKeys.indexOf(item) > -1) {
          checked.push(item);
        }
      });
      this.checkChangeByUser = false;
      this.checked = checked;
    },

    checkableData() {
      this.updateAllChecked();
    },

    defaultChecked: {
      immediate: true,
      handler(val, oldVal) {
        if (
          oldVal &&
          val.length === oldVal.length &&
          val.every(item => oldVal.indexOf(item) > -1)
        )
          return; 
        const checked = [];
        const checkableDataKeys = this.checkableData.map(
          item => item[this.keyProp]
        );
        val.forEach(item => {
          if (checkableDataKeys.indexOf(item) > -1) {
            checked.push(item);
          }
        });
        this.checkChangeByUser = false;
        this.checked = checked;
      }
    },

    pinyinQuery() {}
  },

  computed: {
    filteredData() {
      return this.data.filter(item => {
        if (typeof this.filterMethod === "function") {
          return this.filterMethod(this.query, item);
        } else {
          const label = item[this.labelProp] || item[this.keyProp].toString();
          const label2 = item[this.pinyinProp];
          if(this.query){
            this.pinyinQuery = '';
            this.pinyinActive = '';
          }
          return (
            label.toLowerCase().indexOf(this.query.toLowerCase()) > -1 &&
            label2.indexOf(this.pinyinQuery) > -1
          );
        }
      });
    },

    checkableData() {
      return this.filteredData.filter(item => !item[this.disabledProp]);
    },

    checkedSummary() {
      const checkedLength = this.checked.length;
      const dataLength = this.data.length;
      const { noChecked, hasChecked } = this.format;
      if (noChecked && hasChecked) {
        return checkedLength > 0
          ? hasChecked
              .replace(/\${checked}/g, checkedLength)
              .replace(/\${total}/g, dataLength)
          : noChecked.replace(/\${total}/g, dataLength);
      } else {
        return `${checkedLength}/${dataLength}`;
      }
    },

    isIndeterminate() {
      const checkedLength = this.checked.length;
      return checkedLength > 0 && checkedLength < this.checkableData.length;
    },

    hasNoMatch() {
      return this.query.length > 0 && this.filteredData.length === 0;
    },

    inputIcon() {
      return this.query.length > 0 && this.inputHover
        ? "circle-close"
        : "search";
    },

    labelProp() {
      return this.props.label || "label";
    },

    keyProp() {
      return this.props.key || "key";
    },

    pinyinProp() {
      return this.props.pinyin || "pinyin";
    },

    disabledProp() {
      return this.props.disabled || "disabled";
    },

    hasFooter() {
      return !!this.$slots.default;
    }
  },

  methods: {
    updateAllChecked() {
      const checkableDataKeys = this.checkableData.map(
        item => item[this.keyProp]
      );
      this.allChecked =
        checkableDataKeys.length > 0 &&
        checkableDataKeys.every(item => this.checked.indexOf(item) > -1);
    },

    handleAllCheckedChange(value) {
      console.log(this.checkableData)
      this.checked = value
        ? this.checkableData.map(item => item[this.keyProp])
        : [];
    },

    filterablePinYinFun(pinyin) {
      this.pinyinQuery = pinyin;
      this.pinyinActive = pinyin;
    },

    clearQuery() {
      if (this.inputIcon === "circle-close") {
        this.query = "";
      }
    }
  }
};
</script>
