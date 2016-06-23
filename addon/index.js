var pageMod = require("sdk/page-mod");
var self = require("sdk/self");
pageMod.PageMod({
  include: "https://trello.com/*",
  contentScriptFile: [self.data.url("secret.js"), self.data.url("scr.js")]
});
