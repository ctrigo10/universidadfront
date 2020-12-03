<template>
  <v-footer
   color="grey lighten-2"
    app
    fixed
    permanent
    class="font-weight-light py-0"
  >
     <v-col class="text-center pa-0"  cols="12">
          <span class="text-caption grey--text text--darken-3">
            Copyright &copy; {{ new Date().getFullYear() }}
            <a
              class="grey--text text--darken-2 text-decoration-none"
              href="//minedu.gob.bo/"
              target="_blank"
            >
              <strong>Ministerio de Educación</strong>
            </a>
          </span>
        </v-col>
  </v-footer>
</template>

<script>
export default {
  name: 'app-footer'
}
</script>
