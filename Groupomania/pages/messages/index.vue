<template>
  <div v-cloak>
    <div v-if='isLoading !== true'>

    <div class="header-layout">
      <svg width="420" height="120" class="svg-header">
        <image href="~/assets/icon-left-font-monochrome-black.svg" height="120" width="420" class="header-img"/>
      </svg>
      <h1>ACCUEIL</h1>
      <v-btn class="btn-red marg-btn" elevation="5" to="/messages/add">Poster un message</v-btn>
    </div>

    <div>
      <v-data-iterator
        :items="messages"
        :items-per-page.sync="itemsPerPage"
        :page.sync="page"
        :search="search"
        :sort-by="sortBy.toLowerCase()"
        :sort-desc="sortDesc"
        hide-default-footer
        class="msg-list"
      >
        <template v-slot:header>
          <v-toolbar
            dark
            color="#091f43"
            class="mb-6 custom-toolbar"
          >
            <v-text-field
              v-model="search"
              clearable
              flat
              solo-inverted
              hide-details
              prepend-inner-icon="mdi-magnify"
              label="Recherche"
            ></v-text-field>
            
              <v-spacer></v-spacer>
              <v-select
                v-model="sortBy"
                flat
                solo-inverted
                hide-details
                :items="keys"
                item-text="label" 
                item-value ="identifier"
                prepend-inner-icon="mdi-magnify"
                label="Trier par"                     
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
          </v-toolbar>
        </template>

        <template v-slot:default="props">
          <v-row class="row_margin">
            <v-col
              v-for="item in props.items"
              :key="item.idMESSAGES"
              cols="12"
              sm="6"
              md="4"
              lg="3"
              class="index-cards"
            >
              <v-card :to="'/messages/' + item.idMESSAGES" >
                <v-card-title class="subheading font-weight-bold justify-center">
                  <h3>
                    {{ item.title }}
                  </h3>
                </v-card-title>

                <v-img 
                  height="150"
                  contain
                  :src='getpostImg(item)'
                ></v-img>

                <v-list dense>
                  <v-list-item
                    v-for="(key, index) in filteredKeys"
                    :key="index"
                  >
                    <v-list-item-content>
                      {{ key.label }}:
                    </v-list-item-content>
                    <v-list-item-content
                      class="align-end"                     
                    >
                      <span v-if="key.identifier.toLowerCase() === 'created_at'"> {{ item[key.identifier.toLowerCase()]|formatDate }}</span>
                      <span v-else>{{ item[key.identifier.toLowerCase()] }}</span>

                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-col>
          </v-row>
        </template>

        <template v-slot:footer>
          <v-row
            class="mt-2 row_margin"
            align="center"
            justify="center"
          >
            <v-col class="col-6 footer-left align-center">
              <span class="grey--text">Messages par page</span>
              <v-menu offset-y>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    dark
                    text
                    color="primary"
                    class=""
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
            <v-col class="footer-right col-6">
              <span
                class="mr-4
                grey--text"
              >
                Page {{ page }} de {{ numberOfPages }}
              </span>
              <div class="footer-right-icons">
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
              </div>
            </v-col>
          </v-row>
        </template>
      </v-data-iterator>
    </div>
  </div>

  <Loader v-else/>

  </div>
</template>

<script>
import Loader from '@/components/Loader'
export default {
  middleware: 'auth',
  components:{
    Loader
  },
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
        {
        identifier: 'created_at',
        label: 'Date de création'
        },
        {
        identifier: 'likes',
        label: 'J\'aimes'
        }
        ],
      isLoading:true,
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
        this.isLoading=false    
      if(this.$route.params.deleted=='yes'){
        this.$toast.show("Message supprimé", 
        { 
          position: "bottom-center", 
          duration : 2000,
          action : {
          text : 'Fermer',
          onClick : (e, toastObject) => {
              toastObject.goAway(0);
          }
          },
        });
      }  
        })
        .catch((error) => {
          console.log(error)
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
.custom-toolbar{
  height: auto !important;
}
.footer-right{
  text-align: right;
}
.footer-right span{
  padding-right: 7px;
}
.footer-left{
  height: 104px;
  display: flex;
}
.row_margin{
  margin-left: 0;
  margin-right: 0;
}
h3{
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
.index-cards{
  /* -webkit-box-shadow: 1px 1px 4px 0px #D1515A; 
  box-shadow: 1px 1px 4px 0px #D1515A; */
}
.msg-list{

}
@media (max-width:768px){
  .custom-toolbar{
    display: flex;
    flex-direction: column;
  }
}
@media(max-width:506px){
  .footer-right{
    display: flex;
    flex-direction: column; 
    align-items: flex-end;
  }
  .footer-right-icons{
    display: flex;
    flex-direction: row;
  }
}
</style>