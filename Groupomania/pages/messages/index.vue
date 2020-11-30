<template>
  <div>
      <h1>Messages</h1>
    <div v-for="message in messages" :key="message.id" > 
        {{ bb.name }}
    </div>
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
}
</script>

<style scoped>

</style>