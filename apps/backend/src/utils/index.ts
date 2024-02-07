/**
 * Escapes a value for use in a CSV file
 */
function escapeCSV(value: string | number | boolean) {
  if (typeof value === "string") {
    value = value.replace(/"/g, '""'); // Escape double quotes
    if (value.includes(",") || value.includes("\n")) {
      value = `"${value}"`; // Quote fields with commas or newlines
    }
  }
  return value;
}

function objectsToCSV(data: object[]): string {
  if (data.length === 0) return "";

  const headers = Object.keys(data[0]);
  const csvHeaders = headers.map((field) => escapeCSV(field)).join(",");
  const csvRows = data.map((row) => {
    // @ts-expect-error - TS doesn't know that `row` has the same keys as `headers`
    return headers.map((fieldName) => escapeCSV(row[fieldName])).join(",");
  });
  return [csvHeaders, ...csvRows].join("\n");
}

export { objectsToCSV };
