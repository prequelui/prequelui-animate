export default {
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    globals: true,
    reporters: "default",
  },
};
