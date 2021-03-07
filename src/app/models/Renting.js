import Sequelize, { Model } from 'sequelize';
import { isBefore } from 'date-fns';

class Renting extends Model {
    static init(sequelize) {
        super.init(
            {
                date: Sequelize.STRING,
                past: {
                    type: Sequelize.VIRTUAL,
                    get() {
                        return isBefore(this.date, new Date());
                    },
                },
            },
            {
                sequelize,
            }
        );

        return this;
    }

    static associate(models) {
        this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
        this.belongsTo(models.User, {
            foreignKey: 'establishment_id',
            as: 'establishment',
        });
        this.belongsTo(models.RentalSpace, {
            foreignKey: 'rental_space_id',
            as: 'rentalspaces',
        });
    }
}

export default Renting;
