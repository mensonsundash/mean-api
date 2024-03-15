import pluralize from "pluralize";
import dbConfig from "../config/db.config.js";

// Custom function to add prefix and pluralize to collection names
export const getCollectionName = (modelName) => {
    return dbConfig.tablePrefix + pluralize(modelName.toLowerCase());
};
