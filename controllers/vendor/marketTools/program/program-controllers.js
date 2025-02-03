const Program = require('../../../../models/Vendor/marketTools/program/program.model.js');


// create program
const registerProgram = async (req, res)=>{

    try {
        const programBody = req.body; // get program body
    
        if(!programBody){
            return res.status(401).json({Message : "Data not found."});
        }

        const program = new Program(programBody); // create program document
        await program.save(); // save the document

        if(!program){
            return res.status(500).json({Message : "Something went wrong in program saving."}); //  check program is saved or not
        }

        return res.status(200).json({Message : "Program has been saved.", program}); // return response

    } catch (error) {
        return res.status(400).json({Error : error.message});
    }
}

// view program 
const getProgram = async (req, res)=>{
try {
    const programId = req.params.programId; // get program id

    if(!programId){
        return res.status(404).json({Message : "Program id not found."}); // check program id
    }

    const program = await Program.findById(programId); // get program from database

    if(!program){
        return res.status(404).json({Message : "Wrong program request. Program not found."}); // check program in database
    }

    return res.status(200).json({Message : "program found successfully", program}); // return response
} catch (error) {
    return res.status(400).json({Error : error.message}); // error handling
}
}

// update program 
const editProgram = async (req, res)=>{
try {
    const programBody = req.body; // get program body
    const programId = req.params.programId; // get program id
    
    const updatedProgram = await Program.findByIdAndUpdate(programId, {...programBody}, {new : true}); // update program
    
    if(!updatedProgram){
        return res.status(400).json({Message : "Error in program updation"}); // check updated program
    }

    return res.status(200).json({Message : "Program has been updated", Updated_Program : updatedProgram});
} catch (error) {
    return res.status(400).json({Error : error.message});
}
}

// get all programs list
const getAllPrograms = async (req, res) =>{
try {
    const programList = await Program.find(); // find all programs

    if(!programList){
        return res.status(500).json({Message : "Something went wrong in getting list from database"}); // check list 
    }

    return res.status(200).json({all_Program_List : programList}); // return response
} catch (error) {
return res.status(400).json({Error : error.message});    
}
}

// delete program
const deleteProgram = async(req, res)=>{
try {
    const programId = req.params.programId; // get program id

    if(!programId){
        return res.status(400).json({Message : "Program id not found"}); // check program id
    }

    const deletedProgram = await Program.findByIdAndDelete(programId); // find and delete program id

    if(!deletedProgram){
        return res.status(400).json({Message : "Program not found."}); // check deleted program
    }

    return res.status(200).json({Message : "Program successfully has been deleted.", deleted_Program : deletedProgram}); // return response

} catch (error) {
return res.status(400).json({Error : error.message});    
}
}

module.exports = {registerProgram, getProgram, editProgram, deleteProgram, getAllPrograms};