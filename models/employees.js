const {Model} = require('../connection');
class Emp extends Model{
    static get tableName(){
        return 'employees';
    }
    static get relationMappings(){
        const Leave = require('./leaves');
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
        const Role = require('./roles');
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