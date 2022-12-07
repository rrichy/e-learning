import { MembershipType, MembershipTypeJp } from "@/enums/membershipTypes";
import { List, ListItem, Typography } from "@mui/material";

const { trial, individual, corporate, admin } = MembershipType;

function CSVWarnings() {
  return (
    <>
      <Typography variant="subtitle1" fontWeight="bold" alignSelf="flex-start">
        注意
      </Typography>
      <HeaderWarning
        header="email"
        warnings={[
          "Invalid email will result into record not being saved.",
          "Used email will result into record not being saved.",
        ]}
      />
      <HeaderWarning
        header="sex"
        warnings={["1 - 男", "2 - 女", "Invalid input will default into 1."]}
      />
      <HeaderWarning
        header="birthday"
        warnings={[
          "format: YYYY-MM-DD (ex. 1999-12-24)",
          "Failure to follow the format will result into record not being saved.",
        ]}
      />
      <HeaderWarning
        header="password"
        warnings={[
          "Minimum of 8 characters",
          "Maximum of 16 characters",
          "Should contain atleast 1 uppercase",
          "Should contain atleast 1 lowercase",
          "Should contain atleast 1 numeric",
          "Should contain atleast 1 special character (@$!%*?&.)",
          "Invalid password will result into record not being saved.",
        ]}
      />
      <HeaderWarning
        header="membership_type_id"
        warnings={[
          `${trial} - ${MembershipTypeJp[trial]}`,
          `${individual} - ${MembershipTypeJp[individual]}`,
          `${corporate} - ${MembershipTypeJp[corporate]}`,
          `${admin} - ${MembershipTypeJp[admin]}`,
          "Invalid input will default into 1.",
        ]}
      />
      <HeaderWarning
        header="affiliation_id"
        warnings={[
          `${MembershipTypeJp[individual]} and ${MembershipTypeJp[corporate]} should have an existing affiliation_id.`,
          `membership_type_id of ${MembershipTypeJp[individual]} and ${MembershipTypeJp[corporate]} will default to ${trial} if affiliation_id is invalid.`,
          `${MembershipTypeJp[trial]} and ${MembershipTypeJp[admin]} will have null affiliation_id regardless of the input.`,
        ]}
      />
      <HeaderWarning
        header="department_1"
        warnings={[
          `${MembershipTypeJp[trial]} and ${MembershipTypeJp[admin]} will have null department_1 regardless of the input.`,
          `department_1 will default to null if provided id does not exist or does not belong to the selected affiliation_id`,
        ]}
      />
      <HeaderWarning
        header="department_2"
        warnings={[
          `${MembershipTypeJp[trial]} and ${MembershipTypeJp[admin]} will have null department_2 regardless of the input.`,
          `department_2 will default to null if provided id does not exist or does not belong to the selected department_1`,
        ]}
      />
    </>
  );
}

export default CSVWarnings;

const HeaderWarning = ({
  header,
  warnings,
}: {
  header: string;
  warnings: string[];
}) => {
  return (
    <List
      disablePadding
      dense
      subheader={<Typography fontWeight="unset">{header}</Typography>}
      sx={{
        alignSelf: "flex-start",
        "& .MuiListItem-root": {
          fontSize: 9,
          py: 0,
          "&:before": {
            content: "'※'",
            pr: 1,
          },
        },
      }}
    >
      {warnings.map((warning, index) => (
        <ListItem key={`${warning}-${index}`}>
          <Typography variant="subtitle2" fontWeight="unset" fontStyle="italic">
            {warning}
          </Typography>
        </ListItem>
      ))}
    </List>
  );
};
