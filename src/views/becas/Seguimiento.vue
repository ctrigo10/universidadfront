<template>
  <v-container fluid cols="12">
    <v-card>
      <Header
        titulo="CONSULTE SOBRE EL ESTADO DE SU BECA"
        :subTituloUno="gestion"
      />
      <v-row>
        <v-col cols="12" lg="6" md="6" sm="6">
          <Formulario v-on:mensajes="mensajes($event)" class="pa-3" :solicitud_id="solicitud_id" />
        </v-col>
        <v-col cols="12" lg="6" md="6" sm="6">
          <Mensaje :mensaje="mensaje" class="mr-3 ml-3" from="seguimiento" />
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
import Header from "@/components/becas/shared/Header";
import Formulario from "@/components/becas/seguimiento/Formulario";
import Mensaje from "@/components/becas/shared/Mensaje";
export default {
  name: "Beca-seguimiento",
  props:{solicitud_id:{default: 0}},
  components: {
    Header,
    Formulario,
    Mensaje,
  },

  data() {
    return {
      mensaje:
        "Ingrese su número de C.I., complemento si corresponde, registro único de estudiante y fecha de nacimiento para realizar la consulta sobre el estado de la solicitud de su beca.",
      mensajeInicial:
        "Ingrese su número de C.I., complemento si corresponde, registro único de estudiante y fecha de nacimiento para realizar la consulta sobre el estado de la solicitud de su beca.",
    };
  },
  methods: {
    mensajes(item){
      if(item == 0)item = this.mensajeInicial;
      this.mensaje = item;
    }
  },
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
