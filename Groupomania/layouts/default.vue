<template>
    <v-app>
      <v-app-bar app color="#091f43">
        <div v-if="$auth.loggedIn">
          <v-btn text to='/messages' color="white">Accueil</v-btn>
          <v-btn text to="/user/admin-users" v-if="$auth.user && $auth.user[0].isAdmin" color="white">Admin</v-btn>
        </div>
        <div v-else>
          <v-btn text to="/" color="white">Accueil</v-btn>
        </div>
        <v-spacer />

        <div v-if="$auth.loggedIn">
          <v-btn text to="/user/profile" color="white">{{ $auth.user[0].username }}</v-btn>
          <v-btn text @click="$auth.logout()" color="white">Se déconnecter</v-btn>
        </div>
        <div v-else>
          <v-btn text to="/user/login" color="white">Connexion</v-btn>
          <v-btn text to="/user/register" color="white">Inscription</v-btn>
        </div>
        </v-app-bar>  

      <v-main>
        <div v-if="!$auth.loggedIn && $route.name !== 'index' && $route.name !== 'user-login' && $route.name !== 'user-register'">
          <p class="text-center exp-session">Votre session à expirée, veuillez vous reconnecter</p>
        </div>
        <Nuxt />
      </v-main>  
      <v-footer
        color="#091f43"
        padless
        class="marg-footer"
      >
        <v-row
          justify="center"
          no-gutters
        >
          <v-btn
            v-for="link in links"
            :key="link"
            color="white"
            text
            rounded
            class="my-2 padding-btn-footer"
            :to='link.link' 
          >
            {{ link.label }}
          </v-btn>
            <span class="white--text footer-year">{{ new Date().getFullYear() }} — <strong>Vuetify</strong></span>
        </v-row>
      </v-footer>  
    </v-app>
</template>

<script>
  export default {
    data: () => ({
      links: [
        {label:'A propos',link:'/about-us'},
        {label:'Nous contacter',link:'/contact'}
      ],
    }),
  }
</script>

<style>
.exp-session{
  font-size: 42px;
  margin-top: 42px;
}
.marg-btn{
  margin: 12px 12px;
}
.footer-year{
  line-height: 52px;
  padding-left: 12px;
}
@media (max-width:400px){
  .footer-year{
    padding: 0;
  }
}
.marg-footer{
  margin-top: 16px;
}
</style>
