<template>
<v-container fluid cols="12">
    <v-card>
        <Header titulo="Convocatorias y Fechas" subTitulo="Gestión" />

        <NuevoEditar v-show="getConvocatoriaLast.seleccionar_becados != false" :dialogF="dialogF" :edited_index_enviar="edited_index_enviar" :edited_item_enviar="edited_item_enviar" />

        <br class="espacio" />

        <List v-if="!loading" :headers="headers" :items="getConvocatorias" :acciones="acciones" :sortby="sortby" v-on:deleteItem="deleteItem($event)" v-on:editItem="editItem($event)" />
        <Loading v-else />

    </v-card>
</v-container>
</template>

<script>
import List from "@/components/becas/shared/List";
import Header from "@/components/becas/shared/Header";
import Loading from "@/components/becas/shared/Loading";
import NuevoEditar from "@/components/becas/convocatoria/NuevoEditar";
import {
    mapGetters,
    mapActions
} from "vuex";
export default {
    name: "Beca-Convocatoria",
    components: {
        Header,
        List,
        Loading,
        NuevoEditar,
    },

    async mounted() {
        this.loading = true;
        try {
            await this.cargarConvocatoriasActual();
        } catch (error) {
            this.alert({
                text: error.response.data,
                color: "red"
            });
        } finally {
            this.loading = false;
        }
    },

    data: () => ({
        loading: false,
        dialogF: false,
        sortby: "convocatoria",
        edited_index_enviar: -1,
        edited_item_enviar: {
            fecha_inicio_registro_beca: "",
            fecha_fin_registro_beca: "",
            fecha_inicio_solicitud_beca: "",
            fecha_fin_solicitud_beca: "",
            fecha_registro_convocatoria: "",
            fecha_solicitud_convocatoria: "",
            seleccionar_becados: false,
            seleccionar_becados_text: "",
        },
        headers: [{
                text: "Convocatoria",
                value: "version",
                align: "center"
            },
            {
                text: "Fecha Registro de Becas",
                value: "fecha_registro_convocatoria",
                align: "center",
            },
            {
                text: "Fecha Solicitud de Becas",
                value: "fecha_solicitud_convocatoria",
                align: "center",
            },
            {
                text: "Finalizado",
                value: "seleccionar_becados_text",
                align: "center",
            },
            {
                text: "Acciones",
                value: "actions",
                sortable: false,
                align: "center"
            },
        ],
        acciones: {
            editar: true,
            eliminar: true,
        },
    }),

    computed: {
        ...mapGetters([
            "getConvocatorias",
            "getConvocatoriaLast",
            "getConvocatoriaIndex",
        ]),
    },

    methods: {
        ...mapActions(["eliminarConvocatoria", "alert", "cargarConvocatoriasActual"]),
        editItem(item) {
            this.edited_index_enviar = this.getConvocatoriaIndex(item);
            this.edited_item_enviar = Object.assign({}, item);
            this.dialogF = !this.dialogF;
        },

        async deleteItem(item) {
            //this.$store.dispatch('eliminarConvocatoria', this.getConvocatoriaIndex(item))
            this.loading = true
            try {
                await this.eliminarConvocatoria(item);
                this.alert({
                    text: "Registro eliminado",
                    color: "primary"
                });
            } catch (error) {
                this.alert({
                    text: error.response.data,
                    color: "red"
                });
            } finally {
                this.loading = false
            }

        },
    },
};
</script>

<style scoped>
.espacio {
    margin: 4px;
}
</style>
