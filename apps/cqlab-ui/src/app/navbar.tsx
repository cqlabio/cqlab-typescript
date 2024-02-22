import { useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Menu from '@mui/material/Menu';
// import MenuItem from '@mui/material/MenuItem';
import { Navigate, NavLink, useLocation, useNavigate } from 'react-router-dom';
import SettingsIcon from '@mui/icons-material/Settings';
// import { clearWebToken } from '../data/local-storage';

const navItems = [
  {
    name: 'Flow',
    url: '/flow',
  },
  // {
  //   name: 'Calculator',
  //   url: '/calculator',
  // },
  {
    name: 'Define',
    url: '/define',
  },
  {
    name: 'Vocabulary',
    url: '/vocabulary',
  },
  {
    name: 'MockData',
    url: '/mock-data',
  },
];

type NavBarProps = {
  skipNav?: boolean;
};

export function NavBar({ skipNav }: NavBarProps) {
  // const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClickMenu = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // const onLogout = () => {
  //   clearWebToken();
  //   navigate('/login');
  // };

  return (
    <Paper
      square
      sx={{
        // height: '30px',
        // background: '#FFFAEA',
        // color: '#5E4A06',
        // color: "secondary.main",
        // padding: '12px 15px',
        borderBottom: '1px solid rgba(230,230,230,0.7)',
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'space-between',
        background: 'white',
      }}
    >
      <Box sx={{ display: 'flex', padding: '11px 15px', alignItems: 'center' }}>
        <NavLink
          to="/"
          style={{
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              fontSize: '20px',
              fontFamily: 'Red Hat Display',
              fontWeight: 400,
            }}
          >
            <Box
              component="span"
              sx={{
                color: 'secondary.main',
                position: 'relative',
                left: '2px',
              }}
            >
              C
            </Box>
            <Box component="span" sx={{ color: 'secondary.main' }}>
              Q
            </Box>

            <span style={{ color: 'rgb(30,30,30)' }}>Lab -</span>
          </Box>
          <Box
            sx={{
              marginLeft: '5px',
              // color: '#866E1E'
              color: 'rgb(100,100,100)',
              fontSize: '12px',
              textTransform: 'uppercase',
            }}
          >
            Dev Environment
          </Box>
        </NavLink>
      </Box>
      {!skipNav && (
        <Box sx={{ display: 'flex' }}>
          <Box sx={{ display: 'flex' }}>
            <Box
              sx={{
                // marginRight: '20px',
                textTransform: 'uppercase',
                color: 'rgb(100,100,100)',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                // fontWeight: 'bold',
              }}
            >
              Applications:
            </Box>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-evenly',
                minWidth: '430px',
              }}
            >
              {navItems.map((navItem, index) => {
                const isSelected = location.pathname.startsWith(navItem.url);
                return (
                  <NavLink
                    key={navItem.name}
                    to={navItem.url}
                    style={{
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      borderBottom: isSelected
                        ? '2px solid #D12733'
                        : '2px solid white',
                      fontSize: '15px',
                    }}
                  >
                    <Box
                      sx={{
                        padding: '0 5px',
                        color: isSelected ? 'secondary.main' : 'rgb(20,20,20)',
                        fontFamily: 'Red Hat Display',

                        //  borderColor: 'rgb(180,180,180)',
                        //  borderColor: '#E57373',
                        //  boxShadow: 'inset 0px 0px 3px 0  #D12733'
                      }}
                    >
                      CQ
                      <Box
                        component="span"
                        sx={{ color: isSelected ? 'rgb(0,0,0)' : 'inherit' }}
                      >
                        {navItem.name}
                      </Box>
                    </Box>
                  </NavLink>
                );
              })}
            </Box>
          </Box>
          <Box
            sx={{
              padding: '0 12px',
              borderLeft: '1px solid rgb(230,230,230)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-around',
            }}
          >
            <SettingsIcon
              onClick={handleClickMenu}
              sx={{
                color: 'rgb(60,60,60)',
                fontSize: '20px',
                cursor: 'pointer',
              }}
            />
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            ></Menu>
            {/* <MenuItem onClick={onLogout}>Logout</MenuItem> */}
          </Box>
        </Box>
      )}
    </Paper>
  );
}
