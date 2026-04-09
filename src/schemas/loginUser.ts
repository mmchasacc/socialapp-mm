export const loginSchema = {
  body: {
    type: "object",
    required: ["username", "password"],
    properties: {
      username: {
        type: "string",
        minLength: 3,
        maxLength: 30,
      },
      password: {
        type: "string",
        minLength: 8,
      },
    },
    additionalProperties: false,
  },
};
