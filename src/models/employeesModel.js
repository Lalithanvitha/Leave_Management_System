const {Model} = require('../connection');
class Emp extends Model{
    static get tableName(){
        return 'employees';
    }
    static get jsonSchema(){
        return{
            type:'object',
            required:[
                'name',
                'email'
            ],
            properties:{
                id:{
                    type:'integer'
                },
                name:{
                    type:'string'
                },
                email:{
                    type:'string'
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
    static get relationMappings(){
        const Leave = require('./leavesModel');
        return{
            leaves:{
                relation:Model.HasManyRelation,
                modelClass:Leave,
                join:{
                    from:'employees.id',
                    to:'leaves.emp_id'
                }

            }
        };
    }
    static get relationMappings(){
        const Role = require('./rolesModel');
        return{
            roles:{
                relation:Model.HasManyRelation,
                modelClass:Role,
                join:{
                    from:'employees.id',
                    to:'roles.emp_id'
                }
            }
        };

    }


};
module.exports = Emp;