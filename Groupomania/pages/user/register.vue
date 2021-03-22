<template>
  <div class="custom-container">
      <img src="~/assets/icon-above-font.svg" class="img-marg"/>
      <h1 class='text-center margin'>Inscription</h1>
      <div>
        <UserAuthForm buttonText="Inscription" :submitForm="registerUser" hasName="true" />
      </div>  
      <div class='text-center margin'>
        <h2>Règles d'utilisation : </h2>
        <br />
        <p>Le <strong>nom d'utilisateur</strong> doit faire plus de 4 et moins de 50 charactères</p>
        <p>Vous devez utiliser votre <strong>Email</strong> interne fourni par l'entreprise (...@groupomania.com)</p>
        <p>Le <strong>nom d'utilisateur</strong> et <strong>l'Email</strong> doivent être chacun <strong>uniques</strong>!</p>
        <p>Pour votre sécurité veuillez mettre au moins un <strong>chiffre</strong>,et un <strong>symbole</strong> dans votre mot de passe</p>
      </div>
  </div>  
</template>

<script>
import UserAuthForm from '@/components/UserAuthForm'
export default {
  middleware:'auth',
  components:{
    UserAuthForm,
  },
  data() {
    return {
    }
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
        this.$router.push('/messages')
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
.custom-container{
  margin: 0 auto !important; 
  padding: 0 10px;
  max-width: 900px;
  width: 100%;
}
.margin{
  margin: 24px 0px;
}
.img-marg{
  margin-top: 24px;
  width: 100%;
  height: 280px;
}
@media (max-width:768px){
  .img-marg{
    height: 160px;
    width: 100%;
  }
}
</style>
