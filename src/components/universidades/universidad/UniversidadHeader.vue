<template>
  <div>
    <!-- <v-card class="tarjeta">
      <v-card-text> -->
        <div class="text-center">
          <h2 class="jupper">{{universidad}}</h2>
          Código SIE: {{universidadId}}
        </div>
      <!-- </v-card-text>
    </v-card> -->
  </div>
</template>

<script>
export default {
  name: 'universidad-header',
  props: ['universidadId','universidad']
}
</script>

<style>

</style>