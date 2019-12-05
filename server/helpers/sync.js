/**
 * Helpers for performing sync streaming.
 * Tables initialized here and new entries are added and removed from server.
 */
const TAFFY = require("taffy");

let syncTable = TAFFY();
let userTable = TAFFY();
module.exports = { syncTable, userTable };
