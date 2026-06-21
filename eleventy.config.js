const yaml = require("js-yaml");

module.exports = function(eleventyConfig) {
  // Support YAML data files
  eleventyConfig.addDataExtension("yaml,yml", (contents) => {
    return yaml.load(contents);
  });

  // Support CSV data files (e.g. schedule.csv)
  eleventyConfig.addDataExtension("csv", (contents) => {
    const lines = contents.split(/\r?\n/);
    const result = [];
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.toLowerCase().startsWith("day")) {
        continue;
      }
      const parts = trimmed.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
      const dayVal = parts[0].trim().replace(/^"|"$/g, '');
      const sessions = [];
      for (let i = 1; i < parts.length; i++) {
        sessions.push({
          slot: i,
          talk: parts[i].trim().replace(/^"|"$/g, '')
        });
      }
      result.push({
        day: dayVal,
        sessions: sessions
      });
    }
    return result;
  });

  // Copy static assets
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("images");

  return {
    dir: {
      input: ".",
      includes: "_includes",
      data: "_data",
      output: "_site"
    }
  };
};
