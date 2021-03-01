import * as Yup from 'yup';

import RentalSpace from '../models/RentalSpace';
import User from '../models/User';

class RentalSpaceController {
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
