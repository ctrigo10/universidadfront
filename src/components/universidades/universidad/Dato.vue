<template>
  <div>
    <div class="dato-label">{{label}}</div>
    <div v-if="chip == null" class="dato-value">{{value}}</div>
    <v-chip
      :color="chip.color"
      outlined
      v-if="chip != null"
      small
    >
      <v-icon left small>
        {{ chip.icon }}
      </v-icon>
      {{value}}
    </v-chip>
  </div>
</template>

<script>
export default {
  name: 'dato',
  props: ['label', 'value', 'chip']
}
</script>

<style>
  .dato-label {
    font-size: 12px;
    color: #BBBBBB;
    font-weight: 400;
    /* opacity: .9; */
  }
  .dato-value {
    font-size: 15px;
  }
</style>