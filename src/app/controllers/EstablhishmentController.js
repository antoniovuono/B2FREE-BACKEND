import User from '../models/User';
import File from '../models/File';

class EstablhishmentController {
    async index(req, res) {
        const establhishments = await User.findAll({
            where: { establishment: true },
            attributes: ['id', 'name', 'cpf', 'email', 'avatar_id'],
            include: [
                {
                    model: File,
                    as: 'avatar',
                    attributes: ['name', 'path', 'url'],
                },
            ],
        });

        return res.json(establhishments);
    }
}

export default new EstablhishmentController();
