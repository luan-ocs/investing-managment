import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import React, { useMemo } from 'react';

// import { Container } from './styles';
import { FormData } from '../modals/AddDialog';

type TableProps = {
  data: FormData[];
  setEditable: (data: FormData) => void;
  setEditOpen: (value: boolean) => void;
  setDelete: (data: FormData) => void;
  setDeleteOpen: (value: boolean) => void;
  type: 'expense' | 'gain';
};

const TableMonth: React.FC<TableProps> = ({
  type,
  data,
  setEditable,
  setEditOpen,
  setDelete,
  setDeleteOpen,
}) => {
  const columnHelper = createColumnHelper<FormData>();

  const headers = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: 'Nome',
        cell: (value) => <p className="text-gray-500">{value.getValue()}</p>,
      }),
      columnHelper.accessor('value', {
        header: 'Valor',
        cell: (value) => <p className="text-green-800">{value.getValue()}</p>,
      }),
      columnHelper.accessor(type == 'gain' ? 'received' : 'payed', {
        header: 'Situação',
        cell: (value) => (
          <p className="text-gray-500">
            {value.getValue()
              ? type == 'gain'
                ? 'Recebido'
                : 'Pago'
              : 'Pendente'}
          </p>
        ),
      }),
      columnHelper.accessor('description', {
        header: 'Descrição',
        cell: (value) => (
          <p className="text-gray-500 truncate w-20 text-sm md:w-auto md:text-base">
            {value.getValue()}
          </p>
        ),
      }),
      columnHelper.display({
        header: 'Ações',
        cell: (value) => (
          <div>
            <TableButton
              name="Editar"
              action={() => {
                setEditable(value.cell.getContext().row.original);
                setEditOpen(true);
              }}
            />
            <TableButton
              name="Deletar"
              color="bg-red-600"
              action={() => {
                setDelete(value.cell.getContext().row.original);
                setDeleteOpen(true);
              }}
            />
          </div>
        ),
      }),
    ],
    [],
  );

  const table = useReactTable({
    data,
    columns: headers,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <div className="py-2 flex justify-center mt-4 px-8">
        <table className="w-full bg-slate-200 rounded">
          <thead
            className={`border-b-2 ${
              type == 'expense' ? 'border-red-700' : 'border-green-700'
            } text-sm`}
          >
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="">
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="py-2 font-normal">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="text-center py-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default TableMonth;

const TableButton = ({
  name,
  action,
  color,
}: {
  name: string;
  action: () => void;
  color?: string;
}) => {
  return (
    <button
      onClick={() => action()}
      className={`text-sm m-2 p-2 ${
        color ? color : 'bg-green-600'
      } text-white rounded`}
    >
      {name}
    </button>
  );
};
