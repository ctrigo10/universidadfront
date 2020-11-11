<template>
  <v-container>
    <v-card>
      <Header :titulo="carrera" subTituloUno="Fecha Convocatoria" :subTituloDos="fechasSolicitud" />
      <InfC v-if="getUniversidad.datos"/>
    </v-card>
    <v-card class="mt-2">
      <Header titulo="SOLICITUD DE BECA" :subTituloUno="intentos"/>
      <FormConsulta v-if="mostrarFormBusqueda" v-on:consulta="consulta($event)" />
      <v-col>
        <Mensaje v-if="mostrarMensaje" class="ma-1" :mensaje="mensaje" from="solicitud" :id="id"/>
        <FormSolicitud v-if="mostrarFormSolicitud" :estudiante="estudiante"/>
      </v-col>
    </v-card>
  </v-container>
</template>

<script>
import becasService from "@/services/becasService"
import { mapGetters,mapActions } from "vuex";
import Header from "@/components/becas/shared/Header";
import InfC from "@/components/becas/solicitudes/InfC";
import FormConsulta from "@/components/becas/solicitudes/FormConsulta";
import FormSolicitud from "@/components/becas/solicitudes/FormSolicitud";
import Mensaje from "@/components/becas/shared/Mensaje";
export default {
  name: "beca-universidades-solicitud",
  components: {
    Header,
    InfC,
    FormConsulta,
    Mensaje,
    FormSolicitud
  },
   mounted(){
      if(!this.getCarreraSolicitudes.nombre){
         this.$router.push({ name: 'becas-seguimiento' });
      }
    },
  data(){
    return {
      PuedeSolicitar: false,
      intentosBusqueda:3,
      mensaje: "",
      id: 0,
      mostrarMensaje: false,
      estudiante:[],
      mostrarFormBusqueda: true,
      mostrarFormSolicitud: false,
    }
  },
  computed: {
    ...mapGetters(["getCarreraSolicitudes","getUniversidad","getConvocatoriaLast"]),
    carrera() {
      return (this.getCarreraSolicitudes.nombre) ? `${this.getCarreraSolicitudes.nombre.toUpperCase()} - ${this.getCarreraSolicitudes.universidad}`:'';
    },
    intentos(){
       return `Intentos busqueda: ${this.intentosBusqueda}`
    },
    fechasSolicitud(){
      return (this.getConvocatoriaLast.fecha_solicitud_convocatoria)? `${this.getConvocatoriaLast.fecha_solicitud_convocatoria}`: '';
    }
  },
  methods: {
    ...mapActions(["alert"]),
    async consulta(datos) {
      try{
          const resp = await becasService.getEstudiante(datos);
          if(resp.data.msg){
              this.mensaje = resp.data.msg;
              this.id = resp.data.id;
              this.mostrarMensaje = true;
              //si el estudiante ya solicito beca debe desaparecer el form de busqueda
              this.intentosBusqueda --;
              //si realizo los 3 intentos debe desaparecer el form de busqueda
              this.intentosBusqueda == 0 ? this.mostrarFormBusqueda = false: 0;
          }else{
              this.estudiante = resp.data.data;
              this.mostrarFormBusqueda = false;
              this.mostrarFormSolicitud = true;
              this.mostrarMensaje = false;
          }
      }catch(error){
           this.alert({
          text: 'Existió un error',
          color: "red",
        });
      }
    },
  },
};
</script>