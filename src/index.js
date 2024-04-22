import express from "express"
import cors from "cors"
import axios from "axios"

const app=express()
const PORT=3002
const SeverURL="http://localhost:8000/vh"

app.use(cors())
app.use(express.json())

const cache={}

app.post("/proxyvh",async(req,res)=>{
    try{
    const cachekey=`${SeverURL}-${JSON.stringify(req.body.data)}`
    if(cache[cachekey] && Date.now()-cache[cachekey].timestamp<5*60*1000)
    res.status(200).json({success:true,cache:true,data:cache[cachekey].data})   
    else
    {
    const responce=await axios.post(SeverURL,{data:req.body.data})
    if(responce)
    {
    cache[cachekey]={
        data:responce.data.data,
        timestamp:Date.now()
    }
    res.status(200).json({success:true,cache:false,data:responce.data.data})
    }
    }
    }
    catch(e)
    {
        res.status(500).json({success:false,data:e.message})   
    }

})

app.listen(PORT,()=>{
    console.log("Proxy Server is Running on PORT 3002")
})