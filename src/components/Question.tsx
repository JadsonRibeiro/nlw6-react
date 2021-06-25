import { ReactNode } from "react";
import "../styles/question.scss";

type QuestionProps = {
    content: string;
    author: {
        name: string;
        avatar: string;
    }
    children: ReactNode,
    isHighlighted?: boolean;
    answer: string;
}

export function Question({ 
    content, 
    author, 
    children,
    answer,
    isHighlighted = false 
}: QuestionProps) {
    return (
        <div className={ `question ${answer ? 'answered' : ''} ${isHighlighted ? 'highlighted' : '' }`}>
            <p>{content}</p>
            <footer>
                <div className="user-info">
                    <img src={author.avatar} alt={author.name} />
                    <span>{author.name}</span>
                </div>
                <div>
                    {children}
                </div>
            </footer>
            {answer && (
                <div className="answer">
                    <strong>Resposta: </strong><span>{answer}</span>
                </div>
            )}
        </div>
    )
}