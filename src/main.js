import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import router from "./router";
import store from "./store";
import VueSweetalert2 from "vue-sweetalert2";
import confirmDialog from "vuetify-vuejs-confirmdialog";
import HighchartsVue from "highcharts-vue";

import "sweetalert2/dist/sweetalert2.min.css";

const options = {
  confirmButtonColor: "#1976d2",
  cancelButtonColor: "#ff7674",
};

Vue.use(HighchartsVue);
Vue.use(VueSweetalert2, options);
Vue.use(confirmDialog, {
  context: { vuetify },
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
