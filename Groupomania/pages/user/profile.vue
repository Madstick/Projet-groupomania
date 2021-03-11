
<template>
  <div class="container">
    <div>
      <h1 class="title">Votre compte</h1>
      <img src="~/assets/icon.svg" />
      {{userInfo.username}}
      {{userInfo}}
      {{msgInfo}}
      {{likesInfo}}
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userInfo:{},
      msgInfo:[],
      likesInfo:[],
    }
  },
  mounted(){
    this.asyncData()
  }
  ,
  methods:{
    async asyncData(){
    await this.$axios.get('http://localhost:3000/api/auth/current') 
    .then((response) => {
        console.log(response)
        this.userInfo = response.data.user[0]      
        })
        .catch((error) => {
          console.log(error)
        });
    await this.$axios.get('http://localhost:3000/api/auth/' + this.$auth.user[0].idUSERS + '/messages') 
    .then((response) => {
        console.log(response)
        this.msgInfo = response.data.msg     
        })
        .catch((error) => {
          console.log(error)
        })
    await this.$axios.get('http://localhost:3000/api/auth/' + this.$auth.user[0].idUSERS + '/likes') 
    .then((response) => {
        console.log(response)
        this.likesInfo = response.data.likes      
        })
        .catch((error) => {
          console.log(error)
        })    
    },
  }
}

</script>

<style scoped>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
</style>