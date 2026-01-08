import React from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle, Heart } from 'lucide-react';
import Card from './Card';
import { stanfordFeedback } from '../data/feedbackRules/stanfordFeedback';
import { cbiFeedback } from '../data/feedbackRules/cbiFeedback';
import { olbiFeedback } from '../data/feedbackRules/olbiFeedback';

/**
 * Simple Markdown renderer for feedback content
 */
const MarkdownText = ({ children }) => {
  if (!children) return null;

  // Convert Markdown to HTML-like structure
  const renderMarkdown = (text) => {
    const lines = text.split('\n');
    const elements = [];
    let listItems = [];

    lines.forEach((line, index) => {
      // Handle bold text **text**
      const processBold = (str) => {
        const parts = str.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, i) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={i}>{part.slice(2, -2)}</strong>;
          }
          return part;
        });
      };

      // List items
      if (line.trim().startsWith('- ')) {
        listItems.push(
          <li key={`li-${index}`} className="ml-4 text-slate-600 dark:text-slate-300">
            {processBold(line.trim().substring(2))}
          </li>
        );
      }
      // Numbered lists
      else if (/^\d+\./.test(line.trim())) {
        const text = line.trim().replace(/^\d+\.\s*/, '');
        listItems.push(
          <li key={`li-${index}`} className="ml-4 text-slate-600 dark:text-slate-300">
            {processBold(text)}
          </li>
        );
      }
      // Regular paragraph
      else {
        // Flush list items if any
        if (listItems.length > 0) {
          elements.push(
            <ul key={`ul-${index}`} className="list-disc pl-5 mb-3 text-slate-600 dark:text-slate-300">
              {listItems}
            </ul>
          );
          listItems = [];
        }

        if (line.trim()) {
          elements.push(
            <p key={`p-${index}`} className="mb-3 text-slate-600 dark:text-slate-300">
              {processBold(line)}
            </p>
          );
        } else {
          elements.push(<br key={`br-${index}`} />);
        }
      }
    });

    // Flush remaining list items
    if (listItems.length > 0) {
      elements.push(
        <ul key="ul-final" className="list-disc pl-5 mb-3">
          {listItems}
        </ul>
      );
    }

    return elements;
  };

  return <div className="markdown-content">{renderMarkdown(children)}</div>;
};

/**
 * Burnout Result Feedback Component
 * Renders rich, contextual feedback based on questionnaire results
 */
