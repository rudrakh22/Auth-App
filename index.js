const express= require('express');
const app = express();
require('dotenv').config();
const PORT=process.env.PORT || 4000;
const cookieParser=require('cookie-parser');
const user=require('./routes/user')

app.use(cookieParser())
app.use(express.json());
app.use("/api/v1", user)

require('./Config/database').connect();


app.listen(PORT,()=>{
    console.log("App Started at port "+PORT);
})

app.get('/',(req,res)=>{
    res.send(`<H1>This is homepage </H1>`);
});
