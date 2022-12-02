import { Stack } from "@mui/system";
import useAuth from "@/hooks/useAuth";
import { MembershipType } from "@/enums/membershipTypes";
import AffiliationTable from "./AffiliationTable";
import DepartmentTable from "./DepartmentTable";
import { useState } from "react";

function AffiliationsDepartments() {
  const { membershipTypeId } = useAuth();
  const [requestInvalidate, setRequestInvalidate] = useState(false);

  return (
    <Stack spacing={3}>
      {membershipTypeId === MembershipType.admin && (
        <AffiliationTable
          requestInvalidate={() => setRequestInvalidate(true)}
        />
      )}
      {membershipTypeId >= MembershipType.corporate && (
        <DepartmentTable
          {...{
            requestInvalidate,
            setRequestInvalidate: () => setRequestInvalidate(false),
          }}
        />
      )}
    </Stack>
  );
}

export default AffiliationsDepartments;
