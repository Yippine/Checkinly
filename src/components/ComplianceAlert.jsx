// --- Compliance Alert Component ---
// Display schedule compliance violations in a red alert card

import Card from './Card';
import { AlertTriangle } from 'lucide-react';

const ComplianceAlert = ({ violations }) => {
  // Don't render if no violations
  if (!violations || violations.length === 0) {
    return null;
  }

  return (
    <Card className="bg-error-50 border-error-200" animated={true}>
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="text-error-600" size={20} strokeWidth={2} />
        <h3 className="text-heading-3 text-error-700 font-semibold">
          排班違規警示
        </h3>
      </div>

      <div className="space-y-2">
        {violations.map((v, idx) => (
          <div key={idx} className="p-3 bg-white rounded border border-error-200 hover:border-error-300 transition-colors duration-200">
            <div className="font-medium text-text-primary mb-1">
              {v.name || v.empId}
            </div>
            <div className="text-body-small text-text-secondary">
              違規類型: <span className="font-medium text-error-600">{v.violationType}</span>
            </div>
            <div className="text-body-small text-error-600 mt-1">
              連續工作 {v.consecutiveDays} 天
            </div>
            {v.dept && (
              <div className="text-body-small text-text-tertiary mt-1">
                部門: {v.dept}
              </div>
            )}
          </div>
        ))}
      </div>

      {violations.length > 0 && (
        <div className="mt-3 pt-3 border-t border-error-200">
          <p className="text-body-small text-text-secondary">
            建議立即調整排班，避免違反勞基法規定
          </p>
        </div>
      )}
    </Card>
  );
};

export default ComplianceAlert;
