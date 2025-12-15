/**
 * ExportExcel Utility
 * Formula: CurrentFilteredData -> ConvertToWorksheet -> GenerateBlob -> TriggerDownload
 *
 * Dependencies: XLSX@0.18.5 (already installed)
 */

/**
 * Export data to Excel file
 * @param {Array} data - Array of data objects to export (filteredData, NOT paginatedData)
 * @param {string} filename - Output filename (e.g., "出勤明細_匯出_20251215.xlsx")
 */
export const exportToExcel = async (data, filename) => {
  try {
    // Dynamically load XLSX library
    const XLSX = await import('xlsx');

    // Prepare data for Excel (transform to human-readable format)
    const excelData = data.map((row, index) => ({
      '序號': index + 1,
      '部門': row.dept || '',
      '員工編號': row.empId || '',
      '日期': row.date || '',
      '星期': row.weekday || '',
      '班別': row.shift || '',
      '打卡上班': row.checkIn || '',
      '打卡下班': row.checkOut || '',
      '實到工時': row.actualHours || 0,
      '加班紀錄': row.otRecord || '',
      '加班時數': row.otHours || 0,
    }));

    // ConvertToWorksheet: Create worksheet from JSON
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Set column widths for better readability
    const columnWidths = [
      { wch: 6 },  // 序號
      { wch: 15 }, // 部門
      { wch: 12 }, // 員工編號
      { wch: 12 }, // 日期
      { wch: 6 },  // 星期
      { wch: 20 }, // 班別
      { wch: 10 }, // 打卡上班
      { wch: 10 }, // 打卡下班
      { wch: 10 }, // 實到工時
      { wch: 15 }, // 加班紀錄
      { wch: 10 }, // 加班時數
    ];
    worksheet['!cols'] = columnWidths;

    // Create workbook and append worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, '出勤明細');

    // TriggerDownload: Write file and trigger browser download
    XLSX.writeFile(workbook, filename);

    console.log(`[ExportExcel] Successfully exported ${data.length} rows to ${filename}`);
    return true;
  } catch (error) {
    console.error('[ExportExcel] Export failed:', error);
    alert('匯出失敗，請確認瀏覽器支援下載功能');
    return false;
  }
};

/**
 * Format date to YYYYMMDD
 * @param {Date} date
 * @returns {string}
 */
export const formatDateForFilename = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
};
