import * as Yup from 'yup';

import RentalSpace from '../models/RentalSpace';
import User from '../models/User';
import File from '../models/File';

class RentalSpaceController {
    // List Rental spaces
    async index(req, res) {
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

        const { establishment_id } = req.body;

        const checkIsEstablishment = await User.findOne({
            where: { id: establishment_id, establishment: true },
        });

        if (!checkIsEstablishment) {
            return res.status(401).json({
                error:
                    'You can only create a rental space with establishments !',
            });
        }

        // Check if you already created this space

        const nameExists = await RentalSpace.findOne({
            where: {
                name: req.body.name,
                establishment_id: req.body.establishment_id,
            },
        });

        if (nameExists) {
            return res
                .status(400)
                .json({ error: 'You already created this place' });
        }

        const { id, name, status, percentage } = await RentalSpace.create(
            req.body
        );

        return res.json({
            id,
            name,
            status,
            percentage,
            establishment_id,
        });
    }
}

export default new RentalSpaceController();
