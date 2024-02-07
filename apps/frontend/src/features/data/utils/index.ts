import axios from "axios";

/**
 * Triggers a download of a CSV file from a given endpoint.
 * @param endpoint The URL endpoint to fetch the CSV file from.
 */
export async function downloadCSV(endpoint: string): Promise<void> {
  try {
    const response = await axios.get(endpoint, { responseType: "blob" });

    // Create a link element, use it to download the blob, and remove it
    const url = window.URL.createObjectURL(response.data);
    const a = document.createElement("a");
    a.href = url;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url); // Clean up the URL object
    a.remove();
  } catch (error) {
    console.error("Error downloading CSV:", error);
  }
}
