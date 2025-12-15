import React, { useState, useMemo, useEffect } from 'react';
import { Search, Download, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import Card from './Card';
import EmptyState from './EmptyState';
import { exportToExcel } from '../utils/exportExcel';

/**
 * AttendanceTable Component
 * Formula: DataSource + ColumnDefinition + RowRendering + StylingSystem
 *
 * DataPipeline: rawData -> filteredData (search) -> sortedData (sort) -> paginatedData (page)
 */
const AttendanceTable = ({ data = [] }) => {
  // --- State Management ---
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ column: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);

  const PAGE_SIZE = 50;

  // --- Column Definitions (ColumnDefinition) ---
  const columns = [
    { key: 'dept', label: '部門', sortable: true },
    { key: 'empId', label: '員工編號', sortable: true },
    { key: 'date', label: '日期', sortable: true },
    { key: 'weekday', label: '星期', sortable: false },
    { key: 'shift', label: '班別', sortable: false },
    { key: 'checkTime', label: '打卡時間', sortable: false },
    { key: 'actualHours', label: '實到工時', sortable: true },
    { key: 'otRecord', label: '加班紀錄', sortable: false },
  ];

  // --- SearchEngine: Input -> Filter -> UpdateView ---
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;

    const lowerSearch = searchTerm.toLowerCase();
    return data.filter(row => {
      const dept = (row.dept || '').toLowerCase();
      const empId = (row.empId || '').toLowerCase();
      const date = (row.date || '').toLowerCase();

      return dept.includes(lowerSearch) ||
             empId.includes(lowerSearch) ||
             date.includes(lowerSearch);
    });
  }, [data, searchTerm]);

  // --- SortEngine: ClickHeader -> ToggleDirection -> SortData -> UpdateView ---
  const sortedData = useMemo(() => {
    if (!sortConfig.column) return filteredData;

    const sorted = [...filteredData].sort((a, b) => {
      const aVal = a[sortConfig.column];
      const bVal = b[sortConfig.column];

      // Handle different data types
      if (sortConfig.column === 'actualHours' || sortConfig.column === 'otHours') {
        const numA = parseFloat(aVal) || 0;
        const numB = parseFloat(bVal) || 0;
        return sortConfig.direction === 'asc' ? numA - numB : numB - numA;
      }

      // String comparison
      const strA = String(aVal || '');
      const strB = String(bVal || '');
      const comparison = strA.localeCompare(strB, 'zh-TW');

      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });

    return sorted;
  }, [filteredData, sortConfig]);

  // --- PaginationEngine: DataLength -> ComputePageCount -> CurrentPageSlice -> NavigationControls ---
  const totalPages = Math.ceil(sortedData.length / PAGE_SIZE);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return sortedData.slice(startIndex, startIndex + PAGE_SIZE);
  }, [sortedData, currentPage]);

  // --- Event Handlers ---

  // SortEngine: ClickHeader handler
  const handleSort = (columnKey) => {
    const column = columns.find(col => col.key === columnKey);
    if (!column?.sortable) return;

    setSortConfig(prev => {
      if (prev.column === columnKey) {
        // Toggle direction if same column
        return { column: columnKey, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      } else {
        // New column, start with asc
        return { column: columnKey, direction: 'asc' };
      }
    });
    setCurrentPage(1); // Reset to first page
  };

  // SearchEngine: Input onChange handler
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page
  };

  // SearchEngine: Clear button handler
  const handleClearSearch = () => {
    setSearchTerm('');
    setCurrentPage(1);
  };

  // PaginationEngine: Navigation handlers
  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
  };

  // ExportUtility: Export to Excel handler
  const handleExport = () => {
    if (filteredData.length > 1000) {
      const confirmed = window.confirm(
        '建議先使用搜尋篩選後再匯出。\n\n目前篩選後資料超過 1000 筆，確定要匯出嗎？'
      );
      if (!confirmed) return;
    }

    const today = new Date();
    const dateStr = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`;
    const filename = `出勤明細_匯出_${dateStr}.xlsx`;

    exportToExcel(filteredData, filename);
  };

  // --- Render Sort Icon ---
  const renderSortIcon = (columnKey) => {
    if (sortConfig.column !== columnKey) return null;

    return sortConfig.direction === 'asc' ? (
      <ChevronUp size={16} className="inline ml-1 text-primary-500" />
    ) : (
      <ChevronDown size={16} className="inline ml-1 text-primary-500" />
    );
  };

  // --- Empty State Check ---
  if (data.length === 0) {
    return (
      <Card>
        <EmptyState
          title="尚未上傳出勤資料"
          message="請先上傳 CSV 或 Excel 格式的出勤明細表"
        />
      </Card>
    );
  }

  // --- Main Render ---
  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header Controls: SearchEngine + ExportUtility */}
      <Card>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex-1 w-full sm:max-w-md">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-tertiary"
                size={18}
              />
              <input
                type="text"
                placeholder="搜尋部門、員工編號或日期..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="
                  w-full pl-10 pr-10 py-2.5
                  border border-neutral-300 rounded-lg
                  focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                  text-body text-text-primary placeholder-text-tertiary
                  transition-all duration-150
                "
                aria-label="搜尋出勤資料"
              />
              {searchTerm && (
                <button
                  onClick={handleClearSearch}
                  className="
                    absolute right-3 top-1/2 transform -translate-y-1/2
                    text-text-tertiary hover:text-text-primary
                    transition-colors duration-150
                  "
                  aria-label="清除搜尋"
                >
                  ×
                </button>
              )}
            </div>
            <p className="text-body-small text-text-tertiary mt-1">
              顯示 {filteredData.length} 筆資料（共 {data.length} 筆）
            </p>
          </div>

          <button
            onClick={handleExport}
            className="
              px-5 py-2.5
              bg-primary-500 hover:bg-primary-600
              text-white rounded-lg
              flex items-center gap-2
              font-medium text-sm
              shadow-sm hover:shadow-md
              transition-all duration-150
              focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
            "
            aria-label="匯出 Excel"
          >
            <Download size={18} />
            匯出 Excel
          </button>
        </div>
      </Card>

      {/* Table Display */}
      <Card className="overflow-hidden">
        {filteredData.length === 0 ? (
          <EmptyState
            title="找不到符合的結果"
            message="請嘗試調整搜尋條件"
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-neutral-50 border-b-2 border-neutral-200">
                  <tr>
                    {columns.map(col => (
                      <th
                        key={col.key}
                        onClick={() => handleSort(col.key)}
                        className={`
                          px-4 py-3 text-left text-heading-4 text-text-secondary font-semibold
                          ${col.sortable ? 'cursor-pointer hover:bg-neutral-100 transition-colors duration-150' : ''}
                        `}
                      >
                        <div className="flex items-center gap-1">
                          {col.label}
                          {col.sortable && renderSortIcon(col.key)}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {paginatedData.map((row, idx) => (
                    <tr
                      key={`${row.empId}-${row.date}-${idx}`}
                      className="hover:bg-neutral-50 transition-colors duration-150"
                    >
                      <td className="px-4 py-3 font-medium text-text-primary">{row.dept || '-'}</td>
                      <td className="px-4 py-3 text-text-secondary">{row.empId || '-'}</td>
                      <td className="px-4 py-3 text-text-secondary">{row.date || '-'}</td>
                      <td className={`px-4 py-3 ${['(六)', '(日)'].includes(row.weekday) ? 'text-error-500 font-medium' : 'text-text-secondary'}`}>
                        {row.weekday || '-'}
                      </td>
                      <td className="px-4 py-3 text-text-secondary truncate max-w-[150px]" title={row.shift}>
                        {row.shift || '-'}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-text-secondary">
                        {row.checkIn && row.checkOut ? `${row.checkIn} - ${row.checkOut}` : '-'}
                      </td>
                      <td className={`px-4 py-3 text-right font-semibold ${
                        (row.actualHours || 0) > 9 ? 'text-warning-600' : 'text-text-primary'
                      }`}>
                        {row.actualHours || 0}
                      </td>
                      <td className="px-4 py-3">
                        {row.otRecord ? (
                          <span className="bg-error-100 text-error-700 px-2 py-0.5 rounded text-xs font-medium">
                            {row.otRecord}
                          </span>
                        ) : (
                          '-'
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* PaginationEngine: NavigationControls */}
            {sortedData.length > PAGE_SIZE && (
              <div className="border-t border-neutral-200 px-6 py-4 flex items-center justify-between bg-neutral-50">
                <div className="text-body-small text-text-secondary">
                  第 {currentPage} 頁，共 {totalPages} 頁
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className="
                      px-3 py-2 border border-neutral-300 rounded-lg
                      text-text-secondary hover:bg-neutral-100
                      disabled:opacity-50 disabled:cursor-not-allowed
                      transition-all duration-150
                      focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                    "
                    aria-label="上一頁"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="
                      px-3 py-2 border border-neutral-300 rounded-lg
                      text-text-secondary hover:bg-neutral-100
                      disabled:opacity-50 disabled:cursor-not-allowed
                      transition-all duration-150
                      focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                    "
                    aria-label="下一頁"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
};

export default AttendanceTable;
