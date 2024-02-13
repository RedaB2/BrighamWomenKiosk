import { Column } from "@tanstack/react-table";
import { Dropdown } from "flowbite-react";
import { BiHide } from "react-icons/bi";
import { GoArrowDown, GoArrowUp } from "react-icons/go";
import { RxCaretSort } from "react-icons/rx";

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className = "",
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={className}>{title}</div>;
  }

  return (
    <div className={"flex items-center space-x-2" + className}>
      <Dropdown
        type="button"
        color="light"
        outline
        label={
          <>
            {column.getIsSorted() === "desc" ? (
              <GoArrowDown className="mr-2 h-4 w-4" />
            ) : column.getIsSorted() === "asc" ? (
              <GoArrowUp className="mr-2 h-4 w-4" />
            ) : (
              <RxCaretSort className="mr-2 h-5 w-5" />
            )}
            <span className="whitespace-nowrap">{title}</span>
          </>
        }
      >
        <Dropdown.Item
          onClick={() => column.toggleSorting(false)}
          icon={GoArrowUp}
        >
          Ascending
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() => column.toggleSorting(true)}
          icon={GoArrowDown}
        >
          Descending
        </Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item
          onClick={() => column.toggleVisibility(false)}
          icon={BiHide}
        >
          Hide
        </Dropdown.Item>
      </Dropdown>
    </div>
  );
}
