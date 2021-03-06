<template>
  <div>
    <div class="d-flex justify-content-between align-items-center">
      <h1>Messages</h1>
      <nuxt-link to="/messages/add">Poster un message</nuxt-link>
    </div>
    <hr>

    <div 
      v-if="$route.params.created=='yes'">Le message à bien été posté</div>
    <div 
      v-if="$route.params.deleted=='yes'">Le message à bien été supprimé</div>


  <div>

    <v-data-iterator
      :items="messages"
      :items-per-page.sync="itemsPerPage"
      :page.sync="page"
      :search="search"
      :sort-by="sortBy.toLowerCase()"
      :sort-desc="sortDesc"
      hide-default-footer
    >
      <template v-slot:header>
        <v-toolbar
          dark
          color="blue darken-3"
          class="mb-1"
        >
          <v-text-field
            v-model="search"
            clearable
            flat
            solo-inverted
            hide-details
            prepend-inner-icon="mdi-magnify"
            label="Search"
          ></v-text-field>
          <template v-if="$vuetify.breakpoint.mdAndUp">
            <v-spacer></v-spacer>
            <v-select
              v-model="sortBy"
              flat
              solo-inverted
              hide-details
              :items="keys"
              prepend-inner-icon="mdi-magnify"
              label="Sort by"
            ></v-select>
            <v-spacer></v-spacer>
            <v-btn-toggle
              v-model="sortDesc"
              mandatory
            >
              <v-btn
                large
                depressed
                color="blue"
                :value="false"
              >
                <v-icon>mdi-arrow-up</v-icon>
              </v-btn>
              <v-btn
                large
                depressed
                color="blue"
                :value="true"
              >
                <v-icon>mdi-arrow-down</v-icon>
              </v-btn>
            </v-btn-toggle>
          </template>
        </v-toolbar>
      </template>

      <template v-slot:default="props">
        <v-row>
          <v-col
            v-for="item in props.items"
            :key="item.idMESSAGES"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <v-card>
              <v-card-title class="subheading font-weight-bold">
                <nuxt-link :to="'/messages/' + item.idMESSAGES">
                  {{ item.title }}
                </nuxt-link>
              </v-card-title>

              <v-img 
                height="150"
                :src='getpostImg(item)'
              ></v-img>

              <v-list dense>
                <v-list-item
                  v-for="(key, index) in filteredKeys"
                  :key="index"
                >
                  <v-list-item-content :class="{ 'blue--text': sortBy === key }">
                    {{ key }}:
                  </v-list-item-content>
                  <v-list-item-content
                    class="align-end"
                    :class="{ 'blue--text': sortBy === key }"
                  >
                    <span v-if="key.toLowerCase() === 'created_at'"> {{ item[key.toLowerCase()]|formatDate }}</span>
                    <span v-else>{{ item[key.toLowerCase()] }}</span>

                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card>
          </v-col>
        </v-row>
      </template>

      <template v-slot:footer>
        <v-row
          class="mt-2"
          align="center"
          justify="center"
        >
        <v-col>
          <span class="grey--text">Items per page</span>
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                dark
                text
                color="primary"
                class="ml-2"
                v-bind="attrs"
                v-on="on"
              >
                {{ itemsPerPage }}
                <v-icon>mdi-chevron-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                v-for="(number, index) in itemsPerPageArray"
                :key="index"
                @click="updateItemsPerPage(number)"
              >
                <v-list-item-title>{{ number }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-col>  
          <v-spacer></v-spacer>
        <v-col class="footerRight">
          <span
            class="mr-4
            grey--text"
          >
            Page {{ page }} of {{ numberOfPages }}
          </span>
          <v-btn
            fab
            dark
            color="blue darken-3"
            class="mr-1"
            @click="formerPage"
          >
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn
            fab
            dark
            color="blue darken-3"
            class="ml-1"
            @click="nextPage"
          >
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
          </v-col>
        </v-row>
      </template>

    </v-data-iterator>
  </div>


  </div>
</template>

<script>
export default {
  middleware: 'auth',
    data() {
    return {
      message: {
        idUSERS: this.$auth.user[0].idUSERS,
        title: '',
        content: '',
        attachment: '',
        username: this.$auth.user[0].username,
        created_at: new Date,
        likes:0,
      },
      messages:[],
      itemsPerPageArray: [10, 15, 25],
      search: '',
      filter: {},
      sortDesc: false,
      page: 1,
      itemsPerPage: 10,
      sortBy: 'name',
      keys: [
          'created_at',
          'likes',
        ],
      errors: null,
      url: null,
    }
  },
  mounted(){
    this.asyncData()
  },
  computed: {
    numberOfPages () {
      return Math.ceil(this.messages.length / this.itemsPerPage)
    },
    filteredKeys () {
      return this.keys.filter(key => key !== 'title')
    },
  },
  methods:{
    async asyncData(){
    await this.$axios.get('http://localhost:3000/api/messages/') 
    .then((response) => {
        console.log(response)
        this.messages = response.data.results      
        })
        .catch((error) => {
          console.log(error)
          if (error.response.message.errors) {
            this.errors = error.response.message.errors
          }
        })
    },
    getpostImg(item){  
      if (item.attachment == null){
        return 'http://localhost:3000/images/default.jpg'
      }
      return 'http://localhost:3000/images/'+ item.attachment;
    },
    nextPage () {
      if (this.page + 1 <= this.numberOfPages) this.page += 1
    },
    formerPage () {
      if (this.page - 1 >= 1) this.page -= 1
    },
    updateItemsPerPage (number) {
      this.itemsPerPage = number
    },
  }
}
</script>
<style scoped>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.footerRight{
  text-align: right;
}
</style>