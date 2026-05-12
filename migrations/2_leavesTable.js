
/*exports.up=function(knex){
    knex.schema.createTable('leaves',table=>{
        table.id.increments().primaryKey(),
        table.emp_id.integer().references('id').inTable('employees'),
        table.leaveReason.text()
    });

}
exports.down=function(knex){
    knex.schema.dropTable('leaves');
}*/