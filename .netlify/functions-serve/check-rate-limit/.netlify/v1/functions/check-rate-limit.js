"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// .netlify/v1/functions/check-rate-limit.js
var check_rate_limit_exports = {};
__export(check_rate_limit_exports, {
  handler: () => handler
});
module.exports = __toCommonJS(check_rate_limit_exports);
async function handler(event) {
  try {
    let userId;
    try {
      userId = JSON.parse(event.body)?.userId;
    } catch {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid request body" })
      };
    }
    if (!userId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "User ID required" })
      };
    }
    const submissions = global.submissions || /* @__PURE__ */ new Map();
    global.submissions = submissions;
    const now = Date.now();
    const oneMinute = 60 * 1e3;
    let userSubmissions = submissions.get(userId) || [];
    userSubmissions = userSubmissions.filter((ts) => now - ts < oneMinute);
    userSubmissions.push(now);
    submissions.set(userId, userSubmissions);
    const count = userSubmissions.length;
    if (count > 10) {
      return {
        statusCode: 429,
        body: JSON.stringify({
          blocked: true,
          limited: true,
          message: "Too many submissions. Temporarily banned."
        })
      };
    }
    if (count > 5) {
      return {
        statusCode: 429,
        body: JSON.stringify({
          blocked: false,
          limited: true,
          message: "Warning: Slow down, nearing submission limit."
        })
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify({
        blocked: false,
        limited: false,
        message: "OK"
      })
    };
  } catch (error) {
    console.error("Rate limit error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error" })
    };
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
//# sourceMappingURL=check-rate-limit.js.map
