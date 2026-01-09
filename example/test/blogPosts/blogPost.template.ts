import { defineCopyTemplate } from "@villedemontreal/concurrent-api-tests";
import { BlogPost } from "../shared/apiUnderTest/generated/api";

export const copyBlogPostTemplate = defineCopyTemplate<BlogPost>({
  id: "",
  title: "titleDefault",
  content: "contentDefault",
  keywords: [],
  likeCount: 0,
  commentCount: 0,
  authorId: "authorIdDefault",
});
