<template>
  <div>
    <!-- <div v-for='items in users' :key='items.idUSERS'> -->
      <!-- {{items}} -->
    <template>
      <div>
        <v-data-table
          :headers="headers"
          :items="users"
          item-key="items.idUSERS"
          class="elevation-1"
          :search="search"
          :custom-filter="filterOnlyCapsText"
        >
          <template v-slot:top>
            <v-text-field
              v-model="search"
              label="Recherche (MAJUSCULES SEULEMENT)"
              class="mx-4"
            ></v-text-field>
          </template>
          <p>{{users.username}}</p>
        </v-data-table>
    </div>
  </template>
  </div>  
</template>

<script>
export default {
  middleware: ['auth'],
  data() {
    return {
      users:[],
      search: '',
    }
  },
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
  mounted() {
    this.asyncData()
  },
  computed: {
    headers () {
      return [
        { text: 'Nom utilisateur', align: 'start', value: 'users.username' },
        { text: 'ID utilisateur', value: 'users.idUSERS' },
        { text: 'E-mail', value: 'users.email' },
        { text: 'Privilèges', value: 'users.isAdmin' },
        { text: 'Actions', sortable: false,},
      ]
    },
  },  
  methods: {
    async asyncData(){
      await this.$axios.get('http://localhost:3000/api/auth/') 
      .then((response) => {
        console.log(response)
        this.users=response.data.results     
      })
      .catch((error) => {
        console.log(error)
      });
    },
    filterOnlyCapsText (value, search, item) {
        return value != null &&
          search != null &&
          typeof value === 'string' &&
          value.toString().toLocaleUpperCase().indexOf(search) !== -1
      },
  }
}
</script>

<style lang="scss" scoped>
</style>
