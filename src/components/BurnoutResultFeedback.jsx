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
          <li key={`li-${index}`} className="ml-4">
            {processBold(line.trim().substring(2))}
          </li>
        );
      }
      // Numbered lists
      else if (/^\d+\./.test(line.trim())) {
        const text = line.trim().replace(/^\d+\.\s*/, '');
        listItems.push(
          <li key={`li-${index}`} className="ml-4">
            {processBold(text)}
          </li>
        );
      }
      // Regular paragraph
      else {
        // Flush list items if any
        if (listItems.length > 0) {
          elements.push(
            <ul key={`ul-${index}`} className="list-disc pl-5 mb-3">
              {listItems}
            </ul>
          );
          listItems = [];
        }

        if (line.trim()) {
          elements.push(
            <p key={`p-${index}`} className="mb-3">
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
      <div className="text-center mb-8 pb-6 border-b border-neutral-200">
        <div className="text-sm text-text-tertiary mb-2">您的倦怠分數</div>
        <div className={`text-6xl font-bold mb-3 ${getScoreColor(feedback.color)}`}>
          {formatScore(score, questionnaire)}
        </div>
        <div className={`inline-block px-4 py-2 rounded-full text-lg font-medium ${getBadgeColor(feedback.color)}`}>
          {feedback.level}
        </div>
        <p className="mt-4 text-lg text-text-secondary">{feedback.description}</p>
      </div>

      {/* Dynamic Advice Sections */}
      {feedback.adviceList && feedback.adviceList.length > 0 && (
        <div className="space-y-6 mb-8">
          <h3 className="text-2xl font-semibold text-text-primary flex items-center gap-2">
            <Info size={24} className="text-primary-600" />
            個人化建議
          </h3>
          {feedback.adviceList.map((advice, index) => (
            <div
              key={index}
              className="bg-neutral-50 border-l-4 border-primary-500 p-6 rounded-r-lg"
            >
              <h4 className="text-xl font-semibold mb-3">{advice.title}</h4>
              <div className="text-text-secondary">
                <MarkdownText>{advice.content}</MarkdownText>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Encouragement Section */}
      {feedback.encouragement && (
        <div className={`p-6 rounded-lg ${getEncouragementBgColor(feedback.color)}`}>
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
    success: 'text-success-600',
    warning: 'text-warning-600',
    error: 'text-error-600'
  };
  return colors[color] || 'text-neutral-600';
}

/**
 * Get badge color classes
 */
function getBadgeColor(color) {
  const colors = {
    success: 'bg-success-100 text-success-700',
    warning: 'bg-warning-100 text-warning-700',
    error: 'bg-error-100 text-error-700'
  };
  return colors[color] || 'bg-neutral-100 text-neutral-700';
}

/**
 * Get encouragement section background color
 */
function getEncouragementBgColor(color) {
  const colors = {
    success: 'bg-success-50 border border-success-200',
    warning: 'bg-warning-50 border border-warning-200',
    error: 'bg-error-50 border border-error-200'
  };
  return colors[color] || 'bg-neutral-50 border border-neutral-200';
}

/**
 * Get encouragement icon based on color
 */
function getEncouragementIcon(color) {
  const iconClass = color === 'success' ? 'text-success-600' :
                   color === 'warning' ? 'text-warning-600' :
                   color === 'error' ? 'text-error-600' : 'text-neutral-600';

  const Icon = color === 'success' ? CheckCircle :
               color === 'warning' ? AlertTriangle :
               color === 'error' ? AlertCircle : Heart;

  return <Icon size={24} className={iconClass} />;
}

export default BurnoutResultFeedback;
