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
      this.$store.dispatch('snackbar/setSnackbar', {text: 'Connexion'})
      this.$router.push('/')
      }
      catch(error){
        console.log(error)
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
