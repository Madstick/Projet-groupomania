<template>
  <div>
      Ici le post {{ message.name }}
  </div>
</template>

<script>
export default {
    data(){
        return{
            messages:[{
                id:'1',
                name : 'bill'
            }]
        }
    },
    computed: {
        message(){
            return this.messages.find(v => v.id == this.$route.params.id)
        }
    }
}
</script>

<style>

</style>