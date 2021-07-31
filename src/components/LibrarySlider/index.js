import LibrarySlider from "./index.vue";

/* istanbul ignore next */
LibrarySlider.install = function(Vue) {
  Vue.component(LibrarySlider.name, LibrarySlider);
};

export default LibrarySlider;
