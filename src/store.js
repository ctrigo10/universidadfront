import Vue from "vue";
import Vuex from "vuex";
import Convocatorias from "@/store/becas/Convocatorias";
import Universidades from "@/store/becas/Universidades";
import Carreras from "@/store/becas/Carreras";
import BecasUtils from "@/store/becas/BecasUtils";
import Usuarios from "@/store/becas/Usuarios";
import Solicitudes from "@/store/becas/Solicitudes";
import Cuestionario from "@/store/becas/Cuestionario";

import UniUtils from "@/store/universidades/UniUtils.js";

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
          .post(Service.getLogin(), ldata)
          .then((response) => {
            let token = response.data.token;
            Service.setUser(response.data.data);
            Service.setMenuPreuniversitario(response.data.data.roles);
            commit("authSuccess", token);
            resolve({
              status: "success",
              msg: response.data.message,
              nombre: response.data.data.nombre,
            });
            // evaluar cualquier condicion
          })
          .catch((err) => {
            console.log(err);
            Service.removeUser();
            commit("authError", "Error en autenticación");
            reject({ status: "error", msg: err.response.data }); //revisar si viene en data
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
    BecasUtils,
    Convocatorias,
    Carreras,
    Universidades,
    Usuarios,
    Solicitudes,
    UniUtils,
  },
});
