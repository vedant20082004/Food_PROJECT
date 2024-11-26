var express = require('express')
const pool = require("./pool")
const upload = require("./multer")
const fs = require('fs')
var router = express.Router();
var {LocalStorage} = require('node-localstorage');  
var localStorage = new LocalStorage('./scratch');





router.get('/firstpage',function(req,res,next){

    try{
        var admin = JSON.parse(localStorage.getItem('Admin'))
        
        if(admin==null)
        res.render('login',{message:''})
      
        else
        res.render('food_interface',{message:''})      
    
    }
      
    catch(e){
      
        res.render('login',{message:''})
      
      }



})


router.post('/submitfood',upload.single('foodpicture'),function(req,res){

    try{
        console.log("body : ",req.body)
        console.log("file : ",req.file)
        pool.query("insert into fooditem(categoryid, subcategoryid, foodname, ingredients, description, price, offerprice, foodtype, status, foodimage) values(?,?,?,?,?,?,?,?,?,?)",[req.body.categoryid,req.body.subcategoryid,req.body.foodname,req.body.ingredients,req.body.description,req.body.price,req.body.offerprice,req.body.foodtype,req.body.status,req.file.filename],function(error,result)
    {

        console.log("error : ",error)

            if(error)
            {
                res.render('food_interface',{message:'THERE IS AN ISSUE IN DATA BASE'})
            }

            if(result)
            {
                res.render('food_interface',{message:'THE DATA IS SUBMITTED SUCCESSFULY.....'})
            }
            
    })
        
    }   

    
    catch(e)

        {
           res.render('food_interface',{message:'THERE IS AN ERROR DUE TO SERVER'})
        }
             
    
})
// ------------------------------------------------------------------------


    router.get('/fillcategory',function(req,res){

        pool.query("Select * from category" , function(error,result)
    {

        if(error)
            {
                res.json({data:[],status:false,message:"FAILURE"})
            }

        else
            {
                res.json({data:result,status:true,message:"SUCCESS"})
            }

    })

    })

    // -----------------------------------------------------------------

    router.get('/fillsubcategory',function(req,res){

        pool.query("Select * from subcategory where categoryid=?",[req.query.categoryid] , function(error,result)
    {

        if(error)
            {
                res.json({data:[],status:false,message:"FAILURE"})
            }

        else
            {
                res.json({data:result,status:true,message:"SUCCESS"})
            }

    })

    })
    // ---------------------------------------------------------------------------------------------------------

    router.get('/menu',function(req,res,next){

        try{
            var admin = JSON.parse(localStorage.getItem('Admin'))
            
            if(admin==null)
            res.render('login',{message:''})
          
            else{
                
                pool.query('Select F.*,(Select C.categoryname from category C where C.categoryid = F.categoryid) as categoryname,(Select S.subcategoryname from subcategory S where S.subcategoryid = F.subcategoryid) as subcategoryname from fooditem F',function(error,result){
            
                    res.render('menuinterface',{status:true,data:result})
        
                })
            }
            
        }
          
        catch(e){
          
            res.render('login',{message:''})
          
          }

        

    })
    // ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    router.get('/details',function(req,res,next){

        try{
            pool.query('Select F.*,(Select C.categoryname from category C where C.categoryid = F.categoryid) as categoryname,(Select S.subcategoryname from subcategory S where S.subcategoryid = F.subcategoryid) as subcategoryname from fooditem F where foodid =?',[req.query.foodid],function(error,result){

                if(error){
                    res.render('update',{data:[],status:true})
                }
                else
                {
                    res.render('update',{data:result[0],status:true})
                }
            })
        }

        catch(e){

        }
    })

    router.post('/updated',function(req,res,next){

        if(req.body.btn=="edit"){

        try{
            pool.query('update fooditem set categoryid=?, subcategoryid=?, foodname=?, ingredients=?, description=?, price=?, offerprice=?, foodtype=?, status=? where foodid=?',[req.body.categoryid,req.body.subcategoryid,req.body.foodname,req.body.ingredients,req.body.description,req.body.price,req.body.offerprice,req.body.foodtype,req.body.status,req.body.foodid],function(error,result){

                console.log('error : ',error)
                console.log('result : ',result)
                console.log('fid : ',req.body.foodid)


                if(error){
                    res.redirect('/food/menu')
                }
                else{
                    res.redirect('/food/menu')
                }
            })
        }
        catch(e){

        }
    }

    else{

        pool.query('delete from fooditem where foodid=?',[req.body.foodid],function(error,result){

            if(error){
                res.redirect('/food/menu')
            }
            else{

                fs.unlink(`D:/FOOD_PROJ/public/images${req.body.foodimage}`,function(err){
                    if(err)
                        {
                            res.redirect('/food/menu')
                        }

                    else
                        res.redirect('/food/menu')

                    console.log("DELETED")


                })
            }

        })
    }
    })

    router.get('/picUpdate',function(req,res,next){
        

        res.render('picupdate',{data:req.query})   
        console.log('data: ',req.query)

    })

        

    router.post('/picupdone',upload.single('foodimage'),function(req,res,next){

        try{
            pool.query('update fooditem set foodimage=? where foodid=?',[req.file.filename,req.body.foodid],function(error,result){

                if(error){
                    res.redirect('/food/menu')
                }
                else
                // res.redirect('/food/menu')
                fs.unlink(`D:/FOOD_PROJ/public/images${req.body.oldimage}`,function(err){
                    if(err)
                        {
                            res.redirect('/food/menu')
                        }

                    else
                        res.redirect('/food/menu')

                    console.log("DELETED")


                })
            })
        }

        catch(e){
            res.redirect('/food/menu')
        }



    })








module.exports = router;