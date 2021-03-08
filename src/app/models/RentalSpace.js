import Sequelize, { Model } from 'sequelize';

class RentalSpace extends Model {
    static init(sequelize) {
        super.init(
            {
                name: Sequelize.STRING,
                percentage: Sequelize.STRING,
            },
            {
                sequelize,
            }
        );

        return this;
    }

    static associate(models) {
        this.belongsTo(models.User, {
            foreignKey: 'establishment_id',
            as: 'establishment',
        });
    }
}

export default RentalSpace;
