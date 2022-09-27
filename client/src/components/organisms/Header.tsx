import { AppBar, Drawer, Stack, Toolbar } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import logo from "@/assets/logo.png";
import Link from "../atoms/Link";
import UserHopup from "../molecules/UserHopup";
import { useState } from "react";
import Sidebar from "./Sidebar";
import { HEADER_HEIGHT } from "@/settings/appconfig";
import Button from "../atoms/Button";

interface HeaderProps {
  showMenu?: boolean;
  useDarkColorScheme?: boolean;
}

function Header({ showMenu, useDarkColorScheme }: HeaderProps) {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <AppBar position="static" variant="softoutline">
      <Toolbar
        sx={{
          justifyContent: "space-between",
          height: HEADER_HEIGHT,
          pl: 0,
          "& img": {
            maxHeight: 36,
          },
        }}
      >
        {showMenu && (
          <>
            <Button
              onClick={() => setShowSidebar(!showSidebar)}
              sx={{
                color: "inherit",
                height: HEADER_HEIGHT,
                width: HEADER_HEIGHT,
                borderRadius: 0,
                flexDirection: "column",
                "& .MuiButton-startIcon": {
                  m: 0,
                },
              }}
              startIcon={<MenuIcon />}
            >
              MENU
            </Button>
            <Drawer
              anchor="left"
              open={showSidebar}
              PaperProps={{
                sx: { overflow: "visible", bgcolor: useDarkColorScheme ? "common.black" : "common.white" },
              }}
            >
              <Sidebar
                closeFn={() => setShowSidebar(false)}
                useDarkColorScheme={useDarkColorScheme}
              />
            </Drawer>
          </>
        )}
        <Stack alignItems="center" flex={1}>
          <Link to="/home" flex={1} width="fit-content">
            <img src={logo} alt="logo" />
          </Link>
        </Stack>
        <UserHopup />
      </Toolbar>
    </AppBar>
  );
}

export default Header;
