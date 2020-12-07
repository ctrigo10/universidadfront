import Vue from 'vue'
import Vuex from 'vuex'
import becasService from "@/services/becasService"

Vue.use(Vuex)

export default {
    state: {
        usuarios: [],
    },
    mutations: {
        cargarUsuarios(state, data) {
            console.log(data.data)
            state.usuarios = [];
            for (let dato of data.data[0].usuario_rols) {
                let usuario = {};
                usuario.usuario_id = dato.usuario.id;
                usuario.usuario_rol_id = dato.id;
                usuario.username = dato.usuario.username;
                usuario.carnet = dato.usuario.persona.carnet;
                usuario.rol = data.data[0].rol;
                if (dato.usuario.persona.complemento != "")
                    usuario.carnet = `${usuario.carnet} - ${dato.usuario.persona.complemento}`;
                usuario.nombre = `${dato.usuario.persona.nombre} ${dato.usuario.persona.paterno} ${dato.usuario.persona.materno}`;
                let uni = [];
                if (dato.roles) {
                    for (let universidad of dato.roles) {
                        uni.push({
                            "id": universidad.institucioneducativa.id,
                            "institucioneducativa": universidad.institucioneducativa.institucioneducativa,
                            "sede": universidad.institucioneducativa.nro_resolucion,
                        });
                    }
                    usuario.universidades = uni;
                }
                state.usuarios.push(usuario);
            }
        },
        agregarUniversidadesUsuario(state, resp) {
            let dato = resp[0];
            let usuario = {};
            usuario.usuario_id = dato.usuario.id;
            usuario.usuario_rol_id = dato.id;
            usuario.username = dato.usuario.username;
            usuario.carnet = dato.usuario.persona.carnet;
            usuario.rol = dato.rol;
            if (dato.usuario.persona.complemento != "")
                usuario.carnet = `${usuario.carnet} - ${dato.usuario.persona.complemento}`;
            usuario.nombre = `${dato.usuario.persona.nombre} ${dato.usuario.persona.paterno} ${dato.usuario.persona.materno}`;
            let uni = [];
            if (dato.roles) {
                for (let universidad of dato.roles) {
                    if(universidad.institucioneducativa.institucioneducativa_dato)
                        uni.push({
                            "id": universidad.institucioneducativa.id,
                            "institucioneducativa": universidad.institucioneducativa.institucioneducativa,
                            "sede": universidad.institucioneducativa.institucioneducativa_dato.nombre_sed,
                        });
                    else
                        uni.push({
                            "id": universidad.institucioneducativa.id,
                            "institucioneducativa": universidad.institucioneducativa.institucioneducativa,
                            "sede": '',
                        });
                }
                usuario.universidades = uni;
            }
            Object.assign(state.usuarios[resp.index], usuario);
        },
    },
    actions: {
        async cargarUsuarios(context) {
            const usuarios = await becasService.getUsuarios();
            context.commit('cargarUsuarios', usuarios.data);
        },
        async agregarUniversidadesUsuario(context, datos) {
            let resp = await becasService.addUniversidadesUsuario(datos);
            resp.data.data.index = datos.index;
            context.commit('agregarUniversidadesUsuario', resp.data.data)
        }
    },
    getters: {
        getUsuarios(state) {
            return state.usuarios;
        },
        getUsuarioIndex: (state) => (item) => {
            return state.usuarios.indexOf(item)
        },
    },
}