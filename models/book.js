'use strict'
const { Model, DataTypes } = require('sequelize')

module.exports = sequelize => {
  class Book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Book.init(
    {
      _id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      title: DataTypes.STRING,
      commentcount: {
        type: DataTypes.TINYINT,
        defaultValue: 0,
      },
      comments: {
        type: DataTypes.TEXT,
        defaultValue: '[]',
        get() {
          try {
            return JSON.parse(this.getDataValue('comments')) || []
          } catch (error) {
            return []
          }
        },
        set(value) {
          this.setDataValue('comments', JSON.stringify(value))
        },
      },
    },
    {
      sequelize,
      modelName: 'Book',
      timestamps: true,
    }
  )
  return Book
}
