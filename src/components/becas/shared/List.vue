<template>
<div>
    <v-data-table :headers="headers" :items="items" :items-per-page="10" class="elevation-3" :sort-by="sortby">
        <template v-slot:[`item.actions`]='{ item }'>
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
        </template>
        <template v-slot:no-data>No hay registros</template>
    </v-data-table>
</div>
</template>

<script>
export default {
    name: "becas-list",
    props: ["headers", "items", "acciones", "sortby"],
    components: {},

    data: () => ({
        showEditar: false,
        showEliminar: false,
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
    },
};
</script>
