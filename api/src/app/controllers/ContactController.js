const ContactsRepository = require("../repositories/ContactsRepository");
const isValidUUID = require("../utils/isValidUUID");

class ContactController {
  async index(req, res) {
    const { orderBy } = req.query;
    const contacts = await ContactsRepository.findAll(orderBy);
    res.json(contacts);
  }

  async show(req, res) {
    const { id } = req.params;
    if (!isValidUUID(id))
      return res.status(400).json({ error: "Invalid contact ID" });
    const contact = await ContactsRepository.findById(id);
    if (!contact) return res.status(404).json({ error: "Contact not found" });
    res.json(contact);
  }

  async store(req, res) {
    const { name, email, phone, category_id } = req.body;
    if (category_id && !isValidUUID(category_id))
      return res.status(400).json({ error: "Invalid category" });

    if (!name) return res.status(400).json({ error: "Name is required" });

    if (email) {
      const contactExists = await ContactsRepository.findByEmail(email);
      if (contactExists) {
        return res.status(400).json({ error: "This e-mail is already in use" });
      }
    }

    const contact = await ContactsRepository.create({
      name,
      email: email || null,
      phone,
      category_id: category_id || null,
    });
    res.status(201).json(contact);
  }

  async update(req, res) {
    const { id } = req.params;
    if (!isValidUUID(id))
      return res.status(400).json({ error: "Invalid contact ID" });

    const { name, email, phone, category_id } = req.body;
    if (category_id && !isValidUUID(category_id))
      return res.status(400).json({ error: "Invalid category" });

    const contactExists = await ContactsRepository.findById(id);
    if (!contactExists)
      return res.status(404).json({ error: "Contact not found" });

    if (!name) return res.status(400).json({ error: "Name is required" });

    if (email) {
      const contactByEmail = await ContactsRepository.findByEmail(email);
      if (contactByEmail && contactByEmail.id !== id) {
        return res.status(400).json({ error: "This e-mail is already in use" });
      }
    }

    const contact = await ContactsRepository.update(id, {
      name,
      email: email || null,
      phone,
      category_id: category_id || null,
    });
    res.json(contact);
  }

  async delete(req, res) {
    const { id } = req.params;
    if (!isValidUUID(id))
      return res.status(400).json({ error: "Invalid contact ID" });
    
    await ContactsRepository.delete(id);
    res.sendStatus(204);
  }
}

module.exports = new ContactController();
