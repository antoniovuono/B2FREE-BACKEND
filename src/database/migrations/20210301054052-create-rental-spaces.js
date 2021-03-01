module.exports = {
    up: async (queryInterface, Sequelize) =>
        queryInterface.createTable('rental_spaces', {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            status: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
                allowNull: false,
            },
            percentage: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            establishment_id: {
                type: Sequelize.INTEGER,
                references: { model: 'users', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
                allowNull: true,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
            },
        }),

    down: async (queryInterface) => queryInterface.dropTable('rental_spaces'),
};
