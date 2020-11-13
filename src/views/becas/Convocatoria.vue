<template>
  <v-container fluid cols="12">
    <v-card>
      <Header
        titulo="CONVOCATORIAS"
        subTituloUno="Becas"
        :subTituloDos="gestion"
      />

      <NuevoEditar
        v-show="getConvocatoriaLast.seleccionar_becados != false"
        :dialogF="dialogF"
        :edited_index_enviar="edited_index_enviar"
        :edited_item_enviar="edited_item_enviar"
      />

      <List
        v-if="!loading"
        :headers="headers"
        :items="getConvocatorias"
        :acciones="acciones"
        :sortby="sortby"
        v-on:deleteItem="deleteItem($event)"
        v-on:editItem="editItem($event)"
        v-on:cuestionario="cuestionario($event)"
        v-on:finalizeItem="finalizeItemConsulta($event)"
      />
      <Loading v-else />
    </v-card>
    <v-card class="mt-3" v-if="ver_cuestionario">
      <Header
        :titulo="tituloCuestionario"
        :subTituloUno="puntajeCalificaciones"
        :subTituloDos="puntajeText"
      />
      <v-tabs color="secondary">
        <v-tab>
          <v-icon left>mdi-format-list-checks</v-icon>
          Preguntas y Respuestas
        </v-tab>
        <v-tab>
          <v-icon left>mdi-library</v-icon>
          Condiciones y Términos
        </v-tab>
        <v-tab-item>
          <v-card flat>
            <v-card-text>
              <NuevoEditarCuestionario
                :universidad_beca_convocatoria_id="
                  universidad_beca_convocatoria_id
                "
                :dialogCuestionario="dialogCuestionario"
                :edited_index_enviar="edited_cuestionario_index_enviar"
                :edited_item_enviar="edited_cuestionario_item_enviar"
              />
              <ListOpen
                v-if="!loading1"
                v-on:editItem="editItemCuestionario($event)"
                v-on:deleteItem="deleteItemCuestionario($event)"
              />
              <Loading v-else />
            </v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item>
            <v-card>
            <v-card-text>
              <NuevoEditarCondiciones
                :universidad_beca_convocatoria_id="
                  universidad_beca_convocatoria_id
                "
                :dialogCondicion="dialogCondicion"
                :edited_index_enviar="edited_condicion_index_enviar"
                :edited_item_enviar="edited_condicion_item_enviar"
              />
              <List
                v-if="!loading2"
                :headers="headersCondiciones"
                :items="getCondiciones"
                :acciones="accionesCondiciones"
                v-on:deleteItem="deleteCondicion($event)"
                v-on:editItem="editCondicion($event)"
              />
              <Loading v-else />
            </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs>
    </v-card>
  </v-container>
</template>

