<template>
  <v-container fluid cols="12">
    <v-card>
      <Header
        titulo="Consulta sobre el estado de la Beca"
        subTituloUno="Becas"
        :subTituloDos="gestion"
      />
      <v-row>
        <v-col cols="12" lg="6" md="6">
          <Formulario class="pa-3" />
        </v-col>
        <v-col cols="12" lg="6" md="6">
          <Mensaje :mensaje="mensaje" class="mr-3 ml-3" />
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
import Header from "@/components/becas/shared/Header";
import Formulario from "@/components/becas/seguimiento/Formulario";
import Mensaje from "@/components/becas/seguimiento/Mensaje";
export default {
  name: "Beca-seguimiento",
  components: {
    Header,
    Formulario,
    Mensaje,
  },
  data() {
    return {
      mensaje:
        "Coloque su número de ci, complemento si corresponde, su registro único de estudiante y fecha de nacimiento para realizar la consulta sobre su solicitud de beca realizada.",
      mensajeInicial:
        "Coloque su número de ci, complemento si corresponde, su registro único de estudiante y fecha de nacimiento para realizar la consulta sobre su solicitud de beca realizada.",
    };
  },
  methods: {},
  computed: {
    gestion() {
      return "Gestión: " + new Date().getFullYear();
    },
  },
  watch: {
    loader() {
      const l = this.loader;
      this[l] = !this[l];
      setTimeout(() => (this[l] = false), 3000);
      this.loader = null;
    },
  },
};
</script>
