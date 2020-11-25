<template>
  <v-dialog v-model="dialog" max-width="900px">
    <v-card>
      <v-toolbar flat color="secondary" dark height="50px">
        <v-toolbar-title v-if="edited_item.universidad_beca_solicitud_estado">
          {{ edited_item.estudiante }}
          <v-divider class="mx-4" vertical></v-divider>
          CI: {{ edited_item.carnet_identidad }}
          <v-divider class="mx-4" vertical></v-divider>
          ESTADO:
          {{ edited_item.universidad_beca_solicitud_estado.toUpperCase() }}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="close">
          <v-icon large>mdi-close-circle-outline</v-icon>
        </v-btn>
      </v-toolbar>
      <v-tabs :vertical="vertical" color="secondary">
        <v-tab>
          <v-icon left> mdi-handshake </v-icon>
          Resumen
        </v-tab>
        <v-tab>
          <v-icon left> mdi-animation </v-icon>
          Calificaciones
        </v-tab>
        <v-tab>
          <v-icon left> mdi-clipboard-list-outline </v-icon>
          Cuestionario
        </v-tab>
        <v-tab-item>
          <v-card flat>
            <v-card-text>
              <Resumen :edited_item="edited_item" />
            </v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat>
            <v-card-text>
              <Notas :edited_item="edited_item" />
            </v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat>
            <v-card-text>
              <Cuestionario :edited_item="edited_item" />
            </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs>
    </v-card>
  </v-dialog>
</template>
<script>
import { mapGetters } from "vuex";
import Resumen from "@/components/becas/solicitudes/Resumen";
import Cuestionario from "@/components/becas/solicitudes/Cuestionario";
import Notas from "@/components/becas/solicitudes/Notas";
export default {
  props: {
    dialogE: {
      default: false,
    },
    edited_item_enviar: {},
  },
  components: {
    Cuestionario,
    Resumen,
    Notas
  },
  data: () => ({
    dialog: false,
    edited_item: [],
  }),
  watch: {
    dialogE() {
      this.edited_item = Object.assign({}, this.edited_item_enviar);
      this.dialog = true;
    },
  },
   computed: {
    ...mapGetters(["getDisplayGrande"]),
    vertical(){
      return this.getDisplayGrande;
    }
  },
  methods:{
    close(){
      this.dialog = false;
    }
  }
};
</script>