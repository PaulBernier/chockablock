import Vue from "vue";
import "./plugins/vuetify";
import App from "./App.vue";
import router from "./router";
import { createProvider } from "./vue-apollo";
import moment from "moment";

Vue.config.productionTip = false;

Vue.filter("formatDate", function (timestamp) {
  return moment(timestamp * 1000).format("YYYY-MM-DD HH:mm:ss ([GMT]Z)");
});

Vue.filter("formatRange", function (range) {
  return `[${range.min}, ${range.max}]`;
});

new Vue({
  router,
  apolloProvider: createProvider(),
  render: (h) => h(App),
}).$mount("#app");
