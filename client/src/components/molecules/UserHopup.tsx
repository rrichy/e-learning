import useAlerter from "@/hooks/useAlerter";
import useAuth from "@/hooks/useAuth";
import { userInit } from "@/interfaces/AuthAttributes";
import { logout } from "@/services/AuthService";
import {
  Avatar,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  UserIcon,
  LogoutIcon,
  ChangePlanIcon,
  InquiryIcon,
} from "../atoms/Icons";

function UserHopup() {
  const { isAuthenticated, setUnauthorized, authData } = useAuth();
  const { errorSnackbar, successSnackbar } = useAlerter();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const user = useMemo(() => authData || userInit, [authData]);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      const res = await logout();
      successSnackbar(res.data.message);
    } catch (e: any) {
      errorSnackbar(e.message);
    } finally {
      setUnauthorized();
      navigate("/login");
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div>
      <IconButton
        size="large"
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleMenu}
        sx={{
          bgcolor: "common.black",
          transition: "all 0.2s",
          "&:hover": { bgcolor: "#999999" },
        }}
      >
        <UserIcon sx={{ color: "common.white" }} />
      </IconButton>
      <Menu
        onClick={handleClose}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        MenuListProps={{
          disablePadding: true,
        }}
        PaperProps={{
          sx: {
            bgcolor: "common.black",
            color: "common.white",
            width: 240,
            mt: 1,
            "& .MuiMenuItem-root": {
              p: "12px",
              fontSize: 13,
              transition: "all 0.2s",
              "&:hover": { bgcolor: "common.menuhover" },
            },
            "& hr": {
              borderColor: "#444444",
              m: "0 !important",
            },
            "& .MuiSvgIcon-root": {
              mr: 1,
            },
          },
        }}
      >
        <MenuItem onClick={(e) => e.stopPropagation()}>
          <Avatar>{user.name}</Avatar>
          <Stack
            justifyContent="center"
            ml={1}
            sx={{
              "& .MuiTypography-root": {
                fontSize: 14,
                "&:nth-of-type(1)": { color: "#00c2b2", fontWeight: "bold" },
              },
            }}
          >
            <Typography>{user.name}</Typography>
            <Typography>{user.email}</Typography>
          </Stack>
        </MenuItem>
        <Divider />
        <MenuItem component={Link} to="/my-page">
          <UserIcon />
          アカウントを編集
        </MenuItem>
        <Divider />
        {/* <MenuItem component={Link} to="/change-plan">
          <ChangePlanIcon />
          受講履歴
        </MenuItem> */}
        <Divider />
        <MenuItem component={Link} to="/contact">
          <InquiryIcon />
          お問い合わせ
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <LogoutIcon />
          ログアウト
        </MenuItem>
      </Menu>
    </div>
  );
}

export default UserHopup;
