import React from "react";

interface HtmlAnswerBoxProps {
  html: string;
}

const HtmlAnswerBox: React.FC<HtmlAnswerBoxProps> = ({ html }) => {
  return (
    <div
      className="prose max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default HtmlAnswerBox;
