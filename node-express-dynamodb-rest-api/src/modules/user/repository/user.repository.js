const db = require(`../../../helpers/database`);
const { v4: uuidv4 } = require("uuid");

class UserRepository {
  constructor() {
    this.tableName = "Users";
  }

  async findAllUSers() {
    const tableName = this.tableName;
    let params = {
      TableName: tableName,
    };

    let scanResults = [];
    let items;

    do {
      items = await db.scan(params).promise();
      items.Items.forEach((item) => scanResults.push(item));
      params.ExclusiveStartKey = items.LastEvaluatedKey;
    } while (typeof items.LastEvaluatedKey != "undefined");

    return scanResults;
  }

  async findByID(UserID) {
    const params = {
      TableName: this.tableName,
      Key: {
        UserID,
      },
    };

    let x = await db.get(params).promise();
    console.log(x);
    return x;
  }

  async create(data) {
    const params = {
      TableName: this.tableName,
      Item: {
        UserID: uuidv4(),
        Username: data.Username,
      },
    };

    await db.put(params).promise();

    return params.Item;
  }

  async update(UserID, data) {
    const params = {
      TableName: this.tableName,
      Key: {
        UserID: UserID,
      },
      UpdateExpression: `set #Username = :Username`,
      ExpressionAttributeNames: {
        "#Username": `Username`,
      },
      ExpressionAttributeValues: {
        ":Username": data.Username,
      },
      ReturnValues: `UPDATED_NEW`,
    };

    const update = await db.update(params).promise();

    return update.Attributes;
  }

  async deleteByID(UserID) {
    const params = {
      TableName: this.tableName,
      Key: {
        UserID,
      },
    };

    return await db.delete(params).promise();
  }
}

module.exports = new UserRepository();
