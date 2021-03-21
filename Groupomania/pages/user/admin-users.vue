<template>
  <div v-cloak>
   <div v-if='isLoading !== true'>
      <div class="header-layout">
        <svg width="420" height="120" class="svg-header">
          <image href="~/assets/icon-left-font-monochrome-black.svg" height="120" width="420" class="header-img"/>
        </svg>
      </div>
      <template>
        <div>
          <v-data-table
            :headers="headers"
            :items="users"
            item-key="users.idUSERS"
            class="elevation-1"
            :search="search"
            :custom-filter="filterText"
          >
            <template v-slot:top>
              <v-text-field
                v-model="search"
                label="Recherche"
                class="mx-4"
              ></v-text-field>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
              <nuxt-link :to="'/user/' + item.idUSERS">Voir</nuxt-link>
          
              <span class="pad-span">
                <span v-if="item.enabled == 0" @click="enableUser(item)">
                  Activer
                </span>
                <span v-else @click="disableUser(item)">
                  Désactiver
                </span>
              </span>

              <span v-if="item.enabled == 0" @click="deleteUser(item)">
                Supprimer
              </span>
            </template>
          </v-data-table>
        </div>
      </template>
    </div>
    <Loader v-else/>
  </div>  
</template>

<script>
import Loader from '@/components/Loader'
export default {
  components:{
    Loader
  },
  middleware: ['auth'],
  data() {
    return {
      users:[],
      search: '',
      isLoading:true,
    }
  },
  beforeMount() {
      if (!this.$auth.user[0].isAdmin){
          this.$toast.show("Non autorisé", 
          { 
              position: "bottom-center", 
              duration : 2000,
              action : {
                  text : 'Fermer',
                  onClick : (e, toastObject) => {
                      toastObject.goAway(0);
                  }
              },
          }
          );
        this.$router.push('/messages') 
      }
  },
  mounted() {
    this.asyncData()
  },
  computed: {
    headers () {
      return [
        { text: 'Nom utilisateur', align: 'start', value: 'username' },
        { text: 'ID utilisateur', value: 'idUSERS' },
        { text: 'E-mail', value: 'email' },
        { text: 'Privilèges', value: 'isAdmin' },
        { text: 'Actions', value:'actions',align: 'center', sortable: false,},
      ]
    },
  },  
  methods: {
    async asyncData(){
      await this.$axios.get('http://localhost:3000/api/auth/') 
      .then((response) => {
        console.log(response)
        this.isLoading=false
        this.users=response.data.results     
      })
      .catch((error) => {
        console.log(error)
      });
    },
    filterText (value, search, item) {
        return value != null &&
          search != null &&
          typeof value === 'string' && 
          value.toString().indexOf(search) !== -1
      },
    async enableUser(user){
      await this.$axios.post('http://localhost:3000/api/auth/' + user.idUSERS + '/enable') 
      .then((response) => {
          user.enabled = 1  
        })
        .catch((error) => {
          console.log(error)
        });
    }, 
    async disableUser(user){
      await this.$axios.post('http://localhost:3000/api/auth/' + user.idUSERS + '/disable') 
      .then((response) => {
          user.enabled = 0  
        })
        .catch((error) => {
          console.log(error)
        });
    }, 
    async deleteUser(user){
      if(confirm("Êtes vous sûr?") === true){
        await this.$axios.delete('http://localhost:3000/api/auth/' + user.idUSERS ) 
        .then((response) => {
            this.users.splice(user, 1) 
          })
          .catch((error) => {
            console.log(error)
          });
      }
    }, 
  }
}
</script>

<style lang="scss" scoped>
.pad-span{
  padding: 0px 6px;
}
</style>
