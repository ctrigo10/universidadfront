import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default {
  //namespaced: true,
  state: {
    uniSnackbar: {
      visible: false,
      color: "success",
      text: "",
      timeout: 5000,
      multiline: false
    },
  },
  mutations: {
    
    uniAlert(state, payload) {
      state.uniSnackbar.text = payload.text;
      state.uniSnackbar.multiline = payload.text.length > 50;
      if (payload.multiline) {
        state.uniSnackbar.multiline = payload.multiline;
      }
      // Color para mensajes de error o éxito
      if (payload.color) {
        state.uniSnackbar.color = payload.color;
      }
      // Tiempo de duración
      if (payload.timeout) {
        state.uniSnackbar.timeout = payload.timeout;
      }
      state.uniSnackbar.visible = true;
    },

    uniCloseAlert(state) {
      state.uniSnackbar.visible = false;
      state.uniSnackbar.multiline = false;
      state.uniSnackbar.text = null;
    },
    //uniSnackbar fin
  },
    // actions: {
    //   alert(context, payload){
    //     context.commit('alert', payload)
    //   },
    //   closeAlert(context){
    //     context.commit('closeAlert')
    //   },
    // },

  getters: {
    getUniSnackbar(state){
      return state.uniSnackbar
    },
  },
};