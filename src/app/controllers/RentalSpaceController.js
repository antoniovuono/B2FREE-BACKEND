import * as Yup from 'yup';

import RentalSpace from '../models/RentalSpace';
import User from '../models/User';
import File from '../models/File';

class RentalSpaceController {
    // List Rental spaces
    async index(req, res) {
        const { page = 1, limit = 5 } = req.query;
        const rentalSpaces = await RentalSpace.findAll({
            where: {
                establishment_id: req.userId,
            },
            attributes: [
                'id',
                'name',
                'status',
                'percentage',
                'establishment_id',
            ],
            limit,
            offset: (page - 1) * limit,
            include: [
                {
                    model: User,
                    as: 'establishment',
                    attributes: ['id', 'name'],
                    include: [
                        {
                            model: File,
                            as: 'avatar',
                            attributes: ['id', 'path', 'url'],
                        },
                    ],
                },
            ],
        });

        return res.json(rentalSpaces);
    }

    // Create Rental Space
    async store(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            percentage: Yup.string().required(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validations fails' });
        }

        /**
         * Check if establishment_id is establishment
         */

        const checkIsEstablishment = await User.findOne({
            where: { id: req.userId, establishment: true },
        });

        if (!checkIsEstablishment) {
            return res.status(401).json({
                error:
                    'You can only create a rental space with establishments !',
            });
        }

        /**
         * Check if name exists
         */

        const nameExists = await RentalSpace.findOne({
            where: {
                name: req.body.name,
                establishment_id: req.userId,
            },
        });

        if (nameExists) {
            return res
                .status(400)
                .json({ error: 'You already created this place' });
        }

        // store at the database

        const { id, name, status, percentage } = req.body;

        const createRentalSpace = await RentalSpace.create({
            id,
            name,
            status,
            percentage,
            establishment_id: req.userId,
        });

        return res.json({
            createRentalSpace,
        });
    }

    // Delete Rental Spaces

    async delete(req, res) {
        const rentalSpace = await RentalSpace.findByPk(req.params.id, {
            include: [
                {
                    model: User,
                    as: 'establishment',
                    attributes: ['id', 'name'],
                },
            ],
        });

        // Check if establishment to delete a Rental Space

        if (rentalSpace.establishment_id !== req.userId) {
            return res.status(401).json({
                error: "You don't have permission to delete this rental space!",
            });
        }

        await rentalSpace.destroy();

        return res.json(rentalSpace);
    }
}

export default new RentalSpaceController();
