// --- EmptyState Component ---
// User-friendly empty state designs with icons and helpful messages

import React from 'react';
import { FileX, Inbox, Search, AlertCircle } from 'lucide-react';

const EmptyState = ({
  icon: IconComponent = FileX, // eslint-disable-line no-unused-vars
  title = '尚無資料',
  message = '目前沒有可顯示的內容',
  action = null,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-12 text-center ${className}`}>
      <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-neutral-100">
        <IconComponent size={32} className="text-neutral-400" strokeWidth={1.5} />
      </div>
      <h3 className="text-heading-3 text-slate-900 dark:text-slate-100 mb-2">{title}</h3>
      <p className="text-body text-slate-500 dark:text-slate-400 max-w-md mb-4">{message}</p>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
};

// Preset Empty States
export const NoDataEmptyState = ({ onUpload }) => (
  <EmptyState
    icon={FileX}
    title="尚未上傳資料"
    message="請點擊上方按鈕上傳出勤明細表檔案（支援 CSV 或 Excel 格式）"
    action={
      onUpload && (
        <button
          onClick={onUpload}
          className="
            px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-base
            transition-all duration-150 ease-in-out shadow-sm hover:shadow-md
            active:scale-98 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
          "
        >
          立即上傳
        </button>
      )
    }
  />
);

export const NoResultsEmptyState = () => (
  <EmptyState
    icon={Search}
    title="找不到符合的結果"
    message="請嘗試調整篩選條件或搜尋關鍵字"
  />
);

export const ErrorEmptyState = ({ error, onRetry }) => (
  <EmptyState
    icon={AlertCircle}
    title="載入失敗"
    message={error || '資料載入時發生錯誤，請稍後再試'}
    action={
      onRetry && (
        <button
          onClick={onRetry}
          className="
            px-4 py-2 bg-error-500 hover:bg-error-600 text-white rounded-base
            transition-all duration-150 ease-in-out shadow-sm hover:shadow-md
            active:scale-98 focus:outline-none focus:ring-2 focus:ring-error-500 focus:ring-offset-2
          "
        >
          重新載入
        </button>
      )
    }
  />
);

export const InboxEmptyState = () => (
  <EmptyState
    icon={Inbox}
    title="收件匣空空如也"
    message="目前沒有待處理的項目"
  />
);

export default EmptyState;
