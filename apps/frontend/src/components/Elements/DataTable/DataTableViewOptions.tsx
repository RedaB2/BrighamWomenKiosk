import { Table } from "@tanstack/react-table";
import { Checkbox, Label, Dropdown } from "flowbite-react";

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>;
}

export function DataTableViewOptions<TData>({
  table,
}: DataTableViewOptionsProps<TData>) {
  return (
    <Dropdown
      id="viewDropdown"
      color="light"
      outline
      label="View"
      dismissOnClick={false}
    >
      <Dropdown.Header>Toggle columns</Dropdown.Header>
      <Dropdown.Divider />
      {table
        .getAllColumns()
        .filter(
          (column) =>
            typeof column.accessorFn !== "undefined" && column.getCanHide()
        )
        .map((column) => {
          return (
            <Dropdown.Item
              key={column.id}
              onClick={() => {
                column.toggleVisibility(!column.getIsVisible());
              }}
            >
              <span className="flex space-x-2 items-center">
                <Checkbox checked={column.getIsVisible()} />
                <Label>{column.id}</Label>
              </span>
            </Dropdown.Item>
          );
        })}
    </Dropdown>
  );
}
