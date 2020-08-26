<template>
  <v-snackbar
    class="snackbar"
    v-model="snackbar.visible"
    :timeout="snackbar.timeout"
    :multi-line="snackbar.multiline === true"
    :color="snackbar.color"
    top
    right
  >
    <span class="font-weight-bold">{{ snackbar.text }}</span>
    <v-btn class="boton" text color @click="closeAlert">Cerrar</v-btn>
  </v-snackbar>
</template>
<script>
import { mapActions } from "vuex";
export default {
  computed: {
    snackbar() {
      return this.$store.getters.getSnackBar;
    },
  },
  methods: {
    ...mapActions(["closeAlert"]),
  },
};
</script>

<style scoped>
.snackbar {
  margin-top: 30px;
  margin-left: -10px;
}
.boton {
  margin-left: 70px;
}
</style>