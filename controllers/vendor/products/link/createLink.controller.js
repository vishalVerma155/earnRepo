const multer = require('multer');
const CreateLink = require('../../../../models/Vendor/createLink-models/createLink-model.js')

const storage = multer.diskStorage({
    destination : (req, file, cb) =>{
        cb(null, "uploads/"); // create file path
    },
    filename : (req, file, cb) =>{
        cb(null, Date.now() + "-" + file.originalname); // create unique file name
    }
})

const upload = multer({storage}); // multer config


// create link
const createLink = async (req, res)=>{
    try {
     
        const { name,
            campaignTargetLink ,
            terms ,
            categories,
            linkTitle ,
            afflowForAffiliate ,
            status} = req.body;
        
            const imagePath = req.file?.path || null;
        
            if(!imagePath){
                return res.status(404).json({Message : "Image not found"});
            }
        
            const link = new CreateLink({
                name,
                campaignTargetLink ,
                terms ,
                categories,
                linkTitle ,
                afflowForAffiliate ,
                status,
                image : imagePath
            })
        
            await link.save(); // save link in database
        
            const savedLink = await CreateLink.findById(link._id);
        
            if(!savedLink){
                res.status(500).json({Message : "Link is not saved"}); // check that link is saved or not
            }
        
        res.status(200).json({Message : "Link has been created", link : savedLink}); // return response

    } catch (error) {
        res.status(400).json({Message : error.message});
    }
};

// link details

const getLinkDetails = async (req, res)=>{

    try {
        const linkId = req.params.linkId; // link id

        const link = await CreateLink.findById(linkId); // find link
    
        if(!link){
            return res.status(401).json({Message : "Link not found"}); // if link not found
        }
    
        res.status(200).json({Message : "Link found successfully", link});  // return response
    } catch (error) {
        return res.status(500).json({Message : error.message}); // error handling
    }

}

// update link details
const updateLinkDetails = async (req, res) => {
try {
    const linkId = req.params.linkId;
    if(!linkId){
        return res.status(401).json({Message : "Link id not found"});
    }
    const updatedDetails = req.body; // get details
   

    const image = req.file? req.file.path : undefined; // check  image

    const updatedLink = await CreateLink.findByIdAndUpdate( // find and update link
        linkId, 
        {...updatedDetails, ...(image && {image})}, // update details and check that image is existed or not
        {new : true}
)

if(!updatedLink){
    return res.status(404).json({Message : "Link not found"}); // check link
}

return res.status(200).json({Message : "Link has been updated", createLink : updatedLink}); // return response

} catch (error) {
    return res.status(500).json({Message : error.message}); // error handling
}
};

// delete createLink
const deleteCreateLink = async (req, res)=>{

    try {
        const linkId = req.params.linkId; // take link id

        if(!linkId){
            return res.status(400).json({Message : "Link id not found"}); // check link availbility
        }
    
         const isDocumentDeleted = await CreateLink.findByIdAndDelete(linkId); // find and delete link
    
         if(!isDocumentDeleted){
            return res.status(400).json({Message : "document not found"});
         } // check that document is deleted or not
    
         return res.status(200).json({Message : "Link has been sucessfully deleted"}); // return response
    
    } catch (error) {
        return res.status(500).json({Message : error.message});
    }

}


module.exports = {upload, createLink, getLinkDetails , deleteCreateLink , updateLinkDetails};
