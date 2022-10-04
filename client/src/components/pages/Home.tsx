import { MembershipType } from "@/enums/membershipTypes";
import useAuth from "@/hooks/useAuth";
import React from "react";
import { Link } from "react-router-dom";
import StudentHomepage from "./Student/StudentHomepage";

function Home() {
  const { membershipTypeId } = useAuth();

  if (membershipTypeId === MembershipType.individual) return <StudentHomepage />
  
  return <div>
      Home Page (Sidebar) <br /><br />
      ADMIN Links <br />
      <Link to='/course-management'>Course Management - コース管理</Link> <br />
      <Link to='/account-management'>Account - アカウント管理</Link> <br />
      <Link to='/affiliations-departments-management'>Affiliations Departments - 所属・部署管理</Link> <br />
      <Link to='/category-management'>Category - カテゴリー管理</Link> <br />
      <Link to='/notice-management'>Notice Management</Link> <br />
      <Link to='/signature-management'>Signature - 署名管理</Link> <br />
      <Link to='/organize-mail-management'>Organize Mail - メールテンプレート管理</Link> <br />
      <Link to='/contact'>Contact - お問い合わせ</Link> <br /><br />
      CORPORATE Links <br />
      <Link to='/course-management'>Course Management - コース管理</Link> <br />
      <Link to='/account-management'>Account - アカウント管理</Link> <br />
      <Link to='/affiliations-departments-management'>Affiliations Departments - 所属・部署管理</Link> <br />
      <Link to='/category-management'>Category - カテゴリー管理</Link> <br />
      <Link to='/notice-management'>Notice Management</Link> <br />
      <Link to='/organize-mail-management'>Organize Mail - メールテンプレート管理</Link> <br />
      <Link to='/contact'>Contact - お問い合わせ</Link> <br /><br />
      STUDENT/INDIVIUDAL Links <br />
      <Link to='/course'>Course list</Link> <br />
      <Link to='/course/course-history'>Course History</Link> <br />
      <Link to='/contact'>Contact - お問い合わせ</Link> <br />
      <Link to='/unsubscribe'>Unsubscribe</Link> <br /><br />
    </div>;
}

export default Home;
