module.exports = ( sequelize, DataTypes ) => {
  const Addcampaign = sequelize.define('Addcampaign', {
    campaign: {
      type: DataTypes.TEXT, // 매우 긴 글
      allowNull: false,
      defaultValue: null,
    },
  }, {
    charset: 'utf8mb4', // 한글+이모티콘
    collate: 'utf8mb4_general_ci',
  });
  Addcampaign.associate = (db) => {
    // db.Post.belongsTo(db.User); // 글쓰기
    db.Addcampaign.belongsToMany(db.Search, { through: 'AddcampaignSearch' });
  };
  return Addcampaign;
};