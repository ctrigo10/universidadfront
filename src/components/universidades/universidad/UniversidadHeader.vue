<template>
  <div class="academico-header">
    <div style="opacity: 0" class="laterales">
      <!-- ----------- -->
      <!-- <img :src="rutaImagen" class="logoHeader"/> -->
    </div>
    <div>
      <h4>{{universidad}}</h4>
      <div v-if="sedeSubsede != ''" class="sedeSubsede">{{sedeSubsede}}</div>
    </div>
    <div class="laterales">
      <!-- SIE: {{ universidadId }} -->
    </div>
  </div>
</template>

<script>
import Servicio from '@/services/general'
export default {
  name: 'universidad-header',
  // props: ['universidadId','universidad','sedeSubsede'],
  props: {
    universidadId: {
      type: Number
    },
    universidad: {
      type: String,
    },
    sedeSubsede: {
      type: String,
      default: ''
    },
    imagen: {
      type: String,
      default: ''
    }
  },
  computed: {
    rutaImagen() {
      return `${Servicio.getServe()}${this.imagen}`
    }
  }
}
</script>

<style>
  .academico-header {
    /* padding: 30px 10px; */
    /* background-color: rgb(127, 89, 176, .2); */
    /* color:  #7f59b0; */
    font-size: 15px;
    text-align: center;
    font-weight: 300;
    background-color: #009688;
    padding: 15px 10px;
    color:white;
    border-radius: 5px;
    display: flex;
    justify-content: space-between;
  }
  .academico-header h4 {
    font-size: 25px;
    text-align: center;
    font-weight: 300;
  }

  .academico-header .sedeSubsede {
    font-size: 17px;
  }

  .logoHeader {
    max-width: 70px;
    height: 45px;
    background-size: cover !important;
  }

  @media only screen and (max-width: 600px) {
    .laterales {
      display: none;
    }
    .academico-header {
      justify-content: center;
    }
    .academico-header h4{ 
      font-size: 20px;
    }
    .academico-header .sedeSubsede {
      font-size: 15px;
    }
  }
</style>