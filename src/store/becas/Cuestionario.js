import Vue from 'vue'
import Vuex from 'vuex'
//import axios from "axios";
import becasService from "@/services/becasService"

Vue.use(Vuex);

export default {
    state: {
        preguntas: [],
        condiciones:[],
    },
    mutations: {
        cargarPreguntas(state, item){
            state.preguntas = [];
            for(let pregunta of item){
                state.preguntas.push(this.getters.getPuntajePregunta(pregunta));
            }
        },
        agregarPregunta(state, item){
            state.preguntas.push(item)
        },
        editarPregunta(state,item){
            state.preguntas[item.index].seleccion_multiple = item.item.seleccion_multiple;
            item.item.puntaje = this.getters.getPuntajePregunta(state.preguntas[item.index]).puntaje;
            Object.assign(state.preguntas[item.index], item.item);
        },
        eliminarPregunta(state, index){
            state.preguntas.splice(index, 1)
        },
        agregarRespuesta(state,item){
            //buscamos el index
            let index = state.preguntas.findIndex(x => x.id === item.universidad_beca_cuestionario_id);
            state.preguntas[index].brespuesta.push(item);
            state.preguntas[index].puntaje = this.getters.getPuntajePregunta(state.preguntas[index]).puntaje;
        },
        editarRespuesta(state,item){
            //buscamos index cuestionario
            let index1 = state.preguntas.findIndex(x => x.id === item.universidad_beca_cuestionario_id);
            //buscamos index cuestionario/respuestas
            let index2 = state.preguntas[index1].brespuesta.findIndex(x => x.id === item.id);
            Object.assign(state.preguntas[index1].brespuesta[index2], item);
            state.preguntas[index1].puntaje = this.getters.getPuntajePregunta(state.preguntas[index1]).puntaje;
        },
        eliminarRespuesta(state,item){
            //buscamos index cuestionario
            let index1 = state.preguntas.findIndex(x => x.id === item.universidad_beca_cuestionario_id);
            //buscamos index cuestionario/respuestas
            let index2 = state.preguntas[index1].brespuesta.findIndex(x => x.id === item.id);
            state.preguntas[index1].brespuesta.splice(index2, 1);
            state.preguntas[index1].puntaje = this.getters.getPuntajePregunta(state.preguntas[index1]).puntaje;
        },
        cargarCondiciones(state,item){
            state.condiciones= [];
            state.condiciones = item
        },
        agregarCondicion(state, item){
            state.condiciones.push(item)
        },
        editarCondicion(state,item){
            Object.assign(state.condiciones[item.index], item.item);
        },
        eliminarCondicion(state, index){
            state.condiciones.splice(index, 1)
        },
    },
    actions: {
        async cargarPreguntas(context, item){
            const result = await becasService.getPreguntas(item);
            context.commit("cargarPreguntas", result.data.data)
        },
        async agregarPregunta(context, item){
            item = await becasService.addPregunta(item);
            context.commit('agregarPregunta', item.data.data)
        },
        async editarPregunta(context,item){
            await becasService.editPregunta(item.item)
            context.commit('editarPregunta',item)
        },
        async eliminarPregunta(context,item){
            await becasService.deletePregunta(item);
            let index = context.state.preguntas.indexOf(item);
            context.commit('eliminarPregunta', index)
        },
        async agregarRespuesta(context,item){
            const result = await becasService.addRespuesta(item);
            context.commit('agregarRespuesta',result.data.data);
        },
        async editarRespuesta(context,item){
            await becasService.editRespuesta(item);
            context.commit('editarRespuesta',item);
        },
        async eliminarRespuesta(context,item){
            await becasService.deleteRespuesta(item);
            context.commit('eliminarRespuesta', item)
        },
        async cargarCondiciones(context,item){
            const result = await becasService.getCondiciones(item);
            context.commit("cargarCondiciones", result.data.data)
        },
        async agregarCondicion(context,item){
            const result = await becasService.addCondicion(item);
            context.commit('agregarCondicion',result.data.data);
        },
        async editarCondicion(context,item){
            await becasService.editCondicion(item);
            const result = await becasService.getCondiciones(item.universidad_beca_convocatoria_id);
            context.commit("cargarCondiciones", result.data.data)
        },
        async eliminarCondicion(context,item){
            await becasService.deleteCondicion(item);
            let index = context.state.condiciones.indexOf(item);
            context.commit('eliminarCondicion', index)
        },
    },
    getters: {
        getPreguntas(state){
            return state.preguntas.length > 0? state.preguntas: [];
        },
        getCuestionarioIndex : (state) => (item)=>{
            return state.preguntas.indexOf(item);
        },
        getCuestionarioPuntaje(state){
            return state.preguntas.reduce((prev, cur)=>{return prev + +cur.puntaje;},0);
        },
        getCondiciones(state){
            return state.condiciones.length > 0? state.condiciones: [];
        },
        getCondicionIndex : (state) => (item) => {
            return state.condiciones.indexOf(item);
        },
        getPuntajePregunta: () => (pregunta) =>{
            if(pregunta.seleccion_multiple == true){
                //Sumar
                pregunta.puntaje = pregunta.brespuesta.reduce((prev, cur)=>{return prev + +cur.puntaje;},0);
            }else{
                //Maximo
                if(pregunta.brespuesta.length > 0){
                    pregunta.puntaje = pregunta.brespuesta.reduce((prev, cur)=>{return (prev > +cur.puntaje) ? prev : cur.puntaje},0);
                }else{
                    pregunta.puntaje = 0;
                }
            }
            return pregunta;
        },
        getRespuesta: (state) => (index, id) =>{
            let index2 = state.preguntas[index].brespuesta.findIndex(x => x.id === id);
            return state.preguntas[index].brespuesta[index2];
        }
    }
}