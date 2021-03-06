import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore } from 'date-fns';

import Renting from '../models/Renting';
import User from '../models/User';
import File from '../models/File';
import RentalSpace from '../models/RentalSpace';

class RentingController {
    // List rents
    async index(req, res) {
        const { page = 1, limit = 5 } = req.query;
        const renting = await Renting.findAll({
            where: {
                user_id: req.userId,
            },
            order: ['date'],
            attributes: [
                'id',
                'user_id',
                'establishment_id',
                'rental_space_id',
                'date',
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

        return res.json(renting);
    }

    // Create a rent
    async store(req, res) {
        const schema = Yup.object().shape({
            establishment_id: Yup.number().required(),
            rental_space_id: Yup.number().required(),
            date: Yup.date().required(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validations fails' });
        }

        const { establishment_id, rental_space_id, date } = req.body;

        /**
         *  Check if establishment_id is a establishment
         */

        const checkisEstablishment = await User.findOne({
            where: { id: establishment_id, establishment: true },
        });

        if (!checkisEstablishment) {
            return res.status(401).json({
                error: 'You cant renting a space with establishments !',
            });
        }

        /**
         * Check if rental_space_id is a rental space
         */

        const checkifRentalSpace = await RentalSpace.findOne({
            where: { id: rental_space_id },
        });

        if (!checkifRentalSpace) {
            return res.status(401).json({
                error: 'You can only create a rent with rental spaces ! ',
            });
        }

        /**
         * Check if you are creating with a normal user
         */

        const checkisUser = await User.findOne({
            where: { id: req.userId, establishment: false },
        });

        if (!checkisUser) {
            return res
                .status(401)
                .json({ error: 'You can only create a rent with users !' });
        }

        /**
         * Check for past dates
         */
        const hourStart = startOfHour(parseISO(date));

        if (isBefore(hourStart, new Date())) {
            return res
                .status(400)
                .json({ error: 'Past date are not permitted.' });
        }

        // Store at the database
        const renting = await Renting.create({
            user_id: req.userId,
            establishment_id,
            rental_space_id,
            date,
        });

        return res.json(renting);
    }
}

export default new RentingController();
