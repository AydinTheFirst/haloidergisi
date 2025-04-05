/* eslint-disable */
export default async () => {
    const t = {};
    return { "@nestjs/swagger": { "models": [[import("./routes/auth/auth.dto"), { "LoginDto": { password: { required: true, type: () => String }, username: { required: true, type: () => String } }, "RegisterDto": { displayName: { required: true, type: () => String }, email: { required: true, type: () => String }, password: { required: true, type: () => String } } }], [import("./routes/users/users.dto"), { "CreateUserDto": { bio: { required: true, type: () => String }, displayName: { required: true, type: () => String }, email: { required: true, type: () => String }, password: { required: true, type: () => String }, squadId: { required: true, type: () => String }, title: { required: true, type: () => String }, username: { required: true, type: () => String }, website: { required: true, type: () => String } }, "UpdateUserDto": { roles: { required: true, type: () => [Object] } }, "UpdateUserSelfDto": {}, "UpdateUserSelf": { avatar: { required: true, type: () => String }, bio: { required: true, type: () => String }, displayName: { required: true, type: () => String }, title: { required: true, type: () => String }, username: { required: true, type: () => String }, website: { required: true, type: () => String } } }], [import("./routes/categories/categories.dto"), { "CreateCategoryDto": { description: { required: true, type: () => String }, title: { required: true, type: () => String } }, "UpdateCategoryDto": {} }], [import("./routes/posts/posts.dto"), { "CreatePostDto": { categoryId: { required: true, type: () => String }, cover: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, description: { required: true, type: () => String }, file: { required: true, type: () => String }, status: { required: true, type: () => Object }, title: { required: true, type: () => String } }, "UpdatePostDto": {} }], [import("./routes/squads/squads.dto"), { "CreateSquadDto": { description: { required: true, type: () => String }, name: { required: true, type: () => String }, order: { required: true, type: () => Number } }, "UpdateSquadDto": {} }], [import("./routes/news/news.dto"), { "CreateNewsDto": { description: { required: true, type: () => String }, title: { required: true, type: () => String } }, "UpdateNewsDto": {} }]], "controllers": [[import("./routes/auth/auth.controller"), { "AuthController": { "getMe": {}, "login": {}, "register": {} } }], [import("./routes/users/users.controller"), { "UsersController": { "create": {}, "findAll": {}, "findOne": {}, "remove": {}, "update": {}, "updateSelf": {} } }], [import("./app/app.controller"), { "AppController": { "index": {} } }], [import("./routes/categories/categories.controller"), { "CategoriesController": { "create": {}, "findAll": { type: [Object] }, "findOne": { type: Object }, "findPosts": {}, "remove": { type: Boolean }, "update": {} } }], [import("./routes/posts/posts.controller"), { "PostsController": { "create": {}, "findAll": {}, "findOne": {}, "remove": { type: Boolean }, "update": {}, "updateCover": {}, "updateFile": {} } }], [import("./routes/squads/squads.controller"), { "SquadController": { "create": {}, "findAll": { type: [Object] }, "findOne": { type: Object }, "remove": { type: Boolean }, "update": {}, "updateUsers": { type: Object } } }], [import("./routes/files/files.controller"), { "FilesController": { "findOne": {}, "create": { type: [String] }, "findAll": { type: [String] }, "remove": { type: Object } } }], [import("./routes/news/news.controller"), { "NewsController": { "create": {}, "findAll": {}, "findOne": {}, "remove": {}, "update": {} } }]] } };
};