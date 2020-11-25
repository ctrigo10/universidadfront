import Vue from 'vue'
import Vuex from 'vuex'
import becasService from "@/services/becasService"
import general from "@/services/general"

Vue.use(Vuex)

export default {
    state: {
        carreraSolicitudes: [],
        solicitudes: [],
        solicitudesTotal: 0,
    },
    mutations: {
        cargarCarreraSolicitudes(state, item) {
            state.carreraSolicitudes.universidad = item.universidad;
            state.carreraSolicitudes.nombre = item.nombre;
            state.carreraSolicitudes.cantidad_becas = item.cantidad_becas;
            state.carreraSolicitudes.titulo = item.titulo;
            state.carreraSolicitudes.universidad_beca_carrera_id = item.universidad_beca_carrera_id;
        },
        async cargarCarreraSolicitudesBecas(state, solicitudes) {
            state.solicitudes = solicitudes.solicitudes;
            state.solicitudesTotal = solicitudes.itemsTotal;
        },
        editarSolicitud(state, item) {
            Object.assign(state.solicitudes[item.index], item.item);
        }
    },
    actions: {
        cargarCarreraSolicitudes(context, item) {
            context.commit("cargarCarreraSolicitudes", item)
        },
        async cargarCarreraSolicitudesBecas(context, item) {
            let solicitudes=[];
            const resp = await becasService.getCarreraSolicitudesBecas(item);
            for (let item of resp.data.data) {
                let usuario_id = 0;
                let username = '';
                let createdAt = new Date(item.createdAt);
                let updatedAt = new Date(item.updatedAt);
                if (item.usuario) {
                    usuario_id = item.usuario.id;
                    username = item.usuario.username
                }
                // puntajes
                let puntajes={notas:0, cuestionario:0, total:0};
                if(item.bestado.nombre!='Cancelado'){
                    puntajes = await becasService.getPuntajes(item.id);
                    puntajes = puntajes.data.data;
                }
                solicitudes.push({
                    "estudiante_id": item.estudiante_id,
                    "estudiante": item.estudiante.nombre_completo,
                    "carnet_identidad": item.estudiante.carnet_identidad_complemento,
                    "fecha_nacimiento": this.getters.getConvertirFecha(item.estudiante.fecha_nacimiento),
                    "celular": item.celular,
                    "correo": item.correo,
                    "universidad_beca_solicitud_id": item.id,
                    "universidad_beca_solicitud_estado_id": item.bestado.id,
                    "universidad_beca_solicitud_estado": item.bestado.nombre,
                    "observacion": item.observacion,
                    "puntaje_notas": puntajes.notas,
                    "puntaje_cuestionario": puntajes.cuestionario,
                    "puntaje": puntajes.total,
                    "usuario_id": usuario_id,
                    "username": username,
                    "fecha_registro": createdAt.toLocaleString("en-GB"),
                    "fecha_modificacion": updatedAt.toLocaleString("en-GB"),
                })
            }
            context.commit("cargarCarreraSolicitudesBecas", {solicitudes: solicitudes, itemsTotal:resp.data.itemsTotal})
        },
        async editarSolicitud(context, item) {
            await becasService.editSolicitud(item);
            let hoy = this.getters.getDateNowFull(0)
            let usuario = await general.getUser();
            item.item.fecha_modificacion = hoy;
            item.item.usuario_id = usuario.uid;
            item.item.username = usuario.username;
            context.commit("editarSolicitud", item);
        }
    },
    getters: {
        getCarreraSolicitudes(state) {
            return state.carreraSolicitudes;
        },
        getSolicitudes(state) {
            return state.solicitudes;
        },
        getSolicitudesIndex: (state) => (item) => {
            return state.solicitudes.indexOf(item)
        },
        getSolicitudesTotal(state){
            return state.solicitudesTotal;
        }
    }
}