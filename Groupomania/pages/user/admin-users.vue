<template>
  <div>
    <template>
      <div>
        <v-data-table
          :headers="headers"
          :items="users"
          item-key="users.idUSERS"
          class="elevation-1"
          :search="search"
          :custom-filter="filterText"
        >
          <template v-slot:top>
            <v-text-field
              v-model="search"
              label="Recherche"
              class="mx-4"
            ></v-text-field>
          </template>
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
        { text: 'Nom utilisateur', align: 'start', value: 'username' },
        { text: 'ID utilisateur', value: 'idUSERS' },
        { text: 'E-mail', value: 'email' },
        { text: 'Privilèges', value: 'isAdmin' },
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
    filterText (value, search, item) {
        return value != null &&
          search != null &&
          typeof value === 'string' && 
          value.toString().indexOf(search) !== -1
      },
  }
}
</script>

<style lang="scss" scoped>
</style>
