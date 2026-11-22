import mongoose from "mongoose";

// Reject MongoDB operator objects (e.g. { $ne: null }) supplied by clients.
// mongoose.set('sanitizeFilter', true) strips $-prefixed keys from filters.
mongoose.set("sanitizeFilter", true);

export default mongoose;
