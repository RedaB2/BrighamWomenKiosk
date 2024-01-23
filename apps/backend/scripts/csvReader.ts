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
export const readCSV = (filePath: string): Record<string, unknown>[] => {
  // Read the file
  const fileContent = readFileSync(filePath, "utf8");

  // Split the file content by new line to get the rows
  const lines = fileContent.split("\n");

  // Extract headers
  const headers = lines[0].split(",");

  // Parse each line
  return lines.slice(1).map((line) => {
    const values = line.split(",");
    return headers.reduce(
      (obj, header, index) => {
        obj[header] = values[index];
        return obj;
      },
      {} as Record<string, unknown>,
    );
  });
};
