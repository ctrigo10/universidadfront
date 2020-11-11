<template>
  <div>
    <template>
      <v-breadcrumbs :items="items">
        <template v-slot:item="{ item }">
          <v-breadcrumbs-item
            :to="{ name: item.href }"
            :disabled="item.disabled"
          >
            {{ item.text.toUpperCase() }}
          </v-breadcrumbs-item>
        </template>
      </v-breadcrumbs>
    </template>
  </div>
</template>

<script>
export default {
  props: ['items']
}
</script>

<style>

</style>