const { DataTypes } = require("sequelize");
const sequelize = require("../config/db"); // Import your Sequelize instance

const Session = sequelize.define(
  "Session",
  {
    sid: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    expires: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    data: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    tableName: "Session",
  }
);

sequelize
  .sync()
  .then(() => {
    console.log(
      "Session has been successfully created, if one doesn't exist"
    );
  })
  .catch((error) =>
    console.error(
      "This error occurred while syncing the Session model:",
      error
    )
  );

module.exports = Session;
