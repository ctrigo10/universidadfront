import Vue from 'vue'
import Vuex from 'vuex'
// import general from '@/services/general'

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
    // permisoUsuario: false
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
    // uniVerificarPermiso(state, payload){
    //   let idRol = null;
    //   switch (payload) {
    //     case 'universidad':
    //       idRol = 51;
    //       break;
    //     case 'tecnico':
    //       idRol = 48;
    //       break;
    //   }
    //   let user = general.getUser()
    //   if (user) {
    //     let rolUsuario = user.roles.find(rol => rol.rol_tipo_id == idRol)
    //     if (rolUsuario) {
    //       state.permisoUsuario = true
    //     }
    //   }
    //   state.permisoUsuario = false
    // }
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