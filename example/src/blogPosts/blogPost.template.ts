import {
  defineCopyTemplate,
  defineCopyTemplateVariation,
} from "@villedemontreal/mocha-concurrent-api-tests";
import { BlogPost } from "../shared/apiUnderTest/apiClient";

export const copyBlogPostTemplate = defineCopyTemplate<BlogPost>({
  // It's a good practice to use easy to recognize default values.
  // Ex: use the suffix Default for strings.
  title: "titleDefault",
  content: "contentDefault",
  keywords: [],
  likeCount: 0,
  commentCount: 0,

  // server side incremental id
  id: null,
  // Don't assume pre-existing state in the database
  authorId: null,
});

// Template variation can be created to avoid duplication when the same template is used in many test cases.
export const copyBlogPostWithEmptyContentTemplate =
  defineCopyTemplateVariation<BlogPost>(
    copyBlogPostTemplate,
    (x) => (x.content = ""),
  );
