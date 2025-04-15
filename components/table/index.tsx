import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Pagination from "./Pagination";
import { ArrowUpDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

type TableProps = {
  columns: Column[];
  data: any[];
  currentPage: number;
  rowsPerPage: number;
  setCurrentPage: (currentPage: number) => void;
  setRowsPerPage: (rowsPerPage: number) => void;
  renderEmptyRecords: any;
  title?: string;
};

type SortConfig = {
  key: string;
  direction: "asc" | "desc" | null;
};

type Column = {
  header: string;
  accessorKey: string;
  cell?: (row: any, item: any) => React.ReactNode;
  sortable?: boolean;
};

const DynamicTable = ({
  columns,
  data,
  renderEmptyRecords,
  setCurrentPage,
  setRowsPerPage,
  rowsPerPage,
  currentPage,
  title = "Trainee"
}: TableProps) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "",
    direction: null,
  });

  const sortedData = React.useMemo(() => {
    if (!sortConfig.direction) return data;

    return [...data].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortConfig]);

  const requestSort = (key: string) => {
    let direction: "asc" | "desc" | null = "asc";

    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    setSortConfig({ key, direction });
  };

  const lastIndex = currentPage * rowsPerPage;
  const firstIndex = lastIndex - rowsPerPage;
  const currentRecords = sortedData.slice(firstIndex, lastIndex);

  return (
    <Card className="w-full border-none">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base font-normal">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="max-w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-200 bg-white">
          <div className="w-full">
            <Table className="">
              <TableHeader>
                <TableRow className="bg-primary-50">
                  {columns.map((column, index) => (
                    <TableHead
                      key={index}
                      className={`text-black ${column.sortable
                        ? "cursor-pointer hover:bg-gray-100"
                        : ""
                        }`}
                      onClick={() =>
                        column.sortable && requestSort(column.accessorKey)
                      }
                    >
                      <span className="flex items-center gap-2">
                        {column.header}
                        {column.sortable && (
                          <ArrowUpDown
                            size={16}
                            className={
                              sortConfig.key === column.accessorKey
                                ? "text-primary"
                                : "text-gray-400"
                            }
                          />
                        )}
                      </span>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              {currentRecords.length === 0 ? (
                <span className="items-center">{renderEmptyRecords}</span>
              ) : (
                <TableBody className="bg-white w-full mx-auto">
                  {currentRecords.map((row, index) => (
                    <TableRow key={index} className="whitespace-nowrap">
                      {columns.map((column, cellIndex) => (
                        <TableCell key={cellIndex}>
                          {column.cell
                            ? column.cell(row, index + firstIndex)
                            : row[column.accessorKey]}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              )}
            </Table>
            <div className="mt-4">
              <Pagination
                {...{
                  currentPage,
                  totalPages: Math.ceil(data.length / rowsPerPage),
                  onPageChange: setCurrentPage,
                  rowsPerPage,
                  onRowsPerPageChange: setRowsPerPage,
                }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DynamicTable;
