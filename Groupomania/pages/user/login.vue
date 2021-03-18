<template>
  <div>
    <h1 class='text-center margin'>Connexion</h1>
    <div>
      <UserAuthForm buttonText="Connexion" :submitForm="loginUser" />
    </div>  
    <p class='text-center margin'>En cas d'oubli d'identifiant/mot de passe , veuillez contacter un modérateur.</p>
    <img src="~/assets/icon-above-font.svg" class="img-marg"/>
  </div>  
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
    },
  }
}
</script>

<style>
.margin{
  margin: 24px 0px;
}

.img-marg{
  margin-top: 24px;
}

@media (min-width:768px){
  .img-marg{
    height: 380px;
    width: 100%;
  }
}
</style>
