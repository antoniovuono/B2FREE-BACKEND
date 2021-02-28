import Sequelize, { Model } from 'sequelize';

class RentalSpace extends Model {
    static init(sequelize) {
        super.init(
            {
                name: Sequelize.STRING,
                status: Sequelize.BOOLEAN,
                percentage: Sequelize.STRING,
            },
            {
                sequelize,
            }
        );

        return this;
    }
}

export default RentalSpace;
