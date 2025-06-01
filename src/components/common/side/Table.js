// Table.jsx
import React, { useState } from 'react';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { FaPlus } from 'react-icons/fa'; // Thêm icon dấu cộng

const Table = ({
  columns = [],
  data = [],
  pageIndex = 0,
  keyword = '',
  pageSize = 5,
  onPageChange,
  onPageSizeChange,
  onKeywordChange,
  total = 0,
  pageSizeOptions = [5, 10, 20],
  onAddNew, // Thêm prop để xử lý sự kiện thêm mới
}) => {
  const canPreviousPage = pageIndex > 0;
  const canNextPage = (pageIndex + 1) * pageSize < total;
  const [key, setKey] = useState(keyword || '');

  const handlePageChange = (newPageIndex) => {
    if (onPageChange) onPageChange(newPageIndex);
  };

  const handlePageSizeChange = (e) => {
    if (onPageSizeChange) onPageSizeChange(Number(e.target.value));
  };

  const handleSearch = () => {
    if (onKeywordChange) onKeywordChange(key);
  };

  return (
    <div className="container mx-auto bg-white rounded-lg p-6 shadow-md border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">DANH SÁCH</h1>
        <button
          onClick={onAddNew}
          className="flex items-center bg-blue-900 text-white px-4 py-2 rounded-full hover:bg-blue-800 transition"
        >
          <FaPlus className="mr-2" size={16} />
          Thêm mới
        </button>
      </div>
      <div className="overflow-x-auto shadow-md rounded-lg border border-gray-200 border-b-0">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="px-4 py-3 text-center text-base font-semibold text-gray-700 uppercase tracking-wider"
                >
                  {column.Header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50">
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className="px-4 py-4 whitespace-nowrap text-base text-gray-800 border-b border-gray-200"
                  >
                    {column.accessor === 'action' ? (
                      <div className="flex space-x-3">
                        <button
                          onClick={() => column.onEdit(row)}
                          className="w-10 h-10 bg-cyan-600 rounded-lg flex items-center justify-center hover:bg-cyan-700"
                        >
                          <FiEdit size={20} className="text-white" />
                        </button>
                        <button
                          onClick={() => column.onDelete(row.id)}
                          className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center hover:bg-red-700"
                        >
                          <FiTrash2 size={20} className="text-white" />
                        </button>
                      </div>
                    ) : (
                      row[column.accessor]
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-5 items-center justify-between">
        <div className="flex items-center">
          <button
            className={`px-6 py-3 border rounded-lg text-base ${
              canPreviousPage
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
            onClick={() => handlePageChange(pageIndex - 1)}
            disabled={!canPreviousPage}
          >
            {'<'}
          </button>
          <button
            className={`px-6 py-3 border rounded-lg ml-3 text-base ${
              canNextPage
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
            onClick={() => handlePageChange(pageIndex + 1)}
            disabled={!canNextPage}
          >
            {'>'}
          </button>
          <span className="ml-4 text-base text-gray-700">
            Page {pageIndex + 1} of {Math.ceil(total / pageSize)}
          </span>
        </div>

        {onKeywordChange && (
          <div className="w-full text-center flex col-span-3 col-start-2">
            <input
              className="w-7/12 px-4 py-3 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-green-600 text-base"
              placeholder="Search..."
              value={key}
              onChange={(e) => setKey(e.target.value)}
            />
            <button
              className="px-6 py-3 bg-green-500 text-white rounded-r-lg text-base"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>
        )}

        <div className="flex items-center justify-end">
          <span className="mr-3 text-base text-gray-700">Show</span>
          <select
            value={pageSize}
            onChange={handlePageSizeChange}
            className="px-3 py-2 border rounded-lg bg-white text-gray-700 text-base"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default Table;