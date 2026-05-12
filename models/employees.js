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

};
module.exports = Emp;