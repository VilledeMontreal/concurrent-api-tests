import { defineCopyTemplate } from "@villedemontreal/mocha-concurrent-api-tests";
import { User } from "../shared/apiUnderTest/apiClient";

export const copyUserTemplate = defineCopyTemplate<User>({
  role: "guest",
  // It's a good practice to use easy to recognize default values.
  // Ex: use the suffix Default for strings.
  fullName: "fullNameDefault",
  email: "emailDefault@gmail.com",
  // server side incremental id
  id: null,
});
