const db = require("../models");
const Tutorial = db.tutorials;
const sequelize = db.sequelize;
const Op = db.Sequelize.Op;

// CREATE
exports.create = async (req, res) => {
  try {
    if (!req.body.title) {
      return res.status(400).send({
        message: "Content can not be empty!"
      });
    }

    const tutorial = {
      title: req.body.title,
      description: req.body.description,
      published: req.body.published ?? false
    };

    const data = await Tutorial.create(tutorial);
    res.send(data);

  } catch (err) {
    res.status(500).send({
      message: err.message || "Error while creating Tutorial"
    });
  }
};

// READ ALL
exports.findAll = async (req, res) => {
  try {
    const title = req.query.title;

    const condition = title
      ? { title: { [Op.like]: `%${title}%` } }
      : null;

    const data = await Tutorial.findAll({ where: condition });
    res.send(data);

  } catch (err) {
    res.status(500).send({
      message: err.message || "Error while retrieving tutorials"
    });
  }
};

// READ ONE
exports.findOne = async (req, res) => {
  try {
    const id = req.params.id;

    const data = await Tutorial.findByPk(id);
    res.send(data);

  } catch (err) {
    res.status(500).send({
      message: "Error retrieving Tutorial with id=" + req.params.id
    });
  }
};

// UPDATE
exports.update = async (req, res) => {
  try {
    const id = req.params.id;

    const [num] = await Tutorial.update(req.body, {
      where: { id: id }
    });

    if (num === 1) {
      res.send({ message: "Tutorial updated successfully." });
    } else {
      res.send({
        message: `Cannot update Tutorial with id=${id}`
      });
    }

  } catch (err) {
    res.status(500).send({
      message: "Error updating Tutorial with id=" + req.params.id
    });
  }
};

// DELETE ONE
exports.delete = async (req, res) => {
  try {
    const id = req.params.id;

    const num = await Tutorial.destroy({
      where: { id: id }
    });

    if (num === 1) {
      res.send({ message: "Tutorial deleted successfully!" });
    } else {
      res.send({
        message: `Cannot delete Tutorial with id=${id}`
      });
    }

  } catch (err) {
    res.status(500).send({
      message: "Error deleting Tutorial with id=" + req.params.id
    });
  }
};

// DELETE ALL + RESET ID (IMPORTANT)
exports.deleteAll = async (req, res) => {
  try {
    const db = require("../models");
    const sequelize = db.sequelize;

    // supprime tout
    await db.tutorials.destroy({ where: {} });

    // reset l'auto-increment
    await sequelize.query("DBCC CHECKIDENT ('tutorials', RESEED, 0)");

    res.send("BDD reset + ID remis à 1");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// READ ALL PUBLISHED
exports.findAllPublished = async (req, res) => {
  try {
    const data = await Tutorial.findAll({
      where: { published: true }
    });

    res.send(data);

  } catch (err) {
    res.status(500).send({
      message: err.message || "Error while retrieving published tutorials"
    });
  }
};