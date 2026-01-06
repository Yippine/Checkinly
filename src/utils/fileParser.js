// --- File Parser Utilities ---
// 從 v1.jsx Lines 46-74, 104-263 遷移

// 純函數：解析 Rows 並返回乾淨資料，若失敗則拋出錯誤
export const extractData = (rows) => {
  // 1. 尋找主標題列 (包含 "部門名稱")
  const headerRowIndex = rows.findIndex(row =>
    row.some(cell => cell && cell.toString().includes('部門名稱'))
  );

  if (headerRowIndex === -1) {
    throw new Error("無法識別檔案格式：找不到'部門名稱'欄位 (可能為編碼問題)");
  }

  const mainHeaders = rows[headerRowIndex].map(h => h ? h.toString().trim() : '');

  // 2. 檢查是否有子標題列 (例如 "遲到(分鐘)" 可能在下一行)
  // 您的檔案結構：Main Header 下一行可能是詳細欄位
  let subHeaders = [];
  if (rows[headerRowIndex + 1]) {
      subHeaders = rows[headerRowIndex + 1].map(h => h ? h.toString().trim() : '');
  }

  // 輔助函數：在多層標題中尋找欄位索引
  const getIndex = (keywords, searchRows = [mainHeaders]) => {
      for (const row of searchRows) {
          const idx = row.findIndex(h => h && keywords.some(k => h.includes(k)));
          if (idx !== -1) return idx;
      }
      return -1;
  };

  // 欄位映射
  // 注意：優先在子標題 (subHeaders) 中尋找 "遲到(分鐘)" 等精確欄位
  const mapIdx = {
    dept: getIndex(['部門名稱'], [mainHeaders]),
    empId: getIndex(['員工編號'], [mainHeaders]),
    date: getIndex(['日期'], [mainHeaders]),
    realHours: getIndex(['實到工時'], [mainHeaders]),
    otRecord: getIndex(['加班紀錄'], [mainHeaders]),
    // 異常欄位優先查子標題
    late: getIndex(['遲到(分鐘)', '遲到'], [subHeaders, mainHeaders]),
    early: getIndex(['早退(分鐘)', '早退'], [subHeaders, mainHeaders]),
    absent: getIndex(['曠職(時)', '曠職'], [subHeaders, mainHeaders]),
    // 新增：狀態欄位（用於識別病假、排休等）
    status: getIndex(['狀態'], [mainHeaders, subHeaders]),
    // INC-004: 新增心情指數欄位（可選）
    moodScore: getIndex(['心情指數', 'Mood Score'], [mainHeaders, subHeaders]),
  };

  if (mapIdx.dept === -1 || mapIdx.realHours === -1) {
    throw new Error("缺少必要欄位：部門名稱或實到工時");
  }

  // 決定資料起始列：如果有子標題，從子標題下一行開始；否則從主標題下一行
  // 簡單判斷：如果下一行包含 "遲到(分鐘)" 這種標題字眼，那它就是標題列，資料從下下行開始
  const dataStartIndex = (subHeaders.length > 0 && subHeaders.some(h => h.includes('遲到') || h.includes('上班')))
                         ? headerRowIndex + 2
                         : headerRowIndex + 1;

  const dataRows = rows.slice(dataStartIndex);

  const cleanData = dataRows.map((row, index) => {
    // 略過空行或沒有部門/員工編號的行
    if (!row[mapIdx.dept] || !row[mapIdx.empId]) return null;

    // 解析加班時數 (從文字 "1H(13:00-14:00)" 中提取數字)
    let otHours = 0;
    const otText = mapIdx.otRecord !== -1 ? row[mapIdx.otRecord] : '';
    if (otText) {
        const match = otText.toString().match(/([0-9.]+)H/);
        if (match) otHours = parseFloat(match[1]);
    }

    // 解析數值 (處理空值或非數字)
    const parseNum = (val) => {
        const n = parseFloat(val);
        return isNaN(n) ? 0 : n;
    };

    // INC-004: 解析心情指數（如果欄位存在）
    let moodScore = null;
    if (mapIdx.moodScore !== -1 && row[mapIdx.moodScore] !== undefined && row[mapIdx.moodScore] !== '') {
      const mood = parseNum(row[mapIdx.moodScore]);
      // 驗證範圍 (1-10)
      if (mood >= 1 && mood <= 10) {
        moodScore = mood;
      } else if (mood !== 0) {
        // 超出範圍時顯示警告（僅在非零值時）
        console.warn(`[fileParser] WARNING: Mood score out of range (1-10) for employee ${row[mapIdx.empId]}, date ${row[mapIdx.date]}: ${mood}`);
      }
    }

    return {
      id: index,
      dept: row[mapIdx.dept],
      empId: row[mapIdx.empId],
      date: row[mapIdx.date],
      workHours: parseNum(row[mapIdx.realHours]),
      otHours: otHours,
      isLate: parseNum(row[mapIdx.late]) > 0,
      isEarly: parseNum(row[mapIdx.early]) > 0,
      isAbsent: parseNum(row[mapIdx.absent]) > 0,
      lateMinutes: parseNum(row[mapIdx.late]),
      status: mapIdx.status !== -1 ? row[mapIdx.status] : '',
      moodScore: moodScore  // INC-004: 新增心情指數欄位
    };
  }).filter(Boolean);

  return cleanData;
};

export const parseCSV = (file, setData, setLoading, setError) => {
  if (!window.Papa) {
      setError("CSV 解析元件尚未載入完成");
      setLoading(false);
      return;
  }

  // 第一次嘗試：預設 (UTF-8)
  window.Papa.parse(file, {
    encoding: "UTF-8",
    complete: (results) => {
      try {
        // 嘗試解析資料
        const cleanData = extractData(results.data);
        setData(cleanData);
        setLoading(false);
      } catch (e) {
        // 如果 UTF-8 解析失敗 (例如找不到欄位)，嘗試 Big5
        // Fallback to Big5 encoding for traditional Chinese systems

        window.Papa.parse(file, {
          encoding: "Big5", // 針對台灣繁體中文系統
          complete: (resultsBig5) => {
            try {
              const cleanDataBig5 = extractData(resultsBig5.data);
              setData(cleanDataBig5);
            } catch {
              // 兩次都失敗，顯示最後的錯誤
              setError(`解析失敗: ${e.message} (已嘗試 UTF-8 與 Big5 編碼)`);
            } finally {
              setLoading(false);
            }
          },
          error: (err) => {
            setError(`CSV 讀取錯誤: ${err.message}`);
            setLoading(false);
          }
        });
      }
    },
    error: (err) => {
      setError(`CSV 讀取錯誤: ${err.message}`);
      setLoading(false);
    }
  });
};

export const parseExcel = (file, setData, setLoading, setError) => {
  if (!window.XLSX) {
      setError("Excel 解析元件尚未載入完成");
      setLoading(false);
      return;
  }
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const bstr = e.target.result;
      const wb = window.XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = window.XLSX.utils.sheet_to_json(ws, { header: 1 });
      const cleanData = extractData(data);
      setData(cleanData);
    } catch (err) {
      setError(`Excel 解析錯誤: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  reader.readAsBinaryString(file);
};

// 初始化外部庫 (從 CDN 加載)
export const initLibraries = () => {
  const loadScript = (src) => {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });
  };

  return Promise.all([
    loadScript('https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.3.0/papaparse.min.js'),
    loadScript('https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js')
  ]);
};
