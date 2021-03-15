<template>
  <v-container >
    <h1>Connexion</h1>
  <div>
    <UserAuthForm buttonText="Connexion" :submitForm="loginUser" />
  </div>  
  </v-container>  
</template>

<script>
import UserAuthForm from '@/components/UserAuthForm'
export default {
  components:{
    UserAuthForm
  },
  methods: {
    async loginUser(loginInfo){
      try{
        await this.$auth.loginWith('local', {
        data: 
          // username: 'your_username',
          // password: 'your_password'
          loginInfo       
      })        
        this.$toast.show("Connexion réussie", 
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
      }
      catch(error){             
        this.$toast.show(error.response.data.message, 
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
        console.log(error.response)
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
