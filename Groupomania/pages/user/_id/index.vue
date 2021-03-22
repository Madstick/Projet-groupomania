<template>
  <div v-cloak>
    <div v-if='isLoading !== true'>
      <div class="d-flex justify-center align-center flex-column">
        <h1 class="title">Compte de {{userInfo.username}}</h1>
        <img src="~/assets/icon-left-font.svg" />
        <div>
          <p class="text-center">Messages postés : {{userInfo.nombre_message}}</p>
        </div>

        <div>
          <p>Total de j'aimes : {{userInfo.nombre_likes}}</p>
        </div>    
        <!-- {{userInfo}} -->
        {{msgInfo}}
        {{likesInfo}}
        <v-btn @click="deleteUser()" v-if="$auth.user && $auth.user[0].isAdmin" class="marg-btn">Supprimer mon compte</v-btn>
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
      console.log(this.$route.params.id)
    await this.$axios.get('http://localhost:3000/api/auth/' + this.$route.params.id) 
    .then((response) => {
        this.isLoading=false
        console.log(response)
        this.userInfo = response.data.user[0]  
        this.$axios.get('http://localhost:3000/api/auth/' + this.$route.params.id + '/messages') 
        .then((response) => {
            console.log(response)
            this.msgInfo = response.data.msg     
            })
            .catch((error) => {
              console.log(error)
            })
        this.$axios.get('http://localhost:3000/api/auth/' + this.$route.params.id + '/likes') 
        .then((response) => {
            console.log(response)
            this.likesInfo = response.data.likes      
            })
            .catch((error) => {
              console.log(error)
            })     
    this.isLoading=false           
    })
    .catch((error) => {
      this.$toast.show("Utilisateur introuvable", 
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
      this.$router.push('/messages')
      console.log(error)
    });
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