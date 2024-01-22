const express = require('express');
const app = express();
const blogroute = require('./routes/blog');

app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));


app.use(blogroute);
app.get('/',(req,res)=>{
  res.redirect("post-list.html")
})
app.listen(5000, () => {
  console.log('Server is running at port 5000');
});
