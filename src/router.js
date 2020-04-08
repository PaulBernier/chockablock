import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
    },
    {
      path: "/control",
      name: "control",
      component: () =>
        import(/* webpackChunkName: "control" */ "./views/Control.vue"),
    },
    {
      path: "/loadtest-history",
      name: "loadtest-history",
      component: () =>
        import(
          /* webpackChunkName: "loadtest-history" */ "./views/LoadTestHistory.vue"
        ),
    },
    {
      path: "/loadtest/:id",
      name: "loadtest-details",
      component: () =>
        import(
          /* webpackChunkName: "loadtest-details" */ "./views/LoadTestDetails.vue"
        ),
    },
  ],
});
