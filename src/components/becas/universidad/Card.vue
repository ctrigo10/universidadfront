<template>
  <v-card class="overflow-y-auto" width="300" elevation="3" max-height="200">
    <template>
      <v-card id="create" v-if="$store.getters.isAuthenticated">
        <v-speed-dial
          v-model="fab"
          right
          direction="left"
          open-on-hover
          transition="slide-y-reverse-transition"
        >
          <template v-slot:activator>
            <v-btn
              class="mr-n4"
              v-model="fab"
              color="secondary"
              dark
              fab
              x-small
            >
              <v-icon>mdi-dots-horizontal</v-icon>
            </v-btn>
          </template>
          <v-btn
            class="mr-n3"
            fab
            x-small
            dark
            color="primary"
            @click="ingresarUniversidad(universidad)"
          >
            <v-icon>mdi-login</v-icon>
          </v-btn>
          <v-btn
            v-if="getEsFechaRegistro"
            class="mr-n1"
            fab
            dark
            x-small
            color="secondary"
            @click="editItem(universidad)"
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
        </v-speed-dial>
      </v-card>
      <v-btn v-else @click="ingresarUniversidad(universidad)" class="mr-n4" absolute dark fab right color="secondary" x-small>
        <v-icon>mdi-login</v-icon>
      </v-btn>
    </template>


    <v-list-item three-line>
      <v-list-item-content>
        <div class="caption">
          <!--<strong>"{{ universidad.nombre.toUpperCase() }}"</strong>-->
          <strong>{{ universidadNombre }}</strong>
        </div>
        <v-list-item-subtitle
          class="caption"
        >Lugar: {{ universidad.departamento}} - ({{universidad.cantidad_becas}}{{ textBeca }})</v-list-item-subtitle>
        <span class="caption" :id="fondo" v-if="fondo=='fondoMal' && isAuthenticated">Falta registrar {{ universidad.cantidad_becas  - this.universidad.cantidadBecasRegistradas}} beca(s) <v-icon x-small>mdi-alert</v-icon></span>
      </v-list-item-content>
      <v-list-item-avatar tile size="50" color="grey">
        <v-img v-if="universidad.pathImage == null" v-bind:src="require('@/assets/beca_u_sin_imagen.svg')" alt="Logo Universidad" width="60%" />
         <v-img v-else
            class="imagen-universidad"
            :src="host + universidad.pathImage"
          ></v-img>
      </v-list-item-avatar>
    </v-list-item>
    <v-divider></v-divider>
    <div class="pl-2">
      <li class="caption text-truncate" style="max-width: 243px;" v-for="beca in universidad.becas" :key="beca.id">({{beca.cantidad_becas}}) {{beca.titulo.substr(0,3)}}. {{ beca.nombre }}</li>
    </div>
  </v-card>
</template>

<script>
import general from '@/services/general'
import { mapGetters } from 'vuex';
export default {
  name: "Beca-universidad-card",
  props: ["universidad"],

  mounted(){
        this.host = general.getServe();
    },

  data: () => ({
        fab: false,
        host: '',
    }),

  methods: {
    editItem(item) {
      this.$emit("editItem", item);
    },
    ingresarUniversidad(item){
      this.$emit("ingresarUniversidad", item)
    }
  },

  computed: {
    ...mapGetters(["getConvocatoriaLast","isAuthenticated","getEsFechaRegistro"]),
    textBeca() {
      //singular o plural del texto beca
      let nombre = " becas";
      if (this.universidad.cantidad_becas == 1) nombre = " beca";
      return nombre;
    },
    universidadNombre(){
      return this.universidad.nombre.toUpperCase();
    },
    fondo(){
      if(this.universidad.cantidad_becas != this.universidad.cantidadBecasRegistradas)
        return 'fondoMal';
      else
        return 'fondoBien';
    }
  },
};
</script>
<style scoped>
.lugar{
    margin: 50;
}
 #create .v-speed-dial {
    position: absolute;
  }

  #create .v-btn--floating {
    position: relative;
  }
  #fondoMal{
    background-color:yellow;
  }
</style>