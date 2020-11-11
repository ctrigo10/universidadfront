<template>
  <div>
    <v-card-title class="mt-n5">
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Buscar"
        single-line
        hide-details
        color="secondary"
      ></v-text-field>
      <v-spacer></v-spacer>
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="getPreguntas"
      :search="search"
      :expanded.sync="expanded"
      item-key="id"
      show-expand
      class="elevation-1"
      :footer-props="{
        'items-per-page-text':'Por página',
      }"
    >
      <template v-slot:[`item.seleccion`]="{ item }">
        <div v-if="item.seleccion_multiple==true">Multiple</div>
        <div v-else>Simple</div>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on" @click="editItem(item)">
              <v-icon color v-bind="attrs" v-on="on">mdi-pencil</v-icon>
            </v-btn>
          </template>
          <span>Editar</span>
        </v-tooltip>
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on" @click="deleteItem(item)">
              <v-icon color v-bind="attrs" v-on="on">mdi-delete</v-icon>
            </v-btn>
          </template>
          <span>Eliminar</span>
        </v-tooltip>
      </template>
      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length">
          <v-simple-table dense :class="tamano">
            <thead>
              <tr>
                <th class="text-center teal lighten-3" v-if="getDisplayGrande">Respuesta</th>
                <th class="text-center teal lighten-3" v-else>Resp.</th>
                <th class="text-center teal lighten-3">Archivo</th>
                <th class="text-center teal lighten-3" v-if="getDisplayGrande">Puntaje</th>
                <th class="text-center teal lighten-3" v-else>Pts.</th>
                <th class="text-center teal lighten-3">Acciones
                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn  v-bind="attrs" v-on="on" class="mx-2" fab dark x-small color="secondary" @click="nuevaRespuesta(item)">
                        <v-icon dark>mdi-plus</v-icon>
                      </v-btn>
                    </template>
                    <span>Nueva Respuesta</span>
                  </v-tooltip>
                </th>
              </tr>
            </thead>
            <tbody v-if="item.brespuesta.length > 0">
                <tr v-for="resp in item.brespuesta" :key="resp.id">
                  <td class="text-center teal lighten-5 ">{{ resp.respuesta }}</td>
                  <td v-if="resp.archivo === true" class="text-center teal lighten-5 ">Si</td><td class="teal lighten-5 text-center" v-else>No</td>
                  <td class="text-center teal lighten-5 ">{{ resp.puntaje }}</td>
                  <td class="text-center teal lighten-5 ">
                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn icon small v-bind="attrs" v-on="on" @click="editRespuesta(resp)">
                          <v-icon color>mdi-pencil</v-icon>
                        </v-btn>
                      </template>
                      <span>Editar</span>
                    </v-tooltip>
                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn icon small v-bind="attrs" v-on="on" @click="deleteRespuesta(resp)">
                          <v-icon color>mdi-delete</v-icon>
                        </v-btn>
                      </template>
                      <span>Eliminar</span>
                    </v-tooltip>
                  </td>
                </tr>
            </tbody>
            <tbody v-else>
              <td colspan="5" class="text-center text-center teal lighten-5">No existen respuestas</td>
            </tbody>
          </v-simple-table>
        </td>
      </template>
      <template v-slot:no-data>No hay registros</template>
    </v-data-table>
    <NuevoEditarRespuesta :nuevoEditar="nuevoEditar" :dialogF="dialogF" :itemEnviar="itemEnviar"/>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import NuevoEditarRespuesta from "@/components/becas/convocatoria/NuevoEditarRespuesta"
export default {
  name: "becas-convocatoria-cuestionario-listOpen",
  components: {NuevoEditarRespuesta},
  data() {
    return {
      expanded: [],
      search: "",
      nuevoEditar:"Nuevo Registro",
      dialogF: false,
      itemEnviar:{
          respuesta: "",
          comentario: "",
          archivo: false,
          puntaje: "",
          universidad_beca_cuestionario_id:0,
          id: 0,
      },
      headers: [
        {
          text: "Pregunta",
          value: "pregunta",
          align: "center",
          class: "subtitle-2 deep-purple lighten-5",
        },
        {
          text: "Comentario",
          value: "comentario",
          align: "center",
          class: "subtitle-2 deep-purple lighten-5",
        },
        {
          text: "Selección",
          value: "seleccion",
          align: "center",
          class: "subtitle-2 deep-purple lighten-5",
        },
        {
          text: "Puntaje",
          value: "puntaje",
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
        {
          text: "",
          value: "data-table-expand",
          class: "subtitle-2 deep-purple lighten-5",
        },
      ],
    };
  },
  computed: {
    ...mapGetters(["getPreguntas","getDisplayGrande"]),
    tamano(){
      return (this.getDisplayGrande)? 'ma-3':'ml-n5';
    }
  },
  methods: {
    ...mapActions(["alert","eliminarRespuesta"]),
    editItem(item) {
      this.$emit("editItem", item);
    },
    deleteItem(item) {
      this.$vuetifyConfirmDialog
        .open("Confirmación", "¿Está seguro de eliminar el registro?", "Cancelar", "Confirmar", "primary", "secondary")
        .then(state => {
            if (state == true)
                this.$emit("deleteItem", item);
        });
    },
    nuevaRespuesta(item){
      this.nuevoEditar = "Nuevo Registro";
      this.itemEnviar.universidad_beca_cuestionario_id = item.id;
      this.dialogF = !this.dialogF;
    },
    editRespuesta(resp){
      this.nuevoEditar = "Editar Registro";
      this.itemEnviar = resp;
      this.dialogF = !this.dialogF;
    },
    deleteRespuesta(resp){
      this.$vuetifyConfirmDialog
        .open("Confirmación", "¿Está seguro de eliminar el registro?", "Cancelar", "Confirmar", "primary", "secondary")
        .then(state => {
            if (state == true){
              //eliminar
             this.eliminar(resp)
            }
        });
    },
    async eliminar(resp){
      try{
          await this.eliminarRespuesta(resp);
          this.alert({
              text: "Registro eliminado",
              color: "primary"
          });
        }catch(error){
          let text = error;
          if(error.response) text = error.response.data;
          this.alert({
              text: text,
              color: "red"
          });
        }
      }
  },
};
</script>
