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
    display:{
      name: '',
    }
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
    agredarDisplay(state,item){
      state.display.name = item;
    },
  },
  actions: {
    alert(context, payload) {
      context.commit('alert', payload)
    },
    closeAlert(context) {
      context.commit('closeAlert')
    },
    agredarDisplay(context, item){
      context.commit('agredarDisplay', item)
    }
  },

  getters: {
    getSnackBar(state) {
      return state.snackbar
    },
    getCapitalize: () => (s) => {
      s = s.toLowerCase();
      //return s.charAt(0).toUpperCase() + s.slice(1);
      return s.replace(/(^|\s)([a-z])/g, function (m, p1, p2) {
        return p1 + p2.toUpperCase();
      });
    },
    getConvertirFecha: () => (fecha) => {
      let [year, month, day] = fecha.split("-");
      return `${day}/${month}/${year}`;
    },
    getDateNowFull: () => (opcion) => {
      let date_ob = new Date();

      // adjust 0 before single digit date
      let date = ("0" + date_ob.getDate()).slice(-2);

      // current month
      let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

      // current year
      let year = date_ob.getFullYear();

      // current hours
      let hours = date_ob.getHours();

      // current minutes
      let minutes = date_ob.getMinutes();

      // current seconds
      let seconds = date_ob.getSeconds();

      if (opcion == 0)
        // prints date & time in YYYY-MM-DD HH:MM:SS format
        return date + "/" + month + "/" + year + ", " + hours + ":" + minutes + ":" + seconds;

      else

        return date + "/" + month + "/" + year;
    },
    getDisplayGrande(state){
      return (state.display.name == 'lg' || state.display.name == 'xl' || state.display.name == 'md')? true : false;
    }
  },
};