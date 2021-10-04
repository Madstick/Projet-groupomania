<template>
  <div class="custom-container">
    <img
      src="~/assets/icon-above-font.svg"
      class="img-marg"
      alt="logo Groupomania alternatif"
    />
    <h1 class="text-center margin">Connexion</h1>
    <div>
      <UserAuthForm button-text="Connexion" :submit-form="loginUser" />
    </div>
    <p class="text-center margin">
      En cas d'oubli d'identifiant/mot de passe , veuillez contacter un
      modérateur.
    </p>
  </div>
</template>

<script>
import UserAuthForm from '@/components/UserAuthForm'
export default {
  components: {
    UserAuthForm,
  },
  beforeCreate() {
    if (this.$auth.loggedIn) {
      this.$router.push('/messages')
    }
  },
  methods: {
    async loginUser(loginInfo) {
      try {
        await this.$auth.loginWith('local', {
          data:
            // username: 'your_username',
            // password: 'your_password'
            loginInfo,
        })
        this.$toast.show('Connexion réussie', {
          position: 'bottom-center',
          duration: 2000,
          action: {
            text: 'Fermer',
            onClick: (e, toastObject) => {
              toastObject.goAway(0)
            },
          },
        })
        this.$router.push('/messages')
      } catch (error) {
        this.$toast.show(error.response.data.message, {
          position: 'bottom-center',
          duration: 2000,
          action: {
            text: 'Fermer',
            onClick: (e, toastObject) => {
              toastObject.goAway(0)
            },
          },
        })
        console.log(error.response)
      }
    },
  },
}
</script>

<style scoped>
.margin {
  margin: 24px 0px;
}
.custom-container {
  margin: 0 auto !important;
  padding: 0 10px;
  max-width: 900px;
  width: 100%;
}
.img-marg {
  margin-top: 24px;
  width: 100%;
  height: 280px;
}
@media (max-width: 768px) {
  .img-marg {
    height: 160px;
    width: 100%;
  }
}
</style>
