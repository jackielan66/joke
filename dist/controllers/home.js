"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * GET /
 * Home page.
 */
exports.index = (req, res) => {
    res.render("uc/index", {
        title: "首页"
    });
};
//# sourceMappingURL=home.js.map