const { Model } = require("../connection");
class SessionsModel extends Model {
  static get tableName() {
    return "sessions";
  }
}
module.exports = SessionsModel;
