import React from "react";
import {
  Button,
  Card,
  Table as FlowbiteTable,
  Label,
  TextInput,
  Dropdown,
} from "flowbite-react";
import { CiSearch } from "react-icons/ci";
import { IoIosAdd } from "react-icons/io";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { DataTableViewOptions } from "./DataTableViewOptions";
import { DataTablePagination } from "./DataTablePagination";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchColumn: string;
  onAddRow?: () => void;
  columnNames: string[];
}

function DataTable<TData, TValue>({
  columns,
  data,
  searchColumn,
  onAddRow,
  columnNames,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [filterColumn, setFilterColumn] = React.useState(searchColumn);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <Card className="shadow-[0_0px_25px_0px_rgba(45,105,135,.5)]">
      <div className="mx-auto max-w-full px-4 lg:px-12">
        <div className="relative shadow-md sm:rounded-lg overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
            <div className="flex w-full md:w-1/2 space-x-4">
              <form className="flex items-center">
                <Label htmlFor="simple-search" className="sr-only">
                  Search
                </Label>
                <TextInput
                  id="simple-search"
                  type="search"
                  icon={CiSearch}
                  className="w-full"
                  placeholder={`Search by ${filterColumn}`}
                  value={
                    (table
                      .getColumn(filterColumn)
                      ?.getFilterValue() as string) ?? ""
                  }
                  onChange={(event) =>
                    table
                      .getColumn(filterColumn)
                      ?.setFilterValue(event.target.value)
                  }
                />
              </form>
              <Dropdown
                id="filterDropdown"
                type="button"
                color="info"
                outline
                label="Filter by"
              >
                {columnNames.map((column, i) => (
                  <Dropdown.Item
                    key={i}
                    onClick={() => {
                      setFilterColumn(column);
                      table.getColumn(filterColumn)?.setFilterValue("");
                    }}
                  >
                    {column}
                  </Dropdown.Item>
                ))}
              </Dropdown>
            </div>
            <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
              {onAddRow && (
                <Button type="button" onClick={onAddRow}>
                  <IoIosAdd
                    className="mr-2 h-5 w-5"
                    fill="currentColor"
                    aria-hidden
                  />
                  Add row
                </Button>
              )}
              <div className="flex items-center space-x-3 w-full md:w-auto">
                <Dropdown
                  id="actionsDropdown"
                  type="button"
                  color="light"
                  outline
                  label="Actions"
                >
                  <Dropdown.Item>Mass edit</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item>Delete all</Dropdown.Item>
                </Dropdown>
                <DataTableViewOptions table={table} />
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <FlowbiteTable striped hoverable>
              <FlowbiteTable.Head>
                {table.getHeaderGroups().map((headerGroup) => (
                  <React.Fragment key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <FlowbiteTable.HeadCell key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </FlowbiteTable.HeadCell>
                    ))}
                  </React.Fragment>
                ))}
              </FlowbiteTable.Head>
              <FlowbiteTable.Body className="divide-y">
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <FlowbiteTable.Row
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <FlowbiteTable.Cell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </FlowbiteTable.Cell>
                      ))}
                    </FlowbiteTable.Row>
                  ))
                ) : (
                  <FlowbiteTable.Row>
                    <FlowbiteTable.Cell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </FlowbiteTable.Cell>
                  </FlowbiteTable.Row>
                )}
              </FlowbiteTable.Body>
            </FlowbiteTable>
          </div>
          <div className="p-4">
            <DataTablePagination table={table} />
          </div>
        </div>
      </div>
    </Card>
  );
}

export { DataTable };
