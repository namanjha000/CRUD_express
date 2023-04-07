var express = require('express');
var app = express();
app.set('view engine', 'pug')
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/testdata2');

var personSchema = mongoose.Schema({
    name: String,
    age: Number,
    nationality: String
});
var Person = mongoose.model("MyPerson", personSchema);