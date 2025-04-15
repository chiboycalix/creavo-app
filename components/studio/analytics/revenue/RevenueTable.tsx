"use client"
import DynamicTable from '@/components/table';
import { cn } from '@/lib/utils';
import React, { useState } from 'react'

const tableData = [
  {
    id: 1,
    referenceId: "234hdj488",
    beneficiary: "Alex Johnson",
    bank: "GTB",
    amount: "50,000",
    transferFee: "150,000",
    date: "13/03/2025",
    status: "Pending"
  },
  {
    id: 2,
    referenceId: "234hdj488",
    beneficiary: "Alex Johnson",
    bank: "GTB",
    amount: "50,000",
    transferFee: "150,000",
    date: "13/03/2025",
    status: "Approved"
  },
  {
    id: 3,
    referenceId: "234hdj488",
    beneficiary: "Alex Johnson",
    bank: "GTB",
    amount: "50,000",
    transferFee: "150,000",
    date: "13/03/2025",
    status: "Failed"
  },
];

const RevenueTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);


  const columns = [
    {
      header: "S/N",
      accessorKey: "id",
    },
    {
      header: "Reference Id",
      accessorKey: "referenceId",
    },
    { header: "Beneficiary", accessorKey: "beneficiary" },
    { header: "Bank", accessorKey: "bank", sortable: true },
    { header: "Amount (NGN)", accessorKey: "amount" },
    { header: "Transfer Fee", accessorKey: "transferFee" },
    { header: "Date", accessorKey: "date" },
    {
      header: "Status",
      accessorKey: "status",
      cell: (row: any) => {
        const status = row.status;

        return (
          <div
            className={cn(`w-fit px-5 py-1 rounded-full`,
              status === "Pending" && "bg-primary-50 border-primary-300 border-[1px] text-primary-600",
              status === "Approved" && "bg-green-50 border-green-300 border-[1px] text-green-600",
              status === "Failed" && "bg-red-50 border-red-300 text-red-600 border-[1px]",
            )}
          >
            {status}
          </div>
        );
      },
    },
  ] as any;

  return (
    <DynamicTable
      columns={columns}
      data={tableData}
      setCurrentPage={setCurrentPage}
      setRowsPerPage={setRowsPerPage}
      currentPage={currentPage}
      rowsPerPage={rowsPerPage}
      title=''
      renderEmptyRecords={
        <div className="flex flex-col w-full items-center justify-center h-[300px] mx-auto">
          <h2 className="text-center font-semibold flex justify-center text-md">
            No Information yet!
          </h2>
          <p className="text-center text-sm">
            You currently don’t have any Subscriber
          </p>
        </div>
      }
    />
  )
}

export default RevenueTable