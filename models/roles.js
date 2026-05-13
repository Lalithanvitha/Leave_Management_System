const {Model} = require('../connection');
class Role extends Model{
    static get tableName(){
        return 'roles';
    };
};
module.exports = Role;