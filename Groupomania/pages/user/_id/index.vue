<template>
  <div v-cloak>
    <div v-if='isLoading !== true'>
      <div class="container">
        <div>
          <h1 class="title">Compte de {{userInfo.username}}</h1>
          <img src="~/assets/icon.svg" />
          {{userInfo}}
          {{msgInfo}}
          {{likesInfo}}
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
      console.log(this.$route.params.id)
    await this.$axios.get('http://localhost:3000/api/auth/' + this.$route.params.id) 
    .then((response) => {
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