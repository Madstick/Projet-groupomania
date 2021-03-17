<template>
  <div v-cloak>
      <div v-if='isLoading !== true'>
        <v-card             
          align="center"
          justify="center">
          <p>Crée par <nuxt-link :to="'/user/' + message.idUSERS">{{ message.username }}</nuxt-link></p>
          <v-card-title class="subheading font-weight-bold justify-center">
            <h1>
              {{ message.title }}
            </h1>
          </v-card-title>

          <v-img 
            v-if="message.hasAttachment" 
            :src="message.attachment"
            max-width="1280"
            max-height="500"
            contain
          ></v-img>

        <p>{{ message.content }}</p>

        <v-btn @click='toggleLike'>
          <v-icon v-if="!isUserLiked">{{likeIcon}}</v-icon>
          <v-icon v-else>{{unlikeIcon}}</v-icon>
        </v-btn>

        <p>J'aimes :{{message.likes}}</p>

        <div>
          <div>
            <v-btn :to="'/messages/' + message.idMESSAGES + '/update'" v-if="$auth.user[0].idUSERS === message.idUSERS || ($auth.user && $auth.user[0].isAdmin)">Modifier</v-btn>
            <v-btn @click="deleteRecord()" v-if="$auth.user[0].idUSERS === message.idUSERS || $auth.user && $auth.user[0].isAdmin">Supprimer</v-btn>
          </div>
          <v-btn to="/messages">Retour à l'accueil</v-btn>
        </div>
        </v-card>

        <div>
          <form method="post" @submit.prevent="sendComment">
            <v-text-field
              v-model="replyMessage.content"  
              name="content"
              label="Votre commentaire"
              id="com"         
            >
              </v-text-field>
            <v-btn type="submit">Envoyer</v-btn>
            <v-btn @click="clearCom()">Annuler</v-btn>
          </form>
        </div>

        <div v-if='comments.length>0'>
          <div v-for='message in comments' :key='message.idMESSAGES'>
            <!-- {{message}} -->
            <p>{{message.content}}</p>
            <p>Commentaire de {{message.username}} écrit le {{message.created_at}}</p>             
            <v-btn @click="deleteComment()" v-if="$auth.user[0].idUSERS === message.idUSERS || $auth.user && $auth.user[0].isAdmin">Supprimer</v-btn>
          </div>
        </div>

      </div>

      <Loader v-else/>

</div>
  
</template>

<script>
import Loader from '@/components/Loader'
import { mdiArrowUpBoldOutline } from '@mdi/js'; 
import { mdiArrowDownBoldOutline } from '@mdi/js'; 
export default {
  middleware: 'auth',
  components:{
    Loader
  },
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
        // created_at: new Date,
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
      replyMessage:{
        content: null
      } ,
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
        this.$toast.show("Il y'a eu un problème lors de la lecture du message", 
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
        this.getcomments()      
    },

    deleteRecord(){
      if(confirm("Êtes vous sûr?") === true){
        this.$axios.delete('http://localhost:3000/api/messages/' + this.$route.params.id)
          .then((response) => {
              this.$router.push({ name:'messages', params:{ deleted:'yes' } })           
          })
          .catch( (error) => {
          this.$toast.show("Il y'a eu un problème lors de la suppression du message", 
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
            console.log(error);
          });
      }
    },

    async sendComment(){
      const formData = new FormData()

      formData.append('title', this.message.title)
      formData.append('idUSERS', this.$auth.user[0].idUSERS)
      formData.append('content', this.replyMessage.content)
      formData.append('message_parent', this.message.idMESSAGES)
      formData.append('username', this.$auth.user[0].username)

      await this.$axios
        .$post('http://localhost:3000/api/messages/', formData, {
        })
        .then((response) => {
            this.getcomments() 
            this.replyMessage.content = null
            this.$toast.show("Le commentaire à bien été posté", 
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
        })
        .catch((error) => {
          this.$toast.show("Il y'a eu un problème lors de l'envoi du commentaire", 
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
    async getcomments(){
      await this.$axios.get('http://localhost:3000/api/messages/comments/' + this.$route.params.id ) 
      .then((response) => {
          console.log(response)
          this.comments = response.data.results
          })
        .catch((error) => {
          this.$toast.show("Il y'a eu un problème lors de la lecture des commentaires", 
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

    // deleteComment(){
    //   if(confirm("Êtes vous sûr?") === true){
    //     this.$axios.delete('http://localhost:3000/api/messages/' + this.idMESSAGES)
    //       .then((response) => {
    //         this.$router.push('/messages/'+ this.$route.params.id ) 
    //         this.$toast.show("Le commentaire à bien été supprimé", 
    //         { 
    //           position: "bottom-center", 
    //           duration : 2000,
    //           action : {
    //           text : 'Fermer',
    //           onClick : (e, toastObject) => {
    //               toastObject.goAway(0);
    //           }
    //           },
    //         });          
    //       })
    //       .catch( (error) => {
    //       this.$toast.show("Il y'a eu un problème lors de la suppression du commentaire", 
    //       { 
    //         position: "bottom-center", 
    //         duration : 2000,
    //         action : {
    //         text : 'Fermer',
    //         onClick : (e, toastObject) => {
    //             toastObject.goAway(0);
    //         }
    //         },
    //       });  
    //         console.log(error);
    //       });
    //   }
    // },

    async toggleLike(){
      this.isUserLiked = !this.isUserLiked
      if (this.isUserLiked){
        await this.$axios.post('http://localhost:3000/api/messages/like/' + this.$route.params.id )
      .then((response) => {
        console.log(response)
        this.message.likes++
        })
      .catch((error) => {
        this.$toast.show("Il y'a eu un problème à l'ajout du like", 
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
      }
      else {
        await this.$axios.delete('http://localhost:3000/api/messages/like/' + this.$route.params.id )
      .then((response) => {
        console.log(response)
        this.message.likes--
        })
      .catch((error) => {
        this.$toast.show("Il y'a eu un problème à la suppression du like", 
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
      }
    },
    clearCom(){
      console.log()
      this.replyMessage.content=null
    }
  }
}
</script>
<style scoped>

</style>