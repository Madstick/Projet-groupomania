<template>
  <v-container>
    <v-tabs>
      <v-tab to="/admin/users">Utilisateurs</v-tab>
    </v-tabs>
    <router-view></router-view>
  </v-container>
</template>

<script>
  export default {
    middleware: ['auth'],

    beforeMount() {
        if (!this.$auth.user[0].isAdmin){
            this.$toast.show("Non autorisé", 
            { 
                position: "bottom-center", 
                duration : 2000,
                action : {
                    text : 'Fermer',
                    onClick : (e, toastObject) => {
                        toastObject.goAway(0);
                    }
                },
            }
            );
          this.$router.push('/messages') 
        }
    },
  }
</script>

<style lang="scss" scoped>