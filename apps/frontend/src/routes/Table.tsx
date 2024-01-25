import { ReactNode } from "react";
import "./Table.css";

type TableProps = {
  data: Record<string, string | number>[];
};

/**
 * Table headers are inferred from the keys of the first row of data.
 *
 * @param data - Each object in the array represents a row of data. The keys of
 * each object are used as the table headers.
 */
const Table = ({ data }: TableProps) => {
  if (data.length === 0) return null;
  return (
    <table className="table">
      <thead>
        <tr>
          {Object.keys(data[0]).map((h, i) => (
            <th key={i}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={i}>
            {Object.keys(row).map((h, j) => (
              <td key={j}>{row[h] as ReactNode}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