const BurnoutResultFeedback = ({ questionnaire, score, subscales }) => {
  const feedback = generateFeedback(questionnaire, score, subscales);

  if (!feedback || !feedback.level) {
    return null;
  }

  return (
    <Card className="mt-6">
      {/* Overall Score Display */}
      <div className="text-center mb-8 pb-6 border-b border-neutral-200 dark:border-slate-700">
        <div className="text-sm text-slate-500 dark:text-slate-400 mb-2">您的倦怠分數</div>
        <div className={`text-6xl font-bold mb-3 ${getScoreColor(feedback.color)}`}>
          {formatScore(score, questionnaire)}
        </div>
        <div className={`inline-block px-4 py-2 rounded-full text-lg font-medium ${getBadgeColor(feedback.color)}`}>
          {feedback.level}
        </div>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">{feedback.description}</p>
      </div>

      {/* Dynamic Advice Sections */}
      {feedback.adviceList && feedback.adviceList.length > 0 && (
        <div className="space-y-6 mb-8">
          <h3 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Info size={24} className="text-primary-600" />
            個人化建議
          </h3>
          {feedback.adviceList.map((advice, index) => (
            <div
              key={index}
              className="bg-neutral-50 dark:bg-slate-800 border-l-4 border-primary-500 dark:border-primary-600 p-6 rounded-r-lg"
            >
              <h4 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-3">{advice.title}</h4>
              <div className="text-slate-600 dark:text-slate-300">
                <MarkdownText>{advice.content}</MarkdownText>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Encouragement Section */}
      {feedback.encouragement && (
        <div className={`p-6 rounded-lg ${getEncouragementBgColor(feedback.color)} ${getEncouragementTextColor(feedback.color)}`}>
          <div className="flex items-start gap-3">
            {getEncouragementIcon(feedback.color)}
            <div className="flex-1">
              <MarkdownText>{feedback.encouragement}</MarkdownText>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

/**
 * Generate feedback based on questionnaire type
 */
function generateFeedback(questionnaire, score, subscales) {
  switch (questionnaire) {
    case 'stanford':
      return generateStanfordFeedback(score);
    case 'cbi':
      return generateCBIFeedback(score, subscales);
    case 'olbi':
      return generateOLBIFeedback(score, subscales);
    default:
      return {};
  }
}

/**
 * Stanford feedback (direct mapping)
 */
function generateStanfordFeedback(score) {
  const feedback = stanfordFeedback[score];
  if (!feedback) return {};

  return {
    level: feedback.title,
    description: feedback.description,
    encouragement: feedback.encouragement,
    color: feedback.color,
    adviceList: [] // Stanford uses encouragement instead of separate advice
  };
}

/**
 * CBI feedback (rule engine)
 */
function generateCBIFeedback(overallScore, subscales) {
  if (!subscales) return {};

  const { personal, work, client } = subscales;
  const { level, color, description } = cbiFeedback.getOverallLevel(overallScore);
  const adviceList = cbiFeedback.getDynamicAdvice(personal, work, client);
  const encouragement = cbiFeedback.getEncouragement(overallScore);

  return { level, description, color, adviceList, encouragement };
}

/**
 * OLBI feedback (JD-R model)
 */
function generateOLBIFeedback(overallScore, subscales) {
  if (!subscales) return {};

  const { exhaustion, disengagement } = subscales;
  const { level, color, description } = olbiFeedback.getOverallLevel(overallScore);
  const adviceList = olbiFeedback.getDynamicAdvice(exhaustion, disengagement);
  const encouragement = olbiFeedback.getEncouragement(overallScore, exhaustion, disengagement);

  return { level, description, color, adviceList, encouragement };
}

/**
 * Format score display based on questionnaire type
 */
function formatScore(score, questionnaire) {
  switch (questionnaire) {
    case 'stanford':
      return score; // 1-5
    case 'cbi':
      return score.toFixed(1); // 0-100
    case 'olbi':
      return score.toFixed(2); // 1-4
    default:
      return score;
  }
}

/**
 * Get color class for score display
 */
function getScoreColor(color) {
  const colors = {
    success: 'text-success-600 dark:text-success-400',
    warning: 'text-warning-600 dark:text-warning-400',
    error: 'text-error-600 dark:text-error-400'
  };
  return colors[color] || 'text-neutral-600 dark:text-neutral-400';
}

/**
 * Get badge color classes
 */
function getBadgeColor(color) {
  const colors = {
    success: 'bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-300',
    warning: 'bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-300',
    error: 'bg-error-100 dark:bg-error-900/30 text-error-700 dark:text-error-300'
  };
  return colors[color] || 'bg-neutral-100 dark:bg-slate-700 text-neutral-700 dark:text-neutral-300';
}

/**
 * Get encouragement section background color
 */
function getEncouragementBgColor(color) {
  const colors = {
    success: 'bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800',
    warning: 'bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-800',
    error: 'bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800'
  };
  return colors[color] || 'bg-neutral-50 dark:bg-slate-800 border border-neutral-200 dark:border-slate-700';
}

/**
 * Get text color for encouragement section based on background color
 */
function getEncouragementTextColor(color) {
  const colors = {
    success: 'text-success-700 dark:text-success-300',
    warning: 'text-warning-700 dark:text-warning-300',
    error: 'text-error-700 dark:text-error-300'
  };
  return colors[color] || 'text-slate-700 dark:text-slate-300';
}

/**
 * Get encouragement icon based on color
 */
function getEncouragementIcon(color) {
  const iconClass = color === 'success' ? 'text-success-600 dark:text-success-400' :
                   color === 'warning' ? 'text-warning-600 dark:text-warning-400' :
                   color === 'error' ? 'text-error-600 dark:text-error-400' : 'text-neutral-600 dark:text-neutral-400';

  const Icon = color === 'success' ? CheckCircle :
               color === 'warning' ? AlertTriangle :
               color === 'error' ? AlertCircle : Heart;

  return <Icon size={24} className={iconClass} />;
}

export default BurnoutResultFeedback;