<script>
import List from "@/components/becas/shared/List";
import Header from "@/components/becas/shared/Header";
import Loading from "@/components/becas/shared/Loading";
import NuevoEditar from "@/components/becas/convocatoria/NuevoEditar";
import ListOpen from "@/components/becas/convocatoria/ListOpen";
import NuevoEditarCuestionario from "@/components/becas/convocatoria/NuevoEditarCuestionario";
import NuevoEditarCondiciones from "@/components/becas/convocatoria/NuevoEditarCondiciones";
import { mapGetters, mapActions } from "vuex";
export default {
  name: "Beca-Convocatoria",
  components: {
    NuevoEditarCondiciones,
    NuevoEditarCuestionario,
    Header,
    List,
    Loading,
    NuevoEditar,
    ListOpen,
  },

  async mounted() {
    this.loading = true;
    try {
      await this.cargarConvocatoriasActual();
    } catch (error) {
      this.alert({
        text: error.response.data,
        color: "red",
      });
    } finally {
      this.loading = false;
    }
  },

  data: () => ({
    loading: false,
    loading1: false,
    loading2: false,
    dialogCuestionario: false,
    dialogCondicion: false,
    dialogF: false,
    sortby: "convocatoria",
    ver_cuestionario: false,
    edited_index_enviar: -1,
    versionN: 0,
    ponderacionN: 0,
    universidad_beca_convocatoria_id: 0,
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
    headers: [
      {
        text: "Conv.",
        value: "version",
        align: "center",
        class: "subtitle-2 deep-purple lighten-5",
      },
      {
        text: "Registro de Becas",
        value: "fecha_registro_convocatoria",
        align: "center",
        class: "subtitle-2 deep-purple lighten-5",
      },
      {
        text: "Solicitud de Becas",
        value: "fecha_solicitud_convocatoria",
        align: "center",
        class: "subtitle-2 deep-purple lighten-5",
      },
      {
        text: "Cursos",
        value: "ultimos_cursos",
        align: "center",
        class: "subtitle-2 deep-purple lighten-5",
      },
      {
        text: "Ponderación",
        value: "ponderacion",
        align: "center",
        class: "subtitle-2 deep-purple lighten-5",
      },
      {
        text: "Finalizado",
        value: "seleccionar_becados_text",
        align: "center",
        class: "subtitle-2 deep-purple lighten-5",
      },
      {
        text: "Acciones",
        value: "actions",
        sortable: false,
        align: "center",
        class: "subtitle-2 deep-purple lighten-5",
      },
    ],
    acciones: {
      editar: true,
      eliminar: true,
      cuestionario: true,
      finalizar: true,
    },
    headersCondiciones: [
      {
        text: "Condición y/o Término",
        value: "mensaje",
        class: "subtitle-2 deep-purple lighten-5",
      },
      {
        text: "Archivo",
        value: "archivo",
        class: "subtitle-2 deep-purple lighten-5",
      },{
        text: "Acciones",
        value: "actions",
        sortable: false,
        align: "center",
        class: "subtitle-2 deep-purple lighten-5",
      }
    ],
    accionesCondiciones: {
      editar: true,
      eliminar: true,
      archivo: true,
    },
    edited_cuestionario_index_enviar: -1,
    edited_cuestionario_item_enviar: [],
    edited_condicion_index_enviar: -1,
    edited_condicion_item_enviar: [],
  }),

  computed: {
    ...mapGetters([
      "getConvocatorias",
      "getConvocatoriaLast",
      "getConvocatoriaIndex",
      "getCuestionarioIndex",
      "getCuestionarioPuntaje",
      "getCondiciones",
      "getCondicionIndex",
    ]),
    gestion() {
      return "Gestión: " + new Date().getFullYear();
    },
    puntajeText() {
      return `Puntaje Cuestionario: ${this.getCuestionarioPuntaje}`;
    },
    tituloCuestionario() {
      return `CUESTIONARIO - CONV. ${this.versionN}`;
    },
    puntajeCalificaciones() {
      return `Puntaje Notas: ${this.ponderacionN}`;
    },
  },

  methods: {
    ...mapActions([
      "eliminarConvocatoria",
      "alert",
      "cargarConvocatoriasActual",
      "cargarPreguntas",
      "eliminarPregunta",
      "cargarCondiciones",
      "eliminarCondicion",
      "convocatoriaFinish"
    ]),
    editItem(item) {
      this.edited_index_enviar = this.getConvocatoriaIndex(item);
      this.edited_item_enviar = Object.assign({}, item);
      this.ver_cuestionario = false;
      this.dialogF = !this.dialogF;
    },

    async deleteItem(item) {
      //this.$store.dispatch('eliminarConvocatoria', this.getConvocatoriaIndex(item))
      this.ver_cuestionario = false;
      this.loading = true;
      try {
        await this.eliminarConvocatoria(item);
        this.alert({
          text: "Registro eliminado",
          color: "primary",
        });
      } catch (error) {
        this.alert({
          text: error.response.data,
          color: "red",
        });
      } finally {
        this.loading = false;
      }
    },

    async cuestionario(item) {
      try {
        this.loading1 = true;
        this.loading2 = true;
        this.ver_cuestionario = true;
        this.versionN = item.version;
        this.ponderacionN = item.ponderacion;
        this.universidad_beca_convocatoria_id = item.id;
        await this.cargarPreguntas(this.universidad_beca_convocatoria_id);
        await this.cargarCondiciones(this.universidad_beca_convocatoria_id);
      } catch (error) {
        let text = error;
        if (error.response) text = error.response.data;
        this.alert({
          text: text,
          color: "red",
        });
      } finally {
        this.loading1 = false;
        this.loading2 = false;
      }
    },

    editItemCuestionario(item) {
      this.edited_cuestionario_index_enviar = this.getCuestionarioIndex(item);
      this.edited_cuestionario_item_enviar = Object.assign({}, item);
      this.dialogCuestionario = !this.dialogCuestionario;
    },

    async deleteItemCuestionario(item) {
      this.loading1 = true;
      try {
        await this.eliminarPregunta(item);
        this.alert({
          text: "Registro eliminado",
          color: "primary",
        });
      } catch (error) {
        let text = error;
        if (error.response) text = error.response.data;
        this.alert({
          text: text,
          color: "red",
        });
      } finally {
        this.loading1 = false;
      }
    },

    editCondicion(item){
      this.edited_condicion_index_enviar = this.getCondicionIndex(item);
      this.edited_condicion_item_enviar = Object.assign({}, item);
      this.dialogCondicion = !this.dialogCondicion;
    },

    async deleteCondicion(item) {
      this.loading1 = true;
      try {
        await this.eliminarCondicion(item);
        this.alert({
          text: "Registro eliminado",
          color: "primary",
        });
      } catch (error) {
        let text = error;
        if (error.response) text = error.response.data;
        this.alert({
          text: text,
          color: "red",
        });
      } finally {
        this.loading1 = false;
      }
    },

    finalizeItemConsulta(item){
      let fechaAhora = new Date();
      fechaAhora.setHours(0,0,0,0);
      let fechaFin = new Date(item.fecha_fin_solicitud_beca+"T00:00:00");
      if(fechaFin < fechaAhora){ //cambiar a <
        this.$vuetifyConfirmDialog
          .open("Confirmación", "¿Está seguro de finalizar la convocatoria?, al finalizar el sistema VALIDARÁ y RECHAZARÁ automaticamente las solicitudes de becas por los puntajes en las becas vacantes y no se podrá realizar ninguna modificación en la convocatoria a finalizar.", "Cancelar", "Confirmar", "primary", "secondary")
          .then(state => {
            if (state == true)
                this.finalizeItem(item)
        });
      }
      else{
         this.alert({
          text: `No puede finalizar la convocatoria, ya que no concluyó la misma. Fecha registro de becas: ${item.fecha_registro_convocatoria}, Fecha solicitud de becas:  ${item.fecha_solicitud_convocatoria}.`,
          color: "red",
        });
      }
    },

    async finalizeItem(item){
      try{
        this.ver_cuestionario = false;
        this.loading = true;
        let index = await this.getConvocatoriaIndex(item);
        await this.convocatoriaFinish({item:item, index:index});
        this.alert({
              text: "Convocatoria a finalizado con exito, generando automáticamente a los beneficiados con las becas disponibles.",
              color: "primary",
            });
      }catch(error){
         let text = error;
        if (error.response) text = error.response.data;
        this.alert({
          text: text,
          color: "red",
        });
      } finally {
        this.loading = false;
      }
    }
  },
};
</script>

<style scoped>
.espacio {
  margin: 4px;
}
</style>
