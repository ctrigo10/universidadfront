<template>
  <v-container v-if="!loading" fluid cols="12">
    <v-card >
      <Header
        titulo="ESCRITORIO"
        :subTituloUno="gestion"
        :subTituloDos="convocatoria"
      />
      </v-card>
      <Seleccionar :gestion_tipo_id_enviar="gestion_tipo_id" :version_enviar="version" v-on:buscar="buscar($event)"/>
      <CantUniversidades :datos="datos" :estados="estados"/>
      <Universidades :gestion_tipo_id="gestion_tipo_id" :version="version" :estados="estados.nombre"/>
  </v-container>
  <Loading v-else />
</template>

<script>
import { mapActions } from "vuex";
import becasService from "@/services/becasService";
import Header from "@/components/becas/shared/Header";
import CantUniversidades from "@/components/becas/escritorio/CantUniversidades";
import Universidades from "@/components/becas/escritorio/Universidades";
import Seleccionar from "@/components/becas/escritorio/Seleccionar";
import Loading from "@/components/becas/shared/Loading";
export default {
  name: "Beca-escritorio",
  components: {
    Header,
    Seleccionar,
    Universidades,
    CantUniversidades,
    Loading,
  },
  created() {
      this.getDatos()
  },
  data: () => ({
    loading: false,
    datos: [],
    gestion_tipo_id:0,
    version:0,
    estados: { nombre: [], masculino:[], femenino:[]}
  }),
  computed:{
    gestion(){
      return `Gestión: ${this.gestion_tipo_id}`
    },
    convocatoria(){
      return `Convocatoria: ${this.version}`
    }
  },
  methods: {
    ...mapActions(["alert"]),
    async getDatos() {
      try {
        this.estados = { nombre: [], masculino:[], femenino:[]}
        this.loading = true;
        this.datos = await becasService.getEscritorioCantidades({
          gestion_tipo_id: this.gestion_tipo_id,
          version: this.version,
        });
        this.datos = this.datos.data.data;
        for(let dato of this.datos.cantidadesEstados){
          if(dato.estado!='TOTAL'){
            this.estados.nombre.push(dato.estado)
            this.estados.masculino.push(dato.masculino)
            this.estados.femenino.push(dato.femenino)
          }
        }
        this.gestion_tipo_id = this.datos.convocatoria.gestion_tipo_id;
        this.version = this.datos.convocatoria.version;
      } catch (error) {
        let texto = error;
        if (error.response) texto = error.response.data;
        this.alert({
          text: texto,
          color: "red",
        });
      } finally {
        this.loading = false;
      }
    },
    buscar(item){
      this.gestion_tipo_id = item.gestion_tipo_id;
      this.version = item.version;
      this.getDatos();
    }
  },
};
</script>