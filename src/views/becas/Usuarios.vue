<template>
<v-container fluid cols="12">
    <v-card>
        <Header titulo="Usuarios" subTituloUno="Becas" :subTituloDos="gestion" />
        <ListOpen class="ma-2" v-if="!loading" v-on:editItem="editItem($event)" :headers="headers" :items="getUsuarios" :acciones="acciones" :sortby="sortby" />
        <Loading v-else />
    </v-card>
    <NuevoEditar :dialogF="dialogF" :items="items" :edited_item_enviar="edited_item_enviar" :edited_index_enviar="edited_index_enviar"/>
</v-container>
</template>

<script>
import ListOpen from "@/components/becas/shared/ListOpen";
import Header from "@/components/becas/shared/Header";
import Loading from "@/components/becas/shared/Loading";
import NuevoEditar from "@/components/becas/usuario/NuevoEditar";
import becasService from "@/services/becasService"
import {
    mapGetters,
    mapActions
} from "vuex";
export default {
    name: "Beca-Usuarios",
    components: {
        Header,
        ListOpen,
        Loading,
        NuevoEditar,
    },

    async mounted() {
        this.loading = true;
        try {
            await this.cargarUsuarios();
            let datos = await becasService.getUniversidadesList();
            this.items = datos.data.data
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
