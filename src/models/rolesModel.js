const {Model} = require('../connection');
const {BaseModel} = require('./baseModel');
class RolesModel extends Model{
    id;
    name;
    emp_id;
    static get tableName(){
        return 'roles';
    };
    /*static get columns(){
        id:'id';
        name:'name';
        emp_id:'emp_id';
    }*/
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
module.exports = RolesModel;