import userModel from "../models/userModel.js";

// Indirection kept small so middleware can be tested without a live database.
let lookup = (id) => userModel.findById(id).select("tokenVersion");

export const getUserById = (id) => lookup(id);
export const setUserLookup = (fn) => {
  lookup = fn;
};
