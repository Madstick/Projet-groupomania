<template>
  <div v-cloak>
    <div v-if='isLoading !== true'>
    <div 
      v-if="$route.params.updated=='yes'">Record updated successfully</div>

    <h2>{{ message.title }}</h2>

    <p>Crée par {{ message.username }}</p>

    <img v-if="message.hasAttachment" :src="message.attachment">

    <p>{{ message.content }}</p>

<v-btn @click='toggleLike'>
  <v-icon v-if="!isUserLiked">{{likeIcon}}</v-icon>
  <v-icon v-else>{{unlikeIcon}}</v-icon>
</v-btn>
<p>{{message.likes}}</p>

    <div>
      <div>
        <nuxt-link :to="'/messages/' + message.idMESSAGES + '/update'">Modifier</nuxt-link>
        <button @click="deleteRecord()">Supprimer</button>
      </div>
      <nuxt-link to="/messages">Retour à l'accueil</nuxt-link>
    </div>

<div>
          <form method="post" @submit.prevent="replyMessage">
          <v-text-field
            v-model="replyMessage.content"  
            name="content"
            label="Votre message"
            id="id"         
          >
            </v-text-field>
          <button type="submit">Envoyer</button>
          <nuxt-link to="/messages">Cancel</nuxt-link>
        </form>
</div>

<div v-if='comments.length>0'>
  <div v-for='message in comments' :key='message.idMESSAGES'>
    {{message}}
    <p>Crée par {{message.username}}</p> 
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
import { mdiArrowUpBoldOutline } from '@mdi/js'; 
import { mdiArrowDownBoldOutline } from '@mdi/js'; 
export default {
  middleware: 'auth',
    data() {
    return {
      message: {
        idUSERS: this.$auth.user[0].idUSERS,
        title: '',
        content: '',
        attachment: '',
        hasAttachment:false,
        username: this.$auth.user[0].username,
        created_at_formated: '',
        message_parent:null,
        likes:0,
      },
      comments: [],
      isLoading:true,
      errors: null,
      url: null,
      likeIcon: mdiArrowUpBoldOutline,
      unlikeIcon: mdiArrowDownBoldOutline,
      isUserLiked: false,
    }
  },
  mounted(){
    this.asyncData()
  },
  methods:{
    async asyncData(){
    await this.$axios.get('http://localhost:3000/api/messages/' + this.$route.params.id) 
    .then((response) => {
      if (response.data.results.length === 0 || response.data.results[0].message_parent) {
        this.$router.push({ name:'messages' })
      }
        console.log(response)
        this.message = response.data.results[0];
        if(this.message.myLikes === 1 ){
          this.isUserLiked = true
        }
        if(this.message.attachment){
          this.message.hasAttachment=true;
        }  
        this.message.attachment = 'http://localhost:3000/images/'+ this.message.attachment;
        this.isLoading=false     
        })
        .catch((error) => {
          console.log(error)
        })  
        this.getcomments()      
    },

    deleteRecord(){
      if(confirm("Are you sure?") === true){
        this.$axios.delete('http://localhost:3000/api/messages/' + this.$route.params.id)
          .then((response) => {
              this.$router.push({ name:'messages', params:{ deleted:'yes' } })           
          })
          .catch( (error) => {
            console.log(error);
          });
      }
    },

    async replyMessage(){
      const formData = new FormData()

      formData.append('title', 'reply:'+ this.message.title)
      formData.append('idUSERS', this.$auth.user[0].idUSERS)
      formData.append('content', this.replyMessage.content)
      formData.append('message_parent', this.message.idMESSAGES)
      formData.append('username', this.$auth.user[0].username)

      await this.$axios
        .$post('http://localhost:3000/api/messages/', formData, {
        })
        .then((response) => {
          console.log(response)
            this.getcomments() 
            this.replyMessage.content = null
        })
        .catch((error) => {
          console.log(error)
        })
    },
    async getcomments(){
      await this.$axios.get('http://localhost:3000/api/messages/comments/' + this.$route.params.id ) 
      .then((response) => {
          this.comments = response.data.results
          })
        .catch((error) => {
          console.log(error)
        })
    },
    async toggleLike(){
      this.isUserLiked = !this.isUserLiked
      if (this.isUserLiked){
        await this.$axios.post('http://localhost:3000/api/messages/like/' + this.$route.params.id )
      .then((response) => {
        console.log(response)
        this.message.likes++
        })
      .catch((error) => {
        console.log(error)
      })
      }
      else {
        await this.$axios.delete('http://localhost:3000/api/messages/like/' + this.$route.params.id )
      .then((response) => {
        console.log(response)
        this.message.likes--
        })
      .catch((error) => {
        console.log(error)
      })
      }
    }
  }
}
</script>
<style>

</style>