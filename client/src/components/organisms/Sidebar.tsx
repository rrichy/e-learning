import { MembershipType } from "@/enums/membershipTypes";
import useAuth from "@/hooks/useAuth";
import { HEADER_HEIGHT } from "@/settings/appconfig";
import { AssignmentOutlined, Close, ExpandMore } from "@mui/icons-material";
import {
  Box,
  Collapse,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import React, { useMemo, useState } from "react";
import { Link as RouterLink, To } from "react-router-dom";
import Button from "../atoms/Button";
import {
  AnnouncementIcon,
  CategoryIcon,
  CourseManagementIcon,
  DepartmentIcon,
  InquiryIcon,
  LectureIcon,
  TemplateIcon,
  UserIcon,
} from "../atoms/Icons";
import Link from "../atoms/Link";

const { admin, corporate, individual, trial, guest } = MembershipType;

function Sidebar({
  closeFn,
  useDarkColorScheme,
}: {
  closeFn?: () => void;
  useDarkColorScheme?: boolean;
}) {
  const { userCount, categories, authData } = useAuth();

  const CountContent = () => {
    switch (authData?.membership_type_id) {
      case admin:
        return (
          <>
            <ListItem>
              <ListItemText
                primary="法人アカウント数"
                secondary={userCount?.corporate ? userCount?.corporate + "人" : "0人"}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="個人アカウント数"
                secondary={userCount?.individual ? userCount?.individual + "人" : "0人"}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="トライアルアカウント数"
                secondary={userCount?.trial ? userCount?.trial + "人" : "0人"}
              />
            </ListItem>
          </>
        );
      case corporate:
        return (
          <ListItem>
            <ListItemText
              primary="アカウント数"
              secondary={userCount?.individual ? userCount?.individual + "人" : "0人"}
            />
          </ListItem>
        );
      case individual:
        return (
          <>
            <ListItem>
              <ListItemIcon>
                <CourseManagementIcon sx={{ color: "common.black" }} />
              </ListItemIcon>
              <ListItemText primary="コース一覧" />
            </ListItem>
            {categories?.map(({ id, name, courses }) => (
              <SidebarCategory
                key={id}
                name={name}
                courses={courses}
                onClick={closeFn}
                defaultOpen
              />
            ))}
          </>
        );
      default:
        return null;
    }
  };

  const sidebarContent = useMemo(() => {
    switch (authData?.membership_type_id) {
      case admin:
        return adminSidebarContent;
      case corporate:
        return corporateSidebarContent;
      case individual:
        return individualSidebarContent;
      default:
        return [];
    }
  }, [authData?.membership_type_id]);

  return (
    <Box
      bgcolor={useDarkColorScheme ? "common.black" : "common.white"}
      width={240}
      flex="0 0 240px"
      position="relative"
      overflow="visible"
      sx={{
        "& .MuiListItemIcon-root": {
          minWidth: "fit-content",
          mr: 1,
        },
      }}
    >
      <List
        dense
        sx={{
          bgcolor: useDarkColorScheme ? "common.gray" : "common.white",
          color: useDarkColorScheme ? "common.white" : "common.black",
          "& .MuiListItemText-root": {
            display: "flex",
            justifyContent: "space-between",
            "& .MuiListItemText-primary": {
              fontSize: 13,
              fontWeight: "bold",
            },
            "& .MuiListItemText-secondary": {
              fontSize: 14,
              color: "primary.main",
            },
          },
        }}
      >
        <CountContent />
      </List>
      <List
        disablePadding
        sx={{
          "& .MuiDivider-root": {
            borderColor: useDarkColorScheme ? "common.menuhover" : undefined,
          },
          "& .MuiListItemButton-root": {
            color: useDarkColorScheme ? "common.white" : "common.black",
            transition: "all 0.2s",
            height: 52,
            "& svg": {
              color: useDarkColorScheme ? "common.white" : "common.black",
            },
            "& .MuiTypography-root": {
              fontWeight: "bold",
              fontSize: 14,
            },
            "&:hover": {
              bgcolor: useDarkColorScheme ? "common.menuhover" : undefined,
            },
          },
        }}
        onClick={closeFn}
      >
        <Divider />
        {sidebarContent.map((props, index) => (
          <SidebarItem {...props} key={"sidebar-item" + index} />
        ))}
      </List>
      {closeFn && (
        <Button
          onClick={closeFn}
          sx={{
            position: "absolute",
            top: 0,
            left: 240,
            bgcolor: "common.white",
            height: HEADER_HEIGHT,
            width: HEADER_HEIGHT,
            borderRadius: 0,
            flexDirection: "column",
            color: "common.black",
            "& .MuiButton-startIcon": {
              m: 0,
            },
            "&:hover": {
              bgcolor: "common.white",
            },
          }}
          startIcon={<Close />}
        >
          MENU
        </Button>
      )}
    </Box>
  );
}

export default Sidebar;

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  to?: To;
}

