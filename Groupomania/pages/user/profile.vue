<template>
  <div v-cloak>
    <div v-if='isLoading !== true' class="custom-post-container">
      <div class="d-flex justify-center align-center flex-column">
        <div class="header-layout">
          <svg width="420" height="120" class="svg-header">
            <image href="~/assets/icon-left-font-monochrome-black.svg"  height="120" width="420" class="header-img" alt="logo Groupomania alternatif"/>
          </svg>   
          <div class="d-flex flex-row align-center marg-btn">  
            <v-avatar color="indigo" size="50" class="profile-icon">
              <v-icon dark>
                mdi-account-circle
              </v-icon>
            </v-avatar>
            <h1 class="pad-username">Mon Compte</h1>
          </div>
        </div>       
          <h2 class="marg-h2-profile text-center">Mes messages postés : {{userInfo.nombre_message}}</h2> 
          <p class="marg-p-profile">↓&nbsp;&nbsp;↓&nbsp;&nbsp;↓</p>
        <v-simple-table
          fixed-header
          class="col-12 profile-table"
        >
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">
                  Titre des messages
                </th>
                <th class="text-left">
                  Aperçu du contenu
                </th>            
              </tr>
            </thead>
            <tbody v-if="msgInfo.length > 0">
              <tr
                v-for="item in msgInfo"
                :key="item.name"
                @click="linktoMessage(item)"
                class="hover-link"
              >              
                <td class="td-width">{{ item.title }}</td>
                <td class="td-width">{{ item.content }}</td>
              </tr>
            </tbody>
            <div v-else>  
              <p class="marg-btn">Aucune donnée à afficher</p>
            </div>  
          </template>
        </v-simple-table>
          <h2 class="marg-h2-profile text-center">Mes j'aimes : {{userInfo.nombre_likes}}</h2>
          <p class="marg-p-profile">↓&nbsp;&nbsp;↓&nbsp;&nbsp;↓</p>
        <v-simple-table
          fixed-header
          class="col-8 profile-table"
        >
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-center">
                  Titre des messages aimés
                </th>             
              </tr>
            </thead>
            <tbody v-if="msgInfo.length > 0">
              <tr
                v-for="item in likesInfo"
                :key="item.name"
                @click="linktoMessage(item)"
                class="hover-link"
              >              
                <td class="td-width">{{ item.title }}</td>
              </tr>
            </tbody>
            <div v-else>  
              <p class="marg-btn">Aucune donnée à afficher</p>
            </div>  
          </template>
        </v-simple-table>
           <v-btn @click="deleteUser()" v-if="$auth.user[0] || $auth.user && $auth.user[0].isAdmin" class="marg-btn btn-red">Supprimer mon compte</v-btn>
      </div>     
    </div>    
    <Loader v-else/>    
  </div>    
</template>

<script>
import Loader from '@/components/Loader'
export default {
  middleware:'auth',
  components:{
    Loader
  },
  data() {
    return {
      userInfo:{},
      msgInfo:[],
      likesInfo:[],
      isLoading:true,
    }
  },
  mounted(){
    this.asyncData()
  }
  ,
  methods:{
    async asyncData(){
      await this.$axios.get('http://localhost:3000/api/auth/current') 
      .then((response) => {
          console.log(response)
          this.isLoading=false
          this.userInfo = response.data.user[0]      
          })
          .catch((error) => {
            console.log(error)
          });
      await this.$axios.get('http://localhost:3000/api/auth/' + this.$auth.user[0].idUSERS + '/messages') 
      .then((response) => {
          console.log(response)
          this.msgInfo = response.data.msg     
          })
          .catch((error) => {
            console.log(error)
          })
      await this.$axios.get('http://localhost:3000/api/auth/' + this.$auth.user[0].idUSERS + '/likes') 
      .then((response) => {
          console.log(response)
          this.likesInfo = response.data.likes      
          })
          .catch((error) => {
            console.log(error)
          })   
      this.isLoading=false       
    },
    deleteUser(){
      if(confirm("Êtes vous sûr?") === true){
        this.$axios.post('http://localhost:3000/api/auth/' + this.$auth.user[0].idUSERS + '/disable')       
          .then((response) => {
            if($auth.user[0].isAdmin){
              this.$router.push({ name:'user-admin-users' })    
            }
              this.$auth.logout()       
          })
          .catch( (error) => {
          this.$toast.show("Il y'a eu un problème lors de la suppression de l'utilisateur", 
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
            console.log(error);
          });
      }
    },
    linktoMessage(message){
      this.$router.push('/messages/' + message.idMESSAGES)
    }
  }
}

</script>

<style scoped>
.marg-h2-profile{
  margin-top : 12px;
}
.marg-p-profile{
  margin-bottom: 0px;
}
.pad-username{
  padding-left: 20px;
}
.td-width {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  max-width: 140px;
}
@media (max-width:420px){
  .pad-username{
  padding-left: 6px;
  }
}
.profile-table{
  margin: 12px 0px;
  max-height: 300px;
  overflow-y: auto;
}
</style>