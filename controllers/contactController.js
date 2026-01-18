const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel");
const { constants } = require("../constants");

// Get all contacts
const getContacts = asyncHandler(async (req, res) => {
  const contacts = await Contact.find({ user_id: req.user.id });
  res.status(200).json(contacts);
});

// Create new contact
const createContact = asyncHandler(async (req, res) => {
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    res.status(constants.VALIDATION_ERROR);
    throw new Error("All fields are mandatory!");
  }

  const contact = await Contact.create({
    user_id: req.user.id,
    name,
    email,
    phone,
  });

  res.status(201).json(contact);
});

// Get single contact
const getContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(constants.NOT_FOUND);
    throw new Error("Contact not found");
  }
  if (contact.user_id.toString() !== req.user.id) {
    res.status(constants.FORBIDDEN);
    throw new Error("You are not authorized to view this contact");
  }
  res.status(200).json(contact);
});

// Update contact
const updateContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(constants.NOT_FOUND);
    throw new Error("Contact not found");
  }
  if (contact.user_id.toString() !== req.user.id) {
    res.status(constants.FORBIDDEN);
    throw new Error("You are not authorized to update this contact");
  }

  const updatedContact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(200).json(updatedContact);
});

// Delete contact
const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(constants.NOT_FOUND);
    throw new Error("Contact not found");
  }
  if (contact.user_id.toString() !== req.user.id) {
    res.status(constants.FORBIDDEN);
    throw new Error("You are not authorized to delete this contact");
  }

  await Contact.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: "Contact deleted successfully" });
});

module.exports = { getContacts, createContact, getContact, updateContact, deleteContact };