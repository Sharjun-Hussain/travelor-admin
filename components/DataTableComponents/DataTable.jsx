import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const DataTable = ({
  columns,
  data,
  sortConfig,
  onSort,
  onRowClick,
  actions = [],
  emptyState = "No data found",
  className = "",
}) => {
  const handleSort = (key) => {
    if (onSort) {
      onSort(key);
    }
  };

  return (
    <div className={`rounded-md border ${className}`}>
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow className="hover:bg-slate-50 border-slate-200">
            {columns.map((column) => (
              <TableHead
                key={column.key}
                className={`font-semibold text-slate-700 ${
                  column.sortable ? "cursor-pointer" : ""
                } ${column.className || ""}`}
                onClick={() => column.sortable && handleSort(column.key)}
              >
                <div className="flex items-center">
                  {column.label}
                  {sortConfig?.key === column.key && (
                    <ChevronDown
                      className={`ml-1 h-4 w-4 ${
                        sortConfig.direction === "desc" ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </div>
              </TableHead>
            ))}
            {actions.length > 0 && (
              <TableHead className="text-right font-semibold text-slate-700">
                Actions
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length + (actions.length > 0 ? 1 : 0)}
                className="text-center py-10 text-slate-500"
              >
                {emptyState}
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, rowIndex) => (
              <TableRow
                key={rowIndex}
                className="hover:bg-slate-50/50 border-slate-200"
                onClick={() => onRowClick && onRowClick(row)}
              >
                {columns.map((column) => (
                  <TableCell
                    key={`${rowIndex}-${column.key}`}
                    className={column.className || ""}
                  >
                    {column.render ? column.render(row) : row[column.key]}
                  </TableCell>
                ))}
                {actions.length > 0 && (
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        {actions.map((action, index) => (
                          <DropdownMenuItem
                            key={index}
                            onClick={(e) => {
                              e.stopPropagation();
                              action.onClick(row);
                            }}
                            className={action.className || ""}
                          >
                            {action.icon && (
                              <action.icon className="mr-2 h-4 w-4 text-slate-500" />
                            )}
                            {action.label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
}) => {
  return (
    <div
      className={`flex items-center justify-between px-6 py-4 bg-slate-50 border-t border-slate-100 ${className}`}
    >
      <div className="text-sm text-slate-600">
        Page {currentPage} of {totalPages}
      </div>
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className="h-8 px-3"
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="h-8 px-3"
        >
          Next
        </Button>
      </div>
    </div>
  );
};
