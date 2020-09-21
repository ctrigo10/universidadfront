import Vue from 'vue'
import Vuex from 'vuex'
//import axios from "axios";

Vue.use(Vuex)

export default {
  state: {
    idUniversidad : '',
    carreras: '',
  },
  mutations : {
    seleccionarUniversidad(state , payload){
      // console.log(payload)
      state.idUniversidad = payload;
      // state.idUniversidad = { ...state.idUniversidad, ...payload };
    },
  },
  actions : {
    getCarreras(){
      
    }
  },
  getters : {
    idUniversidad: state => state.idUniversidad
  }
}
