<template>
  <div v-cloak>
    <div v-if='isLoading !== true'>
      <div>
        <h1>Modifier votre message</h1>
        <hr>
        <div>
          <div>
            <MsgForm buttonText="Envoyer" :submitForm="submitForm" :message="message" :key="componentkey"/>
          </div>
        </div>
      </div>
    </div>

    <v-container style="height: 400px;" v-else>
      <v-row
        class="fill-height"
        align-content="center"
        justify="center"
      >
        <v-col
          class="subtitle-1 text-center"
          cols="12"
        >
          Récupération des données
        </v-col>
        <v-col cols="6">
          <v-progress-linear
            color="deep-purple accent-4"
            indeterminate
            rounded
            height="6"
          ></v-progress-linear>
        </v-col>
      </v-row>
    </v-container>

  </div>    
</template>

<script>
import MsgForm from '@/components/MsgForm'
export default {
  middleware: 'auth',
  components:{
    MsgForm
},
  data(){
    return {
      message: {
        title: null,
        content: null,
        attachment: null,
        username: this.$auth.user[0].username,
      },
      componentkey : 0,
      isLoading:true,
    }
  },
  mounted(){
    this.asyncData()
  },
  methods:{
    async asyncData(){
    await this.$axios.get('http://localhost:3000/api/messages/' + this.$route.params.id) 
    .then((response) => {
      if (response.data.results.length === 0){
        this.$router.push({ name:'messages' })
      }
        console.log(response)
        this.message = response.data.results[0]  
        this.componentkey++ 
        this.isLoading=false   
        })
        .catch((error) => {
          console.log(error)
        })
    },
    async submitForm(msgInfo) {
      const formData = new FormData()
      
      formData.append('title', msgInfo.title)
      formData.append('content', msgInfo.content)
      formData.append('message_parent', null)
      formData.append('username', this.$auth.user[0].username)
      if (msgInfo.attachment){
        formData.append('attachment', msgInfo.attachment)
      }

      await this.$axios
        .$put('http://localhost:3000/api/messages/' + this.$route.params.id, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((response) => {
          console.log(response)
          if (response.id) {
            this.$toast.show("Le message à bien été mis à jour", 
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
            this.$router.push('/messages/'+ this.$route.params.id )
          }
        })
        .catch((error) => {
          this.$toast.show("Modification impossible", 
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
        })
    },
  },
}
</script>

<style scoped></style>
