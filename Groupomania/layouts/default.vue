<template>
    <v-app>
      <v-app-bar app color="blue">
        <div v-if="$auth.loggedIn">
          <v-btn text to='/messages'>Accueil</v-btn>
          <v-btn text to="user/admin-users" v-if="$auth.user && $auth.user[0].isAdmin">Admin</v-btn>
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

    <v-main>
      <Nuxt />
    </v-main>  
    </v-app>
</template>

<style>


/* html {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
} */

</style>
