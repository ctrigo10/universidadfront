<template>
  <div class="academico-header">
    <h4>{{universidad}}</h4>
  </div>
</template>

<script>
export default {
  name: 'universidad-header',
  props: ['universidadId','universidad']
}
</script>

<style>
  .academico-header {
    /* padding: 30px 10px; */
    /* background-color: rgb(127, 89, 176, .2); */
    /* color:  #7f59b0; */
    font-size: 25px;
  }
  .academico-header h4 {
    text-align: center;
    font-weight: 400;
  }
</style>