const {Model} = require('../connection');
class Leave extends Model{
    static get tableName(){
        return 'leaves';
    };
    static get jsonSchema(){
        return{
            type:'object',
            required:[
                'emp_id',
                'leavereason',
                'from_date',
                'to_date'
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
                    enum:['PENDING','APPROVED','REJECTED']
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
                }
            }
        };
    }
// Database index exists on:
// (employee_id, status)
//(status)

};
module.exports = Leave;