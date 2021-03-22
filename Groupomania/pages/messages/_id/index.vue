<template>
  <div v-cloak >
      <div v-if='isLoading !== true' class="custom-post-container">
        <v-card             
          align="center"
          justify="center"
          class="post-card">
          <div>
            <p class="msg-user">Crée par 
              <nuxt-link v-if="$auth.user[0].idUSERS === message.idUSERS" to="/user/profile" class="msg-username">{{ message.username }}</nuxt-link>
              <nuxt-link v-else :to="'/user/' + message.idUSERS" class="msg-username">{{ message.username }}</nuxt-link>
            </p>
            <v-card-title class="subheading font-weight-bold justify-center">
              <h1 class="no-wrap">
                {{ message.title }}
              </h1>
            </v-card-title>
          </div>
          <v-img 
            v-if="message.hasAttachment" 
            :src="message.attachment"
            max-width="1280"
            max-height="500"
            width="100%"
            contain
            class="post-img"
          ></v-img>

        <p class="marg-btn">{{ message.content }}</p>

        <v-btn @click='toggleLike' class="marg-btn">
          <v-icon v-if="!isUserLiked">{{likeIcon}}</v-icon>
          <v-icon v-else>{{unlikeIcon}}</v-icon>
        </v-btn>

        <p>J'aimes :{{message.likes}}</p>

        <div>
          <div>
            <v-btn :to="'/messages/' + message.idMESSAGES + '/update'" v-if="$auth.user[0].idUSERS === message.idUSERS || ($auth.user && $auth.user[0].isAdmin)" class="marg-btn2 btn-blue">Modifier</v-btn>
            <v-btn @click="deleteRecord()" v-if="$auth.user[0].idUSERS === message.idUSERS || $auth.user && $auth.user[0].isAdmin" class="marg-btn2 btn-red">Supprimer</v-btn>
          </div>
          <v-btn to="/messages" class="marg-btn">Retour à l'accueil</v-btn>
        </div>
        </v-card>

        <div class="msg-form">
          <form method="post" @submit.prevent="sendComment">
            <v-text-field
              v-model="replyMessage.content"  
              name="content"
              label="Votre commentaire"
              id="com"                     
            >
              </v-text-field>
            <v-btn type="submit" class="marg-btn2 btn-blue">Envoyer</v-btn>
            <v-btn @click="clearCom()" class="marg-btn2 btn-red">Annuler</v-btn>
          </form>
        </div>

        <div v-if='comments.length>0'>
          <div v-for='message in comments' :key='message.idMESSAGES' class="com-layout">
            <p class="marg-footer com-border">{{message.content}}</p>
            <p class="text-center details-com">Par {{message.username}} le {{message.created_at|formatDate}}</p> 
            <div class="d-flex justify-end">                      
              <v-btn @click="deleteComment(message)" v-if="$auth.user[0].idUSERS === message.idUSERS || $auth.user && $auth.user[0].isAdmin" class="marg-btn2 btn-red">Supprimer</v-btn>
            </div>          
          </div>
        </div>

      </div>

      <Loader v-else/>

</div>
  
</template>

<script>
import Loader from '@/components/Loader'
import { mdiThumbUp } from '@mdi/js' ; 
import { mdiThumbDownOutline } from '@mdi/js';
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
        created_at: new Date,
        message_parent:null,
        likes:0,
      },
      comments: [],
      isLoading:true,
      errors: null,
      url: null,
      likeIcon: mdiThumbUp,
      unlikeIcon: mdiThumbDownOutline,
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

    deleteComment(comment){
      if(confirm("Êtes vous sûr?") === true){
        this.$axios.delete('http://localhost:3000/api/messages/' + comment.idMESSAGES)
          .then((response) => {
            this.comments.splice(comment,1)
            this.$toast.show("Le commentaire à bien été supprimé", 
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
          .catch( (error) => {
          this.$toast.show("Il y'a eu un problème lors de la suppression du commentaire", 
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
h1{
  font-family: 'Anton', sans-serif;
  margin: 8px 0px;
}
.custom-post-container{
  margin: 0 auto !important; 
  padding: 0 10px;
  max-width: 1080px;
  width: 100%;
}
.post-card{
  margin: 12px 0px;
}
.no-wrap{
  word-break: initial;
}
.msg-form{
  margin: 24px 10px;
  padding: 24px 6px;
}
.msg-username{
  font-family: 'Nunito', sans-serif;
}
.msg-user{
  padding-top: 16px;
  margin-bottom: 0px;
  text-decoration: underline;
}
.post-img{
  margin-bottom: 14px;
}
.details-com{
  font-size: 14px;
  font-style: oblique;
}
.com-layout{
  padding: 6px 0px;
  margin-bottom: 12px;
}
.com-border{
  border-left:6px solid #d1515a;
  border-radius: 0.2em;
  padding-left: 12px;
}
.msg-form, .com-layout{
  border-bottom: 1px solid black;
}
</style>