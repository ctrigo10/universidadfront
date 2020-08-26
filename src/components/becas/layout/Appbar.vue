<template>
  <v-app-bar
    app
    fixed
    dense
    clipped-left
    dark
    color="primary"
  >
    <img src="@/assets/logo-minedu.png" class="logo"/>
    <v-app-bar-nav-icon @click.stop="$emit('update:expanded', !expanded)"></v-app-bar-nav-icon>
    <v-toolbar-title>{{ bar.text }}</v-toolbar-title>
    <v-spacer></v-spacer>
   <LoggedUser/>
  </v-app-bar>
</template>

<script>
import LoggedUser from '@/components/becas/layout/LoggedUser'

export default {
  name: 'app-mainbar',
  components: {
    LoggedUser
  },
  props: {
    expanded: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    bar() {
      if (process.env.NODE_ENV != 'production') {
        return {
          text: `Sistema de Becas (versión de prueba)`
        }
      } else {
        return {
          text: `Sitema de Becas`
        }
      }
    }
  }
}
</script>
<style scoped>
  .logo{
    width: 14.3%;
    height: 98%;
    padding: 0.4%;
    margin-left: -1.5%;
    background-color: white;
  }
</style>