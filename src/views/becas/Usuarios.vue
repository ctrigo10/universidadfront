<template>
<v-container fluid cols="12">
    <v-card>
        <Header titulo="USUARIOS" :subTituloUno="gestion" />
        <UsuariosPermiso v-if="!loading" :usuarios_todos="getUsuarios" :universidades="items"/>
        <Loading v-else />
    </v-card>
</v-container>
</template>

<script>
import UsuariosPermiso from "@/components/becas/usuario/UsuariosPermiso";
import Header from "@/components/becas/shared/Header";
import Loading from "@/components/becas/shared/Loading";
import becasService from "@/services/becasService"
import {
    mapGetters,
    mapActions
} from "vuex";
export default {
    name: "Beca-Usuarios",
    components: {
        Header,
        Loading,
        UsuariosPermiso
    },

    async mounted() {
        this.loading = true;
        try {
            await this.cargarUsuarios();
            let datos = await becasService.getUniversidadesList();
            this.items = datos.data.data,
            console.log(this.items)
        } catch (error) {
            let text = error;
            if (error.response) text = error.response.data;
            this.alert({
                text: text,
                color: "red"
            });
        } finally {
            this.loading = false;
        }
    },

    data: () => ({
        loading: false,
        sortby: 'nombre',
        dialogF: false,
        edited_item_enviar:[],
        edited_index_enviar: -1,
        items: [],
        headers: [{
                text: "Nombre del usuario",
                value: "nombre",
                class: "subtitle-2 deep-purple lighten-5"
            },
            {
                text: "C.I.",
                value: "carnet",
                align: "center",
                class: "subtitle-2 deep-purple lighten-5"
            },
            {
                text: "Acciones",
                value: "actions",
                sortable: false,
                align: "center",
                class: "subtitle-2 deep-purple lighten-5"
            },
            {
                text: '',
                value: 'data-table-expand',
                class: "subtitle-2 deep-purple lighten-5"
            },
        ],
        acciones: {
            editar: true,
        },
    }),

    computed: {
        ...mapGetters(["getUsuarios", "getUsuarioIndex"]),
        gestion() {
            return "Gestión: " + new Date().getFullYear();
        }
    },

    methods: {
        ...mapActions(["alert", "cargarUsuarios"]),

        editItem(item) {
            this.edited_index_enviar = this.getUsuarioIndex(item);
            this.edited_item_enviar = Object.assign({}, item);
            this.dialogF = !this.dialogF;
        },
    },
};
</script>
