const {Model} = require('../connection');
const {BaseModel} = require('./baseModel');
class EmployeesModel extends Model{
    id ;
    name ;
    email ;
    leave_balance;
    static get tableName(){
        return 'employees';
    }
    /*static get columns(){
        id:'id';
        name:'name';
        email:'email';
    }*/
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
                },
                leave_balance:{
                    type:'integer'
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
module.exports = EmployeesModel;