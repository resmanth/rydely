const express = require('express')
const app = express()
app.get('/',(req,res)=>{ 
    res.end("Working properly")
})
const Port = 3000;

app.listen(Port,()=>{
    console.log(`Server running on ${Port}`)
})