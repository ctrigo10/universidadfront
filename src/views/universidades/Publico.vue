<template>
<v-container>
  <h1>Universidades</h1>
  <br>
  <v-row class="mb-6" no-gutters>
    <v-col
      v-for="n in 8"
      :key="n"
      cols="3"
    >
      <v-card width="95%" style="margin-bottom:20px">
        <v-img
          class="white--text align-end"
          height="200px"
          src="../../assets/universidad.jpg"
        >
          <!-- <v-card-title>Universidad {{n}}</v-card-title> -->
        </v-img>

        <v-card-subtitle class="pb-0">Universidad {{n}}</v-card-subtitle>

        <!-- <v-card-text class="text--primary">
          <div>Whitehaven Beach</div>

          <div>Whitsunday Island, Whitsunday Islands</div>
        </v-card-text> -->

        <v-card-actions>
          <v-btn
            color="purple"
            text
          >
            Mas información ...
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</v-container>
</template>