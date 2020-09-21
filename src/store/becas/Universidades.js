import Vue from 'vue'
import Vuex from 'vuex'
import becasService from "@/services/becasService"

Vue.use(Vuex)

export default {
    state: {
        universidades: [],
        options:{
            page: 1,
            itemsPerPage: 12,
            sortBy: ['institucioneducativa'],
            sortDesc: [false],
            search: "",
            buscarU: "uTodos",
            itemsTotal: 0,
            searchBy: "universidad",
            departamento: "Todos",
        }
    },
    mutations: {
        cargarUniversidades(state, data) {
            try{
                state.universidades = [];
                for(let dato of data.data){
                    let universidad = { institucioneducativa_id: 0, nombre: "", departamento: ""};
                    universidad.institucioneducativa_id = dato.id;
                    universidad.nombre = dato.institucioneducativa;
                    if(dato.jurisdiccion_geografica){
                        if(dato.jurisdiccion_geografica.distrito_tipo)
                          if(dato.jurisdiccion_geografica.distrito_tipo.departamento_tipo)
                             universidad.departamento = dato.jurisdiccion_geografica.distrito_tipo.departamento_tipo.departa;
                    }
                    else
                        universidad.departamento = " --- "
                    if(dato.universidad_beca_universidad){
                        universidad.id = dato.universidad_beca_universidad.id;
                        universidad.cantidad_estudiantes = dato.universidad_beca_universidad.cantidad_estudiantes;
                        universidad.cantidad_becas = dato.universidad_beca_universidad.cantidad_becas;
                        universidad.universidad_beca_convocatoria_id = dato.universidad_beca_universidad.universidad_beca_convocatorium.id
                    }else{
                        universidad.id = 0;
                        universidad.cantidad_estudiantes = 0;
                        universidad.cantidad_becas = 0;
                        universidad.universidad_beca_convocatoria_id = 0;
                    }
                    if(dato.institucioneducativa_dato){
                        universidad.imagen = dato.institucioneducativa_dato.imagen;
                    }else{
                        universidad.imagen = null;
                    }
                    let becas = [];
                    let cantidadBecasRegistradas = 0;
                    if(dato.universidad_beca_universidad && dato.universidad_beca_universidad.bcarrera)
                    {
                        for (let beca of dato.universidad_beca_universidad.bcarrera){
                            if(beca.titpro.tica){
                                let becasolo = [];
                                becasolo.nombre = beca.titpro.tica.tct.nombre;
                                becasolo.titulo = beca.titpro.nivel_tipo.nivel;
                                becasolo.cantidad_becas = beca.cantidad_becas;
                                becas.push(becasolo);
                                cantidadBecasRegistradas += +beca.cantidad_becas;
                            }
                        }
                    }
                    universidad.becas = becas;
                    universidad.cantidadBecasRegistradas = cantidadBecasRegistradas;
                    /////preguntamos si estamos buscando por carrera ya que si guarda
                    /////por carrera no debera mostrar universidades sin esa carrera
                    ////si busca por universidad debera mostrar las universidades
                    if(data.options.searchBy == 'universidad')//es por universidad
                        state.universidades.push(universidad);
                    else //por carrera, revisar si hay carreras
                    {
                        if(universidad.becas.length > 0)
                            state.universidades.push(universidad);
                    }
                    //restamos la cantidad de filas encontradas
                }
//                console.log(state.universidades);
            }catch(error){
                console.log(error)
            }
        },

        agregarUniversidad(state,item){
          try{
            state.universidades[item.index].cantidad_estudiantes = item.item.data.data.cantidad_estudiantes;
            state.universidades[item.index].cantidad_becas = item.item.data.data.cantidad_becas;
            state.universidades[item.index].id = item.item.data.data.id
          }catch(error)
          {
              console.log(error)
          }
        },

        editarUniversidad(state, item){
            Object.assign(state.universidades[item.index], item.item);
        },

        editarOptions(state, options){
            state.options = options
        },
        resetOptions(state){
            state.options.page = 1;
            state.options.itemsPerPage = 12;
            state.options.sortBy = ['institucioneducativa'];
            state.options.sortDesc = [false];
            state.options.search = "";
            state.options.itemsTotal = 0;
            state.options.buscarU = "uTodos";
            state.options.searchBy = "universidad";
            state.options.departamento = "Todos";
        },
    },
    actions: {
        async cargarUniversidades(context, item) {
            let opcion = item.opcion;
            let result = "item";
            if (opcion == 'uTodos'){
                result = await becasService.getUniversidades(item.options);
            }
            //console.log(result)
            context.commit("cargarUniversidades", result.data)
            context.commit('editarOptions', result.data.options)
        },

        async agregarUniversidad(context, item){
            item.item = await becasService.addUniversidad(item.item)
            context.commit('agregarUniversidad', item)
        },

        async editarUniversidad(context,item){
            await becasService.editUniversidad(item.item)
            context.commit('editarUniversidad',item)
        },

        editarOptions(context,options){
            context.commit('editarOptions', options)
        },

        resetOptions(context){
            context.commit('resetOptions')
        },
    },
    getters: {
        getUniversidades(state) {
            if (state.universidades.length > 0)
                return state.universidades
            else
                return [];
        },

        getUniversidadIndex : (state) => (item)=>{
            return state.universidades.indexOf(item)
        },

        getOptions(state) {
            return state.options;
        },
    }
}