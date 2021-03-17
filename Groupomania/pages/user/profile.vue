<template>
  <div v-cloak>
    <div v-if='isLoading !== true'>
      <div class="d-flex justify-center align-center flex-column">
        <img src="~/assets/icon-left-font.svg" class="img-marg-profile"/>        
        <h1>Compte de {{userInfo.username}}</h1>
        <div>
          <p class="text-center">Mes messages postés (commentaires inclus) : {{userInfo.nombre_message}}</p>
        </div>

        <div>
          <p>Mes j'aimes : {{userInfo.nombre_likes}}</p>
        </div>    
        <!-- {{userInfo}} -->
        <!-- {{msgInfo}} -->
        {{likesInfo}}
        <v-simple-table
          fixed-header
          height="300px"
          class="col-5"
        >
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">
                  Titre
                </th>
                <th class="text-left">
                  Contenu
                </th>              
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in msgInfo"
                :key="item.name"
              >              
                <td>{{ item.title }}</td>
                <td>{{ item.content }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>

        <v-simple-table
          fixed-header
          height="300px"
          class="col-5"
        >
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">
                  Titre
                </th>             
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in likesInfo"
                :key="item.name"
              >              
                <td>{{ item.title }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
           <v-btn @click="deleteUser()" v-if="$auth.user[0] || $auth.user && $auth.user[0].isAdmin">Supprimer mon compte</v-btn>
      </div>

      
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
  }
}

</script>

<style scoped>
.img-marg-profile{
  margin-top: 24px;
  height: 180px;
  width: 100%;
}

@media (max-width:580px){
  .img-marg-profile{
    height: 110px;
    margin-top: 14px;
  }
}

td {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
</style>