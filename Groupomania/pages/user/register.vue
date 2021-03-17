<template>
  <div>
    <h1 class='text-center margin'>Inscription</h1>
  <div>
    <UserAuthForm buttonText="Inscription" :submitForm="registerUser" hasName="true" />
  </div>  
  <div class='text-center margin'>
    <h2>Règles d'utilisation : </h2>
  </div>
  </div>  
</template>

<script>
import UserAuthForm from '@/components/UserAuthForm'
export default {
  components:{
    UserAuthForm
  },
  methods: {
    async registerUser(registrationInfo){
      try{
        await this.$axios.post('http://localhost:3000/api/auth/signup', registrationInfo)
        
        await this.$auth.loginWith('local', {
        data: 
          registrationInfo      
      })
        this.$toast.show("Inscription réussie", 
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
      this.$router.push('/')
      }
      catch(error){
        this.$toast.show("Il y'a eu un problème au moment de l'inscription, veuillez réessayer", 
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
        console.log(error)
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
