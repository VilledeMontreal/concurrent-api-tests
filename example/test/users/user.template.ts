import { defineCopyTemplate } from "@villedemontreal/concurrent-api-tests";
import { User } from "../shared/apiUnderTest/generated/api";

export const copyUserTemplate = defineCopyTemplate<User>({
  id: null as any,
  role: "roleDefault",
  fullName: "fullNameDefault",
  email: "emailDefault@example.com",
});
