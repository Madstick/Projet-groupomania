<template>
  <v-container >
    <h1>Inscription</h1>
  <div>
    <UserAuthForm buttonText="Inscription" :submitForm="registerUser" hasName="true" />
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
    async registerUser(registrationInfo){
      try{
        await this.$axios.post('http://localhost:3000/api/auth/signup', registrationInfo)
        
        await this.$auth.loginWith('local', {
        data: 
          registrationInfo      
      })
      this.$store.dispatch('snackbar/setSnackbar', {text: 'Inscription réussi'})
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
