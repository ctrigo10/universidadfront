<template>
  <v-container grid-list-xl fluid>
    <header-title title="Inicio"></header-title>
    <v-row class="mb-6">
      <v-col cols="12" sm="8">
        <v-row>
          <v-col v-for="(item, index) in cursos" :key="index" cols="12" sm="4">
            <v-card>
              <!-- <v-card-title>{{ item.descripcion }}</v-card-title> -->
              <!-- <v-card-subtitle class="pb-0">{{ item.descripcion }}</v-card-subtitle>
              <v-divider></v-divider> -->
              <v-card-text>
                <v-list two-line subheader>
                  <v-subheader
                    ><h2>{{ item.descripcion }}</h2></v-subheader
                  >
                  <v-divider></v-divider>
                  <v-list-item class="mt-2">
                    <v-list-item-content>
                      <v-list-item-title
                        >Fecha de inscripción</v-list-item-title
                      >
                      <v-list-item-subtitle
                        >Fecha de Inicio:
                        {{
                          item.fecha_inicio | formatdate
                        }}</v-list-item-subtitle
                      >
                      <v-list-item-subtitle
                        >Fecha de Fin:
                        {{ item.fecha_fin | formatdate }}</v-list-item-subtitle
                      >
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>Estado del curso</v-list-item-title>
                      <v-list-item-subtitle>
                        <v-chip
                          class="ma-2"
                          :color="item.estado ? 'green' : 'orange'"
                          text-color="white"
                        >
                          {{ item.estado ? "Abierto" : "Cerrado" }}
                        </v-chip>
                      </v-list-item-subtitle>
                      <!-- <v-list-item-subtitle>Fecha de Fin: {{ item.fecha_fin | formatdate }}</v-list-item-subtitle> -->
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn :href="item.enlace" target="_blank"
                  >Ir a plataforma</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" sm="4">
        <v-card class="mb-4" v-for="(item, index) in comunicados" :key="index">
          <v-card-title>Comunicado</v-card-title>
          <!-- <v-card-subtitle class="pb-0">Prioridad</v-card-subtitle> -->
          <v-divider></v-divider>
          <v-card-text>{{ item.descripcion }}</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <small class="grey--text"
              >Fecha: {{ item.createdAt | formatdate }}</small
            >
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <!-- <v-row class="mb-6" no-gutters>
      <v-col cols="12" sm="4">
        <v-card>
          <v-card-title>Comunicados</v-card-title>
          <v-divider></v-divider>
          <v-card-text>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Fuga quidem autem blanditiis dolores perspiciatis eveniet ea deserunt, hic animi laborum temporibus expedita at pariatur excepturi molestias vel, eos ratione. Optio.</v-card-text>

          <v-card-actions>
            <v-btn color="primary" text>Leer más ...</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row> -->
  </v-container>
</template>

<script>
import HeaderTitle from "@/components/HeaderTitle";
import Service from "../../services/general";
import axios from "axios";
export default {
  name: "preuniversitario-publico",
  components: {
    HeaderTitle,
  },
  data: () => ({
    message: "",
    loading: false,
    loadingComunicados: false,
    cursos: [],
    comunicados: [],
  }),
  mounted() {
    this.getCursos();
    this.getComunicados();
  },
  methods: {
    getCursos() {
      this.loading = true;
      axios
        .get(Service.getBasePre() + "/habilitar/cursos/activo")
        .then((response) => {
          this.loading = false;
          this.cursos = response.data;
        })
        .catch((error) => {
          this.loading = false;
          console.error("Error al cargar datos", error);
        });
    },
    getComunicados() {
      this.loadingComunicados = true;
      axios
        .get(Service.getBasePre() + "/comunicados/activo")
        .then((response) => {
          this.loadingComunicados = false;
          this.comunicados = response.data;
        })
        .catch((error) => {
          this.loadingComunicados = false;
          console.error("Error al cargar datos", error);
        });
    },
  },
};
</script>