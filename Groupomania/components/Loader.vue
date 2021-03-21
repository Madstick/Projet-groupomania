<template>

    <v-container style="height: 400px;">
        <v-row
          class="fill-height"
          align-content="center"
          justify="center"
        >
          <v-col
            class="subtitle-1 text-center"
            cols="12"
          >
            Récupération des données
          </v-col>
          <v-col cols="6">
              <div style="min-height: 4px;">
                <v-progress-linear
                  v-model="value"
                  :active="show"
                  :indeterminate="query"
                  :query="true"
                ></v-progress-linear>
              </div>
            <!-- <v-progress-linear
              color="deep-purple accent-4"
              indeterminate
              rounded
              height="6"
            ></v-progress-linear> -->
          </v-col>
        </v-row>
    </v-container>

</template>

<script>
  export default {
    data () {
      return {
        value: 0,
        query: false,
        show: true,
        interval: 0,
      }
    },

    mounted () {
      this.queryAndIndeterminate()
    },

    beforeDestroy () {
      clearInterval(this.interval)
    },

    methods: {
      queryAndIndeterminate () {
        this.query = true
        this.show = true
        this.value = 0

        setTimeout(() => {
          this.query = false

          this.interval = setInterval(() => {
            if (this.value === 100) {
              clearInterval(this.interval)
              this.show = false
              return setTimeout(this.queryAndIndeterminate, 2000)
            }
            this.value += 25
          }, 1000)
        }, 2500)
      },
    },
  }
</script>
