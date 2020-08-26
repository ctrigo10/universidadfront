import Vue from "vue";
import Vuex from "vuex";
import Convocatorias from '@/store/becas/Convocatorias'
import BecasUtils from '@/store/becas/BecasUtils'
// import axios from "axios";
// import Service from "./services/general";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    status: "",
    token: sessionStorage.getItem("token") || "",
  },
  mutations: {
    authSuccess(state, token) {
      state.token = token;
      state.status = "success";
    },
    authError(state) {
      state.token = "";
      state.status = "error";
    },
    authLogout(state) {
      state.token = "";
      state.status = "";
    },
  },
  actions: {
    login({ commit }, ldata) {
      console.log(ldata);
      return new Promise((resolve, reject) => {
        let token = "gdhaskdamdag";
        if (token) {
          sessionStorage.setItem("token", token);
          commit("authSuccess", token);
          resolve({ msg: "auth success" });
        } else {
          reject({ msg: "auth error" });
        }
      });
    },
    logout({ commit }) {
      // eslint-disable-next-line
      return new Promise((resolve, reject) => {
        commit("authLogout");
        sessionStorage.removeItem("token");
        resolve();
      });
    },
  },
  getters: {
    isAuthenticated: (state) => !!state.token,
    authStatus: (state) => state.status,
  },

  modules:{
    Convocatorias,
    BecasUtils,
  }
});
