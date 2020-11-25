import Vue from 'vue'
import Vuex from 'vuex'
import becasService from "@/services/becasService"

Vue.use(Vuex)

export default {
    state: {
        universidad: [],
        carreras: [],
        carrerasBecas: [],
        cantidadBecasSuma: 0,
    },
    mutations: {
        cargarUniversidadConBecas(state, data) {
            state.universidad = [];
            let universidad = {datos: []};
            let dato = data.data;
            universidad.datos.id = dato.id;
            universidad.datos.cantidad_becas = dato.cantidad_becas;
            universidad.datos.cantidad_estudiantes = dato.cantidad_estudiantes;
            universidad.datos.nombre = dato.institucioneducativa.institucioneducativa;
            universidad.datos.intitucioneducativa_id = dato.institucioneducativa.id;
            universidad.datos.fecha_creacion = dato.institucioneducativa.fecha_creacion;
            universidad.datos.nro_resolucion = dato.institucioneducativa.nro_resolucion;
            if(dato.institucioneducativa.institucioneducativa_dato){
                universidad.datos.email = dato.institucioneducativa.institucioneducativa_dato.email;
                universidad.datos.fax = dato.institucioneducativa.institucioneducativa_dato.fax;
                universidad.datos.imagen = dato.institucioneducativa.institucioneducativa_dato.imagen;
                universidad.datos.pathImage = dato.institucioneducativa.institucioneducativa_dato.pathImage;
                universidad.datos.sitio_web = dato.institucioneducativa.institucioneducativa_dato.sitio_web;
                universidad.datos.telefonos = dato.institucioneducativa.institucioneducativa_dato.telefonos;
                universidad.datos.decreto_supremo = dato.institucioneducativa.institucioneducativa_dato.decreto_supremo;
            }else{
                universidad.datos.pathImage = universidad.datos.email = universidad.datos.fax = universidad.datos.imagen = universidad.datos.sitio_web = universidad.datos.telefonos = universidad.datos.decreto_supremo = "";
            }
            if(dato.institucioneducativa.jurisdiccion_geografica){
                universidad.datos.direccion = dato.institucioneducativa.jurisdiccion_geografica.direccion;
                universidad.datos.zona = dato.institucioneducativa.jurisdiccion_geografica.zona;
            }else{
                universidad.datos.direccion = universidad.datos.zona = "";
            }
            if(dato.institucioneducativa.jurisdiccion_geografica.distrito_tipo){
                universidad.datos.depa = dato.institucioneducativa.jurisdiccion_geografica.distrito_tipo.depa;
            }else{
                universidad.datos.depa = "";
            }
            state.universidad = universidad;
        },
        cargarCarreras(state, data) {
            try{
                state.carreras = [];
                const datos = data.data.data;
                for(let dato of datos){
                    let nombre = dato.tct.nombre;
                    for(let ttec_denominacion_titulo_profesional_tipo of dato.ttec_denominacion_titulo_profesional_tipos){
                        //comprobar si el elemento esta registrado en becas
                        let consulta = state.carrerasBecas.find(dato=>dato.ttec_denominacion_titulo_profesional_tipo_id==ttec_denominacion_titulo_profesional_tipo.id);
                        if(!consulta){
                            let carrera = [];
                            carrera.ttec_denominacion_titulo_profesional_tipo_id = ttec_denominacion_titulo_profesional_tipo.id;
                            carrera.nombre = nombre;
                            carrera.titulo = ttec_denominacion_titulo_profesional_tipo.nivel_tipo.nivel;
                            carrera.tiempo = ttec_denominacion_titulo_profesional_tipo.ttec_pensums[0].tiempo_;
                            carrera.modalidad = ttec_denominacion_titulo_profesional_tipo.ttec_pensums[0].ttec_re;
                            carrera.cantidad_becas = 0;
                            state.carreras.push(carrera);
                        }
                    }
                }
            }catch(error){
                console.log(error);
            }
        },
        cargarCarrera(state, item){
            state.carreras.push(item);
        },
        cargarCarrerasBecas(state, data){
            try{
                state.carrerasBecas = [];
                for(let dato of data.data.data){
                    state.carrerasBecas.push({
                        "universidad_beca_carrera_id": dato.id,
                        "ttec_denominacion_titulo_profesional_tipo_id": dato.titpro.id,
                        "nombre": dato.titpro.tica.tct.nombre,
                        "titulo": dato.titpro.nivel_tipo.nivel,
                        "tiempo": dato.titpro.ttec_pensums[0].tiempo_estudio,
                        "modalidad": this.getters.getCapitalize(dato.titpro.ttec_pensums[0].ttec_regimen_estudio_tipo.regimen_estudio),
                        "cantidad_becas": +dato.cantidad_becas,
                    });
                }
            }catch(error){
                console.log(error);
            }
        },

        agregarBecaCarrera(state, item){
            let carrera = [];
            carrera = state.carreras.find(dato=>dato.ttec_denominacion_titulo_profesional_tipo_id==item.ttec_denominacion_titulo_profesional_tipo_id);
            state.carrerasBecas.push({
                "universidad_beca_carrera_id": item.universidad_beca_carrera_id,
                "ttec_denominacion_titulo_profesional_tipo_id": carrera.ttec_denominacion_titulo_profesional_tipo_id,
                "nombre": carrera.nombre,
                "titulo": carrera.titulo,
                "tiempo": carrera.tiempo,
                "modalidad": this.getters.getCapitalize(carrera.modalidad),
                "cantidad_becas": +item.cantidad_becas,
            });
        },

        editarBecaCarrera(state,item){
            let carrera = [];
            carrera = state.carreras.find(dato=>dato.ttec_denominacion_titulo_profesional_tipo_id==item.item.ttec_denominacion_titulo_profesional_tipo_id);
            item.item.nombre = carrera.nombre;
            item.item.modalidad = this.getters.getCapitalize(carrera.modalidad);
            item.item.tiempo = carrera.tiempo;
            item.item.titulo = carrera.titulo;
            item.item.cantidad_becas = +item.item.cantidad_becas
            Object.assign(state.carrerasBecas[item.index], item.item);
        },

        eliminarCarreraBeca(state,index){
            state.carrerasBecas.splice(index, 1)
        },

        cantidadBecasSuma(state){
            state.cantidadBecasSuma = 0;
            state.cantidadBecasSuma = state.carrerasBecas.reduce(function(prev, cur){return prev + cur.cantidad_becas;},0);
        },
    },
    actions: {
        async cargarUniversidadConBecas(context, item) {
            let result = await becasService.getUniversidad(item);
            context.commit("cargarUniversidadConBecas", result.data);
        },
        async cargarCarreras(context, item){
            const result = await becasService.getCarrerasByUniversidad(item);
            context.commit("cargarCarreras", result);
        },
        cargarCarrera(context, item){
            context.commit("cargarCarrera", item);
        },
        async cargarCarrerasBecas(context,item){
            const result = await becasService.getCarrerasBecasByUniversidad(item);
            context.commit("cargarCarrerasBecas", result)
            context.commit('cantidadBecasSuma');
        },
        async agregarBecaCarrera(context, item){
            const result = await becasService.addCarrera(item);
            item.universidad_beca_carrera_id = result.data.data.id
            context.commit('agregarBecaCarrera', item);
            context.commit('cantidadBecasSuma');
        },
        async editarBecaCarrera(context,item){
            await becasService.editBecaCarrera(item.item);
            context.commit('editarBecaCarrera', item);
            context.commit('cantidadBecasSuma');
        },
        async eliminarCarreraBeca(context,item){
            await becasService.deleteCarrera(item);
            let index = context.state.carrerasBecas.indexOf(item);
            context.commit('eliminarCarreraBeca', index);
            context.commit('cantidadBecasSuma');
        },
        cantidadBecasSuma(context){
            context.commit('cantidadBecasSuma');
        }
    },
    getters: {
        getUniversidad(state) {
            return state.universidad;
        },
        getUniversidadId(state){
            return state.universidad.datos.intitucioneducativa_id;
        },
        getUniversidadBecaId(state){
            return state.universidad.datos.id;
        },
        getCarreras(state) {
            return state.carreras;
        },
        getCarrerasBecas(state) {
            return state.carrerasBecas;
        },
        getCarrerasBecasIndex : (state) => (item)=>{
            return state.carrerasBecas.indexOf(item);
        },
        getCantidadBecasSuma(state){
            return state.cantidadBecasSuma;
        },
    }
}