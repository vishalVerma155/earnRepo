
const Actions  = require('../../../models/actions/actions.model.js');

const getActions = async (req, res)=>{
    const actions = await Actions.find();

    return res.status(200).json({Actions : actions});
}

module.exports = {getActions};