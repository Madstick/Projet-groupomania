<template>
  <div v-cloak>
    <div v-if='isLoading !== true'>
      <div class="container">
        <div>
          <h1 class="title">Votre compte</h1>
          <img src="~/assets/icon.svg" />
          {{userInfo.username}}
          {{userInfo}}
          {{msgInfo}}
          {{likesInfo}}
           <v-btn @click="deleteUser()" v-if="$auth.user[0] || $auth.user && $auth.user[0].isAdmin">Supprimer mon compte</v-btn>
        </div>
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
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
</style>