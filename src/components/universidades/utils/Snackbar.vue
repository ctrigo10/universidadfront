<template>
  <v-snackbar
    v-model="snack.visible"
    :color="snack.color"
    :multi-line="snack.multiline"
    :timeout="snack.timeout"
    top
    right
  >
    <v-icon v-if="snack.color == 'success'">mdi-check</v-icon>
    <v-icon v-if="snack.color == 'info'">mdi-information-outline</v-icon>
    <v-icon v-if="snack.color == 'warning'">mdi-alert-outline</v-icon>
    <v-icon v-if="snack.color == 'error'">mdi-information-outline</v-icon>
    {{ snack.text }}
    <v-btn class="boton" text color @click="uniCloseAlert">Cerrar</v-btn>
  </v-snackbar>
  <!-- <div>sdfsdf</div> -->
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
  name: 'uni-snackbar',
  data: () => ({
  }),
  computed: {
    ...mapGetters({snack: 'getUniSnackbar'})
  },
  methods: {
    ...mapMutations(["uniCloseAlert"]),
  }
}
</script>

<style>

</style>