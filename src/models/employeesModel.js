const { Model } = require("../connection");
const { BaseModel } = require("./baseModel");
const { Leave } = require("./leavesModel");
const { Role } = require("./rolesModel");
class EmployeesModel extends Model {
  id;
  name;
  email;
  leave_balance;
  static get tableName() {
    return "employees";
  }
  $formatJson(json) {
    json = super.$formatJson(json);
    delete json.password;
    return json;
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["name", "email"],
      properties: {
        id: {
          type: "integer",
        },
        name: {
          type: "string",
        },
        email: {
          type: "string",
        },
        created_at: {
          type: "string",
          format: "date",
        },
        updated_at: {
          type: "string",
          format: "date",
        },
        leave_balance: {
          type: "integer",
        },
      },
    };
  }
  static get relationMappings() {
    return {
      manager: {
        relation: Model.BelongsToOneRelation,
        modelClass: require("./EmployeesModel"),
        join: {
          from: "employees.manager_id",
          to: "employees.id",
        },
      },
      subordinates: {
        relation: Model.HasManyRelation,
        modelClass: require("./EmployeesModel"),
        join: {
          from: "employees.id",
          to: "employees.manager_id",
        },
      },
      leaves: {
        relation: Model.HasManyRelation,
        modelClass: require("./LeavesModel"),
        join: {
          from: "employees.id",
          to: "leaves.emp_id",
        },
      },
      roles: {
        relation: Model.HasManyRelation,
        modelClass: require("./RolesModel"),
        join: {
          from: "employees.id",
          to: "roles.emp_id",
        },
      },
    };
  }
}

module.exports = EmployeesModel;
