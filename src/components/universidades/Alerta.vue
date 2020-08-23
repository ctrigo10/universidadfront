<template>
  <v-alert
    v-if="open"
    text
    dense
    icon="mdi-clock-fast"
    border="left"
    :type="type"
  >
    {{text}}
  </v-alert>
</template>
<script>
export default {
  name: 'alerta',
  props: ['type','text'],
  data: () => ({
    open: false
  }),
  mounted(){
    if(this.text != ''){
        this.open = true;
    }
  }
}
</script>
<style scope>
  .v-alert {
    position: absolute;
    right: 25px;
  }
</style>