/* eslint-disable */
export default async () => {
  const t = {};
  return {
    "@nestjs/swagger": {
      models: [
        [
          import("./routes/auth/auth.dto"),
          {
            LoginDto: {
              password: { required: true, type: () => String },
              username: { required: true, type: () => String },
            },
            RegisterDto: {
              displayName: { required: true, type: () => String },
              email: { required: true, type: () => String },
              password: { required: true, type: () => String },
            },
          },
        ],
        [
          import("./routes/users/users.dto"),
          {
            CreateUserDto: {
              displayName: { required: true, type: () => String },
              email: { required: true, type: () => String },
              password: { required: true, type: () => String },
              username: { required: true, type: () => String },
            },
            UpdateUserDto: {},
          },
        ],
        [
          import("./routes/categories/categories.dto"),
          {
            CreateCategoryDto: {
              description: { required: true, type: () => String },
              title: { required: true, type: () => String },
            },
            UpdateCategoryDto: {},
          },
        ],
        [
          import("./routes/posts/posts.dto"),
          {
            CreatePostDto: {
              categoryId: { required: true, type: () => String },
              description: { required: true, type: () => String },
              status: { required: true, type: () => Object },
              title: { required: true, type: () => String },
            },
            UpdatePostDto: {},
          },
        ],
        [
          import("./routes/squads/squads.dto"),
          {
            CreateSquadDto: {
              description: { required: true, type: () => String },
              name: { required: true, type: () => String },
              order: { required: true, type: () => Number },
            },
            UpdateSquadDto: {},
          },
        ],
      ],
      controllers: [
        [
          import("./routes/auth/auth.controller"),
          { AuthController: { getMe: {}, login: {}, register: {} } },
        ],
        [
          import("./routes/users/users.controller"),
          {
            UsersController: {
              create: {},
              findAll: {},
              findOne: {},
              remove: {},
              update: {},
            },
          },
        ],
        [import("./app/app.controller"), { AppController: { index: {} } }],
        [
          import("./routes/categories/categories.controller"),
          {
            CategoriesController: {
              create: {},
              findAll: { type: [Object] },
              findOne: {},
              remove: { type: Boolean },
              update: {},
            },
          },
        ],
        [
          import("./routes/posts/posts.controller"),
          {
            PostsController: {
              create: {},
              findAll: {},
              findOne: {},
              remove: { type: Boolean },
              update: {},
              updateCover: {},
              updateFile: {},
            },
          },
        ],
        [
          import("./routes/squads/squads.controller"),
          {
            SquadController: {
              create: {},
              findAll: { type: [Object] },
              findOne: { type: Object },
              remove: { type: Boolean },
              update: {},
              updateUsers: { type: Object },
            },
          },
        ],
        [
          import("./routes/files/files.controller"),
          { FilesController: { findOne: {} } },
        ],
      ],
    },
  };
};
