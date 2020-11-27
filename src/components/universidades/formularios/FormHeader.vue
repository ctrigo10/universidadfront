<template>
  <div class="form-header">
    <table>
      <tr>
        <td rowspan="3">
          <img src="../../../assets/minedu.png" alt="" class="logo">
        </td>
        <td colspan="2" class="ministerio-text">MINISTERIO DE EDUCACIÓN DEPORTES Y CULTURAS</td>
      </tr>
      <tr>
        <td colspan="2">VICEMINISTERIO DE EDUCACIÓN SUPERIOR DE FORMACIÓN PROFESIONAL</td>
      </tr>
      <tr>
        <td colspan="2" class="direccion-text">DIRECCIÓN GENERAL DE EDUCACIÓN SUPERIOR UNIVERSITARIA</td>
      </tr>
      <tr>
        <td>Fecha: {{getFechaActual}}</td>
        <td v-text="title"></td>
        <td>MANUAL DE PROCEDIMIENTOS PARA LA IMPLEMENTACIÓN DE LA COMPLEMENTARIEDAD ENTRE MODALIDADES DE ATENCIÓN EDUCATIVA SUPERIOR UNIVERSITARIA</td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  props: ['title'],
  date: () => ({
    // fecha: new Date()
  }),
  computed: {
    getFechaActual() {
      let fecha = new Date()
      return `${fecha.getDate()}-${fecha.getMonth()+1}-${fecha.getFullYear()}`
    }
  } 
}
</script>

<style>
  .form-header table{
    font-size: 13px;
    text-align: center;
    margin-top: 10px;
    margin-bottom: 10px;
  }
  .form-header table td{
    border: 1px solid #CCCCCC;
    font-style: italic;
    font-weight: bold;
  }
  .form-header .ministerio-text {
    font-size: 17px;
    background: #ceb6d4;
  }
  .form-header .direccion-text {
    background: #CCCCCC;
  }
</style>