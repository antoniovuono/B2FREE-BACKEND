import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore } from 'date-fns';

import Renting from '../models/Renting';
import User from '../models/User';
import RentalSpace from '../models/RentalSpace';

class RentingController {
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
                error: 'You can only rent with establishments users !',
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
