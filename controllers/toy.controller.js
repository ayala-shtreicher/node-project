const { Toy } = require("../models/Toy.model");
const AppError = require("../utils/AppError");
const asyncWrap = require("../utils/asyncwrapper");
const Joi = require("joi")

validateToy = (_reqBody) => {
    let schemaJoi = Joi.object({
        name: Joi.string().min(2).max(99).required(),
        info: Joi.string().min(3).max(100).required(),
        category: Joi.string().min(3).max(15),
        img_url: Joi.string().allow(null, "").max(500),
        price: Joi.number().min(1).max(9999).required(),
        date_created: Joi.date(),
    })
    return schemaJoi.validate(_reqBody);
}

exports.addNewToy = asyncWrap(async (req, res, next) => {
    const validate = validateToy(req.body);
    if (validate.error)
        throw new AppError(403, validate.error);
    const toy = { ...req.body };
    toy.ownerId = res.locals.userId;
    const newToy = await Toy.create(toy);
    res.status(201).json({
        status: "saccess",
        newToy,
    });
});

exports.getToys = asyncWrap(async (req, res, next) => {
    const query = req.query;
    const perPage = 10;
    const skip = (query.page - 1) * perPage;
    const tasks = await Toy.find({ownerId:res.locals.userId})
        .populate('ownerId')
        .skip(skip)
        .limit(perPage)
        .select("-__v");
    res.send(tasks);
});
exports.getToysSearch = asyncWrap(async (req, res, next) => {
    const query = req.query;
    const perPage = 10;
    const skip = (query.page - 1) * perPage;
    const s = req.query.s;
    let tasks;
    if (s)
        tasks = await Toy.find(({ $or: [{ name: s }, { info: s }] }))
            .populate('ownerId')
            .skip(skip)
            .limit(perPage);
    else
        tasks = await Toy.find()
            .populate('ownerId')
            .skip(skip)
            .limit(perPage);
    res.send(tasks);
});

exports.getToyByCategory = asyncWrap(async (req, res, next) => {
    const category = req.params.category;
    const toy = await Toy.find({ category });
    console.log(toy);
    if (toy.length == 0) return next(new AppError(400, "toy by category not exist"));
    res.status(200).json({
        status: "success",
        toy,
    });
});
exports.getToyById = asyncWrap(async (req, res, next) => {
    const id = req.params.id;
    const toy = await Toy.findById(id);
    if (!toy) return next(new AppError(400, "toy by id not exist"));
    res.status(200).json({
        status: "success",
        toy,
    });
});


exports.updateToy = asyncWrap(async (req, res, next) => {
    const { id } = req.params;
    const body = req.body;
    const userId = res.locals.userId;
    const validate = validateToy(body);
    if (validate.error)
        throw AppError(401, validate.error);
    let toy = await Toy.findOne({ _id: id });
    if (!toy)
        return res.status(404).send({ msg: "Toy not found" });
    if (String(toy.ownerId) !== userId)
        return res.status(404).send({ msg: "You cannot update this toy" });

    toy = await Toy.findByIdAndUpdate(id, body, { new: true });
    res.status(200).send(toy);
});
exports.deleteToy = asyncWrap(async (req, res, next) => {
    const { id } = req.params;
    const body = req.body;
    const userId = res.locals.userId;
    let toy = await Toy.findOne({ _id: id });
    if (!toy)
        return res.status(404).send({ msg: "Toy not found" });
    if (String(toy.ownerId) !== userId)
        return res.status(404).send({ msg: "You cannot delete this toy" });
    toy = await Toy.findByIdAndDelete(id, body, { new: true });
    res.status(200).send(toy);
});

