<template>
    <v-app>
      <v-app-bar app color="#091f43">
        <v-avatar class="logo-layout">
          <img
            src="~/assets/icon.svg"
            alt="Logo groupomania"           
          >
        </v-avatar> 

          <div v-if="$auth.loggedIn && $vuetify.breakpoint.smAndUp">
            <v-btn text to='/messages' color="white">Accueil</v-btn>
            <v-btn text to="/user/admin-users" v-if="$auth.user && $auth.user[0].isAdmin" color="white">Admin</v-btn>
          </div>
          <div v-else-if="$vuetify.breakpoint.smAndUp">
            <v-btn text to="/" color="white">Accueil</v-btn>
          </div>
          <v-spacer />

          <div v-if="$auth.loggedIn && $vuetify.breakpoint.smAndUp">
            <v-btn text to="/user/profile" color="white">{{ $auth.user[0].username }}</v-btn>
            <v-btn text @click="$auth.logout()" color="white">Se déconnecter</v-btn>
          </div>
          <div v-else-if="$vuetify.breakpoint.smAndUp">
            <v-btn text to="/user/login" color="white">Connexion</v-btn>
            <v-btn text to="/user/register" color="white">Inscription</v-btn>
          </div>

        <div v-else>
          <v-spacer />
          <v-menu
            bottom
            left         
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                dark
                icon
                v-bind="attrs"
                v-on="on"
              >
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>

            <v-list>
              <div v-if="$auth.loggedIn">
                <v-list-item to='/messages'>
                  <v-list-item-content>Accueil</v-list-item-content>
                </v-list-item>
                <v-list-item v-if="$auth.user && $auth.user[0].isAdmin" to="/user/admin-users">
                  <v-list-item-content >Admin</v-list-item-content>
                </v-list-item>
              </div> 
              <div v-else>
                <v-list-item to="/">
                  <v-list-item-content>Accueil</v-list-item-content>
                </v-list-item>
              </div> 
              <div v-if="$auth.loggedIn">
                <v-list-item to="/user/profile">
                  <v-list-item-content>Mon compte</v-list-item-content>
                </v-list-item>
                <v-list-item  @click="$auth.logout()">
                  <v-list-item-content>Se déconnecter</v-list-item-content>
                </v-list-item>
              </div>
              <div v-else>
                <v-list-item to="/user/login">
                  <v-list-item-content>Connexion</v-list-item-content>
                </v-list-item>
                <v-list-item to="/user/register">
                  <v-list-item-content>Inscription</v-list-item-content>
                </v-list-item>
              </div>             
            </v-list>
          </v-menu>
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
            :key="link.label"
            color="white"
            text
            rounded
            class="my-2 padding-btn-footer"
            :href='link.link' 
          >
            {{ link.label }}
          </v-btn>
            <span class="white--text footer-year">{{ new Date().getFullYear() }} — <strong>Groupomania</strong></span>
        </v-row>
      </v-footer>  
    </v-app>
</template>

<script>
  export default {
    data: () => ({
      links: [
        {label:'A propos',link:'https://www.youtube.com/watch?v=dQw4w9WgXcQ'},
        {label:'Nous contacter',link:'mailto:groupomania@groupomania.com'}
      ],
    }),
  }
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Anton&display=swap');
.v-main__wrap{
  background-color: #fafafa;
}
h1 {
  font-size: 2rem;
  font-family: 'Nunito', sans-serif;
}
h3{
  font-family: 'Anton', sans-serif;
}
.custom-container{
  margin: 0 auto !important; 
  padding: 0 10px;
  max-width: 900px;
  width: 100%;
}
.d-flex{
  display: flex;
}
.flex-row{
  flex-direction: row;
}
.justify-end{
 justify-content: flex-end;
}
.text-center{
  text-align: center;
}
.header-layout{
  margin: 16px 0px 8px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}
.header-img, .svg-header{
  margin: 6px 0px;
}
@media(max-width:506px){
  .svg-header{
    width: 300px;
    height: 70px;
  }
  .header-img{
    width: 300px;
    height: 70px;
  }
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
.logo-layout{
  margin-right: 12px;
}
.exp-session{
  font-size: 42px;
  margin-top: 42px;
}
.marg-btn{
  margin: 12px 12px;
}
.marg-btn2{
  margin: 6px 4px;
}
.footer-year{
  line-height: 52px;
  padding-left: 12px;
}
@media (max-width:400px){
  .footer-year{
    padding: 0;
  }
  .profile-icon{
    width: 36px !important;
    min-width: 36px !important;
    height: 36px !important;
  }
}
.marg-footer{
  margin-top: 16px;
}
.btn-red{
  color:rgba(255, 255, 255, 0.9) !important;
  background-color:#d1515a !important;
}
.btn-blue{
  color:rgba(255, 255, 255, 0.9) !important;
  background-color:#091f43 !important;
}
.v-card{
  border: 2px outset #caedfc ;
  border-radius: 12px;
  -webkit-box-shadow: 4px 8px 15px -4px #000000; 
  box-shadow: 4px 8px 15px -4px #000000;
}
</style>
