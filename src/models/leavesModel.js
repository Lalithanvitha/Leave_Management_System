const {Model} = require('../connection');
const {BaseModel} = require('./baseModel');
const {leaveStatus} = require('../helpers/enumHelper');
class LeavesModel extends Model{
    id;
    emp_id;
    leavereason;
    status;
    from_date;
    to_date;
    days;
    static get tableName(){
        return 'leaves';
    };
    /*static get columns(){
        id:'id';
        emp_id:'emp_id';
        leavereason:'leavereason';
        status:'status';
        from_date:'from_date';
        to_date:'to_date;'
    }*/
    static get jsonSchema(){
        return{
            type:'object',
            required:[
                'emp_id',
                'leavereason',
                'from_date',
                'to_date',
                'days'
            ],
            properties:{
                id:{
                    type:'integer'
                },
                emp_id:{
                    type:'integer'
                },
                leavereason:{
                    type:'string'
                },
                status:{
                    type:'string',
                    enum:[leaveStatus.PENDING,leaveStatus.APPROVED,leaveStatus.REJECTED]
                },
                from_date:{
                    type:'string',
                    format:'date'
                },
                to_date:{
                    type:'string',
                    format:'date'
                },
                created_at:{
                    type:'string',
                    format:'date'
                },
                updated_at:{
                    type:'string',
                    format:'date'
                },
                days:{
                    type:'integer'
                }
            }
        };
    }
// Database index exists on:
// (employee_id, status)
//(status)

};
module.exports = LeavesModel;