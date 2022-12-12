import { MembershipType } from "@/enums/membershipTypes";
import useAlerter from "@/hooks/useAlerter";
import useAuth from "@/hooks/useAuth";
import { userInit } from "@/interfaces/AuthAttributes";
import { post } from "@/services/ApiService";
import {
  Avatar,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  UserIcon,
  LogoutIcon,
  ChangePlanIcon,
  InquiryIcon,
} from "../atoms/Icons";

function UserHopup() {
  const queryClient = useQueryClient();
  const { isAuthenticated, setUnauthorized, authData } = useAuth();
  const { errorSnackbar, successSnackbar } = useAlerter();
  const navigate = useNavigate();

  const { mutate } = useMutation(() => post("/api/logout"), {
    onSuccess: (res: any) => successSnackbar(res.data.message),
    onError: (e: any) => errorSnackbar(e.message),
    onSettled: () => {
      setUnauthorized();
      navigate("/login");
      queryClient.clear();
    },
  });

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const user = useMemo(() => authData || userInit, [authData]);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
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
          <Avatar src={user.image || undefined}>{user.name}</Avatar>
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
        <MenuItem component={Link} to="/profile">
          <UserIcon />
          アカウントを編集
        </MenuItem>
        <Divider />
        {/* <MenuItem component={Link} to="/change-plan">
          <ChangePlanIcon />
          受講履歴
        </MenuItem>
        <Divider /> */}
        {user.membership_type_id !== MembershipType.admin && (
          <MenuItem component={Link} to="/send-inquiry">
            <InquiryIcon />
            お問い合わせ
          </MenuItem>
        )}
        {user.membership_type_id !== MembershipType.admin && <Divider />}
        <MenuItem onClick={() => mutate()}>
          <LogoutIcon />
          ログアウト
        </MenuItem>
      </Menu>
    </div>
  );
}

export default UserHopup;
