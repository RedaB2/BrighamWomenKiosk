import express, {Router, Request, Response} from "express";
import client from "../bin/database-connection.ts";

const router: Router = express.Router();

// Helper function to escape CSV values
function escapeCSV(value: string | number | boolean) {
    if (typeof value === "string") {
        value = value.replace(/"/g, '""'); // Escape double quotes
        if (value.includes(",") || value.includes("\n")) {
            value = `"${value}"`; // Quote fields with commas or newlines
        }
    }
    return value;
}

// Convert array of objects to CSV
function toCSV(data: object[]): string {
    if (data.length === 0) return "";

    // Get headers
    const headers = Object.keys(data[0]);

    // Map headers
    const csvHeaders = headers.map((field) => escapeCSV(field)).join(",");

    // Map data
    const csvRows = data.map((row) => {
        return headers.map((fieldName) => escapeCSV(row[fieldName])).join(",");
    });

    // Combine headers and rows
    return [csvHeaders, ...csvRows].join("\n");
}

// Generate CSV data for a specific model
async function generateCSVData(model: "nodes" | "edges"): Promise<string> {
    const data = await client[model].findMany();
    return toCSV(data as object[]);
}

// Endpoint for downloading Nodes.csv
router.get("/nodes", async function (req: Request, res: Response) {
    try {
        const csvData = await generateCSVData("nodes");
        res.header("Content-Type", "text/csv");
        res.attachment("L1Nodes.csv");
        res.send(csvData);
    } catch (error) {
        console.error("Failed to download nodes CSV:", error);
        res.status(500).send("Internal Server Error");
    }
});

// Endpoint for downloading Edges.csv
router.get("/edges", async function (req: Request, res: Response) {
    try {
        const csvData = await generateCSVData("edges");
        res.header("Content-Type", "text/csv");
        res.attachment("L1Edges.csv");
        res.send(csvData);
    } catch (error) {
        console.error("Failed to download edges CSV:", error);
        res.status(500).send("Internal Server Error");
    }
});

export default router;