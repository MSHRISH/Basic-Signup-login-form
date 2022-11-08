var express = require('express');
var bodyParser=require("body-parser");
var ejs = require("ejs");
var path=require("path");
var mysql = require('mysql');
const bcrypt = require("bcrypt");

var app = express();

var jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;

var $ = jQuery = require('jquery')(window);





app.set('view engine','ejs');
app.set('views', path.join(__dirname, './views'));
app.engine('.ejs', ejs.__express);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.use(express.static(path.join(__dirname,'public')));
app.use('/css',express.static(path.join(__dirname,'public/css')));
 

//routing the login and signup page
app.get('/',function(req,res){
    res.render('signup');
});


//signup an user
app.post('/signupuser',async function(req,res){
   
   var details={uname:req.body.signupusername,phn:req.body.signupphone,mail:req.body.signupemail,pwrd:req.body.signuppassword,cpwrd:req.body.signupcpassword};
   // console.log("TEST  SIGNUP ROUTER");
   //console.log(details);
   details.pwrd=await bcrypt.hash(details.pwrd,10); 
   //console.log(details.pwrd);

   var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "techathon"
  });
  con.connect(function(err){
    if(err) throw err;
    //console.log("CONNECTED");
    var sql_query="INSERT INTO `userdetails`(`userName`, `phnumber`, `mail`, `pwrd`) VALUES ('"+details.uname+"','"+details.phn+"','"+details.mail+"','"+details.pwrd+"')";
    con.query(sql_query,function(qer,result){
        if(qer) throw qer;
        res.render('signup_success');
    });
  });






    

});


app.post('/login',async function(req,res){
    // console.log(req.body);
   
    var details={mail:req.body.email,pwrd:req.body.password};
    //console.log(details);
    

    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "techathon"
      });

      con.connect( async function(err){
        if(err) throw err;
        var sql_query="SELECT `userName`, `phnumber`, `mail`, `pwrd` FROM `userdetails` WHERE `mail`='"+details.mail+"';";
        con.query(sql_query,async function(qerr,result){
            if(qerr) throw qerr;
            var q_detail='';
            var q_name=''
            result.forEach(element => {
                q_detail=element.pwrd;
                q_name=element.userName;
                
            });
            let isequal=await bcrypt.compare(details.pwrd,q_detail);
            console.log(await bcrypt.hash(details.pwrd,10));
            console.log(q_detail);
            if(isequal){
                res.render('login_success',{title:"DEOM CSS",user:q_name});
            }
            else{
                res.render('signup_success')
            }

            
        });
      });



});

// $.post('/test_ajax',{data:"test"},function(data,status){
//     console.log("TEST AJAX");
// });
app.post('/forget_checkup',function(req,res){
    res.send({data_status:"success"});
});




var server = app.listen(8080, function () {
    var host = server.address().address
    var port = server.address().port  
    
    console.log("Example app listening at http://%s:%s", host, port)
 })