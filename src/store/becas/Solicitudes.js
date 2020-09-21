import Vue from 'vue'
import Vuex from 'vuex'
//import becasService from "@/services/becasService"

Vue.use(Vuex)

export default {
    state: {
        carreraSolicitudes:[],
    },
    mutations:{
        cargarCarreraSolicitudes(state, item){
            state.carreraSolicitudes.universidad = item.universidad;
            state.carreraSolicitudes.nombre = item.nombre;
            state.carreraSolicitudes.cantidad_becas = item.cantidad_becas;
            state.carreraSolicitudes.titulo = item.titulo;
            state.carreraSolicitudes.universidad_beca_carrera_id = item.universidad_beca_carrera_id;
        },
    },
    actions:{
        cargarCarreraSolicitudes(context, item){
            context.commit("cargarCarreraSolicitudes", item)
        }
    },
    getters:{
        getCarreraSolicitudes(state){
            return state.carreraSolicitudes;
        }
    }
}