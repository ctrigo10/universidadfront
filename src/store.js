import Vue from "vue";
import Vuex from "vuex";
import Convocatorias from "@/store/becas/Convocatorias";
import BecasUtils from "@/store/becas/BecasUtils";
import axios from "axios";
import Service from "./services/general";

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
      Service.setToken(token);
    },
    authError(state) {
      state.token = "";
      state.status = "error";
      Service.removeToken();
    },
    authLogout(state) {
      state.token = "";
      state.status = "";
      Service.removeToken();
    },
  },
  actions: {
    login({ commit }, ldata) {
      return new Promise((resolve, reject) => {
        axios
          .post(Service.getBase() + "usuario", ldata)
          .then((response) => {
            let token = response.data.token;
            Service.setUser(response.data);
            commit("authSuccess", token);
            resolve({ status: "success", msg: response.data.message });
            // evaluar cualquier condicion
          })
          .catch((err) => {
            Service.removeUser();
            commit("authError", "Error en autenticación");
            reject({ status: "error", msg: err.message }); //revisar si viene en data
          });
      });
    },
    logout({ commit }) {
      // eslint-disable-next-line
      return new Promise((resolve, reject) => {
        Service.removeUser();
        commit("authLogout");
        resolve();
      });
    },
  },
  getters: {
    isAuthenticated: (state) => !!state.token,
    authStatus: (state) => state.status,
  },

  modules: {
    Convocatorias,
    BecasUtils,
  },
});
