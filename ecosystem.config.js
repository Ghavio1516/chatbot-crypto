module.exports = {
  apps: [
    {
      name: "chatbot-crypto",
      script: "npm",
      args: "start",
      env: {
        PORT: 3102,
        NODE_ENV: "production"
      }
    }
  ]
};
