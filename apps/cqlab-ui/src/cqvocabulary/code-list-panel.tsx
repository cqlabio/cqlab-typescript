import { useMemo } from 'react';
import Box from '@mui/material/Box';
import orderBy from 'lodash/orderBy';
import { Coding } from '../data/queries-flow-implementation';

interface CodeGroup {
  system: string;
  codes: Coding[];
}

function groupCodes(codes: Coding[]) {
  const codeGroups: Record<string, CodeGroup> = {};

  codes.forEach((code) => {
    if (!codeGroups[code.system]) {
      codeGroups[code.system] = {
        system: code.system,
        codes: [],
      };
    }

    codeGroups[code.system].codes.push(code);
  });

  return orderBy(Object.values(codeGroups), 'system');
}
type CodeListPanelProps = {
  codes: Coding[];
};

export function CodeListPanel({ codes }: CodeListPanelProps) {
  const codeGropus = useMemo(() => groupCodes(codes), [codes]);

  return (
    <Box>
      {codeGropus.map((codeGroup) => (
        <Box key={codeGroup.system} sx={{ fontSize: '15px' }}>
          <Box
            sx={{
              background: 'rgb(245,245,245)',
              padding: '7px 5px',

              color: 'rgb(70,70,70)',
              position: 'sticky',
              top: 0,
              borderBottom: '1px solid rgb(230,230,230)',
            }}
          >
            {codeGroup.system}
          </Box>
          <Box
            component="table"
            sx={{
              boder: 0,
            }}
          >
            {codeGroup.codes.map((code) => (
              <Box component="tr" key={code.code}>
                <Box
                  component="td"
                  sx={{
                    padding: '2px 7px',
                    color: 'secondary.main',
                    whiteSpace: 'nowrap',
                    verticalAlign: 'top',
                  }}
                >
                  {code.code}
                </Box>
                <Box
                  component="td"
                  sx={{ padding: '2px 0', verticalAlign: 'top' }}
                >
                  {code.display}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  );
}
