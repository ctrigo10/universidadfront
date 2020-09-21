<template>
  <v-container>
    <v-card>
      <!--<Header :titulo="getUniversidad.datos.nombre.toUpperCase()" :subTituloUno="fechasRegistro" :subTituloDos="fechasSolicitud" />-->
      <Header :titulo="carrera" subTituloUno="fechasRegistro" subTituloDos="fechasSolicitud" />
      <InfC />
    </v-card>
    <v-card class="mt-2">
      <Header titulo="Solicitudes" subTituloUno="fechasRegistro" subTituloDos="fechasSolicitud" />
      <List />
    </v-card>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import Header from "@/components/becas/shared/Header";
import List from "@/components/becas/shared/List";
import InfC from "@/components/becas/solicitudes/InfC";
export default {
  name: "Beca-universidades-solicitudes",
  components: {
    Header,
    List,
    InfC,
  },

  computed:{
    ...mapGetters(["getCarreraSolicitudes"]),
    carrera(){
      return `Carrera: ${this.getCarreraSolicitudes.nombre} - ${this.getCarreraSolicitudes.universidad}`
    }
  }
};
</script>