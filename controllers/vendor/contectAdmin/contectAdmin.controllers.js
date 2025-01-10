const multer = require('multer');
const Queries = require('../../../models/contectAdmin/contectAdmin.model.js');


// create contect to admin register

const registerQueries = async(req, res)=>{

    const queryData = req.body; // get querie data
    const {subject, body}= req.body; // get subject field and body for validation

    if(subject.trim() === "" || body.trim() === ""){
        return res.status(404).json({Message : "Subject and body fiels are mandetory."}); // subject and body
    }

    const attachment = req.file? req.file.path : undefined; // check is there any attachment

    const query = new Queries({...queryData, attachment}); // register query
    await query.save(); // save query in database

    const registeredQuery= await Queries.findById(query._id); // check register query

    if(!registeredQuery){
        return res.status(400).json("Message : Query not saved");
    }

    return res.status(200).json({Message : "Query has been registered", Query : registeredQuery}); // return response
}

// view all Queries

const viewQueris = async (req, res) =>{
    const queries = await Queries.find(); // get all queries
    return res.status(200).json({All_Queries : queries});
}

// view single querie

const viewSingleQuery = async(req, res) =>{
    const queryId = req.params.queryId; // get query id

    if(!queryId){
        return res.status(400).json({Message : "Query id not found"});
    }
    const query = await Queries.findById(queryId); // find query

    if(!query){
        return res.status(400).json("Wrong query id")
    }

    return res.status(200).json({Query : query}); // return response
}

// update query

const editQuery = async (req, res)=>{
    const queryId = req. params.queryId; // get query id
    const { body } = req.body;
    
    const attachment = req.file ? req.file.path : undefined; // check attachment is there or not

    if(!queryId){
        return res.status(400).json({Message : "Query id not found"}); // check query id
    }

    if(!body && !attachment){
        return res.status(400).json({Message : "Atleast one field is compulsury for  edit query"}); // check body data and attachment file
    }

    const query = await Queries.findByIdAndUpdate(queryId, {body, ...(attachment && {attachment})}, {new : true}); // find and update query

    if(!query){
        return res.status(400).json({Message : "Wrong query id"});
    }

    return res.status(200).json({Message : " Query has been updated", newQuery : query}); // return response

}

// delete query

const deleteQuery = async (req, res)=>{
    const queryId = req.params.queryId; // get query id

    if(!queryId){
        return res.status(404).json({Message : "Query Id not found"});
    }

    const deletedQuery = await Queries.findByIdAndDelete(queryId); // find and delete query
    if(!deletedQuery){
        return res.status(400).json({Message : "Wrong query id"});
    }

    return res.status(200).json({Message : "Query has been deleted"}); // return response
}

module.exports = { registerQueries, viewQueris, viewSingleQuery, editQuery, deleteQuery};
