var express = require('express');
var app = express();
app.set('view engine', 'pug')
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/testdata2');

var diarySchema = mongoose.Schema({
    doc_number: Number,
    title: String,
    content: String
});
var Diary = mongoose.model("MyDiary", diarySchema);



app.get('/diary', function (req, res) {
    res.render('diary');
});


app.post('/diary', function (req, res) {
    var diaryInfo = req.body; //Get the parsed information
    
    if (diaryInfo.butt == 'create'){
        
        if (!diaryInfo.doc_number || !diaryInfo.title || !diaryInfo.content) {
            res.render('diary', {
                messtitle: "Sorry, you provided worng info", type: "error"
            });
        } 
        else {
            
            var newDiary = new Diary({
                doc_number: diaryInfo.doc_number,
                title: diaryInfo.title,
                content: diaryInfo.content
            });
            
            newDiary.save(function (err, Diary) {
                if (err)
                    res.render('diary', { messtitle: "Database error", type: "error" });
                else 
                    
                    res.render('diary', {
                        
                        messtitle: "New Diary added", type: "good_save", diary: diaryInfo
                    });
            });
        }
    }
    else if (req.body.butt == 'show'){
        Diary.find({doc_number:req.body.doc_number},(err,response)=>{
            console.log(err);
            console.log(response);
            if( response.length==0){
                res.render('diary', {
                    messtitle: "Diary page not found", type: "error"
                });
            }
            else{
                res.render('diary',{data:response[0]})
            }
        })

    }
    else if (req.body.butt == 'update'){
        if (!diaryInfo.doc_number || !diaryInfo.title || !diaryInfo.content ) {
            res.render('diary', {
                messtitle: "Sorry, you provided wrong info", type: "error"
            });
        }
        else{
            Diary.updateOne({doc_number:req.body.doc_number},{$set:{title: req.body.title,content: req.body.content}},(err,response)=>{
                res.render("diary",{
                    messtitle: "Diary page has been updated", type:"good"
                })
            })
        }
    }
    else if(req.body.butt === "delete"){
        Diary.findOneAndDelete({doc_number:req.body.doc_number},(err,response)=>{
            if (err || response===null)
                res.render('diary', { messtitle: "No such diary page exists! ", type: "error" });
            else
                res.render("diary",{
                    messtitle: "Diary page has been deleted", type:"good"
            })
        })
    }
    else if(req.body.butt === "clear"){
        res.render('diary')
    }
});


app.listen(3000);