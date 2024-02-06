import { readFileSync } from "fs";

/**
 * Parses data from a CSV file. Expects a CSV file with a header row, where each
 * column header is unique, and has LF line endings.
 *
 * @param {string} filePath - The file system path to the CSV file to be read.
 * @returns {Record<string, unknown>[]} An array of objects, where each object
 *                                      represents a row in the CSV file. Each
 *                                      object has keys corresponding to the
 *                                      column headers in the CSV file.
 **/
export const readCSV = (filePath) => {
    const fileContent = readFileSync(filePath, "utf8");
    const lines = fileContent.split("\n").map(line => line.trim()).filter(line => line);
    const headers = lines[0].split(",");

    return lines.slice(1).map(line => {
        const values = line.split(",");
        return headers.reduce((obj, header, index) => {
            obj[header] = values[index];
            return obj;
        }, {});
    });
};
