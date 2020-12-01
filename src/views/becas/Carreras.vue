<template>
<v-container fluid cols="12" v-if="this.getUniversidad.datos">
    <v-card>
        <Header :titulo="getUniversidad.datos.nombre.toUpperCase()" :subTituloUno="fechasRegistro" :subTituloDos="fechasSolicitud" />
        <InfU v-if="!loading" :universidad="getUniversidad.datos"/>
    </v-card>
    <v-card class="mt-2">
        <Header titulo="CARRERAS CON BECAS DISPONIBLES" :subTituloUno="becasDisponibles" :subTituloDos="BecasRegistradas" />
        <NuevoEditar v-if="$store.getters.isAuthenticated" :dialogF="dialogF" :edited_index_enviar="edited_index_enviar" :edited_item_enviar="edited_item_enviar" />
        <v-alert v-if="cantidad_becas_falta != 0 && isAuthenticated" dense border="left" type="warning">
            Le falta registrar <strong>{{ cantidad_becas_falta }} Beca(s)</strong>
        </v-alert>
        <List class="mt-5 pa-1" v-if="!loading" :items="getCarrerasBecas" :acciones="acciones" :headers="headers" v-on:deleteItem="deleteItem($event)" v-on:editItem="editItem($event)" v-on:ingresar="ingresar($event)" v-on:solicitarBeca="solicitarBeca($event)" />
        <Loading v-else />
    </v-card>
</v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import Loading from "@/components/becas/shared/Loading";
import Header from "@/components/becas/shared/Header";
import InfU from "@/components/becas/carreras/InfU";
import List from "@/components/becas/shared/List";
import NuevoEditar from "@/components/becas/carreras/NuevoEditar";

export default {
    name: "Beca-universidades-carreras",
    components: {
       Loading,
        Header,
        InfU,
        List,
        NuevoEditar,
    },

    created(){
        if(!this.getUniversidad.datos){
            this.$router.push({ name: 'becas-universidades' });
        }
    },
    async mounted(){
        if(this.getUniversidad.datos){
            this.loading = true;
            try {
                await this.cargarCarrerasBecas(this.getUniversidadBecaId);
            } catch (error) {
                let texto = error;
                if(error.response)texto =  error.response.data;
                this.alert({
                    text: texto,
                    color: "red"
                });
            } finally {
                this.loading = false;
            }
        }
        if(this.getEsFechaRegistro && this.$store.getters.isAuthenticated){
            this.acciones.editar = this.acciones.eliminar =  true;
        }
        if(this.$store.getters.isAuthenticated){
            this.acciones.ingresar = true;
            this.acciones.solicitarBeca = false;
        }

        if(this.getEsFechaSolicitud && !this.$store.getters.isAuthenticated){
            this.acciones.solicitarBeca = true;
        }
    },

    data: () => ({
        loading: false,
        dialogF: false,
        edited_item_enviar:{},
        edited_index_enviar: -1,
        headers: [{
                text: "Carrera",
                value: "nombre",
                class: "subtitle-2 deep-purple lighten-5"
            },
            {
                text: "Título",
                value: "titulo",
                class: "subtitle-2 deep-purple lighten-5",
                align: "center",
            },
            {
                text: "Duración",
                value: "modalidad",
                class: "subtitle-2 deep-purple lighten-5",
                align: "center",
            },
            {
                text: "Cantidad Duración",
                value: "tiempo",
                class: "subtitle-2 deep-purple lighten-5",
                align: "center",
            },
            {
                text: "Cantidad de Becas",
                value: "cantidad_becas",
                class: "subtitle-2 deep-purple lighten-5",
                align: "center",
            },
            {
                text: "Acciones",
                value: "actions",
                sortable: false,
                align: "center",
                class: "subtitle-2 deep-purple lighten-5"
            },
        ],
        acciones: {
            editar: false,
            eliminar: false,
            ingresar: false,
            solicitarBeca: false,
        },
    }),

    computed: {
        ...mapGetters(["getUniversidad", "getUniversidadBecaId", "getCarrerasBecas", "getCarrerasBecasIndex", "getCantidadBecasSuma", "getConvocatoriaLast", "getEsFechaRegistro", "getEsFechaSolicitud", "isAuthenticated"]),
        fechasRegistro(){
            if(this.getConvocatoriaLast.seleccionar_becados == false)
                return (this.isAuthenticated) ? `Fecha Registro: ${this.getConvocatoriaLast.fecha_registro_convocatoria}`: `Fecha Convocatoria: ${this.getConvocatoriaLast.fecha_solicitud_convocatoria}`;
            else return 'Convocatoria Finalizada';
        },
        fechasSolicitud(){
            if(this.getConvocatoriaLast.seleccionar_becados == false)
                return (this.isAuthenticated) ? `Fecha Convocatoria: ${this.getConvocatoriaLast.fecha_solicitud_convocatoria}`: '';
            else return '';
        },
        becasDisponibles(){
            return (this.isAuthenticated) ? `Becas disponibles: ${this.getUniversidad.datos.cantidad_becas}`: `Becas disponibles: ${this.getCantidadBecasSuma}`;
        },
        BecasRegistradas(){
            return (this.isAuthenticated) ? `Becas registradas: ${this.getCantidadBecasSuma}`:'';
        },
        cantidad_becas_falta(){
            return this.getUniversidad.datos.cantidad_becas - this.getCantidadBecasSuma;
        },
    },

    methods:{
        ...mapActions(["cargarCarrerasBecas", "alert", "eliminarCarreraBeca", "cargarCarreraSolicitudes"]),
        ingresar(item){
            item.universidad = this.getUniversidad.datos.nombre.toUpperCase();
            this.cargarCarreraSolicitudes(item);
            this.$router.push({ name: 'becas-solicitudes' })
        },

        editItem(item){
            this.edited_index_enviar = this.getCarrerasBecasIndex(item);
            this.edited_item_enviar = Object.assign({}, item);
            this.dialogF = !this.dialogF;
        },

         async deleteItem(item){
            this.loading = true;
            try{
                await this.eliminarCarreraBeca(item);
                this.alert({
                    text: "Registro eliminado",
                    color: "primary"
                });
            }catch (error) {
                let texto = error;
                if(error.response)texto =  error.response.data;
                this.alert({
                    text: texto,
                    color: "red"
                });
            } finally {
                this.loading = false
            }
        },

        solicitarBeca(item){
            if(this.getConvocatoriaLast.seleccionar_becados == false)
                if(this.getEsFechaSolicitud){
                    item.universidad = this.getUniversidad.datos.nombre.toUpperCase();
                    this.cargarCarreraSolicitudes(item);
                    this.$router.push({ name: 'becas-solicitud' })
                }else{
                    this.alert({
                        text: `No está disponible, no está en los plazos de las FECHAS DE CONVOCATORIA (${this.getConvocatoriaLast.fecha_solicitud_convocatoria})`,
                        color: "primary",
                        });
                }
            else
                this.alert({
                    text: `Convocatoria Finalizada`,
                    color: "primary",
                    });
        }
    }
};
</script>
