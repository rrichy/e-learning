import { Stack } from "@mui/system";
import useAuth from "@/hooks/useAuth";
import { MembershipType } from "@/enums/membershipTypes";
import AffiliationTable from "./AffiliationTable";
import DepartmentTable from "./DepartmentTable";

function AffiliationsDepartments() {
  const { membershipTypeId } = useAuth();

  return (
    <Stack spacing={3}>
      {membershipTypeId === MembershipType.admin && <AffiliationTable />}
      {membershipTypeId >= MembershipType.corporate && <DepartmentTable />}
    </Stack>
  );
}

export default AffiliationsDepartments;
