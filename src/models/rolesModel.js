const {Model} = require('../connection');
class Role extends Model{
    static get tableName(){
        return 'roles';
    };
    static get jsonSchema(){
        return{
            type:'object',
            required:[
                'name',
                'emp_id'
            ],
            properties:{
                id:{
                    type:'integer'
                },
                name:{
                    type:'string'
                },
                emp_id:{
                    type:'integer'
                },
                                created_at:{
                    type:'string',
                    format:'date'
                },
                updated_at:{
                    type:'string',
                    format:'date'
                }

            }
        };
    }
};
module.exports = Role;