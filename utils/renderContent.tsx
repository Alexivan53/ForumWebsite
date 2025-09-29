import React from 'react';

/**
 * Renders text with basic Markdown-like formatting for bold, italics, and @mentions.
 * - **bold text** or __bold text__ becomes <strong>
 * - *italic text* or _italic text_ becomes <em>
 * - @username becomes a highlighted <strong> element
 * @param text The input string to format.
 * @returns A React node with formatted content.
 */
export const renderFormattedContent = (text: string): React.ReactNode => {
    // Regex to find all formatting tokens.
    // Group 2: content of **bold**
    // Group 4: content of __bold__
    // Group 6: content of *italic*
    // Group 8: content of _italic_
    // Group 9: @mention
    const regex = /(\*\*(.*?)\*\*)|(__(.*?)__)|(\*(.*?)\*)|(_(.*?)_)|(@\w+)/g;
    
    if (!text) {
        return text;
    }

    const elements: (string | React.ReactElement)[] = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
        const startIndex = match.index;
        const matchedText = match[0];

        // Add the plain text before the match
        if (startIndex > lastIndex) {
            elements.push(text.substring(lastIndex, startIndex));
        }

        const key = startIndex;
        if (match[2] !== undefined) { // **bold**
            elements.push(<strong key={key}>{match[2]}</strong>);
        } else if (match[4] !== undefined) { // __bold__
            elements.push(<strong key={key}>{match[4]}</strong>);
        } else if (match[6] !== undefined) { // *italic*
            elements.push(<em key={key}>{match[6]}</em>);
        } else if (match[8] !== undefined) { // _italic_
            elements.push(<em key={key}>{match[8]}</em>);
        } else if (match[9]) { // @mention
            elements.push(
                <strong key={key} className="text-indigo-500 font-semibold">
                    {match[9]}
                </strong>
            );
        }

        lastIndex = startIndex + matchedText.length;
    }

    // Add any remaining plain text after the last match
    if (lastIndex < text.length) {
        elements.push(text.substring(lastIndex));
    }
    
    // If no matches were found, just return the original text
    if (elements.length === 0) {
        return text;
    }

    return <>{elements}</>;
};
