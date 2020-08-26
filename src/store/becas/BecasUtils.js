import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default {
  //namespaced: true,
  state: {
    snackbar: {
      visible: false,
      color: "secondary",
      text: "",
      timeout: 5000,
      multiline: false
    },
  },
  mutations: {
    //snackbar
    alert(state, payload) {
      state.snackbar.text = payload.text;
      state.snackbar.multiline = payload.text.length > 50;
      // Si es mas de 50 caracteres definirlo como multilinea
      if (payload.multiline) {
        state.snackbar.multiline = payload.multiline;
      }
      // Color para mensajes de error o éxito
      if (payload.color) {
        state.snackbar.color = payload.color;
      }
      // Tiempo de duración
      if (payload.timeout) {
        state.snackbar.timeout = payload.timeout;
      }
      state.snackbar.visible = true;
    },

    closeAlert(state) {
      state.snackbar.visible = false;
      state.snackbar.multiline = false;
      state.snackbar.text = null;
    },
    ////snackbar fin
  },
    actions: {
      alert(context, payload){
        context.commit('alert', payload)
      },
      closeAlert(context){
        context.commit('closeAlert')
      },
    },

    getters : {
      getSnackBar(state){
        return state.snackbar
      },
    },
  };