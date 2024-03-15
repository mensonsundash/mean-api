import fs from 'fs';
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const basename = path.basename(__filename);

const modelSchema = {};
//read all xxxxxx.model.js files
const files = fs.readdirSync(__dirname).filter(file => {
    return file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js';
});

//iterate all files and load each schema model
for (const file of files) {
    const modelName = file.split('.')[0];
    const fullPath = path.join(__dirname, file);
    const moduleURL = pathToFileURL(fullPath);
    const importedModule  = await import(moduleURL.href);
    
    if (importedModule.default) {
        modelSchema[modelName] = importedModule.default;//mongoose.model(modelName, schema);
    } else {
        console.error(`Default export not found in ${file}`);
    }
}

export default modelSchema;
