import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import {prism} from "react-syntax-highlighter/dist/esm/styles/prism";

interface Props {
    content: string;
}

export const MarkdownRenderer = ({ content }: Props) => {
    return (
        <div className="max-w-none text-[var(--van-dyke)] pt-4 px-2">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    table: ({ children }) => (
                        <table className="border-collapse border border-[var(--van-dyke)]">
                            {children}
                        </table>
                    ),
                    th: ({ children }) => (
                        <th className="border border-[var(--van-dyke)] px-3 py-2 bg-[var(--isabelline)]">
                            {children}
                        </th>
                    ),
                    td: ({ children }) => (
                        <td className="border border-[var(--van-dyke)] px-3 py-2">
                            {children}
                        </td>
                    ),
                    h1: ({ children }) => (
                        <h1 className="text-2xl font-bold mb-4">{children}</h1>
                    ),
                    h2: ({ children }) => (
                        <h2 className="text-xl font-bold mb-3">{children}</h2>
                    ),
                    h3: ({ children }) => (
                        <h3 className="text-lg font-semibold mb2">{children}</h3>
                    ),
                    code({ className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '');

                        return match ? (
                            <SyntaxHighlighter
                                style={prism}  /*gruvboxLight*/
                                language={match[1]}
                                PreTag="div"
                                customStyle={{
                                    background: 'var(--isabelline)',
                                    borderRadius: '6px',
                                }}
                            >
                                {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                        ) : (
                            <code className={className} {...props}>
                                {children}
                            </code>
                        );
                    },
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
};