export default {
  async fetch(request, env, ctx) {
    // Serve compiled Eleventy assets from the ASSETS binding
    return env.ASSETS.fetch(request);
  }
};
