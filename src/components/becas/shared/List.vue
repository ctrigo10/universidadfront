<template>
<div>
    <v-card-title class="mt-n5">
        <v-text-field v-model="search" append-icon="mdi-magnify" label="Buscar" single-line hide-details color="secondary"></v-text-field>
        <v-spacer></v-spacer>
    </v-card-title>
    <v-data-table :headers="headers" :items="items" :search="search" :items-per-page="10" class="elevation-3" :sort-by="sortby" :footer-props="{
        'items-per-page-text':'Por página',
      }">
        <template v-slot:[`item.archivo`]='{ item }'>
            <v-tooltip top v-if="acciones.archivo && item.seleccionar_becados != true && item.archivo">
                <template v-slot:activator="{ on, attrs }">
                   <a :href="host + item.pathFile" target="_blank" v-bind="attrs" v-on="on"><v-icon>mdi-file-eye</v-icon></a>
                </template>
                <span>Ver Archivo</span>
            </v-tooltip>
        </template>
        <template v-slot:[`item.actions`]='{ item }'>
            <v-tooltip top v-if="acciones.ingresar && item.seleccionar_becados != true">
                <template v-slot:activator="{ on, attrs }">
                    <v-btn icon v-bind="attrs" v-on="on" @click="ingresar(item)">
                        <v-icon color v-bind="attrs" v-on="on">mdi-login</v-icon>
                    </v-btn>
                </template>
                <span>Ingresar</span>
            </v-tooltip>
            <v-tooltip top v-if="acciones.cuestionario && item.seleccionar_becados != true">
                <template v-slot:activator="{ on, attrs }">
                    <v-btn icon v-bind="attrs" v-on="on" @click="cuestionario(item)">
                        <v-icon color v-bind="attrs" v-on="on">mdi-clipboard-list</v-icon>
                    </v-btn>
                </template>
                <span>Cuestionario</span>
            </v-tooltip>
            <v-tooltip top v-if="acciones.solicitarBeca && item.seleccionar_becados != true">
                <template v-slot:activator="{ on, attrs }">
                    <v-btn icon v-bind="attrs" v-on="on" @click="solicitarBeca(item)">
                        <v-icon color v-bind="attrs" v-on="on">mdi-handshake</v-icon>
                    </v-btn>
                </template>
                <span>Solicitar Beca</span>
            </v-tooltip>
            <v-tooltip top v-if="acciones.editar && item.seleccionar_becados != true">
                <template v-slot:activator="{ on, attrs }">
                    <v-btn icon v-bind="attrs" v-on="on" @click="editItem(item)">
                        <v-icon color v-bind="attrs" v-on="on">mdi-pencil</v-icon>
                    </v-btn>
                </template>
                <span>Editar</span>
            </v-tooltip>
            <v-tooltip top v-if="acciones.eliminar && item.seleccionar_becados != true">
                <template v-slot:activator="{ on, attrs }">
                    <v-btn icon v-bind="attrs" v-on="on" @click="deleteItem(item)">
                        <v-icon color v-bind="attrs" v-on="on">mdi-delete</v-icon>
                    </v-btn>
                </template>
                <span>Eliminar</span>
            </v-tooltip>
             <v-tooltip top v-if="acciones.ver && item.seleccionar_becados != true">
                <template v-slot:activator="{ on, attrs }">
                    <v-btn icon v-bind="attrs" v-on="on" @click="viewItem(item)">
                        <v-icon color v-bind="attrs" v-on="on">mdi-eye</v-icon>
                    </v-btn>
                </template>
                <span>Ver</span>
            </v-tooltip>
             <v-tooltip top v-if="acciones.finalizar && item.seleccionar_becados != true">
                <template v-slot:activator="{ on, attrs }">
                    <v-btn icon v-bind="attrs" v-on="on" @click="finalizeItem(item)">
                        <v-icon color v-bind="attrs" v-on="on">mdi-power</v-icon>
                    </v-btn>
                </template>
                <span>Finalizar</span>
            </v-tooltip>
             <v-tooltip top v-if="acciones.pdf && item.seleccionar_becados != true">
                <template v-slot:activator="{ on, attrs }">
                    <v-btn icon v-bind="attrs" v-on="on" @click="pdf(item)">
                        <v-icon color v-bind="attrs" v-on="on">mdi-file-pdf</v-icon>
                    </v-btn>
                </template>
                <span>Descargar Pdf</span>
            </v-tooltip>
        </template>
        <template v-slot:no-data>No hay registros</template>
    </v-data-table>
</div>
</template>

<script>
import becasService from '@/services/becasService'
export default {
    name: "becas-list",
    props: ["headers", "items", "acciones", "sortby"],
    components: {},

    mounted(){
        this.host = becasService.getBaseBeca();
    },

    data: () => ({
        showEditar: false,
        showEliminar: false,
        search: '',
        host:'',
    }),

    methods: {
        deleteItem(item) {
            this.$vuetifyConfirmDialog
                .open("Confirmación", "¿Está seguro de eliminar el registro?", "Cancelar", "Confirmar", "primary", "secondary")
                .then(state => {
                    if (state == true)
                        this.$emit("deleteItem", item);
                });
        },

        editItem(item) {
            this.$emit("editItem", item);
        },

        ingresar(item) {
            this.$emit("ingresar", item);
        },

        solicitarBeca(item) {
            this.$emit("solicitarBeca", item);
        },

        cuestionario(item) {
            this.$emit("cuestionario", item);
        },

        viewItem(item) {
            this.$emit("viewItem", item);
        },

        finalizeItem(item){
            this.$emit("finalizeItem", item);
        },

        pdf(item){
            this.$emit("pdf", item);
        }
    },
};
</script>
