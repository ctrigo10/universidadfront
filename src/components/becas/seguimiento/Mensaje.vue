<template>
  <v-card class="mx-auto" color="secondary" dark>
    <v-card-title>
      <v-icon large left>mdi-message</v-icon>
      <span class="title font-weight-light">BECAS SOCIALES</span>
    </v-card-title>
    <v-card-text class="white--text">
    <p class="body-1">{{ mensaje }}</p>
    <v-divider class="mt-3"></v-divider>
    <p class="body-2">"Por un Pacto Nacional para la Modernización Educativa"</p>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
    props:["mensaje"]
}
</script>