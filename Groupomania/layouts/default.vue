<template>
    <v-app>
      <v-app-bar app color="blue">
        <div v-if="$auth.loggedIn">
          <v-btn text to='/messages'>Accueil</v-btn>
          <v-btn text to="/user/admin-users" v-if="$auth.user && $auth.user[0].isAdmin">Admin</v-btn>
        </div>
        <div v-else>
         <v-btn text to="/">Accueil</v-btn>
        </div>
        <v-spacer />

      <div v-if="$auth.loggedIn">
        <v-btn text to="/user/profile">{{ $auth.user[0].username }}</v-btn>
        <v-btn text @click="$auth.logout()">Se déconnecter</v-btn>
      </div>
      <div v-else>
        <v-btn text to="/user/login">Connexion</v-btn>
        <v-btn text to="/user/register">Inscription</v-btn>
      </div>
      </v-app-bar>  

      <!-- <v-footer
        color="primary lighten-1"
        padless
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
            class="my-2"
          >
            {{ link }}
          </v-btn>
          <v-col
            class="primary lighten-2 py-4 text-center white--text"
            cols="12"
          >
            {{ new Date().getFullYear() }} — <strong>Vuetify</strong>
          </v-col>
        </v-row>
      </v-footer>   -->

    <v-main>
      <div v-if="!$auth.loggedIn && $route.name !== 'index' && $route.name !== 'user-login' && $route.name !== 'user-register'">
        <p class="text-center exp-session">Votre session à expirée, veuillez vous reconnecter</p>
      </div>
      <Nuxt />
    </v-main>  
    </v-app>
</template>

<script>
  export default {
    data: () => ({
      links: [
        'A propos',
        'Nous contacter',
      ],
    }),
  }
</script>

<style>
.exp-session{
  font-size: 42px;
  margin-top: 42px;
}
</style>