const adminSidebarContent: SidebarItemProps[] = [
  {
    icon: <CourseManagementIcon />,
    label: "コース管理",
    to: "/course-management",
  },
  // {
  //   icon: <LectureIcon />,
  //   label: "受講履歴",
  //   to: "/home",
  // },
  {
    icon: <UserIcon />,
    label: "アカウント管理",
    to: "/account-management",
  },
  {
    icon: <DepartmentIcon />,
    label: "所属・部署管理",
    to: "/affiliations-departments-management",
  },
  {
    icon: <CategoryIcon />,
    label: "カテゴリー管理",
    to: "/category-management",
  },
  {
    icon: <AnnouncementIcon />,
    label: "お知らせ管理",
    to: "/notice-management",
  },
  {
    icon: <AssignmentOutlined />,
    label: "署名管理",
    to: "/signature-management",
  },
  {
    icon: <TemplateIcon />,
    label: "メールテンプレート管理",
    to: "/organize-mail-management",
  },
  {
    icon: <InquiryIcon />,
    label: "お問い合わせ管理",
    to: "/inquiries",
  },
];

const corporateSidebarContent: SidebarItemProps[] = [
  // {
  //   icon: <CourseManagementIcon />,
  //   label: "コース管理",
  //   to: "/course-management",
  // },
  {
    icon: <UserIcon />,
    label: "アカウント管理",
    to: "/account-management",
  },
  {
    icon: <DepartmentIcon />,
    label: "部署管理",
    to: "/departments-management",
  },
  {
    icon: <CategoryIcon />,
    label: "カテゴリー管理",
    to: "/category-management",
  },
  {
    icon: <AnnouncementIcon />,
    label: "お知らせ管理",
    to: "/notice-management",
  },
  {
    icon: <TemplateIcon />,
    label: "メールテンプレート管理",
    to: "/organize-mail-management",
  },
  {
    icon: <InquiryIcon />,
    label: "お問い合わせ管理",
    to: "/inquiries",
  },
];

const individualSidebarContent: SidebarItemProps[] = [
  // {
  //   icon: <LectureIcon />,
  //   label: "受講履歴",
  //   to: "/home",
  // },
  {
    icon: <UserIcon />,
    label: "マイページ",
    to: "/my-page",
  },
  {
    icon: <AnnouncementIcon />,
    label: "お知らせ",
    to: "/home#notice",
  },
  // {
  //   icon: <InquiryIcon />,
  //   label: "お問い合わせ",
  //   to: "/home",
  // },
];

const SidebarItem = ({ icon, label, to = "/home" }: SidebarItemProps) => {
  return (
    <>
      <ListItemButton component={RouterLink} to={to}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={label} />
      </ListItemButton>
      <Divider />
    </>
  );
};

const SidebarCategory = ({
  name,
  courses,
  defaultOpen,
  onClick,
}: {
  name: string;
  courses: { id: number; title: string }[];
  defaultOpen?: boolean;
  onClick?: () => void;
}) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <>
      <ListItemButton onClick={() => setOpen(!open)}>
        <ListItemIcon>
          <ExpandMore
            color="primary"
            sx={{
              transition: "transform 200ms",
              transform: open ? "rotate(180deg)" : undefined,
            }}
          />
        </ListItemIcon>
        <ListItemText primary={name} />
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        {courses.map(({ id, title }) => (
          <Link
            key={"course-" + id}
            to={"/course/" + id}
            variant="caption"
            color="secondary"
            underline="hover"
            ml={4}
            onClick={onClick}
            sx={{
              position: "relative",
              display: "block",
              "&:before": {
                content: "''",
                top: 6,
                left: -8,
                position: "absolute",
                bgcolor: "#999999",
                height: 4,
                width: 4,
                borderRadius: 8,
              },
            }}
          >
            {title}
          </Link>
        ))}
      </Collapse>
    </>
  );
};
