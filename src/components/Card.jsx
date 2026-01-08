// --- Card Component ---
// Professional Ant Design Pro Card with proper shadows and spacing
// Enhanced with entrance animation and hover effects

const Card = ({ children, className = "", animated = true }) => (
  <div className={`
    bg-white dark:bg-slate-800 rounded-lg shadow-card dark:shadow-slate-900/50 border border-border-light dark:border-slate-700 p-6
    transition-all duration-200 ease-out
    ${animated ? 'animate-fade-slide-up' : ''}
    hover:shadow-card-hover hover:-translate-y-0.5
    ${className}
  `}>
    {children}
  </div>
);

export default Card;
