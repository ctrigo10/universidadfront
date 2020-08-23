<template>
  <v-container grid-list-xl fluid>
    <header-title title="Orientación Vocacional"></header-title>
    <v-row class="mb-6">
      <v-col cols="12" sm="6">
        <v-card>
          <v-card-title>Formulario de evaluación</v-card-title>
          <!-- <v-card-subtitle class="pb-0">Descripción</v-card-subtitle> -->
          <v-divider></v-divider>
          <v-card-text>
            Ingrese el Código RUDE o CI del estudiante.
            <v-row>
              <v-col cols="12" sm="8" class="py-0">
                <v-text-field label="Código RUDE/CI"></v-text-field>
              </v-col>

              <v-col cols="12" sm="4">
                <v-btn color="primary">
                  <v-icon>mdi-magnify</v-icon>Buscar
                </v-btn>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field v-model="first" label="Nombre" filled></v-text-field>
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field v-model="last" label="Apellidos" filled></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>

          <!-- <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" texts>Ingresar</v-btn>
          </v-card-actions>-->
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import HeaderTitle from "@/components/HeaderTitle";
// import Service from "../../services/general";
// import axios from "axios";
export default {
  name: "universidad",
  components: {
    HeaderTitle,
  },
  data: () => ({
    message: "",
  }),
  mounted() {},
  methods: {},
};
</script>