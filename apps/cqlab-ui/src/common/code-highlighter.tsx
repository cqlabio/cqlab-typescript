import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import Box from '@mui/material/Box';

type CodeHighlighterProps = {
  language: 'Typescript' | 'JSON';
  code: string;
};

export const CodeHighlighter = ({ language, code }: CodeHighlighterProps) => {
  // const codeString = '(num) => num + 1';
  return (
    <Box
      sx={{
        pre: {
          margin: 0,
        },
      }}
    >
      <SyntaxHighlighter language={language} style={docco}>
        {code}
      </SyntaxHighlighter>
    </Box>
  );
};
