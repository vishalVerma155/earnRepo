const Clicks = require('../../../models/clicks/clicks.model.js')

// get clicks 

const getClicks = async (req, res)=>{
    const clicks = await Clicks.find();
    return res.status(200).json({Clicks : clicks});
}

module.exports ={getClicks};