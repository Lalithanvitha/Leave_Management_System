const {Model} = require('../connection');
class Leave extends Model{
    static get tableName(){
        return 'leaves';
    }

};
module.exports = Leave;