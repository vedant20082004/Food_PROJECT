var express = require('express');
var pool = require('./pool');
var {LocalStorage} = require('node-localstorage')  
var localStorage = new LocalStorage('./scratch')
var router = express.Router();

router.get('/admin',function(req,res,next){
try{
  var admin = JSON.parse(localStorage.getItem('Admin'))
  
  if(admin==null)
  res.render('login',{message:''})

  else
  res.render('dashboard',{data:admin,status:true,message:''});
}

catch(e){

  res.render('login',{message:''})

}

})

router.post('/check_admin',function(req,res,next){

  pool.query('Select * from admins where (emailid=? or mobileno=?) and password=?',[req.body.emailid,req.body.mobileno,req.body.password],function(error,result){

    if(error){
      res.render('login',{data:[],status:false,message:'error'})
    }

    else{
      console.log('result :',result)

      if(result.length==1){
        
        localStorage.setItem('Admin',JSON.stringify(result[0]));
        res.render('dashboard',{data:result[0],status:true,message:''});
      
      }

      else
      res.render('login',{data:[],status:false,message:'NO EMAILID OR PHONENUMBER FOUND'})
    }

  })
})

router.get('/logout',function(req,res,next){
  localStorage.clear();
  res.redirect('/admin/admin');
})


module.exports = router;
