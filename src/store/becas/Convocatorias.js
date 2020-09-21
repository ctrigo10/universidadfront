import Vue from 'vue'
import Vuex from 'vuex'
//import axios from "axios";
import becasService from "@/services/becasService"

Vue.use(Vuex)

export default {
  state: {
    index : null,
    convocatorias:[],
  },
  mutations : {
    cargarConvocatoriasActual(state, data){
      try{
        state.convocatorias = [];
        for(let convocatoria of data.data){
          if(convocatoria.seleccionar_becados == true)convocatoria.seleccionar_becados_text = "Si"
          else convocatoria.seleccionar_becados_text = "No"
          //// Convertir fechas
          let [year1, month1, day1] = convocatoria.fecha_inicio_registro_beca.split("-");let date1 = `${day1}/${month1}/${year1}`;
          let [year2, month2, day2] = convocatoria.fecha_fin_registro_beca.split("-");let date2 = `${day2}/${month2}/${year2}`;
          let [year3, month3, day3] = convocatoria.fecha_inicio_solicitud_beca.split("-");let date3 = `${day3}/${month3}/${year3}`;
          let [year4, month4, day4] = convocatoria.fecha_fin_solicitud_beca.split("-");let date4 = `${day4}/${month4}/${year4}`;
          convocatoria.fecha_registro_convocatoria = `${date1} al ${date2}`;
          convocatoria.fecha_solicitud_convocatoria = `${date3} al ${date4}`
          state.convocatorias.push(convocatoria);
      }}
      catch(error){
        console.log(error)
      }
    },

    agregarConvocatoria(state, item){
      try{
        if(item.seleccionar_becados == true)item.seleccionar_becados_text = "Si"
        else item.seleccionar_becados_text = "No"
        //converertir fechas
        let [year1, month1, day1] = item.fecha_inicio_registro_beca.split("-");let date1 = `${day1}/${month1}/${year1}`;
        let [year2, month2, day2] = item.fecha_fin_registro_beca.split("-");let date2 = `${day2}/${month2}/${year2}`;
        let [year3, month3, day3] = item.fecha_inicio_solicitud_beca.split("-");let date3 = `${day3}/${month3}/${year3}`;
        let [year4, month4, day4] = item.fecha_fin_solicitud_beca.split("-");let date4 = `${day4}/${month4}/${year4}`;
        item.fecha_registro_convocatoria = `${date1} al ${date2}`;
        item.fecha_solicitud_convocatoria = `${date3} al ${date4}`;
        state.convocatorias.push(item)
      }catch(error){
        console.log(error)
      }
    },

    editarConvocatoria(state , item){
      Object.assign(state.convocatorias[item.index], item.item);
    },

    eliminarConvocatoria(state, index){
      state.convocatorias.splice(index, 1)
    },
  },
  actions : {
    async cargarConvocatoriasActual(context){
      //let result = await axios.get("http://localhost:3000/beca/actual");
      //let result = await axios.get(`${becasService.getBaseBeca()}actual`);
        const result = await becasService.getConvocatoriasActual();
        context.commit("cargarConvocatoriasActual", result.data)
    },

    async agregarConvocatoria( context , item){
      item = await becasService.addConvocatoria(item);
      context.commit('agregarConvocatoria', item.data.data);
    },

    async editarConvocatoria(context, item){
      await becasService.editConvocatoria(item.item);
      context.commit('editarConvocatoria',item);
    },

     async eliminarConvocatoria(context, item){
      await becasService.deleteConvocatoria(item);
      let index = context.state.convocatorias.indexOf(item);
      context.commit('eliminarConvocatoria', index);
    },
  },
  getters : {
    getConvocatorias(state){
      if(state.convocatorias.length > 0)
        return state.convocatorias;
      else
        return [];
    },

    getConvocatoriaIndex : (state) => (item)=>{
      return state.convocatorias.indexOf(item)
    },

   /* getConvocatoriaIndex(state){
      return item => {
        return state.convocatorias.indexOf(item)
      }
    },*/
    getConvocatoriaActualByVersion: (state) => (version)=>{
      if(state.convocatorias.length > 0)
        return state.convocatorias.find(convocatorias => convocatorias.version === version - 1)
      else
        return 0;
    },

    getConvocatoriaLast(state){
      if(state.convocatorias.length > 0)
        return state.convocatorias[state.convocatorias.length - 1]
      else
        return [];
    },

    getEsFechaRegistro(state){
      if(state.convocatorias.length > 0){
        let fechaAhora = new Date();
        fechaAhora.setHours(0,0,0,0);
        let fechaInicio = new Date(state.convocatorias[state.convocatorias.length - 1].fecha_inicio_registro_beca+"T00:00:00");
        let fechaFin = new Date(state.convocatorias[state.convocatorias.length - 1].fecha_fin_registro_beca+"T00:00:00");
        if(fechaInicio <= fechaAhora && fechaAhora <= fechaFin)return true;
        else return false;
      }
      else
        return false;
    },

    getEsFechaSolicitud(state){
      if(state.convocatorias.length > 0){
        let fechaAhora = new Date();
        fechaAhora.setHours(0,0,0,0);
        let fechaInicio = new Date(state.convocatorias[state.convocatorias.length - 1].fecha_inicio_solicitud_beca+"T00:00:00");
        let fechaFin = new Date(state.convocatorias[state.convocatorias.length - 1].fecha_fin_solicitud_beca+"T00:00:00");
        if(fechaInicio <= fechaAhora && fechaAhora <= fechaFin)return true;
        else return false;
      }
      else
        return false;
    }
  }
}
