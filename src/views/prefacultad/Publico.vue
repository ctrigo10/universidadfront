<template>
  <v-container grid-list-xl fluid>
    <header-title title="Inicio"></header-title>
    <v-row class="mb-6">
      <v-col v-for="n in 2" :key="n" cols="12" sm="6">
        <v-card>
          <v-card-title>Notificación</v-card-title>
          <!-- <v-card-subtitle class="pb-0">Descripción</v-card-subtitle> -->
          <v-divider></v-divider>
          <v-card-text>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Minus at hic voluptas quia quis officiis vitae totam animi perferendis doloribus ipsa numquam, laboriosam ducimus voluptates quasi laborum eligendi, nisi mollitia!</v-card-text>

          <v-card-actions>
            <v-btn color="primary" text>Leer más ...</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-row class="mb-6" no-gutters>
      <v-col cols="12" sm="12">
        <v-card>
          <v-card-title>Comunicados</v-card-title>
          <!-- <v-card-subtitle class="pb-0">Descripción</v-card-subtitle> -->
          <v-divider></v-divider>
          <v-card-text>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Fuga quidem autem blanditiis dolores perspiciatis eveniet ea deserunt, hic animi laborum temporibus expedita at pariatur excepturi molestias vel, eos ratione. Optio.</v-card-text>

          <v-card-actions>
            <v-btn color="primary" text>Leer más ...</v-btn>
          </v-card-actions>
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